import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function BasicForm() {
	const [row, setRow] = useState({});
	const [disabled, setDisabled] = useState(false);
	const [readOnly, setReadOnly] = useState(false);
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

	const toggleDisabled = () => {
		setDisabled(!disabled);
	};

	const toggleReadOnly = () => {
		setReadOnly(!readOnly);
	};

	const populateFields = () => {
		setRow({
			text: 'Lorem ipsum',
			text_size: 'Lorem ipsum',
			email: 'foo@example.com',
			number: 47,
			password: 'foobar',
			search: 'Lorem ipsum',
			telephone: '555-867-5309',
			url: 'https://example.com',
			textarea: 'Lorem ipsum',
			select: 'Apple',
			checkbox: true,
			datetime: '2001-02-03 04:05:06',
			radio: 'Apple',
			autocomplete: {
				label: 'Apple',
				value: 'Apple',
			},
			multiple_autocomplete: [
				{
					label: 'Apple',
					value: 'Apple',
				},
				{
					label: 'Banana',
					value: 'Banana',
				},
			],
		});
	};

	return (
		<>
			<Form onSubmit={onSubmit} row={row} setRow={setRow}>
				<button className="formosa-button" onClick={populateFields} type="button">
					Populate Fields
				</button>

				<button className="formosa-button" onClick={toggleDisabled} type="button">
					{disabled ? 'Enable Fields' : 'Disable Fields'}
				</button>

				<button className="formosa-button" onClick={toggleReadOnly} type="button">
					{readOnly ? 'Disable Read Only' : 'Enable Read Only'}
				</button>

				<Field
					label="Text"
					name="text"
					type="text"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Text with size"
					name="text_size"
					size={16}
					type="text"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Email"
					name="email"
					type="email"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Number"
					name="number"
					size={6}
					type="number"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Password"
					name="password"
					type="password"
					autoComplete="off"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Search"
					name="search"
					type="search"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Telephone"
					name="telephone"
					type="tel"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="URL"
					name="url"
					type="url"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Textarea"
					name="textarea"
					type="textarea"
					rows={5}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Select"
					name="select"
					type="select"
					options={options}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Checkbox"
					name="checkbox"
					type="checkbox"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Datetime"
					name="datetime"
					type="datetime"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Radio"
					name="radio"
					type="radio"
					options={options}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Autocomplete"
					name="autocomplete"
					max={1}
					type="autocomplete"
					options={options}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Multiple autocomplete"
					name="multiple_autocomplete"
					type="autocomplete"
					options={options}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="File"
					name="file"
					type="file"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Multiple files"
					name="multiple_files"
					multiple
					type="file"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Image"
					name="image"
					accept="image/*"
					imagePreview
					type="file"
					disabled={disabled}
					readOnly={readOnly}
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
					readOnly={readOnly}
				/>

				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
