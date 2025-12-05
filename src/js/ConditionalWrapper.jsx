import PropTypes from 'prop-types';
import React from 'react';

export default function ConditionalWrapper({
	children,
	condition = false,
	...props
}) {
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
