import React, { useContext } from 'react';
import FormContext from './FormContext';
import get from 'get-value';
import getInputElement from './FieldInput';
import HasMany from './Input/HasMany';
import Label from './Label';
import PropTypes from 'prop-types';

export default function Field({
	component,
	id,
	inputWrapperAttributes,
	label,
	labelNote,
	labelPosition,
	name,
	note,
	prefix,
	postfix,
	required,
	suffix,
	type,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const inputProps = { ...otherProps };
	if (id) {
		inputProps.id = id;
	}
	if (name) {
		inputProps.name = name;
	}
	if (required) {
		inputProps.required = required;
	}
	if (suffix) {
		inputProps.suffix = suffix;
	}
	if (type) {
		inputProps.type = type;
	}
	let InputComponent = getInputElement(type, component);
	if (type === 'has-many') {
		// This prevents a dependency cycle.
		InputComponent = HasMany;
	}
	const input = (
		<InputComponent {...inputProps} />
	);

	if (type === 'hidden') {
		return input;
	}

	const labelComponent = (
		<Label
			htmlFor={id || name}
			label={label}
			note={labelNote}
			required={required}
			type={type}
		/>
	);

	const hasError = Object.prototype.hasOwnProperty.call(formState.errors, name);

	const wrapperClassNameList = ['formosa-field', `formosa-field--${name}`];
	if (wrapperClassName) {
		wrapperClassNameList.push(wrapperClassName);
	}
	if (hasError) {
		wrapperClassNameList.push('formosa-field--has-error');
	}
	if (prefix) {
		wrapperClassNameList.push('formosa-field--has-prefix');
	}
	if (postfix) {
		wrapperClassNameList.push('formosa-field--has-postfix');
	}
	if (labelPosition === 'after') {
		wrapperClassNameList.push('formosa-field--label-after');
	}

	const inputWrapperClassNameList = ['formosa-input-wrapper', `formosa-input-wrapper--${type}`];
	if (suffix) {
		inputWrapperClassNameList.push('formosa-field--has-suffix');
	}

	return (
		<div className={wrapperClassNameList.join(' ')} {...wrapperAttributes}>
			{label && labelPosition === 'before' && labelComponent}
			{label && labelPosition === 'after' && <div className="formosa-label-wrapper" />}
			<div className={inputWrapperClassNameList.join(' ')} {...inputWrapperAttributes}>
				{prefix}
				{input}
				{label && labelPosition === 'after' && labelComponent}
				{note && <div className="formosa-field__note">{typeof note === 'function' ? note(get(formState.row, name)) : note}</div>}
				{postfix}
				{hasError && <div className="formosa-field__error" id={`${id || name}-error`}>{formState.errors[name].join((<br />))}</div>}
			</div>
		</div>
	);
}

Field.propTypes = {
	component: PropTypes.func,
	id: PropTypes.string,
	inputWrapperAttributes: PropTypes.object,
	label: PropTypes.string,
	labelNote: PropTypes.string,
	labelPosition: PropTypes.string,
	name: PropTypes.string.isRequired,
	note: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
		PropTypes.string,
	]),
	prefix: PropTypes.node,
	postfix: PropTypes.node,
	required: PropTypes.bool,
	suffix: PropTypes.string,
	type: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	component: null,
	id: null,
	inputWrapperAttributes: {},
	label: '',
	labelNote: '',
	labelPosition: 'before',
	note: '',
	prefix: null,
	postfix: null,
	required: false,
	suffix: '',
	type: 'text',
	wrapperAttributes: {},
	wrapperClassName: '',
};
