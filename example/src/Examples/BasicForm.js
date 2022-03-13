import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function BasicForm() {
	const [row, setRow] = useState({});
	const [disabled, setDisabled] = useState(false);
	const options = [
		'Apple',
		'Peach',
		'Banana',
		'Pear',
	];

	const onSubmit = (e) => {
		e.preventDefault();
		alert('Form has been submitted.');
	};

	const toggleDisabled = () => {
		setDisabled(!disabled);
	};

	return (
		<>
			<Form onSubmit={onSubmit} row={row} setRow={setRow}>
				<button className="formosa-button" onClick={toggleDisabled} type="button">
					{disabled ? 'Enable Fields' : 'Disable Fields'}
				</button>

				<Field
					label="Text"
					name="text"
					type="text"
					disabled={disabled}
				/>

				<Field
					label="Text with size"
					name="text_size"
					size={16}
					type="text"
					disabled={disabled}
				/>

				<Field
					label="Email"
					name="email"
					type="email"
					disabled={disabled}
				/>

				<Field
					label="Number"
					name="number"
					size={6}
					type="number"
					disabled={disabled}
				/>

				<Field
					label="Password"
					name="password"
					type="password"
					autoComplete="off"
					disabled={disabled}
				/>

				<Field
					label="Search"
					name="search"
					type="search"
					disabled={disabled}
				/>

				<Field
					label="Telephone"
					name="telephone"
					type="tel"
					disabled={disabled}
				/>

				<Field
					label="URL"
					name="url"
					type="url"
					disabled={disabled}
				/>

				<Field
					label="Textarea"
					name="textarea"
					type="textarea"
					rows={5}
					disabled={disabled}
				/>

				<Field
					label="Select"
					name="select"
					type="select"
					options={options}
					disabled={disabled}
				/>

				<Field
					label="Checkbox"
					name="checkbox"
					type="checkbox"
					disabled={disabled}
				/>

				<Field
					label="Datetime"
					name="datetime"
					type="datetime"
					disabled={disabled}
				/>

				<Field
					label="Radio"
					name="radio"
					type="radio"
					options={options}
					disabled={disabled}
				/>

				<Field
					label="Autocomplete"
					name="autocomplete"
					max={1}
					type="autocomplete"
					options={options}
					disabled={disabled}
				/>

				<Field
					label="Multiple autocomplete"
					name="multiple_autocomplete"
					type="autocomplete"
					options={options}
					disabled={disabled}
				/>

				<Field
					label="File"
					name="file"
					type="file"
					disabled={disabled}
				/>

				<Field
					label="Multiple files"
					name="multiple_files"
					multiple
					type="file"
					disabled={disabled}
				/>

				<Field
					label="Image"
					name="image"
					accept="image/*"
					imagePreview
					type="file"
					disabled={disabled}
				/>

				<Field
					label="Has many"
					name="has_many"
					recordType="attributes"
					type="has-many"
					attributes={[
						{
							label: 'Key',
							name: 'key',
						},
						{
							label: 'Value',
							name: 'value',
						},
					]}
					disabled={disabled}
				/>

				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
