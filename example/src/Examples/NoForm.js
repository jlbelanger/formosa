import { Field, Form } from '@jlbelanger/formosa';
import React, { useState } from 'react';

export default function Routes() {
	const [row, setRow] = useState({});

	const [value, setValue] = useState('');
	const [valueArray, setValueArray] = useState([]);
	const [valueBoolean, setValueBoolean] = useState(false);
	const [valueDatetime, setValueDatetime] = useState('');
	const [valueFile, setValueFile] = useState('');
	const [valueFileArray, setValueFileArray] = useState([]);
	const [valueObject, setValueObject] = useState('');
	const [valueObjectArray, setValueObjectArray] = useState([]);

	const options = ['black', 'pink', 'blue', 'yellow', 'red', 'green'];
	const optionsObject = [
		{ id: 1, name: 'black' },
		{ id: 2, name: 'pink' },
		{ id: 3, name: 'blue' },
		{ id: 4, name: 'yellow' },
		{ id: 5, name: 'red' },
		{ id: 6, name: 'green' },
	];

	const populate = () => {
		setValue('yellow');
		setValueArray(['blue', 'red']);
		setValueBoolean(true);
		setValueDatetime('2001-02-03 16:05:06');
		setValueFile('https://placekitten.com/200/200');
		setValueFileArray(['https://placekitten.com/200/200', 'https://placekitten.com/201/201']);
		setValueObject({ id: 2, name: 'pink' });
		setValueObjectArray([{ id: 1, name: 'black' }, { id: 6, name: 'green' }]);

		setRow({
			text: 'yellow',
			password: 'yellow',
			search: 'yellow',
			textarea: 'yellow',
			'autocomplete-single': 'yellow',
			select: 'yellow',
			radio: 'yellow',

			autocomplete: ['blue', 'red'],
			'checkbox-list': ['blue', 'red'],

			checkbox: true,

			file: 'https://placekitten.com/200/200',
			'file-array': ['https://placekitten.com/200/200', 'https://placekitten.com/201/201'],

			'autocomplete-single-object': { id: 2, name: 'pink' },
			'select-object': { id: 2, name: 'pink' },
			'radio-object': { id: 2, name: 'pink' },

			'autocomplete-object': [{ id: 1, name: 'black' }, { id: 6, name: 'green' }],
			'checkbox-list-object': [{ id: 1, name: 'black' }, { id: 6, name: 'green' }],
		});
	};

	const clear = () => {
		setValue('');
		setValueArray([]);
		setValueBoolean(false);
		setValueDatetime('');
		setValueFile('');
		setValueFileArray([]);
		setValueObject('');
		setValueObjectArray([]);

		setRow({});
	};

	return (
		<>
			<button className="formosa-button" onClick={populate} type="button">Populate</button>
			<button className="formosa-button" onClick={clear} type="button">Clear</button>

			<div style={{ display: 'flex' }}>
				<div style={{ marginRight: '8px', width: '50%' }}>
					<Field setValue={setValue} value={value} />
					<Field setValue={setValue} value={value} type="password" />
					<Field setValue={setValue} value={value} type="search" />
					<Field setValue={setValue} value={value} type="textarea" />
					<Field setValue={setValue} value={value} type="autocomplete" options={options} max={1} />
					<Field setValue={setValue} value={value} type="select" options={options} />
					<Field setValue={setValue} value={value} type="radio" options={options} />

					<Field setValue={setValueArray} value={valueArray} type="autocomplete" options={options} />
					<Field setValue={setValueArray} value={valueArray} type="checkbox-list" options={options} />

					<Field setValue={setValueBoolean} value={valueBoolean} type="checkbox" />

					<Field setValue={setValueFile} value={valueFile} type="file" imagePreview />
					<Field setValue={setValueFileArray} value={valueFileArray} type="file" imagePreview multiple />

					<Field setValue={setValueObject} value={valueObject} type="autocomplete" options={optionsObject} max={1} />
					<Field setValue={setValueObject} value={valueObject} type="select" options={optionsObject} />
					<Field setValue={setValueObject} value={valueObject} type="radio" options={optionsObject} />

					<Field setValue={setValueObjectArray} value={valueObjectArray} type="autocomplete" options={optionsObject} />
					<Field setValue={setValueObjectArray} value={valueObjectArray} type="checkbox-list" options={optionsObject} />

					<code>
						<pre style={{ fontSize: '12px', whiteSpace: 'break-spaces' }}>
							{JSON.stringify(value)}
							<br />
							{JSON.stringify(valueArray)}
							<br />
							{JSON.stringify(valueBoolean)}
							<br />
							{JSON.stringify(valueDatetime)}
							<br />
							{JSON.stringify(valueFile)}
							<br />
							{JSON.stringify(valueFileArray)}
							<br />
							{JSON.stringify(valueObject)}
							<br />
							{JSON.stringify(valueObjectArray)}
						</pre>
					</code>
				</div>

				<div style={{ marginLeft: '8px', width: '50%' }}>
					<Form row={row} setRow={setRow}>
						<Field name="text" />
						<Field name="password" type="password" />
						<Field name="search" type="search" />
						<Field name="textarea" type="textarea" />
						<Field name="autocomplete-single" type="autocomplete" options={options} max={1} />
						<Field name="select" type="select" options={options} />
						<Field name="radio" type="radio" options={options} />

						<Field name="autocomplete" type="autocomplete" options={options} />
						<Field name="checkbox-list" type="checkbox-list" options={options} />

						<Field name="checkbox" type="checkbox" />

						<Field name="file" type="file" imagePreview />
						<Field name="file-array" type="file" imagePreview multiple />

						<Field name="autocomplete-single-object" type="autocomplete" options={optionsObject} max={1} />
						<Field name="select-object" type="select" options={optionsObject} />
						<Field name="radio-object" type="radio" options={optionsObject} />

						<Field name="autocomplete-object" type="autocomplete" options={optionsObject} />
						<Field name="checkbox-list-object" type="checkbox-list" options={optionsObject} />
					</Form>

					<code><pre style={{ fontSize: '12px', whiteSpace: 'break-spaces' }}>{JSON.stringify(row, null, 2)}</pre></code>
				</div>
			</div>
		</>
	);
}
