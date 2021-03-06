import PropTypes from 'prop-types';
import React from 'react';

export default function ConditionalWrapper({ children, className, condition }) {
	if (!condition) {
		return (
			<>
				{children}
			</>
		);
	}

	return (
		<div className={className}>
			{children}
		</div>
	);
}

ConditionalWrapper.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	condition: PropTypes.any,
};

ConditionalWrapper.defaultProps = {
	className: '',
	condition: false,
};
