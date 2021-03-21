import React, { useContext } from 'react';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	className,
	label,
	name,
	value,
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
				[e.target.name]: e.target.value,
			},
		});
		if (afterChange) {
			afterChange(e);
		}
	};
	const checked = formState.row[name] === value;

	return (
		<label className={`formosa-radio__label ${checked ? ' formosa-radio__label--checked' : ''}`.trim()}>
			<input
				checked={checked}
				className={`formosa-field__input formosa-radio__input ${className}`.trim()}
				name={name}
				onChange={onChange}
				type="radio"
				value={value}
				{...otherProps}
			/>
			{label}
		</label>
	);
}

Radio.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
};

Radio.defaultProps = {
	afterChange: null,
	className: '',
	label: '',
	name: '',
	value: '',
};
