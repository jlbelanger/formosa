import { objectToString, stringToObject } from '../Helpers/Datetime';
import React, { useContext, useState } from 'react';
import FormContext from '../FormContext';
import Input from '../Input';
import PropTypes from 'prop-types';
import Select from './Select';

export default function Datetime({
	name,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [values, setValues] = useState(stringToObject(formState.row[name] || ''));
	const onChange = (e) => {
		const key = e.target.getAttribute('data-datetime');
		const newValues = {
			...values,
			[key]: e.target.value,
		};
		setValues(newValues);

		const newDirty = [...formState.dirty];
		if (!newDirty.includes(name)) {
			newDirty.push(name);
		}
		setFormState({
			...formState,
			dirty: newDirty,
			row: {
				...formState.row,
				[name]: objectToString(newValues),
			},
		});
	};

	return (
		<div className="formosa-datetime-wrapper">
			<Select
				data-datetime="month"
				onChange={onChange}
				options={{
					1: 'January',
					2: 'February',
					3: 'March',
					4: 'April',
					5: 'May',
					6: 'June',
					7: 'July',
					8: 'August',
					9: 'September',
					10: 'October',
					11: 'November',
					12: 'December',
				}}
				type="select"
				value={values.month}
				wrapperClassName="formosa-field__input--date formosa-field__input--month"
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--day"
				data-datetime="day"
				maxLength={2}
				onChange={onChange}
				placeholder="DD"
				size={2}
				value={values.day}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--year"
				data-datetime="year"
				maxLength={4}
				onChange={onChange}
				placeholder="YYYY"
				size={4}
				suffix=","
				value={values.year}
			/>

			<Input
				className="formosa-field__input--date formosa-field__input--hour"
				data-datetime="hour"
				maxLength={2}
				onChange={onChange}
				placeholder="hh"
				size={2}
				suffix=":"
				value={values.hour}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--minute"
				data-datetime="minute"
				maxLength={2}
				onChange={onChange}
				placeholder="mm"
				size={2}
				suffix=":"
				value={values.minute}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--second"
				data-datetime="second"
				maxLength={2}
				onChange={onChange}
				placeholder="ss"
				size={2}
				value={values.second}
			/>
			<Select
				data-datetime="ampm"
				hideBlank
				onChange={onChange}
				options={{
					am: 'am',
					pm: 'pm',
				}}
				type="select"
				value={values.ampm}
				wrapperClassName="formosa-field__input--date formosa-field__input--ampm"
			/>
		</div>
	);
}

Datetime.propTypes = {
	name: PropTypes.string.isRequired,
};
