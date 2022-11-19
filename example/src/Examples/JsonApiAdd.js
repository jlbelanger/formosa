import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function JsonApiAdd() {
	const [row, setRow] = useState({});

	return (
		<>
			<h1>JSON:API Add Form</h1>

			<Form method="POST" path="food" row={row} setRow={setRow}>
				<Field label="Name" name="name" />
				<Field label="Slug" name="slug" />
				<Field label="Colour" name="metadata.colour" options={['blue', 'green', 'red']} type="select" />
				<Field label="Description" name="description" type="textarea" />
				<Field label="Shape" name="shape" type="radio" options={['sphere', 'cylinder']} />
				<Field label="Category" name="category" max={1} type="autocomplete" options={['fruit', 'vegetable']} />
				<Field label="Directions" name="directions" options={['north', 'south', 'east', 'west']} type="checkbox-list" />
				<Field label="Public?" name="is_public" type="checkbox" />
				<Field label="File" name="file" type="file" />
				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
