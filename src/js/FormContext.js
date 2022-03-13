import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		dirty: [],
		dirtyIncluded: [],
		errors: {},
		files: {},
		message: '',
		row: {},
		setRow: null,
		setValues: null,
	}
);
