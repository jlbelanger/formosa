import React, { useContext } from 'react';
import { ReactComponent as CheckIcon } from '../../svg/check.svg';
import FormContext from '../FormContext';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Checkbox({
	id,
	name,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	return (
		<>
			<Input
				checked={!!formState.row[name]}
				id={id || name}
				name={name}
				type="checkbox"
				{...otherProps}
			/>
			<CheckIcon className="formosa-field__check-icon" height="16" width="16" />
		</>
	);
}

Checkbox.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
	id: null,
};
