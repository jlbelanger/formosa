import React, { useState } from 'react';
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import ToastContainer from './ToastContainer';

export default function FormContainer({ children }) {
	const [formosaState, setFormosaState] = useState({
		toasts: {},
	});

	return (
		<FormosaContext.Provider value={{ formosaState, setFormosaState }}>
			{children}
			<Spinner />
			<ToastContainer />
		</FormosaContext.Provider>
	);
}

FormContainer.propTypes = {
	children: PropTypes.node.isRequired,
};
