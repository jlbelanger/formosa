import PropTypes from 'prop-types';
import React__default, { createElement, useContext, useRef, useState, useEffect, useMemo } from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import get from 'get-value';
import set from 'set-value';
import { v4 } from 'uuid';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function Alert(_ref) {
  let {
    className = '',
    children,
    type = null,
    ...otherProps
  } = _ref;
  if (!children) {
    return null;
  }
  let alertClass = 'formosa-alert';
  if (type) {
    alertClass += " formosa-alert--" + type;
  }
  if (className) {
    alertClass += " " + className;
  }
  return /*#__PURE__*/React__default.createElement("div", _extends({
    "aria-live": "polite",
    className: alertClass,
    role: "alert"
  }, otherProps), children);
}
Alert.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string
};

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
const deserializeSingle = function (data, otherRows, included, mainRecord) {
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
    if (Object.prototype.hasOwnProperty.call(body, 'meta')) {
      return {
        data: output,
        meta: body.meta
      };
    }
    return output;
  }
  return deserializeSingle(body.data, [], body.included, body.data);
};

class Api {
  static instance() {
    const responses = {};
    return (url, showSpinner) => {
      if (!Object.prototype.hasOwnProperty.call(responses, url)) {
        responses[url] = Api.get(url, showSpinner);
      }
      return responses[url];
    };
  }
  static get(url, showSpinner) {
    if (showSpinner === void 0) {
      showSpinner = true;
    }
    return Api.request('GET', url, null, showSpinner);
  }
  static delete(url, showSpinner) {
    if (showSpinner === void 0) {
      showSpinner = true;
    }
    return Api.request('DELETE', url, null, showSpinner);
  }
  static post(url, body, showSpinner) {
    if (showSpinner === void 0) {
      showSpinner = true;
    }
    return Api.request('POST', url, body, showSpinner);
  }
  static put(url, body, showSpinner) {
    if (showSpinner === void 0) {
      showSpinner = true;
    }
    return Api.request('PUT', url, body, showSpinner);
  }
  static request(method, url, body, showSpinner) {
    if (body === void 0) {
      body = null;
    }
    if (showSpinner === void 0) {
      showSpinner = true;
    }
    const options = {
      method,
      headers: {
        Accept: 'application/json',
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
    let fullUrl = url;
    if (process.env.REACT_APP_API_URL && !url.startsWith('http')) {
      fullUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '') + "/" + url.replace(/^\//, '');
    }
    const event = new CustomEvent('formosaApiRequest', {
      cancelable: true,
      detail: {
        url: fullUrl,
        options
      }
    });
    if (!document.dispatchEvent(event)) {
      return Promise.resolve();
    }
    const promise = fetch(fullUrl, options).then(response => {
      if (!response.ok) {
        return response.json().catch(error => {
          if (error instanceof SyntaxError) {
            throw {
              errors: [{
                title: 'Unable to connect to the server. Please try again later.',
                status: '500',
                detail: 'The server returned invalid JSON.'
              }],
              status: 500
            };
          } else {
            throw error;
          }
        }).then(json => {
          json.status = response.status;
          throw json;
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
    });
    return showSpinner ? trackPromise(promise) : promise;
  }
  static getToken() {
    return window.FORMOSA_TOKEN;
  }
  static setToken(token) {
    window.FORMOSA_TOKEN = token;
  }
  static deserialize(json) {
    if (Object.prototype.hasOwnProperty.call(json, 'data')) {
      return deserialize(json);
    }
    return json;
  }
}

var _path;
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$1.apply(null, arguments);
}
function SvgCheck(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path || (_path = /*#__PURE__*/createElement("path", {
    d: "M6.41 1l-.69.72L2.94 4.5l-.81-.78L1.41 3 0 4.41l.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72L6.41 1z"
  })));
}

var FormContext = /*#__PURE__*/React__default.createContext({
  alertClass: '',
  alertText: '',
  errors: {},
  files: {},
  originalRow: {},
  row: {},
  response: null,
  setRow: null,
  toastClass: '',
  toastText: '',
  uuid: null
});

function Error$1(_ref) {
  let {
    id = null,
    name = ''
  } = _ref;
  const {
    formState
  } = useContext(FormContext);
  const hasError = formState && Object.prototype.hasOwnProperty.call(formState.errors, name);
  const props = {};
  if (name) {
    props['data-name'] = name;
  }
  if (id || name) {
    props.id = (id || name) + "-error";
  }
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: "formosa-field__error"
  }, props), hasError && formState.errors[name].map(e => /*#__PURE__*/React__default.createElement("div", {
    key: e
  }, e)));
}
Error$1.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string
};

const normalizeOptions = function (options, labelKey, valueKey) {
  if (valueKey === void 0) {
    valueKey = null;
  }
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
        output.push({
          ...option,
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
        output.push({
          ...option,
          label: typeof labelKey === 'function' ? labelKey(option) : get(option, labelKey),
          value: typeof valueKey === 'function' ? valueKey(option) : get(option, valueKey)
        });
      }
    });
  }
  return output;
};
const escapeRegExp = string => string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
const toSlug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ & /g, '-and-').replace(/<[^>]+>/g, '').replace(/['’.]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/--+/g, '-');
const filterByKey = (records, key, value) => {
  value = value.toLowerCase();
  const escapedValue = escapeRegExp(value);
  records = records.filter(record => {
    const recordValue = get(record, key).toString().toLowerCase() || '';
    return recordValue.match(new RegExp("(^|[^a-z])" + escapedValue));
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
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$2.apply(null, arguments);
}
function SvgX(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$1 || (_path$1 = /*#__PURE__*/createElement("path", {
    d: "M1.41 0L0 1.41l.72.72L2.5 3.94.72 5.72 0 6.41l1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72L6.41 0l-.69.72L3.94 2.5 2.13.72 1.41 0z"
  })));
}

function Autocomplete(_ref) {
  let {
    afterAdd = null,
    afterChange = null,
    clearable = true,
    clearButtonAttributes = null,
    clearButtonClassName = '',
    clearIconAttributes = null,
    clearIconHeight = 12,
    clearIconWidth = 12,
    clearText = 'Clear',
    disabled = false,
    id = '',
    inputAttributes = null,
    inputClassName = '',
    labelFn = null,
    labelKey = 'name',
    loadingText = 'Loading...',
    max = null,
    name = '',
    optionButtonAttributes = null,
    optionButtonClassName = '',
    optionLabelFn = null,
    optionListAttributes = null,
    optionListClassName = '',
    optionListItemAttributes = null,
    optionListItemClassName = '',
    options = null,
    placeholder = 'Search',
    readOnly = false,
    removeButtonAttributes = null,
    removeButtonClassName = '',
    removeIconAttributes = null,
    removeIconHeight = 12,
    removeIconWidth = 12,
    removeText = 'Remove',
    setValue = null,
    showLoading = false,
    url = null,
    value = null,
    valueKey = null,
    valueListItemAttributes = null,
    wrapperAttributes = null,
    wrapperClassName = '',
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
  const clearButtonRef = useRef(null);
  const inputRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const removeButtonRef = useRef(null);
  const [filter, setFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  const [isLoading, setIsLoading] = useState(showLoading || !!url);
  const [loadError, setLoadError] = useState('');
  const api = Api.instance();
  useEffect(() => {
    if (url) {
      api(url, false).catch(error => {
        if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
          setLoadError(error.errors.map(e => e.title).join(' '));
          setIsLoading(false);
        }
      }).then(response => {
        if (!response) {
          return;
        }
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
        setIsLoading(false);
      });
    }
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
  }, [options]);
  useEffect(() => {
    setIsLoading(showLoading);
  }, [showLoading]);
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-spinner",
      role: "status"
    }, loadingText);
  }
  if (loadError) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-field__error"
    }, loadError);
  }
  let currentValue = null;
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
  const currentValueLength = currentValue ? currentValue.length : 0;
  const isSelected = option => {
    if (!currentValue) {
      return false;
    }
    return currentValue.findIndex(v => {
      if (typeof v === 'object') {
        return JSON.stringify(v) === JSON.stringify(option.value);
      }
      return v === option.value;
    }) > -1;
  };
  let filteredOptions = [];
  if (filter) {
    filteredOptions = filterByKey(optionValues, 'label', filter);
    filteredOptions = filteredOptions.filter(option => !isSelected(option));
  }
  const focus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const addValue = v => {
    let newValue;
    if (max === 1) {
      newValue = v;
    } else if (currentValue) {
      newValue = [...currentValue, v];
    } else {
      newValue = [v];
    }
    const e = {
      target: hiddenInputRef.current
    };
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
    setIsOpen(false);
    setFilter('');
    focus();
    if (afterAdd) {
      afterAdd();
    }
  };
  const removeValue = v => {
    let newValue = [];
    if (currentValue) {
      newValue = [...currentValue];
    }
    if (max !== 1) {
      const index = newValue.indexOf(v);
      if (index > -1) {
        newValue.splice(index, 1);
      }
    } else {
      newValue = '';
    }
    const e = {
      target: hiddenInputRef.current
    };
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
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
    if (e.key === 'Enter' && filterValue && filteredOptions.length > 0) {
      e.preventDefault();
    } else if (e.key === 'Backspace' && !filter && currentValueLength > 0) {
      removeValue(currentValue[currentValueLength - 1]);
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
    const e = {
      target: hiddenInputRef.current
    };
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
    setFilter('');
    focus();
  };
  const showClear = clearable && max !== 1 && currentValueLength > 0 && !disabled && !readOnly;
  let className = ['formosa-autocomplete'];
  if (showClear) {
    className.push('formosa-autocomplete--clearable');
  }
  className = className.join(' ');
  const canAddValues = !disabled && !readOnly && (max === null || currentValueLength < max);
  const wrapperProps = {};
  if (id || name) {
    wrapperProps.id = (id || name) + "-wrapper";
  }
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: (className + " " + wrapperClassName).trim(),
    "data-value": JSON.stringify(max === 1 && currentValueLength > 0 ? currentValue[0] : currentValue)
  }, wrapperProps, wrapperAttributes), /*#__PURE__*/React__default.createElement("ul", {
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
    let valueListItemProps = {};
    if (typeof valueListItemAttributes === 'function') {
      valueListItemProps = valueListItemAttributes(option);
    } else if (valueListItemAttributes && typeof valueListItemAttributes === 'object') {
      valueListItemProps = valueListItemAttributes;
    }
    let removeButtonProps = {};
    if (typeof removeButtonAttributes === 'function') {
      removeButtonProps = removeButtonAttributes(option);
    } else if (removeButtonAttributes && typeof removeButtonAttributes === 'object') {
      removeButtonProps = removeButtonAttributes;
    }
    let removeIconProps = {};
    if (typeof removeIconAttributes === 'function') {
      removeIconProps = removeIconAttributes(option);
    } else if (removeIconAttributes && typeof removeIconAttributes === 'object') {
      removeIconProps = removeIconAttributes;
    }
    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: "formosa-autocomplete__value formosa-autocomplete__value--item",
      key: val
    }, valueListItemProps), label, !disabled && !readOnly && /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__value__remove " + removeButtonClassName).trim(),
      "data-index": index,
      onClick: onClickRemoveOption,
      ref: removeButtonRef,
      type: "button"
    }, removeButtonProps), /*#__PURE__*/React__default.createElement(SvgX, _extends({
      "aria-hidden": "true",
      height: removeIconHeight,
      width: removeIconWidth
    }, removeIconProps)), removeText));
  }), canAddValues && /*#__PURE__*/React__default.createElement("li", {
    className: "formosa-autocomplete__value formosa-autocomplete__value--input"
  }, /*#__PURE__*/React__default.createElement("input", _extends({}, inputAttributes, {
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
    let label = '';
    if (optionLabelFn) {
      label = optionLabelFn(option);
    } else if (option && Object.prototype.hasOwnProperty.call(option, 'label')) {
      label = option.label;
    }
    let optionListItemProps = {};
    if (typeof optionListItemAttributes === 'function') {
      optionListItemProps = optionListItemAttributes(option);
    } else if (optionListItemAttributes && typeof optionListItemAttributes === 'object') {
      optionListItemProps = optionListItemAttributes;
    }
    let optionButtonProps = {};
    if (typeof optionButtonAttributes === 'function') {
      optionButtonProps = optionButtonAttributes(option);
    } else if (optionButtonAttributes && typeof optionButtonAttributes === 'object') {
      optionButtonProps = optionButtonAttributes;
    }
    return /*#__PURE__*/React__default.createElement("li", _extends({
      className: (optionClassName + " " + optionListItemClassName).trim(),
      key: val
    }, optionListItemProps), /*#__PURE__*/React__default.createElement("button", _extends({
      className: ("formosa-autocomplete__option__button " + optionButtonClassName).trim(),
      "data-json": isJson,
      "data-value": val,
      onClick: onClickOption,
      type: "button"
    }, optionButtonProps), label));
  })), showClear && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", _extends({
    className: ("formosa-autocomplete__clear " + clearButtonClassName).trim(),
    onClick: clear,
    ref: clearButtonRef,
    type: "button"
  }, clearButtonAttributes), /*#__PURE__*/React__default.createElement(SvgX, _extends({
    "aria-hidden": "true",
    height: clearIconHeight,
    width: clearIconWidth
  }, clearIconAttributes)), clearText)), /*#__PURE__*/React__default.createElement("input", _extends({}, otherProps, {
    name: name,
    ref: hiddenInputRef,
    type: "hidden",
    value: filter
  })));
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
  inputAttributes: PropTypes.object,
  inputClassName: PropTypes.string,
  labelFn: PropTypes.func,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  loadingText: PropTypes.string,
  max: PropTypes.number,
  name: PropTypes.string,
  optionButtonAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  optionButtonClassName: PropTypes.string,
  optionLabelFn: PropTypes.func,
  optionListAttributes: PropTypes.object,
  optionListClassName: PropTypes.string,
  optionListItemAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
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
  showLoading: PropTypes.bool,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.object), PropTypes.arrayOf(PropTypes.string), PropTypes.number, PropTypes.object, PropTypes.string]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  valueListItemAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};

function Checkbox(_ref) {
  let {
    afterChange = null,
    className = '',
    iconAttributes = null,
    iconClassName = '',
    iconHeight = 16,
    iconWidth = 16,
    id = null,
    name = '',
    setValue = null,
    value = null,
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
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
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
  };
  const props = {};
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

function CheckboxList(_ref) {
  let {
    afterChange = null,
    className = '',
    disabled = false,
    fieldsetAttributes = null,
    fieldsetClassName = '',
    iconAttributes = null,
    iconClassName = '',
    iconHeight = 16,
    iconWidth = 16,
    inputAttributes = null,
    itemAttributes = null,
    itemClassName = '',
    itemLabelAttributes = null,
    itemLabelClassName = '',
    itemSpanAttributes = null,
    itemSpanClassName = '',
    labelKey = 'name',
    legend = '',
    loadingText = 'Loading...',
    name = '',
    options = null,
    readOnly = false,
    setValue = null,
    showLoading = false,
    url = null,
    value = null,
    valueKey = null,
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  const [isLoading, setIsLoading] = useState(showLoading || !!url);
  const [loadError, setLoadError] = useState('');
  const api = Api.instance();
  useEffect(() => {
    if (url) {
      api(url, false).catch(error => {
        if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
          setLoadError(error.errors.map(e => e.title).join(' '));
          setIsLoading(false);
        }
      }).then(response => {
        if (!response) {
          return;
        }
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
        setIsLoading(false);
      });
    }
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
  }, [options]);
  useEffect(() => {
    setIsLoading(showLoading);
  }, [showLoading]);
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-spinner",
      role: "status"
    }, loadingText);
  }
  if (loadError) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-field__error"
    }, loadError);
  }
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
  const currentValueStringified = currentValue.map(val => typeof val === 'object' ? JSON.stringify(val) : val);
  const onChange = e => {
    const newValue = [...currentValue];
    let val = e.target.value;
    if (e.target.checked) {
      if (e.target.getAttribute('data-json') === 'true') {
        val = JSON.parse(val);
      }
      newValue.push(val);
    } else {
      const index = currentValueStringified.indexOf(val);
      if (index > -1) {
        newValue.splice(index, 1);
      }
    }
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
  };
  return /*#__PURE__*/React__default.createElement("fieldset", _extends({
    className: ("formosa-radio " + fieldsetClassName).trim()
  }, fieldsetAttributes), /*#__PURE__*/React__default.createElement("legend", {
    className: "formosa-radio__legend"
  }, legend), optionValues.map(optionValue => {
    let optionValueVal = optionValue.value;
    let isJson = false;
    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }
    const checked = currentValueStringified.includes(optionValueVal);
    let itemProps = {};
    if (typeof itemAttributes === 'function') {
      itemProps = itemAttributes(optionValue);
    } else if (itemAttributes && typeof itemAttributes === 'object') {
      itemProps = itemAttributes;
    }
    let itemLabelProps = {};
    if (typeof itemLabelAttributes === 'function') {
      itemLabelProps = itemLabelAttributes(optionValue);
    } else if (itemLabelAttributes && typeof itemLabelAttributes === 'object') {
      itemLabelProps = itemLabelAttributes;
    }
    let inputProps = {};
    if (typeof inputAttributes === 'function') {
      inputProps = inputAttributes(optionValue);
    } else if (inputAttributes && typeof inputAttributes === 'object') {
      inputProps = inputAttributes;
    }
    if (isJson) {
      inputProps['data-json'] = true;
    }
    if (name) {
      inputProps.name = name + "[]";
    }
    let iconProps = {};
    if (typeof iconAttributes === 'function') {
      iconProps = iconAttributes(optionValue);
    } else if (iconAttributes && typeof iconAttributes === 'object') {
      iconProps = iconAttributes;
    }
    let itemSpanProps = {};
    if (typeof itemSpanAttributes === 'function') {
      itemSpanProps = itemSpanAttributes(optionValue);
    } else if (itemSpanAttributes && typeof itemSpanAttributes === 'object') {
      itemSpanProps = itemSpanAttributes;
    }
    return /*#__PURE__*/React__default.createElement("div", _extends({
      className: ("formosa-radio__item " + itemClassName).trim(),
      key: optionValueVal
    }, itemProps), /*#__PURE__*/React__default.createElement("label", _extends({
      className: ("formosa-radio__label" + (checked ? ' formosa-radio__label--checked' : '') + " " + itemLabelClassName).trim()
    }, itemLabelProps), /*#__PURE__*/React__default.createElement("input", _extends({
      "aria-label": optionValue.label,
      checked: checked,
      className: ("formosa-field__input formosa-field__input--checkbox " + className).trim(),
      disabled: disabled,
      onChange: onChange,
      readOnly: readOnly,
      value: optionValueVal
    }, inputProps, otherProps, {
      type: "checkbox"
    })), /*#__PURE__*/React__default.createElement(SvgCheck, _extends({
      "aria-hidden": "true",
      className: ("formosa-icon--check " + iconClassName).trim(),
      height: iconHeight,
      width: iconWidth
    }, iconProps)), /*#__PURE__*/React__default.createElement("span", _extends({
      "aria-hidden": "true",
      className: ("formosa-radio__span " + itemSpanClassName).trim()
    }, itemSpanProps), optionValue.label)));
  }));
}
CheckboxList.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fieldsetAttributes: PropTypes.object,
  fieldsetClassName: PropTypes.string,
  iconAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  iconClassName: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  inputAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemClassName: PropTypes.string,
  itemLabelAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemLabelClassName: PropTypes.string,
  itemSpanAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemSpanClassName: PropTypes.string,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  legend: PropTypes.string,
  loadingText: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  readOnly: PropTypes.bool,
  setValue: PropTypes.func,
  showLoading: PropTypes.bool,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.object), PropTypes.arrayOf(PropTypes.string)]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

function File(_ref) {
  let {
    afterChange = null,
    buttonAttributes = null,
    buttonClassName = '',
    className = '',
    disabled = false,
    emptyText = 'No file selected.',
    id = '',
    imageAttributes = null,
    imageClassName = '',
    imageHeight = 100,
    imagePrefix = '',
    imagePreview = false,
    inputWrapperAttributes = null,
    inputWrapperClassName = '',
    linkAttributes = null,
    linkClassName = '',
    linkImage = false,
    multiple = false,
    name = '',
    readOnly = false,
    removeText = 'Remove',
    required = false,
    setValue = null,
    value = null,
    wrapperAttributes = null,
    wrapperClassName = '',
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
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
      return v.map(v2 => "" + imagePrefix + v2);
    } else if (typeof v === 'object') {
      output.push(URL.createObjectURL(v));
    } else if (typeof v === 'string') {
      output.push("" + imagePrefix + v);
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
      setValue(newFiles, e);
    } else {
      setValues(e, name, newFiles, afterChange, newFiles);
    }
  };
  const onRemove = e => {
    setFilenames('');
    const newValue = '';
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange, newValue);
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
    buttonProps.id = (id || name) + "-remove";
  }
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, hasValue && imagePreview && srcs.map(src => {
    const img = /*#__PURE__*/React__default.createElement("img", _extends({
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

function ConditionalWrapper(_ref) {
  let {
    children,
    condition = false,
    ...props
  } = _ref;
  if (!condition) {
    return children;
  }
  return /*#__PURE__*/React__default.createElement("div", props, children);
}
ConditionalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  condition: PropTypes.any
};

function Input(_ref) {
  let {
    afterChange = null,
    className = '',
    id = null,
    name = '',
    setValue = null,
    suffix = '',
    type = 'text',
    value = null,
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
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
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
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

function Password(_ref) {
  let {
    buttonAttributes = null,
    buttonClassName = '',
    className = '',
    hideAria = 'Hide Password',
    hideText = 'Hide',
    showAria = 'Show Password',
    showText = 'Show',
    wrapperAttributes = null,
    wrapperClassName = '',
    ...otherProps
  } = _ref;
  const [tempType, setTempType] = useState('password');
  const togglePassword = () => {
    if (tempType === 'password') {
      setTempType('text');
    } else {
      setTempType('password');
    }
  };
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-password-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement(Input, _extends({
    className: ("formosa-field__input--password formosa-prefix " + className).trim(),
    spellCheck: "false"
  }, otherProps, {
    type: tempType
  })), /*#__PURE__*/React__default.createElement("button", _extends({
    "aria-controls": otherProps.id || otherProps.name,
    "aria-label": tempType === 'password' ? showAria : hideAria,
    className: ("formosa-button formosa-button--toggle-password formosa-postfix " + buttonClassName).trim(),
    onClick: togglePassword,
    type: "button"
  }, buttonAttributes), tempType === 'password' ? showText : hideText));
}
Password.propTypes = {
  buttonAttributes: PropTypes.object,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  hideAria: PropTypes.string,
  hideText: PropTypes.string,
  showAria: PropTypes.string,
  showText: PropTypes.string,
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};

function Radio(_ref) {
  let {
    afterChange = null,
    className = '',
    fieldsetAttributes = null,
    fieldsetClassName = '',
    inputAttributes = null,
    itemAttributes = null,
    itemClassName = '',
    itemLabelAttributes = null,
    itemLabelClassName = '',
    itemSpanAttributes = null,
    itemSpanClassName = '',
    labelKey = 'name',
    legend = '',
    loadingText = 'Loading...',
    name = '',
    options = null,
    required = false,
    setValue = null,
    showLoading = false,
    url = null,
    value = null,
    valueKey = null,
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  const [isLoading, setIsLoading] = useState(showLoading || !!url);
  const [loadError, setLoadError] = useState('');
  const api = Api.instance();
  useEffect(() => {
    if (url) {
      api(url, false).catch(error => {
        if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
          setLoadError(error.errors.map(e => e.title).join(' '));
          setIsLoading(false);
        }
      }).then(response => {
        if (!response) {
          return;
        }
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
        setIsLoading(false);
      });
    }
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
  }, [options]);
  useEffect(() => {
    setIsLoading(showLoading);
  }, [showLoading]);
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-spinner",
      role: "status"
    }, loadingText);
  }
  if (loadError) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-field__error"
    }, loadError);
  }
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
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
  };
  return /*#__PURE__*/React__default.createElement("fieldset", _extends({
    className: ("formosa-radio " + fieldsetClassName).trim()
  }, fieldsetAttributes), /*#__PURE__*/React__default.createElement("legend", {
    className: "formosa-radio__legend"
  }, legend), optionValues.map(optionValue => {
    let optionValueVal = optionValue.value;
    let isJson = false;
    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }
    const checked = currentValue === optionValueVal;
    let itemProps = {};
    if (typeof itemAttributes === 'function') {
      itemProps = itemAttributes(optionValue);
    } else if (itemAttributes && typeof itemAttributes === 'object') {
      itemProps = itemAttributes;
    }
    let itemLabelProps = {};
    if (typeof itemLabelAttributes === 'function') {
      itemLabelProps = itemLabelAttributes(optionValue);
    } else if (itemLabelAttributes && typeof itemLabelAttributes === 'object') {
      itemLabelProps = itemLabelAttributes;
    }
    let inputProps = {};
    if (typeof inputAttributes === 'function') {
      inputProps = inputAttributes(optionValue);
    } else if (inputAttributes && typeof inputAttributes === 'object') {
      inputProps = inputAttributes;
    }
    if (isJson) {
      inputProps['data-json'] = true;
    }
    if (name) {
      inputProps.name = name;
    }
    let itemSpanProps = {};
    if (typeof itemSpanAttributes === 'function') {
      itemSpanProps = itemSpanAttributes(optionValue);
    } else if (itemSpanAttributes && typeof itemSpanAttributes === 'object') {
      itemSpanProps = itemSpanAttributes;
    }
    return /*#__PURE__*/React__default.createElement("div", _extends({
      className: ("formosa-radio__item " + itemClassName).trim(),
      key: optionValueVal
    }, itemProps), /*#__PURE__*/React__default.createElement("label", _extends({
      className: ("formosa-radio__label" + (checked ? ' formosa-radio__label--checked' : '') + " " + itemLabelClassName).trim()
    }, itemLabelProps), /*#__PURE__*/React__default.createElement("input", _extends({
      "aria-label": optionValue.label,
      checked: checked,
      className: ("formosa-field__input formosa-radio__input " + className).trim(),
      onChange: onChange,
      required: required,
      type: "radio",
      value: optionValueVal
    }, inputProps, otherProps)), /*#__PURE__*/React__default.createElement("span", _extends({
      "aria-hidden": "true",
      className: ("formosa-radio__span " + itemSpanClassName).trim()
    }, itemSpanProps), optionValue.label)));
  }));
}
Radio.propTypes = {
  afterChange: PropTypes.func,
  className: PropTypes.string,
  fieldsetAttributes: PropTypes.object,
  fieldsetClassName: PropTypes.string,
  inputAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemClassName: PropTypes.string,
  itemLabelAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemLabelClassName: PropTypes.string,
  itemSpanAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemSpanClassName: PropTypes.string,
  label: PropTypes.string,
  labelKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  legend: PropTypes.string,
  loadingText: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  required: PropTypes.bool,
  setValue: PropTypes.func,
  showLoading: PropTypes.bool,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

var _path$2;
function _extends$3() {
  return _extends$3 = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$3.apply(null, arguments);
}
function SvgSearch(props) {
  return /*#__PURE__*/createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$2 || (_path$2 = /*#__PURE__*/createElement("path", {
    d: "M3.5 0C1.57 0 0 1.57 0 3.5S1.57 7 3.5 7c.59 0 1.17-.14 1.66-.41a1 1 0 00.13.13l1 1a1.02 1.02 0 101.44-1.44l-1-1a1 1 0 00-.16-.13c.27-.49.44-1.06.44-1.66 0-1.93-1.57-3.5-3.5-3.5zm0 1C4.89 1 6 2.11 6 3.5c0 .66-.24 1.27-.66 1.72l-.03.03a1 1 0 00-.13.13c-.44.4-1.04.63-1.69.63-1.39 0-2.5-1.11-2.5-2.5s1.11-2.5 2.5-2.5z"
  })));
}

function Search(_ref) {
  let {
    className = '',
    iconAttributes = null,
    iconClassName = '',
    iconHeight = 16,
    iconWidth = 16,
    wrapperAttributes = null,
    wrapperClassName = '',
    ...otherProps
  } = _ref;
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

var _path$3;
function _extends$4() {
  return _extends$4 = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$4.apply(null, arguments);
}
function SvgCaret(props) {
  return /*#__PURE__*/createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 8 8"
  }, props), _path$3 || (_path$3 = /*#__PURE__*/createElement("path", {
    d: "M0 2l4 4 4-4H0z"
  })));
}

function Select(_ref) {
  let {
    afterChange = null,
    className = '',
    hideBlank = false,
    iconAttributes = null,
    iconClassName = '',
    iconHeight = 16,
    iconWidth = 16,
    id = null,
    labelKey = 'name',
    loadingText = 'Loading...',
    multiple = false,
    name = '',
    optionAttributes = null,
    options = null,
    setValue = null,
    showLoading = false,
    url = null,
    value = null,
    valueKey = null,
    wrapperAttributes = null,
    wrapperClassName = '',
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
  const [optionValues, setOptionValues] = useState(options ? normalizeOptions(options, labelKey, valueKey) : []);
  const [isLoading, setIsLoading] = useState(showLoading || !!url);
  const [loadError, setLoadError] = useState('');
  const api = Api.instance();
  useEffect(() => {
    if (url) {
      api(url, false).catch(error => {
        if (Object.prototype.hasOwnProperty.call(error, 'errors')) {
          setLoadError(error.errors.map(e => e.title).join(' '));
          setIsLoading(false);
        }
      }).then(response => {
        if (!response) {
          return;
        }
        setOptionValues(normalizeOptions(response, labelKey, valueKey));
        setIsLoading(false);
      });
    }
  }, [url]);
  useEffect(() => {
    setOptionValues(options ? normalizeOptions(options, labelKey, valueKey) : []);
  }, [options]);
  useEffect(() => {
    setIsLoading(showLoading);
  }, [showLoading]);
  if (isLoading) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-spinner",
      role: "status"
    }, loadingText);
  }
  if (loadError) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "formosa-field__error"
    }, loadError);
  }
  let currentValue = multiple ? [] : '';
  if (setValue !== null) {
    currentValue = value;
  } else {
    if (formState === undefined) {
      throw new Error('<Select> component must be inside a <Form> component.');
    }
    currentValue = get(formState.row, name);
  }
  if (currentValue === null || currentValue === undefined) {
    currentValue = multiple ? [] : '';
  }
  if (typeof currentValue === 'object' && !multiple) {
    currentValue = JSON.stringify(currentValue);
  }
  const onChange = e => {
    let newValue;
    if (multiple) {
      newValue = Array.from(e.target.options).filter(option => option.selected).map(option => option.value);
    } else {
      newValue = e.target.value;
      const option = e.target.querySelector("[value=\"" + newValue.replace(/"/g, '\\"') + "\"]");
      if (option.getAttribute('data-json') === 'true') {
        newValue = JSON.parse(newValue);
      }
    }
    if (setValue) {
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
  };
  const props = {};
  if (id || name) {
    props.id = id || name;
  }
  if (name) {
    props.name = name;
  }
  if (multiple) {
    props.multiple = true;
  }
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: ("formosa-select-wrapper " + wrapperClassName).trim()
  }, wrapperAttributes), /*#__PURE__*/React__default.createElement("select", _extends({
    className: ("formosa-field__input formosa-field__input--select " + className).trim(),
    onChange: onChange,
    value: currentValue
  }, props, otherProps), !hideBlank && !multiple && /*#__PURE__*/React__default.createElement("option", {
    value: ""
  }), optionValues.map(optionValue => {
    let optionValueVal = optionValue.value;
    let isJson = false;
    if (typeof optionValueVal === 'object') {
      isJson = true;
      optionValueVal = JSON.stringify(optionValueVal);
    }
    let optionProps = {};
    if (typeof optionAttributes === 'function') {
      optionProps = optionAttributes(optionValue);
    } else if (optionAttributes && typeof optionAttributes === 'object') {
      optionProps = optionAttributes;
    }
    if (isJson) {
      optionProps['data-json'] = true;
    }
    return /*#__PURE__*/React__default.createElement("option", _extends({
      key: optionValueVal,
      value: optionValueVal
    }, optionProps), optionValue.label);
  })), !multiple && /*#__PURE__*/React__default.createElement(SvgCaret, _extends({
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
  loadingText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  optionAttributes: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  setValue: PropTypes.func,
  showLoading: PropTypes.bool,
  url: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.string]),
  valueKey: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  wrapperAttributes: PropTypes.object,
  wrapperClassName: PropTypes.string
};

function Textarea(_ref) {
  let {
    afterChange = null,
    className = '',
    id = null,
    name = '',
    setValue = null,
    value = null,
    ...otherProps
  } = _ref;
  const {
    formState,
    setValues
  } = useContext(FormContext);
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
      setValue(newValue, e);
    } else {
      setValues(e, name, newValue, afterChange);
    }
  };
  const props = {};
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

var getInputElement = (type, component) => {
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

function ExportableInput(_ref) {
  let {
    component = null,
    type = 'text',
    ...otherProps
  } = _ref;
  const InputComponent = getInputElement(type, component);
  return /*#__PURE__*/React__default.createElement(InputComponent, _extends({
    type: type
  }, otherProps));
}
ExportableInput.propTypes = {
  component: PropTypes.func,
  type: PropTypes.string
};

function Label(_ref) {
  let {
    className = '',
    htmlFor = '',
    label = '',
    note = '',
    required = false,
    type = '',
    ...otherProps
  } = _ref;
  let labelClassName = 'formosa-label';
  if (required) {
    labelClassName += ' formosa-label--required';
  }
  let wrapperClassName = 'formosa-label-wrapper';
  if (type === 'checkbox') {
    wrapperClassName += ' formosa-label-wrapper--checkbox';
  }
  const hasFieldset = ['radio', 'checkbox-list'].includes(type);
  const props = {};
  if (htmlFor && !hasFieldset) {
    props.htmlFor = htmlFor;
  }
  if (hasFieldset) {
    props['aria-hidden'] = true;
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

function Field(_ref) {
  let {
    component = null,
    disabled = false,
    id = null,
    inputInnerWrapperAttributes = {},
    inputInnerWrapperClassName = '',
    inputWrapperAttributes = {},
    inputWrapperClassName = '',
    label = '',
    labelAttributes = {},
    labelClassName = '',
    labelNote = '',
    labelPosition = 'before',
    name = '',
    note = '',
    prefix = null,
    postfix = null,
    readOnly = false,
    required = false,
    suffix = '',
    type = 'text',
    wrapperAttributes = {},
    wrapperClassName = '',
    ...otherProps
  } = _ref;
  const {
    formState
  } = useContext(FormContext);
  const inputProps = {
    ...otherProps
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
    if (['radio', 'checkbox-list'].includes(type) && !inputProps.legend) {
      inputProps.legend = label;
    }
  }
  const InputComponent = getInputElement(type, component);
  const input = /*#__PURE__*/React__default.createElement(InputComponent, inputProps);
  if (type === 'hidden') {
    return input;
  }
  const htmlFor = id || name;
  const labelComponent = /*#__PURE__*/React__default.createElement(Label, _extends({
    className: labelClassName,
    htmlFor: htmlFor,
    label: label,
    note: labelNote,
    required: required,
    type: type
  }, labelAttributes));
  const hasError = formState && name && Object.prototype.hasOwnProperty.call(formState.errors, name);
  const cleanName = htmlFor.replace(/[^a-z0-9_-]/gi, '');
  const wrapperClassNameList = ['formosa-field'];
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
  const inputWrapperClassNameList = ['formosa-input-wrapper', "formosa-input-wrapper--" + type];
  if (inputWrapperClassName) {
    inputWrapperClassNameList.push(inputWrapperClassName);
  }
  if (suffix) {
    inputWrapperClassNameList.push('formosa-field--has-suffix');
  }
  const inputInnerWrapperClassNameList = ['formosa-input-inner-wrapper'];
  if (inputInnerWrapperClassName) {
    inputInnerWrapperClassNameList.push(inputInnerWrapperClassName);
  }
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: wrapperClassNameList.join(' ')
  }, wrapperAttributes), label && labelPosition === 'before' && labelComponent, label && labelPosition === 'after' && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-label-wrapper"
  }), /*#__PURE__*/React__default.createElement("div", _extends({
    className: inputWrapperClassNameList.join(' ')
  }, inputWrapperAttributes), /*#__PURE__*/React__default.createElement(ConditionalWrapper, _extends({
    className: inputInnerWrapperClassNameList.join(' '),
    condition: !!prefix || !!postfix
  }, inputInnerWrapperAttributes), prefix, input, label && labelPosition === 'after' && labelComponent, note && /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-field__note"
  }, note), postfix), formState && formState.showInlineErrors && /*#__PURE__*/React__default.createElement(Error$1, {
    id: id,
    name: name
  })));
}
Field.propTypes = {
  component: PropTypes.func,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  inputInnerWrapperAttributes: PropTypes.object,
  inputInnerWrapperClassName: PropTypes.string,
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

var FormosaContext = /*#__PURE__*/React__default.createContext({
  toasts: {},
  showWarningPrompt: true,
  addToast: () => {},
  removeToast: () => {},
  disableWarningPrompt: () => {},
  enableWarningPrompt: () => {}
});

const getSimpleRecord = record => ({
  id: record.id,
  type: record.type
});
const cleanRelationship = values => {
  if (Array.isArray(values)) {
    return values.map(value => getSimpleRecord(value));
  }
  return getSimpleRecord(values);
};
const cleanRecord = record => {
  const hasAttributes = Object.keys(record.attributes).length > 0;
  if (!hasAttributes) {
    delete record.attributes;
  }
  const hasRelationships = Object.keys(record.relationships).length > 0;
  if (!hasRelationships) {
    delete record.relationships;
  }
  if (!hasAttributes && !hasRelationships && !record.id.startsWith('temp-')) {
    return null;
  }
  return record;
};
const filterByKey$1 = (relationshipNames, key) => {
  const output = [];
  relationshipNames.forEach(relName => {
    if (relName.startsWith(key + ".")) {
      const keys = relName.split('.');
      keys.shift();
      output.push(keys.join('.'));
    }
  });
  return output;
};
const getDirtyRecords = (record, relationshipNames, dirtyRelationships) => {
  let otherRecords = [];
  const output = getSimpleRecord(record);
  output.attributes = {};
  output.relationships = {};
  Object.keys(record).forEach(key => {
    if (key !== 'id' && key !== 'type') {
      if (Object.prototype.hasOwnProperty.call(dirtyRelationships, key)) {
        if (relationshipNames.includes(key)) {
          if (Array.isArray(record[key])) {
            const data = [];
            record[key].forEach((rel, relIndex) => {
              if (typeof dirtyRelationships[key][relIndex] !== 'undefined') {
                const x = getIncludedRecordData(rel, filterByKey$1(relationshipNames, key), dirtyRelationships[key][relIndex]);
                otherRecords = otherRecords.concat(x);
              }
              data.push(getSimpleRecord(rel));
            });
            set(output.relationships, key, {
              data
            });
          } else {
            const x = getIncludedRecordData(record[key], filterByKey$1(relationshipNames, key), dirtyRelationships[key]);
            const data = x.shift();
            otherRecords = otherRecords.concat(x);
            set(output.relationships, key, {
              data
            });
          }
        } else {
          set(output.attributes, key, record[key]);
        }
      }
    }
  });
  const rec = cleanRecord(output);
  if (rec !== null) {
    otherRecords.unshift(rec);
  }
  return otherRecords;
};
const getIncludedRecordData = (record, relationshipNames, dirtyRelationships) => {
  if (record.id.startsWith('temp-')) {
    return getDirtyRecords(record, relationshipNames, dirtyRelationships);
  }
  if (typeof dirtyRelationships === 'undefined') {
    return [];
  }
  if (Object.keys(dirtyRelationships).length <= 0) {
    return [getSimpleRecord(record)];
  }
  return getDirtyRecords(record, relationshipNames, dirtyRelationships);
};
const getDirtyRelationships = dirtyKeys => {
  const output = {};
  dirtyKeys.forEach(key => {
    const currentKeys = [];
    key.split('.').forEach(k => {
      currentKeys.push(k);
      if (typeof get(output, currentKeys.join('.')) === 'undefined') {
        set(output, currentKeys.join('.'), {});
      }
    });
  });
  return output;
};
const getIncludedRecords = (data, dirtyKeys, relationshipNames) => {
  let output = [];
  if (dirtyKeys.length <= 0) {
    return output;
  }
  const dirtyRelationships = getDirtyRelationships(dirtyKeys);
  Object.keys(dirtyRelationships).forEach(relName => {
    if (Object.prototype.hasOwnProperty.call(data.relationships, relName)) {
      if (Array.isArray(data.relationships[relName].data)) {
        Object.keys(data.relationships[relName].data).forEach(relIndex => {
          const record = data.relationships[relName].data[relIndex];
          if (record) {
            const records = getIncludedRecordData(record, filterByKey$1(relationshipNames, relName), dirtyRelationships[relName][relIndex]);
            output = output.concat(records);
          }
        });
      } else {
        const record = data.relationships[relName].data;
        if (record) {
          const records = getIncludedRecordData(record, filterByKey$1(relationshipNames, relName), dirtyRelationships[relName]);
          output = output.concat(records);
        }
      }
    }
  });
  return output.filter(record => Object.keys(record).length > 2);
};
const unset = (obj, key) => {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return delete obj[key];
  }
  const keys = key.split('.');
  const lastKey = keys.pop();
  let o = obj;
  keys.forEach(k => {
    o = o[k];
  });
  return delete o[lastKey];
};
const appendToFormData = function (obj, formData, prefix) {
  if (prefix === void 0) {
    prefix = '';
  }
  Object.entries(obj).forEach(entry => {
    const [key, value] = entry;
    const newKey = prefix ? prefix + "[" + key + "]" : key;
    if (typeof value === 'object') {
      formData = appendToFormData(value, formData, newKey);
    } else {
      formData.append(newKey, JSON.stringify(value));
    }
  });
  return formData;
};
const getBody = function (method, type, id, formState, dirtyKeys, relationshipNames, filterBody, filterValues) {
  if (filterBody === void 0) {
    filterBody = null;
  }
  if (filterValues === void 0) {
    filterValues = null;
  }
  let body = null;
  if (method === 'PUT' || method === 'POST') {
    const data = {
      type,
      attributes: {},
      relationships: {},
      meta: {}
    };
    if (method === 'PUT' && id) {
      data.id = id;
    }
    let values = {
      ...formState.row
    };
    if (filterValues) {
      values = filterValues(values);
    }
    const fileKeys = Object.keys(formState.files);
    const keys = method === 'PUT' ? dirtyKeys : Object.keys(formState.row);
    keys.forEach(key => {
      const firstPartOfKey = key.replace(/\..+$/, '');
      if (relationshipNames.includes(firstPartOfKey)) {
        data.relationships[firstPartOfKey] = {
          data: get(values, firstPartOfKey)
        };
      } else if (relationshipNames.includes(key)) {
        data.relationships[key] = {
          data: get(values, firstPartOfKey)
        };
      } else if (key.startsWith('meta.')) {
        set(data, key, get(values, key));
      } else if (key === 'meta') {
        data.meta = values.meta;
      } else if (fileKeys.includes(key)) {
        unset(data.attributes, key);
      } else {
        set(data.attributes, key, get(values, key));
      }
    });
    body = {
      data
    };
    const included = getIncludedRecords(data, dirtyKeys, relationshipNames);
    if (included.length > 0) {
      body.included = included;
    }
    Object.keys(data.relationships).forEach(relationshipName => {
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
    const filenames = fileKeys.filter(filename => formState.files[filename] !== false);
    if (filenames.length > 0) {
      const formData = appendToFormData(body, new FormData());
      formData.append('meta[files]', JSON.stringify(filenames));
      filenames.forEach(filename => {
        if (Object.prototype.toString.call(formState.files[filename]) === '[object FileList]') {
          Array.from(formState.files[filename]).forEach((file, i) => {
            formData.append(filename + "[" + i + "]", file);
          });
        } else {
          formData.append(filename, formState.files[filename]);
        }
      });
      body = formData;
    }
  }
  return body;
};

function FormInner(_ref) {
  let {
    afterNoSubmit = null,
    beforeSubmit = null,
    children = null,
    clearOnSubmit = false,
    defaultRow = {},
    errorMessageText = '',
    errorToastText = '',
    filterBody = null,
    filterValues = null,
    htmlId = '',
    id = '',
    method = null,
    params = '',
    path = null,
    preventEmptyRequest = false,
    preventEmptyRequestText = 'No changes to save.',
    relationshipNames = [],
    showMessage = true,
    successMessageText = '',
    successToastText = '',
    ...otherProps
  } = _ref;
  const {
    formState,
    setFormState,
    getDirtyKeys
  } = useContext(FormContext);
  const {
    addToast
  } = useContext(FormosaContext);
  const submitApiRequest = e => {
    e.preventDefault();
    const dirtyKeys = getDirtyKeys();
    if (preventEmptyRequest && dirtyKeys.length <= 0) {
      if (preventEmptyRequestText) {
        addToast(preventEmptyRequestText);
      }
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
      url = path + "/" + id;
    }
    if (params) {
      url += "?" + params;
    }
    const body = getBody(method, path, id, formState, dirtyKeys, relationshipNames, filterBody, filterValues);
    setFormState({
      ...formState,
      alertClass: '',
      alertText: '',
      errors: {},
      response: null,
      toastClass: '',
      toastText: ''
    });
    const bodyString = body instanceof FormData ? body : JSON.stringify(body);
    Api.request(method, url, bodyString).catch(response => {
      if (!Object.prototype.hasOwnProperty.call(response, 'errors') || !Array.isArray(response.errors)) {
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
            key = key.replace(/^\/included\/(\d+)\//g, "included." + includedRecord.type + "." + includedRecord.id + ".");
          }
          key = key.replace(/\//g, '.');
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
      setFormState({
        ...formState,
        alertClass: 'error',
        alertText: typeof errorMessageText === 'function' ? errorMessageText(response) : errorMessageText,
        errors,
        response,
        toastClass: 'error',
        toastText: typeof errorToastText === 'function' ? errorToastText(response) : errorToastText,
        uuid: v4()
      });
    }).then(response => {
      if (!response) {
        return;
      }
      const newState = {
        ...formState,
        alertClass: 'success',
        alertText: typeof successMessageText === 'function' ? successMessageText(response) : successMessageText,
        errors: {},
        response,
        toastClass: 'success',
        toastText: typeof successToastText === 'function' ? successToastText(response) : successToastText,
        uuid: v4()
      };
      if (clearOnSubmit) {
        newState.originalRow = JSON.parse(JSON.stringify(defaultRow));
        newState.row = JSON.parse(JSON.stringify(defaultRow));
        if (formState.setRow) {
          formState.setRow(newState.row);
        }
      } else {
        newState.originalRow = JSON.parse(JSON.stringify(formState.row));
      }
      setFormState(newState);
    });
  };
  if (method && path && !Object.prototype.hasOwnProperty.call(otherProps, 'onSubmit')) {
    otherProps.onSubmit = submitApiRequest;
  }
  if (htmlId) {
    otherProps.id = htmlId;
  }
  return /*#__PURE__*/React__default.createElement("form", otherProps, showMessage && formState.alertText && /*#__PURE__*/React__default.createElement(Alert, {
    type: formState.alertClass
  }, formState.alertText), children);
}
FormInner.propTypes = {
  afterNoSubmit: PropTypes.func,
  beforeSubmit: PropTypes.func,
  children: PropTypes.node,
  clearOnSubmit: PropTypes.bool,
  defaultRow: PropTypes.object,
  errorMessageText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  errorToastText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  filterBody: PropTypes.func,
  filterValues: PropTypes.func,
  htmlId: PropTypes.string,
  id: PropTypes.string,
  method: PropTypes.string,
  params: PropTypes.string,
  path: PropTypes.string,
  preventEmptyRequest: PropTypes.bool,
  preventEmptyRequestText: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  relationshipNames: PropTypes.array,
  showMessage: PropTypes.bool,
  successMessageText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  successToastText: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
};

function Form(_ref) {
  let {
    afterSubmitFailure = null,
    afterSubmitSuccess = null,
    children = null,
    row = {},
    setRow = null,
    showInlineErrors = true,
    ...otherProps
  } = _ref;
  const {
    addToast
  } = useContext(FormosaContext);
  const setOriginalValue = (fs, setFs, key, value) => {
    const newRow = {
      ...fs.originalRow
    };
    set(newRow, key, value);
    setFs({
      ...fs,
      originalRow: JSON.parse(JSON.stringify(newRow))
    });
  };
  const [formState, setFormState] = useState({
    alertClass: '',
    alertText: '',
    errors: {},
    files: {},
    originalRow: JSON.parse(JSON.stringify(row)),
    row,
    response: null,
    setOriginalValue,
    setRow,
    showInlineErrors,
    toastClass: '',
    toastText: '',
    uuid: null
  });
  useEffect(() => {
    if (JSON.stringify(row) === JSON.stringify(formState.row)) {
      return;
    }
    setFormState({
      ...formState,
      row
    });
  });
  useEffect(() => {
    if (!formState.uuid) {
      return;
    }
    if (formState.toastText) {
      addToast(formState.toastText, formState.toastClass);
    }
    if (formState.alertClass === 'success' && afterSubmitSuccess) {
      afterSubmitSuccess(formState.response, formState, setFormState);
    } else if (formState.alertClass === 'error' && afterSubmitFailure) {
      afterSubmitFailure(formState.response, formState, setFormState);
    }
  }, [formState.uuid]);
  const getDirtyKeys = (r, originalRow) => {
    let dirtyKeys = [];
    Object.keys(r).forEach(key => {
      let oldValue = get(originalRow, key);
      let newValue = get(r, key);
      const isArray = Array.isArray(oldValue) || Array.isArray(newValue);
      if (isArray) {
        let itemDirtyKeys;
        Object.keys(newValue).forEach(newIndex => {
          const oldIndex = oldValue ? oldValue.findIndex(o => o.id === newValue[newIndex].id) : -1;
          itemDirtyKeys = getDirtyKeys(newValue[newIndex], oldIndex > -1 ? oldValue[oldIndex] : {});
          itemDirtyKeys = itemDirtyKeys.map(k2 => key + "." + newIndex + "." + k2);
          dirtyKeys = dirtyKeys.concat(itemDirtyKeys);
        });
      }
      if (typeof oldValue !== 'string') {
        oldValue = JSON.stringify(oldValue);
      }
      if (typeof newValue !== 'string') {
        newValue = JSON.stringify(newValue);
      }
      if (newValue !== oldValue) {
        dirtyKeys.push(key);
      }
    });
    return dirtyKeys;
  };
  const setValues = function (e, name, value, afterChange, files) {
    if (afterChange === void 0) {
      afterChange = null;
    }
    if (files === void 0) {
      files = null;
    }
    const newRow = {
      ...formState.row
    };
    set(newRow, name, value);
    if (afterChange) {
      const additionalChanges = afterChange(e, newRow, value);
      Object.keys(additionalChanges).forEach(key => {
        set(newRow, key, additionalChanges[key]);
      });
    }
    const newFormState = {
      ...formState,
      row: newRow
    };
    if (files !== null) {
      set(newFormState, "files." + name, files);
    }
    setFormState(newFormState);
    if (formState.setRow) {
      formState.setRow(newRow);
    }
  };
  const value = useMemo(() => ({
    formState,
    setFormState,
    clearAlert: () => setFormState({
      ...formState,
      alertText: '',
      alertClass: ''
    }),
    clearErrors: () => setFormState({
      ...formState,
      errors: {}
    }),
    getDirtyKeys: () => getDirtyKeys(formState.row, formState.originalRow),
    setValues
  }), [formState]);
  return /*#__PURE__*/React__default.createElement(FormContext.Provider, {
    value: value
  }, /*#__PURE__*/React__default.createElement(FormInner, otherProps, children));
}
Form.propTypes = {
  afterSubmitFailure: PropTypes.func,
  afterSubmitSuccess: PropTypes.func,
  children: PropTypes.node,
  row: PropTypes.object,
  setRow: PropTypes.func,
  showInlineErrors: PropTypes.bool
};

function FormAlert(_ref) {
  let {
    ...otherProps
  } = _ref;
  const {
    formState
  } = useContext(FormContext);
  if (!formState.alertText) {
    return null;
  }
  return /*#__PURE__*/React__default.createElement(Alert, _extends({
    type: formState.alertClass
  }, otherProps), formState.alertText);
}

function Spinner(_ref) {
  let {
    loadingText = 'Loading...'
  } = _ref;
  const {
    promiseInProgress
  } = usePromiseTracker();
  if (!promiseInProgress) {
    return null;
  }
  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-spinner formosa-spinner--fullscreen",
    role: "status"
  }, loadingText);
}
Spinner.propTypes = {
  loadingText: PropTypes.string
};

function Toast(_ref) {
  let {
    className = '',
    id,
    milliseconds,
    text
  } = _ref;
  const {
    removeToast
  } = useContext(FormosaContext);
  return /*#__PURE__*/React__default.createElement("div", {
    "aria-live": "polite",
    className: ("formosa-toast " + className).trim(),
    role: "alert",
    style: {
      animationDuration: milliseconds + "ms"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast__text"
  }, text), /*#__PURE__*/React__default.createElement("button", {
    className: "formosa-toast__close",
    onClick: () => removeToast(id),
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

function ToastContainer() {
  const {
    toasts
  } = useContext(FormosaContext);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "formosa-toast-container"
  }, Object.keys(toasts).map(id => /*#__PURE__*/React__default.createElement(Toast, {
    className: toasts[id].className,
    key: id,
    id: id,
    milliseconds: toasts[id].milliseconds,
    text: toasts[id].text
  })));
}

function FormContainer(_ref) {
  let {
    children,
    loadingText = 'Loading...'
  } = _ref;
  const [showWarningPrompt, setShowWarningPrompt] = useState(true);
  const [toasts, setToasts] = useState({});
  const removeToast = toastId => {
    const newToasts = {
      ...toasts
    };
    if (Object.prototype.hasOwnProperty.call(toasts, toastId)) {
      delete newToasts[toastId];
      setToasts(newToasts);
    }
  };
  const addToast = function (text, type, milliseconds) {
    if (type === void 0) {
      type = '';
    }
    if (milliseconds === void 0) {
      milliseconds = 5000;
    }
    const toastId = new Date().getTime();
    const toast = {
      className: type ? "formosa-toast--" + type : '',
      text,
      milliseconds
    };
    const newToasts = {
      ...toasts,
      [toastId]: toast
    };
    setToasts(newToasts);
    setTimeout(() => {
      removeToast(toastId);
    }, milliseconds);
  };
  const disableWarningPrompt = () => {
    setShowWarningPrompt(false);
  };
  const enableWarningPrompt = () => {
    setShowWarningPrompt(true);
  };
  const value = useMemo(() => ({
    toasts,
    showWarningPrompt,
    addToast,
    removeToast,
    disableWarningPrompt,
    enableWarningPrompt
  }), [toasts, showWarningPrompt]);
  return /*#__PURE__*/React__default.createElement(FormosaContext.Provider, {
    value: value
  }, children, /*#__PURE__*/React__default.createElement(Spinner, {
    loadingText: loadingText
  }), /*#__PURE__*/React__default.createElement(ToastContainer, null));
}
FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
  loadingText: PropTypes.string
};

function Submit(_ref) {
  let {
    className = '',
    label = 'Submit',
    prefix = null,
    postfix = null,
    ...otherProps
  } = _ref;
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

export { Alert, Api, SvgCheck as CheckIcon, Error$1 as Error, Field, Form, FormAlert, FormContainer, FormContext, FormosaContext, ExportableInput as Input, Label, Submit };
//# sourceMappingURL=index.modern.js.map
