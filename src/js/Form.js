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
	const [formState, setFormState] = useState({
		dirtyKeys: (fs) => {
			const dirtyKeys = [];
			Object.keys(fs.row).forEach((key) => {
				let newValue = get(fs.row, key);
				if (typeof newValue !== 'string') {
					newValue = JSON.stringify(newValue);
				}

				let oldValue = get(fs.originalRow, key);
				if (typeof oldValue !== 'string') {
					oldValue = JSON.stringify(oldValue);
				}

				if (newValue !== oldValue) {
					dirtyKeys.push(key);
				}
			});
			return dirtyKeys;
		},
		errors: {},
		files: {},
		message: '',
		originalRow: { ...row },
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
