import React from 'react';

export default React.createContext(
	{
		toasts: {},
		showWarningPrompt: true,
		addToast: () => {},
		removeToast: () => {},
		disableWarningPrompt: () => {},
		enableWarningPrompt: () => {},
	}
);
