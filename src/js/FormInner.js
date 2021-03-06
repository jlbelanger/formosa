import React, { useContext } from 'react';
import Api from './Helpers/Api';
import Flash from './Flash';
import FormContext from './FormContext';
import { getBody } from './Helpers/JsonApi';
import PropTypes from 'prop-types';
// import { toast } from 'react-toastify'; // TODO
import { useHistory } from 'react-router-dom';

export default function FormInner({
	afterSubmit,
	children,
	clearOnSubmit,
	defaultRow,
	filterBody,
	filterValuesBeforeSerialize,
	hideFlash,
	id,
	method,
	params,
	path,
	preventEmptyRequest,
	redirectOnSuccess,
	relationshipNames,
	style,
	successFlashMessage,
	successToastMessage,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const history = useHistory();
	const onSubmit = (e) => {
		e.preventDefault();

		if (method === 'DELETE') {
			if (!window.confirm('Are you sure you want to delete this?')) {
				return;
			}
		}

		let url = path;
		if (id) {
			url = `${path}/${id}`;
		}
		if (params) {
			url += `?${params}`;
		}

		if (preventEmptyRequest && formState.dirty.length <= 0) {
			// toast('No changes to save.'); // TODO
			return;
		}

		const body = getBody(
			method,
			path,
			id,
			formState,
			relationshipNames,
			filterBody,
			filterValuesBeforeSerialize,
		);
		setFormState({
			...formState,
			errors: {},
			flash: '',
		});

		Api.request(method, url, body === null ? null : JSON.stringify(body))
			.then((response) => {
				if (!response) {
					return;
				}

				const newState = {
					...formState,
					dirty: [],
					dirtyIncluded: {},
					errors: {},
					flash: successFlashMessage,
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
				if (successToastMessage) {
					// toast.success(successToastMessage); // TODO
				}
				afterSubmit(response);
			})
			.catch((response) => {
				if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
					// toast.error('Error.'); // TODO
				} else {
					// toast.error('Server error.'); // TODO
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
					...formState,
					errors,
					flash: '',
				});
			});
	};

	return (
		<form onSubmit={onSubmit} style={style}>
			{!hideFlash && <Flash />}
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
	hideFlash: PropTypes.bool,
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
	successFlashMessage: PropTypes.string.isRequired,
	successToastMessage: PropTypes.string.isRequired,
};

FormInner.defaultProps = {
	clearOnSubmit: false,
	filterBody: null,
	filterValuesBeforeSerialize: null,
	hideFlash: false,
	preventEmptyRequest: false,
	redirectOnSuccess: null,
};
