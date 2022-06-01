import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	className,
	label,
	labelAttributes,
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
	url,
	value,
	valueKey,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
	const [isLoading, setIsLoading] = useState(!!url);
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

				const optionProps = {};
				if (isJson) {
					optionProps['data-json'] = true;
				}
				if (name) {
					optionProps.name = name;
				}

				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={optionValueVal} {...listItemAttributes}>
						<label
							className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()}
							{...labelAttributes}
						>
							<input
								checked={checked}
								className={`formosa-field__input formosa-radio__input ${className}`.trim()}
								onChange={onChange}
								required={required}
								type="radio"
								value={optionValueVal}
								{...optionProps}
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
	label: PropTypes.string,
	labelAttributes: PropTypes.object,
	labelClassName: PropTypes.string,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	listAttributes: PropTypes.object,
	listClassName: PropTypes.string,
	listItemAttributes: PropTypes.object,
	listItemClassName: PropTypes.string,
	loadingText: PropTypes.string,
	name: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	required: PropTypes.bool,
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
};

Radio.defaultProps = {
	afterChange: null,
	className: '',
	label: '',
	labelAttributes: null,
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
	url: null,
	value: null,
	valueKey: null,
};
