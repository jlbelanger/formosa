import { filterByKey, normalizeOptions } from '../Helpers/Options.js';
import { useContext, useEffect, useRef, useState } from 'react';
import Api from '../Helpers/Api.js';
import CloseIcon from '../../svg/x.svg?react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext.jsx';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Autocomplete({ // eslint-disable-line complexity
	afterAdd = null,
	afterChange = null,
	clearable = true,
	clearButtonAttributes = null,
	clearButtonClassName = '',
	clearIconAttributes = null,
	clearIconHeight = 12,
	clearIconWidth = 12,
	clearText = 'Clear',
	disabled = false,
	id = '',
	inputAttributes = null,
	inputClassName = '',
	labelFn = null,
	labelKey = 'name',
	loadingText = 'Loading...',
	max = null,
	name = '',
	optionButtonAttributes = null,
	optionButtonClassName = '',
	optionLabelFn = null,
	optionListAttributes = null,
	optionListClassName = '',
	optionListItemAttributes = null,
	optionListItemClassName = '',
	options = null,
	placeholder = 'Search',
	readOnly = false,
	removeButtonAttributes = null,
	removeButtonClassName = '',
	removeIconAttributes = null,
	removeIconHeight = 12,
	removeIconWidth = 12,
	removeText = 'Remove',
	setValue = null,
	showLoading = false,
	url = null,
	value = null,
	valueKey = null,
	valueListItemAttributes = null,
	wrapperAttributes = null,
	wrapperClassName = '',
	...otherProps
}) {
	const { formState, setValues } = useContext(FormContext);
	const clearButtonRef = useRef(null);
	const inputRef = useRef(null);
	const hiddenInputRef = useRef(null);
	const removeButtonRef = useRef(null);
	const [filter, setFilter] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
	const [isLoading, setIsLoading] = useState(showLoading || Boolean(url));
	const [loadError, setLoadError] = useState('');
	const api = Api.instance();

	useEffect(() => {
		if (url) {
			api(url, false)
				.catch((error) => {
					if (Object.hasOwn(error, 'errors')) {
						setLoadError(error.errors.map((e) => (e.title)).join(' '));
						setIsLoading(false);
					}
				})
				.then((response) => {
					if (!response) {
						return;
					}
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
					setIsLoading(false);
				});
		}
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
	}, [options]);

	useEffect(() => {
		setIsLoading(showLoading);
	}, [showLoading]);

	if (isLoading) {
		return (<div className="formosa-spinner" role="status">{loadingText}</div>);
	}

	if (loadError) {
		return (<div className="formosa-field__error">{loadError}</div>);
	}

	let currentValue = null;
	if (setValue === null) {
		if (formState === undefined) {
			throw new Error('<Autocomplete> component must be inside a <Form> component.');
		}
		currentValue = get(formState.row, name);
	} else {
		currentValue = value;
	}
	if (currentValue === null || currentValue === undefined || currentValue === '') {
		currentValue = null;
	} else if (max === 1 && !Array.isArray(currentValue)) {
		currentValue = [currentValue];
	}
	const currentValueLength = currentValue ? currentValue.length : 0;

	const isSelected = (option) => {
		if (!currentValue) {
			return false;
		}
		return currentValue.findIndex((v) => {
			if (typeof v === 'object') {
				return JSON.stringify(v) === JSON.stringify(option.value);
			}
			return v === option.value;
		}) > -1;
	};

	let filteredOptions = [];
	if (filter) {
		filteredOptions = filterByKey(optionValues, 'label', filter);
		filteredOptions = filteredOptions.filter((option) => (!isSelected(option)));
	}

	const focus = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const addValue = (v) => {
		let newValue;
		if (max === 1) {
			newValue = v;
		} else if (currentValue) {
			newValue = [...currentValue, v];
		} else {
			newValue = [v];
		}

		const e = { target: hiddenInputRef.current };
		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange);
		}

		setIsOpen(false);
		setFilter('');
		focus();

		if (afterAdd) {
			afterAdd();
		}
	};

	const removeValue = (v) => {
		let newValue = [];
		if (currentValue) {
			newValue = [...currentValue];
		}
		if (max === 1) {
			newValue = '';
		} else {
			const index = newValue.indexOf(v);
			if (index > -1) {
				newValue.splice(index, 1);
			}
		}

		const e = { target: hiddenInputRef.current };
		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange);
		}

		focus();
	};

	const onChange = (e) => {
		setFilter(e.target.value);
	};

	const onFocus = () => {
		setHighlightedIndex(0);
		setIsOpen(filter.length > 0);
	};

	const onKeyDown = (e) => {
		const filterValue = e.target.value;
		if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
			e.preventDefault();
		} else if (e.key === 'Backspace' && !filter && currentValueLength > 0) {
			removeValue(currentValue[currentValueLength - 1]);
		}
	};

	const onKeyUp = (e) => {
		const filterValue = e.target.value;
		if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
			e.preventDefault();
			addValue(filteredOptions[highlightedIndex].value);
		} else if (e.key === 'ArrowDown') {
			if (highlightedIndex >= (filteredOptions.length - 1)) {
				setHighlightedIndex(0);
			} else {
				setHighlightedIndex(highlightedIndex + 1);
			}
		} else if (e.key === 'ArrowUp') {
			if (highlightedIndex > 0) {
				setHighlightedIndex(highlightedIndex - 1);
			} else {
				setHighlightedIndex(filteredOptions.length - 1);
			}
		} else if (e.key === 'Escape') {
			setIsOpen(false);
		} else {
			setHighlightedIndex(0);
			setIsOpen(filterValue.length > 0);
		}
	};

	const onClickOption = (e) => {
		let val = e.target.getAttribute('data-value');
		if (e.target.getAttribute('data-json') === 'true') {
			val = JSON.parse(val);
		}
		addValue(val);
	};

	const onClickRemoveOption = (e) => {
		let button = e.target;
		while (button && button.tagName.toUpperCase() !== 'BUTTON') {
			button = button.parentNode;
		}
		removeValue(currentValue[button.getAttribute('data-index')]);
	};

	const clear = () => {
		const newValue = [];

		const e = { target: hiddenInputRef.current };
		if (setValue) {
			setValue(newValue, e);
		} else {
			setValues(e, name, newValue, afterChange);
		}

		setFilter('');
		focus();
	};

	const showClear = clearable && max !== 1 && currentValueLength > 0 && !disabled && !readOnly;

	let className = ['formosa-autocomplete'];
	if (showClear) {
		className.push('formosa-autocomplete--clearable');
	}
	className = className.join(' ');

	const canAddValues = !disabled && !readOnly && (max === null || currentValueLength < max);

	const wrapperProps = {};
	if (id || name) {
		wrapperProps.id = `${id || name}-wrapper`;
	}

	return (
		<div
			className={`${className} ${wrapperClassName}`.trim()}
			data-value={JSON.stringify(max === 1 && currentValueLength > 0 ? currentValue[0] : currentValue)} /* For testing. */
			{...wrapperProps}
			{...wrapperAttributes}
		>
			<ul className="formosa-autocomplete__values">
				{currentValue && currentValue.map((v, index) => {
					let val = v;
					let isJson = false;
					if (typeof val === 'object') {
						val = JSON.stringify(val);
						isJson = true;
					}

					const option = optionValues.find((o) => (
						isJson ? JSON.stringify(o.value) === val : o.value === val
					));

					let label = '';
					if (labelFn) {
						label = labelFn(option || v);
					} else if (option && Object.hasOwn(option, 'label')) {
						label = option.label;
					}

					let valueListItemProps = {};
					if (typeof valueListItemAttributes === 'function') {
						valueListItemProps = valueListItemAttributes(option);
					} else if (valueListItemAttributes && typeof valueListItemAttributes === 'object') {
						valueListItemProps = valueListItemAttributes;
					}

					let removeButtonProps = {};
					if (typeof removeButtonAttributes === 'function') {
						removeButtonProps = removeButtonAttributes(option);
					} else if (removeButtonAttributes && typeof removeButtonAttributes === 'object') {
						removeButtonProps = removeButtonAttributes;
					}

					let removeIconProps = {};
					if (typeof removeIconAttributes === 'function') {
						removeIconProps = removeIconAttributes(option);
					} else if (removeIconAttributes && typeof removeIconAttributes === 'object') {
						removeIconProps = removeIconAttributes;
					}

					return (
						<li className="formosa-autocomplete__value formosa-autocomplete__value--item" key={val} {...valueListItemProps}>
							{label}
							{!disabled && !readOnly && (
								<button
									className={`formosa-autocomplete__value__remove ${removeButtonClassName}`.trim()}
									data-index={index}
									onClick={onClickRemoveOption}
									ref={removeButtonRef}
									type="button"
									{...removeButtonProps}
								>
									<CloseIcon aria-hidden="true" height={removeIconHeight} width={removeIconWidth} {...removeIconProps} />
									{removeText}
								</button>
							)}
						</li>
					);
				})}
				{canAddValues && (
					<li className="formosa-autocomplete__value formosa-autocomplete__value--input">
						<input
							{...inputAttributes}
							autoComplete="off"
							className={`formosa-field__input formosa-autocomplete__input ${inputClassName}`.trim()}
							id={id || name}
							onChange={onChange}
							onFocus={onFocus}
							onKeyDown={onKeyDown}
							onKeyUp={onKeyUp}
							placeholder={placeholder}
							ref={inputRef}
							type="text"
							value={filter}
						/>
					</li>
				)}
			</ul>

			{isOpen && filteredOptions.length > 0 && (
				<ul className={`formosa-autocomplete__options ${optionListClassName}`.trim()} {...optionListAttributes}>
					{filteredOptions.map((option, index) => {
						let optionClassName = ['formosa-autocomplete__option'];
						if (highlightedIndex === index) {
							optionClassName.push('formosa-autocomplete__option--highlighted');
						}
						optionClassName = optionClassName.join(' ');

						let val = option.value;
						let isJson = false;
						if (typeof val === 'object') {
							isJson = true;
							val = JSON.stringify(val);
						}

						let label = '';
						if (optionLabelFn) {
							label = optionLabelFn(option);
						} else if (option && Object.hasOwn(option, 'label')) {
							label = option.label;
						}

						let optionListItemProps = {};
						if (typeof optionListItemAttributes === 'function') {
							optionListItemProps = optionListItemAttributes(option);
						} else if (optionListItemAttributes && typeof optionListItemAttributes === 'object') {
							optionListItemProps = optionListItemAttributes;
						}

						let optionButtonProps = {};
						if (typeof optionButtonAttributes === 'function') {
							optionButtonProps = optionButtonAttributes(option);
						} else if (optionButtonAttributes && typeof optionButtonAttributes === 'object') {
							optionButtonProps = optionButtonAttributes;
						}

						return (
							<li
								className={`${optionClassName} ${optionListItemClassName}`.trim()}
								key={val}
								{...optionListItemProps}
							>
								<button
									className={`formosa-autocomplete__option__button ${optionButtonClassName}`.trim()}
									data-json={isJson}
									data-value={val}
									onClick={onClickOption}
									type="button"
									{...optionButtonProps}
								>
									{label}
								</button>
							</li>
						);
					})}
				</ul>
			)}

			{showClear && (
				<div>
					<button
						className={`formosa-autocomplete__clear ${clearButtonClassName}`.trim()}
						onClick={clear}
						ref={clearButtonRef}
						type="button"
						{...clearButtonAttributes}
					>
						<CloseIcon aria-hidden="true" height={clearIconHeight} width={clearIconWidth} {...clearIconAttributes} />
						{clearText}
					</button>
				</div>
			)}

			<input
				{...otherProps}
				name={name}
				ref={hiddenInputRef}
				type="hidden"
				value={filter}
			/>
		</div>
	);
}

Autocomplete.propTypes = {
	afterAdd: PropTypes.func,
	afterChange: PropTypes.func,
	clearButtonAttributes: PropTypes.object,
	clearButtonClassName: PropTypes.string,
	clearIconAttributes: PropTypes.object,
	clearIconHeight: PropTypes.number,
	clearIconWidth: PropTypes.number,
	clearText: PropTypes.string,
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	inputAttributes: PropTypes.object,
	inputClassName: PropTypes.string,
	labelFn: PropTypes.func,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	loadingText: PropTypes.string,
	max: PropTypes.number,
	name: PropTypes.string,
	optionButtonAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	optionButtonClassName: PropTypes.string,
	optionLabelFn: PropTypes.func,
	optionListAttributes: PropTypes.object,
	optionListClassName: PropTypes.string,
	optionListItemAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	optionListItemClassName: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	placeholder: PropTypes.string,
	readOnly: PropTypes.bool,
	removeButtonAttributes: PropTypes.object,
	removeButtonClassName: PropTypes.string,
	removeIconAttributes: PropTypes.object,
	removeIconHeight: PropTypes.number,
	removeIconWidth: PropTypes.number,
	removeText: PropTypes.string,
	setValue: PropTypes.func,
	showLoading: PropTypes.bool,
	url: PropTypes.string,
	value: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.number),
		PropTypes.arrayOf(PropTypes.object),
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.number,
		PropTypes.object,
		PropTypes.string,
	]),
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	valueListItemAttributes: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object,
	]),
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};
