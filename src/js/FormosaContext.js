import React from 'react';

export default React.createContext(
	{
		addToast: null,
		removeToast: null,
		toasts: {},
	}
);
