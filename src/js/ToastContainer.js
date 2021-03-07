import React, { useContext } from 'react';
import FormContext from './FormContext';
import Toast from './Toast';

export default function ToastContainer() {
	const { formState } = useContext(FormContext);
	return (
		<div className="formosa-toast-container">
			{Object.keys(formState.toasts).map((id) => (
				<Toast
					className={formState.toasts[id].className}
					key={id}
					id={id}
					text={formState.toasts[id].text}
				/>
			))}
		</div>
	);
}
