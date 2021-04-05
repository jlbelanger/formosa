import { Field, Form, Submit } from '@jlbelanger/formosa';
import React from 'react';

export default function HorizontalForm() {
	const options = [
		'Apple',
		'Peach',
		'Banana',
		'Pear',
	];

	return (
		<Form className="formosa-horizontal">
			<Field
				label="Text"
				name="text"
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
				label="Datetime"
				name="datetime"
				type="datetime"
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
			/>

			<Submit />
		</Form>
	);
}
