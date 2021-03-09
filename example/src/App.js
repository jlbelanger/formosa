import './style.scss';
import {
	Field,
	Form,
	FormContainer,
	Submit,
} from '@jlbelanger/formosa';
import React from 'react';

export default function App() {
	const row = {
		id: '123',
		name: 'John',
	};

	return (
		<main>
			<header>
				<h1>Formosa Example</h1>
			</header>

			<FormContainer>
				<Form>
					<h2>Basic form</h2>

					<Field
						label="Text"
						name="text"
						type="text"
					/>

					<Field
						label="Email"
						name="email"
						type="email"
					/>

					<Field
						label="Number"
						name="number"
						size={6}
						type="number"
					/>

					<Field
						label="Password"
						name="password"
						type="password"
					/>

					<Field
						label="Search"
						name="search"
						type="search"
					/>

					<Field
						label="Telephone"
						name="telephone"
						type="tel"
					/>

					<Field
						label="URL"
						name="url"
						type="url"
					/>

					<Field
						label="Textarea"
						name="textarea"
						type="textarea"
						rows={5}
					/>

					<Field
						label="Select"
						name="select"
						type="select"
						options={{
							apple: 'Apple',
							peach: 'Peach',
							banana: 'Banana',
							pear: 'Pear',
						}}
					/>

					<Field
						label="Checkbox"
						name="checkbox"
						type="checkbox"
					/>

					<Field
						label="Radio"
						name="radio"
						type="radio"
						options={{
							apple: 'Apple',
							peach: 'Peach',
							banana: 'Banana',
							pear: 'Pear',
						}}
					/>

					<Field
						label="Has many"
						name="has_many"
						type="has-many"
					/>

					<Submit />
				</Form>

				<hr />

				<Form method="POST" path="users">
					<h2>JSON:API add form</h2>
					<Field label="Name" name="name" type="text" />
					<Submit />
				</Form>

				<hr />

				<Form method="PUT" path="users" id={row.id} row={row}>
					<h2>JSON:API edit form</h2>
					<Field label="Name" name="name" type="text" />
					<Submit />
				</Form>

				<hr />

				<Form method="DELETE" path="users" id={row.id}>
					<h2>JSON:API delete form</h2>
					<Submit className="formosa-button--danger" label="Delete" />
				</Form>
			</FormContainer>
		</main>
	);
}
