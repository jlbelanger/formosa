import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from './FormContext';
import PropTypes from 'prop-types';

export default function Error({
	id = null,
	name = '',
}) {
	const { formState } = useContext(FormContext);
	const hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);

	const props = {};
	if (name) {
		// Used for matching the attribute name from the API to this error element.
		props['data-name'] = name;
	}
	if (id || name) {
		props.id = `${id || name}-error`;
	}

	return (
		<div className="formosa-field__error" {...props}>
			{hasError && formState.errors[name].map((e) => (<div key={e}>{e}</div>))}
		</div>
	);
}

Error.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string,
};
