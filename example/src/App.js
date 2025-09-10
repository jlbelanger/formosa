import '@jlbelanger/formosa/src/style.css';
import './style.css';
import { BrowserRouter, NavLink } from 'react-router-dom';
import { FormContainer } from '@jlbelanger/formosa';
import React from 'react';
import Routes from './Routes';

export default function App() {
	return (
		<BrowserRouter>
			<main>
				<header id="header">
					<div id="title">Formosa</div>
					<a href="https://github.com/jlbelanger/formosa">GitHub</a>
				</header>

				<nav>
					<ul id="nav">
						<li className="nav__item">
							<NavLink activeClassName="nav__link--active" className="nav__link" exact to="/">
								Basic
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink activeClassName="nav__link--active" className="nav__link" to="/options">
								Options
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink activeClassName="nav__link--active" className="nav__link" to="/extras">
								Extras
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink activeClassName="nav__link--active" className="nav__link" to="/json-api-add">
								JSON:API Add
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink activeClassName="nav__link--active" className="nav__link" to="/json-api-edit/1">
								JSON:API Edit
							</NavLink>
						</li>
					</ul>
				</nav>

				<FormContainer>
					<article>
						<Routes />
					</article>
				</FormContainer>
			</main>
		</BrowserRouter>
	);
}
