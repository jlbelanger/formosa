import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import React from 'react';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
		</Switch>
	);
}
