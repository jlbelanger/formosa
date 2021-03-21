import React, { useContext } from 'react';
import { ReactComponent as CaretIcon } from '../../svg/caret.svg';
import FormContext from '../FormContext';
import normalizeOptions from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function Select({
	className,
	hideBlank,
	id,
	name,
	nameKey,
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
	const normalizedOptions = normalizeOptions(options, nameKey);
	const keys = Object.keys(normalizedOptions);

	return (
		<div className={`formosa-select-wrapper ${wrapperClassName}`.trim()}>
			<select
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				value={formState.row[name] || ''}
				{...otherProps}
			>
				{!hideBlank && <option />}
				{keys.map((value) => (
					<option key={value} value={value}>{normalizedOptions[value]}</option>
				))}
			</select>
			<CaretIcon className="formosa-icon--caret" height="16" width="16" />
		</div>
	);
}

Select.propTypes = {
	className: PropTypes.string,
	hideBlank: PropTypes.bool,
	id: PropTypes.string,
	name: PropTypes.string,
	nameKey: PropTypes.string,
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
	nameKey: 'name',
	wrapperClassName: '',
};
