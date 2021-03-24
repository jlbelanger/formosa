import React, { useState } from 'react';
import FormContext from './FormContext';
import FormInner from './FormInner';
import PropTypes from 'prop-types';

export default function Form({
	children,
	row,
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
		</FormContext.Provider>
	);
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	row: PropTypes.object,
};

Form.defaultProps = {
	row: {},
};
