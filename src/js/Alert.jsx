import PropTypes from 'prop-types';

export default function Alert({
	className = '',
	children,
	type = null,
	...otherProps
}) {
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
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	type: PropTypes.string,
};
