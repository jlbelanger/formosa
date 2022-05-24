import get from 'get-value';
import set from 'set-value';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import React__default, { createElement, useContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const findIncluded = (included, id, type, mainRecord) => {
  if (mainRecord && id === mainRecord.id && type === mainRecord.type) {
    const output = {
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

  return included.find(data => data.id === id && data.type === type);
};

const deserializeSingle = (data, otherRows = [], included = [], mainRecord = null) => {
  if (!data) {
    return data;
  }

  const output = {
    id: data.id,
    type: data.type,
    ...data.attributes
  };

  if (Object.prototype.hasOwnProperty.call(data, 'relationships')) {
    let includedRecord;
    Object.keys(data.relationships).forEach(relationshipName => {
      output[relationshipName] = data.relationships[relationshipName].data;

      if (Array.isArray(output[relationshipName])) {
        output[relationshipName].forEach((rel, i) => {
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

const deserialize = body => {
  if (Array.isArray(body.data)) {
    const output = [];
    body.data.forEach(data => {
      output.push(deserializeSingle(data, body.data, body.included, null));
    });
    return output;
  }

  return deserializeSingle(body.data, [], body.included, body.data);
};

const cleanSingleRelationship = values => ({
  id: values.id,
  type: values.type
});

const cleanRelationship = values => {
  if (Array.isArray(values)) {
    return values.map(value => cleanSingleRelationship(value));
  }

  return cleanSingleRelationship(values);
};

const getIncluded = (data, dirtyIncluded, relationshipNames) => {
  const included = [];
  const dirtyKeys = {};
  dirtyIncluded.forEach(key => {
    if (!key.startsWith('_new.')) {
      const currentKeys = [];
      key.split('.').forEach(k => {
        currentKeys.push(k);

        if (typeof get(dirtyKeys, currentKeys.join('.')) === 'undefined') {
          set(dirtyKeys, currentKeys.join('.'), {});
        }
      });
    }
  });
  relationshipNames.forEach(relationshipName => {
    if (!Object.prototype.hasOwnProperty.call(data.relationships, relationshipName)) {
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(dirtyKeys, relationshipName)) {
      return;
    }

    if (!Array.isArray(data.relationships[relationshipName].data)) {
      return;
    }

    data.relationships[relationshipName].data.forEach(rel => {
      if (Object.keys(rel).length <= 2) {
        return;
      }

      if (Object.prototype.hasOwnProperty.call(dirtyKeys[relationshipName], rel.id)) {
        const relData = {
          id: rel.id,
          type: rel.type,
          attributes: {}
        };

        if (Object.keys(dirtyKeys[relationshipName][rel.id]).length === 0) {
          Object.keys(rel).forEach(key => {
            if (key !== 'id' && key !== 'type') {
              set(relData.attributes, key, rel[key]);
            }
          });
        } else {
          Object.keys(rel).forEach(key => {
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

const getBody = (method, type, id, formState, relationshipNames, filterBody, filterValues) => {
  let body = null;

  if (method === 'PUT' || method === 'POST') {
    body = {};
    const data = {
      type,
      attributes: {},
      meta: {},
      relationships: {}
    };
    const keys = method === 'PUT' ? formState.dirty : Object.keys(formState.row);

    if (method === 'PUT' && id) {
      data.id = id;
    }

    let values = { ...formState.row
    };

    if (filterValues) {
      values = filterValues(values);
    }

    const fileKeys = Object.keys(formState.files);
    keys.forEach(key => {
      const cleanKey = key.replace(/\..+$/, '');

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
    const included = getIncluded(data, formState.dirtyIncluded, relationshipNames);

    if (included.length > 0) {
      body.included = included;
    }

    Object.keys(data.relationships).forEach(relationshipName => {
      if (typeof data.relationships[relationshipName].data === 'string') {
        data.relationships[relationshipName].data = JSON.parse(data.relationships[relationshipName].data);
      }

      if (Array.isArray(data.relationships[relationshipName].data)) {
        data.relationships[relationshipName].data = data.relationships[relationshipName].data.map(rel => cleanRelationship(rel));
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

    const filenames = fileKeys.filter(filename => formState.files[filename] !== false);

    if (filenames.length > 0) {
      const formData = new FormData();
      formData.append('json', JSON.stringify(body));
      formData.append('files', JSON.stringify(filenames));
      filenames.forEach(filename => {
        formData.append(filename, formState.files[filename]);
      });
      body = formData;
    } else {
      body = JSON.stringify(body);
    }
  }

  return body;
};

class Api {
  static get(url) {
    return Api.request('GET', url);
  }

  static delete(url) {
    return Api.request('DELETE', url);
  }

  static post(url, body) {
    return Api.request('POST', url, body);
  }

  static put(url, body) {
    return Api.request('PUT', url, body);
  }

  static request(method, url, body = null) {
    const options = {
      method,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    if (typeof body === 'string') {
      options.headers['Content-Type'] = 'application/json';
    }

    if (Api.getToken()) {
      options.headers.Authorization = `Bearer ${Api.getToken()}`;
    }

    if (body) {
      options.body = body;
    }

    return trackPromise(fetch(`${process.env.REACT_APP_API_URL}/${url}`, options).then(response => {
      if (!response.ok) {
        return response.json().then(json => {
          json.status = response.status;
          throw json;
        }).catch(error => {
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
    }).then(json => {
      if (Object.prototype.hasOwnProperty.call(json, 'data')) {
        return deserialize(json);
      }

      return json;
    }));
  }

  static getToken() {
    return window.FORMOSA_TOKEN;
  }

  static setToken(token) {
    window.FORMOSA_TOKEN = token;
  }

}

var _path;

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

function SvgCheck(props) {
  return /*#__PURE__*/createElement("svg", _extends({
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

function Error$1({
  id,
  name
}) {
  const {
    formState
  } = useContext(formContext);
  const hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);
  const props = {};

  if (name) {
    props['data-name'] = name;
  }

  if (id || name) {
    props.id = `${id || name}-error`;
  }

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: "formosa-field__error"
  }, props), hasError && formState.errors[name].map(e => /*#__PURE__*/React__default.createElement("div", {
    key: e
  }, e)));
}
Error$1.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string
};
Error$1.defaultProps = {
  id: null,
  name: ''
};

const normalizeOptions = (options, labelKey, valueKey = null) => {
  if (!options) {
    return [];
  }

  const output = [];

  if (Array.isArray(options)) {
    options.forEach(option => {
      if (typeof option === 'string') {
        output.push({
          label: option,
          value: option
        });
      } else {
        output.push({ ...option,
          label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
          value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey)
        });
      }
    });
  } else {
    Object.keys(options).forEach(value => {
      const option = options[value];

      if (typeof value === 'string') {
        output.push({
          label: option,
          value
        });
      } else {
        output.push({ ...option,
          label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
          value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey)
        });
      }
    });
  }

  return output;
};
const escapeRegExp = string => string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

const toSlug = s => s.toLowerCase().replace(/ & /g, '-and-').replace(/<[^>]+>/g, '').replace(/['’.]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/--+/g, '-');

const filterByKey = (records, key, value) => {
  value = value.toLowerCase();
  const escapedValue = escapeRegExp(value);
  records = records.filter(record => {
    const recordValue = get(record, key).toString().toLowerCase() || '';
    return recordValue.match(new RegExp(`(^|[^a-z])${escapedValue}`));
  });
  value = toSlug(value);
  records = records.sort((a, b) => {
    const aValue = toSlug(get(a, key).toString());
    const bValue = toSlug(get(b, key).toString());
    const aPos = aValue.indexOf(value) === 0;
    const bPos = bValue.indexOf(value) === 0;

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
  return /*#__PURE__*/createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/createElement("path", {
    d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z"
  })));
}

function Autocomplete({
  afterAdd,
  afterChange,
  clearable,
  clearButtonAttributes,
  clearButtonClassName,
  clearIconAttributes,
  clearIconHeight,
  clearIconWidth,
  clearText,
  disabled,
  id,
  inputClassName,
  labelFn,
  labelKey,
  max,
  name,
  optionButtonAttributes,
  optionButtonClassName,
  optionListAttributes,
  optionListClassName,
  optionListItemAttributes,
  optionListItemClassName,
  options,
  placeholder,
  readOnly,
  removeButtonAttributes,
  removeButtonClassName,
  removeIconAttributes,
  removeIconHeight,
  removeIconWidth,
  removeText,
  setValue,
  url,
  value,
  valueKey,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  const clearButtonRef = useRef(null);
  const inputRef = useRef(null);
  const removeButtonRef = useRef(null);
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  useEffect(() => {
    if (url) {
      Api.get(url).then(response => {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return () => {};
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return () => {};
  }, [options]);
  let currentValue = [];

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Autocomplete> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);
  }

  if (currentValue === null || currentValue === undefined || currentValue === '') {
    currentValue = [];
  } else if (max === 1 && !Array.isArray(currentValue)) {
    currentValue = [currentValue];
  }

  const isSelected = option => currentValue.findIndex(v => v.value === option.value) > -1;

  let filteredOptions = [];

  if (filter) {
    filteredOptions = filterByKey(optionValues, 'label', filter);
    filteredOptions = filteredOptions.filter(option => !isSelected(option));
  }

  const focus = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  };

  const addValue = v => {
    let newValue;

    if (max === 1) {
      newValue = v;
    } else {
      newValue = [...currentValue, v];
    }

    if (setValue) {
      setValue(newValue);
    } else {
      const e = {
        target: {
          name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

    setIsOpen(false);
    setFilter('');

    if (max === 1) {
      setTimeout(() => {
        if (removeButtonRef.current) {
          removeButtonRef.current.focus();
        }
      });
    } else if (max === currentValue.length) {
      setTimeout(() => {
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

  const removeValue = v => {
    let newValue = [...currentValue];

    if (max !== 1) {
      const index = newValue.indexOf(v);

      if (index > -1) {
        newValue.splice(index, 1);
      }
    } else {
      newValue = '';
    }

    if (setValue) {
      setValue(newValue);
    } else {
      const e = {
        target: {
          name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

    focus();
  };

  const onChange = e => {
    setFilter(e.target.value);
  };

  const onFocus = () => {
    setHighlightedIndex(0);
    setIsOpen(filter.length > 0);
  };

  const onKeyDown = e => {
    const filterValue = e.target.value;
    const numValues = currentValue ? currentValue.length : 0;

    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
    } else if (e.key === 'Backspace' && !filter && numValues > 0) {
      removeValue(currentValue[numValues - 1]);
    }
  };

  const onKeyUp = e => {
    const filterValue = e.target.value;

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

  const onClickOption = e => {
    let val = e.target.getAttribute('data-value');

    if (e.target.getAttribute('data-json') === 'true') {
      val = JSON.parse(val);
    }

    addValue(val);
  };

  const onClickRemoveOption = e => {
    let button = e.target;

    while (button && button.tagName.toUpperCase() !== 'BUTTON') {
      button = button.parentNode;
    }

    removeValue(currentValue[button.getAttribute('data-index')]);
  };

  const clear = () => {
    const newValue = [];

    if (setValue) {
      setValue(newValue);
    } else {
      const e = {
        target: {
          name
        }
      };
      formState.setValues(formState, e, name, newValue, afterChange);
    }

    setFilter('');
    focus();
  };

  const showClear = clearable && max !== 1 && currentValue.length > 0 && !disabled && !readOnly;
  let className = ['formosa-autocomplete'];

  if (showClear) {
    className.push('formosa-autocomplete--clearable');
  }

  className = className.join(' ');
  const canAddValues = !disabled && !readOnly && (max === null || currentValue.length < max);
  const wrapperProps = {};

  if (id || name) {
    wrapperProps.id = `${id || name}-wrapper`;
  }

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `${className} ${wrapperClassName}`.trim(),
    "data-value": JSON.stringify(max === 1 && currentValue.length > 0 ? currentValue[0] : currentValue)
  }, wrapperProps, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement("ul", {
    className: "formosa-autocomplete__values"
  }, currentValue && currentValue.map((v, index) => {
    let val = v;
    let isJson = false;

    if (typeof val === 'object') {
      val = JSON.stringify(val);
      isJson = true;
    }

    const option = optionValues.find(o => isJson ? JSON.stringify(o.value) === val : o.value === val);
    let label = '';

    if (labelFn) {
      label = labelFn(option || v);
    } else if (option && Object.prototype.hasOwnProperty.call(option, 'label')) {
      label = option.label;
    }

    return /*#__PURE__*/React__default.createElement("li", {
      className: "formosa-autocomplete__value formosa-autocomplete__value--item",
      key: val
    }, label, !disabled && !readOnly && /*#__PURE__*/React__default.createElement("button", Object.assign({
      className: `formosa-autocomplete__value__remove ${removeButtonClassName}`.trim(),
      "data-index": index,
      onClick: onClickRemoveOption,
      ref: removeButtonRef,
      type: "button"
    }, removeButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, Object.assign({
      height: removeIconHeight,
      width: removeIconWidth
    }, removeIconAttributes)), removeText));
  }), canAddValues && /*#__PURE__*/React__default.createElement("li", {
    className: "formosa-autocomplete__value formosa-autocomplete__value--input"
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({}, otherProps, {
    autoComplete: "off",
    className: `formosa-field__input formosa-autocomplete__input ${inputClassName}`.trim(),
    id: id || name,
    onChange: onChange,
    onFocus: onFocus,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    placeholder: placeholder,
    ref: inputRef,
    type: "text",
    value: filter
  })))), isOpen && filteredOptions.length > 0 && /*#__PURE__*/React__default.createElement("ul", Object.assign({
    className: `formosa-autocomplete__options ${optionListClassName}`.trim()
  }, optionListAttributes), filteredOptions.map((option, index) => {
    let optionClassName = ['formosa-autocomplete__option'];

    if (highlightedIndex === index) {
      optionClassName.push('formosa-autocomplete__option--highlighted');
    }

    optionClassName = optionClassName.join(' ');
    let val = option.value;
    let isJson = false;

    if (typeof val === 'object') {
      isJson = true;
      val = JSON.stringify(val);
    }

    return /*#__PURE__*/React__default.createElement("li", Object.assign({
      className: `${optionClassName} ${optionListItemClassName}`.trim(),
      key: val
    }, optionListItemAttributes), /*#__PURE__*/React__default.createElement("button", Object.assign({
      className: `formosa-autocomplete__option__button ${optionButtonClassName}`.trim(),
      "data-json": isJson,
      "data-value": val,
      onClick: onClickOption,
      type: "button"
    }, optionButtonAttributes), option.label));
  })), showClear && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", Object.assign({
    className: `formosa-autocomplete__clear ${clearButtonClassName}`.trim(),
    onClick: clear,
    ref: clearButtonRef,
    type: "button"
  }, clearButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, Object.assign({
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

function Checkbox({
  afterChange,
  className,
  iconAttributes,
  iconClassName,
  iconHeight,
  iconWidth,
  id,
  name,
  setValue,
  value,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  let checked = false;

  if (setValue !== null) {
    checked = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Checkbox> component must be inside a <Form> component.');
    }

    checked = !!get(formState.row, name);
  }

  const onChange = e => {
    const newValue = e.target.checked;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  const props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: `formosa-field__input formosa-field__input--checkbox ${className}`.trim(),
    checked: checked,
    onChange: onChange,
    type: "checkbox"
  }, props, otherProps)), /*#__PURE__*/React__default.createElement(SvgCheck, Object.assign({
    className: `formosa-icon--check ${iconClassName}`.trim(),
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

function CheckboxList({
  afterChange,
  className,
  disabled,
  iconAttributes,
  iconClassName,
  iconHeight,
  iconWidth,
  labelAttributes,
  labelClassName,
  labelKey,
  listAttributes,
  listClassName,
  listItemAttributes,
  listItemClassName,
  name,
  options,
  readOnly,
  setValue,
  url,
  value,
  valueKey
}) {
  const {
    formState
  } = useContext(formContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  useEffect(() => {
    if (url) {
      Api.get(url).then(response => {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return () => {};
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return () => {};
  }, [options]);
  let currentValue = [];

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

  currentValue = currentValue.map(val => typeof val === 'object' ? JSON.stringify(val) : val);

  const onChange = e => {
    const newValue = [...currentValue];
    let val = e.target.value;

    if (e.target.checked) {
      if (e.target.getAttribute('data-json') === 'true') {
        val = JSON.parse(val);
      }

      newValue.push(val);
    } else {
      const index = currentValue.indexOf(val);

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

  return /*#__PURE__*/React__default.createElement("ul", Object.assign({
    className: `formosa-radio ${listClassName}`.trim()
  }, listAttributes), optionValues.map((optionValue, index) => {
    let optionValueVal = optionValue.value;
    let isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    const checked = currentValue.includes(optionValueVal);
    const optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    if (name) {
      optionProps.name = `${name}[]`;
    }

    return /*#__PURE__*/React__default.createElement("li", Object.assign({
      className: `formosa-radio__item ${listItemClassName}`.trim(),
      key: optionValueVal
    }, listItemAttributes), /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-input-wrapper formosa-input-wrapper--checkbox"
    }, /*#__PURE__*/React__default.createElement("label", Object.assign({
      className: `formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()
    }, labelAttributes), /*#__PURE__*/React__default.createElement("input", Object.assign({
      checked: checked,
      className: `formosa-field__input formosa-field__input--checkbox ${className}`.trim(),
      disabled: disabled,
      onChange: onChange,
      readOnly: readOnly,
      type: "checkbox",
      value: optionValueVal
    }, optionProps)), /*#__PURE__*/React__default.createElement(SvgCheck, Object.assign({
      className: `formosa-icon--check ${iconClassName}`.trim(),
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

const stringToObject = (datetimeString, timeZone) => {
  const output = {
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

  const values = datetimeString.replace(/[^0-9]/g, '-').split('-');
  const numValues = values.length;

  if (numValues >= 6) {
    output.second = values[5];
  }

  if (numValues >= 5) {
    output.minute = values[4];
  }

  if (numValues >= 4) {
    output.hour = values[3];

    if (parseInt(output.hour, 10) > 12) {
      output.hour -= 12;
      output.ampm = 'pm';
    }
  }

  if (numValues >= 3) {
    output.day = values[2] ? parseInt(values[2], 10) : '';
  }

  if (numValues >= 2) {
    output.month = values[1] ? parseInt(values[1], 10) : '';
  }

  if (numValues >= 1) {
    output.year = values[0] ? parseInt(values[0], 10) : '';
  }

  return output;
};
const objectToString = datetimeObject => {
  let hour = parseInt(datetimeObject.hour, 10);

  if (datetimeObject.ampm === 'pm' && hour < 12) {
    hour += 12;
  } else if (datetimeObject.ampm === 'am' && hour === 12) {
    hour = 0;
  }

  return `${datetimeObject.year}-${datetimeObject.month}-${datetimeObject.day} ${hour}:${datetimeObject.minute}:${datetimeObject.second}`;
};

var _path$2;

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

function SvgCaret(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/createElement("path", {
    d: "M0 2l4 4 4-4H0z"
  })));
}

function Select({
  afterChange,
  className,
  hideBlank,
  iconAttributes,
  iconClassName,
  iconHeight,
  iconWidth,
  id,
  labelKey,
  name,
  options,
  setValue,
  url,
  value,
  valueKey,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  useEffect(() => {
    if (url) {
      Api.get(url).then(response => {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return () => {};
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return () => {};
  }, [options]);
  let currentValue = '';

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

  const onChange = e => {
    let newValue = e.target.value;
    const option = e.target.querySelector(`[value="${newValue.replace(/"/g, '\\"')}"]`);

    if (option.getAttribute('data-json') === 'true') {
      newValue = JSON.parse(newValue);
    }

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  const props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-select-wrapper ${wrapperClassName}`.trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("select", Object.assign({
    className: `formosa-field__input formosa-field__input--select ${className}`.trim(),
    onChange: onChange,
    value: currentValue
  }, props, otherProps), !hideBlank && /*#__PURE__*/React__default.createElement("option", {
    value: ""
  }), optionValues.map(optionValue => {
    let optionValueVal = optionValue.value;
    let isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    const optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    return /*#__PURE__*/React__default.createElement("option", Object.assign({
      key: optionValueVal,
      value: optionValueVal
    }, optionProps), optionValue.label);
  })), /*#__PURE__*/React__default.createElement(SvgCaret, Object.assign({
    className: `formosa-icon--caret ${iconClassName}`.trim(),
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

function Datetime({
  afterChange,
  ampmAttributes,
  convertToTimezone,
  dayAttributes,
  disabled,
  hourAttributes,
  minuteAttributes,
  monthAttributes,
  name,
  secondAttributes,
  setValue,
  value,
  wrapperAttributes,
  wrapperClassName,
  yearAttributes
}) {
  const {
    formState
  } = useContext(formContext);
  let currentValue = '';

  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Datetime> component must be inside a <Form> component.');
    }

    currentValue = get(formState.row, name);

    if (currentValue === null || currentValue === undefined) {
      currentValue = '';
    }
  }

  console.log('currentValue', currentValue);
  const currentValueObject = stringToObject(currentValue);
  console.log('currentValueObject', currentValueObject);

  const onChange = e => {
    const key = e.target.getAttribute('data-datetime');
    const newValueObject = { ...currentValueObject,
      [key]: e.target.value
    };
    console.log('newValueObject', JSON.stringify(newValueObject));
    const newValue = objectToString(newValueObject);
    console.log('newValue', newValue);

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-datetime-wrapper ${wrapperClassName}`.trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Select, Object.assign({
    "data-datetime": "month",
    disabled: disabled,
    id: `${name}-month`,
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
    setValue: () => {
      onChange({
        target: document.getElementById(`${name}-month`)
      });
    },
    type: "select",
    value: currentValueObject.month,
    wrapperClassName: "formosa-field__input--date formosa-field__input--month"
  }, monthAttributes)), /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: "formosa-field__input formosa-field__input--date formosa-field__input--day",
    "data-datetime": "day",
    disabled: disabled,
    id: `${name}-day`,
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "DD",
    size: 4,
    type: "text",
    value: currentValueObject.day
  }, dayAttributes)), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-suffix-container"
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: "formosa-field__input formosa-field__input--date formosa-field__input--year",
    "data-datetime": "year",
    disabled: disabled,
    id: `${name}-year`,
    inputMode: "numeric",
    maxLength: 4,
    onChange: onChange,
    placeholder: "YYYY",
    size: 6,
    type: "text",
    value: currentValueObject.year
  }, yearAttributes)), /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-suffix"
  }, ",")), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-suffix-container"
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: "formosa-field__input formosa-field__input--date formosa-field__input--hour",
    "data-datetime": "hour",
    disabled: disabled,
    id: `${name}-hour`,
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "hh",
    size: 4,
    type: "text",
    value: currentValueObject.hour
  }, hourAttributes)), /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-suffix"
  }, ":")), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-suffix-container"
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: "formosa-field__input formosa-field__input--date formosa-field__input--minute",
    "data-datetime": "minute",
    disabled: disabled,
    id: `${name}-minute`,
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "mm",
    size: 4,
    type: "text",
    value: currentValueObject.minute
  }, minuteAttributes)), /*#__PURE__*/React__default.createElement("span", {
    className: "formosa-suffix"
  }, ":")), /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: "formosa-field__input formosa-field__input--date formosa-field__input--second",
    "data-datetime": "second",
    disabled: disabled,
    id: `${name}-second`,
    inputMode: "numeric",
    maxLength: 2,
    onChange: onChange,
    placeholder: "ss",
    size: 4,
    type: "text",
    value: currentValueObject.second
  }, secondAttributes)), /*#__PURE__*/React__default.createElement(Select, Object.assign({
    "data-datetime": "ampm",
    disabled: disabled,
    hideBlank: true,
    id: `${name}-ampm`,
    options: {
      am: 'am',
      pm: 'pm'
    },
    setValue: () => {
      onChange({
        target: document.getElementById(`${name}-ampm`)
      });
    },
    type: "select",
    value: currentValueObject.ampm,
    wrapperClassName: "formosa-field__input--date formosa-field__input--ampm"
  }, ampmAttributes)), /*#__PURE__*/React__default.createElement("input", {
    name: name,
    type: "hidden",
    value: currentValue
  }));
}
Datetime.propTypes = {
  afterChange: PropTypes.func,
  ampmAttributes: PropTypes.object,
  convertToTimezone: PropTypes.string,
  dayAttributes: PropTypes.object,
  disabled: PropTypes.bool,
  hourAttributes: PropTypes.object,
  minuteAttributes: PropTypes.object,
  monthAttributes: PropTypes.object,
  name: PropTypes.string,
  secondAttributes: PropTypes.object,
  setValue: PropTypes.func,
  value: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string,
  yearAttributes: PropTypes.object
};
Datetime.defaultProps = {
  afterChange: null,
  ampmAttributes: null,
  convertToTimezone: 'UTC',
  dayAttributes: null,
  disabled: false,
  hourAttributes: null,
  minuteAttributes: null,
  monthAttributes: null,
  name: '',
  secondAttributes: null,
  setValue: null,
  value: null,
  wrapperAttributes: null,
  wrapperClassName: '',
  yearAttributes: null
};

function File({
  afterChange,
  buttonAttributes,
  buttonClassName,
  className,
  disabled,
  emptyText,
  id,
  imageAttributes,
  imageClassName,
  imageHeight,
  imagePrefix,
  imagePreview,
  inputWrapperAttributes,
  inputWrapperClassName,
  linkAttributes,
  linkClassName,
  linkImage,
  multiple,
  name,
  readOnly,
  removeText,
  required,
  setValue,
  value,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  const inputRef = useRef(null);
  let currentValue = '';

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

  const hasValue = multiple ? currentValue.length > 0 : !!currentValue;

  const getFilenames = v => {
    if (v instanceof FileList) {
      const numFiles = v.length;
      const output = [];
      let i;

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

  const getSrcs = v => {
    const output = [];

    if (v instanceof FileList) {
      const numFiles = v.length;
      let i;

      for (i = 0; i < numFiles; i += 1) {
        output.push(URL.createObjectURL(v.item(i)));
      }
    } else if (Array.isArray(v)) {
      return v.map(v2 => `${imagePrefix}${v2}`);
    } else if (typeof v === 'object') {
      output.push(URL.createObjectURL(v));
    } else if (typeof v === 'string') {
      output.push(`${imagePrefix}${v}`);
    }

    return output;
  };

  const [filenames, setFilenames] = useState(getFilenames(currentValue));
  const [srcs, setSrcs] = useState(getSrcs(currentValue));
  useEffect(() => {
    setFilenames(getFilenames(currentValue));
    setSrcs(getSrcs(currentValue));
  }, [currentValue]);

  const onChange = e => {
    const newFiles = multiple ? e.target.files : e.target.files.item(0);
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

  const onRemove = e => {
    setFilenames('');
    const newValue = '';

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange, newValue);
    }

    inputRef.current.focus();
  };

  let prefixClassName = inputWrapperClassName;

  if (hasValue && !disabled && !readOnly) {
    prefixClassName += ' formosa-prefix';
  }

  const props = {};

  if (id || name) {
    props.id = id || name;
  }

  const hiddenProps = {};

  if (name) {
    hiddenProps.name = name;
  }

  const buttonProps = {};

  if (id || name) {
    buttonProps.id = `${id || name}-remove`;
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasValue && imagePreview && srcs.map(src => {
    const img = /*#__PURE__*/React__default.createElement("img", Object.assign({
      alt: "",
      className: `formosa-file-image ${imageClassName}`.trim(),
      height: imageHeight,
      key: src,
      src: src
    }, imageAttributes));

    if (linkImage) {
      return /*#__PURE__*/React__default.createElement("a", Object.assign({
        className: `formosa-file-link ${linkClassName}`.trim(),
        href: src,
        key: src
      }, linkAttributes), img);
    }

    return img;
  }), /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-file-wrapper ${wrapperClassName}`.trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-file-input-wrapper ${prefixClassName}`.trim()
  }, inputWrapperAttributes), /*#__PURE__*/React__default.createElement("div", {
    className: `formosa-file-name${!filenames ? ' formosa-file-name--empty' : ''}`,
    id: `${id || name}-name`
  }, filenames || emptyText), !readOnly && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: `formosa-field__input formosa-field__input--file ${className}`.trim(),
    disabled: disabled,
    multiple: multiple,
    onChange: onChange,
    ref: inputRef,
    type: "file"
  }, props, otherProps)), /*#__PURE__*/React__default.createElement("input", Object.assign({
    disabled: disabled,
    required: required,
    type: "hidden",
    value: currentValue
  }, hiddenProps)))), hasValue && !disabled && !readOnly && /*#__PURE__*/React__default.createElement("button", Object.assign({
    className: `formosa-button formosa-button--remove-file formosa-postfix ${buttonClassName}`.trim(),
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

function ConditionalWrapper({
  children,
  className,
  condition
}) {
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

function Input({
  afterChange,
  className,
  id,
  name,
  setValue,
  suffix,
  type,
  value,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  let currentValue = '';

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

  const onChange = e => {
    const newValue = e.target.value;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  const props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement(ConditionalWrapper, {
    className: "formosa-suffix-container",
    condition: suffix
  }, /*#__PURE__*/React__default.createElement("input", Object.assign({
    className: `formosa-field__input ${className}`.trim(),
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
  value: PropTypes.string
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

function Password({
  buttonAttributes,
  buttonClassName,
  className,
  hideText,
  showText,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  const [tempType, setTempType] = useState('password');

  const togglePassword = () => {
    if (tempType === 'password') {
      setTempType('text');
    } else {
      setTempType('password');
    }
  };

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-password-wrapper ${wrapperClassName}`.trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, Object.assign({
    className: `formosa-field__input--password formosa-prefix ${className}`.trim()
  }, otherProps, {
    type: tempType
  })), /*#__PURE__*/React__default.createElement("button", Object.assign({
    className: `formosa-button formosa-button--toggle-password formosa-postfix ${buttonClassName}`.trim(),
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

function Radio({
  afterChange,
  className,
  label,
  labelAttributes,
  labelClassName,
  labelKey,
  listAttributes,
  listClassName,
  listItemAttributes,
  listItemClassName,
  name,
  options,
  required,
  setValue,
  url,
  value,
  valueKey,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  useEffect(() => {
    if (url) {
      Api.get(url).then(response => {
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
      });
    }

    return () => {};
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
    return () => {};
  }, [options]);
  let currentValue = '';

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

  const onChange = e => {
    let newValue = e.target.value;

    if (e.target.getAttribute('data-json') === 'true') {
      newValue = JSON.parse(newValue);
    }

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  return /*#__PURE__*/React__default.createElement("ul", Object.assign({
    className: `formosa-radio ${listClassName}`.trim()
  }, listAttributes), optionValues.map(optionValue => {
    let optionValueVal = optionValue.value;
    let isJson = false;

    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }

    const checked = currentValue === optionValueVal;
    const optionProps = {};

    if (isJson) {
      optionProps['data-json'] = true;
    }

    if (name) {
      optionProps.name = name;
    }

    return /*#__PURE__*/React__default.createElement("li", Object.assign({
      className: `formosa-radio__item ${listItemClassName}`.trim(),
      key: optionValueVal
    }, listItemAttributes), /*#__PURE__*/React__default.createElement("label", Object.assign({
      className: `formosa-radio__label${checked ? ' formosa-radio__label--checked' : ''} ${labelClassName}`.trim()
    }, labelAttributes), /*#__PURE__*/React__default.createElement("input", Object.assign({
      checked: checked,
      className: `formosa-field__input formosa-radio__input ${className}`.trim(),
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

var _path$3;

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
  }, props), _path$3 || (_path$3 = /*#__PURE__*/createElement("path", {
    d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"
  })));
}

function Search({
  className,
  iconAttributes,
  iconClassName,
  iconHeight,
  iconWidth,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: `formosa-search-wrapper ${wrapperClassName}`.trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, Object.assign({
    className: `formosa-field__input--search ${className}`.trim()
  }, otherProps)), /*#__PURE__*/React__default.createElement(SvgSearch, Object.assign({
    className: `formosa-icon--search ${iconClassName}`.trim(),
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

function Textarea({
  afterChange,
  className,
  id,
  name,
  setValue,
  value,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  let currentValue = '';

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

  const onChange = e => {
    const newValue = e.target.value;

    if (setValue) {
      setValue(newValue);
    } else {
      formState.setValues(formState, e, name, newValue, afterChange);
    }
  };

  const props = {};

  if (id || name) {
    props.id = id || name;
  }

  if (name) {
    props.name = name;
  }

  return /*#__PURE__*/React__default.createElement("textarea", Object.assign({
    className: `formosa-field__input formosa-field__input--textarea ${className}`.trim(),
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

var getInputElement = ((type, component) => {
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

  if (type === 'checkbox-list') {
    return CheckboxList;
  }

  return Input;
});

var getNewDirty = ((oldDirty, name) => {
  const newDirty = [...oldDirty];

  if (!newDirty.includes(name)) {
    newDirty.push(name);
  }

  return newDirty;
});

function HasMany({
  attributes,
  buttonClassName,
  name,
  recordType,
  removable
}) {
  const {
    formState,
    setFormState
  } = useContext(formContext);
  const [tempId, setTempId] = useState(1);
  const values = get(formState.row, name) || [];

  const onAdd = () => {
    const newValue = get(formState.row, `_new.${name}`);
    const hasNewValue = newValue && Object.keys(newValue).length > 0;

    if (!hasNewValue) {
      return;
    }

    newValue.id = `temp-${tempId}`;
    newValue.type = recordType;
    setTempId(tempId + 1);
    const newRow = { ...formState.row
    };
    const newValues = get(newRow, name) || [];
    newValues.push(newValue);
    set(newRow, name, newValues);
    set(newRow, `_new.${name}`, {});
    setFormState({ ...formState,
      dirty: getNewDirty(formState.dirty, name),
      dirtyIncluded: getNewDirty(formState.dirtyIncluded, `${newValue.type}.${newValue.id}`),
      row: newRow
    });
    document.getElementById(`_new.${name}.${attributes[0].name}`).focus();
  };

  const onKeyDown = e => {
    if (e.key !== 'Enter') {
      return;
    }

    const newValue = get(formState.row, `_new.${name}`);
    const hasNewValue = newValue && Object.keys(newValue).length > 0;

    if (hasNewValue) {
      e.preventDefault();
      e.stopPropagation();
      onAdd();
    }
  };

  const onRemove = e => {
    const i = e.target.getAttribute('data-index');

    if (i < 0) {
      return;
    }

    const newRow = { ...formState.row
    };
    const newValues = get(newRow, name);
    newValues.splice(i, 1);
    set(newRow, name, newValues);
    setFormState({ ...formState,
      dirty: getNewDirty(formState.dirty, name),
      row: newRow
    });
  };

  const afterChange = e => {
    setFormState({ ...formState,
      dirty: getNewDirty(formState.dirty, name),
      dirtyIncluded: getNewDirty(formState.dirtyIncluded, e.target.getAttribute('data-unique-name'))
    });
  };

  const visibleAttributes = attributes.filter(attribute => attribute.type !== 'hidden');
  const hiddenAttributes = attributes.filter(attribute => attribute.type === 'hidden');
  hiddenAttributes.push({
    name: 'id',
    type: 'hidden'
  });
  hiddenAttributes.push({
    name: 'type',
    type: 'hidden'
  });
  const showHeader = visibleAttributes.some(attribute => attribute.label);
  return /*#__PURE__*/React__default.createElement("table", {
    className: "formosa-has-many"
  }, showHeader && /*#__PURE__*/React__default.createElement("thead", {
    className: "formosa-has-many__head"
  }, /*#__PURE__*/React__default.createElement("tr", null, visibleAttributes.map(attribute => /*#__PURE__*/React__default.createElement("th", {
    key: attribute.name
  }, attribute.label)), /*#__PURE__*/React__default.createElement("th", null))), /*#__PURE__*/React__default.createElement("tbody", {
    className: "formosa-has-many__body"
  }, values.map((value, i) => {
    let isRemovable = typeof removable === 'boolean' && removable;

    if (typeof removable === 'function') {
      isRemovable = removable(value);
    }

    const rowKey = `included.${value.type}.${value.id}`;
    return /*#__PURE__*/React__default.createElement("tr", {
      className: "formosa-has-many__row",
      key: rowKey
    }, visibleAttributes.map(attribute => {
      const Component = getInputElement(attribute.type, attribute.component);
      const fieldKey = `${rowKey}.${attribute.name}`;
      const hasError = Object.prototype.hasOwnProperty.call(formState.errors, fieldKey);
      const className = ['formosa-has-many__column'];

      if (hasError) {
        className.push('formosa-field--has-error');
      }

      return /*#__PURE__*/React__default.createElement("td", {
        className: className.join(' '),
        key: attribute.name
      }, /*#__PURE__*/React__default.createElement(Component, Object.assign({}, attribute, {
        afterChange: afterChange,
        "data-unique-name": `${name}.${value.id}.${attribute.name}`,
        name: `${name}.${i}.${attribute.name}`
      })), hasError && /*#__PURE__*/React__default.createElement("div", {
        className: "formosa-field__error"
      }, formState.errors[rowKey].join( /*#__PURE__*/React__default.createElement("br", null))));
    }), /*#__PURE__*/React__default.createElement("td", {
      className: "formosa-has-many__column formosa-has-many__column--button"
    }, hiddenAttributes.map(attribute => {
      const Component = getInputElement(attribute.type, attribute.component);
      return /*#__PURE__*/React__default.createElement(Component, Object.assign({}, attribute, {
        key: attribute.name,
        name: `${name}.${i}.${attribute.name}`
      }));
    }), /*#__PURE__*/React__default.createElement("button", {
      className: `formosa-button formosa-button--remove-has-many formosa-has-many__button ${buttonClassName}`.trim(),
      "data-index": i,
      disabled: !isRemovable,
      onClick: onRemove,
      type: "button"
    }, "Remove")));
  })), /*#__PURE__*/React__default.createElement("tfoot", {
    className: "formosa-has-many__foot"
  }, /*#__PURE__*/React__default.createElement("tr", {
    className: "formosa-has-many__row formosa-has-many__row--new"
  }, visibleAttributes.map(attribute => {
    const Component = getInputElement(attribute.type, attribute.component);
    return /*#__PURE__*/React__default.createElement("td", {
      className: "formosa-has-many__column",
      key: attribute.name
    }, /*#__PURE__*/React__default.createElement(Component, Object.assign({}, attribute, {
      name: `_new.${name}.${attribute.name}`,
      onKeyDown: onKeyDown
    })));
  }), /*#__PURE__*/React__default.createElement("td", {
    className: "formosa-has-many__column formosa-has-many__column--button"
  }, hiddenAttributes.map(attribute => {
    const Component = getInputElement(attribute.type, attribute.component);
    return /*#__PURE__*/React__default.createElement(Component, Object.assign({}, attribute, {
      key: attribute.name,
      name: `_new.${name}.${attribute.name}`,
      onKeyDown: onKeyDown
    }));
  }), /*#__PURE__*/React__default.createElement("button", {
    className: `formosa-button formosa-button--add-has-many formosa-has-many__button ${buttonClassName}`.trim(),
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

function Label({
  className,
  htmlFor,
  label,
  note,
  required,
  type,
  ...otherProps
}) {
  let labelClassName = 'formosa-label';

  if (required) {
    labelClassName += ' formosa-label--required';
  }

  let wrapperClassName = 'formosa-label-wrapper';

  if (type === 'checkbox') {
    wrapperClassName += ' formosa-label-wrapper--checkbox';
  }

  const props = {};

  if (htmlFor && type !== 'has-many') {
    props.htmlFor = htmlFor;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: wrapperClassName
  }, /*#__PURE__*/React__default.createElement("label", Object.assign({
    className: `${labelClassName} ${className}`.trim()
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

function Field({
  component,
  disabled,
  id,
  inputWrapperAttributes,
  inputWrapperClassName,
  label,
  labelAttributes,
  labelClassName,
  labelNote,
  labelPosition,
  name,
  note,
  prefix,
  postfix,
  readOnly,
  required,
  suffix,
  type,
  wrapperAttributes,
  wrapperClassName,
  ...otherProps
}) {
  const {
    formState
  } = useContext(formContext);
  const inputProps = { ...otherProps
  };

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

  let InputComponent = getInputElement(type, component);

  if (type === 'has-many') {
    InputComponent = HasMany;
  }

  const input = /*#__PURE__*/React__default.createElement(InputComponent, inputProps);

  if (type === 'hidden') {
    return input;
  }

  const htmlFor = id || name;
  const labelComponent = /*#__PURE__*/React__default.createElement(Label, Object.assign({
    className: labelClassName,
    htmlFor: type === 'datetime' ? `${htmlFor}-month` : htmlFor,
    label: label,
    note: labelNote,
    required: required,
    type: type
  }, labelAttributes));
  const hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);
  const cleanName = htmlFor.replace(/[^a-z0-9_-]/gi, '');
  const wrapperClassNameList = ['formosa-field'];

  if (cleanName) {
    wrapperClassNameList.push(`formosa-field--${cleanName}`);
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

  const inputWrapperClassNameList = ['formosa-input-wrapper', `formosa-input-wrapper--${type}`];

  if (inputWrapperClassName) {
    inputWrapperClassNameList.push(inputWrapperClassName);
  }

  if (suffix) {
    inputWrapperClassNameList.push('formosa-field--has-suffix');
  }

  return /*#__PURE__*/React__default.createElement("div", Object.assign({
    className: wrapperClassNameList.join(' ')
  }, wrapperAttributes), label && labelPosition === 'before' && labelComponent, label && labelPosition === 'after' && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-label-wrapper"
  }), /*#__PURE__*/React__default.createElement("div", Object.assign({
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
  toasts: {}
});

function Message() {
  const {
    formState
  } = useContext(formContext);
  const hasErrors = Object.prototype.hasOwnProperty.call(formState.errors, '');
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasErrors && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--error"
  }, formState.errors[''].join(' ')), formState.message && /*#__PURE__*/React__default.createElement("p", {
    className: "formosa-message formosa-message--success"
  }, formState.message));
}

function FormInner({
  afterNoSubmit,
  afterSubmit,
  beforeSubmit,
  children,
  clearOnSubmit,
  defaultRow,
  filterBody,
  filterValues,
  htmlId,
  id,
  method,
  params,
  path,
  preventEmptyRequest,
  relationshipNames,
  showMessage,
  successMessageText,
  successToastText,
  ...otherProps
}) {
  const {
    formState,
    setFormState
  } = useContext(formContext);
  const {
    formosaState
  } = useContext(formosaContext);

  const submitApiRequest = e => {
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

    let url = path;

    if (id) {
      url = `${path}/${id}`;
    }

    if (params) {
      url += `?${params}`;
    }

    const body = getBody(method, path, id, formState, relationshipNames, filterBody, filterValues);
    setFormState({ ...formState,
      errors: {},
      message: ''
    });
    Api.request(method, url, body).then(response => {
      if (!response) {
        return;
      }

      const newState = { ...formState,
        dirty: [],
        dirtyIncluded: [],
        errors: {},
        message: successMessageText
      };

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
    }).catch(response => {
      if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
        formosaState.addToast('Error.', 'error');
      } else if (Object.prototype.hasOwnProperty.call(response, 'message')) {
        formosaState.addToast(response.message, 'error', 10000);
        return;
      } else {
        formosaState.addToast('Server error.', 'error');
        throw response;
      }

      const errors = {};
      let key;
      response.errors.forEach(error => {
        if (Object.prototype.hasOwnProperty.call(error, 'source')) {
          key = error.source.pointer.replace('/data/attributes/', '');
          key = key.replace('/data/meta/', 'meta.');

          if (key.startsWith('/included/')) {
            const i = key.replace(/^\/included\/(\d+)\/.+$/g, '$1');
            const includedRecord = body.included[parseInt(i, 10)];
            key = key.replace(/^\/included\/(\d+)\//g, `included.${includedRecord.type}.${includedRecord.id}.`);
            key = key.replace(/\//g, '.');
          }

          if (!document.querySelector(`[data-name="${key}"].formosa-field__error`)) {
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
      setFormState({ ...formState,
        errors,
        message: ''
      });
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

function Form({
  children,
  row,
  setRow,
  ...otherProps
}) {
  const [formState, setFormState] = useState({
    dirty: [],
    dirtyIncluded: [],
    errors: {},
    files: {},
    message: '',
    row,
    setRow,
    setValues: (fs, e, name, value, afterChange = null, files = null) => {
      let newDirty = getNewDirty(fs.dirty, name);
      const newRow = { ...fs.row
      };
      set(newRow, name, value);

      if (afterChange) {
        const additionalChanges = afterChange(e, newRow, value);
        Object.keys(additionalChanges).forEach(key => {
          set(newRow, key, additionalChanges[key]);
          newDirty = getNewDirty(newDirty, key);
        });
      }

      const newFormState = { ...fs,
        dirty: newDirty,
        row: newRow
      };

      if (files !== null) {
        set(newFormState, `files.${name}`, files);
      }

      setFormState(newFormState);

      if (fs.setRow) {
        fs.setRow(newRow);
      }
    }
  });
  useEffect(() => {
    setFormState({ ...formState,
      row
    });
  }, [row]);
  return /*#__PURE__*/React__default.createElement(formContext.Provider, {
    value: {
      formState,
      setFormState
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

const Spinner = () => {
  const {
    promiseInProgress
  } = usePromiseTracker();

  if (!promiseInProgress) {
    return null;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-spinner"
  });
};

function Toast({
  className,
  id,
  milliseconds,
  text
}) {
  const {
    formosaState,
    setFormosaState
  } = useContext(formosaContext);

  const removeToast = () => {
    const toasts = { ...formosaState.toasts
    };
    delete toasts[id];
    setFormosaState({ ...formosaState,
      toasts
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: `formosa-toast ${className}`.trim(),
    style: {
      animationDuration: `${milliseconds}ms`
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast__text"
  }, text), /*#__PURE__*/React__default.createElement("button", {
    className: "formosa-toast__close",
    onClick: removeToast,
    type: "button"
  }, /*#__PURE__*/React__default.createElement(SvgX, {
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
  const {
    formosaState
  } = useContext(formosaContext);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast-container"
  }, Object.keys(formosaState.toasts).map(id => /*#__PURE__*/React__default.createElement(Toast, {
    className: formosaState.toasts[id].className,
    key: id,
    id: id,
    milliseconds: formosaState.toasts[id].milliseconds,
    text: formosaState.toasts[id].text
  })));
}

function FormContainer({
  children
}) {
  const [formosaState, setFormosaState] = useState({
    addToast: null,
    removeToast: null,
    toasts: {}
  });
  const formosaStateRef = useRef(formosaState);
  formosaStateRef.current = formosaState;
  useEffect(() => {
    const removeToast = toastId => {
      const toasts = { ...formosaStateRef.current.toasts
      };
      delete toasts[toastId];
      setFormosaState({ ...formosaStateRef.current,
        toasts
      });
    };

    const addToast = (text, type = '', milliseconds = 5000) => {
      const toastId = new Date().getTime();
      const toast = {
        className: type ? `formosa-toast--${type}` : '',
        text,
        milliseconds
      };
      const toasts = { ...formosaStateRef.current.toasts,
        [toastId]: toast
      };
      setFormosaState({ ...formosaStateRef.current,
        toasts
      });
      setTimeout(() => {
        formosaStateRef.current.removeToast(toastId);
      }, milliseconds);
    };

    setFormosaState({ ...formosaStateRef.current,
      addToast,
      removeToast
    });
    return () => {};
  }, []);
  return /*#__PURE__*/React__default.createElement(formosaContext.Provider, {
    value: {
      formosaState,
      setFormosaState
    }
  }, children, /*#__PURE__*/React__default.createElement(Spinner, null), /*#__PURE__*/React__default.createElement(ToastContainer, null));
}
FormContainer.propTypes = {
  children: PropTypes.node.isRequired
};

function Submit({
  className,
  label,
  prefix,
  postfix,
  ...otherProps
}) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-field formosa-field--submit"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-label-wrapper formosa-label-wrapper--submit"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-input-wrapper formosa-input-wrapper--submit"
  }, prefix, /*#__PURE__*/React__default.createElement("button", Object.assign({
    className: `formosa-button formosa-button--submit ${className}`.trim(),
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

const Api$1 = Api;
const CheckIcon = SvgCheck;
const Error$2 = Error$1;
const Field$1 = Field;
const Form$1 = Form;
const FormContainer$1 = FormContainer;
const FormContext = formContext;
const FormosaContext = formosaContext;
const Input$1 = Input;
const Label$1 = Label;
const Message$1 = Message;
const Submit$1 = Submit;

export { Api$1 as Api, CheckIcon, Error$2 as Error, Field$1 as Field, Form$1 as Form, FormContainer$1 as FormContainer, FormContext, FormosaContext, Input$1 as Input, Label$1 as Label, Message$1 as Message, Submit$1 as Submit };
//# sourceMappingURL=index.modern.js.map
