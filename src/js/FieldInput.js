import Autocomplete from './Input/Autocomplete';
import Checkbox from './Input/Checkbox';
import CheckboxList from './Input/CheckboxList';
import File from './Input/File';
import Input from './Input';
import Password from './Input/Password';
import Radio from './Input/Radio';
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
		return Radio;
	}
	if (type === 'checkbox') {
		return Checkbox;
	}
	if (type === 'password') {
		return Password;
	}
	if (type === 'search') {
		return Search;
	}
	if (type === 'autocomplete') {
		return Autocomplete;
	}
	if (type === 'file') {
		return File;
	}
	if (type === 'checkbox-list') {
		return CheckboxList;
	}
	return Input;
};
