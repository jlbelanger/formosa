import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormosaContext from './FormosaContext';
import Toast from './Toast';

export default function ToastContainer() {
	const { toasts } = useContext(FormosaContext);
	return (
		<div className="formosa-toast-container">
			{Object.keys(toasts).map((id) => (
				<Toast
					className={toasts[id].className}
					key={id}
					id={id}
					milliseconds={toasts[id].milliseconds}
					text={toasts[id].text}
				/>
			))}
		</div>
	);
}
