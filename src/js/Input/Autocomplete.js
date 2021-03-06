import { filterByKey, normalizeOptions } from '../Helpers/Options';
import React, { useContext, useEffect, useState } from 'react';
import Api from '../Helpers/Api';
import { ReactComponent as CloseIcon } from '../../svg/x.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import getNewDirty from '../Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Autocomplete({
	afterChange,
	clearable,
	disabled,
	id,
	labelFn,
	labelKey,
	max,
	placeholder,
	name,
	options,
	url,
	valueKey,
	...otherProps
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [filter, setFilter] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : null);
	const [selectedValues, setSelectedValues] = useState(() => {
		let values = get(formState.row, name) || null;
		if (max === 1) {
			if (!values) {
				values = [];
			} else {
				values = [values];
			}
		} else if (!values) {
			values = [];
		}
		return values;
	});

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

	const isSelected = (option) => ((get(formState.row, name) || []).indexOf(option.value) > -1);

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
		const row = { ...formState.row };
		let newValues = get(row, name) || [];
		if (max === 1) {
			newValues = value;
		} else {
			newValues.push(value);
		}
		set(row, name, newValues);
		const newFormState = {
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			row,
		};
		setFormState(newFormState);

		if (max === 1) {
			setSelectedValues([value]);
		} else {
			setSelectedValues([...selectedValues, value]);
		}

		setIsOpen(false);
		setFilter('');
		if (max === 1) {
			const elem = document.getElementById(`${id || name}-wrapper`);
			if (elem) {
				elem.focus();
			}
		} else {
			focus();
		}

		if (afterChange) {
			afterChange({ target: { name } }, newFormState);
		}
	};

	const removeValue = (value) => {
		const row = { ...formState.row };
		let newValues = get(row, name);
		if (max !== 1) {
			const index = newValues.indexOf(value);
			newValues.splice(index, 1);
		} else {
			newValues = null;
		}
		set(row, name, newValues);
		const newFormState = {
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			row,
		};
		setFormState(newFormState);

		if (max === 1) {
			setSelectedValues([]);
		} else {
			const newSelectedValues = [...selectedValues];
			const index = newSelectedValues.indexOf(value);
			newSelectedValues.splice(index, 1);
			setSelectedValues(newSelectedValues);
		}

		focus();

		if (afterChange) {
			afterChange({ target: { name } }, newFormState);
		}
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
		}
	};

	const onKeyUp = (e) => {
		const filterValue = e.target.value;
		const numValues = selectedValues ? selectedValues.length : 0;
		if (e.key === 'Backspace' && !filterValue && selectedValues.length > 0) {
			removeValue(selectedValues[numValues - 1]);
		} else if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
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
		removeValue(JSON.parse(e.target.getAttribute('data-value')));
	};

	const clear = () => {
		const newRow = { ...formState.row };
		set(newRow, name, []);
		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			row: newRow,
		});

		setFilter('');
		setSelectedValues([]);
		focus();
	};

	const showClear = clearable && max !== 1 && selectedValues.length > 0;

	const className = ['formosa-autocomplete'];
	if (showClear) {
		className.push('formosa-autocomplete--clearable');
	}
	if (disabled) {
		className.push('formosa-autocomplete--disabled');
	}

	const canAddValues = !disabled && (max === null || selectedValues.length < max);

	return (
		<div
			className={className.join(' ')}
			data-value={JSON.stringify(get(formState.row, name))}
			id={`${id || name}-wrapper`}
			tabIndex={-1}
		>
			<div style={{ display: 'flex' }}>
				<ul className="formosa-autocomplete__values">
					{selectedValues && selectedValues.map((value) => (
						<li className="formosa-autocomplete__value" key={JSON.stringify(value)}>
							{labelFn ? labelFn(value) : value.label}
							{!disabled && (
								<button
									className="formosa-autocomplete__value__remove"
									data-value={JSON.stringify(value)}
									onClick={onClickRemoveOption}
									type="button"
								>
									<CloseIcon height="12" width="12" />
									Remove
								</button>
							)}
						</li>
					))}
					{canAddValues && (
						<li className="formosa-autocomplete__value formosa-autocomplete__value--input">
							<input
								{...otherProps}
								autoComplete="off"
								className="formosa-autocomplete__input"
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
					<ul className="formosa-autocomplete__options">
						{filteredOptions.map((option, index) => {
							const optionClassName = ['formosa-autocomplete__option'];
							if (highlightedIndex === index) {
								optionClassName.push('formosa-autocomplete__option--highlighted');
							}

							return (
								<li className={optionClassName.join(' ')} key={option.value}>
									<button
										className="formosa-autocomplete__option__button"
										data-value={JSON.stringify(option)}
										onClick={onClickOption}
										type="button"
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
						<button className="formosa-autocomplete__clear" onClick={clear} type="button">
							<CloseIcon height="12" width="12" />
							Clear
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

Autocomplete.propTypes = {
	afterChange: PropTypes.func,
	clearable: PropTypes.bool,
	disabled: PropTypes.bool,
	id: PropTypes.string,
	labelKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	labelFn: PropTypes.func,
	max: PropTypes.number,
	name: PropTypes.string.isRequired,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]),
	placeholder: PropTypes.string,
	url: PropTypes.string,
	valueKey: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};

Autocomplete.defaultProps = {
	afterChange: null,
	clearable: true,
	disabled: false,
	id: '',
	labelFn: null,
	labelKey: 'name',
	max: null,
	options: null,
	placeholder: 'Search',
	url: null,
	valueKey: null,
};
