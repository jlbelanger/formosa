import React, { useContext } from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as CheckIcon } from '../../svg/check.svg';
import FormContext from '../FormContext';
import get from 'get-value';
import Input from '../Input';
import PropTypes from 'prop-types';

export default function Checkbox({
	className,
	iconAttributes,
	iconClassName,
	iconHeight,
	iconWidth,
	id,
	name,
	...otherProps
}) {
	const { formState } = useContext(FormContext);
	return (
		<>
			<Input
				className={`formosa-field__input--checkbox ${className}`.trim()}
				checked={!!get(formState.row, name)}
				id={id || name}
				name={name}
				type="checkbox"
				{...otherProps}
			/>
			<CheckIcon className={`formosa-icon--check ${iconClassName}`.trim()} height={iconHeight} width={iconWidth} {...iconAttributes} />
		</>
	);
}

Checkbox.propTypes = {
	className: PropTypes.string,
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
	id: PropTypes.string,
	name: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
	className: '',
	iconAttributes: null,
	iconClassName: '',
	iconHeight: 16,
	iconWidth: 16,
	id: null,
};
