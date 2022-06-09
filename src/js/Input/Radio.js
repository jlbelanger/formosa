import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	className,
	inputAttributes,
	itemLabelAttributes,
	label,
	labelClassName,
	labelKey,
	listAttributes,
	listClassName,
	listItemAttributes,
	listItemClassName,
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
			setValue(newValue);
		} else {
			formState.setValues(formState, e, name, newValue, afterChange);
		}
	};

	return (
		<ul className={`formosa-radio ${listClassName}`.trim()} {...listAttributes}>
			{optionValues.map((optionValue) => {
				let optionValueVal = optionValue.value;
				let isJson = false;
				if (typeof optionValueVal === 'object') {
					isJson = true;
					optionValueVal = JSON.stringify(optionValueVal);
				}

				const checked = currentValue === optionValueVal;

				let listItemProps = {};
				if (typeof listItemAttributes === 'function') {
					listItemProps = listItemAttributes(optionValue);
				} else if (listItemAttributes && typeof listItemAttributes === 'object') {
					listItemProps = listItemAttributes;
				}

				let labelProps = {};
				if (typeof itemLabelAttributes === 'function') {
					labelProps = itemLabelAttributes(optionValue);
				} else if (itemLabelAttributes && typeof itemLabelAttributes === 'object') {
					labelProps = itemLabelAttributes;
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

				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={optionValueVal} {...listItemProps}>
						<label
							className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()}
							{...labelProps}
						>
							<input
								checked={checked}
								className={`formosa-field__input formosa-radio__input ${className}`.trim()}
								onChange={onChange}
								required={required}
								type="radio"
								value={optionValueVal}
								{...inputProps}
								{...otherProps}
							/>
							{optionValue.label}
						</label>
					</li>
				);
			})}
		</ul>
	);
}

Radio.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	inputAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	itemLabelAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	label: PropTypes.string,
	labelClassName: PropTypes.string,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	listAttributes: PropTypes.object,
	listClassName: PropTypes.string,
	listItemAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	listItemClassName: PropTypes.string,
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
	inputAttributes: null,
	itemLabelAttributes: null,
	label: '',
	labelClassName: '',
	labelKey: 'name',
	listAttributes: null,
	listClassName: '',
	listItemAttributes: null,
	listItemClassName: '',
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
