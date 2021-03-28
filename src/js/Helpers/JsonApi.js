import get from 'get-value';
import set from 'set-value';

const findIncluded = (included, id, type) => (included.find((data) => (data.id === id && data.type === type)));

const deserializeSingle = (data, otherRows = [], included = []) => {
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
					includedRecord = findIncluded(included, rel.id, rel.type);
					if (includedRecord) {
						output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included);
					} else {
						includedRecord = findIncluded(otherRows, rel.id, rel.type);
						if (includedRecord) {
							output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included);
						}
					}
				});
			} else if (output[relationshipName] !== null) {
				includedRecord = findIncluded(included, output[relationshipName].id, output[relationshipName].type);
				if (includedRecord) {
					output[relationshipName] = deserializeSingle(includedRecord, otherRows, included);
				} else {
					includedRecord = findIncluded(otherRows, output[relationshipName].id, output[relationshipName].type);
					if (includedRecord) {
						output[relationshipName] = deserializeSingle(includedRecord, otherRows, included);
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
			output.push(deserializeSingle(data, body.data, body.included));
		});
		return output;
	}
	return deserializeSingle(body.data, [], body.included);
};

const getIncluded = (data, dirtyIncluded, relationshipNames) => {
	const included = [];

	relationshipNames.forEach((relationshipName) => {
		if (!Object.prototype.hasOwnProperty.call(data.relationships, relationshipName)) {
			// This relationship isn't defined.
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

			if (
				Object.prototype.hasOwnProperty.call(dirtyIncluded, rel.type)
				&& Object.prototype.hasOwnProperty.call(dirtyIncluded[rel.type], rel.id)
			) {
				const relData = {
					id: rel.id,
					type: rel.type,
					attributes: {},
				};
				dirtyIncluded[rel.type][rel.id].forEach((key) => {
					relData.attributes[key] = rel[key];
				});
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

		keys.forEach((key) => {
			if (relationshipNames.includes(key)) {
				data.relationships[key] = {
					data: values[key],
				};
			} else if (key.startsWith('meta.')) {
				set(data, key, get(values, key));
			} else {
				set(data.attributes, key, values[key]);
			}
		});

		body.data = data;

		const included = getIncluded(data, formState.dirtyIncluded, relationshipNames);
		if (included.length > 0) {
			body.included = included;
		}

		if (filterBody) {
			body = filterBody(body);
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
	}

	return body;
};
