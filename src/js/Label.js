import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved

export default function Label({
	className,
	htmlFor,
	label,
	note,
	required,
	type,
	...otherProps
}) {
	let labelClassName = 'formosa-label';
	if (required) {
		labelClassName += ' formosa-label--required';
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
			<label className={`${labelClassName} ${className}`.trim()} {...props} {...otherProps}>{label}</label>
			{note && <span className="formosa-label__note">{note}</span>}
		</div>
	);
}

Label.propTypes = {
	className: PropTypes.string,
	htmlFor: PropTypes.string,
	label: PropTypes.string,
	note: PropTypes.string,
	required: PropTypes.bool,
	type: PropTypes.string,
};

Label.defaultProps = {
	className: '',
	htmlFor: '',
	label: '',
	note: '',
	required: false,
	type: '',
};
