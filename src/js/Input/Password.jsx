import React, { useState } from 'react';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Password({
	buttonAttributes = null,
	buttonClassName = '',
	className = '',
	hideAria = 'Hide Password',
	hideText = 'Hide',
	showAria = 'Show Password',
	showText = 'Show',
	wrapperAttributes = null,
	wrapperClassName = '',
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
		<div className={`formosa-password-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
			<Input
				className={`formosa-field__input--password formosa-prefix ${className}`.trim()}
				spellCheck="false"
				{...otherProps}
				type={tempType}
			/>
			<button
				aria-controls={otherProps.id || otherProps.name}
				aria-label={tempType === 'password' ? showAria : hideAria}
				className={`formosa-button formosa-button--toggle-password formosa-postfix ${buttonClassName}`.trim()}
				onClick={togglePassword}
				type="button"
				{...buttonAttributes}
			>
				{tempType === 'password' ? showText : hideText}
			</button>
		</div>
	);
}

Password.propTypes = {
	buttonAttributes: PropTypes.object,
	buttonClassName: PropTypes.string,
	className: PropTypes.string,
	hideAria: PropTypes.string,
	hideText: PropTypes.string,
	showAria: PropTypes.string,
	showText: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};
