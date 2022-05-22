import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import Error from './Error';
import FormContext from './FormContext';
import get from 'get-value';
import getInputElement from './FieldInput';
import HasMany from './Input/HasMany';
import Label from './Label';
import PropTypes from 'prop-types';

export default function Field({
	component,
	disabled,
	id,
	inputWrapperAttributes,
	inputWrapperClassName,
	label,
	labelAttributes,
	labelClassName,
	labelNote,
	labelPosition,
	name,
	note,
	prefix,
	postfix,
	readOnly,
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
	if (disabled) {
		inputProps.disabled = disabled;
	}
	if (readOnly) {
		inputProps.readOnly = readOnly;
	}
	if (required) {
		inputProps.required = required;
	}
	if (suffix) {
		inputProps.suffix = suffix;
	}
	if (type) {
		inputProps.type = type;
		if (readOnly && type === 'number') {
			inputProps.type = 'text';
		}
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

	const htmlFor = id || name;

	const labelComponent = (
		<Label
			className={labelClassName}
			htmlFor={type === 'datetime' ? `${htmlFor}-month` : htmlFor}
			label={label}
			note={labelNote}
			required={required}
			type={type}
			{...labelAttributes}
		/>
	);

	const hasError = Object.prototype.hasOwnProperty.call(formState.errors, name);

	const cleanName = name.replace(/[^a-z0-9_-]/gi, '');
	const wrapperClassNameList = ['formosa-field', `formosa-field--${cleanName}`];
	if (wrapperClassName) {
		wrapperClassNameList.push(wrapperClassName);
	}
	if (hasError) {
		wrapperClassNameList.push('formosa-field--has-error');
	}
	if (disabled) {
		wrapperClassNameList.push('formosa-field--disabled');
	}
	if (readOnly) {
		wrapperClassNameList.push('formosa-field--read-only');
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
	if (inputWrapperClassName) {
		inputWrapperClassNameList.push(inputWrapperClassName);
	}
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
				{note && (
					<div className="formosa-field__note">
						{typeof note === 'function' ? note(get(formState.row, name), formState.row) : note}
					</div>
				)}
				{postfix}
				<Error id={id} name={name} />
			</div>
		</div>
	);
}

Field.propTypes = {
	component: PropTypes.func,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	inputWrapperAttributes: PropTypes.object,
	inputWrapperClassName: PropTypes.string,
	label: PropTypes.string,
	labelAttributes: PropTypes.object,
	labelClassName: PropTypes.string,
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
	readOnly: PropTypes.bool,
	required: PropTypes.bool,
	suffix: PropTypes.string,
	type: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	component: null,
	disabled: false,
	id: null,
	inputWrapperAttributes: {},
	inputWrapperClassName: '',
	label: '',
	labelAttributes: {},
	labelClassName: '',
	labelNote: '',
	labelPosition: 'before',
	note: '',
	prefix: null,
	postfix: null,
	readOnly: false,
	required: false,
	suffix: '',
	type: 'text',
	wrapperAttributes: {},
	wrapperClassName: '',
};
