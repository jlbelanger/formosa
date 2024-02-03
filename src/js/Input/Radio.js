import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	className,
	fieldsetAttributes,
	fieldsetClassName,
	inputAttributes,
	itemAttributes,
	itemClassName,
	itemLabelAttributes,
	itemLabelClassName,
	itemSpanAttributes,
	itemSpanClassName,
	label,
	labelKey,
	legend,
	loadingText,
	name,
	options,
	required,
	setValue,
	showLoading,
	url,
	value,
	valueKey,
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

	let currentValue = '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<Radio> component must be inside a <Form> component.');
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
		if (e.target.getAttribute('data-json') === 'true') {
			newValue = JSON.parse(newValue);
		}

		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange);
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

				const checked = currentValue === optionValueVal;

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
					inputProps.name = name;
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
								className={`formosa-field__input formosa-radio__input ${className}`.trim()}
								onChange={onChange}
								required={required}
								type="radio"
								value={optionValueVal}
								{...inputProps}
								{...otherProps}
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

Radio.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	fieldsetAttributes: PropTypes.object,
	fieldsetClassName: PropTypes.string,
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
	label: PropTypes.string,
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
	required: PropTypes.bool,
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
};

Radio.defaultProps = {
	afterChange: null,
	className: '',
	fieldsetAttributes: null,
	fieldsetClassName: '',
	inputAttributes: null,
	itemAttributes: null,
	itemClassName: '',
	itemLabelAttributes: null,
	itemLabelClassName: '',
	itemSpanAttributes: null,
	itemSpanClassName: '',
	label: '',
	labelKey: 'name',
	legend: '',
	loadingText: 'Loading...',
	name: '',
	options: null,
	required: false,
	setValue: null,
	showLoading: false,
	url: null,
	value: null,
	valueKey: null,
};
