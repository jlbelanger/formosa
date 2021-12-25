import React from 'react'; // eslint-disable-line import/no-unresolved
import { usePromiseTracker } from 'react-promise-tracker';

const Spinner = () => {
	const { promiseInProgress } = usePromiseTracker();
	if (!promiseInProgress) {
		return null;
	}
	return (
		<div className="formosa-spinner" />
	);
};

export default Spinner;
