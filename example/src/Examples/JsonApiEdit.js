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

	return (
		<>
			<Form method="PUT" path="food" id={row.id} row={row}>
				<Field label="Name" name="name" />
				<Field label="Slug" name="slug" />
				<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
				<Submit />
			</Form>

			<Form method="DELETE" path="food" id={row.id}>
				<Submit className="formosa-button--danger" label="Delete" />
			</Form>
		</>
	);
}
