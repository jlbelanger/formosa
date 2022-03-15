import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import Api from './Helpers/Api';
import FormContext from './FormContext';
import FormosaContext from './FormosaContext';
import { getBody } from './Helpers/JsonApi';
import Message from './Message';
import PropTypes from 'prop-types';

export default function FormInner({
	afterNoSubmit,
	afterSubmit,
	beforeSubmit,
	children,
	clearOnSubmit,
	defaultRow,
	filterBody,
	filterValues,
	htmlId,
	id,
	method,
	params,
	path,
	preventEmptyRequest,
	relationshipNames,
	showMessage,
	successMessageText,
	successToastText,
	...otherProps
}) {
	const { formState, setFormState } = useContext(FormContext);
	const { formosaState } = useContext(FormosaContext);

	const submitApiRequest = (e) => {
		e.preventDefault();

		if (preventEmptyRequest && formState.dirty.length <= 0) {
			formosaState.addToast('No changes to save.');
			if (afterNoSubmit) {
				afterNoSubmit();
			}
			return;
		}

		if (beforeSubmit && !beforeSubmit(e)) {
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
			formState,
			relationshipNames,
			filterBody,
			filterValues
		);

		setFormState({
			...formState,
			errors: {},
			message: '',
		});

		Api.request(method, url, body)
			.then((response) => {
				if (!response) {
					return;
				}

				const newState = {
					...formState,
					dirty: [],
					dirtyIncluded: [],
					errors: {},
					message: successMessageText,
				};
				if (clearOnSubmit) {
					newState.row = defaultRow;
				}
				setFormState(newState);

				if (successToastText) {
					formosaState.addToast(successToastText, 'success');
				}
				if (afterSubmit) {
					afterSubmit(response);
				}
			})
			.catch((response) => {
				if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
					formosaState.addToast('Error.', 'error');
				} else if (Object.prototype.hasOwnProperty.call(response, 'message')) {
					formosaState.addToast(response.message, 'error', 10000);
					return;
				} else {
					formosaState.addToast('Server error.', 'error');
					throw response;
				}

				const errors = {};
				let key;
				response.errors.forEach((error) => {
					if (Object.prototype.hasOwnProperty.call(error, 'source')) {
						key = error.source.pointer.replace('/data/attributes/', '');
						key = key.replace('/data/meta/', 'meta.');
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
					message: '',
				});
			});
	};
	if (method && path && !Object.prototype.hasOwnProperty.call(otherProps, 'onSubmit')) {
		otherProps.onSubmit = submitApiRequest;
	}
	if (htmlId) {
		otherProps.id = htmlId;
	}

	return (
		<form {...otherProps}>
			{showMessage && <Message />}
			{children}
		</form>
	);
}

FormInner.propTypes = {
	afterNoSubmit: PropTypes.func,
	afterSubmit: PropTypes.func,
	beforeSubmit: PropTypes.func,
	children: PropTypes.node.isRequired,
	clearOnSubmit: PropTypes.bool,
	defaultRow: PropTypes.object,
	filterBody: PropTypes.func,
	filterValues: PropTypes.func,
	htmlId: PropTypes.string,
	id: PropTypes.string,
	method: PropTypes.string,
	params: PropTypes.string,
	path: PropTypes.string,
	preventEmptyRequest: PropTypes.bool,
	relationshipNames: PropTypes.array,
	showMessage: PropTypes.bool,
	successMessageText: PropTypes.string,
	successToastText: PropTypes.string,
};

FormInner.defaultProps = {
	afterNoSubmit: null,
	afterSubmit: null,
	beforeSubmit: null,
	clearOnSubmit: false,
	defaultRow: {},
	filterBody: null,
	filterValues: null,
	htmlId: '',
	id: '',
	method: null,
	params: '',
	path: null,
	preventEmptyRequest: false,
	relationshipNames: [],
	showMessage: true,
	successMessageText: '',
	successToastText: '',
};
