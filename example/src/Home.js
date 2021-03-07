import { Form, Field, Submit } from '@jlbelanger/formosa';
import React from 'react';

export default function Home() {
	return (
		<Form method="POST" path="foo">
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
	);
};
