import React, { useContext } from 'react';
import FormContext from './FormContext';
import PropTypes from 'prop-types';

export default function Input({
	autoComplete,
	className,
	id,
	inputMode,
	name,
	pattern,
	required,
	size,
	suffix,
	type,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const onChange = (e) => {
		const newDirty = [...formState.dirty];
		if (!newDirty.includes(e.target.name)) {
			newDirty.push(e.target.name);
		}
		setFormState({
			...formState,
			dirty: newDirty,
			row: {
				...formState.row,
				[e.target.name]: type === 'checkbox' ? e.target.checked : e.target.value,
			},
		});
	};

	let value = formState.row[name] || '';
	let checked = type === 'checkbox' && value;

	const props = {};
	if (autoComplete) {
		props.autoComplete = autoComplete;
	}
	if (checked) {
		props.checked = checked;
	} else if (type === 'checkbox') {
		props.checked = false;
	}
	if (inputMode) {
		props.inputMode = inputMode;
	}
	if (pattern) {
		props.pattern = pattern;
	}
	if (required) {
		props.required = required;
	}
	if (size) {
		props.size = size;
	}

	return (
		<>
			<input
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				type={type}
				value={value}
				{...props}
			/>
			{suffix && <span className="formosa-suffix">{suffix}</span>}
		</>
	);
}

Input.propTypes = {
	autoComplete: PropTypes.string,
	className: PropTypes.string,
	id: PropTypes.string,
	inputMode: PropTypes.string,
	name: PropTypes.string.isRequired,
	pattern: PropTypes.string,
	required: PropTypes.bool,
	size: PropTypes.number,
	suffix: PropTypes.string,
	type: PropTypes.string,
};

Input.defaultProps = {
	autoComplete: '',
	className: '',
	id: null,
	inputMode: '',
	pattern: '',
	required: false,
	size: null,
	suffix: '',
	type: 'text',
};
