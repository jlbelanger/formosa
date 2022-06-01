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
	labelKey,
	name,
	options,
	setValue,
	url,
	value,
	valueKey,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);

	useEffect(() => {
		if (url) {
			Api.get(url)
				.then((response) => {
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
				});
		}
		return () => {};
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
		return () => {};
	}, [options]);

	let currentValue = '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<Select> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	}
	if (currentValue === null || currentValue === undefined) {
		currentValue = '';
	}
	if (typeof currentValue === 'object') {
		currentValue = JSON.stringify(currentValue);
	}

	const onChange = (e) => {
		let newValue = e.target.value;
		const option = e.target.querySelector(`[value="${newValue.replace(/"/g, '\\"')}"]`);
		if (option.getAttribute('data-json') === 'true') {
			newValue = JSON.parse(newValue);
		}

		if (setValue) {
			setValue(newValue);
		} else {
			formState.setValues(formState, e, name, newValue, afterChange);
		}
	};

	const props = {};
	if (id || name) {
		props.id = id || name;
	}
	if (name) {
		props.name = name;
	}

	return (
		<div className={`formosa-select-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
			<select
				className={`formosa-field__input formosa-field__input--select ${className}`.trim()}
				onChange={onChange}
				value={currentValue}
				{...props}
				{...otherProps}
			>
				{!hideBlank && <option value="" />}
				{optionValues.map((optionValue) => {
					let optionValueVal = optionValue.value;
					let isJson = false;
					if (typeof optionValueVal === 'object') {
						isJson = true;
						optionValueVal = JSON.stringify(optionValueVal);
					}
					const optionProps = {};
					if (isJson) {
						optionProps['data-json'] = true;
					}
					return (
						<option key={optionValueVal} value={optionValueVal} {...optionProps}>{optionValue.label}</option>
					);
				})}
			</select>
			<CaretIcon
				aria-hidden="true"
				className={`formosa-icon--caret ${iconClassName}`.trim()}
				height={iconHeight}
				width={iconWidth}
				{...iconAttributes}
			/>
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
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	name: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	setValue: PropTypes.func,
	url: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.object,
		PropTypes.string,
	]),
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
	labelKey: 'name',
	name: '',
	options: null,
	setValue: null,
	url: null,
	value: null,
	valueKey: null,
	wrapperAttributes: null,
	wrapperClassName: '',
};
