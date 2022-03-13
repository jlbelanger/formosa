import React, { useContext, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function File({
	afterChange,
	buttonAttributes,
	buttonClassName,
	className,
	emptyText,
	id,
	imageHeight,
	imagePrefix,
	imagePreview,
	inputWrapperAttributes,
	inputWrapperClassName,
	multiple,
	name,
	removeText,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const value = get(formState.row, name);
	const hasValue = !!value;
	const [text, setText] = useState(value || emptyText);
	const [srcs, setSrcs] = useState(value ? [`${imagePrefix}${value}`] : []);

	const onChange = (e) => {
		const files = [...e.target.files];
		const filenames = files.map((file) => file.name).join(', ');

		if (imagePreview) {
			setSrcs(files.map((file) => (URL.createObjectURL(file))));
		}

		setText(filenames);
		formState.setValues(formState, e, e.target.name, true, afterChange, multiple ? files : files[0]);
	};

	const onRemove = (e) => {
		setText(emptyText);
		formState.setValues(formState, e, name, '', afterChange, false);
		document.getElementById(id || name).focus();
	};

	return (
		<>
			{(hasValue && imagePreview) && (
				srcs.map((src) => (
					<img alt="" height={imageHeight} key={src} src={src} />
				))
			)}
			<div className={`formosa-file-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
				<div className={`formosa-file-input-wrapper ${inputWrapperClassName}`.trim()} {...inputWrapperAttributes}>
					<div className={`formosa-file-name${text === emptyText ? ' formosa-file-name--empty' : ''}`}>
						{text}
					</div>
					<Input
						className={`formosa-field__input--file ${className}`.trim()}
						id={id || name}
						multiple={multiple}
						name={name}
						onChange={onChange}
						{...otherProps}
					/>
				</div>
				{hasValue && (
					<button
						className={`formosa-button formosa-button--remove-file formosa-postfix ${buttonClassName}`.trim()}
						onClick={onRemove}
						type="button"
						{...buttonAttributes}
					>
						{removeText}
					</button>
				)}
			</div>
		</>
	);
}

File.propTypes = {
	afterChange: PropTypes.func,
	buttonAttributes: PropTypes.object,
	buttonClassName: PropTypes.string,
	className: PropTypes.string,
	emptyText: PropTypes.string,
	id: PropTypes.string,
	imageHeight: PropTypes.number,
	imagePrefix: PropTypes.string,
	imagePreview: PropTypes.bool,
	inputWrapperAttributes: PropTypes.object,
	inputWrapperClassName: PropTypes.string,
	multiple: PropTypes.bool,
	name: PropTypes.string,
	removeText: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

File.defaultProps = {
	afterChange: null,
	buttonAttributes: null,
	buttonClassName: '',
	className: '',
	emptyText: 'No file selected.',
	id: '',
	imageHeight: 100,
	imagePrefix: '',
	imagePreview: false,
	inputWrapperAttributes: null,
	inputWrapperClassName: '',
	multiple: false,
	name: '',
	removeText: 'Remove',
	wrapperAttributes: null,
	wrapperClassName: '',
};
