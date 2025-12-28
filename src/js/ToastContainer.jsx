import FormosaContext from './FormosaContext.jsx';
import Toast from './Toast.jsx';
import { useContext } from 'react';

export default function ToastContainer() {
	const { toasts } = useContext(FormosaContext);
	return (
		<div className="formosa-toast-container">
			{Object.keys(toasts).map((id) => (
				<Toast
					className={toasts[id].className}
					id={id}
					key={id}
					milliseconds={toasts[id].milliseconds}
					text={toasts[id].text}
				/>
			))}
		</div>
	);
}
