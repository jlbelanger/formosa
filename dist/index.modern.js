import get from 'get-value';
import set from 'set-value';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import React__default, { createElement, useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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

    var fileKeys = Object.keys(formState.files);
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
      } else if (fileKeys.includes(key)) {
        set(data.attributes, key, true);
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
        if (data.relationships[relationshipName].data === '') {
          data.relationships[relationshipName].data = null;
        } else {
          data.relationships[relationshipName].data = JSON.parse(data.relationships[relationshipName].data);
        }
      }

      if (data.relationships[relationshipName].data) {
        data.relationships[relationshipName].data = cleanRelationship(data.relationships[relationshipName].data);
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

    var filenames = fileKeys.filter(function (filename) {
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

    return trackPromise(fetch(process.env.REACT_APP_API_URL + "/" + url, options).then(function (response) {
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

function SvgCheck(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path || (_path = /*#__PURE__*/createElement("path", {
    d: "M6.41 1l-.69.72L2.94 4.5l-.81-.78L1.41 3 0 4.41l.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72L6.41 1z"
  })));
}

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

function Error$1(_ref) {
  var id = _ref.id,
      name = _ref.name;

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);
  var props = {};

  if (name) {
    props['data-name'] = name;
  }

  if (id || name) {
    props.id = (id || name) + "-error";
  }

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: "formosa-field__error"
  }, props), hasError && formState.errors[name].map(function (e) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: e
    }, e);
  }));
}
Error$1.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string
};
Error$1.defaultProps = {
  id: null,
  name: ''
};

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

var toSlug = function toSlug(s) {
  return s.toLowerCase().replace(/ & /g, '-and-').replace(/<[^>]+>/g, '').replace(/['’.]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/--+/g, '-');
};

var filterByKey = function filterByKey(records, key, value) {
  value = value.toLowerCase();
  var escapedValue = escapeRegExp(value);
  records = records.filter(function (record) {
    var recordValue = get(record, key).toString().toLowerCase() || '';
    return recordValue.match(new RegExp("(^|[^a-z])" + escapedValue));
  });
  value = toSlug(value);
  records = records.sort(function (a, b) {
    var aValue = toSlug(get(a, key).toString());
    var bValue = toSlug(get(b, key).toString());
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

function SvgX(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/createElement("path", {
    d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z"
  })));
}

var _excluded = ["afterAdd", "afterChange", "clearable", "clearButtonAttributes", "clearButtonClassName", "clearIconAttributes", "clearIconHeight", "clearIconWidth", "clearText", "disabled", "id", "inputClassName", "labelFn", "labelKey", "max", "name", "optionButtonAttributes", "optionButtonClassName", "optionListAttributes", "optionListClassName", "optionListItemAttributes", "optionListItemClassName", "options", "placeholder", "readOnly", "removeButtonAttributes", "removeButtonClassName", "removeIconAttributes", "removeIconHeight", "removeIconWidth", "removeText", "setValue", "url", "value", "valueKey", "wrapperAttributes", "wrapperClassName"];
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
      readOnly = _ref.readOnly,
      removeButtonAttributes = _ref.removeButtonAttributes,
      removeButtonClassName = _ref.removeButtonClassName,
      removeIconAttributes = _ref.removeIconAttributes,
      removeIconHeight = _ref.removeIconHeight,
      removeIconWidth = _ref.removeIconWidth,
      removeText = _ref.removeText,
      setValue = _ref.setValue,
      url = _ref.url,
      value = _ref.value,
      valueKey = _ref.valueKey,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var clearButtonRef = useRef(null);
  var inputRef = useRef(null);
  var removeButtonRef = useRef(null);

  var _useState = useState(''),
      filter = _useState[0],
      setFilter = _useState[1];

  var _useState2 = useState(false),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var _useState3 = useState(0),
      highlightedIndex = _useState3[0],
      setHighlightedIndex = _useState3[1];

  var _useState4 = useState(options ? normalizeOptions(options, labelKey, valueKey) : []),
      optionValues = _useState4[0],
      setOptionValues = _useState4[1];

  useEffect(function () {
    if (url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return function () {};
  }, [options]);
  var currentValue = null;

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Autocomplete> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined || currentValue === '') {
    currentValue = null;
  } else if (max === 1 && !Array.isArray(currentValue)) {
    currentValue = [currentValue];
  }

  var currentValueLength = currentValue ? currentValue.length : 0;

  var isSelected = function isSelected(option) {
    return currentValue && currentValue.findIndex(function (v) {
      return v.value === option.value;
    }) > -1;
  };

  var filteredOptions = [];

  if (filter) {
    filteredOptions = filterByKey(optionValues, 'label', filter);
    filteredOptions = filteredOptions.filter(function (option) {
      return !isSelected(option);
    });
  }

  var focus = function focus() {
    setTimeout(function () {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  var addValue = function addValue(v) {
    var newValue;

    if (max === 1) {
      newValue = v;
    } else if (currentValue) {
      newValue = [].concat(currentValue, [v]);
    } else {
      newValue = [v];
    }

    if (setValue) {
      setValue(newValue);
    } else {
      var e = {
        target: {
          name: name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

    setIsOpen(false);
    setFilter('');

    if (max === 1) {
      setTimeout(function () {
        if (removeButtonRef.current) {
          removeButtonRef.current.focus();
        }
      });
    } else if (max === currentValueLength) {
      setTimeout(function () {
        if (clearButtonRef.current) {
          clearButtonRef.current.focus();
        }
      });
    } else {
      focus();
    }

    if (afterAdd) {
      afterAdd();
    }
  };

  var removeValue = function removeValue(v) {
    var newValue = [];

    if (currentValue) {
      newValue = [].concat(currentValue);
    }

    if (max !== 1) {
      var index = newValue.indexOf(v);

      if (index > -1) {
        newValue.splice(index, 1);
      }
    } else {
      newValue = '';
    }

    if (setValue) {
      setValue(newValue);
    } else {
      var e = {
        target: {
          name: name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

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

    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
    } else if (e.key === 'Backspace' && !filter && currentValueLength > 0) {
      removeValue(currentValue[currentValueLength - 1]);
    }
  };

  var onKeyUp = function onKeyUp(e) {
    var filterValue = e.target.value;

    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
      addValue(filteredOptions[highlightedIndex].value);
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
    var val = e.target.getAttribute('data-value');

    if (e.target.getAttribute('data-json') === 'true') {
      val = JSON.parse(val);
    }

    addValue(val);
  };

  var onClickRemoveOption = function onClickRemoveOption(e) {
    var button = e.target;

    while (button && button.tagName.toUpperCase() !== 'BUTTON') {
      button = button.parentNode;
    }

    removeValue(currentValue[button.getAttribute('data-index')]);
  };

  var clear = function clear() {
    var newValue = [];

    if (setValue) {
      setValue(newValue);
    } else {
      var e = {
        target: {
          name: name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

    setFilter('');
    focus();
  };

  var showClear = clearable && max !== 1 && currentValueLength > 0 && !disabled && !readOnly;
  var className = ['formosa-autocomplete'];

  if (showClear) {
    className.push('formosa-autocomplete--clearable');
  }

  className = className.join(' ');
  var canAddValues = !disabled && !readOnly && (max === null || currentValueLength < max);
  var wrapperProps = {};

  if (id || name) {
    wrapperProps.id = (id || name) + "-wrapper";
  }

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: (className + " " + wrapperClassName).trim(),
    "data-value": JSON.stringify(max === 1 && currentValueLength > 0 ? currentValue[0] : currentValue)
  }, wrapperProps, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "formosa-autocomplete__values"
  }, currentValue && currentValue.map(function (v, index) {
    var val = v;
    var isJson = false;

    if (typeof val === 'object') {
      val = JSON.stringify(val);
      isJson = true;
    }

    var option = optionValues.find(function (o) {
      return isJson ? JSON.stringify(o.value) === val : o.value === val;
    });
    var label = '';

    if (labelFn) {
      label = labelFn(option || v);
    } else if (option && Object.prototype.hasOwnProperty.call(option, 'label')) {
      label = option.label;
    }

    return /*#__PURE__*/React__default.createElement("li", {
      className: "formosa-autocomplete__value formosa-autocomplete__value--item",
      key: val
    }, label, !disabled && !readOnly && /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__value__remove " + removeButtonClassName).trim(),
      "data-index": index,
      onClick: onClickRemoveOption,
      ref: removeButtonRef,
      type: "button"
    }, removeButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, _extends({
      "aria-hidden": "true",
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
    ref: inputRef,
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
    var val = option.value;
    var isJson = false;

    if (typeof val === 'object') {
      isJson = true;
      val = JSON.stringify(val);
    }

    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: (optionClassName + " " + optionListItemClassName).trim(),
      key: val
    }, optionListItemAttributes), /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__option__button " + optionButtonClassName).trim(),
      "data-json": isJson,
      "data-value": val,
      onClick: onClickOption,
      type: "button"
    }, optionButtonAttributes), option.label));
  })), showClear && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-autocomplete__clear " + clearButtonClassName).trim(),
    onClick: clear,
    ref: clearButtonRef,
    type: "button"
  }, clearButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, _extends({
    "aria-hidden": "true",
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
  name: PropTypes.string,
  optionButtonAttributes: PropTypes.object,
  optionButtonClassName: PropTypes.string,
  optionListAttributes: PropTypes.object,
  optionListClassName: PropTypes.string,
  optionListItemAttributes: PropTypes.object,
  optionListItemClassName: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  removeButtonAttributes: PropTypes.object,
  removeButtonClassName: PropTypes.string,
  removeIconAttributes: PropTypes.object,
  removeIconHeight: PropTypes.number,
  removeIconWidth: PropTypes.number,
  removeText: PropTypes.string,
  setValue: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.object), PropTypes.arrayOf(PropTypes.string), PropTypes.number, PropTypes.object, PropTypes.string]),
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
  name: '',
  optionButtonAttributes: null,
  optionButtonClassName: '',
  optionListAttributes: null,
  optionListClassName: '',
  optionListItemAttributes: null,
  optionListItemClassName: '',
  options: null,
  placeholder: 'Search',
  readOnly: false,
  removeButtonAttributes: null,
  removeButtonClassName: '',
  removeIconAttributes: null,
  removeIconHeight: 12,
  removeIconWidth: 12,
  removeText: 'Remove',
  setValue: null,
  url: null,
  value: null,
  valueKey: null,
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _excluded$1 = ["afterChange", "className", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "id", "name", "setValue", "value"];
function Checkbox(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      id = _ref.id,
      name = _ref.name,
      setValue = _ref.setValue,
      value = _ref.value,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var checked = false;

  if (setValue !== null) {
    checked = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Checkbox> component must be inside a <Form> component.');
    }

    checked = !!get(formState.row, name);
  }

  var onChange = function onChange(e) {
    var newValue = e.target.checked;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  var props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", _extends({
    className: ("formosa-field__input formosa-field__input--checkbox " + className).trim(),
    checked: checked,
    onChange: onChange,
    type: "checkbox"
  }, props, otherProps)), /*#__PURE__*/React__default.createElement(SvgCheck, _extends({
    "aria-hidden": "true",
    className: ("formosa-icon--check " + iconClassName).trim(),
    height: iconHeight,
    width: iconWidth
  }, iconAttributes)));
}
Checkbox.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  iconAttributes: PropTypes.object,
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  id: PropTypes.string,
  name: PropTypes.string,
  setValue: PropTypes.func,
  value: PropTypes.bool
};
Checkbox.defaultProps = {
  afterChange: null,
  className: '',
  iconAttributes: null,
  iconClassName: '',
  iconHeight: 16,
  iconWidth: 16,
  id: null,
  name: '',
  setValue: null,
  value: null
};

function CheckboxList(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      disabled = _ref.disabled,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      labelAttributes = _ref.labelAttributes,
      labelClassName = _ref.labelClassName,
      labelKey = _ref.labelKey,
      listAttributes = _ref.listAttributes,
      listClassName = _ref.listClassName,
      listItemAttributes = _ref.listItemAttributes,
      listItemClassName = _ref.listItemClassName,
      name = _ref.name,
      options = _ref.options,
      readOnly = _ref.readOnly,
      setValue = _ref.setValue,
      url = _ref.url,
      value = _ref.value,
      valueKey = _ref.valueKey;

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var _useState = useState(options ? normalizeOptions(options, labelKey, valueKey) : []),
      optionValues = _useState[0],
      setOptionValues = _useState[1];

  useEffect(function () {
    if (url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return function () {};
  }, [options]);
  var currentValue = [];

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<CheckboxList> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined || currentValue === '') {
    currentValue = [];
  }

  currentValue = currentValue.map(function (val) {
    return typeof val === 'object' ? JSON.stringify(val) : val;
  });

  var onChange = function onChange(e) {
    var newValue = [].concat(currentValue);
    var val = e.target.value;

    if (e.target.checked) {
      if (e.target.getAttribute('data-json') === 'true') {
        val = JSON.parse(val);
      }

      newValue.push(val);
    } else {
      var index = currentValue.indexOf(val);

      if (index > -1) {
        newValue.splice(index, 1);
      }
    }

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  return /*#__PURE__*/React__default.createElement("ul", _extends({
    className: ("formosa-radio " + listClassName).trim()
  }, listAttributes), optionValues.map(function (optionValue) {
    var optionValueVal = optionValue.value;
    var isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    var checked = currentValue.includes(optionValueVal);
    var optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    if (name) {
      optionProps.name = name + "[]";
    }

    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: ("formosa-radio__item " + listItemClassName).trim(),
      key: optionValueVal
    }, listItemAttributes), /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-input-wrapper formosa-input-wrapper--checkbox"
    }, /*#__PURE__*/React__default.createElement("label", _extends({
      className: ("formosa-radio__label" + (checked ? ' formosa-radio__label--checked' : '') + " " + labelClassName).trim()
    }, labelAttributes), /*#__PURE__*/React__default.createElement("input", _extends({
      checked: checked,
      className: ("formosa-field__input formosa-field__input--checkbox " + className).trim(),
      disabled: disabled,
      onChange: onChange,
      readOnly: readOnly,
      type: "checkbox",
      value: optionValueVal
    }, optionProps)), /*#__PURE__*/React__default.createElement(SvgCheck, _extends({
      "aria-hidden": "true",
      className: ("formosa-icon--check " + iconClassName).trim(),
      height: iconHeight,
      width: iconWidth
    }, iconAttributes)), optionValue.label)));
  }));
}
CheckboxList.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  iconAttributes: PropTypes.object,
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  labelAttributes: PropTypes.object,
  labelClassName: PropTypes.string,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  listAttributes: PropTypes.object,
  listClassName: PropTypes.string,
  listItemAttributes: PropTypes.object,
  listItemClassName: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  readOnly: PropTypes.bool,
  setValue: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.object), PropTypes.arrayOf(PropTypes.string)]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};
CheckboxList.defaultProps = {
  afterChange: null,
  className: '',
  disabled: false,
  iconAttributes: null,
  iconClassName: '',
  iconHeight: 16,
  iconWidth: 16,
  labelAttributes: null,
  labelClassName: '',
  labelKey: 'name',
  listAttributes: null,
  listClassName: '',
  listItemAttributes: null,
  listItemClassName: '',
  name: '',
  options: null,
  readOnly: false,
  setValue: null,
  url: null,
  value: null,
  valueKey: null
};

var _excluded$2 = ["afterChange", "buttonAttributes", "buttonClassName", "className", "disabled", "emptyText", "id", "imageAttributes", "imageClassName", "imageHeight", "imagePrefix", "imagePreview", "inputWrapperAttributes", "inputWrapperClassName", "linkAttributes", "linkClassName", "linkImage", "multiple", "name", "readOnly", "removeText", "required", "setValue", "value", "wrapperAttributes", "wrapperClassName"];
function File(_ref) {
  var afterChange = _ref.afterChange,
      buttonAttributes = _ref.buttonAttributes,
      buttonClassName = _ref.buttonClassName,
      className = _ref.className,
      disabled = _ref.disabled,
      emptyText = _ref.emptyText,
      id = _ref.id,
      imageAttributes = _ref.imageAttributes,
      imageClassName = _ref.imageClassName,
      imageHeight = _ref.imageHeight,
      imagePrefix = _ref.imagePrefix,
      imagePreview = _ref.imagePreview,
      inputWrapperAttributes = _ref.inputWrapperAttributes,
      inputWrapperClassName = _ref.inputWrapperClassName,
      linkAttributes = _ref.linkAttributes,
      linkClassName = _ref.linkClassName,
      linkImage = _ref.linkImage,
      multiple = _ref.multiple,
      name = _ref.name,
      readOnly = _ref.readOnly,
      removeText = _ref.removeText,
      required = _ref.required,
      setValue = _ref.setValue,
      value = _ref.value,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$2);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var inputRef = useRef(null);
  var currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<File> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined) {
    currentValue = '';
  }

  var hasValue = multiple ? currentValue.length > 0 : !!currentValue;

  var getFilenames = function getFilenames(v) {
    if (v instanceof FileList) {
      var numFiles = v.length;
      var output = [];
      var i;

      for (i = 0; i < numFiles; i += 1) {
        output.push(v.item(i).name);
      }

      return output.join(', ');
    }

    if (Array.isArray(v)) {
      return v.join(', ');
    }

    if (typeof v === 'object') {
      return v.name;
    }

    return v;
  };

  var getSrcs = function getSrcs(v) {
    var output = [];

    if (v instanceof FileList) {
      var numFiles = v.length;
      var i;

      for (i = 0; i < numFiles; i += 1) {
        output.push(URL.createObjectURL(v.item(i)));
      }
    } else if (Array.isArray(v)) {
      return v.map(function (v2) {
        return "" + imagePrefix + v2;
      });
    } else if (typeof v === 'object') {
      output.push(URL.createObjectURL(v));
    } else if (typeof v === 'string') {
      output.push("" + imagePrefix + v);
    }

    return output;
  };

  var _useState = useState(getFilenames(currentValue)),
      filenames = _useState[0],
      setFilenames = _useState[1];

  var _useState2 = useState(getSrcs(currentValue)),
      srcs = _useState2[0],
      setSrcs = _useState2[1];

  useEffect(function () {
    setFilenames(getFilenames(currentValue));
    setSrcs(getSrcs(currentValue));
  }, [currentValue]);

  var onChange = function onChange(e) {
    var newFiles = multiple ? e.target.files : e.target.files.item(0);
    setFilenames(getFilenames(newFiles));

    if (imagePreview) {
      setSrcs(getSrcs(newFiles));
    }

    if (setValue) {
      setValue(newFiles);
    } else {
      formState.setValues(formState, e, name, newFiles, afterChange, newFiles);
    }
  };

  var onRemove = function onRemove(e) {
    setFilenames('');
    var newValue = '';

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange, newValue);
    }

    inputRef.current.focus();
  };

  var prefixClassName = inputWrapperClassName;

  if (hasValue && !disabled && !readOnly) {
    prefixClassName += ' formosa-prefix';
  }

  var props = {};

  if (id || name) {
    props.id = id || name;
  }

  var hiddenProps = {};

  if (name) {
    hiddenProps.name = name;
  }

  var buttonProps = {};

  if (id || name) {
    buttonProps.id = (id || name) + "-remove";
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasValue && imagePreview && srcs.map(function (src) {
    var img = /*#__PURE__*/React__default.createElement("img", _extends({
      alt: "",
      className: ("formosa-file-image " + imageClassName).trim(),
      height: imageHeight,
      key: src,
      src: src
    }, imageAttributes));

    if (linkImage) {
      return /*#__PURE__*/React__default.createElement("a", _extends({
        className: ("formosa-file-link " + linkClassName).trim(),
        href: src,
        key: src
      }, linkAttributes), img);
    }

    return img;
  }), /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-file-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-file-input-wrapper " + prefixClassName).trim()
  }, inputWrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-file-name" + (!filenames ? ' formosa-file-name--empty' : ''),
    id: (id || name) + "-name"
  }, filenames || emptyText), !readOnly && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", _extends({
    className: ("formosa-field__input formosa-field__input--file " + className).trim(),
    disabled: disabled,
    multiple: multiple,
    onChange: onChange,
    ref: inputRef,
    type: "file"
  }, props, otherProps)), /*#__PURE__*/React__default.createElement("input", _extends({
    disabled: disabled,
    required: required,
    type: "hidden",
    value: currentValue
  }, hiddenProps)))), hasValue && !disabled && !readOnly && /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-button formosa-button--remove-file formosa-postfix " + buttonClassName).trim(),
    onClick: onRemove,
    type: "button"
  }, buttonProps, buttonAttributes), removeText)));
}
File.propTypes = {
  afterChange: PropTypes.func,
  buttonAttributes: PropTypes.object,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  emptyText: PropTypes.string,
  id: PropTypes.string,
  imageAttributes: PropTypes.object,
  imageClassName: PropTypes.string,
  imageHeight: PropTypes.number,
  imagePrefix: PropTypes.string,
  imagePreview: PropTypes.bool,
  inputWrapperAttributes: PropTypes.object,
  inputWrapperClassName: PropTypes.string,
  linkAttributes: PropTypes.object,
  linkClassName: PropTypes.string,
  linkImage: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  removeText: PropTypes.string,
  required: PropTypes.bool,
  setValue: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
File.defaultProps = {
  afterChange: null,
  buttonAttributes: null,
  buttonClassName: '',
  className: '',
  disabled: false,
  emptyText: 'No file selected.',
  id: '',
  imageAttributes: null,
  imageClassName: '',
  imageHeight: 100,
  imagePrefix: '',
  imagePreview: false,
  inputWrapperAttributes: null,
  inputWrapperClassName: '',
  linkAttributes: null,
  linkClassName: '',
  linkImage: false,
  multiple: false,
  name: '',
  readOnly: false,
  removeText: 'Remove',
  required: false,
  setValue: null,
  value: null,
  wrapperAttributes: null,
  wrapperClassName: ''
};

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

var _excluded$3 = ["afterChange", "className", "id", "name", "setValue", "suffix", "type", "value"];
function Input(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      id = _ref.id,
      name = _ref.name,
      setValue = _ref.setValue,
      suffix = _ref.suffix,
      type = _ref.type,
      value = _ref.value,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$3);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Input> component must be inside a <Form> component.');
    }

    if (type !== 'file') {
      currentValue = get(formState.row, name);

      if (currentValue === null || currentValue === undefined) {
        currentValue = '';
      }
    }
  }

  var onChange = function onChange(e) {
    var newValue = e.target.value;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  var props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement(ConditionalWrapper, {
    className: "formosa-suffix-container",
    condition: suffix
  }, /*#__PURE__*/React__default.createElement("input", _extends({
    className: ("formosa-field__input " + className).trim(),
    onChange: onChange,
    type: type,
    value: currentValue
  }, props, otherProps)), suffix && /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-suffix"
  }, suffix));
}
Input.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  setValue: PropTypes.func,
  suffix: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
Input.defaultProps = {
  afterChange: null,
  className: '',
  id: null,
  name: '',
  setValue: null,
  suffix: '',
  type: 'text',
  value: null
};

var _excluded$4 = ["buttonAttributes", "buttonClassName", "className", "hideText", "showText", "wrapperAttributes", "wrapperClassName"];
function Password(_ref) {
  var buttonAttributes = _ref.buttonAttributes,
      buttonClassName = _ref.buttonClassName,
      className = _ref.className,
      hideText = _ref.hideText,
      showText = _ref.showText,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$4);

  var _useState = useState('password'),
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

var _excluded$5 = ["afterChange", "className", "label", "labelAttributes", "labelClassName", "labelKey", "listAttributes", "listClassName", "listItemAttributes", "listItemClassName", "name", "options", "required", "setValue", "url", "value", "valueKey"];
function Radio(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      labelAttributes = _ref.labelAttributes,
      labelClassName = _ref.labelClassName,
      labelKey = _ref.labelKey,
      listAttributes = _ref.listAttributes,
      listClassName = _ref.listClassName,
      listItemAttributes = _ref.listItemAttributes,
      listItemClassName = _ref.listItemClassName,
      name = _ref.name,
      options = _ref.options,
      required = _ref.required,
      setValue = _ref.setValue,
      url = _ref.url,
      value = _ref.value,
      valueKey = _ref.valueKey,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$5);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var _useState = useState(options ? normalizeOptions(options, labelKey, valueKey) : []),
      optionValues = _useState[0],
      setOptionValues = _useState[1];

  useEffect(function () {
    if (url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return function () {};
  }, [options]);
  var currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Radio> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined) {
    currentValue = '';
  }

  if (typeof currentValue === 'object') {
    currentValue = JSON.stringify(currentValue);
  }

  var onChange = function onChange(e) {
    var newValue = e.target.value;

    if (e.target.getAttribute('data-json') === 'true') {
      newValue = JSON.parse(newValue);
    }

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  return /*#__PURE__*/React__default.createElement("ul", _extends({
    className: ("formosa-radio " + listClassName).trim()
  }, listAttributes), optionValues.map(function (optionValue) {
    var optionValueVal = optionValue.value;
    var isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    var checked = currentValue === optionValueVal;
    var optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    if (name) {
      optionProps.name = name;
    }

    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: ("formosa-radio__item " + listItemClassName).trim(),
      key: optionValueVal
    }, listItemAttributes), /*#__PURE__*/React__default.createElement("label", _extends({
      className: ("formosa-radio__label" + (checked ? ' formosa-radio__label--checked' : '') + " " + labelClassName).trim()
    }, labelAttributes), /*#__PURE__*/React__default.createElement("input", _extends({
      checked: checked,
      className: ("formosa-field__input formosa-radio__input " + className).trim(),
      onChange: onChange,
      required: required,
      type: "radio",
      value: optionValueVal
    }, optionProps, otherProps)), optionValue.label));
  }));
}
Radio.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
  labelAttributes: PropTypes.object,
  labelClassName: PropTypes.string,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  listAttributes: PropTypes.object,
  listClassName: PropTypes.string,
  listItemAttributes: PropTypes.object,
  listItemClassName: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  required: PropTypes.bool,
  setValue: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};
Radio.defaultProps = {
  afterChange: null,
  className: '',
  label: '',
  labelAttributes: null,
  labelClassName: '',
  labelKey: 'name',
  listAttributes: null,
  listClassName: '',
  listItemAttributes: null,
  listItemClassName: '',
  name: '',
  options: null,
  required: false,
  setValue: null,
  url: null,
  value: null,
  valueKey: null
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

function SvgSearch(props) {
  return /*#__PURE__*/createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/createElement("path", {
    d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"
  })));
}

var _excluded$6 = ["className", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "wrapperAttributes", "wrapperClassName"];
function Search(_ref) {
  var className = _ref.className,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$6);

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-search-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input--search " + className).trim()
  }, otherProps)), /*#__PURE__*/React__default.createElement(SvgSearch, _extends({
    "aria-hidden": "true",
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

function SvgCaret(props) {
  return /*#__PURE__*/createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/createElement("path", {
    d: "M0 2l4 4 4-4H0z"
  })));
}

var _excluded$7 = ["afterChange", "className", "hideBlank", "iconAttributes", "iconClassName", "iconHeight", "iconWidth", "id", "labelKey", "name", "options", "setValue", "url", "value", "valueKey", "wrapperAttributes", "wrapperClassName"];
function Select(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      hideBlank = _ref.hideBlank,
      iconAttributes = _ref.iconAttributes,
      iconClassName = _ref.iconClassName,
      iconHeight = _ref.iconHeight,
      iconWidth = _ref.iconWidth,
      id = _ref.id,
      labelKey = _ref.labelKey,
      name = _ref.name,
      options = _ref.options,
      setValue = _ref.setValue,
      url = _ref.url,
      value = _ref.value,
      valueKey = _ref.valueKey,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$7);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var _useState = useState(options ? normalizeOptions(options, labelKey, valueKey) : []),
      optionValues = _useState[0],
      setOptionValues = _useState[1];

  useEffect(function () {
    if (url) {
      Api.get(url).then(function (response) {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return function () {};
  }, [url]);
  useEffect(function () {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return function () {};
  }, [options]);
  var currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Select> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined) {
    currentValue = '';
  }

  if (typeof currentValue === 'object') {
    currentValue = JSON.stringify(currentValue);
  }

  var onChange = function onChange(e) {
    var newValue = e.target.value;
    var option = e.target.querySelector("[value=\"" + newValue.replace(/"/g, '\\"') + "\"]");

    if (option.getAttribute('data-json') === 'true') {
      newValue = JSON.parse(newValue);
    }

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  var props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-select-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("select", _extends({
    className: ("formosa-field__input formosa-field__input--select " + className).trim(),
    onChange: onChange,
    value: currentValue
  }, props, otherProps), !hideBlank && /*#__PURE__*/React__default.createElement("option", {
    value: ""
  }), optionValues.map(function (optionValue) {
    var optionValueVal = optionValue.value;
    var isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    var optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    return /*#__PURE__*/React__default.createElement("option", _extends({
      key: optionValueVal,
      value: optionValueVal
    }, optionProps), optionValue.label);
  })), /*#__PURE__*/React__default.createElement(SvgCaret, _extends({
    "aria-hidden": "true",
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
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setValue: PropTypes.func,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
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
  labelKey: 'name',
  name: '',
  options: null,
  setValue: null,
  url: null,
  value: null,
  valueKey: null,
  wrapperAttributes: null,
  wrapperClassName: ''
};

var _excluded$8 = ["afterChange", "className", "id", "name", "setValue", "value"];
function Textarea(_ref) {
  var afterChange = _ref.afterChange,
      className = _ref.className,
      id = _ref.id,
      name = _ref.name,
      setValue = _ref.setValue,
      value = _ref.value,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$8);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Textarea> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined) {
    currentValue = '';
  }

  var onChange = function onChange(e) {
    var newValue = e.target.value;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  var props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement("textarea", _extends({
    className: ("formosa-field__input formosa-field__input--textarea " + className).trim(),
    onChange: onChange,
    value: currentValue
  }, props, otherProps));
}
Textarea.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  setValue: PropTypes.func,
  value: PropTypes.string
};
Textarea.defaultProps = {
  afterChange: null,
  className: '',
  id: null,
  name: '',
  setValue: null,
  value: null
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

  var _useContext = useContext(formContext),
      formState = _useContext.formState,
      setFormState = _useContext.setFormState;

  var _useState = useState(1),
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
  name: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  removable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
};
HasMany.defaultProps = {
  attributes: [],
  buttonClassName: '',
  name: '',
  removable: true
};

var _excluded$9 = ["component", "type"];
function ExportableInput(_ref) {
  var component = _ref.component,
      type = _ref.type,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$9);

  var InputComponent = getInputElement(type, component);

  if (type === 'has-many') {
    InputComponent = HasMany;
  }

  return /*#__PURE__*/React__default.createElement(InputComponent, _extends({
    type: type
  }, otherProps));
}
ExportableInput.propTypes = {
  component: PropTypes.func,
  type: PropTypes.string
};
ExportableInput.defaultProps = {
  component: null,
  type: 'text'
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

var _excluded$b = ["component", "disabled", "id", "inputWrapperAttributes", "inputWrapperClassName", "label", "labelAttributes", "labelClassName", "labelNote", "labelPosition", "name", "note", "prefix", "postfix", "readOnly", "required", "suffix", "type", "wrapperAttributes", "wrapperClassName"];
function Field(_ref) {
  var component = _ref.component,
      disabled = _ref.disabled,
      id = _ref.id,
      inputWrapperAttributes = _ref.inputWrapperAttributes,
      inputWrapperClassName = _ref.inputWrapperClassName,
      label = _ref.label,
      labelAttributes = _ref.labelAttributes,
      labelClassName = _ref.labelClassName,
      labelNote = _ref.labelNote,
      labelPosition = _ref.labelPosition,
      name = _ref.name,
      note = _ref.note,
      prefix = _ref.prefix,
      postfix = _ref.postfix,
      readOnly = _ref.readOnly,
      required = _ref.required,
      suffix = _ref.suffix,
      type = _ref.type,
      wrapperAttributes = _ref.wrapperAttributes,
      wrapperClassName = _ref.wrapperClassName,
      otherProps = _objectWithoutPropertiesLoose(_ref, _excluded$b);

  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var inputProps = _extends({}, otherProps);

  if (id) {
    inputProps.id = id;
  }

  if (name) {
    inputProps.name = name;
  }

  if (disabled) {
    inputProps.disabled = disabled;
  }

  if (readOnly) {
    inputProps.readOnly = readOnly;
  }

  if (required) {
    inputProps.required = required;
  }

  if (suffix) {
    inputProps.suffix = suffix;
  }

  if (type) {
    inputProps.type = type;

    if (readOnly && type === 'number') {
      inputProps.type = 'text';
    }
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
  var labelComponent = /*#__PURE__*/React__default.createElement(Label, _extends({
    className: labelClassName,
    htmlFor: htmlFor,
    label: label,
    note: labelNote,
    required: required,
    type: type
  }, labelAttributes));
  var hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);
  var cleanName = htmlFor.replace(/[^a-z0-9_-]/gi, '');
  var wrapperClassNameList = ['formosa-field'];

  if (cleanName) {
    wrapperClassNameList.push("formosa-field--" + cleanName);
  }

  if (wrapperClassName) {
    wrapperClassNameList.push(wrapperClassName);
  }

  if (hasError) {
    wrapperClassNameList.push('formosa-field--has-error');
  }

  if (disabled) {
    wrapperClassNameList.push('formosa-field--disabled');
  }

  if (readOnly) {
    wrapperClassNameList.push('formosa-field--read-only');
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

  if (inputWrapperClassName) {
    inputWrapperClassNameList.push(inputWrapperClassName);
  }

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
  }, note), postfix, /*#__PURE__*/React__default.createElement(Error$1, {
    id: id,
    name: name
  })));
}
Field.propTypes = {
  component: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputWrapperAttributes: PropTypes.object,
  inputWrapperClassName: PropTypes.string,
  label: PropTypes.string,
  labelAttributes: PropTypes.object,
  labelClassName: PropTypes.string,
  labelNote: PropTypes.string,
  labelPosition: PropTypes.string,
  name: PropTypes.string,
  note: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
  prefix: PropTypes.node,
  postfix: PropTypes.node,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  suffix: PropTypes.string,
  type: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};
Field.defaultProps = {
  component: null,
  disabled: false,
  id: null,
  inputWrapperAttributes: {},
  inputWrapperClassName: '',
  label: '',
  labelAttributes: {},
  labelClassName: '',
  labelNote: '',
  labelPosition: 'before',
  name: '',
  note: '',
  prefix: null,
  postfix: null,
  readOnly: false,
  required: false,
  suffix: '',
  type: 'text',
  wrapperAttributes: {},
  wrapperClassName: ''
};

var formosaContext = /*#__PURE__*/React__default.createContext({
  addToast: null,
  removeToast: null,
  toasts: {},
  disableWarningPrompt: null,
  enableWarningPrompt: null,
  showWarningPrompt: true
});

function Message() {
  var _useContext = useContext(formContext),
      formState = _useContext.formState;

  var hasErrors = Object.prototype.hasOwnProperty.call(formState.errors, '');
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasErrors && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--error"
  }, formState.errors[''].join(' ')), formState.message && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--success"
  }, formState.message));
}

var _excluded$c = ["afterNoSubmit", "afterSubmit", "beforeSubmit", "children", "clearOnSubmit", "defaultRow", "filterBody", "filterValues", "htmlId", "id", "method", "params", "path", "preventEmptyRequest", "relationshipNames", "showMessage", "successMessageText", "successToastText"];
function FormInner(_ref) {
  var afterNoSubmit = _ref.afterNoSubmit,
      afterSubmit = _ref.afterSubmit,
      beforeSubmit = _ref.beforeSubmit,
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

  var _useContext = useContext(formContext),
      formState = _useContext.formState,
      setFormState = _useContext.setFormState;

  var _useContext2 = useContext(formosaContext),
      formosaState = _useContext2.formosaState;

  var submitApiRequest = function submitApiRequest(e) {
    e.preventDefault();

    if (preventEmptyRequest && formState.dirty.length <= 0) {
      formosaState.addToast('No changes to save.');

      if (afterNoSubmit) {
        afterNoSubmit();
      }

      return;
    }

    if (beforeSubmit && !beforeSubmit(e)) {
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

          if (!document.querySelector("[data-name=\"" + key + "\"].formosa-field__error")) {
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
  beforeSubmit: PropTypes.func,
  children: PropTypes.node,
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
  beforeSubmit: null,
  children: null,
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

  var _useState = useState({
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
        var additionalChanges = afterChange(e, newRow, value);
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

  useEffect(function () {
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
  children: PropTypes.node,
  row: PropTypes.object,
  setRow: PropTypes.func
};
Form.defaultProps = {
  children: null,
  row: {},
  setRow: null
};

var Spinner = function Spinner() {
  var _usePromiseTracker = usePromiseTracker(),
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

  var _useContext = useContext(formosaContext),
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
    "aria-hidden": "true",
    className: "formosa-toast__close-icon",
    height: 12,
    width: 12
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
  var _useContext = useContext(formosaContext),
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

  var _useState = useState({
    addToast: null,
    removeToast: null,
    toasts: {},
    disableWarningPrompt: null,
    enableWarningPrompt: null,
    showWarningPrompt: true
  }),
      formosaState = _useState[0],
      setFormosaState = _useState[1];

  var formosaStateRef = useRef(formosaState);
  formosaStateRef.current = formosaState;
  useEffect(function () {
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

    var disableWarningPrompt = function disableWarningPrompt() {
      setFormosaState(_extends({}, formosaStateRef.current, {
        showWarningPrompt: false
      }));
    };

    var enableWarningPrompt = function enableWarningPrompt() {
      setFormosaState(_extends({}, formosaStateRef.current, {
        showWarningPrompt: true
      }));
    };

    setFormosaState(_extends({}, formosaStateRef.current, {
      addToast: addToast,
      removeToast: removeToast,
      disableWarningPrompt: disableWarningPrompt,
      enableWarningPrompt: enableWarningPrompt
    }));
    return function () {};
  }, []);
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
var CheckIcon = SvgCheck;
var Error$2 = Error$1;
var Field$1 = Field;
var Form$1 = Form;
var FormContainer$1 = FormContainer;
var FormContext = formContext;
var FormosaContext = formosaContext;
var Input$1 = ExportableInput;
var Label$1 = Label;
var Message$1 = Message;
var Submit$1 = Submit;

export { Api$1 as Api, CheckIcon, Error$2 as Error, Field$1 as Field, Form$1 as Form, FormContainer$1 as FormContainer, FormContext, FormosaContext, Input$1 as Input, Label$1 as Label, Message$1 as Message, Submit$1 as Submit };
//# sourceMappingURL=index.modern.js.map
