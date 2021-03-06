import React, { useContext, useState } from 'react';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function HasMany({
	name,
	nameKey,
	recordType,
	removable,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [newValue, setNewValue] = useState('');
	const [tempId, setTempId] = useState(1);
	const values = formState.row[name] || [];
	const getNewDirty = () => {
		const newDirty = [...formState.dirty];
		if (!newDirty.includes(name)) {
			newDirty.push(name);
		}
		return newDirty;
	};
	const getNewDirtyIncluded = (type, id, key) => {
		const newDirtyIncluded = { ...formState.dirtyIncluded };
		if (!Object.prototype.hasOwnProperty.call(newDirtyIncluded, type)) {
			newDirtyIncluded[type] = {};
		}
		if (!Object.prototype.hasOwnProperty.call(newDirtyIncluded[type], id)) {
			newDirtyIncluded[type][id] = [];
		}
		if (!newDirtyIncluded[type][id].includes(key)) {
			newDirtyIncluded[type][id].push(key);
		}
		return newDirtyIncluded;
	};
	const onAdd = () => {
		if (!newValue) {
			return;
		}

		let newValues = [];
		if (formState.row[name]) {
			newValues = [...formState.row[name]];
		}
		newValues.push({
			id: `temp-${tempId}`,
			type: recordType,
			[nameKey]: newValue,
		});

		setFormState({
			...formState,
			dirty: getNewDirty(),
			dirtyIncluded: getNewDirtyIncluded(recordType, `temp-${tempId}`, nameKey),
			row: {
				...formState.row,
				[name]: newValues,
			},
		});
		setNewValue('');
		setTempId(tempId + 1);

		document.getElementById('new-value').focus();
	};
	const onChange = (e) => {
		const row = { ...formState.row };
		row[name] = [...row[name]];
		const id = e.target.getAttribute('data-id');
		const i = row[name].findIndex((value) => value.id === id);
		row[name][i][nameKey] = e.target.value;
		setFormState({
			...formState,
			dirty: getNewDirty(),
			dirtyIncluded: getNewDirtyIncluded(row[name][i].type, row[name][i].id, nameKey),
			row,
		});
	};
	const onChangeNewValue = (e) => {
		setNewValue(e.target.value);
	};
	const onKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			onAdd();
		}
	};
	const onRemove = (e) => {
		const newValues = [...formState.row[name]];
		const i = newValues.findIndex((value) => value.id === e.target.getAttribute('data-id'));
		if (i < 0) {
			return;
		}
		newValues.splice(i, 1);
		setFormState({
			...formState,
			dirty: getNewDirty(),
			row: {
				...formState.row,
				[name]: newValues,
			},
		});
	};

	return (
		<ul className="has-many-list">
			{values.map((value) => {
				let isRemovable = value.id.startsWith('temp-');
				if (!isRemovable && removable) {
					isRemovable = removable(value);
				}
				const key = `included.${value.type}.${value.id}.attributes.${nameKey}`;
				const hasError = Object.prototype.hasOwnProperty.call(formState.errors, key);
				return (
					<li className="has-many-list__item" key={value.id}>
						<div className={`${hasError ? 'field--has-error' : ''}`} style={{ display: 'flex' }}>
							<input
								className="field__input has-many-list__input prefix"
								data-id={value.id}
								name={key}
								onChange={onChange}
								required
								type="text"
								value={value[nameKey]}
							/>
							<button
								className="postfix button--danger"
								data-id={value.id}
								disabled={!isRemovable}
								onClick={onRemove}
								type="button"
							>
								Remove
							</button>
						</div>
						{hasError && <div className="field__error">{formState.errors[key].join((<br />))}</div>}
					</li>
				);
			})}
			<li className="has-many-list__item has-many-list__item--new">
				<input
					className="has-many-list__input prefix"
					id="new-value"
					onChange={onChangeNewValue}
					onKeyDown={onKeyDown}
					type="text"
					value={newValue}
				/>
				<button className="postfix" onClick={onAdd} type="button">Add</button>
			</li>
		</ul>
	);
}

HasMany.propTypes = {
	name: PropTypes.string.isRequired,
	nameKey: PropTypes.string.isRequired,
	recordType: PropTypes.string.isRequired,
	removable: PropTypes.func,
};

HasMany.defaultProps = {
	removable: null,
};
