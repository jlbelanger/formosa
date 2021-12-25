import React, { useState } from 'react'; // eslint-disable-line import/no-unresolved
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Password({
	className,
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
		<div className={`formosa-password-wrapper ${wrapperClassName}`.trim()}>
			<Input
				className={`${className} formosa-field__input--password formosa-prefix`.trim()}
				{...otherProps}
				type={tempType}
			/>
			<button className="formosa-button formosa-postfix formosa-button--toggle-password" onClick={togglePassword} type="button">
				{tempType === 'password' ? 'Show' : 'Hide'}
			</button>
		</div>
	);
}

Password.propTypes = {
	className: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

Password.defaultProps = {
	className: '',
	wrapperClassName: '',
};
