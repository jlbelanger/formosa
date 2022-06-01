import Input from '../Input';
import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as SearchIcon } from '../../svg/search.svg';

export default function Search({
	className,
	iconAttributes,
	iconClassName,
	iconHeight,
	iconWidth,
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
			<SearchIcon
				aria-hidden="true"
				className={`formosa-icon--search ${iconClassName}`.trim()}
				height={iconHeight}
				width={iconWidth}
				{...iconAttributes}
			/>
		</div>
	);
}

Search.propTypes = {
	className: PropTypes.string,
	iconAttributes: PropTypes.object,
	iconClassName: PropTypes.string,
	iconHeight: PropTypes.number,
	iconWidth: PropTypes.number,
	wrapperAttributes: PropTypes.object,
	wrapperClassName: PropTypes.string,
};

Search.defaultProps = {
	className: '',
	iconAttributes: null,
	iconClassName: '',
	iconHeight: 16,
	iconWidth: 16,
	wrapperAttributes: null,
	wrapperClassName: '',
};
