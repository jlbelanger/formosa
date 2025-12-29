import Alert from './Alert.jsx';
import Api from './Helpers/Api.js';
import FormContext from './FormContext.jsx';
import FormosaContext from './FormosaContext.jsx';
import { getBody } from './Helpers/JsonApi.js';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // eslint-disable-line import/no-unresolved

export default function FormInner({ // eslint-disable-line complexity
	afterNoSubmit = null,
	beforeSubmit = null,
	children = null,
	clearOnSubmit = false,
	defaultRow = {},
	errorMessageText = '',
	errorToastText = '',
	filterBody = null,
	filterValues = null,
	htmlId = '',
	id = '',
	method = null,
	params = '',
	path = null,
	preventEmptyRequest = false,
	preventEmptyRequestText = 'No changes to save.',
	relationshipNames = [],
	showMessage = true,
	successMessageText = '',
	successToastText = '',
	...otherProps
}) {
	const { formState, setFormState, getDirtyKeys } = useContext(FormContext);
	const { addToast } = useContext(FormosaContext);

	const submitApiRequest = (e) => {
		e.preventDefault();

		const dirtyKeys = getDirtyKeys();
		if (preventEmptyRequest && dirtyKeys.length <= 0) {
			if (preventEmptyRequestText) {
				addToast(preventEmptyRequestText);
			}
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
			dirtyKeys,
			relationshipNames,
			filterBody,
			filterValues
		);

		setFormState({
			...formState,
			alertClass: '',
			alertText: '',
			errors: {},
			response: null,
			toastClass: '',
			toastText: '',
		});

		const bodyString = body instanceof FormData ? body : JSON.stringify(body);

		Api.request(method, url, bodyString)
			.catch((response) => {
				if (!Object.hasOwn(response, 'errors') || !Array.isArray(response.errors)) {
					// This is not a JSON:API-style error response.
					throw response;
				}

				const errors = {};
				let key;
				response.errors.forEach((error) => {
					if (Object.hasOwn(error, 'source')) {
						key = error.source.pointer.replace('/data/attributes/', '');
						key = key.replace('/data/meta/', 'meta.');
						if (key.startsWith('/included/')) {
							const i = key.replace(/^\/included\/(\d+)\/.+$/g, '$1');
							const includedRecord = body.included[parseInt(i, 10)];
							key = key.replace(/^\/included\/(\d+)\//g, `included.${includedRecord.type}.${includedRecord.id}.`);
						}
						key = key.replace(/\//g, '.');
						if (!document.querySelector(`[data-name="${key}"].formosa-field__error`)) {
							key = '';
						}
					} else {
						key = '';
					}
					if (!Object.hasOwn(errors, key)) {
						errors[key] = [];
					}
					errors[key].push(error.title);
				});

				setFormState({
					...formState,
					alertClass: 'error',
					alertText: typeof errorMessageText === 'function' ? errorMessageText(response) : errorMessageText,
					errors,
					response,
					toastClass: 'error',
					toastText: typeof errorToastText === 'function' ? errorToastText(response) : errorToastText,
					uuid: uuidv4(),
				});
			})
			.then((response) => {
				if (!response) {
					return;
				}

				const newState = {
					...formState,
					alertClass: 'success',
					alertText: typeof successMessageText === 'function' ? successMessageText(response) : successMessageText,
					errors: {},
					response,
					toastClass: 'success',
					toastText: typeof successToastText === 'function' ? successToastText(response) : successToastText,
					uuid: uuidv4(),
				};

				if (clearOnSubmit) {
					newState.originalRow = JSON.parse(JSON.stringify(defaultRow)); // Deep copy.
					newState.row = JSON.parse(JSON.stringify(defaultRow)); // Deep copy.
					if (formState.setRow) {
						formState.setRow(newState.row);
					}
				} else {
					newState.originalRow = JSON.parse(JSON.stringify(formState.row)); // Deep copy.
				}

				setFormState(newState);
			});
	};
	if (method && path && !Object.hasOwn(otherProps, 'onSubmit')) {
		otherProps.onSubmit = submitApiRequest;
	}
	if (htmlId) {
		otherProps.id = htmlId;
	}

	return (
		<form {...otherProps}>
			{showMessage && formState.alertText && (<Alert type={formState.alertClass}>{formState.alertText}</Alert>)}
			{children}
		</form>
	);
}

FormInner.propTypes = {
	afterNoSubmit: PropTypes.func,
	beforeSubmit: PropTypes.func,
	children: PropTypes.node,
	clearOnSubmit: PropTypes.bool,
	defaultRow: PropTypes.object,
	errorMessageText: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	errorToastText: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	filterBody: PropTypes.func,
	filterValues: PropTypes.func,
	htmlId: PropTypes.string,
	id: PropTypes.string,
	method: PropTypes.string,
	params: PropTypes.string,
	path: PropTypes.string,
	preventEmptyRequest: PropTypes.bool,
	preventEmptyRequestText: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string,
	]),
	relationshipNames: PropTypes.array,
	showMessage: PropTypes.bool,
	successMessageText: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
	successToastText: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
