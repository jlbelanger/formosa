import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved

export default function ConditionalWrapper({ children, condition, ...props }) {
	if (!condition) {
		return children;
	}

	return (
		<div {...props}>
			{children}
		</div>
	);
}

ConditionalWrapper.propTypes = {
	children: PropTypes.node.isRequired,
	condition: PropTypes.any,
};

ConditionalWrapper.defaultProps = {
	condition: false,
};
