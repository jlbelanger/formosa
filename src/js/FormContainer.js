import React, { useEffect, useRef, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import ToastContainer from './ToastContainer';

export default function FormContainer({ children }) {
	const [formosaState, setFormosaState] = useState({
		addToast: null,
		removeToast: null,
		toasts: {},
	});

	const formosaStateRef = useRef(formosaState);
	formosaStateRef.current = formosaState;

	useEffect(() => {
		const removeToast = (toastId) => {
			const toasts = { ...formosaStateRef.current.toasts };
			delete toasts[toastId];
			setFormosaState({ ...formosaStateRef.current, toasts });
		};
		const addToast = (text, type = '', milliseconds = 5000) => {
			const toastId = new Date().getTime();
			const toast = {
				className: type ? `formosa-toast--${type}` : '',
				text,
				milliseconds,
			};
			const toasts = {
				...formosaStateRef.current.toasts,
				[toastId]: toast,
			};
			setFormosaState({ ...formosaStateRef.current, toasts });
			setTimeout(() => {
				formosaStateRef.current.removeToast(toastId);
			}, milliseconds);
		};
		setFormosaState({
			...formosaStateRef.current,
			addToast,
			removeToast,
		});
		return () => {};
	}, []);

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
