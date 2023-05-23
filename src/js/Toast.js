import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as CloseIcon } from '../svg/x.svg';
import FormosaContext from './FormosaContext';
import PropTypes from 'prop-types';

export default function Toast({
	className,
	id,
	milliseconds,
	text,
}) {
	const { removeToast } = useContext(FormosaContext);

	return (
		<div aria-live="polite" className={`formosa-toast ${className}`.trim()} role="alert" style={{ animationDuration: `${milliseconds}ms` }}>
			<div className="formosa-toast__text">{text}</div>
			<button className="formosa-toast__close" onClick={() => (removeToast(id))} type="button">
				<CloseIcon aria-hidden="true" className="formosa-toast__close-icon" height={12} width={12} />
				Close
			</button>
		</div>
	);
}

Toast.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	milliseconds: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
};

Toast.defaultProps = {
	className: '',
};
