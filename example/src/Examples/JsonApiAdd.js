import { Field, Form, Submit } from '@jlbelanger/formosa';
import React from 'react';

export default function JsonApiAdd() {
	return (
		<Form method="POST" path="food">
			<Field label="Name" name="name" />
			<Field label="Slug" name="slug" />
			<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
			<Submit />
		</Form>
	);
}
