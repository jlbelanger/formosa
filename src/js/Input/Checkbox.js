import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as CheckIcon } from '../../svg/check.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Checkbox({
	iconAttributes,
	iconClassName,
	id,
	name,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	return (
		<>
			<Input
				checked={!!get(formState.row, name)}
				id={id || name}
				name={name}
				type="checkbox"
				{...otherProps}
			/>
			<CheckIcon className={`formosa-icon--check ${iconClassName}`.trim()} height="16" width="16" {...iconAttributes} />
		</>
	);
}

Checkbox.propTypes = {
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
	iconAttributes: null,
	iconClassName: '',
	id: null,
};
