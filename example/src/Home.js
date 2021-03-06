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
				label="Password"
				name="password"
				type="password"
			/>

			<Field
				label="Checkbox"
				name="checkbox"
				type="checkbox"
			/>

			<Field
				label="Textarea"
				name="textarea"
				type="textarea"
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
