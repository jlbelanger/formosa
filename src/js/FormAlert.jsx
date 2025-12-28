import Alert from './Alert.jsx';
import FormContext from './FormContext.jsx';
import { useContext } from 'react';

export default function FormAlert({ ...otherProps }) {
	const { formState } = useContext(FormContext);

	if (!formState.alertText) {
		return null;
	}

	return (
		<Alert type={formState.alertClass} {...otherProps}>{formState.alertText}</Alert>
	);
}
