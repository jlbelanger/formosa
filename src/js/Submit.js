import PropTypes from 'prop-types';
import React from 'react';

export default function Submit({
	className,
	label,
	prefix,
	postfix,
	...otherProps
}) {
	return (
		<div className="formosa-field formosa-field--submit">
			<div className="formosa-label-wrapper formosa-label-wrapper--submit" />
			<div className="formosa-input-wrapper formosa-input-wrapper--submit">
				{prefix}
				<button
					className={`formosa-button formosa-button--submit ${className}`.trim()}
					type="submit"
					{...otherProps}
				>
					{label}
				</button>
				{postfix}
			</div>
		</div>
	);
}

Submit.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	prefix: PropTypes.node,
	postfix: PropTypes.node,
};

Submit.defaultProps = {
	className: '',
	label: 'Save',
	prefix: null,
	postfix: null,
};
