import PropTypes from 'prop-types';
import React from 'react';

export default function Label({
	htmlFor,
	label,
	note,
	required,
	type,
}) {
	let className = 'formosa-field__label';
	if (required) {
		className += ' formosa-field__label--required';
	}
	if (type === 'checkbox') {
		className += ' formosa-field__label--checkbox';
	}
	return (
		<>
			<label className={className} htmlFor={htmlFor}>{label}</label>
			{note && <small>{`(${note})`}</small>}
		</>
	);
}

Label.propTypes = {
	htmlFor: PropTypes.string,
	label: PropTypes.string,
	note: PropTypes.string,
	required: PropTypes.bool,
	type: PropTypes.string,
};

Label.defaultProps = {
	htmlFor: '',
	label: '',
	note: '',
	required: false,
	type: '',
};
