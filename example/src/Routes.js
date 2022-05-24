import { Route, Switch } from 'react-router-dom';
import BasicForm from './Examples/BasicForm';
import Error404 from './Error404';
import HorizontalForm from './Examples/HorizontalForm';
import JsonApiAdd from './Examples/JsonApiAdd';
import JsonApiEdit from './Examples/JsonApiEdit';
import NoForm from './Examples/NoForm';
import Options from './Examples/Options';
import React from 'react';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/"><BasicForm /></Route>
			<Route exact path="/no-form"><NoForm /></Route>
			<Route exact path="/horizontal-form"><HorizontalForm /></Route>
			<Route exact path="/json-api-add"><JsonApiAdd /></Route>
			<Route exact path="/json-api-edit/:id"><JsonApiEdit /></Route>
			<Route exact path="/options"><Options /></Route>
			<Route><Error404 /></Route>
		</Switch>
	);
}
