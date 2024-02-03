import React, { useContext, useEffect, useRef, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
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
	required,
	setValue,
	value,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState, setValues } = useContext(FormContext);
	const inputRef = useRef(null);

	let currentValue = '';
	if (setValue !== null) {
		currentValue = value;
	} else {
		if (formState === undefined) {
			throw new Error('<File> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	}
	if (currentValue === null || currentValue === undefined) {
		currentValue = '';
	}
	const hasValue = multiple ? currentValue.length > 0 : !!currentValue;

	const getFilenames = (v) => {
		if (v instanceof FileList) {
			const numFiles = v.length;
			const output = [];
			let i;
			for (i = 0; i < numFiles; i += 1) {
				output.push(v.item(i).name);
			}
			return output.join(', ');
		}
		if (Array.isArray(v)) {
			return v.join(', ');
		}
		if (typeof v === 'object') {
			return v.name;
		}
		return v;
	};

	const getSrcs = (v) => {
		const output = [];
		if (v instanceof FileList) {
			const numFiles = v.length;
			let i;
			for (i = 0; i < numFiles; i += 1) {
				output.push(URL.createObjectURL(v.item(i)));
			}
		} else if (Array.isArray(v)) {
			return v.map((v2) => (`${imagePrefix}${v2}`));
		} else if (typeof v === 'object') {
			output.push(URL.createObjectURL(v));
		} else if (typeof v === 'string') {
			output.push(`${imagePrefix}${v}`);
		}
		return output;
	};

	const [filenames, setFilenames] = useState(getFilenames(currentValue));
	const [srcs, setSrcs] = useState(getSrcs(currentValue));

	useEffect(() => {
		setFilenames(getFilenames(currentValue));
		setSrcs(getSrcs(currentValue));
	}, [currentValue]);

	const onChange = (e) => {
		const newFiles = multiple ? e.target.files : e.target.files.item(0);

		setFilenames(getFilenames(newFiles));
		if (imagePreview) {
			setSrcs(getSrcs(newFiles));
		}

		if (setValue) {
			setValue(newFiles, e);
		} else {
			setValues(e, name, newFiles, afterChange, newFiles);
		}
	};

	const onRemove = (e) => {
		setFilenames('');

		const newValue = '';
		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange, newValue);
		}

		inputRef.current.focus();
	};

	let prefixClassName = inputWrapperClassName;
	if (hasValue && !disabled && !readOnly) {
		prefixClassName += ' formosa-prefix';
	}

	const props = {};
	if (id || name) {
		props.id = id || name;
	}

	const hiddenProps = {};
	if (name) {
		hiddenProps.name = name;
	}

	const buttonProps = {};
	if (id || name) {
		buttonProps.id = `${id || name}-remove`;
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
						className={`formosa-file-name${!filenames ? ' formosa-file-name--empty' : ''}`}
						id={`${id || name}-name`}
					>
						{filenames || emptyText}
					</div>
					{!readOnly && (
						<>
							<input
								className={`formosa-field__input formosa-field__input--file ${className}`.trim()}
								disabled={disabled}
								multiple={multiple}
								onChange={onChange}
								ref={inputRef}
								type="file"
								{...props}
								{...otherProps}
							/>
							<input
								disabled={disabled}
								required={required}
								type="hidden"
								value={currentValue}
								{...hiddenProps}
							/>
						</>
					)}
				</div>
				{hasValue && !disabled && !readOnly && (
					<button
						className={`formosa-button formosa-button--remove-file formosa-postfix ${buttonClassName}`.trim()}
						onClick={onRemove}
						type="button"
						{...buttonProps}
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
	required: PropTypes.bool,
	setValue: PropTypes.func,
	value: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
		PropTypes.string,
	]),
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
	required: false,
	setValue: null,
	value: null,
	wrapperAttributes: null,
	wrapperClassName: '',
};
