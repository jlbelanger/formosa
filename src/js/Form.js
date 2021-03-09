import React, { useState } from 'react';
import FormContext from './FormContext';
import FormInner from './FormInner';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Form({
	children,
	row,
	warnOnUnload,
	...otherProps
}) {
	const [formState, setFormState] = useState({
		dirty: [],
		dirtyIncluded: {},
		errors: {},
		message: '',
		row,
		toasts: {},
	});

	return (
		<FormContext.Provider value={{ formState, setFormState }}>
			<FormInner {...otherProps}>
				{children}
			</FormInner>
			{warnOnUnload && (
				<Prompt
					when={formState.dirty.length > 0}
					message="You have unsaved changes. Are you sure you want to leave this page?"
				/>
			)}
		</FormContext.Provider>
	);
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	row: PropTypes.object,
	warnOnUnload: PropTypes.bool,
};

Form.defaultProps = {
	row: {},
	warnOnUnload: false,
};
