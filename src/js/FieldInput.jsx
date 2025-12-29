import Autocomplete from './Input/Autocomplete.jsx';
import Checkbox from './Input/Checkbox.jsx';
import CheckboxList from './Input/CheckboxList.jsx';
import File from './Input/File.jsx';
import Input from './Input.jsx';
import Password from './Input/Password.jsx';
import Radio from './Input/Radio.jsx';
import Search from './Input/Search.jsx';
import Select from './Input/Select.jsx';
import Textarea from './Input/Textarea.jsx';

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
