import React, { useContext } from 'react';
import ConditionalWrapper from './ConditionalWrapper';
import FormContext from './FormContext';
import get from 'get-value';
import getNewDirty from './Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Input({
	afterChange,
	className,
	id,
	name,
	suffix,
	type,
	...otherProps
}) {
	const { formState, setFormState } = useContext(FormContext);
	const onChange = (e) => {
		const newRow = { ...formState.row };
		const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
		set(newRow, e.target.name, newValue);

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, e.target.name),
			row: newRow,
		});

		if (afterChange) {
			afterChange(e);
		}
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
		<ConditionalWrapper className="formosa-suffix-container" condition={suffix}>
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
		</ConditionalWrapper>
	);
}

Input.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	suffix: PropTypes.string,
	type: PropTypes.string,
};

Input.defaultProps = {
	afterChange: null,
	className: '',
	id: null,
	name: '',
	suffix: '',
	type: 'text',
};
