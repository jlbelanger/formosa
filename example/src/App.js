import './style.scss';
import '@jlbelanger/formosa/dist/index.css';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Routes from './Routes';

export default function App() {
	return (
		<BrowserRouter>
			<main>
				<header>
					<h1>Formosa Example</h1>
				</header>

				<article>
					<Routes />
				</article>
			</main>
		</BrowserRouter>
	);
}
