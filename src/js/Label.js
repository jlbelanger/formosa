import PropTypes from 'prop-types';
import React from 'react';

export default function Label({
	htmlFor,
	label,
	note,
	required,
	type,
	...otherProps
}) {
	let className = 'formosa-label';
	if (required) {
		className += ' formosa-label--required';
	}
	if (type === 'checkbox') {
		className += ' formosa-label--checkbox';
	} else if (type === 'has-many') {
		htmlFor = '';
	}

	const props = {};
	if (htmlFor) {
		props.htmlFor = htmlFor;
	}

	return (
		<>
			<label className={className} {...props} {...otherProps}>{label}</label>
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
