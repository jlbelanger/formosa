import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		errors: {},
		files: {},
		messageClass: '',
		messageText: '',
		originalRow: {},
		row: {},
		response: null,
		setRow: null,
		toastClass: '',
		toastText: '',
		uuid: null,
	}
);
