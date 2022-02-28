import { Route, Switch } from 'react-router-dom';
import BasicForm from './Examples/BasicForm';
import Error404 from './Error404';
import HorizontalForm from './Examples/HorizontalForm';
import JsonApiAdd from './Examples/JsonApiAdd';
import JsonApiEdit from './Examples/JsonApiEdit';
import Options from './Examples/Options';
import React from 'react';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/" component={BasicForm} />
			<Route exact path="/horizontal-form" component={HorizontalForm} />
			<Route exact path="/json-api-add" component={JsonApiAdd} />
			<Route exact path="/json-api-edit/:id" component={JsonApiEdit} />
			<Route exact path="/options" component={Options} />
			<Route component={Error404} />
		</Switch>
	);
}
