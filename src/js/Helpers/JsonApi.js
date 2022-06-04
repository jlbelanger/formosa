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

const getIncluded = (data, dirtyIncluded, relationshipNames) => {
	const included = [];

	const dirtyKeys = {};
	dirtyIncluded.forEach((key) => {
		if (!key.startsWith('_new.')) {
			const currentKeys = [];
			key.split('.').forEach((k) => {
				currentKeys.push(k);
				if (typeof get(dirtyKeys, currentKeys.join('.')) === 'undefined') {
					set(dirtyKeys, currentKeys.join('.'), {});
				}
			});
		}
	});

	relationshipNames.forEach((relationshipName) => {
		if (!Object.prototype.hasOwnProperty.call(data.relationships, relationshipName)) {
			// This relationship isn't defined.
			return;
		}

		if (!Object.prototype.hasOwnProperty.call(dirtyKeys, relationshipName)) {
			// No related records' attributes have changed.
			return;
		}

		if (!Array.isArray(data.relationships[relationshipName].data)) {
			return;
		}

		data.relationships[relationshipName].data.forEach((rel) => {
			if (Object.keys(rel).length <= 2) {
				// This relationship only has an id and type.
				return;
			}

			if (Object.prototype.hasOwnProperty.call(dirtyKeys[relationshipName], rel.id)) {
				const relData = {
					id: rel.id,
					type: rel.type,
					attributes: {},
				};

				if (Object.keys(dirtyKeys[relationshipName][rel.id]).length === 0) {
					// This is a new record; include all attributes.
					Object.keys(rel).forEach((key) => {
						if (key !== 'id' && key !== 'type') {
							set(relData.attributes, key, rel[key]);
						}
					});
				} else {
					// This is an existing record; include only the dirty attributes.
					Object.keys(rel).forEach((key) => {
						if (Object.prototype.hasOwnProperty.call(dirtyKeys[relationshipName][rel.id], key)) {
							set(relData.attributes, key, rel[key]);
						}
					});
				}
				included.push(relData);
			}
		});
	});

	return included;
};

export const getBody = (
	method,
	type,
	id,
	formState,
	relationshipNames,
	filterBody,
	filterValues
) => {
	let body = null;

	if (method === 'PUT' || method === 'POST') {
		body = {};
		const data = {
			type,
			attributes: {},
			meta: {},
			relationships: {},
		};
		const keys = method === 'PUT' ? formState.dirty : Object.keys(formState.row);

		if (method === 'PUT' && id) {
			data.id = id;
		}

		let values = { ...formState.row };
		if (filterValues) {
			values = filterValues(values);
		}

		const fileKeys = Object.keys(formState.files);

		keys.forEach((key) => {
			const cleanKey = key.replace(/\..+$/, '');
			if (relationshipNames.includes(cleanKey)) {
				data.relationships[cleanKey] = {
					data: get(values, cleanKey),
				};
			} else if (relationshipNames.includes(key)) {
				data.relationships[key] = {
					data: get(values, cleanKey),
				};
			} else if (key.startsWith('meta.')) {
				set(data, key, get(values, key));
			} else if (key === 'meta') {
				data.meta = values.meta;
			} else if (fileKeys.includes(key)) {
				set(data.attributes, key, true);
			} else if (key !== '_new' && !key.startsWith('_new.')) {
				set(data.attributes, key, get(values, key));
			}
		});

		body.data = data;

		const included = getIncluded(data, formState.dirtyIncluded, relationshipNames);
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

		if (filterBody) {
			body = filterBody(body, formState.row);
		}

		if (Object.keys(data.attributes).length <= 0) {
			delete data.attributes;
		}
		if (Object.keys(data.meta).length <= 0) {
			delete data.meta;
		}
		if (Object.keys(data.relationships).length <= 0) {
			delete data.relationships;
		}

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
