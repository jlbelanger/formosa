const pad = (n, width, z = '0') => {
	n = n.toString();
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const stringToObject = (datetimeString) => {
	const output = {
		year: '',
		month: '',
		day: '',
		hour: '',
		minute: '',
		second: '',
		ampm: 'am',
	};

	if (!datetimeString) {
		return output;
	}

	// hour12 doesn't work in Chromium: https://github.com/microsoft/vscode/issues/117970
	let value = new Date(`${datetimeString.replace(' ', 'T')}.000Z`);
	value = value.toLocaleString('en-CA', { hourCycle: 'h23' });

	const date = value.substring(0, 10).split('-');
	output.year = date[0];
	output.month = parseInt(date[1], 10);
	output.day = parseInt(date[2], 10);

	const time = value.substring(12).split(':');
	const hour = parseInt(time[0], 10);
	if (hour > 12) {
		output.hour = hour - 12;
	} else if (hour === 0) {
		output.hour = 12;
	} else {
		output.hour = hour;
	}
	output.minute = time[1];
	output.second = time[2];
	output.ampm = hour >= 12 ? 'pm' : 'am';

	return output;
};

export const objectToString = (datetimeObject) => {
	const year = pad(datetimeObject.year, 4);
	const month = pad(datetimeObject.month, 2);
	const day = pad(datetimeObject.day, 2);

	let hour = parseInt(datetimeObject.hour, 10);
	if (datetimeObject.ampm === 'pm' && hour < 12) {
		hour += 12;
	} else if (datetimeObject.ampm === 'am' && hour === 12) {
		hour = 0;
	}
	const minute = pad(datetimeObject.minute, 2);
	const second = pad(datetimeObject.second, 2);

	try {
		return new Date(year, month - 1, day, pad(hour, 2), minute, second).toISOString().replace('T', ' ').substring(0, 19);
	} catch {
		return '';
	}
};
