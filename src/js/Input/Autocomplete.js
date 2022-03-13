import { filterByKey, normalizeOptions } from '../Helpers/Options';
import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import Api from '../Helpers/Api';
import { ReactComponent as CloseIcon } from '../../svg/x.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import PropTypes from 'prop-types';

export default function Autocomplete({
	afterAdd,
	afterChange,
	clearable,
	clearButtonAttributes,
	clearButtonClassName,
	clearIconAttributes,
	clearIconHeight,
	clearIconWidth,
	clearText,
	disabled,
	id,
	inputClassName,
	labelFn,
	labelKey,
	max,
	name,
	optionButtonAttributes,
	optionButtonClassName,
	optionListAttributes,
	optionListClassName,
	optionListItemAttributes,
	optionListItemClassName,
	options,
	placeholder,
	removeButtonAttributes,
	removeButtonClassName,
	removeIconAttributes,
	removeIconHeight,
	removeIconWidth,
	removeText,
	url,
	valueKey,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	const [filter, setFilter] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : null);

	let selectedValues = get(formState.row, name) || null;
	if (max === 1) {
		if (!selectedValues) {
			selectedValues = [];
		} else {
			selectedValues = [selectedValues];
		}
	} else if (!selectedValues) {
		selectedValues = [];
	}

	useEffect(() => {
		if (optionValues === null && url) {
			Api.get(url)
				.then((response) => {
					setOptionValues(normalizeOptions(response, labelKey, valueKey));
				});
		}
		return () => {};
	}, [url]);

	useEffect(() => {
		setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : null);
		return () => {};
	}, [options]);

	const isSelected = (option) => {
		const values = get(formState.row, name) || [];
		return values.findIndex((value) => (value.value === option.value)) > -1;
	};

	let filteredOptions = [];
	if (optionValues !== null && filter) {
		filteredOptions = filterByKey(optionValues, 'label', filter);
		filteredOptions = filteredOptions.filter((option) => (!isSelected(option)));
	}

	const focus = () => {
		setTimeout(() => {
			const elem = document.getElementById(id || name);
			if (elem) {
				elem.focus();
			}
		});
	};

	const addValue = (value) => {
		let newValue;
		if (max === 1) {
			newValue = value;

			selectedValues = [value];
		} else {
			newValue = get(formState.row, name);
			if (newValue) {
				newValue = [...newValue, value];
			} else {
				newValue = [value];
			}

			selectedValues = [...selectedValues, value];
		}

		const e = { target: { name } };
		formState.setValues(formState, e, name, newValue, afterChange);

		setIsOpen(false);
		setFilter('');
		if (max === 1) {
			setTimeout(() => {
				const elem = document.querySelector(`#${id || name}-wrapper .formosa-autocomplete__value__remove`);
				if (elem) {
					elem.focus();
				}
			});
		} else if (max === selectedValues.length) {
			setTimeout(() => {
				const elem = document.querySelector(`#${id || name}-wrapper .formosa-autocomplete__clear`);
				if (elem) {
					elem.focus();
				}
			});
		} else {
			focus();
		}

		if (afterAdd) {
			afterAdd();
		}
	};

	const removeValue = (value) => {
		let newValue = get(formState.row, name);
		if (max !== 1) {
			let index = newValue.indexOf(value);
			if (index > -1) {
				newValue.splice(index, 1);
			}

			const newSelectedValues = [...selectedValues];
			index = newSelectedValues.indexOf(value);
			if (index > -1) {
				newSelectedValues.splice(index, 1);
				selectedValues = newSelectedValues;
			}
		} else {
			newValue = null;

			selectedValues = [];
		}

		const e = { target: { name } };
		formState.setValues(formState, e, name, newValue, afterChange);

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
		const numValues = selectedValues ? selectedValues.length : 0;
		if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
			e.preventDefault();
		} else if (e.key === 'Backspace' && !filter && numValues > 0) {
			removeValue(selectedValues[numValues - 1]);
		}
	};

	const onKeyUp = (e) => {
		const filterValue = e.target.value;
		if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
			e.preventDefault();
			addValue(filteredOptions[highlightedIndex]);
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
		addValue(JSON.parse(e.target.getAttribute('data-value')));
	};

	const onClickRemoveOption = (e) => {
		let button = e.target;
		while (button && button.tagName.toUpperCase() !== 'BUTTON') {
			button = button.parentNode;
		}
		removeValue(selectedValues[button.getAttribute('data-index')]);
	};

	const clear = () => {
		const e = { target: { name } };
		formState.setValues(formState, e, name, [], afterChange);

		setFilter('');
		selectedValues = [];
		focus();
	};

	const showClear = clearable && max !== 1 && selectedValues.length > 0 && !disabled;

	let className = ['formosa-autocomplete'];
	if (showClear) {
		className.push('formosa-autocomplete--clearable');
	}
	if (disabled) {
		className.push('formosa-autocomplete--disabled');
	}
	className = className.join(' ');

	const canAddValues = !disabled && (max === null || selectedValues.length < max);

	const dataValue = JSON.stringify(get(formState.row, name));

	return (
		<div
			className={`${className} ${wrapperClassName}`.trim()}
			data-value={dataValue === undefined ? '' : dataValue}
			id={`${id || name}-wrapper`}
			{...wrapperAttributes}
		>
			<div style={{ display: 'flex' }}>
				<ul className="formosa-autocomplete__values">
					{selectedValues && selectedValues.map((value, i) => {
						let label;
						if (labelFn) {
							label = labelFn(value);
						} else if (Object.prototype.hasOwnProperty.call(value, 'label')) {
							label = value.label;
						} else {
							label = value;
						}
						return (
							<li className="formosa-autocomplete__value formosa-autocomplete__value--item" key={JSON.stringify(value)}>
								{label}
								{!disabled && (
									<button
										className={`formosa-autocomplete__value__remove ${removeButtonClassName}`.trim()}
										data-index={i}
										onClick={onClickRemoveOption}
										type="button"
										{...removeButtonAttributes}
									>
										<CloseIcon height={removeIconHeight} width={removeIconWidth} {...removeIconAttributes} />
										{removeText}
									</button>
								)}
							</li>
						);
					})}
					{canAddValues && (
						<li className="formosa-autocomplete__value formosa-autocomplete__value--input">
							<input
								{...otherProps}
								autoComplete="off"
								className={`formosa-field__input formosa-autocomplete__input ${inputClassName}`.trim()}
								id={id || name}
								onChange={onChange}
								onFocus={onFocus}
								onKeyDown={onKeyDown}
								onKeyUp={onKeyUp}
								placeholder={placeholder}
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

							return (
								<li
									className={`${optionClassName} ${optionListItemClassName}`.trim()}
									key={option.value}
									{...optionListItemAttributes}
								>
									<button
										className={`formosa-autocomplete__option__button ${optionButtonClassName}`.trim()}
										data-value={JSON.stringify(option)}
										onClick={onClickOption}
										type="button"
										{...optionButtonAttributes}
									>
										{option.label}
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
							type="button"
							{...clearButtonAttributes}
						>
							<CloseIcon height={clearIconHeight} width={clearIconWidth} {...clearIconAttributes} />
							{clearText}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

Autocomplete.propTypes = {
	afterAdd: PropTypes.func,
	afterChange: PropTypes.func,
	clearable: PropTypes.bool,
	clearButtonAttributes: PropTypes.object,
	clearButtonClassName: PropTypes.string,
	clearIconAttributes: PropTypes.object,
	clearIconHeight: PropTypes.number,
	clearIconWidth: PropTypes.number,
	clearText: PropTypes.string,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	inputClassName: PropTypes.string,
	labelFn: PropTypes.func,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	max: PropTypes.number,
	name: PropTypes.string.isRequired,
	optionButtonAttributes: PropTypes.object,
	optionButtonClassName: PropTypes.string,
	optionListAttributes: PropTypes.object,
	optionListClassName: PropTypes.string,
	optionListItemAttributes: PropTypes.object,
	optionListItemClassName: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	placeholder: PropTypes.string,
	removeButtonAttributes: PropTypes.object,
	removeButtonClassName: PropTypes.string,
	removeIconAttributes: PropTypes.object,
	removeIconHeight: PropTypes.number,
	removeIconWidth: PropTypes.number,
	removeText: PropTypes.string,
	url: PropTypes.string,
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Autocomplete.defaultProps = {
	afterAdd: null,
	afterChange: null,
	clearable: true,
	clearButtonAttributes: null,
	clearButtonClassName: '',
	clearIconAttributes: null,
	clearIconHeight: 12,
	clearIconWidth: 12,
	clearText: 'Clear',
	disabled: false,
	id: '',
	inputClassName: '',
	labelFn: null,
	labelKey: 'name',
	max: null,
	optionButtonAttributes: null,
	optionButtonClassName: '',
	optionListAttributes: null,
	optionListClassName: '',
	optionListItemAttributes: null,
	optionListItemClassName: '',
	options: null,
	placeholder: 'Search',
	removeButtonAttributes: null,
	removeButtonClassName: '',
	removeIconAttributes: null,
	removeIconHeight: 12,
	removeIconWidth: 12,
	removeText: 'Remove',
	url: null,
	valueKey: null,
	wrapperAttributes: null,
	wrapperClassName: '',
};
