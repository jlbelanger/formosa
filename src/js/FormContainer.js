import React, { useMemo, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import ToastContainer from './ToastContainer';

export default function FormContainer({ children, loadingText = 'Loading...' }) {
	const [showWarningPrompt, setShowWarningPrompt] = useState(true);
	const [toasts, setToasts] = useState({});

	const removeToast = (toastId) => {
		const newToasts = { ...toasts };
		if (Object.prototype.hasOwnProperty.call(toasts, toastId)) {
			delete newToasts[toastId];
			setToasts(newToasts);
		}
	};

	const addToast = (text, type = '', milliseconds = 5000) => {
		const toastId = new Date().getTime();
		const toast = {
			className: type ? `formosa-toast--${type}` : '',
			text,
			milliseconds,
		};
		const newToasts = {
			...toasts,
			[toastId]: toast,
		};
		setToasts(newToasts);
		setTimeout(() => {
			removeToast(toastId);
		}, milliseconds);
	};

	const disableWarningPrompt = () => {
		setShowWarningPrompt(false);
	};

	const enableWarningPrompt = () => {
		setShowWarningPrompt(true);
	};

	const value = useMemo(() => ({
		toasts,
		showWarningPrompt,
		addToast,
		removeToast,
		disableWarningPrompt,
		enableWarningPrompt,
	}), [toasts, showWarningPrompt]);

	return (
		<FormosaContext.Provider value={value}>
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
