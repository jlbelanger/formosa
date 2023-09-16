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
	loadingText,
	multiple,
	name,
	optionAttributes,
	options,
	setValue,
	showLoading,
	url,
	value,
	valueKey,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState, setValues } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
	const [isLoading, setIsLoading] = useState(showLoading || !!url);
	const [loadError, setLoadError] = useState('');
	const api = Api.instance();

	useEffect(() => {
		if (url) {
			api(url, false)
				.catch((error) => {
					if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
						setLoadError(error.errors.map((e) => (e.title)).join(' '));
						setIsLoading(false);
					}
				})
				.then((response) => {
					if (!response) {
						return;
					}
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
					setIsLoading(false);
				});
		}
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
	}, [options]);

	useEffect(() => {
		setIsLoading(showLoading);
	}, [showLoading]);

	if (isLoading) {
		return (<div className="formosa-spinner" role="status">{loadingText}</div>);
	}

	if (loadError) {
		return (<div className="formosa-field__error">{loadError}</div>);
	}

	let currentValue = multiple ? [] : '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<Select> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	}
	if (currentValue === null || currentValue === undefined) {
		currentValue = multiple ? [] : '';
	}
	if (typeof currentValue === 'object' && !multiple) {
		currentValue = JSON.stringify(currentValue);
	}

	const onChange = (e) => {
		let newValue;
		if (multiple) {
			newValue = Array.from(e.target.options).filter((option) => (option.selected)).map((option) => (option.value));
		} else {
			newValue = e.target.value;
			const option = e.target.querySelector(`[value="${newValue.replace(/"/g, '\\"')}"]`);
			if (option.getAttribute('data-json') === 'true') {
				newValue = JSON.parse(newValue);
			}
		}

		if (setValue) {
			setValue(newValue);
		} else {
			setValues(e, name, newValue, afterChange);
		}
	};

	const props = {};
	if (id || name) {
		props.id = id || name;
	}
	if (name) {
		props.name = name;
	}
	if (multiple) {
		props.multiple = true;
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
				{!hideBlank && !multiple && <option value="" />}
				{optionValues.map((optionValue) => {
					let optionValueVal = optionValue.value;
					let isJson = false;
					if (typeof optionValueVal === 'object') {
						isJson = true;
						optionValueVal = JSON.stringify(optionValueVal);
					}

					let optionProps = {};
					if (typeof optionAttributes === 'function') {
						optionProps = optionAttributes(optionValue);
					} else if (optionAttributes && typeof optionAttributes === 'object') {
						optionProps = optionAttributes;
					}
					if (isJson) {
						optionProps['data-json'] = true;
					}

					return (
						<option key={optionValueVal} value={optionValueVal} {...optionProps}>{optionValue.label}</option>
					);
				})}
			</select>
			{!multiple && (
				<CaretIcon
					aria-hidden="true"
					className={`formosa-icon--caret ${iconClassName}`.trim()}
					height={iconHeight}
					width={iconWidth}
					{...iconAttributes}
				/>
			)}
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
	loadingText: PropTypes.string,
	multiple: PropTypes.bool,
	name: PropTypes.string,
	optionAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	setValue: PropTypes.func,
	showLoading: PropTypes.bool,
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
	loadingText: 'Loading...',
	multiple: false,
	name: '',
	optionAttributes: null,
	options: null,
	setValue: null,
	showLoading: false,
	url: null,
	value: null,
	valueKey: null,
	wrapperAttributes: null,
	wrapperClassName: '',
};
