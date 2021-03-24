import React, { useContext } from 'react';
import FormContext from '../FormContext';
import normalizeOptions from '../Helpers/Options';
import PropTypes from 'prop-types';
import Radio from './Radio';

export default function RadioList({
	name,
	nameKey,
	options,
	required,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const normalizedOptions = normalizeOptions(options, nameKey);
	const keys = Object.keys(normalizedOptions);

	return (
		<ul className="formosa-radio">
			{keys.map((value) => (
				<li className="formosa-radio__item" key={value}>
					<Radio
						checked={formState.row[name] === value}
						label={normalizedOptions[value]}
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
	name: PropTypes.string.isRequired,
	nameKey: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	required: PropTypes.bool,
};

RadioList.defaultProps = {
	nameKey: 'name',
	options: [],
	required: false,
};
