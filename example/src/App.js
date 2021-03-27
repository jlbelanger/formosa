import './style.scss';
import {
	Api,
	Field,
	Form,
	FormContainer,
	Submit,
} from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';

export default function App() {
	const [row, setRow] = useState(null);
	const [rows, setRows] = useState(null);
	useEffect(() => {
		if (rows === null) {
			Api.get('food.json')
				.then((response) => {
					setRows(response);
				});
		}
		if (row === null) {
			Api.get('food/1.json')
				.then((response) => {
					setRow(response);
				});
		}
		return () => {};
	});

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
						label="Select array"
						name="select_array"
						type="select"
						options={[
							'Apple',
							'Peach',
							'Banana',
							'Pear',
						]}
					/>

					<Field
						label="Select from API"
						name="select_api"
						type="select"
						options={rows}
					/>

					<Field
						label="Checkbox"
						name="checkbox"
						type="checkbox"
					/>

					<Field
						label="Datetime"
						name="datetime"
						type="datetime"
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
						label="Radio array"
						name="radio_array"
						type="radio"
						options={[
							'Apple',
							'Peach',
							'Banana',
							'Pear',
						]}
					/>

					<Field
						label="Radio from API"
						name="radio_api"
						type="radio"
						options={rows}
					/>

					<Field
						label="Has many"
						name="has_many"
						type="has-many"
					/>

					<Submit />
				</Form>

				<hr />

				<Form>
					<h2>Horizontal form</h2>
					<div className="formosa-fields">
						<Field label="First name" name="first_name" type="text" />
						<Field label="Last name" name="last_name" type="text" />
						<Field label="URL" name="url" type="text" />
						<Field label="Agree?" name="agree" type="checkbox" />
						<Submit />
					</div>
				</Form>

				<hr />

				<Form method="POST" path="food">
					<h2>JSON:API add form</h2>
					<Field label="Name" name="name" />
					<Field label="Slug" name="slug" />
					<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
					<Submit />
				</Form>

				<hr />

				{row && (
					<>
						<Form method="PUT" path="food" id={row.id} row={row}>
							<h2>JSON:API edit form</h2>
							<Field label="Name" name="name" />
							<Field label="Slug" name="slug" />
							<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
							<Submit />
						</Form>

						<hr />

						<Form method="DELETE" path="food" id={row.id}>
							<h2>JSON:API delete form</h2>
							<Submit className="formosa-button--danger" label="Delete" />
						</Form>
					</>
				)}
			</FormContainer>
		</main>
	);
}
