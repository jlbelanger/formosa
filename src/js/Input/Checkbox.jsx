import CheckIcon from '../../svg/check.svg?react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext.jsx';
import get from 'get-value';
import PropTypes from 'prop-types';
import { useContext } from 'react';

export default function Checkbox({
	afterChange = null,
	className = '',
	iconAttributes = null,
	iconClassName = '',
	iconHeight = 16,
	iconWidth = 16,
	id = null,
	name = '',
	setValue = null,
	value = null,
	...otherProps
}) {
	const { formState, setValues } = useContext(FormContext);

	let checked;
	if (setValue === null) {
		if (formState === undefined) {
			throw new Error('<Checkbox> component must be inside a <Form> component.');
		}
		checked = Boolean(get(formState.row, name));
	} else {
		checked = value;
	}

	const onChange = (e) => {
		const newValue = e.target.checked;
		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange);
		}
	};

	const props = {};
	if (id || name) {
		props.id = id || name;
	}
	if (name) {
		props.name = name;
	}

	return (
		<>
			<input
				checked={checked}
				className={`formosa-field__input formosa-field__input--checkbox ${className}`.trim()}
				onChange={onChange}
				type="checkbox"
				{...props}
				{...otherProps}
			/>
			<CheckIcon
				aria-hidden="true"
				className={`formosa-icon--check ${iconClassName}`.trim()}
				height={iconHeight}
				width={iconWidth}
				{...iconAttributes}
			/>
		</>
	);
}

Checkbox.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
	id: PropTypes.string,
	name: PropTypes.string,
	setValue: PropTypes.func,
	value: PropTypes.bool,
};
