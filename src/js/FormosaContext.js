import React from 'react'; // eslint-disable-line import/no-unresolved

export default React.createContext(
	{
		addToast: null,
		removeToast: null,
		toasts: {},

		disableWarningPrompt: null,
		enableWarningPrompt: null,
		showWarningPrompt: true,
	}
);
