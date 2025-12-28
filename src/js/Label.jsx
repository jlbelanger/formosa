import PropTypes from 'prop-types';

export default function Label({
	className = '',
	htmlFor = '',
	label = '',
	note = '',
	required = false,
	type = '',
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

	const hasFieldset = ['radio', 'checkbox-list'].includes(type);
	const props = {};
	if (htmlFor && !hasFieldset) {
		props.htmlFor = htmlFor;
	}
	if (hasFieldset) {
		props['aria-hidden'] = true;
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
