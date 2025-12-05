import { Alert } from '@jlbelanger/formosa';
import React from 'react';

export default function Error404() {
	return (
		<Alert type="error">The requested URL was not found on this server.</Alert>
	);
}
