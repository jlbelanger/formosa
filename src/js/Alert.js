import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved

export default function Alert({ className, children, type, ...otherProps }) {
	if (!children) {
		return null;
	}

	let alertClass = 'formosa-alert';
	if (type) {
		alertClass += ` formosa-alert--${type}`;
	}
	if (className) {
		alertClass += ` ${className}`;
	}

	return (
		<div aria-live="polite" className={alertClass} role="alert" {...otherProps}>
			{children}
		</div>
	);
}

Alert.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	type: PropTypes.string,
};

Alert.defaultProps = {
	className: '',
	type: null,
};
