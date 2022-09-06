import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import ConditionalWrapper from './ConditionalWrapper';
import FormContext from './FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Input({
	afterChange,
	className,
	id,
	name,
	setValue,
	suffix,
	type,
	value,
	...otherProps
}) {
	const { formState, setValues } = useContext(FormContext);

	let currentValue = '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<Input> component must be inside a <Form> component.');
		}
		if (type !== 'file') {
			currentValue = get(formState.row, name);
			if (currentValue === null || currentValue === undefined) {
				currentValue = '';
			}
		}
	}

	const onChange = (e) => {
		const newValue = e.target.value;
		if (setValue) {
			setValue(newValue);
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
		<ConditionalWrapper className="formosa-suffix-container" condition={suffix}>
			<input
				className={`formosa-field__input ${className}`.trim()}
				onChange={onChange}
				type={type}
				value={currentValue}
				{...props}
				{...otherProps}
			/>
			{suffix && <span className="formosa-suffix">{suffix}</span>}
		</ConditionalWrapper>
	);
}

Input.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	setValue: PropTypes.func,
	suffix: PropTypes.string,
	type: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

Input.defaultProps = {
	afterChange: null,
	className: '',
	id: null,
	name: '',
	setValue: null,
	suffix: '',
	type: 'text',
	value: null,
};
