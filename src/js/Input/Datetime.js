import { objectToString, stringToObject } from '../Helpers/Datetime';
import React, { useContext, useState } from 'react';
import FormContext from '../FormContext';
import get from 'get-value';
import getNewDirty from '../Helpers/FormState';
import Input from '../Input';
import PropTypes from 'prop-types';
import Select from './Select';
import set from 'set-value';

export default function Datetime({
	convertToTimezone,
	name,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const [values, setValues] = useState(stringToObject(get(formState.row, name) || '', convertToTimezone));
	const onChange = (e) => {
		const key = e.target.getAttribute('data-datetime');
		const newValues = {
			...values,
			[key]: e.target.value,
		};
		setValues(newValues);

		const newRow = { ...formState.row };
		set(newRow, name, objectToString(newValues));

		setFormState({
			...formState,
			dirty: getNewDirty(formState.dirty, name),
			row: newRow,
		});
	};

	return (
		<div className="formosa-datetime-wrapper">
			<Select
				data-datetime="month"
				id={`${name}-month`}
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
				id={`${name}-day`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="DD"
				size={4}
				value={values.day}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--year"
				data-datetime="year"
				id={`${name}-year`}
				inputMode="numeric"
				maxLength={4}
				onChange={onChange}
				placeholder="YYYY"
				size={6}
				suffix=","
				value={values.year}
			/>

			<Input
				className="formosa-field__input--date formosa-field__input--hour"
				data-datetime="hour"
				id={`${name}-hour`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="hh"
				size={4}
				suffix=":"
				value={values.hour}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--minute"
				data-datetime="minute"
				id={`${name}-minute`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="mm"
				size={4}
				suffix=":"
				value={values.minute}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--second"
				data-datetime="second"
				id={`${name}-second`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="ss"
				size={4}
				value={values.second}
			/>
			<Select
				data-datetime="ampm"
				hideBlank
				id={`${name}-ampm`}
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
	convertToTimezone: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Datetime.defaultProps = {
	convertToTimezone: 'UTC',
};
