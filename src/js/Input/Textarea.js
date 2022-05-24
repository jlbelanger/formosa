import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Textarea({
	afterChange,
	className,
	id,
	name,
	setValue,
	value,
	...otherProps
}) {
	const { formState } = useContext(FormContext);

	let currentValue = '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<Textarea> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	}
	if (currentValue === null || currentValue === undefined) {
		currentValue = '';
	}

	const onChange = (e) => {
		const newValue = e.target.value;
		if (setValue) {
			setValue(newValue);
		} else {
			formState.setValues(formState, e, name, newValue, afterChange);
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
		<textarea
			className={`formosa-field__input formosa-field__input--textarea ${className}`.trim()}
			onChange={onChange}
			value={currentValue}
			{...props}
			{...otherProps}
		/>
	);
}

Textarea.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	setValue: PropTypes.func,
	value: PropTypes.string,
};

Textarea.defaultProps = {
	afterChange: null,
	className: '',
	id: null,
	name: '',
	setValue: null,
	value: null,
};
