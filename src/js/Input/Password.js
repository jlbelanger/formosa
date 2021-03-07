import React, { useState } from 'react';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Password({
	autoComplete,
	id,
	name,
	required,
}) {
	const [tempType, setTempType] = useState('password');

	const togglePassword = () => {
		if (tempType === 'password') {
			setTempType('text');
		} else {
			setTempType('password');
		}
	};

	return (
		<>
			<Input
				autoComplete={autoComplete}
				className="formosa-prefix"
				id={id}
				name={name}
				required={required}
				type={tempType}
			/>
			<button className="formosa-button formosa-postfix formosa-button--toggle-password" onClick={togglePassword} type="button">
				{tempType === 'password' ? 'Show' : 'Hide'}
			</button>
		</>
	);
}

Password.propTypes = {
	autoComplete: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
};

Password.defaultProps = {
	autoComplete: null,
	id: null,
	required: false,
};
