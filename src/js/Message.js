import React, { useContext } from 'react';
import FormContext from './FormContext';

export default function Message() {
	const { formState } = useContext(FormContext);
	const hasErrors = Object.prototype.hasOwnProperty.call(formState.errors, '');

	return (
		<>
			{hasErrors && (<p className="formosa-message formosa-message--error">{formState.errors[''].join(' ')}</p>)}
			{formState.message && (<p className="formosa-message formosa-message--success">{formState.message}</p>)}
		</>
	);
}
