import React, { useContext } from 'react';
import FormContext from '../FormContext';
import PropTypes from 'prop-types';

export default function Radio({
	afterChange,
	name,
	nameKey,
	options,
	required,
}) {
	const { formState, setFormState } = useContext(FormContext);
	const onChange = (e) => {
		const newDirty = [...formState.dirty];
		if (!newDirty.includes(e.target.name)) {
			newDirty.push(e.target.name);
		}
		setFormState({
			...formState,
			dirty: newDirty,
			row: {
				...formState.row,
				[e.target.name]: e.target.value,
			},
		});
		if (afterChange) {
			afterChange(e);
		}
	};
	let normalizedOptions = options;
	if (Array.isArray(normalizedOptions)) {
		normalizedOptions = {};
		options.forEach((option) => {
			if (typeof option === 'string') {
				normalizedOptions[option] = option;
			} else {
				const json = JSON.stringify({ id: option.id, type: option.type });
				normalizedOptions[json] = option[nameKey];
			}
		});
	}
	const keys = Object.keys(normalizedOptions);
	const numKeys = keys.length;

	return (
		<ul className="formosa-radio">
			{keys.map((value, i) => {
				const checked = formState.row[name] === value;
				let className = '';
				if (numKeys > 1) {
					className = 'formosa-infix';
					if (i === 0) {
						className = 'formosa-prefix';
					} else if (i === numKeys - 1) {
						className = 'formosa-postfix';
					}
				}
				return (
					<li className="formosa-radio__item" key={value}>
						<label className={`formosa-radio__label ${className}${checked ? ' formosa-radio__label--checked' : ''}`.trim()}>
							<input
								className={`formosa-field__input formosa-radio__input ${className}`.trim()}
								checked={checked}
								name={name}
								onChange={onChange}
								required={required}
								type="radio"
								value={value}
							/>
							{normalizedOptions[value]}
						</label>
					</li>
				);
			})}
		</ul>
	);
}

Radio.propTypes = {
	afterChange: PropTypes.func,
	name: PropTypes.string.isRequired,
	nameKey: PropTypes.string,
	options: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.object,
	]).isRequired,
	required: PropTypes.bool,
};

Radio.defaultProps = {
	afterChange: null,
	nameKey: 'name',
	required: false,
};
