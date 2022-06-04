import getInputElement from './FieldInput';
import HasMany from './Input/HasMany';
import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved

export default function ExportableInput({
	component,
	type,
	...otherProps
}) {
	let InputComponent = getInputElement(type, component);
	if (type === 'has-many') {
		// This prevents a dependency cycle.
		InputComponent = HasMany;
	}

	return (
		<InputComponent type={type} {...otherProps} />
	);
}

ExportableInput.propTypes = {
	component: PropTypes.func,
	type: PropTypes.string,
};

ExportableInput.defaultProps = {
	component: null,
	type: 'text',
};
