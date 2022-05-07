import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import ConditionalWrapper from './ConditionalWrapper';
import FormContext from './FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Input({
	afterChange,
	className,
	id,
	name,
	suffix,
	type,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const onChange = (e) => {
		const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
		formState.setValues(formState, e, e.target.name, newValue, afterChange);
	};

	let value = '';
	if (type !== 'file') {
		value = get(formState.row, name);
		if (value === null || value === undefined) {
			value = '';
		}
	}

	const checked = type === 'checkbox' && value;

	const props = {};
	if (checked) {
		props.checked = checked;
	} else if (type === 'checkbox') {
		props.checked = false;
	}

	return (
		<ConditionalWrapper className="formosa-suffix-container" condition={suffix}>
			<input
				className={`formosa-field__input ${className}`.trim()}
				id={id || name}
				name={name}
				onChange={onChange}
				type={type}
				value={value}
				{...props}
				{...otherProps}
			/>
			{suffix && <span className="formosa-suffix">{suffix}</span>}
		</ConditionalWrapper>
	);
}

Input.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string,
	suffix: PropTypes.string,
	type: PropTypes.string,
};

Input.defaultProps = {
	afterChange: null,
	className: '',
	id: null,
	name: '',
	suffix: '',
	type: 'text',
};
