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
import Textarea from './Input/Textarea';

export default function Field({
	afterChange,
	autoComplete,
	className,
	id,
	inputMode,
	label,
	name,
	nameKey,
	note,
	options,
	pattern,
	postfix,
	recordType,
	removable,
	required,
	size,
	suffix,
	type,
	wrapperClassName,
}) {
	const { formState } = useContext(FormContext);
	let Component = Input;
	if (type === 'password') {
		Component = Password;
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
			afterChange={afterChange}
			autoComplete={autoComplete}
			className={className}
			id={id}
			inputMode={inputMode}
			name={name}
			nameKey={nameKey}
			options={options}
			pattern={pattern}
			recordType={recordType}
			removable={removable}
			required={required}
			size={size}
			suffix={suffix}
			type={type}
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

	return (
		<div className={`formosa-field ${wrapperClassName}${hasError ? ' formosa-field--has-error' : ''}${postfix ? ' formosa-field--with-postfix' : ''}`.trim()}>
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
	afterChange: PropTypes.func,
	autoComplete: PropTypes.string,
	className: PropTypes.string,
	id: PropTypes.string,
	inputMode: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string.isRequired,
	nameKey: PropTypes.string,
	note: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	pattern: PropTypes.string,
	postfix: PropTypes.node,
	recordType: PropTypes.string,
	removable: PropTypes.func,
	required: PropTypes.bool,
	size: PropTypes.number,
	suffix: PropTypes.string,
	type: PropTypes.string,
	wrapperClassName: PropTypes.string,
};

Field.defaultProps = {
	afterChange: null,
	autoComplete: '',
	className: '',
	id: null,
	inputMode: '',
	label: '',
	nameKey: 'name',
	note: '',
	options: [],
	pattern: '',
	postfix: null,
	recordType: null,
	removable: null,
	required: false,
	size: null,
	suffix: '',
	type: 'text',
	wrapperClassName: '',
};