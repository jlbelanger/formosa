import { Field, Form, Submit } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function BasicForm() {
	const [row, setRow] = useState({});
	const [disabled, setDisabled] = useState(false);
	const [horizontal, setHorizontal] = useState(false);
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

	const toggleHorizontal = () => {
		setHorizontal(!horizontal);
	};

	const populateFields = () => {
		setRow({
			text: 'Lorem ipsum',
			text_size: 'Lorem ipsum',
			text_note: 'Lorem ipsum',
			text_required: 'Lorem ipsum',
			email: 'foo@example.com',
			number: 47,
			password: 'foobar',
			search: 'Lorem ipsum',
			telephone: '555-867-5309',
			url: 'https://example.com',
			textarea: 'Lorem ipsum',
			select: 'Apple',
			multiple_select: ['Apple', 'Banana'],
			checkbox: true,
			checkbox_list: ['Apple', 'Banana'],
			inline_checkbox_list: ['Apple', 'Banana'],
			radio: 'Apple',
			inline_radio: 'Apple',
			autocomplete: 'Apple',
			multiple_autocomplete: ['Apple', 'Banana'],
			file: 'foo.pdf',
			multiple_files: ['foo.pdf', 'bar.pdf'],
			image: 'carrot.png',
			multiple_images: ['carrot.png', 'pie.png'],
		});
	};

	return (
		<>
			<h1>Basic Form</h1>

			<button className="formosa-button" onClick={populateFields} type="button">
				Populate Fields
			</button>

			<button className="formosa-button" onClick={toggleDisabled} type="button">
				{disabled ? 'Enable Fields' : 'Disable Fields'}
			</button>

			<button className="formosa-button" onClick={toggleReadOnly} type="button">
				{readOnly ? 'Disable Read Only' : 'Enable Read Only'}
			</button>

			<button className="formosa-button" onClick={toggleHorizontal} type="button">
				{horizontal ? 'Disable Horizontal' : 'Enable Horizontal'}
			</button>

			<Form className={horizontal ? 'formosa-horizontal' : ''} onSubmit={onSubmit} row={row} setRow={setRow}>
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
					label="Text with note"
					name="text_note"
					note="Lorem ipsum dolor sit amet."
					type="text"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Text required"
					name="text_required"
					required
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
					label="Multiple select"
					multiple
					name="multiple_select"
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
					label="Checkbox list"
					name="checkbox_list"
					type="checkbox-list"
					options={options}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					fieldsetClassName="formosa-radio--inline"
					label="Inline checkbox list"
					name="inline_checkbox_list"
					type="checkbox-list"
					options={options}
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
					fieldsetClassName="formosa-radio--inline"
					label="Inline radio"
					name="inline_radio"
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
					imagePrefix="/images/"
					imagePreview
					type="file"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Field
					label="Multiple images"
					name="multiple_images"
					accept="image/*"
					imagePrefix="/images/"
					imagePreview
					multiple
					type="file"
					disabled={disabled}
					readOnly={readOnly}
				/>

				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
