import React, { useContext, useRef } from 'react';
import Api from './Helpers/Api';
import FormContext from './FormContext';
import FormosaContext from './FormosaContext';
import { getBody } from './Helpers/JsonApi';
import Message from './Message';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

export default function FormInner({
	afterSubmit,
	children,
	clearOnSubmit,
	defaultRow,
	filterBody,
	filterValuesBeforeSerialize,
	hideMessage,
	id,
	method,
	params,
	path,
	preventEmptyRequest,
	redirectOnSuccess,
	relationshipNames,
	style,
	successMessageText,
	successToastText,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const formStateRef = useRef(formState);
	formStateRef.current = formState;

	const { formosaState, setFormosaState } = useContext(FormosaContext);
	const formosaStateRef = useRef(formosaState);
	formosaStateRef.current = formosaState;

	const history = useHistory();
	const removeToast = (toastId) => {
		const toasts = { ...formosaStateRef.current.toasts };
		delete toasts[toastId];
		setFormosaState({ ...formosaStateRef.current, toasts });
	};
	const addToast = (text, type = '') => {
		const toastId = new Date().getTime();
		const toast = {
			className: type ? `formosa-toast--${type}` : '',
			text,
		};
		const toasts = {
			...formosaStateRef.current.toasts,
			[toastId]: toast,
		};
		setFormosaState({ ...formosaStateRef.current, toasts });
		setTimeout(() => {
			removeToast(toastId);
		}, 4000);
	};
	const onSubmit = (e) => {
		e.preventDefault();

		if (method === 'DELETE' && !window.confirm('Are you sure you want to delete this?')) {
			return;
		}

		if (preventEmptyRequest && formStateRef.current.dirty.length <= 0) {
			addToast('No changes to save.');
			return;
		}

		let url = path;
		if (id) {
			url = `${path}/${id}`;
		}
		if (params) {
			url += `?${params}`;
		}

		const body = getBody(
			method,
			path,
			id,
			formStateRef.current,
			relationshipNames,
			filterBody,
			filterValuesBeforeSerialize
		);

		setFormState({
			...formStateRef.current,
			errors: {},
			message: '',
		});

		Api.request(method, url, body === null ? null : JSON.stringify(body))
			.then((response) => {
				if (!response) {
					return;
				}

				const newState = {
					...formStateRef.current,
					dirty: [],
					dirtyIncluded: {},
					errors: {},
					message: successMessageText,
				};
				if (clearOnSubmit) {
					newState.row = defaultRow;
				}
				setFormState(newState);

				if (redirectOnSuccess) {
					let redirectPath = redirectOnSuccess;
					if (typeof redirectPath === 'function') {
						redirectPath = redirectOnSuccess(response);
					}
					history.push(redirectPath);
				}
				if (successToastText) {
					addToast(successToastText, 'success');
				}
				afterSubmit(response);
			})
			.catch((response) => {
				if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
					addToast('Error.', 'error');
				} else {
					addToast('Server error.', 'error');
					throw response;
				}

				const errors = {};
				let key;
				response.errors.forEach((error) => {
					if (Object.prototype.hasOwnProperty.call(error, 'source')) {
						key = error.source.pointer.replace('/data/attributes/', '');
						if (key.startsWith('/included/')) {
							const i = key.replace(/^\/included\/(\d+)\/.+$/g, '$1');
							const includedRecord = body.included[parseInt(i, 10)];
							key = key.replace(/^\/included\/(\d+)\//g, `included.${includedRecord.type}.${includedRecord.id}.`);
							key = key.replace(/\//g, '.');
						}
						if (!document.querySelector(`[name="${key}"]`)) {
							key = '';
						}
					} else {
						key = '';
					}
					if (!Object.prototype.hasOwnProperty.call(errors, key)) {
						errors[key] = [];
					}
					errors[key].push(error.title);
				});
				setFormState({
					...formStateRef.current,
					errors,
					message: '',
				});
			});
	};

	return (
		<form onSubmit={onSubmit} style={style}>
			{!hideMessage && <Message />}
			{children}
		</form>
	);
}

FormInner.propTypes = {
	afterSubmit: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	clearOnSubmit: PropTypes.bool,
	defaultRow: PropTypes.object.isRequired,
	filterBody: PropTypes.func,
	filterValuesBeforeSerialize: PropTypes.func,
	hideMessage: PropTypes.bool,
	id: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	params: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
	preventEmptyRequest: PropTypes.bool,
	redirectOnSuccess: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	relationshipNames: PropTypes.array.isRequired,
	style: PropTypes.object.isRequired,
	successMessageText: PropTypes.string.isRequired,
	successToastText: PropTypes.string.isRequired,
};

FormInner.defaultProps = {
	clearOnSubmit: false,
	filterBody: null,
	filterValuesBeforeSerialize: null,
	hideMessage: false,
	preventEmptyRequest: false,
	redirectOnSuccess: null,
};
