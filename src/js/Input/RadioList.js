import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';
import Radio from './Radio';

export default function RadioList({
	afterChange,
	labelKey,
	listAttributes,
	listClassName,
	listItemAttributes,
	listItemClassName,
	name,
	options,
	required,
	url,
	valueKey,
	...otherProps
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

	let selectedValue = get(formState.row, name);
	if (typeof selectedValue === 'object') {
		selectedValue = JSON.stringify(selectedValue);
	}

	const onChange = (e) => {
		let val = e.target.value;
		if (e.target.getAttribute('data-json') === 'true') {
			val = JSON.parse(val);
		}
		formState.setValues(formState, e, name, val, afterChange);
	};

	return (
		<ul className={`formosa-radio ${listClassName}`.trim()} {...listAttributes}>
			{optionValues && optionValues.map(({ label, value }) => {
				let val = value;
				let isJson = false;
				if (typeof val === 'object') {
					isJson = true;
					val = JSON.stringify(val);
				}
				return (
					<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={val} {...listItemAttributes}>
						<Radio
							checked={selectedValue === val}
							data-json={isJson}
							label={label}
							name={name}
							onChange={onChange}
							required={required}
							value={val}
							{...otherProps}
						/>
					</li>
				);
			})}
		</ul>
	);
}

RadioList.propTypes = {
	afterChange: PropTypes.func,
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
	required: PropTypes.bool,
	url: PropTypes.string,
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};

RadioList.defaultProps = {
	afterChange: null,
	labelKey: 'name',
	listAttributes: null,
	listClassName: '',
	listItemAttributes: null,
	listItemClassName: '',
	options: null,
	required: false,
	url: null,
	valueKey: null,
};
