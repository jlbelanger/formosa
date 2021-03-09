import React, { useContext } from 'react';
import Checkbox from './Input/Checkbox';
import ConditionalWrapper from './ConditionalWrapper';
import FormContext from './FormContext';
import HasMany from './Input/HasMany';
import Input from './Input';
import Label from './Label';
import Password from './Input/Password';
import PropTypes from 'prop-types';
import Radio from './Input/Radio';
import Select from './Input/Select';
import Textarea from './Input/Textarea';

export default function Field({
	id,
	label,
	name,
	note,
	postfix,
	required,
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
		Component = Radio;
	} else if (type === 'checkbox') {
		Component = Checkbox;
	} else if (type === 'has-many') {
		Component = HasMany;
	}
	const input = (
		<Component
			id={id}
			name={name}
			required={required}
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
	const showLabelBefore = type !== 'checkbox';

	const hasError = Object.prototype.hasOwnProperty.call(formState.errors, name);

	const wrapperClassNameList = ['formosa-field'];
	if (wrapperClassNameList) {
		wrapperClassNameList.push(wrapperClassName);
	}
	if (hasError) {
		wrapperClassNameList.push('formosa-field--has-error');
	}
	if (postfix) {
		wrapperClassNameList.push('formosa-field--has-postfix');
	}

	return (
		<div className={wrapperClassNameList.join(' ')}>
			{label && showLabelBefore && labelComponent}
			<ConditionalWrapper className="formosa-postfix-container" condition={postfix}>
				<div className={`formosa-field__input-wrapper formosa-field__input-wrapper--${type}`}>
					{input}
					{label && !showLabelBefore && labelComponent}
				</div>
				{postfix}
			</ConditionalWrapper>
			{hasError && <div className="formosa-field__error">{formState.errors[name].join((<br />))}</div>}
		</div>
	);
}

Field.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	note: PropTypes.string,
	postfix: PropTypes.node,
	required: PropTypes.bool,
	type: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	id: null,
	label: '',
	note: '',
	postfix: null,
	required: false,
	type: 'text',
	wrapperClassName: '',
};
