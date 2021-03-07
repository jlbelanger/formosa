import React, { useState } from 'react';
import FormosaContext from './FormosaContext';
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
