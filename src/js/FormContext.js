import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		alertClass: '',
		alertText: '',
		errors: {},
		files: {},
		originalRow: {},
		row: {},
		response: null,
		setRow: null,
		toastClass: '',
		toastText: '',
		uuid: null,
	}
);
