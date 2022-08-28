import get from 'get-value';
import set from 'set-value';

const findIncluded = (included, id, type, mainRecord) => {
	if (mainRecord && id === mainRecord.id && type === mainRecord.type) {
		const output = {
			id: mainRecord.id,
			type: mainRecord.type,
		};
		if (Object.prototype.hasOwnProperty.call(mainRecord, 'attributes')) {
			output.attributes = mainRecord.attributes;
		}
		if (Object.prototype.hasOwnProperty.call(mainRecord, 'meta')) {
			output.meta = mainRecord.meta;
		}
		return output;
	}
	return included.find((data) => (data.id === id && data.type === type));
};

const deserializeSingle = (data, otherRows = [], included = [], mainRecord = null) => {
	if (!data) {
		return data;
	}
	const output = {
		id: data.id,
		type: data.type,
		...data.attributes,
	};

	if (Object.prototype.hasOwnProperty.call(data, 'relationships')) {
		let includedRecord;
		Object.keys(data.relationships).forEach((relationshipName) => {
			output[relationshipName] = data.relationships[relationshipName].data;
			if (Array.isArray(output[relationshipName])) {
				output[relationshipName].forEach((rel, i) => {
					includedRecord = findIncluded(included, rel.id, rel.type, mainRecord);
					if (includedRecord) {
						output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
					} else {
						includedRecord = findIncluded(otherRows, rel.id, rel.type, mainRecord);
						if (includedRecord) {
							output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
						}
					}
				});
			} else if (output[relationshipName] !== null) {
				includedRecord = findIncluded(included, output[relationshipName].id, output[relationshipName].type, mainRecord);
				if (includedRecord) {
					output[relationshipName] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
				} else {
					includedRecord = findIncluded(otherRows, output[relationshipName].id, output[relationshipName].type, mainRecord);
					if (includedRecord) {
						output[relationshipName] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
					}
				}
			}
		});
	}

	if (Object.prototype.hasOwnProperty.call(data, 'meta')) {
		output.meta = data.meta;
	}

	return output;
};

export const deserialize = (body) => {
	if (Array.isArray(body.data)) {
		const output = [];
		body.data.forEach((data) => {
			output.push(deserializeSingle(data, body.data, body.included, null));
		});
		return output;
	}
	return deserializeSingle(body.data, [], body.included, body.data);
};

const cleanSingleRelationship = (values) => ({
	id: values.id,
	type: values.type,
});

const cleanRelationship = (values) => {
	if (Array.isArray(values)) {
		return values.map((value) => cleanSingleRelationship(value));
	}
	return cleanSingleRelationship(values);
};

const getIncludedItemData = (rel, relName, childRelationshipNames, dirtyRelationships, relIndex = null) => {
	const relData = {
		id: rel.id,
		type: rel.type,
		attributes: {},
		relationships: {},
	};

	if (rel.id.startsWith('temp-')) {
		// This is a new record; include all attributes.
		Object.keys(rel).forEach((key) => {
			if (key !== 'id' && key !== 'type') {
				if (childRelationshipNames[relName].includes(key)) {
					const childRel = {
						data: {
							id: rel[key].id,
							type: rel[key].type,
						},
					};
					set(relData.relationships, key, childRel);
				} else {
					set(relData.attributes, key, rel[key]);
				}
			}
		});
	} else {
		// This is an existing record; include only the dirty attributes.
		Object.keys(rel).forEach((key) => {
			if (key !== 'id' && key !== 'type') {
				if (relIndex === null) {
					if (Object.prototype.hasOwnProperty.call(dirtyRelationships[relName], key)) {
						set(relData.attributes, key, rel[key]);
					}
				} else if (Object.prototype.hasOwnProperty.call(dirtyRelationships[relName], relIndex)) {
					if (Object.prototype.hasOwnProperty.call(dirtyRelationships[relName][relIndex], key)) {
						set(relData.attributes, key, rel[key]);
					}
				}
			}
		});
	}

	if (Object.keys(relData.relationships).length <= 0) {
		delete relData.relationships;
	}

	return relData;
};

const getIncluded = (data, dirtyKeys, relationshipNames) => {
	const included = [];

	const dirtyRelationships = {};
	dirtyKeys.forEach((key) => {
		const currentKeys = [];
		key.split('.').forEach((k) => {
			currentKeys.push(k);
			if (typeof get(dirtyRelationships, currentKeys.join('.')) === 'undefined') {
				set(dirtyRelationships, currentKeys.join('.'), {});
			}
		});
	});

	const childRelationshipNames = {};
	relationshipNames.forEach((relName) => {
		childRelationshipNames[relName] = [];
		if (relName.includes('.')) {
			const keys = relName.split('.');
			childRelationshipNames[keys.shift()].push(keys.join('.'));
		}
	});

	Object.keys(dirtyRelationships).forEach((relName) => {
		if (Object.prototype.hasOwnProperty.call(data.relationships, relName)) {
			let relData;
			if (Array.isArray(data.relationships[relName].data)) {
				Object.keys(data.relationships[relName].data).forEach((relIndex) => {
					const rel = data.relationships[relName].data[relIndex];
					relData = getIncludedItemData(rel, relName, childRelationshipNames, dirtyRelationships, relIndex);
					included.push(relData);
				});
			} else {
				relData = getIncludedItemData(data.relationships[relName].data, relName, childRelationshipNames, dirtyRelationships);
			}
		}
	});

	return included;
};

const unset = (obj, key) => {
	if (Object.prototype.hasOwnProperty.call(obj, key)) {
		return delete obj[key];
	}

	const keys = key.split('.');
	const lastKey = keys.pop();
	let o = obj;
	keys.forEach((k) => {
		o = o[k];
	});
	return delete o[lastKey];
};

export const getBody = (
	method,
	type,
	id,
	formState,
	dirtyKeys,
	relationshipNames,
	filterBody,
	filterValues
) => {
	let body = null;

	if (method === 'PUT' || method === 'POST') {
		// Initialize the basic body structure.
		const data = {
			type,
			attributes: {},
			relationships: {},
			meta: {},
		};
		if (method === 'PUT' && id) {
			data.id = id;
		}

		// Allow the app to modify values before they are sorted into sections.
		let values = { ...formState.row };
		if (filterValues) {
			values = filterValues(values);
		}

		// Get keys for file fields.
		const fileKeys = Object.keys(formState.files);

		// If this is an update request, only include keys for changed values.
		// Otherwise (this must be an add request), include keys for all values.
		const keys = method === 'PUT' ? dirtyKeys : Object.keys(formState.row);

		// Sort each value into the proper section.
		keys.forEach((key) => {
			const firstPartOfKey = key.replace(/\..+$/, '');
			if (relationshipNames.includes(firstPartOfKey)) {
				data.relationships[firstPartOfKey] = {
					data: get(values, firstPartOfKey),
				};
			} else if (relationshipNames.includes(key)) {
				data.relationships[key] = {
					data: get(values, firstPartOfKey),
				};
			} else if (key.startsWith('meta.')) {
				set(data, key, get(values, key));
			} else if (key === 'meta') {
				data.meta = values.meta;
			} else if (fileKeys.includes(key)) {
				unset(data.attributes, key);
			} else if (key !== '_new' && !key.startsWith('_new.')) {
				set(data.attributes, key, get(values, key));
			}
		});

		body = { data };

		const included = getIncluded(data, dirtyKeys, relationshipNames);
		if (included.length > 0) {
			body.included = included;
		}

		Object.keys(data.relationships).forEach((relationshipName) => {
			if (typeof data.relationships[relationshipName].data === 'string') {
				if (data.relationships[relationshipName].data === '') {
					data.relationships[relationshipName].data = null;
				} else {
					data.relationships[relationshipName].data = JSON.parse(data.relationships[relationshipName].data);
				}
			}
			if (data.relationships[relationshipName].data) {
				data.relationships[relationshipName].data = cleanRelationship(data.relationships[relationshipName].data);
			}
		});

		// Allow the app to modify values after they have been sorted into sections.
		if (filterBody) {
			body = filterBody(body, formState.row);
		}

		// Remove any sections with no values.
		if (Object.keys(data.attributes).length <= 0) {
			delete data.attributes;
		}
		if (Object.keys(data.meta).length <= 0) {
			delete data.meta;
		}
		if (Object.keys(data.relationships).length <= 0) {
			delete data.relationships;
		}

		// Handle file fields.
		const filenames = fileKeys.filter((filename) => (formState.files[filename] !== false));
		if (filenames.length > 0) {
			const formData = new FormData();
			formData.append('json', JSON.stringify(body));
			formData.append('files', JSON.stringify(filenames));

			filenames.forEach((filename) => {
				formData.append(filename, formState.files[filename]);
			});

			body = formData;
		} else {
			body = JSON.stringify(body);
		}
	}

	return body;
};
