import React, { useContext } from 'react';
import FormContext from './FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Input({
	className,
	id,
	name,
	suffix,
	type,
	...otherProps
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

	const value = get(formState.row, name) || '';
	const checked = type === 'checkbox' && value;

	const props = {};
	if (checked) {
		props.checked = checked;
	} else if (type === 'checkbox') {
		props.checked = false;
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
				{...otherProps}
			/>
			{suffix && <span className="formosa-suffix">{suffix}</span>}
		</>
	);
}

Input.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	suffix: PropTypes.string,
	type: PropTypes.string,
};

Input.defaultProps = {
	className: '',
	id: null,
	name: '',
	suffix: '',
	type: 'text',
};
