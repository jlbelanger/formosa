import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import FormContext from '../FormContext';
import get from 'get-value';
import { normalizeOptions } from '../Helpers/Options';
import PropTypes from 'prop-types';
import Radio from './Radio';

export default function RadioList({
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

	return (
		<ul className={`formosa-radio ${listClassName}`.trim()} {...listAttributes}>
			{optionValues && optionValues.map(({ label, value }) => (
				<li className={`formosa-radio__item ${listItemClassName}`.trim()} key={value} {...listItemAttributes}>
					<Radio
						checked={get(formState.row, name) === value}
						label={label}
						name={name}
						required={required}
						value={value}
						{...otherProps}
					/>
				</li>
			))}
		</ul>
	);
}

RadioList.propTypes = {
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
