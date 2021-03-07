import React, { useContext } from 'react';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function Textarea({
	className,
	id,
	name,
	required,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const onChange = (e) => {
		const newDirty = [...formState.dirty];
		if (!newDirty.includes(e.target.name)) {
			newDirty.push(e.target.name);
		}
		setFormState({
			...formState,
			dirty: newDirty,
			row: {
				...formState.row,
				[e.target.name]: e.target.value,
			},
		});
	};

	const props = {};
	if (required) {
		props.required = required;
	}

	return (
		<textarea
			className={`formosa-field__input ${className}`.trim()}
			id={id || name}
			name={name}
			onChange={onChange}
			value={formState.row[name] || ''}
			{...props}
		/>
	);
}

Textarea.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
};

Textarea.defaultProps = {
	className: '',
	id: null,
	required: false,
};
