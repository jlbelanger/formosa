import React, { useContext, useEffect, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from './FormContext';
import FormInner from './FormInner';
import FormosaContext from './FormosaContext';
import get from 'get-value';
import PropTypes from 'prop-types';
import set from 'set-value';

export default function Form({
	afterSubmitFailure,
	afterSubmitSuccess,
	children,
	row,
	setRow,
	showInlineErrors,
	...otherProps
}) {
	const { addToast } = useContext(FormosaContext);

	const setOriginalValue = (fs, setFs, key, value) => {
		const newRow = { ...fs.originalRow };
		set(newRow, key, value);
		setFs({
			...fs,
			originalRow: JSON.parse(JSON.stringify(newRow)), // Deep copy.
		});
	};

	const [formState, setFormState] = useState({
		errors: {},
		files: {},
		messageClass: '',
		messageText: '',
		originalRow: JSON.parse(JSON.stringify(row)), // Deep copy.
		row,
		response: null,
		setOriginalValue,
		setRow,
		showInlineErrors,
		toastClass: '',
		toastText: '',
		uuid: null,
	});

	useEffect(() => {
		if (JSON.stringify(row) === JSON.stringify(formState.row)) {
			return;
		}
		setFormState({
			...formState,
			row,
		});
	});

	useEffect(() => {
		if (!formState.uuid) {
			return;
		}

		if (formState.toastText) {
			addToast(formState.toastText, formState.toastClass);
		}

		if (formState.messageClass === 'success' && afterSubmitSuccess) {
			afterSubmitSuccess(formState.response, formState, setFormState);
		} else if (formState.messageClass === 'error' && afterSubmitFailure) {
			afterSubmitFailure(formState.response, formState, setFormState);
		}
	}, [formState.uuid]);

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
					const oldIndex = oldValue ? oldValue.findIndex((o) => (o.id === newValue[newIndex].id)) : -1;
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

	const setValues = (e, name, value, afterChange = null, files = null) => {
		const newRow = { ...formState.row };
		set(newRow, name, value);

		if (afterChange) {
			const additionalChanges = afterChange(e, newRow, value);
			Object.keys(additionalChanges).forEach((key) => {
				set(newRow, key, additionalChanges[key]);
			});
		}

		const newFormState = {
			...formState,
			row: newRow,
		};
		if (files !== null) {
			set(newFormState, `files.${name}`, files);
		}

		setFormState(newFormState);
		if (formState.setRow) {
			formState.setRow(newRow);
		}
	};

	return (
		<FormContext.Provider
			value={{
				formState,
				setFormState,
				getDirtyKeys: () => (getDirtyKeys(formState.row, formState.originalRow)),
				setValues,
			}}
		>
			<FormInner {...otherProps}>
				{children}
			</FormInner>
		</FormContext.Provider>
	);
}

Form.propTypes = {
	afterSubmitFailure: PropTypes.func,
	afterSubmitSuccess: PropTypes.func,
	children: PropTypes.node,
	row: PropTypes.object,
	setRow: PropTypes.func,
	showInlineErrors: PropTypes.bool,
};

Form.defaultProps = {
	afterSubmitFailure: null,
	afterSubmitSuccess: null,
	children: null,
	row: {},
	setRow: null,
	showInlineErrors: true,
};
