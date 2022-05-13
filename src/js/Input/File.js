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
	disabled,
	emptyText,
	id,
	imageAttributes,
	imageClassName,
	imageHeight,
	imagePrefix,
	imagePreview,
	inputWrapperAttributes,
	inputWrapperClassName,
	linkAttributes,
	linkClassName,
	linkImage,
	multiple,
	name,
	readOnly,
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
		const files = e.target.files;
		const numFiles = files.length;
		const filenames = [];
		const newSrcs = [];
		let i;

		for (i = 0; i < numFiles; i += 1) {
			filenames.push(files.item(i).name);
			if (imagePreview) {
				newSrcs.push(URL.createObjectURL(files.item(i)));
			}
		}

		if (imagePreview) {
			setSrcs(newSrcs);
		}

		setText(filenames.join(', '));
		formState.setValues(formState, e, e.target.name, true, afterChange, multiple ? e.target.files : e.target.files.item(0));
	};

	const onRemove = (e) => {
		setText(emptyText);
		formState.setValues(formState, e, name, '', afterChange, false);
		document.getElementById(id || name).focus();
	};

	let prefixClassName = inputWrapperClassName;
	if (hasValue && !disabled && !readOnly) {
		prefixClassName += ' formosa-prefix';
	}

	return (
		<>
			{(hasValue && imagePreview) && (
				srcs.map((src) => {
					const img = (
						<img
							alt=""
							className={`formosa-file-image ${imageClassName}`.trim()}
							height={imageHeight}
							key={src}
							src={src}
							{...imageAttributes}
						/>
					);

					if (linkImage) {
						return (
							<a className={`formosa-file-link ${linkClassName}`.trim()} href={src} key={src} {...linkAttributes}>
								{img}
							</a>
						);
					}

					return img;
				})
			)}
			<div className={`formosa-file-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
				<div className={`formosa-file-input-wrapper ${prefixClassName}`.trim()} {...inputWrapperAttributes}>
					<div
						className={`formosa-file-name${text === emptyText ? ' formosa-file-name--empty' : ''}`}
						id={`${id || name}-name`}
					>
						{text}
					</div>
					{!readOnly && (
						<Input
							className={`formosa-field__input--file ${className}`.trim()}
							disabled={disabled}
							id={id || name}
							multiple={multiple}
							name={name}
							onChange={onChange}
							{...otherProps}
						/>
					)}
				</div>
				{hasValue && !disabled && !readOnly && (
					<button
						className={`formosa-button formosa-button--remove-file formosa-postfix ${buttonClassName}`.trim()}
						id={`${id || name}-remove`}
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
	disabled: PropTypes.bool,
	emptyText: PropTypes.string,
	id: PropTypes.string,
	imageAttributes: PropTypes.object,
	imageClassName: PropTypes.string,
	imageHeight: PropTypes.number,
	imagePrefix: PropTypes.string,
	imagePreview: PropTypes.bool,
	inputWrapperAttributes: PropTypes.object,
	inputWrapperClassName: PropTypes.string,
	linkAttributes: PropTypes.object,
	linkClassName: PropTypes.string,
	linkImage: PropTypes.bool,
	multiple: PropTypes.bool,
	name: PropTypes.string,
	readOnly: PropTypes.bool,
	removeText: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

File.defaultProps = {
	afterChange: null,
	buttonAttributes: null,
	buttonClassName: '',
	className: '',
	disabled: false,
	emptyText: 'No file selected.',
	id: '',
	imageAttributes: null,
	imageClassName: '',
	imageHeight: 100,
	imagePrefix: '',
	imagePreview: false,
	inputWrapperAttributes: null,
	inputWrapperClassName: '',
	linkAttributes: null,
	linkClassName: '',
	linkImage: false,
	multiple: false,
	name: '',
	readOnly: false,
	removeText: 'Remove',
	wrapperAttributes: null,
	wrapperClassName: '',
};
