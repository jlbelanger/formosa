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

	let wrapperClassName = 'formosa-label-wrapper';
	if (type === 'checkbox') {
		wrapperClassName += ' formosa-label-wrapper--checkbox';
	}

	const props = {};
	if (htmlFor && type !== 'has-many') {
		props.htmlFor = htmlFor;
	}

	return (
		<div className={wrapperClassName}>
			<label className={className} {...props} {...otherProps}>{label}</label>
			{note && <span className="formosa-label__note">{note}</span>}
		</div>
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
