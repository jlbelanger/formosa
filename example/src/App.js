import './style.scss';
import '@jlbelanger/formosa/dist/index.css';
import { BrowserRouter } from 'react-router-dom';
import { FormContainer } from '@jlbelanger/formosa';
import React from 'react';
import Routes from './Routes';

export default function App() {
	return (
		<BrowserRouter>
			<main>
				<header>
					<h1>Formosa Example</h1>
				</header>

				<FormContainer>
					<article>
						<Routes />
					</article>
				</FormContainer>
			</main>
		</BrowserRouter>
	);
}
