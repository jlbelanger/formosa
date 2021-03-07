import React, { useState } from 'react';
import FormContext from './FormContext';
import FormInner from './FormInner';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Form({
	afterSubmit,
	children,
	clearOnSubmit,
	defaultRow,
	hideMessage,
	id,
	filterBody,
	filterValuesBeforeSerialize,
	method,
	params,
	path,
	preventEmptyRequest,
	redirectOnSuccess,
	relationshipNames,
	row,
	style,
	successMessageText,
	successToastText,
	warnOnUnload,
}) {
	const [formState, setFormState] = useState({
		dirty: [],
		dirtyIncluded: {},
		errors: {},
		message: '',
		row,
		toasts: {},
	});

	return (
		<FormContext.Provider value={{ formState, setFormState }}>
			<FormInner
				afterSubmit={afterSubmit}
				clearOnSubmit={clearOnSubmit}
				defaultRow={defaultRow}
				hideMessage={hideMessage}
				id={id}
				filterBody={filterBody}
				filterValuesBeforeSerialize={filterValuesBeforeSerialize}
				method={method}
				params={params}
				path={path}
				preventEmptyRequest={preventEmptyRequest}
				redirectOnSuccess={redirectOnSuccess}
				relationshipNames={relationshipNames}
				style={style}
				successMessageText={successMessageText}
				successToastText={successToastText}
			>
				{children}
			</FormInner>
			{warnOnUnload && (
				<Prompt
					when={formState.dirty.length > 0}
					message="You have unsaved changes. Are you sure you want to leave this page?"
				/>
			)}
		</FormContext.Provider>
	);
}

Form.propTypes = {
	afterSubmit: PropTypes.func,
	children: PropTypes.node.isRequired,
	clearOnSubmit: PropTypes.bool,
	defaultRow: PropTypes.object,
	filterBody: PropTypes.func,
	filterValuesBeforeSerialize: PropTypes.func,
	hideMessage: PropTypes.bool,
	id: PropTypes.string,
	method: PropTypes.string.isRequired,
	params: PropTypes.string,
	path: PropTypes.string.isRequired,
	preventEmptyRequest: PropTypes.bool,
	redirectOnSuccess: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func,
	]),
	relationshipNames: PropTypes.array,
	row: PropTypes.object,
	style: PropTypes.object,
	successMessageText: PropTypes.string,
	successToastText: PropTypes.string,
	warnOnUnload: PropTypes.bool,
};

Form.defaultProps = {
	afterSubmit: () => {},
	clearOnSubmit: false,
	defaultRow: {},
	filterBody: null,
	filterValuesBeforeSerialize: null,
	hideMessage: false,
	id: '',
	params: '',
	preventEmptyRequest: false,
	redirectOnSuccess: null,
	relationshipNames: [],
	row: {},
	style: {},
	successMessageText: '',
	successToastText: '',
	warnOnUnload: false,
};
