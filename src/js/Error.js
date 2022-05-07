import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from './FormContext';
import PropTypes from 'prop-types';

export default function Error({
	id,
	name,
}) {
	const { formState } = useContext(FormContext);
	const hasError = Object.prototype.hasOwnProperty.call(formState.errors, name);

	return (
		<div className="formosa-field__error" data-name={name} id={`${id || name}-error`}>
			{hasError && formState.errors[name].map((e) => (<div key={e}>{e}</div>))}
		</div>
	);
}

Error.propTypes = {
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Error.defaultProps = {
	id: null,
};
