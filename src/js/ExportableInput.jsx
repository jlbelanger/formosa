import getInputElement from './FieldInput.jsx';
import PropTypes from 'prop-types';

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
