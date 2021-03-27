import get from 'get-value';

export const normalizeOptions = (options, labelKey, valueKey = null) => {
	if (!options) {
		return [];
	}

	const output = [];
	if (Array.isArray(options)) {
		options.forEach((option) => {
			if (typeof option === 'string') {
				output.push({
					label: option,
					value: option,
				});
			} else {
				output.push({
					...option,
					label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
					value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey),
				});
			}
		});
	} else {
		Object.keys(options).forEach((value) => {
			const option = options[value];
			if (typeof value === 'string') {
				output.push({
					label: option,
					value,
				});
			} else {
				output.push({
					...option,
					label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
					value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey),
				});
			}
		});
	}

	return output;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
export const escapeRegExp = (string) => (string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'));

export const filterByKey = (records, key, value) => {
	value = escapeRegExp(value.toLowerCase());
	records = records.filter((record) => {
		let recordValue = get(record, key) || '';
		recordValue = recordValue.toString().toLowerCase();
		return recordValue.match(new RegExp(`(^|[^a-z])${value}`));
	});
	return records;
};
