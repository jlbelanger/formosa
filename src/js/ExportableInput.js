import getInputElement from './FieldInput';
import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved

export default function ExportableInput({
	component = null,
	type = 'text',
	...otherProps
}) {
	const InputComponent = getInputElement(type, component);
	return (
		<InputComponent type={type} {...otherProps} />
	);
}

ExportableInput.propTypes = {
	component: PropTypes.func,
	type: PropTypes.string,
};
