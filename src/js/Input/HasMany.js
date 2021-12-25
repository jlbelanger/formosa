import React, { useContext, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import getInputElement from '../FieldInput';
import getNewDirty from '../Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function HasMany({
	attributes,
	buttonClassName,
	name,
	recordType,
	removable,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [tempId, setTempId] = useState(1);
	const values = get(formState.row, name) || [];

	const onAdd = () => {
		const newValue = get(formState.row, `_new.${name}`);
		const hasNewValue = newValue && Object.keys(newValue).length > 0;
		if (!hasNewValue) {
			return;
		}

		newValue.id = `temp-${tempId}`;
		newValue.type = recordType;
		setTempId(tempId + 1);

		const newRow = { ...formState.row };
		const newValues = get(newRow, name) || [];
		newValues.push(newValue);

		set(newRow, name, newValues);
		set(newRow, `_new.${name}`, {});

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			dirtyIncluded: getNewDirty(formState.dirtyIncluded, `${newValue.type}.${newValue.id}`),
			row: newRow,
		});

		document.getElementById(`_new.${name}.${attributes[0].name}`).focus();
	};

	const onKeyDown = (e) => {
		if (e.key !== 'Enter') {
			return;
		}
		const newValue = get(formState.row, `_new.${name}`);
		const hasNewValue = newValue && Object.keys(newValue).length > 0;
		if (hasNewValue) {
			e.preventDefault();
			e.stopPropagation();
			onAdd();
		}
	};

	const onRemove = (e) => {
		const i = e.target.getAttribute('data-index');
		if (i < 0) {
			return;
		}

		const newRow = { ...formState.row };
		const newValues = get(newRow, name);
		newValues.splice(i, 1);

		set(newRow, name, newValues);

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			row: newRow,
		});
	};

	const afterChange = (e) => {
		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			dirtyIncluded: getNewDirty(formState.dirtyIncluded, e.target.getAttribute('data-unique-name')),
		});
	};

	const visibleAttributes = attributes.filter((attribute) => (attribute.type !== 'hidden'));
	const hiddenAttributes = attributes.filter((attribute) => (attribute.type === 'hidden'));
	hiddenAttributes.push({
		name: 'id',
		type: 'hidden',
	});
	hiddenAttributes.push({
		name: 'type',
		type: 'hidden',
	});
	const showHeader = visibleAttributes.some((attribute) => (attribute.label));

	return (
		<table className="formosa-has-many">
			{showHeader && (
				<thead className="formosa-has-many__head">
					<tr>
						{visibleAttributes.map((attribute) => (
							<th key={attribute.name}>{attribute.label}</th>
						))}
						<th />
					</tr>
				</thead>
			)}
			<tbody className="formosa-has-many__body">
				{values.map((value, i) => {
					let isRemovable = typeof removable === 'boolean' && removable;
					if (typeof removable === 'function') {
						isRemovable = removable(value);
					}
					const rowKey = `included.${value.type}.${value.id}`;
					return (
						<tr className="formosa-has-many__row" key={rowKey}>
							{visibleAttributes.map((attribute) => {
								const Component = getInputElement(attribute.type, attribute.component);
								const fieldKey = `${rowKey}.${attribute.name}`;
								const hasError = Object.prototype.hasOwnProperty.call(formState.errors, fieldKey);
								const className = ['formosa-has-many__column'];
								if (hasError) {
									className.push('formosa-field--has-error');
								}
								return (
									<td className={className.join(' ')} key={attribute.name}>
										<Component
											{...attribute}
											afterChange={afterChange}
											data-unique-name={`${name}.${value.id}.${attribute.name}`}
											name={`${name}.${i}.${attribute.name}`}
										/>
										{hasError && <div className="formosa-field__error">{formState.errors[rowKey].join((<br />))}</div>}
									</td>
								);
							})}
							<td className="formosa-has-many__column formosa-has-many__column--button">
								{hiddenAttributes.map((attribute) => {
									const Component = getInputElement(attribute.type, attribute.component);
									return (
										<Component
											{...attribute}
											key={attribute.name}
											name={`${name}.${i}.${attribute.name}`}
										/>
									);
								})}
								<button
									className={`formosa-button formosa-button--danger formosa-has-many__button ${buttonClassName}`.trim()}
									data-index={i}
									disabled={!isRemovable}
									onClick={onRemove}
									type="button"
								>
									Remove
								</button>
							</td>
						</tr>
					);
				})}
			</tbody>
			<tfoot className="formosa-has-many__foot">
				<tr className="formosa-has-many__row formosa-has-many__row--new">
					{visibleAttributes.map((attribute) => {
						const Component = getInputElement(attribute.type, attribute.component);
						return (
							<td className="formosa-has-many__column" key={attribute.name}>
								<Component
									{...attribute}
									name={`_new.${name}.${attribute.name}`}
									onKeyDown={onKeyDown}
								/>
							</td>
						);
					})}
					<td className="formosa-has-many__column formosa-has-many__column--button">
						{hiddenAttributes.map((attribute) => {
							const Component = getInputElement(attribute.type, attribute.component);
							return (
								<Component
									{...attribute}
									key={attribute.name}
									name={`_new.${name}.${attribute.name}`}
									onKeyDown={onKeyDown}
								/>
							);
						})}
						<button
							className={`formosa-button formosa-button--add formosa-has-many__button ${buttonClassName}`.trim()}
							onClick={onAdd}
							type="button"
						>
							Add
						</button>
					</td>
				</tr>
			</tfoot>
		</table>
	);
}

HasMany.propTypes = {
	attributes: PropTypes.array,
	buttonClassName: PropTypes.string,
	name: PropTypes.string.isRequired,
	recordType: PropTypes.string.isRequired,
	removable: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.func,
	]),
};

HasMany.defaultProps = {
	attributes: [],
	buttonClassName: '',
	removable: true,
};
