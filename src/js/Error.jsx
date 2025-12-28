import FormContext from './FormContext.jsx';
import PropTypes from 'prop-types';
import { useContext } from 'react';

export default function Error({
	id = null,
	name = '',
}) {
	const { formState } = useContext(FormContext);
	const hasError = formState && Object.hasOwn(formState.errors, name);

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
