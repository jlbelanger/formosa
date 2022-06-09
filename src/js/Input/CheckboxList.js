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
	iconAttributes,
	iconClassName,
	iconHeight,
	iconWidth,
	inputAttributes,
	itemLabelAttributes,
	labelClassName,
	labelKey,
	listAttributes,
	listClassName,
	listItemAttributes,
	listItemClassName,
	loadingText,
	name,
	options,
	readOnly,
	setValue,
	showLoading,
	url,
	value,
	valueKey,
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
	currentValue = currentValue.map((val) => (typeof val === 'object' ? JSON.stringify(val) : val));

	const onChange = (e) => {
		const newValue = [...currentValue];
		let val = e.target.value;

		if (e.target.checked) {
			if (e.target.getAttribute('data-json') === 'true') {
				val = JSON.parse(val);
			}
			newValue.push(val);
		} else {
			const index = currentValue.indexOf(val);
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
		<ul className={`formosa-radio ${listClassName}`.trim()} {...listAttributes}>
			{optionValues.map((optionValue) => {
				let optionValueVal = optionValue.value;
				let isJson = false;
				if (typeof optionValueVal === 'object') {
					isJson = true;
					optionValueVal = JSON.stringify(optionValueVal);
				}

				const checked = currentValue.includes(optionValueVal);

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
					inputProps.name = `${name}[]`;
				}

				let iconProps = {};
				if (typeof iconAttributes === 'function') {
					iconProps = iconAttributes(optionValue);
				} else if (iconAttributes && typeof iconAttributes === 'object') {
					iconProps = iconAttributes;
				}

				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={optionValueVal} {...listItemProps}>
						<div className="formosa-input-wrapper formosa-input-wrapper--checkbox">
							<label
								className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()}
								{...labelProps}
							>
								<input
									checked={checked}
									className={`formosa-field__input formosa-field__input--checkbox ${className}`.trim()}
									disabled={disabled}
									onChange={onChange}
									readOnly={readOnly}
									type="checkbox"
									value={optionValueVal}
									{...inputProps}
								/>
								<CheckIcon
									aria-hidden="true"
									className={`formosa-icon--check ${iconClassName}`.trim()}
									height={iconHeight}
									width={iconWidth}
									{...iconProps}
								/>
								{optionValue.label}
							</label>
						</div>
					</li>
				);
			})}
		</ul>
	);
}

CheckboxList.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	disabled: PropTypes.bool,
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
	itemLabelAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
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
	iconAttributes: null,
	iconClassName: '',
	iconHeight: 16,
	iconWidth: 16,
	inputAttributes: null,
	itemLabelAttributes: null,
	labelClassName: '',
	labelKey: 'name',
	listAttributes: null,
	listClassName: '',
	listItemAttributes: null,
	listItemClassName: '',
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
