export default (options, nameKey) => {
	let output = options;
	if (Array.isArray(output)) {
		output = {};
		options.forEach((option) => {
			if (typeof option === 'string') {
				output[option] = option;
			} else {
				const json = JSON.stringify({ id: option.id, type: option.type });
				output[json] = option[nameKey];
			}
		});
	}
	return output;
};
