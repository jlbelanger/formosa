import React, { useState } from 'react'; // eslint-disable-line import/no-unresolved
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Password({
	buttonAttributes,
	buttonClassName,
	className,
	hideText,
	showText,
	wrapperAttributes,
	wrapperClassName,
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
				{...otherProps}
				type={tempType}
			/>
			<button
				className={`formosa-button formosa-postfix formosa-button--toggle-password ${buttonClassName}`.trim()}
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
	hideText: PropTypes.string,
	showText: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Password.defaultProps = {
	buttonAttributes: null,
	buttonClassName: '',
	className: '',
	hideText: 'Hide',
	showText: 'Show',
	wrapperAttributes: null,
	wrapperClassName: '',
};
