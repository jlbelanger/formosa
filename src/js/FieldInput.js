import Autocomplete from './Input/Autocomplete';
import Checkbox from './Input/Checkbox';
import Datetime from './Input/Datetime';
import Input from './Input';
import Password from './Input/Password';
import RadioList from './Input/RadioList';
import Search from './Input/Search';
import Select from './Input/Select';
import Textarea from './Input/Textarea';

export default (type, component) => {
	if (component) {
		return component;
	}
	if (type === 'select') {
		return Select;
	}
	if (type === 'textarea') {
		return Textarea;
	}
	if (type === 'radio') {
		return RadioList;
	}
	if (type === 'checkbox') {
		return Checkbox;
	}
	if (type === 'password') {
		return Password;
	}
	if (type === 'datetime') {
		return Datetime;
	}
	if (type === 'search') {
		return Search;
	}
	if (type === 'autocomplete') {
		return Autocomplete;
	}
	return Input;
};
