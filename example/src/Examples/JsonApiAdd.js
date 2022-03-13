import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function JsonApiAdd() {
	const [row, setRow] = useState({});

	return (
		<>
			<Form method="POST" path="food" row={row} setRow={setRow}>
				<Field label="Name" name="name" />
				<Field label="Slug" name="slug" />
				<Field label="Colour" name="metadata.colour" options={['blue', 'green', 'red']} type="select" />
				<Field label="Description" name="description" type="textarea" />
				<Field label="Category" name="category" type="radio" options={['fruit', 'vegetable']} />
				<Field label="Public?" name="is_public" type="checkbox" />
				<Field label="Date" name="date" type="datetime" />
				<Field label="File" name="file" type="file" />
				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
