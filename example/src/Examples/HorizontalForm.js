import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function HorizontalForm() {
	const [row, setRow] = useState({});
	const options = [
		'Apple',
		'Peach',
		'Banana',
		'Pear',
	];

	const onSubmit = (e) => {
		e.preventDefault();
		alert('Form has been submitted.'); // eslint-disable-line no-alert
	};

	return (
		<>
			<h1>Horizontal Form</h1>

			<Form className="formosa-horizontal" onSubmit={onSubmit} row={row} setRow={setRow}>
				<Field
					label="Text"
					name="text"
					type="text"
				/>

				<Field
					label="Text with size"
					name="text_size"
					size={16}
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
					autoComplete="off"
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
					options={options}
				/>

				<Field
					label="Checkbox"
					name="checkbox"
					type="checkbox"
				/>

				<Field
					label="Checkbox list"
					name="checkbox_list"
					type="checkbox-list"
					options={options}
				/>

				<Field
					label="Radio"
					name="radio"
					type="radio"
					options={options}
				/>

				<Field
					label="Autocomplete"
					name="autocomplete"
					max={1}
					type="autocomplete"
					options={options}
				/>

				<Field
					label="Multiple autocomplete"
					name="multiple_autocomplete"
					type="autocomplete"
					options={options}
				/>

				<Field
					label="File"
					name="file"
					type="file"
				/>

				<Field
					label="Multiple files"
					name="multiple_files"
					multiple
					type="file"
				/>

				<Field
					label="Image"
					name="image"
					accept="image/*"
					imagePrefix="/images/"
					imagePreview
					type="file"
				/>

				<Field
					label="Multiple images"
					name="multiple_images"
					accept="image/*"
					imagePrefix="/images/"
					imagePreview
					multiple
					type="file"
				/>

				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
