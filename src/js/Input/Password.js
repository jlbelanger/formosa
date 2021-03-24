import React, { useState } from 'react';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Password({
	className,
	...otherProps
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
				className={`${className} formosa-field__input--password formosa-prefix`.trim()}
				{...otherProps}
				type={tempType}
			/>
			<button className="formosa-button formosa-postfix formosa-button--toggle-password" onClick={togglePassword} type="button">
				{tempType === 'password' ? 'Show' : 'Hide'}
			</button>
		</>
	);
}

Password.propTypes = {
	className: PropTypes.string,
};

Password.defaultProps = {
	className: '',
};
