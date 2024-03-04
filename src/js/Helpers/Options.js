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

const toSlug = (s) => (
	s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/ & /g, '-and-')
		.replace(/<[^>]+>/g, '')
		.replace(/['’.]/g, '')
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '')
		.replace(/--+/g, '-')
);

export const filterByKey = (records, key, value) => {
	value = value.toLowerCase();
	const escapedValue = escapeRegExp(value);
	records = records.filter((record) => {
		const recordValue = get(record, key).toString().toLowerCase() || '';
		return recordValue.match(new RegExp(`(^|[^a-z])${escapedValue}`));
	});
	value = toSlug(value);
	records = records.sort((a, b) => {
		const aValue = toSlug(get(a, key).toString());
		const bValue = toSlug(get(b, key).toString());
		const aPos = aValue.indexOf(value) === 0;
		const bPos = bValue.indexOf(value) === 0;
		if ((aPos && bPos) || (!aPos && !bPos)) {
			return aValue.localeCompare(bValue);
		}
		if (aPos && !bPos) {
			return -1;
		}
		return 1;
	});
	return records;
};
