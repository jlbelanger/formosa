import React, { useContext, useState } from 'react';
import { FormosaContext } from '@jlbelanger/formosa';

export default function Extras() {
	const { addToast } = useContext(FormosaContext);
	const [showFullscreenSpinner, setShowFullscreenSpinner] = useState(false);

	const onClickShowFullscreenSpinner = () => {
		setShowFullscreenSpinner(true);
		setTimeout(() => {
			setShowFullscreenSpinner(false);
		}, 1000);
	};

	const showToast = (e) => {
		addToast('Lorem ipsum dolor sit amet.', e.target.getAttribute('data-type'));
	};

	return (
		<>
			<h1>Extras</h1>

			<h2>Buttons</h2>
			<button className="formosa-button" type="button">Button</button>
			<button className="formosa-button formosa-button--success" type="button">Success</button>
			<button className="formosa-button formosa-button--warning" type="button">Warning</button>
			<button className="formosa-button formosa-button--danger" type="button">Danger</button>

			<h2>Messages</h2>
			<div className="formosa-message">Lorem ipsum dolor sit amet.</div>
			<div className="formosa-message formosa-message--success">Success: Lorem ipsum dolor sit amet.</div>
			<div className="formosa-message formosa-message--warning">Warning: Lorem ipsum dolor sit amet.</div>
			<div className="formosa-message formosa-message--error">Error: Lorem ipsum dolor sit amet.</div>

			<h2>Toasts</h2>
			<button className="formosa-button" onClick={showToast} type="button">
				Show Toast
			</button>
			<button className="formosa-button formosa-button--success" onClick={showToast} data-type="success" type="button">
				Show Success Toast
			</button>
			<button className="formosa-button formosa-button--warning" onClick={showToast} data-type="warning" type="button">
				Show Warning Toast
			</button>
			<button className="formosa-button formosa-button--danger" onClick={showToast} data-type="error" type="button">
				Show Error Toast
			</button>

			<h2>Spinners</h2>
			<button className="formosa-button" onClick={onClickShowFullscreenSpinner} type="button">Show Fullscreen Spinner</button>
			{showFullscreenSpinner && (<span className="formosa-spinner formosa-spinner--fullscreen" role="status">Loading...</span>)}
			<div style={{ display: 'inline-block', marginLeft: '1rem', verticalAlign: 'middle' }}>
				<span className="formosa-spinner" role="status">Loading...</span>
			</div>
		</>
	);
}
