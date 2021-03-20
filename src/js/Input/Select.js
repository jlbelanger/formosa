import React, { useContext } from 'react';
import { ReactComponent as CaretIcon } from '../../svg/caret.svg';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function Select({
	className,
	hideBlank,
	id,
	name,
	options,
	wrapperClassName,
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
	};

	const keys = Object.keys(options);

	return (
		<div className={`formosa-field__select-wrapper ${wrapperClassName}`.trim()}>
			<select
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				value={formState.row[name] || ''}
				{...otherProps}
			>
				{!hideBlank && <option />}
				{keys.map((key) => (
					<option key={key} value={key}>{options[key]}</option>
				))}
			</select>
			<CaretIcon className="formosa-field__caret-icon" height="16" width="16" />
		</div>
	);
}

Select.propTypes = {
	className: PropTypes.string,
	hideBlank: PropTypes.bool,
	id: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
	wrapperClassName: PropTypes.string,
};

Select.defaultProps = {
	className: '',
	hideBlank: false,
	id: null,
	name: '',
	wrapperClassName: '',
};
