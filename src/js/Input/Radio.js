import React, { useContext } from 'react';
import FormContext from '../FormContext';
import get from 'get-value';
import getNewDirty from '../Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

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
		const newRow = { ...formState.row };
		set(newRow, e.target.name, e.target.value);

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, e.target.name),
			row: newRow,
		});
		if (afterChange) {
			afterChange(e);
		}
	};
	const checked = get(formState.row, name) === value;

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
