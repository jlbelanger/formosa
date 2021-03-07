import React, { useContext } from 'react';
import { ReactComponent as CaretIcon } from '../../svg/caret.svg';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function Select({
	className,
	id,
	name,
	options,
	required,
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
	};

	const props = {};
	if (required) {
		props.required = required;
	}

	const keys = Object.keys(options);

	return (
		<>
			<select
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				value={formState.row[name] || ''}
				{...props}
			>
				<option />
				{keys.map((key) => (
					<option key={key} value={key}>{options[key]}</option>
				))}
			</select>
			<CaretIcon className="formosa-field__caret-icon" height="16" width="16" />
		</>
	);
}

Select.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
	required: PropTypes.bool,
};

Select.defaultProps = {
	className: '',
	id: null,
	required: false,
};
