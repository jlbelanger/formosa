import React, { useContext } from 'react';
import Autocomplete from './Input/Autocomplete';
import Checkbox from './Input/Checkbox';
import Datetime from './Input/Datetime';
import FormContext from './FormContext';
import HasMany from './Input/HasMany';
import Input from './Input';
import Label from './Label';
import Password from './Input/Password';
import PropTypes from 'prop-types';
import RadioList from './Input/RadioList';
import Search from './Input/Search';
import Select from './Input/Select';
import Textarea from './Input/Textarea';

export default function Field({
	id,
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
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	let Component = Input;
	if (type === 'password') {
		Component = Password;
	} else if (type === 'select') {
		Component = Select;
	} else if (type === 'textarea') {
		Component = Textarea;
	} else if (type === 'radio') {
		Component = RadioList;
	} else if (type === 'checkbox') {
		Component = Checkbox;
	} else if (type === 'datetime') {
		Component = Datetime;
	} else if (type === 'search') {
		Component = Search;
	} else if (type === 'autocomplete') {
		Component = Autocomplete;
	} else if (type === 'has-many') {
		Component = HasMany;
	}
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
	const input = (
		<Component {...inputProps} />
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
		<div className={wrapperClassNameList.join(' ')}>
			{label && labelPosition === 'before' && labelComponent}
			{label && labelPosition === 'after' && <div className="formosa-label-wrapper" />}
			<div className={inputWrapperClassNameList.join(' ')}>
				{prefix}
				{input}
				{label && labelPosition === 'after' && labelComponent}
				{note && <div className="formosa-field__note">{note}</div>}
				{hasError && <div className="formosa-field__error">{formState.errors[name].join((<br />))}</div>}
				{postfix}
			</div>
		</div>
	);
}

Field.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	labelNote: PropTypes.string,
	labelPosition: PropTypes.string,
	name: PropTypes.string.isRequired,
	note: PropTypes.string,
	prefix: PropTypes.node,
	postfix: PropTypes.node,
	required: PropTypes.bool,
	suffix: PropTypes.string,
	type: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	id: null,
	label: '',
	labelNote: '',
	labelPosition: 'before',
	note: '',
	prefix: null,
	postfix: null,
	required: false,
	suffix: '',
	type: 'text',
	wrapperClassName: '',
};
