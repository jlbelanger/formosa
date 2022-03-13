import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import { ReactComponent as CaretIcon } from '../../svg/caret.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function Select({
	afterChange,
	className,
	hideBlank,
	iconAttributes,
	iconClassName,
	iconHeight,
	iconWidth,
	id,
	name,
	labelKey,
	options,
	url,
	valueKey,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : null);
	const onChange = (e) => {
		formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
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
		<div className={`formosa-select-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
			<select
				className={`formosa-field__input formosa-field__input-select ${className}`.trim()}
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
			<CaretIcon className={`formosa-icon--caret ${iconClassName}`.trim()} height={iconHeight} width={iconWidth} {...iconAttributes} />
		</div>
	);
}

Select.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	hideBlank: PropTypes.bool,
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
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
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Select.defaultProps = {
	afterChange: null,
	className: '',
	hideBlank: false,
	iconAttributes: null,
	iconClassName: '',
	iconHeight: 16,
	iconWidth: 16,
	id: null,
	name: '',
	labelKey: 'name',
	options: null,
	url: null,
	valueKey: null,
	wrapperAttributes: null,
	wrapperClassName: '',
};
