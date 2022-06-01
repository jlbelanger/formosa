import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved
import { usePromiseTracker } from 'react-promise-tracker';

export default function Spinner({ loadingText }) {
	const { promiseInProgress } = usePromiseTracker();
	if (!promiseInProgress) {
		return null;
	}
	return (
		<div className="formosa-spinner formosa-spinner--fullscreen">{loadingText}</div>
	);
}

Spinner.propTypes = {
	loadingText: PropTypes.string,
};

Spinner.defaultProps = {
	loadingText: 'Loading...',
};
