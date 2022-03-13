import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Textarea({
	afterChange,
	className,
	id,
	name,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const onChange = (e) => {
		formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
	};

	return (
		<textarea
			className={`formosa-field__input formosa-field__input--textarea ${className}`.trim()}
			id={id || name}
			name={name}
			onChange={onChange}
			value={get(formState.row, name) || ''}
			{...otherProps}
		/>
	);
}

Textarea.propTypes = {
	afterChange: PropTypes.func,
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Textarea.defaultProps = {
	afterChange: null,
	className: '',
	id: null,
};
