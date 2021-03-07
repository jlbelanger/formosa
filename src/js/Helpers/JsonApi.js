export const getBody = (
	method,
	type,
	id,
	formState,
	relationshipNames,
	filterBody,
	filterValuesBeforeSerialize
) => {
	let body = null;

	if (method === 'PUT' || method === 'POST') {
		body = {};
		let data = {
			type,
			attributes: {},
			relationships: {},
		};
		const keys = method === 'PUT' ? formState.dirty : Object.keys(formState.row);

		if (method === 'PUT' && id) {
			data.id = id;
		}

		let values = { ...formState.row };
		if (filterValuesBeforeSerialize) {
			values = filterValuesBeforeSerialize(values);
		}

		keys.forEach((key) => {
			if (relationshipNames.includes(key)) {
				data.relationships[key] = {
					data: values[key],
				};
			} else {
				data.attributes[key] = values[key];
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
	}

	return body;
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
