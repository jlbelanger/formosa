import './style.scss';
import {
	Api,
	Field,
	Form,
	FormContainer,
	Submit,
} from '@jlbelanger/formosa';
import React, { useEffect, useState } from 'react';

export default function App() {
	const [row, setRow] = useState(null);
	useEffect(() => {
		if (row === null) {
			Api.get('food/1.json')
				.then((response) => {
					setRow(response);
				});
		}
		return () => {};
	});

	const optionsObject = {
		apple: 'Apple',
		peach: 'Peach',
		banana: 'Banana',
		pear: 'Pear',
	};

	const optionsArray = [
		'Apple',
		'Peach',
		'Banana',
		'Pear',
	];

	const optionsArrayOfObjects = [
		{ id: '1', randomLabelName: 'Apple' },
		{ id: '2', randomLabelName: 'Peach' },
		{ id: '3', randomLabelName: 'Banana' },
		{ id: '4', randomLabelName: 'Pear' },
	];

	const optionsObjectAutocomplete = {
		apple: 'Apple',
		apricot: 'Apricot',
		avocado: 'Avocado',
		banana: 'Banana',
		blackberry: 'Blackberry',
		blueberry: 'Blueberry',
		cherry: 'Cherry',
		coconut: 'Coconut',
		cranberry: 'Cranberry',
		durian: 'Durian',
		eggplant: 'Eggplant',
		fig: 'Fig',
		grape: 'Grape',
		honeyberry: 'Honeyberry',
		jackfruit: 'Jackfruit',
		kiwi: 'Kiwi',
		lemon: 'Lemon',
		lime: 'Lime',
		mango: 'Mango',
		melon: 'Melon',
		nectarine: 'Nectarine',
		orange: 'Orange',
		peach: 'Peach',
		pear: 'Pear',
		persimmon: 'Persimmon',
		pineapple: 'Pineapple',
		plum: 'Plum',
		pumpkin: 'Pumpkin',
		quinoa: 'Quinoa',
		raspberry: 'Raspberry',
		strawberry: 'Strawberry',
		tomato: 'Tomato',
		uglifruit: 'Uglifruit',
		vanilla: 'Vanilla',
		watermelon: 'Watermelon',
		zucchini: 'Zucchini',
	};

	const optionsArrayAutocomplete = [
		'Apple',
		'Apricot',
		'Avocado',
		'Banana',
		'Blackberry',
		'Blueberry',
		'Cherry',
		'Coconut',
		'Cranberry',
		'Durian',
		'Eggplant',
		'Fig',
		'Grape',
		'Honeyberry',
		'Jackfruit',
		'Kiwi',
		'Lemon',
		'Lime',
		'Mango',
		'Melon',
		'Nectarine',
		'Orange',
		'Peach',
		'Pear',
		'Persimmon',
		'Pineapple',
		'Plum',
		'Pumpkin',
		'Quinoa',
		'Raspberry',
		'Strawberry',
		'Tomato',
		'Uglifruit',
		'Vanilla',
		'Watermelon',
		'Zucchini',
	];

	const optionsArrayOfObjectsAutocomplete = [
		{ id: '1', randomLabelName: 'Apple' },
		{ id: '2', randomLabelName: 'Apricot' },
		{ id: '3', randomLabelName: 'Avocado' },
		{ id: '4', randomLabelName: 'Banana' },
		{ id: '5', randomLabelName: 'Blackberry' },
		{ id: '6', randomLabelName: 'Blueberry' },
		{ id: '7', randomLabelName: 'Cherry' },
		{ id: '8', randomLabelName: 'Coconut' },
		{ id: '9', randomLabelName: 'Cranberry' },
		{ id: '10', randomLabelName: 'Durian' },
		{ id: '11', randomLabelName: 'Eggplant' },
		{ id: '12', randomLabelName: 'Fig' },
		{ id: '13', randomLabelName: 'Grape' },
		{ id: '14', randomLabelName: 'Honeyberry' },
		{ id: '15', randomLabelName: 'Jackfruit' },
		{ id: '16', randomLabelName: 'Kiwi' },
		{ id: '17', randomLabelName: 'Lemon' },
		{ id: '18', randomLabelName: 'Lime' },
		{ id: '19', randomLabelName: 'Mango' },
		{ id: '20', randomLabelName: 'Melon' },
		{ id: '21', randomLabelName: 'Nectarine' },
		{ id: '22', randomLabelName: 'Orange' },
		{ id: '23', randomLabelName: 'Peach' },
		{ id: '24', randomLabelName: 'Pear' },
		{ id: '25', randomLabelName: 'Persimmon' },
		{ id: '26', randomLabelName: 'Pineapple' },
		{ id: '27', randomLabelName: 'Plum' },
		{ id: '28', randomLabelName: 'Pumpkin' },
		{ id: '29', randomLabelName: 'Quinoa' },
		{ id: '30', randomLabelName: 'Raspberry' },
		{ id: '31', randomLabelName: 'Strawberry' },
		{ id: '32', randomLabelName: 'Tomato' },
		{ id: '33', randomLabelName: 'Uglifruit' },
		{ id: '34', randomLabelName: 'Vanilla' },
		{ id: '35', randomLabelName: 'Watermelon' },
		{ id: '36', randomLabelName: 'Zucchini' },
	];

	return (
		<main>
			<header>
				<h1>Formosa Example</h1>
			</header>

			<FormContainer>
				<Form>
					<h2>Basic form</h2>

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
						options={optionsObject}
					/>

					<Field
						label="Select array"
						name="select_array"
						type="select"
						options={optionsArray}
					/>

					<Field
						label="Select array of objects"
						labelKey="randomLabelName"
						name="select_array_objects"
						type="select"
						options={optionsArrayOfObjects}
						valueKey="id"
					/>

					<Field
						label="Select from API"
						name="select_api"
						type="select"
						url="food.json"
						valueKey={(option) => (JSON.stringify({ id: option.id, type: option.type }))}
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
						options={optionsObject}
					/>

					<Field
						label="Radio array"
						name="radio_array"
						type="radio"
						options={optionsArray}
					/>

					<Field
						label="Radio array of objects"
						labelKey="randomLabelName"
						name="radio_array_objects"
						type="radio"
						options={optionsArrayOfObjects}
						valueKey="id"
					/>

					<Field
						label="Radio from API"
						name="radio_api"
						type="radio"
						url="food.json"
						valueKey={(option) => (JSON.stringify({ id: option.id, type: option.type }))}
					/>

					<Field
						label="Autocomplete"
						name="autocomplete"
						max={1}
						type="autocomplete"
						options={optionsObjectAutocomplete}
					/>

					<Field
						label="Autocomplete array"
						name="autocomplete_array"
						max={1}
						type="autocomplete"
						options={optionsArrayAutocomplete}
					/>

					<Field
						label="Autocomplete array of objects"
						labelKey="randomLabelName"
						name="autocomplete_array_objects"
						max={1}
						type="autocomplete"
						options={optionsArrayOfObjectsAutocomplete}
						valueKey="id"
					/>

					<Field
						label="Autocomplete from API"
						name="autocomplete_api"
						max={1}
						type="autocomplete"
						url="food.json"
						valueKey={(option) => (JSON.stringify({ id: option.id, type: option.type }))}
					/>

					<Field
						label="Multiple autocomplete"
						name="multiple_autocomplete"
						type="autocomplete"
						options={optionsObjectAutocomplete}
					/>

					<Field
						label="Has many"
						name="has_many"
						type="has-many"
					/>

					<Submit />
				</Form>

				<hr />

				<Form>
					<h2>Horizontal form</h2>
					<div className="formosa-fields">
						<Field label="Name" name="name" />
						<Field label="URL" name="url" type="url" />
						<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
						<Field label="Agree?" name="agree" type="checkbox" />
						<Submit />
					</div>
				</Form>

				<hr />

				<Form method="POST" path="food">
					<h2>JSON:API add form</h2>
					<Field label="Name" name="name" />
					<Field label="Slug" name="slug" />
					<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
					<Submit />
				</Form>

				<hr />

				{row && (
					<>
						<Form method="PUT" path="food" id={row.id} row={row}>
							<h2>JSON:API edit form</h2>
							<Field label="Name" name="name" />
							<Field label="Slug" name="slug" />
							<Field label="Colour" name="metadata.colour" options={['red', 'blue', 'green']} type="select" />
							<Submit />
						</Form>

						<hr />

						<Form method="DELETE" path="food" id={row.id}>
							<h2>JSON:API delete form</h2>
							<Submit className="formosa-button--danger" label="Delete" />
						</Form>
					</>
				)}
			</FormContainer>
		</main>
	);
}
