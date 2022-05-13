import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	className,
	label,
	labelAttributes,
	labelClassName,
	name,
	value,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const onChange = (e) => {
		formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
	};
	const currentValue = get(formState.row, name);
	const checked = otherProps['data-json'] ? JSON.stringify(currentValue) === value : currentValue === value;

	return (
		<label className={`formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()} {...labelAttributes}>
			<input
				checked={checked}
				className={`formosa-field__input formosa-radio__input ${className}`.trim()}
				name={name}
				onChange={onChange}
				type="radio"
				value={value}
				{...otherProps}
			/>
			{label}
		</label>
	);
}

Radio.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	label: PropTypes.string,
	labelAttributes: PropTypes.object,
	labelClassName: PropTypes.string,
	name: PropTypes.string,
	value: PropTypes.string,
};

Radio.defaultProps = {
	afterChange: null,
	className: '',
	label: '',
	labelAttributes: null,
	labelClassName: '',
	name: '',
	value: '',
};
