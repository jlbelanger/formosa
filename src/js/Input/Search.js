import Input from '../Input';
import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as SearchIcon } from '../../svg/search.svg';

export default function Search({
	className,
	iconAttributes,
	iconClassName,
	wrapperAttributes,
	wrapperClassName,
	...otherProps
}) {
	return (
		<div className={`formosa-search-wrapper ${wrapperClassName}`.trim()} {...wrapperAttributes}>
			<Input
				className={`formosa-field__input--search ${className}`.trim()}
				{...otherProps}
			/>
			<SearchIcon className={`formosa-icon--search ${iconClassName}`.trim()} height="16" width="16" {...iconAttributes} />
		</div>
	);
}

Search.propTypes = {
	className: PropTypes.string,
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Search.defaultProps = {
	className: '',
	iconAttributes: null,
	iconClassName: '',
	wrapperAttributes: null,
	wrapperClassName: '',
};
