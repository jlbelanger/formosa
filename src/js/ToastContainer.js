import React, { useContext } from 'react';
import FormosaContext from './FormosaContext';
import Toast from './Toast';

export default function ToastContainer() {
	const { formosaState } = useContext(FormosaContext);
	return (
		<div className="formosa-toast-container">
			{Object.keys(formosaState.toasts).map((id) => (
				<Toast
					className={formosaState.toasts[id].className}
					key={id}
					id={id}
					text={formosaState.toasts[id].text}
				/>
			))}
		</div>
	);
}
