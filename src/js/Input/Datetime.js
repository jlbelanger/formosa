import { objectToString, stringToObject } from '../Helpers/Datetime';
import React, { useContext, useState } from 'react'; // eslint-disable-line import/no-unresolved
import FormContext from '../FormContext';
import get from 'get-value';
import Input from '../Input';
import PropTypes from 'prop-types';
import Select from './Select';

export default function Datetime({
	afterChange,
	ampmAttributes,
	convertToTimezone,
	dayAttributes,
	disabled,
	hourAttributes,
	minuteAttributes,
	monthAttributes,
	name,
	secondAttributes,
	wrapperAttributes,
	wrapperClassName,
	yearAttributes,
}) {
	const { formState } = useContext(FormContext);
	const [values, setValues] = useState(stringToObject(get(formState.row, name) || '', convertToTimezone));
	const onChange = (e) => {
		const key = e.target.getAttribute('data-datetime');
		const newValues = {
			...values,
			[key]: e.target.value,
		};
		setValues(newValues);

		formState.setValues(formState, e, name, objectToString(newValues), afterChange);
	};

	return (
		<div className={`formosa-datetime-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
			<Select
				data-datetime="month"
				disabled={disabled}
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
				{...monthAttributes}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--day"
				data-datetime="day"
				disabled={disabled}
				id={`${name}-day`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="DD"
				size={4}
				value={values.day}
				{...dayAttributes}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--year"
				data-datetime="year"
				disabled={disabled}
				id={`${name}-year`}
				inputMode="numeric"
				maxLength={4}
				onChange={onChange}
				placeholder="YYYY"
				size={6}
				suffix=","
				value={values.year}
				{...yearAttributes}
			/>

			<Input
				className="formosa-field__input--date formosa-field__input--hour"
				data-datetime="hour"
				disabled={disabled}
				id={`${name}-hour`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="hh"
				size={4}
				suffix=":"
				value={values.hour}
				{...hourAttributes}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--minute"
				data-datetime="minute"
				disabled={disabled}
				id={`${name}-minute`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="mm"
				size={4}
				suffix=":"
				value={values.minute}
				{...minuteAttributes}
			/>
			<Input
				className="formosa-field__input--date formosa-field__input--second"
				data-datetime="second"
				disabled={disabled}
				id={`${name}-second`}
				inputMode="numeric"
				maxLength={2}
				onChange={onChange}
				placeholder="ss"
				size={4}
				value={values.second}
				{...secondAttributes}
			/>
			<Select
				data-datetime="ampm"
				disabled={disabled}
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
				{...ampmAttributes}
			/>
		</div>
	);
}

Datetime.propTypes = {
	afterChange: PropTypes.func,
	ampmAttributes: PropTypes.object,
	convertToTimezone: PropTypes.string,
	dayAttributes: PropTypes.object,
	disabled: PropTypes.bool,
	hourAttributes: PropTypes.object,
	minuteAttributes: PropTypes.object,
	monthAttributes: PropTypes.object,
	name: PropTypes.string.isRequired,
	secondAttributes: PropTypes.object,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
	yearAttributes: PropTypes.object,
};

Datetime.defaultProps = {
	afterChange: null,
	ampmAttributes: null,
	convertToTimezone: 'UTC',
	dayAttributes: null,
	disabled: false,
	hourAttributes: null,
	minuteAttributes: null,
	monthAttributes: null,
	secondAttributes: null,
	wrapperAttributes: null,
	wrapperClassName: '',
	yearAttributes: null,
};
