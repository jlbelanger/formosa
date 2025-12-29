import BasicForm from './Examples/BasicForm.jsx';
import { createBrowserRouter } from 'react-router';
import Error404 from './Error404.jsx';
import Extras from './Examples/Extras.jsx';
import JsonApiAdd from './Examples/JsonApiAdd.jsx';
import JsonApiEdit from './Examples/JsonApiEdit.jsx';
import Layout from './Layout.jsx';
import NoForm from './Examples/NoForm.jsx';
import Options from './Examples/Options.jsx';

export default createBrowserRouter(
	[
		{
			path: '/',
			Component: Layout,
			children: [
				{
					index: true,
					Component: BasicForm,
				},
				{
					path: 'no-form',
					Component: NoForm,
				},
				{
					path: 'json-api-add',
					Component: JsonApiAdd,
				},
				{
					path: 'json-api-edit/:id',
					Component: JsonApiEdit,
				},
				{
					path: 'options',
					Component: Options,
				},
				{
					path: 'extras',
					Component: Extras,
				},
				{
					path: '*',
					Component: Error404,
				},
			],
		},
	]
);
