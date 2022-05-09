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
	labelKey,
	listAttributes,
	listClassName,
	listItemAttributes,
	listItemClassName,
	name,
	options,
	readOnly,
	url,
	valueKey,
}) {
	const { formState } = useContext(FormContext);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : null);

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

	let selectedValues = get(formState.row, name) || [];
	selectedValues = selectedValues.map((value) => (typeof value === 'object' ? JSON.stringify(value) : value));

	const onChange = (e) => {
		let newValue = get(formState.row, name) || [];
		newValue = [...newValue];
		let val = e.target.value;

		if (e.target.checked) {
			if (e.target.getAttribute('data-json') === 'true') {
				val = JSON.parse(val);
			}
			newValue.push(val);
		} else {
			const index = selectedValues.indexOf(val);
			if (index > -1) {
				newValue.splice(index, 1);
			}
		}

		formState.setValues(formState, e, name, newValue, afterChange);
	};

	return (
		<ul className={`formosa-radio ${listClassName}`.trim()} {...listAttributes}>
			{optionValues && optionValues.map(({ label, value }, index) => {
				let val = value;
				let isJson = false;
				if (typeof val === 'object') {
					isJson = true;
					val = JSON.stringify(val);
				}
				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={val} {...listItemAttributes}>
						<div className="formosa-input-wrapper formosa-input-wrapper--checkbox">
							<input
								className={`formosa-field__input formosa-field__input--checkbox ${className}`.trim()}
								checked={selectedValues.includes(val)}
								data-json={isJson}
								disabled={disabled}
								id={`${name}-${index}`}
								name={`${name}[]`}
								onChange={onChange}
								readOnly={readOnly}
								type="checkbox"
								value={val}
							/>
							<CheckIcon
								className={`formosa-icon--check ${iconClassName}`.trim()}
								height={iconHeight}
								width={iconWidth}
								{...iconAttributes}
							/>
							<label className="formosa-radio__label" htmlFor={`${name}-${index}`}>
								{label}
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
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	listAttributes: PropTypes.object,
	listClassName: PropTypes.string,
	listItemAttributes: PropTypes.object,
	listItemClassName: PropTypes.string,
	name: PropTypes.string.isRequired,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	readOnly: PropTypes.bool,
	url: PropTypes.string,
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
	labelKey: 'name',
	listAttributes: null,
	listClassName: '',
	listItemAttributes: null,
	listItemClassName: '',
	options: null,
	readOnly: false,
	url: null,
	valueKey: null,
};
