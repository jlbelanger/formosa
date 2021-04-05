import React, { useContext } from 'react';
import FormContext from '../FormContext';
import get from 'get-value';
import getNewDirty from '../Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Textarea({
	className,
	id,
	name,
	...otherProps
}) {
	const { formState, setFormState } = useContext(FormContext);
	const onChange = (e) => {
		const newRow = { ...formState.row };
		set(newRow, e.target.name, e.target.value);

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, e.target.name),
			row: newRow,
		});
	};

	return (
		<textarea
			className={`formosa-field__input ${className}`.trim()}
			id={id || name}
			name={name}
			onChange={onChange}
			value={get(formState.row, name) || ''}
			{...otherProps}
		/>
	);
}

Textarea.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Textarea.defaultProps = {
	className: '',
	id: null,
};
