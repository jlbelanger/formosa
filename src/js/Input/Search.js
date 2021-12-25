import Input from '../Input';
import PropTypes from 'prop-types';
import React from 'react'; // eslint-disable-line import/no-unresolved
import { ReactComponent as SearchIcon } from '../../svg/search.svg';

export default function Search({
	className,
	...otherProps
}) {
	return (
		<div className="formosa-search-wrapper">
			<Input
				className={`${className} formosa-field__input--search`.trim()}
				{...otherProps}
			/>
			<SearchIcon className="formosa-icon--search" height="16" width="16" />
		</div>
	);
}

Search.propTypes = {
	className: PropTypes.string,
};

Search.defaultProps = {
	className: '',
};
