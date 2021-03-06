import React, { useContext } from 'react';
import { ReactComponent as CloseIcon } from '../svg/x.svg';
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';

export default function Toast({
	className,
	id,
	text,
}) {
	const { formosaState, setFormosaState } = useContext(FormosaContext);
	const removeToast = () => {
		const toasts = { ...formosaState.toasts };
		delete toasts[id];
		setFormosaState({ ...formosaState, toasts });
	};
	return (
		<div className={`formosa-toast ${className}`.trim()}>
			<div className="formosa-toast__text">{text}</div>
			<button className="formosa-toast__close" onClick={removeToast} type="button">
				<CloseIcon className="formosa-toast__close-icon" height="16" width="16" />
				Close
			</button>
		</div>
	);
}

Toast.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};

Toast.defaultProps = {
	className: '',
};
