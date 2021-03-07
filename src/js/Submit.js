import PropTypes from 'prop-types';
import React from 'react';

export default function Submit({ className, label }) {
	return (
		<div className="formosa-field formosa-field--submit">
			<button className={`formosa-button formosa-button--submit ${className}`.trim()} type="submit">{label}</button>
		</div>
	);
}

Submit.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
};

Submit.defaultProps = {
	className: '',
	label: 'Save',
};
