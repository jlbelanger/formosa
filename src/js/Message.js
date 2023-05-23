import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from './FormContext';

export default function Message() {
	const { formState } = useContext(FormContext);

	if (!formState.messageText) {
		return null;
	}

	return (
		<p aria-live="polite" className={`formosa-message formosa-message--${formState.messageClass}`} role="alert">
			{formState.messageText}
		</p>
	);
}
