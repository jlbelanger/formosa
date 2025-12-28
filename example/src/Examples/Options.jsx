import { Field, Form, Submit } from '@jlbelanger/formosa';
import { useState } from 'react';

export default function Options() {
	const [row, setRow] = useState({});

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
		{ randomValueName: '1', randomLabelName: 'Apple' },
		{ randomValueName: '23', randomLabelName: 'Peach' },
		{ randomValueName: '4', randomLabelName: 'Banana' },
		{ randomValueName: '24', randomLabelName: 'Pear' },
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
		{ randomValueName: '1', randomLabelName: 'Apple' },
		{ randomValueName: '2', randomLabelName: 'Apricot' },
		{ randomValueName: '3', randomLabelName: 'Avocado' },
		{ randomValueName: '4', randomLabelName: 'Banana' },
		{ randomValueName: '5', randomLabelName: 'Blackberry' },
		{ randomValueName: '6', randomLabelName: 'Blueberry' },
		{ randomValueName: '7', randomLabelName: 'Cherry' },
		{ randomValueName: '8', randomLabelName: 'Coconut' },
		{ randomValueName: '9', randomLabelName: 'Cranberry' },
		{ randomValueName: '10', randomLabelName: 'Durian' },
		{ randomValueName: '11', randomLabelName: 'Eggplant' },
		{ randomValueName: '12', randomLabelName: 'Fig' },
		{ randomValueName: '13', randomLabelName: 'Grape' },
		{ randomValueName: '14', randomLabelName: 'Honeyberry' },
		{ randomValueName: '15', randomLabelName: 'Jackfruit' },
		{ randomValueName: '16', randomLabelName: 'Kiwi' },
		{ randomValueName: '17', randomLabelName: 'Lemon' },
		{ randomValueName: '18', randomLabelName: 'Lime' },
		{ randomValueName: '19', randomLabelName: 'Mango' },
		{ randomValueName: '20', randomLabelName: 'Melon' },
		{ randomValueName: '21', randomLabelName: 'Nectarine' },
		{ randomValueName: '22', randomLabelName: 'Orange' },
		{ randomValueName: '23', randomLabelName: 'Peach' },
		{ randomValueName: '24', randomLabelName: 'Pear' },
		{ randomValueName: '25', randomLabelName: 'Persimmon' },
		{ randomValueName: '26', randomLabelName: 'Pineapple' },
		{ randomValueName: '27', randomLabelName: 'Plum' },
		{ randomValueName: '28', randomLabelName: 'Pumpkin' },
		{ randomValueName: '29', randomLabelName: 'Quinoa' },
		{ randomValueName: '30', randomLabelName: 'Raspberry' },
		{ randomValueName: '31', randomLabelName: 'Strawberry' },
		{ randomValueName: '32', randomLabelName: 'Tomato' },
		{ randomValueName: '33', randomLabelName: 'Uglifruit' },
		{ randomValueName: '34', randomLabelName: 'Vanilla' },
		{ randomValueName: '35', randomLabelName: 'Watermelon' },
		{ randomValueName: '36', randomLabelName: 'Zucchini' },
	];

	return (
		<>
			<Form row={row} setRow={setRow}>
				<h1>Options</h1>

				<h2>Select</h2>

				<Field
					label="Select array of strings"
					name="select"
					type="select"
					note={`options={${JSON.stringify(optionsArray, null, 1)}}`}
					options={optionsArray}
				/>

				<Field
					label="Select object"
					name="select_object"
					type="select"
					note={`options={${JSON.stringify(optionsObject, null, 1)}}`}
					options={optionsObject}
				/>

				<Field
					label="Select array of objects"
					labelKey="randomLabelName"
					name="select_array_objects"
					type="select"
					note={`options={${JSON.stringify(optionsArrayOfObjects, null, 1)}}`}
					options={optionsArrayOfObjects}
					valueKey="randomValueName"
				/>

				<Field
					label="Select from API"
					name="select_api"
					type="select"
					url="/food.json"
					valueKey={(option) => ({ id: option.id, type: option.type })}
				/>

				<h2>Checkbox list</h2>

				<Field
					label="Checkbox list array of strings"
					name="checkbox_list"
					type="checkbox-list"
					note={`options={${JSON.stringify(optionsArray, null, 1)}}`}
					options={optionsArray}
				/>

				<Field
					label="Checkbox list object"
					name="checkbox_list_object"
					type="checkbox-list"
					note={`options={${JSON.stringify(optionsObject, null, 1)}}`}
					options={optionsObject}
				/>

				<Field
					label="Checkbox list array of objects"
					labelKey="randomLabelName"
					name="checkbox_list_array_objects"
					type="checkbox-list"
					note={`options={${JSON.stringify(optionsArrayOfObjects, null, 1)}}`}
					options={optionsArrayOfObjects}
					valueKey="randomValueName"
				/>

				<Field
					label="Checkbox list from API"
					name="checkbox_list_api"
					type="checkbox-list"
					inputWrapperAttributes={{
						style: {
							border: '1px solid #333',
							boxSizing: 'border-box',
							maxHeight: '190px',
							padding: '10px',
							overflow: 'auto',
						},
					}}
					url="/food.json"
					valueKey={(option) => ({ id: option.id, type: option.type })}
				/>

				<h2>Radio</h2>

				<Field
					label="Radio array of strings"
					name="radio"
					type="radio"
					note={`options={${JSON.stringify(optionsArray, null, 1)}}`}
					options={optionsArray}
				/>

				<Field
					label="Radio object"
					name="radio_object"
					type="radio"
					note={`options={${JSON.stringify(optionsObject, null, 1)}}`}
					options={optionsObject}
				/>

				<Field
					label="Radio array of objects"
					labelKey="randomLabelName"
					name="radio_array_objects"
					type="radio"
					note={`options={${JSON.stringify(optionsArrayOfObjects, null, 1)}}`}
					options={optionsArrayOfObjects}
					valueKey="randomValueName"
				/>

				<Field
					label="Radio from API"
					name="radio_api"
					type="radio"
					inputWrapperAttributes={{
						style: {
							border: '1px solid #333',
							boxSizing: 'border-box',
							maxHeight: '190px',
							padding: '10px',
							overflow: 'auto',
						},
					}}
					url="/food.json"
					valueKey={(option) => ({ id: option.id, type: option.type })}
				/>

				<h2>Autocomplete</h2>

				<Field
					label="Autocomplete array of strings"
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
					valueKey="randomValueName"
				/>

				<Field
					label="Autocomplete from API"
					name="autocomplete_api"
					max={1}
					type="autocomplete"
					url="/food.json"
					valueKey={(option) => ({ id: option.id, type: option.type })}
				/>

				<Submit />
			</Form>

			<code className="code"><pre>{JSON.stringify(row, null, 2)}</pre></code>
		</>
	);
}
