import {
	Api,
	Field,
	Form,
	Submit,
} from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function JsonApiEdit() {
	const { id } = useParams();
	const [row, setRow] = useState(null);
	useEffect(() => {
		if (row === null) {
			Api.get(`food/${id}.json`)
				.then((response) => {
					setRow(response);
				});
		}
		return () => {};
	});

	if (!row) {
		return null;
	}

	const slugify = (s) => (
		s.toLowerCase()
			.replace(/[^0-9a-z-]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '')
	);

	const afterChangeName = (e) => ({ slug: slugify(e.target.value) });

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2 style={{ margin: 0 }}>{`Edit ${row.name}`}</h2>

				<Form method="DELETE" path="food" id={row.id}>
					<button className="formosa-button formosa-button--danger" type="submit">Delete</button>
				</Form>
			</div>

			<Form method="PUT" path="food" id={row.id} row={row} setRow={setRow}>
				<Field label="Name" name="name" afterChange={afterChangeName} />
				<Field label="Slug" name="slug" />
				<Field label="Colour" name="metadata.colour" options={['blue', 'green', 'red']} type="select" />
				<Field label="Description" name="description" type="textarea" />
				<Field label="Shape" name="shape" type="radio" options={['sphere', 'cylinder']} />
				<Field label="Category" name="category" max={1} type="autocomplete" options={['fruit', 'vegetable']} />
				<Field label="Public?" name="is_public" type="checkbox" />
				<Field label="Date" name="date" type="datetime" />
				<Field label="File" name="file" type="file" />
				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
