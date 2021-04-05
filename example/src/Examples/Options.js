import { Field, Form, Submit } from '@jlbelanger/formosa';
import React from 'react';

export default function Options() {
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
		<Form>
			<Field
				label="Select"
				name="select"
				type="select"
				note={JSON.stringify(optionsArray)}
				options={optionsArray}
			/>

			<Field
				label="Select object"
				name="select_object"
				type="select"
				note={JSON.stringify(optionsObject)}
				options={optionsObject}
			/>

			<Field
				label="Select array of objects"
				labelKey="randomLabelName"
				name="select_array_objects"
				type="select"
				note={JSON.stringify(optionsArrayOfObjects)}
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
				label="Radio"
				name="radio"
				type="radio"
				note={JSON.stringify(optionsArray)}
				options={optionsArray}
			/>

			<Field
				label="Radio object"
				name="radio_object"
				type="radio"
				note={JSON.stringify(optionsObject)}
				options={optionsObject}
			/>

			<Field
				label="Radio array of objects"
				labelKey="randomLabelName"
				name="radio_array_objects"
				type="radio"
				note={JSON.stringify(optionsArrayOfObjects)}
				options={optionsArrayOfObjects}
				valueKey="id"
			/>

			<Field
				label="Radio from API"
				name="radio_api"
				type="radio"
				wrapperAttributes={{
					style: { maxHeight: '200px', overflow: 'auto' },
				}}
				url="food.json"
				valueKey={(option) => (JSON.stringify({ id: option.id, type: option.type }))}
			/>

			<Field
				label="Autocomplete"
				name="autocomplete"
				max={1}
				type="autocomplete"
				options={optionsArrayAutocomplete}
			/>

			<Field
				label="Autocomplete object"
				name="autocomplete_object"
				max={1}
				type="autocomplete"
				options={optionsObjectAutocomplete}
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

			<Submit />
		</Form>
	);
}
