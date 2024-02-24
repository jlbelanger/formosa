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

export const deserialize = (body) => { // eslint-disable-line import/prefer-default-export
	if (Array.isArray(body.data)) {
		const output = [];
		body.data.forEach((data) => {
			output.push(deserializeSingle(data, body.data, body.included, null));
		});

		if (Object.prototype.hasOwnProperty.call(body, 'meta')) {
			return { data: output, meta: body.meta };
		}

		return output;
	}
	return deserializeSingle(body.data, [], body.included, body.data);
};
