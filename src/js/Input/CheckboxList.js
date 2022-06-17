import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import { ReactComponent as CheckIcon } from '../../svg/check.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function CheckboxList({
	afterChange,
	className,
	disabled,
	fieldsetAttributes,
	fieldsetClassName,
	iconAttributes,
	iconClassName,
	iconHeight,
	iconWidth,
	inputAttributes,
	itemAttributes,
	itemClassName,
	itemLabelAttributes,
	itemLabelClassName,
	itemSpanAttributes,
	itemSpanClassName,
	labelKey,
	legend,
	loadingText,
	name,
	options,
	readOnly,
	setValue,
	showLoading,
	url,
	value,
	valueKey,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
	const [isLoading, setIsLoading] = useState(showLoading || !!url);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (url) {
			Api.get(url, false)
				.then((response) => {
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
					setIsLoading(false);
				})
				.catch((error) => {
					if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
						setMessage(error.errors.map((e) => (e.title)).join(' '));
						setIsLoading(false);
					} else {
						throw error;
					}
				});
		}
		return () => {};
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
		return () => {};
	}, [options]);

	useEffect(() => {
		setIsLoading(showLoading);
		return () => {};
	}, [showLoading]);

	if (isLoading) {
		return (<div className="formosa-spinner">{loadingText}</div>);
	}

	if (message) {
		return (<div className="formosa-field__error">{message}</div>);
	}

	let currentValue = [];
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<CheckboxList> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	}
	if (currentValue === null || currentValue === undefined || currentValue === '') {
		currentValue = [];
	}
	const currentValueStringified = currentValue.map((val) => (typeof val === 'object' ? JSON.stringify(val) : val));

	const onChange = (e) => {
		const newValue = [...currentValue];
		let val = e.target.value;

		if (e.target.checked) {
			if (e.target.getAttribute('data-json') === 'true') {
				val = JSON.parse(val);
			}
			newValue.push(val);
		} else {
			const index = currentValueStringified.indexOf(val);
			if (index > -1) {
				newValue.splice(index, 1);
			}
		}

		if (setValue) {
			setValue(newValue);
		} else {
			formState.setValues(formState, e, name, newValue, afterChange);
		}
	};

	return (
		<fieldset className={`formosa-radio ${fieldsetClassName}`.trim()} {...fieldsetAttributes}>
			<legend className="formosa-radio__legend">{legend}</legend>
			{optionValues.map((optionValue) => {
				let optionValueVal = optionValue.value;
				let isJson = false;
				if (typeof optionValueVal === 'object') {
					isJson = true;
					optionValueVal = JSON.stringify(optionValueVal);
				}

				const checked = currentValueStringified.includes(optionValueVal);

				let itemProps = {};
				if (typeof itemAttributes === 'function') {
					itemProps = itemAttributes(optionValue);
				} else if (itemAttributes && typeof itemAttributes === 'object') {
					itemProps = itemAttributes;
				}

				let itemLabelProps = {};
				if (typeof itemLabelAttributes === 'function') {
					itemLabelProps = itemLabelAttributes(optionValue);
				} else if (itemLabelAttributes && typeof itemLabelAttributes === 'object') {
					itemLabelProps = itemLabelAttributes;
				}

				let inputProps = {};
				if (typeof inputAttributes === 'function') {
					inputProps = inputAttributes(optionValue);
				} else if (inputAttributes && typeof inputAttributes === 'object') {
					inputProps = inputAttributes;
				}
				if (isJson) {
					inputProps['data-json'] = true;
				}
				if (name) {
					inputProps.name = `${name}[]`;
				}

				let iconProps = {};
				if (typeof iconAttributes === 'function') {
					iconProps = iconAttributes(optionValue);
				} else if (iconAttributes && typeof iconAttributes === 'object') {
					iconProps = iconAttributes;
				}

				let itemSpanProps = {};
				if (typeof itemSpanAttributes === 'function') {
					itemSpanProps = itemSpanAttributes(optionValue);
				} else if (itemSpanAttributes && typeof itemSpanAttributes === 'object') {
					itemSpanProps = itemSpanAttributes;
				}

				return (
					<div className={`formosa-radio__item ${itemClassName}`.trim()} key={optionValueVal} {...itemProps}>
						<label
							className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${itemLabelClassName}`.trim()}
							{...itemLabelProps}
						>
							<input
								aria-label={optionValue.label}
								checked={checked}
								className={`formosa-field__input formosa-field__input--checkbox ${className}`.trim()}
								disabled={disabled}
								onChange={onChange}
								readOnly={readOnly}
								value={optionValueVal}
								{...inputProps}
								{...otherProps}
								type="checkbox"
							/>
							<CheckIcon
								aria-hidden="true"
								className={`formosa-icon--check ${iconClassName}`.trim()}
								height={iconHeight}
								width={iconWidth}
								{...iconProps}
							/>
							<span aria-hidden="true" className={`formosa-radio__span ${itemSpanClassName}`.trim()} {...itemSpanProps}>
								{optionValue.label}
							</span>
						</label>
					</div>
				);
			})}
		</fieldset>
	);
}

CheckboxList.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	fieldsetAttributes: PropTypes.object,
	fieldsetClassName: PropTypes.string,
	iconAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
	inputAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	itemAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	itemClassName: PropTypes.string,
	itemLabelAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	itemLabelClassName: PropTypes.string,
	itemSpanAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	itemSpanClassName: PropTypes.string,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	legend: PropTypes.string,
	loadingText: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	readOnly: PropTypes.bool,
	setValue: PropTypes.func,
	showLoading: PropTypes.bool,
	url: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.number),
		PropTypes.arrayOf(PropTypes.object),
		PropTypes.arrayOf(PropTypes.string),
	]),
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};

CheckboxList.defaultProps = {
	afterChange: null,
	className: '',
	disabled: false,
	fieldsetAttributes: null,
	fieldsetClassName: '',
	iconAttributes: null,
	iconClassName: '',
	iconHeight: 16,
	iconWidth: 16,
	inputAttributes: null,
	itemAttributes: null,
	itemClassName: '',
	itemLabelAttributes: null,
	itemLabelClassName: '',
	itemSpanAttributes: null,
	itemSpanClassName: '',
	labelKey: 'name',
	legend: '',
	loadingText: 'Loading...',
	name: '',
	options: null,
	readOnly: false,
	setValue: null,
	showLoading: false,
	url: null,
	value: null,
	valueKey: null,
};
