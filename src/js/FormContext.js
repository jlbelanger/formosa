import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		errors: {},
		files: {},
		message: '',
		originalRow: {},
		row: {},
		setRow: null,
	}
);
