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
	readOnly,
	setValue,
	url,
	value,
	valueKey,
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
	const [isLoading, setIsLoading] = useState(!!url);

	useEffect(() => {
		if (url) {
			Api.get(url, false)
				.then((response) => {
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
					setIsLoading(false);
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

				const optionProps = {};
				if (isJson) {
					optionProps['data-json'] = true;
				}
				if (name) {
					optionProps.name = `${name}[]`;
				}

				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={optionValueVal} {...listItemAttributes}>
						<div className="formosa-input-wrapper formosa-input-wrapper--checkbox">
							<label
								className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()}
								{...labelAttributes}
							>
								<input
									checked={checked}
									className={`formosa-field__input formosa-field__input--checkbox ${className}`.trim()}
									disabled={disabled}
									onChange={onChange}
									readOnly={readOnly}
									type="checkbox"
									value={optionValueVal}
									{...optionProps}
								/>
								<CheckIcon
									aria-hidden="true"
									className={`formosa-icon--check ${iconClassName}`.trim()}
									height={iconHeight}
									width={iconWidth}
									{...iconAttributes}
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
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
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
	readOnly: PropTypes.bool,
	setValue: PropTypes.func,
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
	readOnly: false,
	setValue: null,
	url: null,
	value: null,
	valueKey: null,
};
