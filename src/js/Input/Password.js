import React, { useState } from 'react';
import Input from '../Input';

export default function Password({
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
				className="formosa-prefix"
				{...otherProps}
				type={tempType}
			/>
			<button className="formosa-button formosa-postfix formosa-button--toggle-password" onClick={togglePassword} type="button">
				{tempType === 'password' ? 'Show' : 'Hide'}
			</button>
		</>
	);
}
