import React, { useContext, useEffect, useState } from 'react';
import Api from '../Helpers/Api';
import { ReactComponent as CaretIcon } from '../../svg/caret.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import getNewDirty from '../Helpers/FormState';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Select({
	afterChange,
	className,
	hideBlank,
	id,
	name,
	labelKey,
	options,
	url,
	valueKey,
	wrapperClassName,
	...otherProps
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : null);
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

	useEffect(() => {
		if (optionValues === null && url) {
			Api.get(url)
				.then((response) => {
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
				});
		}
		return () => {};
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : null);
		return () => {};
	}, [options]);

	return (
		<div className={`formosa-select-wrapper ${wrapperClassName}`.trim()}>
			<select
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				value={get(formState.row, name) || ''}
				{...otherProps}
			>
				{!hideBlank && <option />}
				{optionValues && optionValues.map(({ label, value }) => (
					<option key={value} value={value}>{label}</option>
				))}
			</select>
			<CaretIcon className="formosa-icon--caret" height="16" width="16" />
		</div>
	);
}

Select.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	hideBlank: PropTypes.bool,
	id: PropTypes.string,
	name: PropTypes.string,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	url: PropTypes.string,
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	wrapperClassName: PropTypes.string,
};

Select.defaultProps = {
	afterChange: null,
	className: '',
	hideBlank: false,
	id: null,
	name: '',
	labelKey: 'name',
	options: null,
	url: null,
	valueKey: null,
	wrapperClassName: '',
};
