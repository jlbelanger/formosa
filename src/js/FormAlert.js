import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import Alert from './Alert';
import FormContext from './FormContext';

export default function FormAlert({ ...otherProps }) {
	const { formState } = useContext(FormContext);

	if (!formState.alertText) {
		return null;
	}

	return (
		<Alert type={formState.alertClass} {...otherProps}>{formState.alertText}</Alert>
	);
}
