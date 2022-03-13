function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var get = _interopDefault(require('get-value'));
var set = _interopDefault(require('set-value'));
var reactPromiseTracker = require('react-promise-tracker');
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var findIncluded = function findIncluded(included, id, type, mainRecord) {
  if (mainRecord && id === mainRecord.id && type === mainRecord.type) {
    var output = {
      id: mainRecord.id,
      type: mainRecord.type
    };

    if (Object.prototype.hasOwnProperty.call(mainRecord, 'attributes')) {
      output.attributes = mainRecord.attributes;
    }

    if (Object.prototype.hasOwnProperty.call(mainRecord, 'meta')) {
      output.meta = mainRecord.meta;
    }

    return output;
  }

  return included.find(function (data) {
    return data.id === id && data.type === type;
  });
};

var deserializeSingle = function deserializeSingle(data, otherRows, included, mainRecord) {
  if (otherRows === void 0) {
    otherRows = [];
  }

  if (included === void 0) {
    included = [];
  }

  if (mainRecord === void 0) {
    mainRecord = null;
  }

  if (!data) {
    return data;
  }

  var output = _extends({
    id: data.id,
    type: data.type
  }, data.attributes);

  if (Object.prototype.hasOwnProperty.call(data, 'relationships')) {
    var includedRecord;
    Object.keys(data.relationships).forEach(function (relationshipName) {
      output[relationshipName] = data.relationships[relationshipName].data;

      if (Array.isArray(output[relationshipName])) {
        output[relationshipName].forEach(function (rel, i) {
          includedRecord = findIncluded(included, rel.id, rel.type, mainRecord);

          if (includedRecord) {
            output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
          } else {
            includedRecord = findIncluded(otherRows, rel.id, rel.type, mainRecord);

            if (includedRecord) {
              output[relationshipName][i] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
            }
          }
        });
      } else if (output[relationshipName] !== null) {
        includedRecord = findIncluded(included, output[relationshipName].id, output[relationshipName].type, mainRecord);

        if (includedRecord) {
          output[relationshipName] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
        } else {
          includedRecord = findIncluded(otherRows, output[relationshipName].id, output[relationshipName].type, mainRecord);

          if (includedRecord) {
            output[relationshipName] = deserializeSingle(includedRecord, otherRows, included, mainRecord);
          }
        }
      }
    });
  }

  if (Object.prototype.hasOwnProperty.call(data, 'meta')) {
    output.meta = data.meta;
  }

  return output;
};

var deserialize = function deserialize(body) {
  if (Array.isArray(body.data)) {
    var output = [];
    body.data.forEach(function (data) {
      output.push(deserializeSingle(data, body.data, body.included, null));
    });
    return output;
  }

  return deserializeSingle(body.data, [], body.included, body.data);
};

var cleanSingleRelationship = function cleanSingleRelationship(values) {
  return {
    id: values.id,
    type: values.type
  };
};

var cleanRelationship = function cleanRelationship(values) {
  if (Array.isArray(values)) {
    return values.map(function (value) {
      return cleanSingleRelationship(value);
    });
  }

  return cleanSingleRelationship(values);
};

var getIncluded = function getIncluded(data, dirtyIncluded, relationshipNames) {
  var included = [];
  var dirtyKeys = {};
  dirtyIncluded.forEach(function (key) {
    if (!key.startsWith('_new.')) {
      var currentKeys = [];
      key.split('.').forEach(function (k) {
        currentKeys.push(k);

        if (typeof get(dirtyKeys, currentKeys.join('.')) === 'undefined') {
          set(dirtyKeys, currentKeys.join('.'), {});
        }
      });
    }
  });
  relationshipNames.forEach(function (relationshipName) {
    if (!Object.prototype.hasOwnProperty.call(data.relationships, relationshipName)) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(dirtyKeys, relationshipName)) {
      return;
    }

    if (!Array.isArray(data.relationships[relationshipName].data)) {
      return;
    }

    data.relationships[relationshipName].data.forEach(function (rel) {
      if (Object.keys(rel).length <= 2) {
        return;
      }

      if (Object.prototype.hasOwnProperty.call(dirtyKeys[relationshipName], rel.id)) {
        var relData = {
          id: rel.id,
          type: rel.type,
          attributes: {}
        };

        if (Object.keys(dirtyKeys[relationshipName][rel.id]).length === 0) {
          Object.keys(rel).forEach(function (key) {
            if (key !== 'id' && key !== 'type') {
              set(relData.attributes, key, rel[key]);
            }
          });
        } else {
          Object.keys(rel).forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(dirtyKeys[relationshipName][rel.id], key)) {
              set(relData.attributes, key, rel[key]);
            }
          });
        }

        included.push(relData);
      }
    });
  });
  return included;
};

var getBody = function getBody(method, type, id, formState, relationshipNames, filterBody, filterValues) {
  var body = null;

  if (method === 'PUT' || method === 'POST') {
    body = {};
    var data = {
      type: type,
      attributes: {},
      meta: {},
      relationships: {}
    };
    var keys = method === 'PUT' ? formState.dirty : Object.keys(formState.row);

    if (method === 'PUT' && id) {
      data.id = id;
    }

    var values = _extends({}, formState.row);

    if (filterValues) {
      values = filterValues(values);
    }

    keys.forEach(function (key) {
      var cleanKey = key.replace(/\..+$/, '');

      if (relationshipNames.includes(cleanKey)) {
        data.relationships[cleanKey] = {
          data: get(values, cleanKey)
        };
      } else if (relationshipNames.includes(key)) {
        data.relationships[key] = {
          data: get(values, cleanKey)
        };
      } else if (key.startsWith('meta.')) {
        set(data, key, get(values, key));
      } else if (key === 'meta') {
        data.meta = values.meta;
      } else if (key !== '_new' && !key.startsWith('_new.')) {
        set(data.attributes, key, get(values, key));
      }
    });
    body.data = data;
    var included = getIncluded(data, formState.dirtyIncluded, relationshipNames);

    if (included.length > 0) {
      body.included = included;
    }

    Object.keys(data.relationships).forEach(function (relationshipName) {
      if (typeof data.relationships[relationshipName].data === 'string') {
        data.relationships[relationshipName].data = JSON.parse(data.relationships[relationshipName].data);
      }

      if (Array.isArray(data.relationships[relationshipName].data)) {
        data.relationships[relationshipName].data = data.relationships[relationshipName].data.map(function (rel) {
          return cleanRelationship(rel);
        });
      }
    });

    if (filterBody) {
      body = filterBody(body, formState.row);
    }

    if (Object.keys(data.attributes).length <= 0) {
      delete data.attributes;
    }

    if (Object.keys(data.meta).length <= 0) {
      delete data.meta;
    }

    if (Object.keys(data.relationships).length <= 0) {
      delete data.relationships;
    }

    var filenames = Object.keys(formState.files).filter(function (filename) {
      return formState.files[filename] !== false;
    });

    if (filenames.length > 0) {
      var formData = new FormData();
      formData.append('json', JSON.stringify(body));
      formData.append('files', JSON.stringify(filenames));
      filenames.forEach(function (filename) {
        formData.append(filename, formState.files[filename]);
      });
      body = formData;
    } else {
      body = JSON.stringify(body);
    }
  }

  return body;
};

var Api = /*#__PURE__*/function () {
  function Api() {}

  Api.get = function get(url) {
    return Api.request('GET', url);
  };

  Api["delete"] = function _delete(url) {
    return Api.request('DELETE', url);
  };

  Api.post = function post(url, body) {
    return Api.request('POST', url, body);
  };

  Api.put = function put(url, body) {
    return Api.request('PUT', url, body);
  };

  Api.request = function request(method, url, body) {
    if (body === void 0) {
      body = null;
    }

    var options = {
      method: method,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    if (typeof body === 'string') {
      options.headers['Content-Type'] = 'application/json';
    }

    if (Api.getToken()) {
      options.headers.Authorization = "Bearer " + Api.getToken();
    }

    if (body) {
      options.body = body;
    }

    return reactPromiseTracker.trackPromise(fetch(process.env.REACT_APP_API_URL + "/" + url, options).then(function (response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          json.status = response.status;
          throw json;
        })["catch"](function (error) {
          if (error instanceof SyntaxError) {
            throw {
              errors: [{
                title: 'The server returned invalid JSON.',
                status: '500'
              }],
              status: 500
            };
          } else {
            throw error;
          }
        });
      }

      if (response.status === 204) {
        return {};
      }

      return response.json();
    }).then(function (json) {
      if (Object.prototype.hasOwnProperty.call(json, 'data')) {
        return deserialize(json);
      }

      return json;
    }));
  };

  Api.getToken = function getToken() {
    return window.FORMOSA_TOKEN;
  };

  Api.setToken = function setToken(token) {
    window.FORMOSA_TOKEN = token;
  };

  return Api;
}();

var formContext = /*#__PURE__*/React__default.createContext({
  dirty: [],
  dirtyIncluded: [],
  errors: {},
  files: {},
  message: '',
  row: {},
  setRow: null,
  setValues: null
});

var normalizeOptions = function normalizeOptions(options, labelKey, valueKey) {
  if (valueKey === void 0) {
    valueKey = null;
  }

  if (!options) {
    return [];
  }

  var output = [];

  if (Array.isArray(options)) {
    options.forEach(function (option) {
      if (typeof option === 'string') {
        output.push({
          label: option,
          value: option
        });
      } else {
        output.push(_extends({}, option, {
          label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
          value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey)
        }));
      }
    });
  } else {
    Object.keys(options).forEach(function (value) {
      var option = options[value];

      if (typeof value === 'string') {
        output.push({
          label: option,
          value: value
        });
      } else {
        output.push(_extends({}, option, {
          label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
          value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey)
        }));
      }
    });
  }

  return output;
};
var escapeRegExp = function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

var slugify = function slugify(s) {
  return s.toLowerCase().replace(/[^0-9a-z-]/g, '-').replace(/-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

var filterByKey = function filterByKey(records, key, value) {
  value = value.toLowerCase();
  var escapedValue = escapeRegExp(value);
  records = records.filter(function (record) {
    var recordValue = get(record, key).toString().toLowerCase() || '';
    return recordValue.match(new RegExp("(^|[^a-z])" + escapedValue));
  });
  value = slugify(value);
  records = records.sort(function (a, b) {
    var aValue = slugify(get(a, key).toString());
    var bValue = slugify(get(b, key).toString());
    var aPos = aValue.indexOf(value) === 0;
    var bPos = bValue.indexOf(value) === 0;

    if (aPos && bPos || !aPos && !bPos) {
      return aValue.localeCompare(bValue);
    }

    if (aPos && !bPos) {
      return -1;
    }

    return 1;
  });
  return records;
};

var _path;

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$1.apply(this, arguments);
}

function SvgX(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
    d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z"
  })));
}

var _excluded = ["afterAdd", "afterChange", "clearable", "clearButtonAttributes", "clearButtonClassName", "clearIconAttributes", "clearIconHeight", "clearIconWidth", "clearText", "disabled", "id", "inputClassName", "labelFn", "labelKey", "max", "name", "optionButtonAttributes", "optionButtonClassName", "optionListAttributes", "optionListClassName", "optionListItemAttributes", "optionListItemClassName", "options", "placeholder", "removeButtonAttributes", "removeButtonClassName", "removeIconAttributes", "removeIconHeight", "removeIconWidth", "removeText", "url", "valueKey", "wrapperAttributes", "wrapperClassName"];
function Autocomplete(_ref) {
  var afterAdd = _ref.afterAdd,
      afterChange = _ref.afterChange,
      clearable = _ref.clearable,
      clearButtonAttributes = _ref.clearButtonAttributes,
      clearButtonClassName = _ref.clearButtonClassName,
      clearIconAttributes = _ref.clearIconAttributes,
      clearIconHeight = _ref.clearIconHeight,
      clearIconWidth = _ref.clearIconWidth,
      clearText = _ref.clearText,
      disabled = _ref.disabled,
      id = _ref.id,
      inputClassName = _ref.inputClassName,
      labelFn = _ref.labelFn,
      labelKey = _ref.labelKey,
      max = _ref.max,
      name = _ref.name,
      optionButtonAttributes = _ref.optionButtonAttributes,
      optionButtonClassName = _ref.optionButtonClassName,
      optionListAttributes = _ref.optionListAttributes,
      optionListClassName = _ref.optionListClassName,
      optionListItemAttributes = _ref.optionListItemAttributes,
      optionListItemClassName = _ref.optionListItemClassName,
      options = _ref.options,
      placeholder = _ref.placeholder,
      removeButtonAttributes = _ref.removeButtonAttributes,
      removeButtonClassName = _ref.removeButtonClassName,
      removeIconAttributes = _ref.removeIconAttributes,
      removeIconHeight = _ref.removeIconHeight,
      removeIconWidth = _ref.removeIconWidth,
      removeText = _ref.removeText,
      url = _ref.url,
      valueKey = _ref.valueKey,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var _useState = React.useState(''),
      filter = _useState[0],
      setFilter = _useState[1];

  var _useState2 = React.useState(false),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var _useState3 = React.useState(0),
      highlightedIndex = _useState3[0],
      setHighlightedIndex = _useState3[1];

  var _useState4 = React.useState(options ? normalizeOptions(options, labelKey, valueKey) : null),
      optionValues = _useState4[0],
      setOptionValues = _useState4[1];

  var selectedValues = get(formState.row, name) || null;

  if (max === 1) {
    if (!selectedValues) {
      selectedValues = [];
    } else {
      selectedValues = [selectedValues];
    }
  } else if (!selectedValues) {
    selectedValues = [];
  }

  React.useEffect(function () {
    if (optionValues === null && url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  React.useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : null);
    return function () {};
  }, [options]);

  var isSelected = function isSelected(option) {
    var values = get(formState.row, name) || [];
    return values.findIndex(function (value) {
      return value.value === option.value;
    }) > -1;
  };

  var filteredOptions = [];

  if (optionValues !== null && filter) {
    filteredOptions = filterByKey(optionValues, 'label', filter);
    filteredOptions = filteredOptions.filter(function (option) {
      return !isSelected(option);
    });
  }

  var focus = function focus() {
    setTimeout(function () {
      var elem = document.getElementById(id || name);

      if (elem) {
        elem.focus();
      }
    });
  };

  var addValue = function addValue(value) {
    var newValue;

    if (max === 1) {
      newValue = value;
      selectedValues = [value];
    } else {
      newValue = get(formState.row, name);

      if (newValue) {
        newValue = [].concat(newValue, [value]);
      } else {
        newValue = [value];
      }

      selectedValues = [].concat(selectedValues, [value]);
    }

    var e = {
      target: {
        name: name
      }
    };
    formState.setValues(formState, e, name, newValue, afterChange);
    setIsOpen(false);
    setFilter('');

    if (max === 1) {
      setTimeout(function () {
        var elem = document.querySelector("#" + (id || name) + "-wrapper .formosa-autocomplete__value__remove");

        if (elem) {
          elem.focus();
        }
      });
    } else if (max === selectedValues.length) {
      setTimeout(function () {
        var elem = document.querySelector("#" + (id || name) + "-wrapper .formosa-autocomplete__clear");

        if (elem) {
          elem.focus();
        }
      });
    } else {
      focus();
    }

    if (afterAdd) {
      afterAdd();
    }
  };

  var removeValue = function removeValue(value) {
    var newValue = get(formState.row, name);

    if (max !== 1) {
      var index = newValue.indexOf(value);

      if (index > -1) {
        newValue.splice(index, 1);
      }

      var newSelectedValues = [].concat(selectedValues);
      index = newSelectedValues.indexOf(value);

      if (index > -1) {
        newSelectedValues.splice(index, 1);
        selectedValues = newSelectedValues;
      }
    } else {
      newValue = null;
      selectedValues = [];
    }

    var e = {
      target: {
        name: name
      }
    };
    formState.setValues(formState, e, name, newValue, afterChange);
    focus();
  };

  var onChange = function onChange(e) {
    setFilter(e.target.value);
  };

  var onFocus = function onFocus() {
    setHighlightedIndex(0);
    setIsOpen(filter.length > 0);
  };

  var onKeyDown = function onKeyDown(e) {
    var filterValue = e.target.value;
    var numValues = selectedValues ? selectedValues.length : 0;

    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
    } else if (e.key === 'Backspace' && !filter && numValues > 0) {
      removeValue(selectedValues[numValues - 1]);
    }
  };

  var onKeyUp = function onKeyUp(e) {
    var filterValue = e.target.value;

    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
      addValue(filteredOptions[highlightedIndex]);
    } else if (e.key === 'ArrowDown') {
      if (highlightedIndex >= filteredOptions.length - 1) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(highlightedIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (highlightedIndex > 0) {
        setHighlightedIndex(highlightedIndex - 1);
      } else {
        setHighlightedIndex(filteredOptions.length - 1);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else {
      setHighlightedIndex(0);
      setIsOpen(filterValue.length > 0);
    }
  };

  var onClickOption = function onClickOption(e) {
    addValue(JSON.parse(e.target.getAttribute('data-value')));
  };

  var onClickRemoveOption = function onClickRemoveOption(e) {
    var button = e.target;

    while (button && button.tagName.toUpperCase() !== 'BUTTON') {
      button = button.parentNode;
    }

    removeValue(selectedValues[button.getAttribute('data-index')]);
  };

  var clear = function clear() {
    var e = {
      target: {
        name: name
      }
    };
    formState.setValues(formState, e, name, [], afterChange);
    setFilter('');
    selectedValues = [];
    focus();
  };

  var showClear = clearable && max !== 1 && selectedValues.length > 0;
  var className = ['formosa-autocomplete'];

  if (showClear) {
    className.push('formosa-autocomplete--clearable');
  }

  if (disabled) {
    className.push('formosa-autocomplete--disabled');
  }

  className = className.join(' ');
  var canAddValues = !disabled && (max === null || selectedValues.length < max);
  var dataValue = JSON.stringify(get(formState.row, name));
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: (className + " " + wrapperClassName).trim(),
    "data-value": dataValue === undefined ? '' : dataValue,
    id: (id || name) + "-wrapper"
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "formosa-autocomplete__values"
  }, selectedValues && selectedValues.map(function (value, i) {
    var label;

    if (labelFn) {
      label = labelFn(value);
    } else if (Object.prototype.hasOwnProperty.call(value, 'label')) {
      label = value.label;
    } else {
      label = value;
    }

    return /*#__PURE__*/React__default.createElement("li", {
      className: "formosa-autocomplete__value formosa-autocomplete__value--item",
      key: JSON.stringify(value)
    }, label, !disabled && /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__value__remove " + removeButtonClassName).trim(),
      "data-index": i,
      onClick: onClickRemoveOption,
      type: "button"
    }, removeButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, _extends({
      height: removeIconHeight,
      width: removeIconWidth
    }, removeIconAttributes)), removeText));
  }), canAddValues && /*#__PURE__*/React__default.createElement("li", {
    className: "formosa-autocomplete__value formosa-autocomplete__value--input"
  }, /*#__PURE__*/React__default.createElement("input", _extends({}, otherProps, {
    autoComplete: "off",
    className: ("formosa-field__input formosa-autocomplete__input " + inputClassName).trim(),
    id: id || name,
    onChange: onChange,
    onFocus: onFocus,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    placeholder: placeholder,
    type: "text",
    value: filter
  })))), isOpen && filteredOptions.length > 0 && /*#__PURE__*/React__default.createElement("ul", _extends({
    className: ("formosa-autocomplete__options " + optionListClassName).trim()
  }, optionListAttributes), filteredOptions.map(function (option, index) {
    var optionClassName = ['formosa-autocomplete__option'];

    if (highlightedIndex === index) {
      optionClassName.push('formosa-autocomplete__option--highlighted');
    }

    optionClassName = optionClassName.join(' ');
    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: (optionClassName + " " + optionListItemClassName).trim(),
      key: option.value
    }, optionListItemAttributes), /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__option__button " + optionButtonClassName).trim(),
      "data-value": JSON.stringify(option),
      onClick: onClickOption,
      type: "button"
    }, optionButtonAttributes), option.label));
  })), showClear && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-autocomplete__clear " + clearButtonClassName).trim(),
    onClick: clear,
    type: "button"
  }, clearButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, _extends({
    height: clearIconHeight,
    width: clearIconWidth
  }, clearIconAttributes)), clearText))));
}
Autocomplete.propTypes = {
  afterAdd: PropTypes.func,
  afterChange: PropTypes.func,
  clearable: PropTypes.bool,
  clearButtonAttributes: PropTypes.object,
  clearButtonClassName: PropTypes.string,
  clearIconAttributes: PropTypes.object,
  clearIconHeight: PropTypes.number,
  clearIconWidth: PropTypes.number,
  clearText: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputClassName: PropTypes.string,
  labelFn: PropTypes.func,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  max: PropTypes.number,
  name: PropTypes.string.isRequired,
  optionButtonAttributes: PropTypes.object,
  optionButtonClassName: PropTypes.string,
  optionListAttributes: PropTypes.object,
  optionListClassName: PropTypes.string,
  optionListItemAttributes: PropTypes.object,
  optionListItemClassName: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  placeholder: PropTypes.string,
  removeButtonAttributes: PropTypes.object,
  removeButtonClassName: PropTypes.string,
  removeIconAttributes: PropTypes.object,
  removeIconHeight: PropTypes.number,
  removeIconWidth: PropTypes.number,
  removeText: PropTypes.string,
  url: PropTypes.string,
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Autocomplete.defaultProps = {
  afterAdd: null,
  afterChange: null,
  clearable: true,
  clearButtonAttributes: null,
  clearButtonClassName: '',
  clearIconAttributes: null,
  clearIconHeight: 12,
  clearIconWidth: 12,
  clearText: 'Clear',
  disabled: false,
  id: '',
  inputClassName: '',
  labelFn: null,
  labelKey: 'name',
  max: null,
  optionButtonAttributes: null,
  optionButtonClassName: '',
  optionListAttributes: null,
  optionListClassName: '',
  optionListItemAttributes: null,
  optionListItemClassName: '',
  options: null,
  placeholder: 'Search',
  removeButtonAttributes: null,
  removeButtonClassName: '',
  removeIconAttributes: null,
  removeIconHeight: 12,
  removeIconWidth: 12,
  removeText: 'Remove',
  url: null,
  valueKey: null,
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _path$1;

function _extends$2() {
  _extends$2 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$2.apply(this, arguments);
}

function SvgCheck(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/React.createElement("path", {
    d: "M6.41 1l-.69.72L2.94 4.5l-.81-.78L1.41 3 0 4.41l.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72L6.41 1z"
  })));
}

function ConditionalWrapper(_ref) {
  var children = _ref.children,
      className = _ref.className,
      condition = _ref.condition;

  if (!condition) {
    return children;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: className
  }, children);
}
ConditionalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  condition: PropTypes.any
};
ConditionalWrapper.defaultProps = {
  className: '',
  condition: false
};

var _excluded$1 = ["afterChange", "className", "id", "name", "suffix", "type"];
function Input(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      id = _ref.id,
      name = _ref.name,
      suffix = _ref.suffix,
      type = _ref.type,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var onChange = function onChange(e) {
    var newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    formState.setValues(formState, e, e.target.name, newValue, afterChange);
  };

  var value = type === 'file' ? '' : get(formState.row, name) || '';
  var checked = type === 'checkbox' && value;
  var props = {};

  if (checked) {
    props.checked = checked;
  } else if (type === 'checkbox') {
    props.checked = false;
  }

  return /*#__PURE__*/React__default.createElement(ConditionalWrapper, {
    className: "formosa-suffix-container",
    condition: suffix
  }, /*#__PURE__*/React__default.createElement("input", _extends({
    className: ("formosa-field__input " + className).trim(),
    id: id || name,
    name: name,
    onChange: onChange,
    type: type,
    value: value
  }, props, otherProps)), suffix && /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-suffix"
  }, suffix));
}
Input.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  suffix: PropTypes.string,
  type: PropTypes.string
};
Input.defaultProps = {
  afterChange: null,
  className: '',
  id: null,
  name: '',
  suffix: '',
  type: 'text'
};

var _excluded$2 = ["className", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "id", "name"];
function Checkbox(_ref) {
  var className = _ref.className,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      id = _ref.id,
      name = _ref.name,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$2);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input-checkbox " + className).trim(),
    checked: !!get(formState.row, name),
    id: id || name,
    name: name,
    type: "checkbox"
  }, otherProps)), /*#__PURE__*/React__default.createElement(SvgCheck, _extends({
    className: ("formosa-icon--check " + iconClassName).trim(),
    height: iconHeight,
    width: iconWidth
  }, iconAttributes)));
}
Checkbox.propTypes = {
  className: PropTypes.string,
  iconAttributes: PropTypes.object,
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  id: PropTypes.string,
  name: PropTypes.string.isRequired
};
Checkbox.defaultProps = {
  className: '',
  iconAttributes: null,
  iconClassName: '',
  iconHeight: 16,
  iconWidth: 16,
  id: null
};

var pad = function pad(n, width, z) {
  if (z === void 0) {
    z = '0';
  }

  n = n.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

var stringToObject = function stringToObject(datetimeString, timeZone) {
  var output = {
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    second: '',
    ampm: 'am'
  };

  if (!datetimeString) {
    return output;
  }

  var value = new Date(datetimeString.replace(' ', 'T') + ".000Z");
  value = value.toLocaleString('en-CA', {
    hourCycle: 'h23',
    timeZone: timeZone
  });
  var date = value.substring(0, 10).split('-');
  output.year = date[0];
  output.month = parseInt(date[1], 10);
  output.day = parseInt(date[2], 10);
  var time = value.substring(12).split(':');
  var hour = parseInt(time[0], 10);

  if (hour > 12) {
    output.hour = hour - 12;
  } else if (hour === 0) {
    output.hour = 12;
  } else {
    output.hour = hour;
  }

  output.minute = time[1];
  output.second = time[2];
  output.ampm = hour >= 12 ? 'pm' : 'am';
  return output;
};
var objectToString = function objectToString(datetimeObject) {
  var year = pad(datetimeObject.year, 4);
  var month = pad(datetimeObject.month, 2);
  var day = pad(datetimeObject.day, 2);
  var hour = parseInt(datetimeObject.hour, 10);

  if (datetimeObject.ampm === 'pm' && hour < 12) {
    hour += 12;
  } else if (datetimeObject.ampm === 'am' && hour === 12) {
    hour = 0;
  }

  var minute = pad(datetimeObject.minute, 2);
  var second = pad(datetimeObject.second, 2);

  try {
    return new Date(year, month - 1, day, pad(hour, 2), minute, second).toISOString().replace('T', ' ').substring(0, 19);
  } catch (_unused) {
    return '';
  }
};

var _path$2;

function _extends$3() {
  _extends$3 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$3.apply(this, arguments);
}

function SvgCaret(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/React.createElement("path", {
    d: "M0 2l4 4 4-4H0z"
  })));
}

var _excluded$3 = ["afterChange", "className", "hideBlank", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "id", "name", "labelKey", "options", "url", "valueKey", "wrapperAttributes", "wrapperClassName"];
function Select(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      hideBlank = _ref.hideBlank,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      id = _ref.id,
      name = _ref.name,
      labelKey = _ref.labelKey,
      options = _ref.options,
      url = _ref.url,
      valueKey = _ref.valueKey,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$3);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var _useState = React.useState(options ? normalizeOptions(options, labelKey, valueKey) : null),
      optionValues = _useState[0],
      setOptionValues = _useState[1];

  var onChange = function onChange(e) {
    formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
  };

  React.useEffect(function () {
    if (optionValues === null && url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  React.useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : null);
    return function () {};
  }, [options]);
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-select-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("select", _extends({
    className: ("formosa-field__input formosa-field__input-select " + className).trim(),
    id: id || name,
    name: name,
    onChange: onChange,
    value: get(formState.row, name) || ''
  }, otherProps), !hideBlank && /*#__PURE__*/React__default.createElement("option", null), optionValues && optionValues.map(function (_ref2) {
    var label = _ref2.label,
        value = _ref2.value;
    return /*#__PURE__*/React__default.createElement("option", {
      key: value,
      value: value
    }, label);
  })), /*#__PURE__*/React__default.createElement(SvgCaret, _extends({
    className: ("formosa-icon--caret " + iconClassName).trim(),
    height: iconHeight,
    width: iconWidth
  }, iconAttributes)));
}
Select.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  hideBlank: PropTypes.bool,
  iconAttributes: PropTypes.object,
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  id: PropTypes.string,
  name: PropTypes.string,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  url: PropTypes.string,
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Select.defaultProps = {
  afterChange: null,
  className: '',
  hideBlank: false,
  iconAttributes: null,
  iconClassName: '',
  iconHeight: 16,
  iconWidth: 16,
  id: null,
  name: '',
  labelKey: 'name',
  options: null,
  url: null,
  valueKey: null,
  wrapperAttributes: null,
  wrapperClassName: ''
};

function Datetime(_ref) {
  var afterChange = _ref.afterChange,
      ampmAttributes = _ref.ampmAttributes,
      convertToTimezone = _ref.convertToTimezone,
      dayAttributes = _ref.dayAttributes,
      hourAttributes = _ref.hourAttributes,
      minuteAttributes = _ref.minuteAttributes,
      monthAttributes = _ref.monthAttributes,
      name = _ref.name,
      secondAttributes = _ref.secondAttributes,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      yearAttributes = _ref.yearAttributes;

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var _useState = React.useState(stringToObject(get(formState.row, name) || '', convertToTimezone)),
      values = _useState[0],
      setValues = _useState[1];

  var onChange = function onChange(e) {
    var _extends2;

    var key = e.target.getAttribute('data-datetime');

    var newValues = _extends({}, values, (_extends2 = {}, _extends2[key] = e.target.value, _extends2));

    setValues(newValues);
    formState.setValues(formState, e, name, objectToString(newValues), afterChange);
  };

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-datetime-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Select, _extends({
    "data-datetime": "month",
    id: name + "-month",
    onChange: onChange,
    options: {
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
      12: 'December'
    },
    type: "select",
    value: values.month,
    wrapperClassName: "formosa-field__input--date formosa-field__input--month"
  }, monthAttributes)), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: "formosa-field__input--date formosa-field__input--day",
    "data-datetime": "day",
    id: name + "-day",
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "DD",
    size: 4,
    value: values.day
  }, dayAttributes)), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: "formosa-field__input--date formosa-field__input--year",
    "data-datetime": "year",
    id: name + "-year",
    inputMode: "numeric",
    maxLength: 4,
    onChange: onChange,
    placeholder: "YYYY",
    size: 6,
    suffix: ",",
    value: values.year
  }, yearAttributes)), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: "formosa-field__input--date formosa-field__input--hour",
    "data-datetime": "hour",
    id: name + "-hour",
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "hh",
    size: 4,
    suffix: ":",
    value: values.hour
  }, hourAttributes)), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: "formosa-field__input--date formosa-field__input--minute",
    "data-datetime": "minute",
    id: name + "-minute",
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "mm",
    size: 4,
    suffix: ":",
    value: values.minute
  }, minuteAttributes)), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: "formosa-field__input--date formosa-field__input--second",
    "data-datetime": "second",
    id: name + "-second",
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "ss",
    size: 4,
    value: values.second
  }, secondAttributes)), /*#__PURE__*/React__default.createElement(Select, _extends({
    "data-datetime": "ampm",
    hideBlank: true,
    id: name + "-ampm",
    onChange: onChange,
    options: {
      am: 'am',
      pm: 'pm'
    },
    type: "select",
    value: values.ampm,
    wrapperClassName: "formosa-field__input--date formosa-field__input--ampm"
  }, ampmAttributes)));
}
Datetime.propTypes = {
  afterChange: PropTypes.func,
  ampmAttributes: PropTypes.object,
  convertToTimezone: PropTypes.string,
  dayAttributes: PropTypes.object,
  hourAttributes: PropTypes.object,
  minuteAttributes: PropTypes.object,
  monthAttributes: PropTypes.object,
  name: PropTypes.string.isRequired,
  secondAttributes: PropTypes.object,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string,
  yearAttributes: PropTypes.object
};
Datetime.defaultProps = {
  afterChange: null,
  ampmAttributes: null,
  convertToTimezone: 'UTC',
  dayAttributes: null,
  hourAttributes: null,
  minuteAttributes: null,
  monthAttributes: null,
  secondAttributes: null,
  wrapperAttributes: null,
  wrapperClassName: '',
  yearAttributes: null
};

var _excluded$4 = ["afterChange", "buttonAttributes", "buttonClassName", "className", "emptyText", "id", "imageHeight", "imagePrefix", "imagePreview", "inputWrapperAttributes", "inputWrapperClassName", "multiple", "name", "removeText", "wrapperAttributes", "wrapperClassName"];
function File(_ref) {
  var afterChange = _ref.afterChange,
      buttonAttributes = _ref.buttonAttributes,
      buttonClassName = _ref.buttonClassName,
      className = _ref.className,
      emptyText = _ref.emptyText,
      id = _ref.id,
      imageHeight = _ref.imageHeight,
      imagePrefix = _ref.imagePrefix,
      imagePreview = _ref.imagePreview,
      inputWrapperAttributes = _ref.inputWrapperAttributes,
      inputWrapperClassName = _ref.inputWrapperClassName,
      multiple = _ref.multiple,
      name = _ref.name,
      removeText = _ref.removeText,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$4);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var value = get(formState.row, name);
  var hasValue = !!value;

  var _useState = React.useState(value || emptyText),
      text = _useState[0],
      setText = _useState[1];

  var _useState2 = React.useState(value ? ["" + imagePrefix + value] : []),
      srcs = _useState2[0],
      setSrcs = _useState2[1];

  var onChange = function onChange(e) {
    var files = [].concat(e.target.files);
    var filenames = files.map(function (file) {
      return file.name;
    }).join(', ');
    setSrcs(files.map(function (file) {
      return URL.createObjectURL(file);
    }));
    setText(filenames);
    formState.setValues(formState, e, e.target.name, true, afterChange, multiple ? files : files[0]);
  };

  var onRemove = function onRemove(e) {
    setText(emptyText);
    formState.setValues(formState, e, name, '', afterChange, false);
    document.getElementById(id || name).focus();
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasValue && imagePreview && srcs.map(function (src) {
    return /*#__PURE__*/React__default.createElement("img", {
      alt: "",
      height: imageHeight,
      key: src,
      src: src
    });
  }), /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-file-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-file-input-wrapper " + inputWrapperClassName).trim()
  }, inputWrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-file-name" + (text === emptyText ? ' formosa-file-name--empty' : '')
  }, text), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input--file " + className).trim(),
    id: id || name,
    multiple: multiple,
    name: name,
    onChange: onChange
  }, otherProps))), hasValue && /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-button formosa-button--remove-file formosa-postfix " + buttonClassName).trim(),
    onClick: onRemove,
    type: "button"
  }, buttonAttributes), removeText)));
}
File.propTypes = {
  afterChange: PropTypes.func,
  buttonAttributes: PropTypes.object,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  emptyText: PropTypes.string,
  id: PropTypes.string,
  imageHeight: PropTypes.number,
  imagePrefix: PropTypes.string,
  imagePreview: PropTypes.bool,
  inputWrapperAttributes: PropTypes.object,
  inputWrapperClassName: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  removeText: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
File.defaultProps = {
  afterChange: null,
  buttonAttributes: null,
  buttonClassName: '',
  className: '',
  emptyText: 'No file selected.',
  id: '',
  imageHeight: 100,
  imagePrefix: '',
  imagePreview: false,
  inputWrapperAttributes: null,
  inputWrapperClassName: '',
  multiple: false,
  name: '',
  removeText: 'Remove',
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _excluded$5 = ["buttonAttributes", "buttonClassName", "className", "hideText", "showText", "wrapperAttributes", "wrapperClassName"];
function Password(_ref) {
  var buttonAttributes = _ref.buttonAttributes,
      buttonClassName = _ref.buttonClassName,
      className = _ref.className,
      hideText = _ref.hideText,
      showText = _ref.showText,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$5);

  var _useState = React.useState('password'),
      tempType = _useState[0],
      setTempType = _useState[1];

  var togglePassword = function togglePassword() {
    if (tempType === 'password') {
      setTempType('text');
    } else {
      setTempType('password');
    }
  };

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-password-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input--password formosa-prefix " + className).trim()
  }, otherProps, {
    type: tempType
  })), /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-button formosa-button--toggle-password formosa-postfix " + buttonClassName).trim(),
    onClick: togglePassword,
    type: "button"
  }, buttonAttributes), tempType === 'password' ? showText : hideText));
}
Password.propTypes = {
  buttonAttributes: PropTypes.object,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  hideText: PropTypes.string,
  showText: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Password.defaultProps = {
  buttonAttributes: null,
  buttonClassName: '',
  className: '',
  hideText: 'Hide',
  showText: 'Show',
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _excluded$6 = ["afterChange", "className", "label", "labelAttributes", "labelClassName", "name", "value"];
function Radio(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      label = _ref.label,
      labelAttributes = _ref.labelAttributes,
      labelClassName = _ref.labelClassName,
      name = _ref.name,
      value = _ref.value,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$6);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var onChange = function onChange(e) {
    formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
  };

  var checked = get(formState.row, name) === value;
  return /*#__PURE__*/React__default.createElement("label", _extends({
    className: ("formosa-radio__label" + (checked ? ' formosa-radio__label--checked' : '') + " " + labelClassName).trim()
  }, labelAttributes), /*#__PURE__*/React__default.createElement("input", _extends({
    checked: checked,
    className: ("formosa-field__input formosa-radio__input " + className).trim(),
    name: name,
    onChange: onChange,
    type: "radio",
    value: value
  }, otherProps)), label);
}
Radio.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
  labelAttributes: PropTypes.object,
  labelClassName: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};
Radio.defaultProps = {
  afterChange: null,
  className: '',
  label: '',
  labelAttributes: null,
  labelClassName: '',
  name: '',
  value: ''
};

var _excluded$7 = ["labelKey", "listAttributes", "listClassName", "listItemAttributes", "listItemClassName", "name", "options", "required", "url", "valueKey"];
function RadioList(_ref) {
  var labelKey = _ref.labelKey,
      listAttributes = _ref.listAttributes,
      listClassName = _ref.listClassName,
      listItemAttributes = _ref.listItemAttributes,
      listItemClassName = _ref.listItemClassName,
      name = _ref.name,
      options = _ref.options,
      required = _ref.required,
      url = _ref.url,
      valueKey = _ref.valueKey,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$7);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var _useState = React.useState(options ? normalizeOptions(options, labelKey, valueKey) : null),
      optionValues = _useState[0],
      setOptionValues = _useState[1];

  React.useEffect(function () {
    if (optionValues === null && url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  React.useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : null);
    return function () {};
  }, [options]);
  return /*#__PURE__*/React__default.createElement("ul", _extends({
    className: ("formosa-radio " + listClassName).trim()
  }, listAttributes), optionValues && optionValues.map(function (_ref2) {
    var label = _ref2.label,
        value = _ref2.value;
    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: ("formosa-radio__item " + listItemClassName).trim(),
      key: value
    }, listItemAttributes), /*#__PURE__*/React__default.createElement(Radio, _extends({
      checked: get(formState.row, name) === value,
      label: label,
      name: name,
      required: required,
      value: value
    }, otherProps)));
  }));
}
RadioList.propTypes = {
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  listAttributes: PropTypes.object,
  listClassName: PropTypes.string,
  listItemAttributes: PropTypes.object,
  listItemClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  required: PropTypes.bool,
  url: PropTypes.string,
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};
RadioList.defaultProps = {
  labelKey: 'name',
  listAttributes: null,
  listClassName: '',
  listItemAttributes: null,
  listItemClassName: '',
  options: null,
  required: false,
  url: null,
  valueKey: null
};

var _path$3;

function _extends$4() {
  _extends$4 = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends$4.apply(this, arguments);
}

function SvgSearch(props) {
  return /*#__PURE__*/React.createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/React.createElement("path", {
    d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"
  })));
}

var _excluded$8 = ["className", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "wrapperAttributes", "wrapperClassName"];
function Search(_ref) {
  var className = _ref.className,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$8);

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-search-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input--search " + className).trim()
  }, otherProps)), /*#__PURE__*/React__default.createElement(SvgSearch, _extends({
    className: ("formosa-icon--search " + iconClassName).trim(),
    height: iconHeight,
    width: iconWidth
  }, iconAttributes)));
}
Search.propTypes = {
  className: PropTypes.string,
  iconAttributes: PropTypes.object,
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Search.defaultProps = {
  className: '',
  iconAttributes: null,
  iconClassName: '',
  iconHeight: 16,
  iconWidth: 16,
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _excluded$9 = ["afterChange", "className", "id", "name"];
function Textarea(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      id = _ref.id,
      name = _ref.name,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$9);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var onChange = function onChange(e) {
    formState.setValues(formState, e, e.target.name, e.target.value, afterChange);
  };

  return /*#__PURE__*/React__default.createElement("textarea", _extends({
    className: ("formosa-field__input formosa-field__input-textarea " + className).trim(),
    id: id || name,
    name: name,
    onChange: onChange,
    value: get(formState.row, name) || ''
  }, otherProps));
}
Textarea.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired
};
Textarea.defaultProps = {
  afterChange: null,
  className: '',
  id: null
};

var getInputElement = (function (type, component) {
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

  if (type === 'file') {
    return File;
  }

  return Input;
});

var getNewDirty = (function (oldDirty, name) {
  var newDirty = [].concat(oldDirty);

  if (!newDirty.includes(name)) {
    newDirty.push(name);
  }

  return newDirty;
});

function HasMany(_ref) {
  var attributes = _ref.attributes,
      buttonClassName = _ref.buttonClassName,
      name = _ref.name,
      recordType = _ref.recordType,
      removable = _ref.removable;

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState,
      setFormState = _useContext.setFormState;

  var _useState = React.useState(1),
      tempId = _useState[0],
      setTempId = _useState[1];

  var values = get(formState.row, name) || [];

  var onAdd = function onAdd() {
    var newValue = get(formState.row, "_new." + name);
    var hasNewValue = newValue && Object.keys(newValue).length > 0;

    if (!hasNewValue) {
      return;
    }

    newValue.id = "temp-" + tempId;
    newValue.type = recordType;
    setTempId(tempId + 1);

    var newRow = _extends({}, formState.row);

    var newValues = get(newRow, name) || [];
    newValues.push(newValue);
    set(newRow, name, newValues);
    set(newRow, "_new." + name, {});
    setFormState(_extends({}, formState, {
      dirty: getNewDirty(formState.dirty, name),
      dirtyIncluded: getNewDirty(formState.dirtyIncluded, newValue.type + "." + newValue.id),
      row: newRow
    }));
    document.getElementById("_new." + name + "." + attributes[0].name).focus();
  };

  var onKeyDown = function onKeyDown(e) {
    if (e.key !== 'Enter') {
      return;
    }

    var newValue = get(formState.row, "_new." + name);
    var hasNewValue = newValue && Object.keys(newValue).length > 0;

    if (hasNewValue) {
      e.preventDefault();
      e.stopPropagation();
      onAdd();
    }
  };

  var onRemove = function onRemove(e) {
    var i = e.target.getAttribute('data-index');

    if (i < 0) {
      return;
    }

    var newRow = _extends({}, formState.row);

    var newValues = get(newRow, name);
    newValues.splice(i, 1);
    set(newRow, name, newValues);
    setFormState(_extends({}, formState, {
      dirty: getNewDirty(formState.dirty, name),
      row: newRow
    }));
  };

  var afterChange = function afterChange(e) {
    setFormState(_extends({}, formState, {
      dirty: getNewDirty(formState.dirty, name),
      dirtyIncluded: getNewDirty(formState.dirtyIncluded, e.target.getAttribute('data-unique-name'))
    }));
  };

  var visibleAttributes = attributes.filter(function (attribute) {
    return attribute.type !== 'hidden';
  });
  var hiddenAttributes = attributes.filter(function (attribute) {
    return attribute.type === 'hidden';
  });
  hiddenAttributes.push({
    name: 'id',
    type: 'hidden'
  });
  hiddenAttributes.push({
    name: 'type',
    type: 'hidden'
  });
  var showHeader = visibleAttributes.some(function (attribute) {
    return attribute.label;
  });
  return /*#__PURE__*/React__default.createElement("table", {
    className: "formosa-has-many"
  }, showHeader && /*#__PURE__*/React__default.createElement("thead", {
    className: "formosa-has-many__head"
  }, /*#__PURE__*/React__default.createElement("tr", null, visibleAttributes.map(function (attribute) {
    return /*#__PURE__*/React__default.createElement("th", {
      key: attribute.name
    }, attribute.label);
  }), /*#__PURE__*/React__default.createElement("th", null))), /*#__PURE__*/React__default.createElement("tbody", {
    className: "formosa-has-many__body"
  }, values.map(function (value, i) {
    var isRemovable = typeof removable === 'boolean' && removable;

    if (typeof removable === 'function') {
      isRemovable = removable(value);
    }

    var rowKey = "included." + value.type + "." + value.id;
    return /*#__PURE__*/React__default.createElement("tr", {
      className: "formosa-has-many__row",
      key: rowKey
    }, visibleAttributes.map(function (attribute) {
      var Component = getInputElement(attribute.type, attribute.component);
      var fieldKey = rowKey + "." + attribute.name;
      var hasError = Object.prototype.hasOwnProperty.call(formState.errors, fieldKey);
      var className = ['formosa-has-many__column'];

      if (hasError) {
        className.push('formosa-field--has-error');
      }

      return /*#__PURE__*/React__default.createElement("td", {
        className: className.join(' '),
        key: attribute.name
      }, /*#__PURE__*/React__default.createElement(Component, _extends({}, attribute, {
        afterChange: afterChange,
        "data-unique-name": name + "." + value.id + "." + attribute.name,
        name: name + "." + i + "." + attribute.name
      })), hasError && /*#__PURE__*/React__default.createElement("div", {
        className: "formosa-field__error"
      }, formState.errors[rowKey].join( /*#__PURE__*/React__default.createElement("br", null))));
    }), /*#__PURE__*/React__default.createElement("td", {
      className: "formosa-has-many__column formosa-has-many__column--button"
    }, hiddenAttributes.map(function (attribute) {
      var Component = getInputElement(attribute.type, attribute.component);
      return /*#__PURE__*/React__default.createElement(Component, _extends({}, attribute, {
        key: attribute.name,
        name: name + "." + i + "." + attribute.name
      }));
    }), /*#__PURE__*/React__default.createElement("button", {
      className: ("formosa-button formosa-button--remove-has-many formosa-has-many__button " + buttonClassName).trim(),
      "data-index": i,
      disabled: !isRemovable,
      onClick: onRemove,
      type: "button"
    }, "Remove")));
  })), /*#__PURE__*/React__default.createElement("tfoot", {
    className: "formosa-has-many__foot"
  }, /*#__PURE__*/React__default.createElement("tr", {
    className: "formosa-has-many__row formosa-has-many__row--new"
  }, visibleAttributes.map(function (attribute) {
    var Component = getInputElement(attribute.type, attribute.component);
    return /*#__PURE__*/React__default.createElement("td", {
      className: "formosa-has-many__column",
      key: attribute.name
    }, /*#__PURE__*/React__default.createElement(Component, _extends({}, attribute, {
      name: "_new." + name + "." + attribute.name,
      onKeyDown: onKeyDown
    })));
  }), /*#__PURE__*/React__default.createElement("td", {
    className: "formosa-has-many__column formosa-has-many__column--button"
  }, hiddenAttributes.map(function (attribute) {
    var Component = getInputElement(attribute.type, attribute.component);
    return /*#__PURE__*/React__default.createElement(Component, _extends({}, attribute, {
      key: attribute.name,
      name: "_new." + name + "." + attribute.name,
      onKeyDown: onKeyDown
    }));
  }), /*#__PURE__*/React__default.createElement("button", {
    className: ("formosa-button formosa-button--add-has-many formosa-has-many__button " + buttonClassName).trim(),
    onClick: onAdd,
    type: "button"
  }, "Add")))));
}
HasMany.propTypes = {
  attributes: PropTypes.array,
  buttonClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  removable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
};
HasMany.defaultProps = {
  attributes: [],
  buttonClassName: '',
  removable: true
};

var _excluded$a = ["className", "htmlFor", "label", "note", "required", "type"];
function Label(_ref) {
  var className = _ref.className,
      htmlFor = _ref.htmlFor,
      label = _ref.label,
      note = _ref.note,
      required = _ref.required,
      type = _ref.type,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$a);

  var labelClassName = 'formosa-label';

  if (required) {
    labelClassName += ' formosa-label--required';
  }

  var wrapperClassName = 'formosa-label-wrapper';

  if (type === 'checkbox') {
    wrapperClassName += ' formosa-label-wrapper--checkbox';
  }

  var props = {};

  if (htmlFor && type !== 'has-many') {
    props.htmlFor = htmlFor;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: wrapperClassName
  }, /*#__PURE__*/React__default.createElement("label", _extends({
    className: (labelClassName + " " + className).trim()
  }, props, otherProps), label), note && /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-label__note"
  }, note));
}
Label.propTypes = {
  className: PropTypes.string,
  htmlFor: PropTypes.string,
  label: PropTypes.string,
  note: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
};
Label.defaultProps = {
  className: '',
  htmlFor: '',
  label: '',
  note: '',
  required: false,
  type: ''
};

var _excluded$b = ["component", "id", "inputWrapperAttributes", "label", "labelNote", "labelPosition", "name", "note", "prefix", "postfix", "required", "suffix", "type", "wrapperAttributes", "wrapperClassName"];
function Field(_ref) {
  var component = _ref.component,
      id = _ref.id,
      inputWrapperAttributes = _ref.inputWrapperAttributes,
      label = _ref.label,
      labelNote = _ref.labelNote,
      labelPosition = _ref.labelPosition,
      name = _ref.name,
      note = _ref.note,
      prefix = _ref.prefix,
      postfix = _ref.postfix,
      required = _ref.required,
      suffix = _ref.suffix,
      type = _ref.type,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$b);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var inputProps = _extends({}, otherProps);

  if (id) {
    inputProps.id = id;
  }

  if (name) {
    inputProps.name = name;
  }

  if (required) {
    inputProps.required = required;
  }

  if (suffix) {
    inputProps.suffix = suffix;
  }

  if (type) {
    inputProps.type = type;
  }

  var InputComponent = getInputElement(type, component);

  if (type === 'has-many') {
    InputComponent = HasMany;
  }

  var input = /*#__PURE__*/React__default.createElement(InputComponent, inputProps);

  if (type === 'hidden') {
    return input;
  }

  var htmlFor = id || name;
  var labelComponent = /*#__PURE__*/React__default.createElement(Label, {
    htmlFor: type === 'datetime' ? htmlFor + "-month" : htmlFor,
    label: label,
    note: labelNote,
    required: required,
    type: type
  });
  var hasError = Object.prototype.hasOwnProperty.call(formState.errors, name);
  var wrapperClassNameList = ['formosa-field', "formosa-field--" + name];

  if (wrapperClassName) {
    wrapperClassNameList.push(wrapperClassName);
  }

  if (hasError) {
    wrapperClassNameList.push('formosa-field--has-error');
  }

  if (prefix) {
    wrapperClassNameList.push('formosa-field--has-prefix');
  }

  if (postfix) {
    wrapperClassNameList.push('formosa-field--has-postfix');
  }

  if (labelPosition === 'after') {
    wrapperClassNameList.push('formosa-field--label-after');
  }

  var inputWrapperClassNameList = ['formosa-input-wrapper', "formosa-input-wrapper--" + type];

  if (suffix) {
    inputWrapperClassNameList.push('formosa-field--has-suffix');
  }

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: wrapperClassNameList.join(' ')
  }, wrapperAttributes), label && labelPosition === 'before' && labelComponent, label && labelPosition === 'after' && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-label-wrapper"
  }), /*#__PURE__*/React__default.createElement("div", _extends({
    className: inputWrapperClassNameList.join(' ')
  }, inputWrapperAttributes), prefix, input, label && labelPosition === 'after' && labelComponent, note && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-field__note"
  }, typeof note === 'function' ? note(get(formState.row, name), formState.row) : note), postfix, hasError && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-field__error",
    id: (id || name) + "-error"
  }, formState.errors[name].map(function (e) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: e
    }, e);
  }))));
}
Field.propTypes = {
  component: PropTypes.func,
  id: PropTypes.string,
  inputWrapperAttributes: PropTypes.object,
  label: PropTypes.string,
  labelNote: PropTypes.string,
  labelPosition: PropTypes.string,
  name: PropTypes.string.isRequired,
  note: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
  prefix: PropTypes.node,
  postfix: PropTypes.node,
  required: PropTypes.bool,
  suffix: PropTypes.string,
  type: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Field.defaultProps = {
  component: null,
  id: null,
  inputWrapperAttributes: {},
  label: '',
  labelNote: '',
  labelPosition: 'before',
  note: '',
  prefix: null,
  postfix: null,
  required: false,
  suffix: '',
  type: 'text',
  wrapperAttributes: {},
  wrapperClassName: ''
};

var formosaContext = /*#__PURE__*/React__default.createContext({
  addToast: null,
  removeToast: null,
  toasts: {}
});

function Message() {
  var _useContext = React.useContext(formContext),
      formState = _useContext.formState;

  var hasErrors = Object.prototype.hasOwnProperty.call(formState.errors, '');
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasErrors && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--error"
  }, formState.errors[''].join(' ')), formState.message && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--success"
  }, formState.message));
}

var _excluded$c = ["afterNoSubmit", "afterSubmit", "children", "clearOnSubmit", "defaultRow", "filterBody", "filterValues", "htmlId", "id", "method", "params", "path", "preventEmptyRequest", "relationshipNames", "showMessage", "successMessageText", "successToastText"];
function FormInner(_ref) {
  var afterNoSubmit = _ref.afterNoSubmit,
      afterSubmit = _ref.afterSubmit,
      children = _ref.children,
      clearOnSubmit = _ref.clearOnSubmit,
      defaultRow = _ref.defaultRow,
      filterBody = _ref.filterBody,
      filterValues = _ref.filterValues,
      htmlId = _ref.htmlId,
      id = _ref.id,
      method = _ref.method,
      params = _ref.params,
      path = _ref.path,
      preventEmptyRequest = _ref.preventEmptyRequest,
      relationshipNames = _ref.relationshipNames,
      showMessage = _ref.showMessage,
      successMessageText = _ref.successMessageText,
      successToastText = _ref.successToastText,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$c);

  var _useContext = React.useContext(formContext),
      formState = _useContext.formState,
      setFormState = _useContext.setFormState;

  var _useContext2 = React.useContext(formosaContext),
      formosaState = _useContext2.formosaState;

  var submitApiRequest = function submitApiRequest(e) {
    e.preventDefault();

    if (method === 'DELETE' && !window.confirm('Are you sure you want to delete this?')) {
      return;
    }

    if (preventEmptyRequest && formState.dirty.length <= 0) {
      formosaState.addToast('No changes to save.');

      if (afterNoSubmit) {
        afterNoSubmit();
      }

      return;
    }

    var url = path;

    if (id) {
      url = path + "/" + id;
    }

    if (params) {
      url += "?" + params;
    }

    var body = getBody(method, path, id, formState, relationshipNames, filterBody, filterValues);
    setFormState(_extends({}, formState, {
      errors: {},
      message: ''
    }));
    Api.request(method, url, body).then(function (response) {
      if (!response) {
        return;
      }

      var newState = _extends({}, formState, {
        dirty: [],
        dirtyIncluded: [],
        errors: {},
        message: successMessageText
      });

      if (clearOnSubmit) {
        newState.row = defaultRow;
      }

      setFormState(newState);

      if (successToastText) {
        formosaState.addToast(successToastText, 'success');
      }

      if (afterSubmit) {
        afterSubmit(response);
      }
    })["catch"](function (response) {
      if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
        formosaState.addToast('Error.', 'error');
      } else if (Object.prototype.hasOwnProperty.call(response, 'message')) {
        formosaState.addToast(response.message, 'error', 10000);
        return;
      } else {
        formosaState.addToast('Server error.', 'error');
        throw response;
      }

      var errors = {};
      var key;
      response.errors.forEach(function (error) {
        if (Object.prototype.hasOwnProperty.call(error, 'source')) {
          key = error.source.pointer.replace('/data/attributes/', '');
          key = key.replace('/data/meta/', 'meta.');

          if (key.startsWith('/included/')) {
            var i = key.replace(/^\/included\/(\d+)\/.+$/g, '$1');
            var includedRecord = body.included[parseInt(i, 10)];
            key = key.replace(/^\/included\/(\d+)\//g, "included." + includedRecord.type + "." + includedRecord.id + ".");
            key = key.replace(/\//g, '.');
          }

          if (!document.querySelector("[name=\"" + key + "\"]")) {
            key = '';
          }
        } else {
          key = '';
        }

        if (!Object.prototype.hasOwnProperty.call(errors, key)) {
          errors[key] = [];
        }

        errors[key].push(error.title);
      });
      setFormState(_extends({}, formState, {
        errors: errors,
        message: ''
      }));
    });
  };

  if (method && path && !Object.prototype.hasOwnProperty.call(otherProps, 'onSubmit')) {
    otherProps.onSubmit = submitApiRequest;
  }

  if (htmlId) {
    otherProps.id = htmlId;
  }

  return /*#__PURE__*/React__default.createElement("form", otherProps, showMessage && /*#__PURE__*/React__default.createElement(Message, null), children);
}
FormInner.propTypes = {
  afterNoSubmit: PropTypes.func,
  afterSubmit: PropTypes.func,
  children: PropTypes.node.isRequired,
  clearOnSubmit: PropTypes.bool,
  defaultRow: PropTypes.object,
  filterBody: PropTypes.func,
  filterValues: PropTypes.func,
  htmlId: PropTypes.string,
  id: PropTypes.string,
  method: PropTypes.string,
  params: PropTypes.string,
  path: PropTypes.string,
  preventEmptyRequest: PropTypes.bool,
  relationshipNames: PropTypes.array,
  showMessage: PropTypes.bool,
  successMessageText: PropTypes.string,
  successToastText: PropTypes.string
};
FormInner.defaultProps = {
  afterNoSubmit: null,
  afterSubmit: null,
  clearOnSubmit: false,
  defaultRow: {},
  filterBody: null,
  filterValues: null,
  htmlId: '',
  id: '',
  method: null,
  params: '',
  path: null,
  preventEmptyRequest: false,
  relationshipNames: [],
  showMessage: true,
  successMessageText: '',
  successToastText: ''
};

var _excluded$d = ["children", "row", "setRow"];
function Form(_ref) {
  var children = _ref.children,
      row = _ref.row,
      setRow = _ref.setRow,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$d);

  var _useState = React.useState({
    dirty: [],
    dirtyIncluded: [],
    errors: {},
    files: {},
    message: '',
    row: row,
    setRow: setRow,
    setValues: function setValues(fs, e, name, value, afterChange, files) {
      if (afterChange === void 0) {
        afterChange = null;
      }

      if (files === void 0) {
        files = null;
      }

      var newDirty = getNewDirty(fs.dirty, name);

      var newRow = _extends({}, fs.row);

      set(newRow, name, value);

      if (afterChange) {
        var additionalChanges = afterChange(e, newRow);
        Object.keys(additionalChanges).forEach(function (key) {
          set(newRow, key, additionalChanges[key]);
          newDirty = getNewDirty(newDirty, key);
        });
      }

      var newFormState = _extends({}, fs, {
        dirty: newDirty,
        row: newRow
      });

      if (files !== null) {
        set(newFormState, "files." + name, files);
      }

      setFormState(newFormState);

      if (fs.setRow) {
        fs.setRow(newRow);
      }
    }
  }),
      formState = _useState[0],
      setFormState = _useState[1];

  React.useEffect(function () {
    setFormState(_extends({}, formState, {
      row: row
    }));
  }, [row]);
  return /*#__PURE__*/React__default.createElement(formContext.Provider, {
    value: {
      formState: formState,
      setFormState: setFormState
    }
  }, /*#__PURE__*/React__default.createElement(FormInner, otherProps, children));
}
Form.propTypes = {
  children: PropTypes.node.isRequired,
  row: PropTypes.object,
  setRow: PropTypes.func
};
Form.defaultProps = {
  row: {},
  setRow: null
};

var Spinner = function Spinner() {
  var _usePromiseTracker = reactPromiseTracker.usePromiseTracker(),
      promiseInProgress = _usePromiseTracker.promiseInProgress;

  if (!promiseInProgress) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-spinner"
  });
};

function Toast(_ref) {
  var className = _ref.className,
      id = _ref.id,
      milliseconds = _ref.milliseconds,
      text = _ref.text;

  var _useContext = React.useContext(formosaContext),
      formosaState = _useContext.formosaState,
      setFormosaState = _useContext.setFormosaState;

  var removeToast = function removeToast() {
    var toasts = _extends({}, formosaState.toasts);

    delete toasts[id];
    setFormosaState(_extends({}, formosaState, {
      toasts: toasts
    }));
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: ("formosa-toast " + className).trim(),
    style: {
      animationDuration: milliseconds + "ms"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast__text"
  }, text), /*#__PURE__*/React__default.createElement("button", {
    className: "formosa-toast__close",
    onClick: removeToast,
    type: "button"
  }, /*#__PURE__*/React__default.createElement(SvgX, {
    className: "formosa-toast__close-icon",
    height: "12",
    width: "12"
  }), "Close"));
}
Toast.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  milliseconds: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};
Toast.defaultProps = {
  className: ''
};

function ToastContainer() {
  var _useContext = React.useContext(formosaContext),
      formosaState = _useContext.formosaState;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast-container"
  }, Object.keys(formosaState.toasts).map(function (id) {
    return /*#__PURE__*/React__default.createElement(Toast, {
      className: formosaState.toasts[id].className,
      key: id,
      id: id,
      milliseconds: formosaState.toasts[id].milliseconds,
      text: formosaState.toasts[id].text
    });
  }));
}

function FormContainer(_ref) {
  var children = _ref.children;

  var _useState = React.useState({
    addToast: null,
    removeToast: null,
    toasts: {}
  }),
      formosaState = _useState[0],
      setFormosaState = _useState[1];

  var formosaStateRef = React.useRef(formosaState);
  formosaStateRef.current = formosaState;
  React.useEffect(function () {
    if (formosaState.removeToast === null) {
      var removeToast = function removeToast(toastId) {
        var toasts = _extends({}, formosaStateRef.current.toasts);

        delete toasts[toastId];
        setFormosaState(_extends({}, formosaStateRef.current, {
          toasts: toasts
        }));
      };

      var addToast = function addToast(text, type, milliseconds) {
        var _extends2;

        if (type === void 0) {
          type = '';
        }

        if (milliseconds === void 0) {
          milliseconds = 5000;
        }

        var toastId = new Date().getTime();
        var toast = {
          className: type ? "formosa-toast--" + type : '',
          text: text,
          milliseconds: milliseconds
        };

        var toasts = _extends({}, formosaStateRef.current.toasts, (_extends2 = {}, _extends2[toastId] = toast, _extends2));

        setFormosaState(_extends({}, formosaStateRef.current, {
          toasts: toasts
        }));
        setTimeout(function () {
          formosaStateRef.current.removeToast(toastId);
        }, milliseconds);
      };

      setFormosaState(_extends({}, formosaStateRef.current, {
        addToast: addToast,
        removeToast: removeToast
      }));
    }

    return function () {};
  });
  return /*#__PURE__*/React__default.createElement(formosaContext.Provider, {
    value: {
      formosaState: formosaState,
      setFormosaState: setFormosaState
    }
  }, children, /*#__PURE__*/React__default.createElement(Spinner, null), /*#__PURE__*/React__default.createElement(ToastContainer, null));
}
FormContainer.propTypes = {
  children: PropTypes.node.isRequired
};

var _excluded$e = ["className", "label", "prefix", "postfix"];
function Submit(_ref) {
  var className = _ref.className,
      label = _ref.label,
      prefix = _ref.prefix,
      postfix = _ref.postfix,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$e);

  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-field formosa-field--submit"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-label-wrapper formosa-label-wrapper--submit"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-input-wrapper formosa-input-wrapper--submit"
  }, prefix, /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-button formosa-button--submit " + className).trim(),
    type: "submit"
  }, otherProps), label), postfix));
}
Submit.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  prefix: PropTypes.node,
  postfix: PropTypes.node
};
Submit.defaultProps = {
  className: '',
  label: 'Submit',
  prefix: null,
  postfix: null
};

var Api$1 = Api;
var Field$1 = Field;
var Form$1 = Form;
var FormContainer$1 = FormContainer;
var FormContext = formContext;
var FormosaContext = formosaContext;
var Input$1 = Input;
var Label$1 = Label;
var Message$1 = Message;
var Submit$1 = Submit;

exports.Api = Api$1;
exports.Field = Field$1;
exports.Form = Form$1;
exports.FormContainer = FormContainer$1;
exports.FormContext = FormContext;
exports.FormosaContext = FormosaContext;
exports.Input = Input$1;
exports.Label = Label$1;
exports.Message = Message$1;
exports.Submit = Submit$1;
//# sourceMappingURL=index.js.map
