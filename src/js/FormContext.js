import React from 'react';

export default React.createContext(
	{
		dirty: [],
		dirtyIncluded: [],
		errors: {},
		message: '',
		row: {},
	}
);
