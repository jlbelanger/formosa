import React, { useContext } from 'react';
import FormContext from './FormContext';

export default function Flash() {
	const { formState } = useContext(FormContext);
	const hasErrors = Object.prototype.hasOwnProperty.call(formState.errors, '');

	return (
		<>
			{hasErrors && (<p className="message message--error">{formState.errors[''].join(' ')}</p>)}
			{formState.flash && (<p className="message message--success">{formState.flash}</p>)}
		</>
	);
}
