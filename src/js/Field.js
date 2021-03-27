import React, { useContext } from 'react';
import Autocomplete from './Input/Autocomplete';
import Checkbox from './Input/Checkbox';
import ConditionalWrapper from './ConditionalWrapper';
import Datetime from './Input/Datetime';
import FormContext from './FormContext';
import HasMany from './Input/HasMany';
import Input from './Input';
import Label from './Label';
import Password from './Input/Password';
import PropTypes from 'prop-types';
import RadioList from './Input/RadioList';
import Select from './Input/Select';
import Textarea from './Input/Textarea';

export default function Field({
	id,
	label,
	labelPosition,
	name,
	note,
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
	} else if (type === 'autocomplete') {
		Component = Autocomplete;
	} else if (type === 'has-many') {
		Component = HasMany;
	}
	const input = (
		<Component
			id={id}
			name={name}
			required={required}
			suffix={suffix}
			type={type}
			{...otherProps}
		/>
	);

	if (type === 'hidden') {
		return input;
	}

	const labelComponent = (
		<Label
			htmlFor={id || name}
			label={label}
			note={note}
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
	if (postfix) {
		wrapperClassNameList.push('formosa-field--has-postfix');
	}

	const inputWrapperClassNameList = ['formosa-input-wrapper', `formosa-input-wrapper--${type}`];
	if (suffix) {
		inputWrapperClassNameList.push('formosa-field--has-suffix');
	}

	return (
		<div className={wrapperClassNameList.join(' ')}>
			{label && labelPosition === 'before' && labelComponent}
			{label && labelPosition === 'after' && <div className="formosa-label-wrapper" />}
			<ConditionalWrapper className="formosa-postfix-container" condition={postfix}>
				<div className={inputWrapperClassNameList.join(' ')}>
					{input}
					{label && labelPosition === 'after' && labelComponent}
					{hasError && <div className="formosa-field__error">{formState.errors[name].join((<br />))}</div>}
				</div>
				{postfix}
			</ConditionalWrapper>
		</div>
	);
}

Field.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	labelPosition: PropTypes.string,
	name: PropTypes.string.isRequired,
	note: PropTypes.string,
	postfix: PropTypes.node,
	required: PropTypes.bool,
	suffix: PropTypes.string,
	type: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	id: null,
	label: '',
	labelPosition: 'before',
	note: '',
	postfix: null,
	required: false,
	suffix: '',
	type: 'text',
	wrapperClassName: '',
};
