import React, { useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import ToastContainer from './ToastContainer';

export default function FormContainer({ children, loadingText }) {
	const [formosaState, setFormosaState] = useState({
		toasts: {},
		showWarningPrompt: true,
	});

	const removeToast = (toastId) => {
		const toasts = { ...formosaState.toasts };
		delete toasts[toastId];
		setFormosaState({ ...formosaState, toasts });
	};

	const addToast = (text, type = '', milliseconds = 5000) => {
		const toastId = new Date().getTime();
		const toast = {
			className: type ? `formosa-toast--${type}` : '',
			text,
			milliseconds,
		};
		const toasts = {
			...formosaState.toasts,
			[toastId]: toast,
		};
		setFormosaState({ ...formosaState, toasts });
		setTimeout(() => {
			removeToast(toastId);
		}, milliseconds);
	};

	const disableWarningPrompt = () => {
		setFormosaState({ ...formosaState, showWarningPrompt: false });
	};

	const enableWarningPrompt = () => {
		setFormosaState({ ...formosaState, showWarningPrompt: true });
	};

	return (
		<FormosaContext.Provider
			value={{
				formosaState,
				setFormosaState,
				addToast,
				removeToast,
				disableWarningPrompt,
				enableWarningPrompt,
			}}
		>
			{children}
			<Spinner loadingText={loadingText} />
			<ToastContainer />
		</FormosaContext.Provider>
	);
}

FormContainer.propTypes = {
	children: PropTypes.node.isRequired,
	loadingText: PropTypes.string,
};

FormContainer.defaultProps = {
	loadingText: 'Loading...',
};
