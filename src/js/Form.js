import React, { useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from './FormContext';
import FormInner from './FormInner';
import get from 'get-value';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Form({
	children,
	row,
	setRow,
	...otherProps
}) {
	const getDirtyKeys = (r, originalRow) => {
		let dirtyKeys = [];

		Object.keys(r).forEach((key) => {
			// Get the old and new values.
			let oldValue = get(originalRow, key);
			let newValue = get(r, key);
			const isArray = Array.isArray(oldValue) || Array.isArray(newValue);

			if (isArray) {
				let itemDirtyKeys;
				Object.keys(newValue).forEach((newIndex) => {
					const oldIndex = oldValue.findIndex((o) => (o.id === newValue[newIndex].id));
					itemDirtyKeys = getDirtyKeys(newValue[newIndex], oldIndex > -1 ? oldValue[oldIndex] : {});
					itemDirtyKeys = itemDirtyKeys.map((k2) => `${key}.${newIndex}.${k2}`);
					dirtyKeys = dirtyKeys.concat(itemDirtyKeys);
				});
			}

			// Stringify for easier comparison.
			if (typeof oldValue !== 'string') {
				oldValue = JSON.stringify(oldValue);
			}
			if (typeof newValue !== 'string') {
				newValue = JSON.stringify(newValue);
			}

			if (newValue !== oldValue) {
				dirtyKeys.push(key);
			}
		});
		return dirtyKeys;
	};

	const [formState, setFormState] = useState({
		dirtyKeys: (fs) => getDirtyKeys(fs.row, fs.originalRow),
		errors: {},
		files: {},
		message: '',
		originalRow: JSON.parse(JSON.stringify(row)), // Deep copy.
		row,
		setRow,
		setValues: (fs, e, name, value, afterChange = null, files = null) => {
			const newRow = { ...fs.row };
			set(newRow, name, value);

			if (afterChange) {
				const additionalChanges = afterChange(e, newRow, value);
				Object.keys(additionalChanges).forEach((key) => {
					set(newRow, key, additionalChanges[key]);
				});
			}

			const newFormState = {
				...fs,
				row: newRow,
			};
			if (files !== null) {
				set(newFormState, `files.${name}`, files);
			}

			setFormState(newFormState);
			if (fs.setRow) {
				fs.setRow(newRow);
			}
		},
	});

	useEffect(() => {
		setFormState({
			...formState,
			row,
		});
	}, [row]);

	return (
		<FormContext.Provider value={{ formState, setFormState }}>
			<FormInner {...otherProps}>
				{children}
			</FormInner>
		</FormContext.Provider>
	);
}

Form.propTypes = {
	children: PropTypes.node,
	row: PropTypes.object,
	setRow: PropTypes.func,
};

Form.defaultProps = {
	children: null,
	row: {},
	setRow: null,
};
