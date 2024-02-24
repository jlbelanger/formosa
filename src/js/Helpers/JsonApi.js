import get from 'get-value';
import set from 'set-value';

export const getSimpleRecord = (record) => ({
	id: record.id,
	type: record.type,
});

export const cleanRelationship = (values) => {
	if (Array.isArray(values)) {
		return values.map((value) => getSimpleRecord(value));
	}
	return getSimpleRecord(values);
};

export const cleanRecord = (record) => {
	const hasAttributes = Object.keys(record.attributes).length > 0;
	if (!hasAttributes) {
		delete record.attributes;
	}

	const hasRelationships = Object.keys(record.relationships).length > 0;
	if (!hasRelationships) {
		delete record.relationships;
	}

	if (!hasAttributes && !hasRelationships && !record.id.startsWith('temp-')) {
		return null;
	}

	return record;
};

export const filterByKey = (relationshipNames, key) => {
	const output = [];
	relationshipNames.forEach((relName) => {
		if (relName.startsWith(`${key}.`)) {
			const keys = relName.split('.');
			keys.shift();
			output.push(keys.join('.'));
		}
	});
	return output;
};

export const getDirtyRecords = (record, relationshipNames, dirtyRelationships) => {
	let otherRecords = [];
	const output = getSimpleRecord(record);
	output.attributes = {};
	output.relationships = {};

	Object.keys(record).forEach((key) => {
		if (key !== 'id' && key !== 'type') {
			if (Object.prototype.hasOwnProperty.call(dirtyRelationships, key)) {
				if (relationshipNames.includes(key)) {
					if (Array.isArray(record[key])) {
						// This is an array relationship.
						const data = [];
						record[key].forEach((rel, relIndex) => {
							if (typeof dirtyRelationships[key][relIndex] !== 'undefined') {
								// eslint-disable-next-line no-use-before-define
								const x = getIncludedRecordData(rel, filterByKey(relationshipNames, key), dirtyRelationships[key][relIndex]);
								otherRecords = otherRecords.concat(x);
							}
							data.push(getSimpleRecord(rel));
						});
						set(output.relationships, key, { data });
					} else {
						// This is an object relationship.
						// eslint-disable-next-line no-use-before-define
						const x = getIncludedRecordData(record[key], filterByKey(relationshipNames, key), dirtyRelationships[key]);
						const data = x.shift();
						otherRecords = otherRecords.concat(x);
						set(output.relationships, key, { data });
					}
				} else {
					// This is an attribute.
					set(output.attributes, key, record[key]);
				}
			}
		}
	});

	const rec = cleanRecord(output);
	if (rec !== null) {
		otherRecords.unshift(rec);
	}

	return otherRecords;
};

export const getIncludedRecordData = (record, relationshipNames, dirtyRelationships) => {
	// This is a new record; include all attributes.
	if (record.id.startsWith('temp-')) {
		return getDirtyRecords(record, relationshipNames, dirtyRelationships);
	}

	// This is an existing record with no changes; don't include it.
	if (typeof dirtyRelationships === 'undefined') {
		return [];
	}

	// This is an existing record with no changes, but it's part of a relationship; include only the id/type.
	if (Object.keys(dirtyRelationships).length <= 0) {
		return [getSimpleRecord(record)];
	}

	// This is an existing record with changes; include all the dirty attributes and relationships.
	return getDirtyRecords(record, relationshipNames, dirtyRelationships);
};

export const getDirtyRelationships = (dirtyKeys) => {
	const output = {};
	dirtyKeys.forEach((key) => {
		const currentKeys = [];
		key.split('.').forEach((k) => {
			currentKeys.push(k);
			if (typeof get(output, currentKeys.join('.')) === 'undefined') {
				set(output, currentKeys.join('.'), {});
			}
		});
	});
	return output;
};

export const getIncludedRecords = (data, dirtyKeys, relationshipNames) => {
	let output = [];
	if (dirtyKeys.length <= 0) {
		return output;
	}

	const dirtyRelationships = getDirtyRelationships(dirtyKeys);

	// For each dirty relationship, add the dirty records to the output.
	Object.keys(dirtyRelationships).forEach((relName) => {
		if (Object.prototype.hasOwnProperty.call(data.relationships, relName)) {
			if (Array.isArray(data.relationships[relName].data)) {
				// This is an array relationship.
				Object.keys(data.relationships[relName].data).forEach((relIndex) => {
					const record = data.relationships[relName].data[relIndex];
					if (record) {
						const records = getIncludedRecordData(record, filterByKey(relationshipNames, relName), dirtyRelationships[relName][relIndex]);
						output = output.concat(records);
					}
				});
			} else {
				// This is an object relationship.
				const record = data.relationships[relName].data;
				if (record) {
					const records = getIncludedRecordData(record, filterByKey(relationshipNames, relName), dirtyRelationships[relName]);
					output = output.concat(records);
				}
			}
		}
	});

	// Remove records with only an id/type.
	return output.filter((record) => (Object.keys(record).length > 2));
};

export const unset = (obj, key) => {
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

export const appendToFormData = (obj, formData, prefix = '') => {
	Object.entries(obj).forEach((entry) => {
		const [key, value] = entry;
		const newKey = prefix ? `${prefix}[${key}]` : key;
		if (typeof value === 'object') {
			formData = appendToFormData(value, formData, newKey);
		} else {
			formData.append(newKey, JSON.stringify(value));
		}
	});
	return formData;
};

export const getBody = ( // eslint-disable-line import/prefer-default-export
	method,
	type,
	id,
	formState,
	dirtyKeys,
	relationshipNames,
	filterBody = null,
	filterValues = null
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
			} else {
				set(data.attributes, key, get(values, key));
			}
		});

		body = { data };

		const included = getIncludedRecords(data, dirtyKeys, relationshipNames);
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
			const formData = appendToFormData(body, new FormData());
			formData.append('meta[files]', JSON.stringify(filenames));

			filenames.forEach((filename) => {
				formData.append(filename, formState.files[filename]);
			});

			body = formData;
		}
	}

	return body;
};
