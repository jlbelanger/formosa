import React from 'react';

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
