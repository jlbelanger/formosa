import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		dirtyKeys: null,
		errors: {},
		files: {},
		message: '',
		originalRow: {},
		row: {},
		setRow: null,
		setValues: null,
	}
);
