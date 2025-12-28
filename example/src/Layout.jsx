import '@jlbelanger/formosa/dist/formosa.css';
import './style.css';
import { NavLink, Outlet } from 'react-router';
import { FormContainer } from '@jlbelanger/formosa';

export default function Layout() {
	return (
		<main>
			<header id="header">
				<div id="title">Formosa</div>
				<a href="https://github.com/jlbelanger/formosa">GitHub</a>
			</header>

			<nav>
				<ul id="nav">
					<li className="nav__item">
						<NavLink className="nav__link" to="/">
							Basic
						</NavLink>
					</li>
					<li className="nav__item">
						<NavLink className="nav__link" to="/options">
							Options
						</NavLink>
					</li>
					<li className="nav__item">
						<NavLink className="nav__link" to="/extras">
							Extras
						</NavLink>
					</li>
					<li className="nav__item">
						<NavLink className="nav__link" to="/json-api-add">
							JSON:API Add
						</NavLink>
					</li>
					<li className="nav__item">
						<NavLink className="nav__link" to="/json-api-edit/1">
							JSON:API Edit
						</NavLink>
					</li>
				</ul>
			</nav>

			<FormContainer>
				<article>
					<Outlet />
				</article>
			</FormContainer>
		</main>
	);
}
