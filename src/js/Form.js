import React, { useEffect, useState } from 'react';
import FormContext from './FormContext';
import FormInner from './FormInner';
import getNewDirty from './Helpers/FormState';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Form({
	children,
	row,
	setRow,
	...otherProps
}) {
	const [formState, setFormState] = useState({
		dirty: [],
		dirtyIncluded: [],
		errors: {},
		message: '',
		row,
		setRow,
		setValues: (fs, e, name, value, afterChange) => {
			let newDirty = getNewDirty(fs.dirty, name);
			const newRow = { ...fs.row };
			set(newRow, name, value);

			if (afterChange) {
				const additionalChanges = afterChange(e, newRow);
				Object.keys(additionalChanges).forEach((key) => {
					set(newRow, key, additionalChanges[key]);
					newDirty = getNewDirty(newDirty, key);
				});
			}

			setFormState({
				...fs,
				dirty: newDirty,
				row: newRow,
			});
			fs.setRow(newRow);
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
	children: PropTypes.node.isRequired,
	row: PropTypes.object,
	setRow: PropTypes.func,
};

Form.defaultProps = {
	row: {},
	setRow: null,
};
