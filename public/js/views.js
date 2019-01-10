/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 227);
/******/ })
/************************************************************************/
/******/ (Array(227).concat([
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views
 */

__webpack_require__(228);

__webpack_require__(233);

__webpack_require__(243);

__webpack_require__(274);

__webpack_require__(284);

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Widgets
 */

namespace('Views.Widgets').add(__webpack_require__(229)).add(__webpack_require__(230)).add(__webpack_require__(231)).add(__webpack_require__(232));

/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A standard widget
 *
 * @memberof HashBrown.Client.Views.Widgets
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Widget =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(Widget, _Crisp$View);

  /**
   * Constructor
   */
  function Widget(params) {
    var _this;

    _classCallCheck(this, Widget);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Widget).call(this, params));

    if (!params.isAsync) {
      _this.fetch();
    }

    return _this;
  }
  /**
   * Adds a notifying message
   *
   * @param {String} message
   */


  _createClass(Widget, [{
    key: "notify",
    value: function notify(message) {
      var notifier = this.element.querySelector('.widget__notifier');

      if (!message) {
        if (notifier) {
          notifier.parentElement.removeChild(notifier);
        }

        return;
      }

      if (!notifier) {
        notifier = _.div({
          class: 'widget__notifier'
        }, message);

        _.append(this.element, notifier);
      }

      notifier.innerHTML = message;
    }
  }]);

  return Widget;
}(Crisp.View);

module.exports = Widget;

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A multi purpose dropdown
 *
 * @memberof HashBrown.Client.Views.Widgets
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Dropdown =
/*#__PURE__*/
function (_HashBrown$Views$Widg) {
  _inherits(Dropdown, _HashBrown$Views$Widg);

  /**
   * Constructor
   */
  function Dropdown(params) {
    var _this;

    _classCallCheck(this, Dropdown);

    if (params.optionsUrl) {
      params.isAsync = true;
      HashBrown.Helpers.RequestHelper.request('get', params.optionsUrl).then(function (options) {
        _this.options = options;

        _this.fetch();
      });
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdown).call(this, params));
    _this.optionIcons = {};
    return _this;
  }
  /**
   * Gets option icon
   *
   * @param {String} label
   *
   * @returns {String} Icon
   */


  _createClass(Dropdown, [{
    key: "getOptionIcon",
    value: function getOptionIcon(label) {
      if (!this.iconKey || !this.labelKey || !this.options) {
        return '';
      }

      for (var key in this.options) {
        var value = this.options[key];
        var optionLabel = this.labelKey ? value[this.labelKey] : value;

        if (typeof optionLabel !== 'string') {
          optionLabel = optionLabel ? optionLabel.toString() : '';
        }

        if (optionLabel === label) {
          return value[this.iconKey] || '';
        }
      }

      return '';
    }
    /**
     * Converts options into a flattened structure
     *
     * @returns {Object} Options
     */

  }, {
    key: "getFlattenedOptions",
    value: function getFlattenedOptions() {
      if (!this.labelKey && !this.valueKey && this.options && !Array.isArray(this.options)) {
        return this.options;
      }

      var options = {};

      for (var key in this.options) {
        var value = this.options[key];
        var optionLabel = this.labelKey ? value[this.labelKey] : value;
        var optionValue = this.valueKey ? value[this.valueKey] : value;

        if (typeof optionValue !== 'string') {
          optionValue = optionValue ? optionValue.toString() : '';
        }

        if (typeof optionLabel !== 'string') {
          optionLabel = optionLabel ? optionLabel.toString() : '';
        } // Check for disabled options


        var isDisabled = false;

        if (this.disabledOptions && Array.isArray(this.disabledOptions)) {
          for (var disabledKey in this.disabledOptions) {
            var disabledValue = this.disabledOptions[disabledKey];
            var disabledOptionValue = this.valueKey ? disabledValue[this.valueKey] : disabledValue;

            if (typeof disabledOptionValue !== 'string') {
              disabledOptionValue = disabledOptionValue.toString();
            }

            if (optionValue === disabledOptionValue) {
              isDisabled = true;
              break;
            }
          }
        }

        if (isDisabled) {
          continue;
        }

        options[optionLabel] = optionValue;
      } // Sort options alphabetically


      var sortedOptions = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(options).sort()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var label = _step.value;
          sortedOptions[options[label]] = label;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return sortedOptions;
    }
    /**
     * Gets the current value label
     *
     * @returns {String} Value label
     */

  }, {
    key: "getValueLabel",
    value: function getValueLabel() {
      this.sanityCheck();

      if (this.icon) {
        return '<span class="widget--dropdown__value__tool-icon fa fa-' + this.icon + '"></span>';
      }

      var label = this.placeholder || '(none)';
      var options = this.getFlattenedOptions();

      if (this.useMultiple) {
        var labels = [];

        for (var key in options) {
          var value = options[key];

          if (value && this.value.indexOf(key) > -1) {
            labels.push(value);
          }
        }

        label = labels.join(', ');
      } else {
        label = options[this.value] === 0 ? '0' : options[this.value] || label;
      }

      return label;
    }
    /**
     * Performs a sanity check of the value
     */

  }, {
    key: "sanityCheck",
    value: function sanityCheck() {
      if (this.useMultiple && !Array.isArray(this.value)) {
        this.value = [];
      } else if (!this.useMultiple && Array.isArray(this.value)) {
        this.value = null;
      }
    }
    /**
     * Updates all selected classes
     */

  }, {
    key: "updateSelectedClasses",
    value: function updateSelectedClasses() {
      var btnOptions = this.element.querySelectorAll('.widget--dropdown__option');

      if (!btnOptions) {
        return;
      }

      for (var i = 0; i < btnOptions.length; i++) {
        var value = btnOptions[i].dataset.value;
        var hasValue = Array.isArray(this.value) ? this.value.indexOf(value) > -1 : this.value === value;
        btnOptions[i].classList.toggle('selected', hasValue);
      }
    }
    /**
     * Updates all position classes
     */

  }, {
    key: "updatePositionClasses",
    value: function updatePositionClasses() {
      var _this2 = this;

      setTimeout(function () {
        var toggle = _this2.element.querySelector('.widget--dropdown__toggle');

        var isChecked = toggle.checked;
        toggle.checked = true;

        var bounds = _this2.element.querySelector('.widget--dropdown__options').getBoundingClientRect();

        toggle.checked = isChecked;
        var isAtRight = bounds.right >= window.innerWidth - 10;
        var isAtBottom = bounds.bottom >= window.innerHeight - 10;

        _this2.element.classList.toggle('right', isAtRight);

        _this2.element.classList.toggle('bottom', isAtBottom);
      }, 1);
    }
    /**
     * Event: Change value
     *
     * @param {Object} newValue
     */

  }, {
    key: "onChangeInternal",
    value: function onChangeInternal(newValue) {
      this.sanityCheck(); // Change multiple value

      if (this.useMultiple) {
        // First check if value was already selected, remove if found
        var foundValue = false;

        for (var i in this.value) {
          if (this.value[i] === newValue) {
            this.value.splice(i, 1);
            foundValue = true;
            break;
          }
        } // If value was not selected, add it


        if (!foundValue) {
          if (!newValue) {
            this.value = [];
          } else {
            this.value.push(newValue);
          }
        } // Change single value

      } else {
        this.value = newValue;
      } // Update classes


      this.updateSelectedClasses(); // Update value label

      var divValue = this.element.querySelector('.widget--dropdown__value');

      if (divValue) {
        divValue.innerHTML = this.getValueLabel();
      } // Cancel


      this.toggle(false); // The value is a function, execute it and return

      if (typeof this.value === 'function') {
        this.value();
        return;
      } // Change event


      if (typeof this.onChange === 'function') {
        this.onChange(this.value);
      }
    }
    /**
     * Event: Typeahead
     *
     * @param {String} query
     */

  }, {
    key: "onTypeahead",
    value: function onTypeahead(query) {
      var btnOptions = this.element.querySelectorAll('.widget--dropdown__option');

      if (!btnOptions) {
        return;
      }

      query = (query || '').toLowerCase();

      for (var i = 0; i < btnOptions.length; i++) {
        var value = btnOptions[i].innerHTML.toLowerCase();
        var isMatch = query.length < 2 || value.indexOf(query) > -1;
        btnOptions[i].classList.toggle('hidden', !isMatch);
      }
    }
    /**
     * Toggles open/closed
     *
     * @param {Boolean} isOpen
     */

  }, {
    key: "toggle",
    value: function toggle(isOpen) {
      var toggle = this.element.querySelector('.widget--dropdown__toggle');

      if (typeof isOpen === 'undefined') {
        isOpen = !toggle.checked;
      }

      toggle.checked = isOpen;

      if (!isOpen) {
        this.trigger('cancel');
      } else {
        if (this.useTypeAhead) {
          this.element.querySelector('.widget--dropdown__typeahead').focus();
        }
      }

      this.updatePositionClasses();
      this.updateSelectedClasses();
    }
    /**
     * Template
     */

  }, {
    key: "template",
    value: function template() {
      var _this3 = this;

      return _.div({
        title: this.tooltip,
        class: 'widget widget--dropdown dropdown' + (this.icon ? ' has-icon' : '')
      }, // Value
      _.div({
        class: 'widget--dropdown__value'
      }, this.getValueLabel()), // Toggle
      _.input({
        class: 'widget--dropdown__toggle',
        type: 'checkbox'
      }).click(function (e) {
        _this3.toggle(e.currentTarget.checked);
      }), // Typeahead input
      _.if(this.useTypeAhead, _.span({
        class: 'widget--dropdown__typeahead__icon fa fa-search'
      }), _.input({
        class: 'widget--dropdown__typeahead',
        type: 'text'
      }).on('input', function (e) {
        _this3.onTypeahead(e.currentTarget.value);
      })), // Dropdown options
      _.div({
        class: 'widget--dropdown__options'
      }, _.each(this.getFlattenedOptions(), function (optionValue, optionLabel) {
        var optionIcon = _this3.getOptionIcon(optionLabel); // Reverse keys option


        if (_this3.reverseKeys) {
          var key = optionLabel;
          var value = optionValue;
          optionValue = key;
          optionLabel = value;
        }

        if (!optionValue || optionValue === '---') {
          return _.div({
            class: 'widget--dropdown__separator'
          }, optionLabel);
        }

        return _.button({
          class: 'widget--dropdown__option',
          'data-value': optionValue
        }, _.if(optionIcon, _.span({
          class: 'widget--dropdown__option__icon fa fa-' + optionIcon
        })), optionLabel).click(function (e) {
          _this3.onChangeInternal(optionValue);
        });
      })), // Clear button
      _.if(this.useClearButton, _.button({
        class: 'widget--dropdown__clear fa fa-remove',
        title: 'Clear selection'
      }).click(function (e) {
        _this3.onChangeInternal(null);
      })));
    }
  }]);

  return Dropdown;
}(HashBrown.Views.Widgets.Widget);

module.exports = Dropdown;

/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A group of chips
 *
 * @memberof HashBrown.Client.Views.Widgets
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Chips =
/*#__PURE__*/
function (_HashBrown$Views$Widg) {
  _inherits(Chips, _HashBrown$Views$Widg);

  function Chips() {
    _classCallCheck(this, Chips);

    return _possibleConstructorReturn(this, _getPrototypeOf(Chips).apply(this, arguments));
  }

  _createClass(Chips, [{
    key: "onChangeInternal",

    /**
     * Event: Change
     */
    value: function onChangeInternal() {
      if (typeof this.onChange !== 'function') {
        return;
      }

      this.onChange(this.value);
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      // Array check
      // NOTE: Array is the default mode for this widget
      if (this.useArray === true || typeof this.useArray === 'undefined') {
        // Check format
        if (!this.value || !Array.isArray(this.value)) {
          this.value = [];
        }

        if (!this.disabledValue || !Array.isArray(this.disabledValue)) {
          this.disabledValue = [];
        } // Check empty values


        for (var i = this.value.length - 1; i >= 0; i--) {
          if (!this.value[i]) {
            this.value.splice(i, 1);
          }
        } // Check for empty values or duplicates in disabled value


        for (var _i = this.disabledValue.length - 1; _i >= 0; _i--) {
          if (!this.disabledValue[_i] || this.value.indexOf(this.disabledValue[_i]) > -1) {
            this.disabledValue.splice(_i, 1);
          }
        } // Object check

      } else if (this.useArray === false || this.useObject === true) {
        // Check format
        if (!this.value || Array.isArray(this.value) || _typeof(this.value) !== 'object') {
          this.value = {};
        }

        if (!this.disabledValue || Array.isArray(this.disabledValue) || _typeof(this.disabledValue) !== 'object') {
          this.disabledValue = {};
        } // Check empty values


        for (var k in this.value) {
          if (!k || !this.value[k]) {
            delete this.value[k];
          }
        } // Check for empty values or duplicates in disabled value


        for (var _k in this.disabledValue) {
          if (!_k || !this.disabledValue[_k] || this.value[_k]) {
            delete this.value[_k];
          }
        }
      }
    }
    /**
     * Template
     */

  }, {
    key: "template",
    value: function template() {
      var _this = this;

      return _.div({
        class: 'widget widget--chips'
      }, _.each(this.disabledValue, function (i, item) {
        return _.div({
          class: 'widget--chips__chip'
        }, _.input({
          class: 'widget--chips__chip__input',
          disabled: true,
          value: item
        }));
      }), _.each(this.value, function (i, item) {
        return _.div({
          class: 'widget--chips__chip'
        }, _.if(_this.useObject === true || _this.useArray === false || _this.valueKey, _.input({
          class: 'widget--chips__chip__input',
          title: 'The key',
          type: 'text',
          value: item[_this.valueKey] || i,
          pattern: '.{1,}'
        }).on('change', function (e) {
          if (_this.valueKey) {
            item[_this.valueKey] = e.currentTarget.value || '';
          } else {
            i = e.currentTarget.value || '';
            _this.value[i] = item;
          }

          _this.onChangeInternal();
        })), _.input({
          class: 'widget--chips__chip__input',
          title: 'The label',
          type: 'text',
          value: _this.labelKey ? item[_this.labelKey] : item,
          pattern: '.{1,}'
        }).on('change', function (e) {
          if (_this.labelKey) {
            item[_this.labelKey] = e.currentTarget.value || '';
          } else {
            _this.value[i] = e.currentTarget.value || '';
          }

          _this.onChangeInternal();
        }), _.button({
          class: 'widget--chips__chip__remove fa fa-remove',
          title: 'Remove item'
        }).click(function () {
          _this.value.splice(i, 1);

          _this.onChangeInternal();

          _this.fetch();
        }));
      }), _.button({
        class: 'widget widget--button round widget--chips__add fa fa-plus',
        title: 'Add item'
      }).click(function () {
        var newValue = _this.placeholder || 'New item';
        var newKey = newValue.toLowerCase().replace(/[^a-zA-Z]/g, '');

        if (_this.useObject === true || _this.useArray === false) {
          _this.value[newKey] = newValue;
        } else if (_this.valueKey && _this.labelKey) {
          var newObject = {};
          newObject[_this.valueKey] = newKey;
          newObject[_this.labelKey] = newValue;

          _this.value.push(newObject);
        } else {
          _this.value.push(newValue);
        }

        _this.onChangeInternal();

        _this.fetch();
      }));
    }
  }]);

  return Chips;
}(HashBrown.Views.Widgets.Widget);

module.exports = Chips;

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A versatile input widget
 *
 * @memberof HashBrown.Client.Views.Widgets
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Input =
/*#__PURE__*/
function (_HashBrown$Views$Widg) {
  _inherits(Input, _HashBrown$Views$Widg);

  function Input() {
    _classCallCheck(this, Input);

    return _possibleConstructorReturn(this, _getPrototypeOf(Input).apply(this, arguments));
  }

  _createClass(Input, [{
    key: "onChangeInternal",

    /**
     * Event: Change value
     *
     * @param {Anything} newValue
     */
    value: function onChangeInternal(newValue) {
      this.value = newValue;

      if (typeof this.onChange !== 'function') {
        return;
      }

      this.onChange(this.value);
    }
    /**
     * Template
     */

  }, {
    key: "template",
    value: function template() {
      var _this = this;

      var config = {
        placeholder: this.placeholder,
        title: this.tooltip,
        type: this.type || 'text',
        class: 'widget widget--input ' + (this.type || 'text'),
        value: this.value,
        name: this.name
      };

      if (this.type === 'number' || this.type === 'range') {
        config.step = this.step || 'any';
        config.min = this.min;
        config.max = this.max;
      }

      switch (this.type) {
        case 'range':
          return _.div({
            class: config.class,
            title: config.title
          }, _.input({
            class: 'widget--input__range-input',
            type: 'range',
            value: this.value,
            min: config.min,
            max: config.max,
            step: config.step
          }).on('input', function (e) {
            _this.onChangeInternal(e.currentTarget.value);

            e.currentTarget.nextElementSibling.innerHTML = e.currentTarget.value;
          }), _.div({
            class: 'widget--input__range-extra'
          }, this.value));

        case 'checkbox':
          return _.div({
            class: config.class,
            title: config.title
          }, _.if(config.placeholder, _.label({
            for: 'checkbox-' + this.guid,
            class: 'widget--input__checkbox-label'
          }, config.placeholder)), _.input({
            id: 'checkbox-' + this.guid,
            class: 'widget--input__checkbox-input',
            type: 'checkbox',
            checked: this.value
          }).on('change', function (e) {
            _this.onChangeInternal(e.currentTarget.checked);
          }), _.div({
            class: 'widget--input__checkbox-background'
          }), _.div({
            class: 'widget--input__checkbox-switch'
          }));

        case 'file':
          return _.form({
            class: config.class + (typeof this.onSubmit === 'function' ? ' widget-group' : ''),
            title: config.title
          }, _.label({
            for: 'file-' + this.guid,
            class: 'widget--input__file-browse widget widget--button expanded'
          }, this.placeholder || 'Browse...'), _.input({
            id: 'file-' + this.guid,
            class: 'widget--input__file-input',
            type: 'file',
            name: this.name || 'file',
            multiple: this.useMultiple,
            directory: this.useDirectory
          }).on('change', function (e) {
            var names = [];
            var files = e.currentTarget.files;
            var btnBrowse = e.currentTarget.parentElement.querySelector('.widget--input__file-browse');
            var btnSubmit = e.currentTarget.parentElement.querySelector('.widget--input__file-submit');

            if (btnSubmit) {
              btnSubmit.classList.toggle('disabled', !files || files.length < 1);
            }

            _this.onChangeInternal(files);

            if (files && files.length > 0) {
              for (var i = 0; i < files.length; i++) {
                names.push(files[i].name + ' (' + Math.round(files[i].size / 1000) + 'kb)');
              }
            }

            if (names.length > 0) {
              btnBrowse.innerHTML = names.join(', ');
            } else {
              btnBrowse.innerHTML = _this.placeholder || 'Browse...';
            }
          }), _.if(typeof this.onSubmit === 'function', _.button({
            class: 'widget widget--button widget--input__file-submit disabled',
            type: 'submit',
            title: 'Upload file'
          }, _.span({
            class: 'fa fa-upload'
          }), 'Upload'))).on('submit', function (e) {
            e.preventDefault();
            var input = e.currentTarget.querySelector('.widget--input__file-input');

            if (!input || !input.files || input.files.length < 1) {
              return;
            }

            if (typeof _this.onSubmit !== 'function') {
              return;
            }

            _this.onSubmit(new FormData(e.currentTarget), input.files);
          });

        case 'textarea':
          return _.textarea(config, config.value).on('input', function (e) {
            _this.onChangeInternal(e.currentTarget.value);
          });

        default:
          return _.input(config).on('input', function (e) {
            _this.onChangeInternal(e.currentTarget.value);
          });
      }
    }
  }]);

  return Input;
}(HashBrown.Views.Widgets.Widget);

module.exports = Input;

/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Modals
 */

namespace('Views.Modals').add(__webpack_require__(234)).add(__webpack_require__(235)).add(__webpack_require__(236)).add(__webpack_require__(237)).add(__webpack_require__(239)).add(__webpack_require__(240)).add(__webpack_require__(241)).add(__webpack_require__(242));

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A generic modal
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Modal =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(Modal, _Crisp$View);

  /**
   * Constructor
   */
  function Modal(params) {
    var _this;

    _classCallCheck(this, Modal);

    params = params || {};

    if (typeof params.actions === 'undefined') {
      params.actions = [];
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, params)); // If this belongs to a group, find existing modals and append instead

    if (_this.group) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Crisp.View.getAll('Modal')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var modal = _step.value;

          if (modal.group !== _this.group || modal === _assertThisInitialized(_assertThisInitialized(_this))) {
            continue;
          }

          modal.append(_assertThisInitialized(_assertThisInitialized(_this)));

          _this.remove();

          break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    if (_this.autoFetch !== false) {
      _this.fetch();
    }

    document.body.appendChild(_this.element);
    return _this;
  }
  /**
   * Toggles the loading state
   *
   * @param {Boolean} isActive
   */


  _createClass(Modal, [{
    key: "setLoading",
    value: function setLoading(isActive) {
      var spinner = this.element.querySelector('.widget--spinner');
      spinner.classList.toggle('hidden', !isActive);
    }
    /**
     * Close this modal
     *
     */

  }, {
    key: "close",
    value: function close() {
      var _this2 = this;

      this.element.classList.toggle('in', false);
      setTimeout(function () {
        _this2.remove();
      }, 500);
    }
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      return this.body;
    }
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */

  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this3 = this;

      if (this.actions === false) {
        return;
      }

      if (this.actions && this.actions.length > 0) {
        return _.each(this.actions, function (i, action) {
          return _.button({
            class: 'widget widget--button ' + (action.class || '')
          }, action.label).click(function () {
            if (typeof action.onClick !== 'function') {
              return _this3.close();
            }

            if (action.onClick() !== false) {
              _this3.close();
            }
          });
        });
      }

      return _.button({
        class: 'widget widget--button'
      }, 'OK').click(function () {
        _this3.close();

        _this3.trigger('ok');
      });
    }
    /**
     * Renders the modal header
     *
     * @returns {HTMLElement} Header
     */

  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var _this4 = this;

      if (!this.title) {
        return;
      }

      return [_.h4({
        class: 'modal__title'
      }, this.title), _.if(!this.isBlocking, _.button({
        class: 'modal__close fa fa-close'
      }).click(function () {
        _this4.close();
      }))];
    }
    /**
     * Renders this modal
     */

  }, {
    key: "template",
    value: function template() {
      var _this5 = this;

      var header = this.renderHeader();
      var body = this.renderBody();
      var footer = this.renderFooter();

      if (!this.hasTransitionedIn) {
        setTimeout(function () {
          _this5.hasTransitionedIn = true;

          _this5.element.classList.toggle('in', true);
        }, 50);
      }

      return _.div({
        class: 'modal' + (this.hasTransitionedIn ? ' in' : '') + (this.group ? ' ' + this.group : '') + (this.className ? ' modal--' + this.className : '')
      }, _.div({
        class: 'modal__dialog'
      }, _.div({
        class: 'widget--spinner embedded hidden'
      }, _.div({
        class: 'widget--spinner__image fa fa-refresh'
      })), _.if(header, _.div({
        class: 'modal__header'
      }, header)), _.if(body, _.div({
        class: 'modal__body'
      }, body)), _.if(footer && !this.isBlocking, _.div({
        class: 'modal__footer'
      }, footer))));
    }
    /**
     * Appends another modal to this modal
     *
     * @param {Modal} modal
     */

  }, {
    key: "append",
    value: function append(modal) {
      this.$element.find('.modal__footer').before(_.div({
        class: 'modal__body'
      }, modal.renderBody()));
    }
  }]);

  return Modal;
}(Crisp.View); // Modal key events


document.addEventListener('keyup', function (e) {
  var modal = Crisp.View.getAll(Modal).pop();

  if (!modal) {
    return;
  }

  switch (e.which) {
    case 27:
      // Escape
      if (modal.element.querySelector('.modal__close')) {
        modal.close();
      }

      break;

    case 13:
      // Enter
      if ((!modal.actions || modal.actions.length === 0) && modal.renderFooter === Modal.renderFooter) {
        modal.close();
        modal.trigger('ok');
      } else if (modal.actions.length === 1) {
        modal.close();
        modal.actions[0].onClick();
      }

      break;
  }
});
module.exports = Modal;

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A modal for confirming actions
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConfirmModal =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(ConfirmModal, _HashBrown$Views$Moda);

  function ConfirmModal() {
    _classCallCheck(this, ConfirmModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConfirmModal).apply(this, arguments));
  }

  _createClass(ConfirmModal, [{
    key: "postrender",

    /**
     * Post render
     */
    value: function postrender() {
      this.element.classList.toggle('modal--confirm', true);
    }
    /**
     * Render header
     */

  }, {
    key: "renderHeader",
    value: function renderHeader() {
      return _.h4({
        class: 'modal--date__header__title'
      }, this.title);
    }
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */

  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this = this;

      return [_.button({
        class: 'widget widget--button standard'
      }, 'Cancel').click(function () {
        _this.trigger('cancel');

        _this.close();
      }), _.button({
        class: 'widget widget--button warning'
      }, this.type || 'OK').click(function () {
        _this.trigger('ok');

        _this.close();
      })];
    }
    /**
     * Render body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      return this.body;
    }
  }]);

  return ConfirmModal;
}(HashBrown.Views.Modals.Modal);

module.exports = ConfirmModal;

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A modal for picking dates
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DateModal =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(DateModal, _HashBrown$Views$Moda);

  /**
   * Constructor
   */
  function DateModal(params) {
    _classCallCheck(this, DateModal);

    params.className = 'date';
    return _possibleConstructorReturn(this, _getPrototypeOf(DateModal).call(this, params));
  }
  /**
   * Pre render
   */


  _createClass(DateModal, [{
    key: "prerender",
    value: function prerender() {
      this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      this.minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']; // Sanity check

      this.value = this.value ? new Date(this.value) : new Date();

      if (isNaN(this.value.getDate())) {
        this.value = new Date();
      }
    }
    /**
     * Gets days in current month and year
     *
     * @param {Number} year
     * @param {Number} month
     *
     * @returns {Array} Days
     */

  }, {
    key: "getDays",
    value: function getDays(year, month) {
      var max = new Date(year, month, 0).getDate();
      var days = [];

      while (days.length < max) {
        days[days.length] = days.length + 1;
      }

      return days;
    }
    /**
     * Render header
     */

  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var _this = this;

      return [_.div({
        class: 'modal--date__header__year'
      }, this.value.getFullYear().toString()), _.div({
        class: 'modal--date__header__day'
      }, this.days[this.value.getDay()] + ', ' + this.months[this.value.getMonth()] + ' ' + this.value.getDate()), _.button({
        class: 'modal__close fa fa-close'
      }).click(function () {
        _this.close();
      })];
    }
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */

  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this2 = this;

      return _.button({
        class: 'widget widget--button'
      }, 'OK').click(function () {
        _this2.trigger('change', _this2.value);

        _this2.close();
      });
    }
    /**
     * Render body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this3 = this;

      return [_.div({
        class: 'modal--date__body__nav'
      }, _.button({
        class: 'modal--date__body__nav__left fa fa-arrow-left'
      }).click(function () {
        _this3.value.setMonth(_this3.value.getMonth() - 1);

        _this3.fetch();
      }), _.div({
        class: 'modal--date__body__nav__month-year'
      }, this.months[this.value.getMonth()] + ' ' + this.value.getFullYear()), _.button({
        class: 'modal--date__body__nav__left fa fa-arrow-right'
      }).click(function () {
        _this3.value.setMonth(_this3.value.getMonth() + 1);

        _this3.fetch();
      })), _.div({
        class: 'modal--date__body__weekdays'
      }, _.span({
        class: 'modal--date__body__weekday'
      }, 'M'), _.span({
        class: 'modal--date__body__weekday'
      }, 'T'), _.span({
        class: 'modal--date__body__weekday'
      }, 'W'), _.span({
        class: 'modal--date__body__weekday'
      }, 'T'), _.span({
        class: 'modal--date__body__weekday'
      }, 'F'), _.span({
        class: 'modal--date__body__weekday'
      }, 'S'), _.span({
        class: 'modal--date__body__weekday'
      }, 'S')), _.div({
        class: 'modal--date__body__days'
      }, _.each(this.getDays(this.value.getFullYear(), this.value.getMonth() + 1), function (i, day) {
        var thisDate = new Date(_this3.value.getTime());
        var now = new Date();
        var isCurrent = now.getFullYear() == _this3.value.getFullYear() && now.getMonth() == _this3.value.getMonth() && now.getDate() == day;
        var isActive = _this3.value.getDate() == day;
        thisDate.setDate(day);
        return _.button({
          class: 'modal--date__body__day' + (isCurrent ? ' current' : '') + (isActive ? ' active' : '')
        }, day).click(function () {
          _this3.value.setDate(day);

          _this3.fetch();
        });
      })), _.div({
        class: 'modal--date__body__time'
      }, _.input({
        class: 'modal--date__body__time__number',
        type: 'number',
        min: 0,
        max: 23,
        value: this.value.getHours()
      }).on('change', function (e) {
        _this3.value.setHours(e.currentTarget.value);
      }), _.div({
        class: 'modal--date__body__time__separator'
      }, ':'), _.input({
        class: 'modal--date__body__time__number',
        type: 'number',
        min: 0,
        max: 59,
        value: this.value.getMinutes()
      }).on('change', function (e) {
        _this3.value.setMinutes(e.currentTarget.value);
      }))];
    }
  }]);

  return DateModal;
}(HashBrown.Views.Modals.Modal);

module.exports = DateModal;

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var icons = __webpack_require__(238).icons;
/**
 * A modal for picking icons
 *
 * @memberof HashBrown.Client.Views.Modals
 */


var IconModal =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(IconModal, _HashBrown$Views$Moda);

  /**
   * Constructor
   */
  function IconModal(params) {
    _classCallCheck(this, IconModal);

    params = params || {};
    params.title = params.title || 'Pick an icon';
    params.actions = false;
    return _possibleConstructorReturn(this, _getPrototypeOf(IconModal).call(this, params));
  }
  /**
   * Post render
   */


  _createClass(IconModal, [{
    key: "postrender",
    value: function postrender() {
      this.element.classList.toggle('modal--icon', true);
    }
    /**
     * Event: Search
     *
     * @param {String} query
     */

  }, {
    key: "onSearch",
    value: function onSearch(query) {
      var icons = this.element.querySelectorAll('.modal--icon__icon');

      if (!icons) {
        return;
      }

      for (var i = 0; i < icons.length; i++) {
        if (query.length < 3 || icons[i].title.indexOf(query) > -1) {
          icons[i].style.display = 'block';
        } else {
          icons[i].style.display = 'none';
        }
      }
    }
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this = this;

      return [_.input({
        type: 'text',
        class: 'widget widget--input text modal--icon__search',
        placeholder: 'Search for icons'
      }).on('input', function (e) {
        _this.onSearch(e.currentTarget.value);
      }), _.div({
        class: 'modal--icon__icons'
      }, _.each(icons, function (i, icon) {
        return _.button({
          class: 'modal--icon__icon widget widget--button fa fa-' + icon,
          title: icon
        }).click(function () {
          _this.trigger('change', icon);

          _this.close();
        });
      }))];
    }
  }]);

  return IconModal;
}(HashBrown.Views.Modals.Modal);

module.exports = IconModal;

/***/ }),
/* 238 */
/***/ (function(module) {

module.exports = {"icons":["500px","adjust","adn","align-center","align-justify","align-left","align-right","amazon","ambulance","anchor","android","angellist","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","apple","archive","area-chart","arrow-circle-down","arrow-circle-left","arrow-circle-o-down","arrow-circle-o-left","arrow-circle-o-right","arrow-circle-o-up","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows","arrows-alt","arrows-h","arrows-v","asterisk","at","automobile","backward","balance-scale","ban","bank","bar-chart","bar-chart-o","barcode","bars","battery-0","battery-1","battery-2","battery-3","battery-4","battery-empty","battery-full","battery-half","battery-quarter","battery-three-quarters","bed","beer","behance","behance-square","bell","bell-o","bell-slash","bell-slash-o","bicycle","binoculars","birthday-cake","bitbucket","bitbucket-square","bitcoin","black-tie","bluetooth","bluetooth-b","bold","bolt","bomb","book","bookmark","bookmark-o","briefcase","btc","bug","building","building-o","bullhorn","bullseye","bus","buysellads","cab","calculator","calendar","calendar-check-o","calendar-minus-o","calendar-o","calendar-plus-o","calendar-times-o","camera","camera-retro","car","caret-down","caret-left","caret-right","caret-square-o-down","caret-square-o-left","caret-square-o-right","caret-square-o-up","caret-up","cart-arrow-down","cart-plus","cc","cc-amex","cc-diners-club","cc-discover","cc-jcb","cc-mastercard","cc-paypal","cc-stripe","cc-visa","certificate","chain","chain-broken","check","check-circle","check-circle-o","check-square","check-square-o","chevron-circle-down","chevron-circle-left","chevron-circle-right","chevron-circle-up","chevron-down","chevron-left","chevron-right","chevron-up","child","chrome","circle","circle-o","circle-o-notch","circle-thin","clipboard","clock-o","clone","close","cloud","cloud-download","cloud-upload","cny","code","code-fork","codepen","codiepie","coffee","cog","cogs","columns","comment","comment-o","commenting","commenting-o","comments","comments-o","compass","compress","connectdevelop","contao","copy","copyright","creative-commons","credit-card","credit-card-alt","crop","crosshairs","css3","cube","cubes","cut","cutlery","dashboard","dashcube","database","dedent","delicious","desktop","deviantart","diamond","digg","dollar","dot-circle-o","download","dribbble","dropbox","drupal","edge","edit","eject","ellipsis-h","ellipsis-v","empire","envelope","envelope-o","envelope-square","eraser","eur","euro","exchange","exclamation","exclamation-circle","exclamation-triangle","expand","expeditedssl","external-link","external-link-square","eye","eye-slash","eyedropper","facebook","facebook-f","facebook-official","facebook-square","fast-backward","fast-forward","fax","feed","female","fighter-jet","file","file-archive-o","file-audio-o","file-code-o","file-excel-o","file-image-o","file-movie-o","file-o","file-pdf-o","file-photo-o","file-picture-o","file-powerpoint-o","file-sound-o","file-text","file-text-o","file-video-o","file-word-o","file-zip-o","files-o","film","filter","fire","fire-extinguisher","firefox","flag","flag-checkered","flag-o","flash","flask","flickr","floppy-o","folder","folder-o","folder-open","folder-open-o","font","fonticons","fort-awesome","forumbee","forward","foursquare","frown-o","futbol-o","gamepad","gavel","gbp","ge","gear","gears","genderless","get-pocket","gg","gg-circle","gift","git","git-square","github","github-alt","github-square","gittip","glass","globe","google","google-plus","google-plus-square","google-wallet","graduation-cap","gratipay","group","h-square","hacker-news","hand-grab-o","hand-lizard-o","hand-o-down","hand-o-left","hand-o-right","hand-o-up","hand-paper-o","hand-peace-o","hand-pointer-o","hand-rock-o","hand-scissors-o","hand-spock-o","hand-stop-o","hashtag","hdd-o","header","headphones","heart","heart-o","heartbeat","history","home","hospital-o","hotel","hourglass","hourglass-1","hourglass-2","hourglass-3","hourglass-end","hourglass-half","hourglass-o","hourglass-start","houzz","html5","i-cursor","ils","image","inbox","indent","industry","info","info-circle","inr","instagram","institution","internet-explorer","intersex","ioxhost","italic","joomla","jpy","jsfiddle","key","keyboard-o","krw","language","laptop","lastfm","lastfm-square","leaf","leanpub","legal","lemon-o","level-down","level-up","life-bouy","life-buoy","life-ring","life-saver","lightbulb-o","line-chart","link","linkedin","linkedin-square","linux","list","list-alt","list-ol","list-ul","location-arrow","lock","long-arrow-down","long-arrow-left","long-arrow-right","long-arrow-up","magic","magnet","mail-forward","mail-reply","mail-reply-all","male","map","map-marker","map-o","map-pin","map-signs","mars","mars-double","mars-stroke","mars-stroke-h","mars-stroke-v","maxcdn","meanpath","medium","medkit","meh-o","mercury","microphone","microphone-slash","minus","minus-circle","minus-square","minus-square-o","mixcloud","mobile","mobile-phone","modx","money","moon-o","mortar-board","motorcycle","mouse-pointer","music","navicon","neuter","newspaper-o","object-group","object-ungroup","odnoklassniki","odnoklassniki-square","opencart","openid","opera","optin-monster","outdent","pagelines","paint-brush","paper-plane","paper-plane-o","paperclip","paragraph","paste","pause","pause-circle","pause-circle-o","paw","paypal","pencil","pencil-square","pencil-square-o","percent","phone","phone-square","photo","picture-o","pie-chart","pied-piper","pied-piper-alt","pinterest","pinterest-p","pinterest-square","plane","play","play-circle","play-circle-o","plug","plus","plus-circle","plus-square","plus-square-o","power-off","print","product-hunt","puzzle-piece","qq","qrcode","question","question-circle","quote-left","quote-right","ra","random","rebel","recycle","reddit","reddit-alien","reddit-square","refresh","registered","remove","renren","reorder","repeat","reply","reply-all","retweet","rmb","road","rocket","rotate-left","rotate-right","rouble","rss","rss-square","rub","ruble","rupee","safari","save","scissors","scribd","search","search-minus","search-plus","sellsy","send","send-o","server","share","share-alt","share-alt-square","share-square","share-square-o","shekel","sheqel","shield","ship","shirtsinbulk","shopping-bag","shopping-basket","shopping-cart","sign-in","sign-out","signal","simplybuilt","sitemap","skyatlas","skype","slack","sliders","slideshare","smile-o","soccer-ball-o","sort","sort-alpha-asc","sort-alpha-desc","sort-amount-asc","sort-amount-desc","sort-asc","sort-desc","sort-down","sort-numeric-asc","sort-numeric-desc","sort-up","soundcloud","space-shuttle","spinner","spoon","spotify","square","square-o","stack-exchange","stack-overflow","star","star-half","star-half-empty","star-half-full","star-half-o","star-o","steam","steam-square","step-backward","step-forward","stethoscope","sticky-note","sticky-note-o","stop","stop-circle","stop-circle-o","street-view","strikethrough","stumbleupon","stumbleupon-circle","subscript","subway","suitcase","sun-o","superscript","support","table","tablet","tachometer","tag","tags","tasks","taxi","television","tencent-weibo","terminal","text-height","text-width","th","th-large","th-list","thumb-tack","thumbs-down","thumbs-o-down","thumbs-o-up","thumbs-up","ticket","times","times-circle","times-circle-o","tint","toggle-down","toggle-left","toggle-off","toggle-on","toggle-right","toggle-up","trademark","train","transgender","transgender-alt","trash","trash-o","tree","trello","tripadvisor","trophy","truck","try","tty","tumblr","tumblr-square","turkish-lira","tv","twitch","twitter","twitter-square","umbrella","underline","undo","university","unlink","unlock","unlock-alt","unsorted","upload","usb","usd","user","user-md","user-plus","user-secret","user-times","users","venus","venus-double","venus-mars","viacoin","video-camera","vimeo","vimeo-square","vine","vk","volume-down","volume-off","volume-up","warning","wechat","weibo","weixin","whatsapp","wheelchair","wifi","wikipedia-w","windows","won","wordpress","wrench","xing","xing-square","y-combinator","y-combinator-square","yahoo","yc","yc-square","yelp","yen","youtube","youtube-play","youtube-square"]};

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A modal for showng iframes
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var IframeModal =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(IframeModal, _HashBrown$Views$Moda);

  function IframeModal() {
    _classCallCheck(this, IframeModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(IframeModal).apply(this, arguments));
  }

  _createClass(IframeModal, [{
    key: "postrender",

    /**
     * Post render
     */
    value: function postrender() {
      this.element.classList.toggle('modal--iframe', true);
    }
    /**
     * Render body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      return _.iframe({
        class: 'modal--iframe__iframe',
        src: this.url
      });
    }
  }]);

  return IframeModal;
}(HashBrown.Views.Modals.Modal);

module.exports = IframeModal;

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A browser modal for Media objects
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MediaBrowser =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(MediaBrowser, _HashBrown$Views$Moda);

  function MediaBrowser(params) {
    var _this;

    _classCallCheck(this, MediaBrowser);

    params = params || {};
    params.className = 'media-browser';
    params.title = 'Pick media';
    params.actions = [{
      label: 'OK',
      onClick: function onClick() {
        _this.onClickOK();
      }
    }];
    _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaBrowser).call(this, params)); // Init the media picker mode inside the iframe

    var iframe = _this.$element.find('iframe')[0];

    iframe.onload = function () {
      iframe.contentWindow.HashBrown.Helpers.MediaHelper.initMediaPickerMode(function (id) {
        _this.onPickMedia(id);
      }, function () {
        _this.onChangeResource();
      }, function (e) {
        UI.errorModal(e);
      }, resources);
    };

    return _this;
  }
  /**
   * Event: Pick Media
   *
   * @param {string} id
   */


  _createClass(MediaBrowser, [{
    key: "onPickMedia",
    value: function onPickMedia(id) {
      this.value = id;
    }
    /** 
     * Event: Click OK
     */

  }, {
    key: "onClickOK",
    value: function onClickOK() {
      if (this.value) {
        this.trigger('select', this.value);
      }

      this.close();
    }
    /** 
     * Event: Click cancel
     */

  }, {
    key: "onClickCancel",
    value: function onClickCancel() {
      this.close();
    }
    /**
     * Event: Change resource
     */

  }, {
    key: "onChangeResource",
    value: function onChangeResource() {
      HashBrown.Helpers.RequestHelper.reloadResource('media').then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      });
    }
    /**
     * Render body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      return _.iframe({
        src: '//' + location.host + '/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/#/media/' + (this.value || '')
      });
    }
  }]);

  return MediaBrowser;
}(HashBrown.Views.Modals.Modal);

module.exports = MediaBrowser;

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A modal for uploading Media objects
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MediaUploader =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(MediaUploader, _HashBrown$Views$Moda);

  /**
   * Constructor
   */
  function MediaUploader(params) {
    var _this;

    _classCallCheck(this, MediaUploader);

    params.className = 'media-uploader';
    params.title = 'Upload a file';
    params.actions = false;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaUploader).call(this, params));
    HashBrown.Helpers.MediaHelper.checkMediaProvider().catch(function (e) {
      UI.errorModal(e);

      _this.close();
    });
    return _this;
  }
  /**
   * Event: Change file
   */


  _createClass(MediaUploader, [{
    key: "onChangeFile",
    value: function onChangeFile(files) {
      var _this2 = this;

      var numFiles = files ? files.length : 1; // In the case of a single file selected 

      if (numFiles == 1) {
        var file = files[0];
        var isImage = file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif';
        var isVideo = file.type == 'video/mpeg' || file.type == 'video/mp4' || file.type == 'video/quicktime' || file.type == 'video/x-matroska';

        if (isImage) {
          var reader = new FileReader();
          this.setLoading(true);

          reader.onload = function (e) {
            _this2.$element.find('.modal--media-uploader__preview').html(_.img({
              src: e.target.result
            }));

            _this2.setLoading(false);
          };

          reader.readAsDataURL(file);
        }

        if (isVideo) {
          this.$element.find('.modal--media-uploader__preview').html(_.video({
            src: window.URL.createObjectURL(file),
            controls: 'controls'
          }));
        }

        debug.log('Previewing data of file type ' + file.type + '...', this); // Multiple files selected
      } else if (numFiles > 1) {
        this.$element.find('.media-preview').html('(Multiple files selected)'); // No files selected
      } else if (numFiles == 0) {
        this.$element.find('.media-preview').html('(No files selected)');
      }
    }
    /**
     * Event: Submit
     *
     * @param {FormData} content
     * @param {Array} files
     */

  }, {
    key: "onSubmit",
    value: function onSubmit(content, files) {
      var _this3 = this;

      if (!content || !files || files.length < 1) {
        return;
      }

      this.setLoading(true);
      var type = files[0].type;
      var apiPath = 'media/' + (this.replaceId ? 'replace/' + this.replaceId : 'new');
      var uploadedIds = []; // First upload the Media files

      return HashBrown.Helpers.RequestHelper.uploadFile(apiPath, type, content) // Then update the Media tree
      .then(function (ids) {
        uploadedIds = ids;

        if (!uploadedIds || uploadedIds.length < 1) {
          return Promise.reject(new Error('File upload failed'));
        }

        if (!_this3.folder || _this3.folder === '/') {
          return Promise.resolve();
        }

        var queue = uploadedIds.slice(0);

        var putNextMediaIntoTree = function putNextMediaIntoTree() {
          var id = queue.pop();

          if (!id) {
            return Promise.resolve();
          }

          return HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, {
            id: id,
            folder: _this3.folder
          }).then(function () {
            return putNextMediaIntoTree();
          });
        };

        return putNextMediaIntoTree();
      }) // Then reload the Media resource
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('media');
      }) // Then update the UI and trigger the success callback
      .then(function () {
        _this3.setLoading(false);

        HashBrown.Views.Navigation.NavbarMain.reload();

        if (typeof _this3.onSuccess === 'function') {
          _this3.onSuccess(uploadedIds);
        }

        _this3.close();
      }).catch(function (e) {
        UI.errorModal(e);

        _this3.setLoading(false);
      });
    }
    /**
     * Render body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this4 = this;

      return [_.div({
        class: 'modal--media-uploader__preview'
      }), new HashBrown.Views.Widgets.Input({
        type: 'file',
        name: 'media',
        useMultiple: !this.replaceId,
        onChange: function onChange(newValue) {
          _this4.onChangeFile(newValue);
        },
        onSubmit: function onSubmit(newValue, newFiles) {
          _this4.onSubmit(newValue, newFiles);
        }
      }).$element];
    }
  }]);

  return MediaUploader;
}(HashBrown.Views.Modals.Modal);

module.exports = MediaUploader;

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A dialog for editing publishing settings for Content nodes
 *
 * @memberof HashBrown.Client.Views.Modals
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PublishingSettingsModal =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(PublishingSettingsModal, _HashBrown$Views$Moda);

  /**
   * Constructor
   */
  function PublishingSettingsModal(params) {
    var _this;

    _classCallCheck(this, PublishingSettingsModal);

    params.title = 'Publishing settings for "' + params.model.prop('title', window.language) + '"';
    params.actions = [{
      label: 'OK',
      onClick: function onClick() {
        _this.trigger('change', _this.value);
      }
    }];
    params.value = JSON.parse(JSON.stringify(params.model.getSettings('publishing'))) || {};
    return _this = _possibleConstructorReturn(this, _getPrototypeOf(PublishingSettingsModal).call(this, params));
  }
  /**
   * Renders the body
   *
   * @returns {HTMLElement} Body
   */


  _createClass(PublishingSettingsModal, [{
    key: "renderBody",
    value: function renderBody() {
      var _this2 = this;

      if (this.value.governedBy) {
        var governor = HashBrown.Helpers.ContentHelper.getContentByIdSync(this.value.governedBy);
        return _.div({
          class: 'widget widget--label'
        }, '(Settings inherited from <a href="#/content/' + governor.id + '">' + governor.prop('title', window.language) + '</a>)');
      } else {
        return _.div({
          class: 'settings-publishing'
        }, // Apply to children switch
        _.div({
          class: 'widget-group'
        }, _.label({
          class: 'widget widget--label'
        }, 'Apply to children'), new HashBrown.Views.Widgets.Input({
          type: 'checkbox',
          value: this.value.applyToChildren === true,
          onChange: function onChange(newValue) {
            _this2.value.applyToChildren = newValue;
          }
        }).$element), // Connection picker
        _.div({
          class: 'widget-group'
        }, _.label({
          class: 'widget widget--label'
        }, 'Connection'), new HashBrown.Views.Widgets.Dropdown({
          options: resources.connections,
          value: this.value.connectionId,
          valueKey: 'id',
          labelKey: 'title',
          useClearButton: true,
          onChange: function onChange(newValue) {
            _this2.value.connectionId = newValue;
          }
        }).$element));
      }
    }
  }]);

  return PublishingSettingsModal;
}(HashBrown.Views.Modals.Modal);

module.exports = PublishingSettingsModal;

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Editors
 */

namespace('Views.Editors').add(__webpack_require__(244)).add(__webpack_require__(245)).add(__webpack_require__(246)).add(__webpack_require__(247)).add(__webpack_require__(252)).add(__webpack_require__(253)).add(__webpack_require__(254)).add(__webpack_require__(255)).add(__webpack_require__(256));
namespace('Views.Editors.DeployerEditors');
namespace('Views.Editors.ProcessorEditors');

__webpack_require__(257);

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for Connections
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConnectionEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(ConnectionEditor, _Crisp$View);

  function ConnectionEditor(params) {
    var _this;

    _classCallCheck(this, ConnectionEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConnectionEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click advanced. Routes to the JSON editor
   */


  _createClass(ConnectionEditor, [{
    key: "onClickAdvanced",
    value: function onClickAdvanced() {
      location.hash = '/connections/json/' + this.model.id;
    }
    /**
     * Event: Click save. Posts the model to the modelUrl
     */

  }, {
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      this.$saveBtn.toggleClass('saving', true);
      HashBrown.Helpers.RequestHelper.request('post', 'connections/' + this.model.id, this.model).then(function () {
        _this2.$saveBtn.toggleClass('saving', false);

        location.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Renders the Media provider editor
     */

  }, {
    key: "renderMediaProviderEditor",
    value: function renderMediaProviderEditor() {
      var _this3 = this;

      var input = new HashBrown.Views.Widgets.Input({
        value: false,
        type: 'checkbox',
        onChange: function onChange(isProvider) {
          HashBrown.Helpers.ConnectionHelper.setMediaProvider(isProvider ? _this3.model.id : null).catch(UI.errorModal);
        }
      }); // Set the value

      input.$element.toggleClass('working', true);
      HashBrown.Helpers.ConnectionHelper.getMediaProvider().then(function (connection) {
        if (connection && connection.id === _this3.model.id) {
          input.value = true;
          input.fetch();
        }

        input.$element.toggleClass('working', false);
      });
      return input.$element;
    }
    /**
     * Renders the title editor
     */

  }, {
    key: "renderTitleEditor",
    value: function renderTitleEditor() {
      var _this4 = this;

      return new HashBrown.Views.Widgets.Input({
        value: this.model.title,
        onChange: function onChange(newValue) {
          _this4.model.title = newValue;
        }
      }).$element;
    }
    /**
     * Renders the URL editor
     */

  }, {
    key: "renderUrlEditor",
    value: function renderUrlEditor() {
      var _this5 = this;

      return new HashBrown.Views.Widgets.Input({
        value: this.model.url,
        onChange: function onChange(newValue) {
          _this5.model.url = newValue;
        }
      }).$element;
    }
    /**
     * Renders the processing settings editor
     */

  }, {
    key: "renderProcessorSettingsEditor",
    value: function renderProcessorSettingsEditor() {
      var _this6 = this;

      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Type'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: this.model.processor.alias,
        optionsUrl: 'connections/processors',
        valueKey: 'alias',
        labelKey: 'name',
        placeholder: 'Type',
        onChange: function onChange(newValue) {
          _this6.model.processor.alias = newValue;

          _this6.fetch();
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, _.div({
        class: 'editor__field__key__label'
      }, 'File extension'), _.div({
        class: 'editor__field__key__description'
      }, 'A file extension such as .json or .xml')), _.each(HashBrown.Views.Editors.ProcessorEditors, function (name, editor) {
        if (editor.alias !== _this6.model.processor.alias) {
          return;
        }

        return new editor({
          model: _this6.model.processor
        }).$element;
      }), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        value: this.model.processor.fileExtension,
        onChange: function onChange(newValue) {
          _this6.model.processor.fileExtension = newValue;
        }
      })))];
    }
    /**
     * Renders the deployment settings editor
     */

  }, {
    key: "renderDeployerSettingsEditor",
    value: function renderDeployerSettingsEditor() {
      var _this7 = this;

      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Type'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: this.model.deployer.alias,
        optionsUrl: 'connections/deployers',
        valueKey: 'alias',
        labelKey: 'name',
        placeholder: 'Type',
        onChange: function onChange(newValue) {
          _this7.model.deployer.alias = newValue;

          _this7.fetch();
        }
      }).$element)), _.each(HashBrown.Views.Editors.DeployerEditors, function (name, editor) {
        if (editor.alias !== _this7.model.deployer.alias) {
          return;
        }

        return new editor({
          model: _this7.model.deployer
        }).$element;
      }), _.do(function () {
        if (!_this7.model.deployer || !_this7.model.deployer.paths) {
          return;
        }

        return _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, 'Paths'), _.div({
          class: 'editor__field__key__description'
        }, 'Where to send the individual resources')), _.div({
          class: 'editor__field__value'
        }, _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Content'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          value: _this7.model.deployer.paths.content,
          onChange: function onChange(newValue) {
            _this7.model.deployer.paths.content = newValue;
          }
        }))), _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Media'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          value: _this7.model.deployer.paths.media,
          onChange: function onChange(newValue) {
            _this7.model.deployer.paths.media = newValue;
          }
        })))));
      })];
    }
    /**
     * Prerender
     */

  }, {
    key: "prerender",
    value: function prerender() {
      if (this.model instanceof HashBrown.Models.Connection === false) {
        this.model = new HashBrown.Models.Connection(this.model);
      }
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this8 = this;

      return _.div({
        class: 'editor editor--connection' + (this.model.isLocked ? ' locked' : '')
      }, _.div({
        class: 'editor__header'
      }, _.span({
        class: 'editor__header__icon fa fa-exchange'
      }), _.h4({
        class: 'editor__header__title'
      }, this.model.title)), _.div({
        class: 'editor__body'
      }, _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Is Media provider'), _.div({
        class: 'editor__field__value'
      }, this.renderMediaProviderEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Title'), _.div({
        class: 'editor__field__value'
      }, this.renderTitleEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'URL'), _.div({
        class: 'editor__field__value'
      }, this.renderUrlEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, _.div({
        class: 'editor__field__key__label'
      }, 'Processor'), _.div({
        class: 'editor__field__key__description'
      }, 'Which format to deploy Content in')), _.div({
        class: 'editor__field__value'
      }, this.renderProcessorSettingsEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, _.div({
        class: 'editor__field__key__label'
      }, 'Deployer'), _.div({
        class: 'editor__field__key__description'
      }, 'How to transfer data to and from the website\'s server')), _.div({
        class: 'editor__field__value'
      }, this.renderDeployerSettingsEditor()))), _.div({
        class: 'editor__footer'
      }, _.div({
        class: 'editor__footer__buttons'
      }, _.button({
        class: 'widget widget--button embedded'
      }, 'Advanced').click(function () {
        _this8.onClickAdvanced();
      }), _.if(!this.model.isLocked, this.$saveBtn = _.button({
        class: 'widget widget--button editor__footer__buttons__save'
      }, _.span({
        class: 'widget--button__text-default'
      }, 'Save '), _.span({
        class: 'widget--button__text-working'
      }, 'Saving ')).click(function () {
        _this8.onClickSave();
      })))));
    }
  }]);

  return ConnectionEditor;
}(Crisp.View);

module.exports = ConnectionEditor;

/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor view for Content objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ContentEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(ContentEditor, _Crisp$View);

  function ContentEditor(params) {
    var _this;

    _classCallCheck(this, ContentEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentEditor).call(this, params));
    _this.dirty = false;

    _this.fetch();

    return _this;
  }
  /**
   * Event: Scroll
   */


  _createClass(ContentEditor, [{
    key: "onScroll",
    value: function onScroll(e) {
      var followingField; // Look for field labels that are close to the top of the viewport and make them follow

      this.$element.find('.editor__body__tab.active > .editor__field > .editor__field__key').each(function (i, field) {
        field.classList.remove('following');
        var rect = field.getBoundingClientRect();
        var actions = field.querySelector('.editor__field__key__actions');
        var actionRect;

        if (actions) {
          actionRect = actions.getBoundingClientRect();
        }

        if (rect.top <= 40 && actionRect && rect.bottom >= actionRect.height + 60 && (!followingField || followingField.getBoundingClientRect().top < rect.top)) {
          followingField = field;
        }
      });

      if (followingField) {
        followingField.classList.add('following');
      } // Cache the last scroll position


      this.lastScrollPos = this.$element.find('.editor__body')[0].scrollTop;
    }
    /**
     * Event: Click advanced. Routes to the JSON editor
     */

  }, {
    key: "onClickAdvanced",
    value: function onClickAdvanced() {
      location.hash = '/content/json/' + this.model.id;
    }
    /**
     * Event: Click save. Posts the model to the modelUrl
     */

  }, {
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      var saveAction = this.$element.find('.editor__footer__buttons select').val();
      var postSaveUrl;

      var setContent = function setContent() {
        // Use publishing API
        if (_this2.model.getSettings('publishing').connectionId) {
          // Unpublish
          if (saveAction === 'unpublish') {
            return HashBrown.Helpers.RequestHelper.request('post', 'content/unpublish', _this2.model); // Publish
          } else if (saveAction === 'publish') {
            return HashBrown.Helpers.RequestHelper.request('post', 'content/publish', _this2.model); // Preview
          } else if (saveAction === 'preview') {
            return HashBrown.Helpers.RequestHelper.request('post', 'content/preview', _this2.model);
          }
        } // Just save normally


        return HashBrown.Helpers.RequestHelper.request('post', 'content/' + _this2.model.id, _this2.model);
      };

      this.$saveBtn.toggleClass('working', true); // Save content to database

      setContent().then(function (url) {
        postSaveUrl = url;
        return HashBrown.Helpers.RequestHelper.reloadResource('content');
      }).then(function () {
        _this2.$saveBtn.toggleClass('working', false);

        _this2.reload();

        HashBrown.Views.Navigation.NavbarMain.reload();
        _this2.dirty = false;

        if (saveAction === 'preview') {
          UI.iframeModal('Preview', postSaveUrl);
        }
      }).catch(function (e) {
        _this2.$saveBtn.toggleClass('working', false);

        UI.errorModal(e);
      });
    }
    /**
     * Reload this view
     */

  }, {
    key: "reload",
    value: function reload() {
      this.lastScrollPos = this.$element.find('.editor__body')[0].scrollTop;
      this.model = null;
      this.fetch();
    }
    /**
     * Binds event to fire when field editors are ready
     * Or fires them if no callback was passed
     *
     * @param {Function} callback
     */

  }, {
    key: "onFieldEditorsReady",
    value: function onFieldEditorsReady(callback) {
      if (!this.fieldEditorReadyCallbacks) {
        this.fieldEditorReadyCallbacks = [];
      }

      if (callback) {
        this.fieldEditorReadyCallbacks.push(callback);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.fieldEditorReadyCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var registeredCallback = _step.value;
            registeredCallback();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.fieldEditorReadyCallbacks = [];
      }

      this.restoreScrollPos();
    }
    /**
     * Restores the scroll position
     *
     * @param {Number} delay
     */

  }, {
    key: "restoreScrollPos",
    value: function restoreScrollPos(delay) {
      var _this3 = this;

      var newScrollPos = this.lastScrollPos || 0;
      setTimeout(function () {
        _this3.$element.find('.editor__body')[0].scrollTop = newScrollPos;
      }, delay || 0);
    }
    /**
     * Static version of the restore scroll position method
     *
     * @param {Number} delay
     */

  }, {
    key: "renderField",

    /**
     * Renders a field view
     *
     * @param {Object} fieldValue The field value to inject into the field editor
     * @param {FieldSchema} fieldDefinition The field definition
     * @param {Function} onChange The change event
     * @param {HTMLElement} keyActions The key content container
     *
     * @return {Object} element
     */
    value: function renderField(fieldValue, fieldDefinition, onChange, $keyActions) {
      var _this4 = this;

      var compiledSchema = HashBrown.Helpers.SchemaHelper.getFieldSchemaWithParentConfigs(fieldDefinition.schemaId);

      if (!compiledSchema) {
        return debug.log('No FieldSchema found for Schema id "' + fieldDefinition.schemaId + '"', this);
      }

      var fieldEditor = ContentEditor.getFieldEditor(compiledSchema.editorId);

      if (!fieldEditor) {
        return debug.log('No field editor by id "' + fieldSchema.editorId + '" found', this);
      } // Get the config


      var config; // If the field has a config, check recursively if it's empty
      // If it isn't, use this config

      if (fieldDefinition.config) {
        var isEmpty = true;

        var checkRecursive = function checkRecursive(object) {
          if (!object) {
            return;
          } // We consider a config not empty, if it has a value that is not an object
          // Remember, null is of type 'object' too


          if (_typeof(object) !== 'object') {
            return isEmpty = false;
          }

          for (var k in object) {
            checkRecursive(object[k]);
          }
        };

        checkRecursive(fieldDefinition.config);

        if (!isEmpty) {
          config = fieldDefinition.config;
        }
      } // If no config was found, and the Schema has one, use it


      if (!config && compiledSchema.config) {
        config = compiledSchema.config;
      } // If still no config was found, assign a placeholder


      if (!config) {
        config = {};
      } // Instantiate the field editor


      var fieldEditorInstance = new fieldEditor({
        value: fieldValue,
        disabled: fieldDefinition.disabled || false,
        config: config,
        description: fieldDefinition.description || '',
        schema: compiledSchema.getObject(),
        multilingual: fieldDefinition.multilingual === true,
        $keyActions: $keyActions
      });
      fieldEditorInstance.on('change', function (newValue) {
        if (_this4.model.isLocked) {
          return;
        }

        _this4.dirty = true;
        onChange(newValue);
      });
      fieldEditorInstance.on('silentchange', function (newValue) {
        if (_this4.model.isLocked) {
          return;
        }

        onChange(newValue);
      });
      return fieldEditorInstance.$element;
    }
    /**
     * Renders fields
     *
     * @param {String} tabId The tab for which to render the fields
     * @param {Object} fieldDefinitions The set of field definitions to render
     * @param {Object} fieldValues The set of field values to inject into the field editor
     *
     * @returns {Array} A list of HTMLElements to render
     */

  }, {
    key: "renderFields",
    value: function renderFields(tabId, fieldDefinitions, fieldValues) {
      var _this5 = this;

      var tabFieldDefinitions = {}; // Map out field definitions to render
      // This is necessary because we're only rendering the fields for the specified tab

      for (var key in fieldDefinitions) {
        var fieldDefinition = fieldDefinitions[key];
        var noTabAssigned = !this.schema.tabs[fieldDefinition.tabId];
        var isMetaTab = tabId === 'meta';
        var thisTabAssigned = fieldDefinition.tabId === tabId; // Don't include "properties" field, if this is the meta tab

        if (isMetaTab && key === 'properties') {
          continue;
        }

        if (noTabAssigned && isMetaTab || thisTabAssigned) {
          tabFieldDefinitions[key] = fieldDefinition;
        }
      } // Render all fields


      return _.each(tabFieldDefinitions, function (key, fieldDefinition) {
        // Field value sanity check
        fieldValues[key] = HashBrown.Helpers.ContentHelper.fieldSanityCheck(fieldValues[key], fieldDefinition); // Render the field actions container

        var $keyActions;
        return _.div({
          class: 'editor__field',
          'data-key': key
        }, // Render the label and icon
        _.div({
          class: 'editor__field__key',
          title: fieldDefinition.description || ''
        }, _.div({
          class: 'editor__field__key__label'
        }, fieldDefinition.label || key), _.if(fieldDefinition.description, _.div({
          class: 'editor__field__key__description'
        }, fieldDefinition.description)), $keyActions = _.div({
          class: 'editor__field__key__actions'
        })), // Render the field editor
        _this5.renderField( // If the field definition is set to multilingual, pass value from object
        fieldDefinition.multilingual ? fieldValues[key][window.language] : fieldValues[key], // Pass the field definition
        fieldDefinition, // On change function
        function (newValue) {
          // If field definition is set to multilingual, assign flag and value onto object...
          if (fieldDefinition.multilingual) {
            fieldValues[key]._multilingual = true;
            fieldValues[key][window.language] = newValue; // ...if not, assign the value directly
          } else {
            fieldValues[key] = newValue;
          }
        }, // Pass the key actions container, so the field editor can populate it
        $keyActions));
      });
    }
    /**
     * Event: Click tab
     *
     * @param {String} tab
     */

  }, {
    key: "onClickTab",
    value: function onClickTab(tab) {}
    /**
     * Renders the editor
     *
     * @param {Content} content
     * @param {ContentSchema} schema
     *
     * @return {Object} element
     */

  }, {
    key: "renderEditor",
    value: function renderEditor(content, schema) {
      var _this6 = this;

      var activeTab = Crisp.Router.params.tab || schema.defaultTabId || 'meta'; // Render editor

      return [_.div({
        class: 'editor__header'
      }, _.each(schema.tabs, function (tabId, tabName) {
        return _.button({
          class: 'editor__header__tab' + (tabId === activeTab ? ' active' : '')
        }, tabName).click(function () {
          location.hash = '/content/' + Crisp.Router.params.id + '/' + tabId;

          _this6.fetch();
        });
      }), _.button({
        'data-id': 'meta',
        class: 'editor__header__tab' + ('meta' === activeTab ? ' active' : '')
      }, 'Meta').click(function () {
        location.hash = '/content/' + Crisp.Router.params.id + '/meta';

        _this6.fetch();
      })), _.div({
        class: 'editor__body'
      }, // Render content properties
      _.each(schema.tabs, function (tabId, tabName) {
        if (tabId !== activeTab) {
          return;
        }

        return _.div({
          class: 'editor__body__tab active'
        }, _this6.renderFields(tabId, schema.fields.properties, content.properties));
      }), // Render meta properties
      _.if(activeTab === 'meta', _.div({
        class: 'editor__body__tab' + ('meta' === activeTab ? 'active' : ''),
        'data-id': 'meta'
      }, this.renderFields('meta', schema.fields, content), this.renderFields('meta', schema.fields.properties, content.properties)))).on('scroll', function (e) {
        _this6.onScroll(e);
      }), _.div({
        class: 'editor__footer'
      })];
    }
    /**
     * Renders the action buttons
     */

  }, {
    key: "renderButtons",
    value: function renderButtons() {
      var _this7 = this;

      var remoteUrl;
      var connectionId = this.model.getSettings('publishing').connectionId;
      var connection; // Construct the remote URL, if a Connection is set up for publishing

      var contentUrl = this.model.properties.url;

      if (connectionId) {
        connection = HashBrown.Helpers.ConnectionHelper.getConnectionByIdSync(connectionId);

        if (connection && connection.url && contentUrl) {
          // Language versioning
          if (contentUrl instanceof Object) {
            contentUrl = contentUrl[window.language];
          } // Construct remote URL


          if (contentUrl && contentUrl !== '//') {
            remoteUrl = connection.url + contentUrl;
            remoteUrl = remoteUrl.replace(/\/\//g, '/').replace(':/', '://');
          } else {
            contentUrl = null;
          }
        }
      }

      _.append($('.editor__footer').empty(), _.div({
        class: 'editor__footer__message'
      }, _.do(function () {
        if (!connection) {
          return 'No Connection is assigned for publishing';
        }

        if (connection && !connection.url) {
          return 'No remote URL is defined in the <a href="#/connections/' + connection.id + '">"' + connection.title + '"</a> Connection';
        }

        if (connection && connection.url && !contentUrl) {
          return 'Content without a URL may not be visible after publishing';
        }
      })), _.div({
        class: 'editor__footer__buttons'
      }, // JSON editor
      _.button({
        class: 'widget widget--button condensed embedded'
      }, 'Advanced').click(function () {
        _this7.onClickAdvanced();
      }), // View remote
      _.if(this.model.isPublished && remoteUrl, _.a({
        target: '_blank',
        href: remoteUrl,
        class: 'widget widget--button condensed embedded'
      }, 'View')), _.if(!this.model.isLocked, // Save & publish
      _.div({
        class: 'widget widget-group'
      }, this.$saveBtn = _.button({
        class: 'widget widget--button'
      }, _.span({
        class: 'widget--button__text-default'
      }, 'Save'), _.span({
        class: 'widget--button__text-working'
      }, 'Saving')).click(function () {
        _this7.onClickSave();
      }), _.if(connection, _.span({
        class: 'widget widget--button widget-group__separator'
      }, '&'), _.select({
        class: 'widget widget--select'
      }, _.option({
        value: 'publish'
      }, 'Publish'), _.option({
        value: 'preview'
      }, 'Preview'), _.if(this.model.isPublished, _.option({
        value: 'unpublish'
      }, 'Unpublish')), _.option({
        value: ''
      }, '(No action)')).val('publish'))))));
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      // Make sure the model data is using the Content model
      if (this.model instanceof HashBrown.Models.Content === false) {
        this.model = new HashBrown.Models.Content(this.model);
      }
    }
    /**
     * Render this editor
     */

  }, {
    key: "template",
    value: function template() {
      return _.div({
        class: 'editor editor--content' + (this.model.isLocked ? ' locked' : '')
      });
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      var _this8 = this;

      // Fetch information
      var contentSchema;
      return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(this.model.schemaId).then(function (schema) {
        contentSchema = schema;
        _this8.schema = contentSchema;

        _this8.$element.html(_this8.renderEditor(_this8.model, contentSchema));

        _this8.renderButtons();

        _this8.onFieldEditorsReady();
      }).catch(function (e) {
        UI.errorModal(e, function () {
          location.hash = '/content/json/' + _this8.model.id;
        });
      });
    }
  }], [{
    key: "restoreScrollPos",
    value: function restoreScrollPos(delay) {
      var editor = Crisp.View.get('ContentEditor');

      if (editor) {
        editor.restoreScrollPos(delay);
      }
    }
    /**
     * Gets a field editor for a Schema
     *
     * @param {string} editorId
     *
     * @returns {View} Field editor
     */

  }, {
    key: "getFieldEditor",
    value: function getFieldEditor(editorId) {
      if (!editorId) {
        return;
      } // Backwards compatible check


      editorId = editorId.charAt(0).toUpperCase() + editorId.slice(1);

      if (editorId.indexOf('Editor') < 0) {
        editorId += 'Editor';
      }

      return HashBrown.Views.Editors.FieldEditors[editorId];
    }
  }]);

  return ContentEditor;
}(Crisp.View);

module.exports = ContentEditor;

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for Forms
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FormEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(FormEditor, _Crisp$View);

  function FormEditor(params) {
    var _this;

    _classCallCheck(this, FormEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click advanced. Routes to the JSON editor
   */


  _createClass(FormEditor, [{
    key: "onClickAdvanced",
    value: function onClickAdvanced() {
      location.hash = location.hash.replace('/forms/', '/forms/json/');
    }
    /**
     * Event: Click save. Posts the model to the modelUrl
     */

  }, {
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      this.$saveBtn.toggleClass('working', true);
      HashBrown.Helpers.RequestHelper.request('post', 'forms/' + this.model.id, this.model).then(function () {
        debug.log('Saved form "' + _this2.model.id + '"', _this2);

        _this2.$saveBtn.toggleClass('working', false);

        return HashBrown.Helpers.RequestHelper.reloadResource('forms');
      }).then(function () {
        var navbar = Crisp.View.get('NavbarMain');
        navbar.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click add input
     */

  }, {
    key: "onClickAddInput",
    value: function onClickAddInput() {
      if (!this.model.inputs['newinput']) {
        this.model.inputs['newinput'] = {
          type: 'text'
        };
      }

      this.fetch();
    }
    /**
     * Event: Click remove input
     *
     * @param {String} key
     */

  }, {
    key: "onClickRemoveInput",
    value: function onClickRemoveInput(key) {
      delete this.model.inputs[key];
      this.fetch();
    }
    /**
     * Renders the allowed origin editor
     *
     * @return {Object} element
     */

  }, {
    key: "renderAllowedOriginEditor",
    value: function renderAllowedOriginEditor() {
      var _this3 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        value: this.model.allowedOrigin,
        tooltip: 'The allowed origin from which entries to this form can be posted',
        onChange: function onChange(newOrigin) {
          _this3.model.allowedOrigin = newOrigin;
        }
      }).$element);
    }
    /**
     * Renders the title editor
     *
     * @return {Object} element
     */

  }, {
    key: "renderTitleEditor",
    value: function renderTitleEditor() {
      var _this4 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        value: this.model.title,
        tooltip: 'The title of the form',
        onChange: function onChange(newTitle) {
          _this4.model.title = newTitle;
        }
      }).$element);
    }
    /**
     * Renders the redirect editor
     *
     * @return {Object} element
     */

  }, {
    key: "renderRedirectEditor",
    value: function renderRedirectEditor() {
      var _this5 = this;

      return _.div({
        class: 'editor__field__value'
      }, _.div({
        class: 'widget-group'
      }, new HashBrown.Views.Widgets.Input({
        value: this.model.redirect,
        tooltip: 'The URL that the user will be redirected to after submitting the form entry',
        onChange: function onChange(newUrl) {
          _this5.model.redirect = newUrl;
        }
      }).$element, new HashBrown.Views.Widgets.Input({
        value: this.model.appendRedirect,
        placeholder: 'Append',
        type: 'checkbox',
        tooltip: 'If ticked, the redirect URL will be appended to that of the origin',
        onChange: function onChange(newValue) {
          _this5.model.appendRedirect = newValue;
        }
      }).$element));
    }
    /**
     * Renders the inputs editor
     *
     * @return {Object} element
     */

  }, {
    key: "renderInputsEditor",
    value: function renderInputsEditor() {
      var _this6 = this;

      var types = ['checkbox', 'hidden', 'number', 'select', 'text'];
      return _.div({
        class: 'editor__field__value segmented'
      }, _.each(this.model.inputs, function (key, input) {
        return _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__actions'
        }, _.button({
          class: 'editor__field__action editor__field__action--remove',
          title: 'Remove field'
        }).click(function () {
          view.onClickRemoveInput(key);
        })), _.div({
          class: 'editor__field__value'
        }, _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Name'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          value: key,
          onChange: function onChange(newValue) {
            delete _this6.model.inputs[key];
            key = newValue;
            _this6.model.inputs[key] = input;
          }
        }).$element)), _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Type'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Dropdown({
          value: input.type,
          options: types,
          onChange: function onChange(newValue) {
            input.type = newValue;

            _this6.fetch();
          }
        }).$element)), _.if(input.type == 'select', _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Select options'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Chips({
          value: input.options || [],
          onChange: function onChange(newValue) {
            input.options = newValue;

            _this6.renderPreview();
          }
        }).$element))), _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Required'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          type: 'checkbox',
          value: input.required === true,
          onChange: function onChange(newValue) {
            input.required = newValue;
          }
        }).$element)), _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Check duplicates'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          type: 'checkbox',
          value: input.checkDuplicates === true,
          onChange: function onChange(newValue) {
            input.checkDuplicates = newValue;
          }
        }).$element)), _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Pattern'), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Input({
          value: input.pattern,
          onChange: function onChange(newValue) {
            input.pattern = newValue;
          }
        }).$element))));
      }), _.button({
        class: 'widget widget--button round editor__field__add fa fa-plus',
        title: 'Add an input'
      }).on('click', function () {
        _this6.onClickAddInput();
      }));
    }
    /**
     * Renders a preview
     *
     * @return {Object} element
     */

  }, {
    key: "renderPreview",
    value: function renderPreview() {
      var $preview = this.$element.find('.editor--form__preview');

      _.append($preview.empty(), _.each(this.model.inputs, function (key, input) {
        if (input.type === 'select') {
          return new HashBrown.Views.Widgets.Dropdown({
            options: input.options || []
          }).$element;
        } else {
          return _.input({
            class: 'widget widget--input ' + (input.type || 'text'),
            placeholder: key,
            type: input.type,
            name: key,
            pattern: input.pattern,
            required: input.required === true
          });
        }
      }));
    }
    /**
     * Renders all entries
     *
     * @return {Object} element
     */

  }, {
    key: "renderEntries",
    value: function renderEntries() {
      var _this7 = this;

      return _.div({
        class: 'editor__field__value'
      }, _.div({
        class: 'widget-group'
      }, _.button({
        class: 'widget widget--button low warning'
      }, 'Clear').click(function () {
        UI.confirmModal('Clear', 'Clear "' + _this7.model.title + '"', 'Are you sure you want to clear all entries?', function () {
          HashBrown.Helpers.RequestHelper.request('post', 'forms/clear/' + _this7.model.id).then(function () {
            _this7.model.entries = [];
          }).catch(UI.errorModal);
        });
      }), _.button({
        class: 'widget widget--button low'
      }, 'Get .csv').click(function () {
        location = HashBrown.Helpers.RequestHelper.environmentUrl('forms/' + _this7.model.id + '/entries');
      })));
    }
    /**
     * Renders a single field
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderField",
    value: function renderField(label, $content, className) {
      return _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, label), $content);
    }
    /**
     * Renders all fields
     *
     * @return {Object} element
     */

  }, {
    key: "renderFields",
    value: function renderFields() {
      var $element = _.div({
        class: 'editor__body'
      });

      var postUrl = location.protocol + '//' + location.hostname + '/api/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/forms/' + this.model.id + '/submit';
      return _.div({
        class: 'editor__body'
      }, _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Entries (' + this.model.entries.length + ')'), _.div({
        class: 'editor__field__value'
      }, this.renderEntries())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'POST URL'), _.div({
        class: 'editor__field__value'
      }, _.div({
        class: 'widget-group'
      }, _.input({
        readonly: 'readonly',
        class: 'widget widget--input text',
        type: 'text',
        value: postUrl
      }), _.button({
        class: 'widget widget--button small fa fa-copy',
        title: 'Copy POST URL'
      }).click(function (e) {
        copyToClipboard(e.currentTarget.previousElementSibling.value);
      })))), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Title'), _.div({
        class: 'editor__field__value'
      }, this.renderTitleEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Allowed origin'), _.div({
        class: 'editor__field__value'
      }, this.renderAllowedOriginEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Redirect URL'), _.div({
        class: 'editor__field__value'
      }, this.renderRedirectEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Inputs'), _.div({
        class: 'editor__field__value'
      }, this.renderInputsEditor())), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Preview'), _.div({
        class: 'editor__field__value'
      }, _.div({
        class: 'editor--form__preview'
      }))));
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      this.renderPreview();
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this8 = this;

      return _.div({
        class: 'editor editor--form' + (this.model.isLocked ? ' locked' : '')
      }, _.div({
        class: 'editor__header'
      }, _.span({
        class: 'editor__header__icon fa fa-wpforms'
      }), _.h4({
        class: 'editor__header__title'
      }, this.model.title)), this.renderFields(), _.div({
        class: 'editor__footer'
      }, _.div({
        class: 'editor__footer__buttons'
      }, _.button({
        class: 'widget widget--button embedded'
      }, 'Advanced').click(function () {
        _this8.onClickAdvanced();
      }), _.if(!this.model.isLocked, this.$saveBtn = _.button({
        class: 'widget widget--button'
      }, _.span({
        class: 'widget--button__text-default'
      }, 'Save '), _.span({
        class: 'widget--button__text-working'
      }, 'Saving ')).click(function () {
        _this8.onClickSave();
      })))));
    }
  }]);

  return FormEditor;
}(Crisp.View);

module.exports = FormEditor;

/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var beautify = __webpack_require__(248).js_beautify;
/**
 * A basic JSON editor for any object
 *
 * @memberof HashBrown.Client.Views.Editors
 */


var JSONEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(JSONEditor, _Crisp$View);

  function JSONEditor(params) {
    var _this;

    _classCallCheck(this, JSONEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(JSONEditor).call(this, params));
    _this.$error = _.div({
      class: 'editor__footer__error'
    }, _.div({
      class: 'editor__footer__error__heading'
    }), _.div({
      class: 'editor__footer__error__body'
    })).hide();

    if (!_this.model && !_this.modelUrl) {
      _this.modelUrl = HashBrown.Helpers.RequestHelper.environmentUrl(_this.apiPath);
    }

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click basic. Returns to the regular editor
   */


  _createClass(JSONEditor, [{
    key: "onClickBasic",
    value: function onClickBasic() {
      var url = $('.navbar-main__pane__item.active > a').attr('href');

      if (url) {
        location = url;
      } else {
        debug.log('Invalid url "' + url + '"', this);
      }
    }
    /**
     * Event: Click save. Posts the model to the apiPath
     */

  }, {
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      var view = this;
      this.$saveBtn.toggleClass('working', true);

      if (this.debug()) {
        HashBrown.Helpers.RequestHelper.request('post', this.apiPath, this.model).then(function () {
          _this2.$saveBtn.toggleClass('working', false);
        }).catch(UI.errorModal);
      } else {
        UI.errorModal('Unable to save', 'Please refer to the error prompt for details');
      }
    }
    /**
     * Event: Click beautify button
     */

  }, {
    key: "onClickBeautify",
    value: function onClickBeautify() {
      try {
        this.value = beautify(this.value);
        this.$element.find('textarea').val(this.value);
      } catch (e) {
        this.$error.children('.editor__footer__error__heading').html('JSON error');
        this.$error.children('.editor__footer__error__body').html(e);
        this.$error.show();
      }
    }
    /**
     * Debug the JSON string
     *
     * @param {Boolean} fromModel
     */

  }, {
    key: "debug",
    value: function debug(fromModel) {
      var _this3 = this;

      var isValid = true; // Function for checking model integrity

      var check = function check(k, v) {
        if (!v) {
          return;
        }

        switch (k) {
          case 'schemaId':
          case 'parentSchemaId':
            if (HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(v)) {
              return;
            }

            return 'Schema "' + v + '" not found';

          case 'schemaBindings':
          case 'allowedSchemas':
          case 'allowedChildSchemas':
            var invalidSchemas = v.slice(0);

            for (var r in resources.schemas) {
              var schema = resources.schemas[r];

              for (var b = invalidSchemas.length - 1; b >= 0; b--) {
                if (schema.id == invalidSchemas[b]) {
                  invalidSchemas.splice(b, 1);
                }
              }
            }

            if (invalidSchemas.length > 0) {
              if (invalidSchemas.length == 1) {
                return 'Schema "' + invalidSchemas[0] + '" not found';
              } else {
                return 'Schemas "' + invalidSchemas.join(', ') + '" not found';
              }
            }

            break;

          case 'connections':
            var invalidConnections = v.slice(0);

            for (var _r in resources.connections) {
              var connection = resources.connections[_r];

              for (var c = invalidConnections.length - 1; c >= 0; c--) {
                if (connection.id == invalidConnections[c]) {
                  invalidConnections.splice(c, 1);
                }
              }
            }

            if (invalidConnections.length > 0) {
              if (invalidConnections.length == 1) {
                return 'Connection "' + invalidConnections[0] + '" not found';
              } else {
                return 'Connections "' + invalidConnections.join(', ') + '" not found';
              }
            }

            break;
        }

        return;
      }; // Function for recursing through object


      var recurse = function recurse(obj) {
        if (obj instanceof Object) {
          for (var k in obj) {
            var v = obj[k];
            var failMessage = check(k, v);

            if (failMessage) {
              _this3.$error.children('.editor__footer__error__heading').html('Input error');

              _this3.$error.children('.editor__footer__error__body').html(failMessage);

              _this3.$error.show();

              isValid = false;
            }

            ;
            recurse(v);
          }
        }
      }; // Hide error message initially


      this.$error.hide(); // Syntax check

      try {
        if (!fromModel) {
          this.model = JSON.parse(this.value);
        } // Sanity check


        recurse(this.model);
      } catch (e) {
        this.$error.children('.editor__footer__error__heading').html('Syntax error');
        this.$error.children('.editor__footer__error__body').html(e);
        this.$error.show();
        isValid = false;
      }

      this.isValid = isValid;
      return isValid;
    }
    /**
     * Event: Change text. Make sure the value is up to date
     */

  }, {
    key: "onChangeText",
    value: function onChangeText() {
      this.value = this.editor.getDoc().getValue();

      if (this.debug()) {
        this.trigger('change', this.model);
      }
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      // Debug once before entering into the code editor
      // This allows for backward compatibility adjustments to happen first
      this.debug(true); // Convert the model to a string value

      this.value = beautify(JSON.stringify(this.model));
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this4 = this;

      return _.div({
        class: 'editor editor--json'
      }, _.div({
        class: 'editor__header'
      }, _.span({
        class: 'editor__header__icon fa fa-code'
      }), _.h4({
        class: 'editor__header__title'
      }, Crisp.Router.params.id)), _.div({
        class: 'editor__body'
      }, _.textarea()), _.div({
        class: 'editor__footer'
      }, this.$error, _.div({
        class: 'editor__footer__buttons'
      }, _.button({
        class: 'widget widget--button embedded'
      }, 'Basic').click(function () {
        _this4.onClickBasic();
      }), _.if(!this.model.isLocked, this.$saveBtn = _.button({
        class: 'widget widget--button'
      }, _.span({
        class: 'widget--button__text-default'
      }, 'Save'), _.span({
        class: 'widget--button__text-working'
      }, 'Saving')).click(function () {
        _this4.onClickSave();
      })))));
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      var _this5 = this;

      setTimeout(function () {
        _this5.editor = CodeMirror.fromTextArea(_this5.element.querySelector('textarea'), {
          lineNumbers: true,
          mode: {
            name: 'javascript',
            json: true
          },
          viewportMargin: 10,
          tabSize: 4,
          lineWrapping: false,
          indentUnit: 4,
          indentWithTabs: true,
          theme: getCookie('cmtheme') || 'default',
          value: _this5.value
        });

        _this5.editor.getDoc().setValue(_this5.value);

        _this5.editor.on('change', function () {
          _this5.onChangeText();
        });

        _this5.onChangeText();
      }, 1);
    }
  }]);

  return JSONEditor;
}(Crisp.View);

module.exports = JSONEditor;

/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/

/**
The following batches are equivalent:

var beautify_js = require('js-beautify');
var beautify_js = require('js-beautify').js;
var beautify_js = require('js-beautify').js_beautify;

var beautify_css = require('js-beautify').css;
var beautify_css = require('js-beautify').css_beautify;

var beautify_html = require('js-beautify').html;
var beautify_html = require('js-beautify').html_beautify;

All methods returned accept two arguments, the source string and an options object.
**/
function get_beautify(js_beautify, css_beautify, html_beautify) {
  // the default is js
  var beautify = function beautify(src, config) {
    return js_beautify.js_beautify(src, config);
  }; // short aliases


  beautify.js = js_beautify.js_beautify;
  beautify.css = css_beautify.css_beautify;
  beautify.html = html_beautify.html_beautify; // legacy aliases

  beautify.js_beautify = js_beautify.js_beautify;
  beautify.css_beautify = css_beautify.css_beautify;
  beautify.html_beautify = html_beautify.html_beautify;
  return beautify;
}

if (true) {
  // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(249), __webpack_require__(250), __webpack_require__(251)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (js_beautify, css_beautify, html_beautify) {
    return get_beautify(js_beautify, css_beautify, html_beautify);
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy        !jslint_happy
            ---------------------------------
            function ()         function()

            switch () {         switch() {
            case 1:               case 1:
              break;                break;
            }                   }

    space_after_anon_function (default false) - should the space before an anonymous function's parens be added, "function()" vs "function ()",
          NOTE: This option is overriden by jslint_happy (i.e. if jslint_happy is true, space_after_anon_function is true by design)

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none" | any of the former + ",preserve-inline"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
            preserve-inline will try to preserve inline blocks of curly braces

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    end_with_newline (default false)  - end output with a newline


    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/
// Object.values polyfill found here:
// http://tokenposts.blogspot.com.au/2012/04/javascript-objectkeys-browser.html
if (!Object.values) {
  Object.values = function (o) {
    if (o !== Object(o)) {
      throw new TypeError('Object.values called on a non-object');
    }

    var k = [],
        p;

    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        k.push(o[p]);
      }
    }

    return k;
  };
}

(function () {
  function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
      if (name !== targetType) {
        finalOpts[name] = allOptions[name];
      }
    } //merge in the per type settings for the targetType


    if (targetType in allOptions) {
      for (name in allOptions[targetType]) {
        finalOpts[name] = allOptions[targetType][name];
      }
    }

    return finalOpts;
  }

  function js_beautify(js_source_text, options) {
    var acorn = {};

    (function (exports) {
      /* jshint curly: false */
      // This section of code is taken from acorn.
      //
      // Acorn was written by Marijn Haverbeke and released under an MIT
      // license. The Unicode regexps (for identifiers and whitespace) were
      // taken from [Esprima](http://esprima.org) by Ariya Hidayat.
      //
      // Git repositories for Acorn are available at
      //
      //     http://marijnhaverbeke.nl/git/acorn
      //     https://github.com/marijnh/acorn.git
      // ## Character categories
      // Big ugly regular expressions that match characters in the
      // whitespace, identifier, and identifier-start categories. These
      // are only applied when a character is found to actually have a
      // code point above 128.
      var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/; // jshint ignore:line

      var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
      var nonASCIIidentifierChars = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u0620-\u0649\u0672-\u06D3\u06E7-\u06E8\u06FB-\u06FC\u0730-\u074A\u0800-\u0814\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0840-\u0857\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09D7\u09DF-\u09E0\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5F-\u0B60\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D46-\u0D48\u0D57\u0D62-\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E34-\u0E3A\u0E40-\u0E45\u0E50-\u0E59\u0EB4-\u0EB9\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F41-\u0F47\u0F71-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1029\u1040-\u1049\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u170E-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17B2\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1920-\u192B\u1930-\u193B\u1951-\u196D\u19B0-\u19C0\u19C8-\u19C9\u19D0-\u19D9\u1A00-\u1A15\u1A20-\u1A53\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1B46-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C00-\u1C22\u1C40-\u1C49\u1C5B-\u1C7D\u1CD0-\u1CD2\u1D00-\u1DBE\u1E01-\u1F15\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2D81-\u2D96\u2DE0-\u2DFF\u3021-\u3028\u3099\u309A\uA640-\uA66D\uA674-\uA67D\uA69F\uA6F0-\uA6F1\uA7F8-\uA800\uA806\uA80B\uA823-\uA827\uA880-\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8F3-\uA8F7\uA900-\uA909\uA926-\uA92D\uA930-\uA945\uA980-\uA983\uA9B3-\uA9C0\uAA00-\uAA27\uAA40-\uAA41\uAA4C-\uAA4D\uAA50-\uAA59\uAA7B\uAAE0-\uAAE9\uAAF2-\uAAF3\uABC0-\uABE1\uABEC\uABED\uABF0-\uABF9\uFB20-\uFB28\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
      var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
      var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]"); // Whether a single character denotes a newline.

      exports.newline = /[\n\r\u2028\u2029]/; // Matches a whole line break (where CRLF is considered a single
      // line break). Used to count lines.
      // in javascript, these two differ
      // in python they are the same, different methods are called on them

      exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
      exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g'); // Test whether a given character code starts an identifier.

      exports.isIdentifierStart = function (code) {
        // permit $ (36) and @ (64). @ is used in ES7 decorators.
        if (code < 65) return code === 36 || code === 64; // 65 through 91 are uppercase letters.

        if (code < 91) return true; // permit _ (95).

        if (code < 97) return code === 95; // 97 through 123 are lowercase letters.

        if (code < 123) return true;
        return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
      }; // Test whether a given character is part of an identifier.


      exports.isIdentifierChar = function (code) {
        if (code < 48) return code === 36;
        if (code < 58) return true;
        if (code < 65) return false;
        if (code < 91) return true;
        if (code < 97) return code === 95;
        if (code < 123) return true;
        return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
      };
    })(acorn);
    /* jshint curly: true */


    function in_array(what, arr) {
      for (var i = 0; i < arr.length; i += 1) {
        if (arr[i] === what) {
          return true;
        }
      }

      return false;
    }

    function trim(s) {
      return s.replace(/^\s+|\s+$/g, '');
    }

    function ltrim(s) {
      return s.replace(/^\s+/g, '');
    } // function rtrim(s) {
    //     return s.replace(/\s+$/g, '');
    // }


    function sanitizeOperatorPosition(opPosition) {
      opPosition = opPosition || OPERATOR_POSITION.before_newline;
      var validPositionValues = Object.values(OPERATOR_POSITION);

      if (!in_array(opPosition, validPositionValues)) {
        throw new Error("Invalid Option Value: The option 'operator_position' must be one of the following values\n" + validPositionValues + "\nYou passed in: '" + opPosition + "'");
      }

      return opPosition;
    }

    var OPERATOR_POSITION = {
      before_newline: 'before-newline',
      after_newline: 'after-newline',
      preserve_newline: 'preserve-newline'
    };
    var OPERATOR_POSITION_BEFORE_OR_PRESERVE = [OPERATOR_POSITION.before_newline, OPERATOR_POSITION.preserve_newline];
    var MODE = {
      BlockStatement: 'BlockStatement',
      // 'BLOCK'
      Statement: 'Statement',
      // 'STATEMENT'
      ObjectLiteral: 'ObjectLiteral',
      // 'OBJECT',
      ArrayLiteral: 'ArrayLiteral',
      //'[EXPRESSION]',
      ForInitializer: 'ForInitializer',
      //'(FOR-EXPRESSION)',
      Conditional: 'Conditional',
      //'(COND-EXPRESSION)',
      Expression: 'Expression' //'(EXPRESSION)'

    };

    function Beautifier(js_source_text, options) {
      "use strict";

      var output;
      var tokens = [],
          token_pos;
      var Tokenizer;
      var current_token;
      var last_type, last_last_text, indent_string;
      var flags, previous_flags, flag_store;
      var prefix;
      var handlers, opt;
      var baseIndentString = '';
      handlers = {
        'TK_START_EXPR': handle_start_expr,
        'TK_END_EXPR': handle_end_expr,
        'TK_START_BLOCK': handle_start_block,
        'TK_END_BLOCK': handle_end_block,
        'TK_WORD': handle_word,
        'TK_RESERVED': handle_word,
        'TK_SEMICOLON': handle_semicolon,
        'TK_STRING': handle_string,
        'TK_EQUALS': handle_equals,
        'TK_OPERATOR': handle_operator,
        'TK_COMMA': handle_comma,
        'TK_BLOCK_COMMENT': handle_block_comment,
        'TK_COMMENT': handle_comment,
        'TK_DOT': handle_dot,
        'TK_UNKNOWN': handle_unknown,
        'TK_EOF': handle_eof
      };

      function create_flags(flags_base, mode) {
        var next_indent_level = 0;

        if (flags_base) {
          next_indent_level = flags_base.indentation_level;

          if (!output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
            next_indent_level = flags_base.line_indent_level;
          }
        }

        var next_flags = {
          mode: mode,
          parent: flags_base,
          last_text: flags_base ? flags_base.last_text : '',
          // last token text
          last_word: flags_base ? flags_base.last_word : '',
          // last 'TK_WORD' passed
          declaration_statement: false,
          declaration_assignment: false,
          multiline_frame: false,
          inline_frame: false,
          if_block: false,
          else_block: false,
          do_block: false,
          do_while: false,
          import_block: false,
          in_case_statement: false,
          // switch(..){ INSIDE HERE }
          in_case: false,
          // we're on the exact line with "case 0:"
          case_body: false,
          // the indented case-action block
          indentation_level: next_indent_level,
          line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
          start_line_index: output.get_line_number(),
          ternary_depth: 0
        };
        return next_flags;
      } // Some interpreters have unexpected results with foo = baz || bar;


      options = options ? options : {}; // Allow the setting of language/file-type specific options
      // with inheritance of overall settings

      options = mergeOpts(options, 'js');
      opt = {}; // compatibility, re

      if (options.brace_style === "expand-strict") {
        //graceful handling of deprecated option
        options.brace_style = "expand";
      } else if (options.brace_style === "collapse-preserve-inline") {
        //graceful handling of deprecated option
        options.brace_style = "collapse,preserve-inline";
      } else if (options.braces_on_own_line !== undefined) {
        //graceful handling of deprecated option
        options.brace_style = options.braces_on_own_line ? "expand" : "collapse";
      } else if (!options.brace_style) //Nothing exists to set it
        {
          options.brace_style = "collapse";
        }

      var brace_style_split = options.brace_style.split(/[^a-zA-Z0-9_\-]+/);
      opt.brace_style = brace_style_split[0];
      opt.brace_preserve_inline = brace_style_split[1] ? brace_style_split[1] : false;
      opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
      opt.indent_char = options.indent_char ? options.indent_char : ' ';
      opt.eol = options.eol ? options.eol : 'auto';
      opt.preserve_newlines = options.preserve_newlines === undefined ? true : options.preserve_newlines;
      opt.break_chained_methods = options.break_chained_methods === undefined ? false : options.break_chained_methods;
      opt.max_preserve_newlines = options.max_preserve_newlines === undefined ? 0 : parseInt(options.max_preserve_newlines, 10);
      opt.space_in_paren = options.space_in_paren === undefined ? false : options.space_in_paren;
      opt.space_in_empty_paren = options.space_in_empty_paren === undefined ? false : options.space_in_empty_paren;
      opt.jslint_happy = options.jslint_happy === undefined ? false : options.jslint_happy;
      opt.space_after_anon_function = options.space_after_anon_function === undefined ? false : options.space_after_anon_function;
      opt.keep_array_indentation = options.keep_array_indentation === undefined ? false : options.keep_array_indentation;
      opt.space_before_conditional = options.space_before_conditional === undefined ? true : options.space_before_conditional;
      opt.unescape_strings = options.unescape_strings === undefined ? false : options.unescape_strings;
      opt.wrap_line_length = options.wrap_line_length === undefined ? 0 : parseInt(options.wrap_line_length, 10);
      opt.e4x = options.e4x === undefined ? false : options.e4x;
      opt.end_with_newline = options.end_with_newline === undefined ? false : options.end_with_newline;
      opt.comma_first = options.comma_first === undefined ? false : options.comma_first;
      opt.operator_position = sanitizeOperatorPosition(options.operator_position); // For testing of beautify ignore:start directive

      opt.test_output_raw = options.test_output_raw === undefined ? false : options.test_output_raw; // force opt.space_after_anon_function to true if opt.jslint_happy

      if (opt.jslint_happy) {
        opt.space_after_anon_function = true;
      }

      if (options.indent_with_tabs) {
        opt.indent_char = '\t';
        opt.indent_size = 1;
      }

      if (opt.eol === 'auto') {
        opt.eol = '\n';

        if (js_source_text && acorn.lineBreak.test(js_source_text || '')) {
          opt.eol = js_source_text.match(acorn.lineBreak)[0];
        }
      }

      opt.eol = opt.eol.replace(/\\r/, '\r').replace(/\\n/, '\n'); //----------------------------------

      indent_string = '';

      while (opt.indent_size > 0) {
        indent_string += opt.indent_char;
        opt.indent_size -= 1;
      }

      var preindent_index = 0;

      if (js_source_text && js_source_text.length) {
        while (js_source_text.charAt(preindent_index) === ' ' || js_source_text.charAt(preindent_index) === '\t') {
          baseIndentString += js_source_text.charAt(preindent_index);
          preindent_index += 1;
        }

        js_source_text = js_source_text.substring(preindent_index);
      }

      last_type = 'TK_START_BLOCK'; // last token type

      last_last_text = ''; // pre-last token text

      output = new Output(indent_string, baseIndentString); // If testing the ignore directive, start with output disable set to true

      output.raw = opt.test_output_raw; // Stack of parsing/formatting states, including MODE.
      // We tokenize, parse, and output in an almost purely a forward-only stream of token input
      // and formatted output.  This makes the beautifier less accurate than full parsers
      // but also far more tolerant of syntax errors.
      //
      // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
      // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
      // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
      // most full parsers would die, but the beautifier gracefully falls back to
      // MODE.BlockStatement and continues on.

      flag_store = [];
      set_mode(MODE.BlockStatement);

      this.beautify = function () {
        /*jshint onevar:true */
        var sweet_code;
        Tokenizer = new tokenizer(js_source_text, opt, indent_string);
        tokens = Tokenizer.tokenize();
        token_pos = 0;
        current_token = get_token();

        while (current_token) {
          handlers[current_token.type]();
          last_last_text = flags.last_text;
          last_type = current_token.type;
          flags.last_text = current_token.text;
          token_pos += 1;
          current_token = get_token();
        }

        sweet_code = output.get_code();

        if (opt.end_with_newline) {
          sweet_code += '\n';
        }

        if (opt.eol !== '\n') {
          sweet_code = sweet_code.replace(/[\n]/g, opt.eol);
        }

        return sweet_code;
      };

      function handle_whitespace_and_comments(local_token, preserve_statement_flags) {
        var newlines = local_token.newlines;
        var keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);
        var temp_token = current_token;

        for (var h = 0; h < local_token.comments_before.length; h++) {
          // The cleanest handling of inline comments is to treat them as though they aren't there.
          // Just continue formatting and the behavior should be logical.
          // Also ignore unknown tokens.  Again, this should result in better behavior.
          current_token = local_token.comments_before[h];
          handle_whitespace_and_comments(current_token, preserve_statement_flags);
          handlers[current_token.type](preserve_statement_flags);
        }

        current_token = temp_token;

        if (keep_whitespace) {
          for (var i = 0; i < newlines; i += 1) {
            print_newline(i > 0, preserve_statement_flags);
          }
        } else {
          if (opt.max_preserve_newlines && newlines > opt.max_preserve_newlines) {
            newlines = opt.max_preserve_newlines;
          }

          if (opt.preserve_newlines) {
            if (local_token.newlines > 1) {
              print_newline(false, preserve_statement_flags);

              for (var j = 1; j < newlines; j += 1) {
                print_newline(true, preserve_statement_flags);
              }
            }
          }
        }
      } // we could use just string.split, but
      // IE doesn't like returning empty strings


      function split_linebreaks(s) {
        //return s.split(/\x0d\x0a|\x0a/);
        s = s.replace(acorn.allLineBreaks, '\n');
        var out = [],
            idx = s.indexOf("\n");

        while (idx !== -1) {
          out.push(s.substring(0, idx));
          s = s.substring(idx + 1);
          idx = s.indexOf("\n");
        }

        if (s.length) {
          out.push(s);
        }

        return out;
      }

      var newline_restricted_tokens = ['break', 'continue', 'return', 'throw'];

      function allow_wrap_or_preserved_newline(force_linewrap) {
        force_linewrap = force_linewrap === undefined ? false : force_linewrap; // Never wrap the first token on a line

        if (output.just_added_newline()) {
          return;
        }

        var shouldPreserveOrForce = opt.preserve_newlines && current_token.wanted_newline || force_linewrap;
        var operatorLogicApplies = in_array(flags.last_text, Tokenizer.positionable_operators) || in_array(current_token.text, Tokenizer.positionable_operators);

        if (operatorLogicApplies) {
          var shouldPrintOperatorNewline = in_array(flags.last_text, Tokenizer.positionable_operators) && in_array(opt.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, Tokenizer.positionable_operators);
          shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
        }

        if (shouldPreserveOrForce) {
          print_newline(false, true);
        } else if (opt.wrap_line_length) {
          if (last_type === 'TK_RESERVED' && in_array(flags.last_text, newline_restricted_tokens)) {
            // These tokens should never have a newline inserted
            // between them and the following expression.
            return;
          }

          var proposed_line_length = output.current_line.get_character_count() + current_token.text.length + (output.space_before_token ? 1 : 0);

          if (proposed_line_length >= opt.wrap_line_length) {
            print_newline(false, true);
          }
        }
      }

      function print_newline(force_newline, preserve_statement_flags) {
        if (!preserve_statement_flags) {
          if (flags.last_text !== ';' && flags.last_text !== ',' && flags.last_text !== '=' && last_type !== 'TK_OPERATOR') {
            var next_token = get_token(1);

            while (flags.mode === MODE.Statement && !(flags.if_block && next_token && next_token.type === 'TK_RESERVED' && next_token.text === 'else') && !flags.do_block) {
              restore_mode();
            }
          }
        }

        if (output.add_new_line(force_newline)) {
          flags.multiline_frame = true;
        }
      }

      function print_token_line_indentation() {
        if (output.just_added_newline()) {
          if (opt.keep_array_indentation && is_array(flags.mode) && current_token.wanted_newline) {
            output.current_line.push(current_token.whitespace_before);
            output.space_before_token = false;
          } else if (output.set_indent(flags.indentation_level)) {
            flags.line_indent_level = flags.indentation_level;
          }
        }
      }

      function print_token(printable_token) {
        if (output.raw) {
          output.add_raw_token(current_token);
          return;
        }

        if (opt.comma_first && last_type === 'TK_COMMA' && output.just_added_newline()) {
          if (output.previous_line.last() === ',') {
            var popped = output.previous_line.pop(); // if the comma was already at the start of the line,
            // pull back onto that line and reprint the indentation

            if (output.previous_line.is_empty()) {
              output.previous_line.push(popped);
              output.trim(true);
              output.current_line.pop();
              output.trim();
            } // add the comma in front of the next token


            print_token_line_indentation();
            output.add_token(',');
            output.space_before_token = true;
          }
        }

        printable_token = printable_token || current_token.text;
        print_token_line_indentation();
        output.add_token(printable_token);
      }

      function indent() {
        flags.indentation_level += 1;
      }

      function deindent() {
        if (flags.indentation_level > 0 && (!flags.parent || flags.indentation_level > flags.parent.indentation_level)) {
          flags.indentation_level -= 1;
        }
      }

      function set_mode(mode) {
        if (flags) {
          flag_store.push(flags);
          previous_flags = flags;
        } else {
          previous_flags = create_flags(null, mode);
        }

        flags = create_flags(previous_flags, mode);
      }

      function is_array(mode) {
        return mode === MODE.ArrayLiteral;
      }

      function is_expression(mode) {
        return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
      }

      function restore_mode() {
        if (flag_store.length > 0) {
          previous_flags = flags;
          flags = flag_store.pop();

          if (previous_flags.mode === MODE.Statement) {
            output.remove_redundant_indentation(previous_flags);
          }
        }
      }

      function start_of_object_property() {
        return flags.parent.mode === MODE.ObjectLiteral && flags.mode === MODE.Statement && (flags.last_text === ':' && flags.ternary_depth === 0 || last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set']));
      }

      function start_of_statement() {
        if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD' || last_type === 'TK_RESERVED' && flags.last_text === 'do' || last_type === 'TK_RESERVED' && in_array(flags.last_text, ['return', 'throw']) && !current_token.wanted_newline || last_type === 'TK_RESERVED' && flags.last_text === 'else' && !(current_token.type === 'TK_RESERVED' && current_token.text === 'if' && !current_token.comments_before.length) || last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional) || last_type === 'TK_WORD' && flags.mode === MODE.BlockStatement && !flags.in_case && !(current_token.text === '--' || current_token.text === '++') && last_last_text !== 'function' && current_token.type !== 'TK_WORD' && current_token.type !== 'TK_RESERVED' || flags.mode === MODE.ObjectLiteral && (flags.last_text === ':' && flags.ternary_depth === 0 || last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set']))) {
          set_mode(MODE.Statement);
          indent();
          handle_whitespace_and_comments(current_token, true); // Issue #276:
          // If starting a new statement with [if, for, while, do], push to a new line.
          // if (a) if (b) if(c) d(); else e(); else f();

          if (!start_of_object_property()) {
            allow_wrap_or_preserved_newline(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['do', 'for', 'if', 'while']));
          }

          return true;
        }

        return false;
      }

      function all_lines_start_with(lines, c) {
        for (var i = 0; i < lines.length; i++) {
          var line = trim(lines[i]);

          if (line.charAt(0) !== c) {
            return false;
          }
        }

        return true;
      }

      function each_line_matches_indent(lines, indent) {
        var i = 0,
            len = lines.length,
            line;

        for (; i < len; i++) {
          line = lines[i]; // allow empty lines to pass through

          if (line && line.indexOf(indent) !== 0) {
            return false;
          }
        }

        return true;
      }

      function is_special_word(word) {
        return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
      }

      function get_token(offset) {
        var index = token_pos + (offset || 0);
        return index < 0 || index >= tokens.length ? null : tokens[index];
      }

      function handle_start_expr() {
        // The conditional starts the statement if appropriate.
        if (!start_of_statement()) {
          handle_whitespace_and_comments(current_token);
        }

        var next_mode = MODE.Expression;

        if (current_token.text === '[') {
          if (last_type === 'TK_WORD' || flags.last_text === ')') {
            // this is array index specifier, break immediately
            // a[x], fn()[x]
            if (last_type === 'TK_RESERVED' && in_array(flags.last_text, Tokenizer.line_starters)) {
              output.space_before_token = true;
            }

            set_mode(next_mode);
            print_token();
            indent();

            if (opt.space_in_paren) {
              output.space_before_token = true;
            }

            return;
          }

          next_mode = MODE.ArrayLiteral;

          if (is_array(flags.mode)) {
            if (flags.last_text === '[' || flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}')) {
              // ], [ goes to new line
              // }, [ goes to new line
              if (!opt.keep_array_indentation) {
                print_newline();
              }
            }
          }
        } else {
          if (last_type === 'TK_RESERVED' && flags.last_text === 'for') {
            next_mode = MODE.ForInitializer;
          } else if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['if', 'while'])) {
            next_mode = MODE.Conditional;
          } else {// next_mode = MODE.Expression;
          }
        }

        if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
          print_newline();
        } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
          // TODO: Consider whether forcing this is required.  Review failing tests when removed.
          allow_wrap_or_preserved_newline(current_token.wanted_newline); // do nothing on (( and )( and ][ and ]( and .(
        } else if (!(last_type === 'TK_RESERVED' && current_token.text === '(') && last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
          output.space_before_token = true;
        } else if (last_type === 'TK_RESERVED' && (flags.last_word === 'function' || flags.last_word === 'typeof') || flags.last_text === '*' && (in_array(last_last_text, ['function', 'yield']) || flags.mode === MODE.ObjectLiteral && in_array(last_last_text, ['{', ',']))) {
          // function() vs function ()
          // yield*() vs yield* ()
          // function*() vs function* ()
          if (opt.space_after_anon_function) {
            output.space_before_token = true;
          }
        } else if (last_type === 'TK_RESERVED' && (in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === 'catch')) {
          if (opt.space_before_conditional) {
            output.space_before_token = true;
          }
        } // Should be a space between await and an IIFE


        if (current_token.text === '(' && last_type === 'TK_RESERVED' && flags.last_word === 'await') {
          output.space_before_token = true;
        } // Support of this kind of newline preservation.
        // a = (b &&
        //     (c || d));


        if (current_token.text === '(') {
          if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
            if (!start_of_object_property()) {
              allow_wrap_or_preserved_newline();
            }
          }
        } // Support preserving wrapped arrow function expressions
        // a.b('c',
        //     () => d.e
        // )


        if (current_token.text === '(' && last_type !== 'TK_WORD' && last_type !== 'TK_RESERVED') {
          allow_wrap_or_preserved_newline();
        }

        set_mode(next_mode);
        print_token();

        if (opt.space_in_paren) {
          output.space_before_token = true;
        } // In all cases, if we newline while inside an expression it should be indented.


        indent();
      }

      function handle_end_expr() {
        // statements inside expressions are not valid syntax, but...
        // statements must all be closed when their container closes
        while (flags.mode === MODE.Statement) {
          restore_mode();
        }

        handle_whitespace_and_comments(current_token);

        if (flags.multiline_frame) {
          allow_wrap_or_preserved_newline(current_token.text === ']' && is_array(flags.mode) && !opt.keep_array_indentation);
        }

        if (opt.space_in_paren) {
          if (last_type === 'TK_START_EXPR' && !opt.space_in_empty_paren) {
            // () [] no inner space in empty parens like these, ever, ref #320
            output.trim();
            output.space_before_token = false;
          } else {
            output.space_before_token = true;
          }
        }

        if (current_token.text === ']' && opt.keep_array_indentation) {
          print_token();
          restore_mode();
        } else {
          restore_mode();
          print_token();
        }

        output.remove_redundant_indentation(previous_flags); // do {} while () // no statement required after

        if (flags.do_while && previous_flags.mode === MODE.Conditional) {
          previous_flags.mode = MODE.Expression;
          flags.do_block = false;
          flags.do_while = false;
        }
      }

      function handle_start_block() {
        handle_whitespace_and_comments(current_token); // Check if this is should be treated as a ObjectLiteral

        var next_token = get_token(1);
        var second_token = get_token(2);

        if (second_token && (in_array(second_token.text, [':', ',']) && in_array(next_token.type, ['TK_STRING', 'TK_WORD', 'TK_RESERVED']) || in_array(next_token.text, ['get', 'set', '...']) && in_array(second_token.type, ['TK_WORD', 'TK_RESERVED']))) {
          // We don't support TypeScript,but we didn't break it for a very long time.
          // We'll try to keep not breaking it.
          if (!in_array(last_last_text, ['class', 'interface'])) {
            set_mode(MODE.ObjectLiteral);
          } else {
            set_mode(MODE.BlockStatement);
          }
        } else if (last_type === 'TK_OPERATOR' && flags.last_text === '=>') {
          // arrow function: (param1, paramN) => { statements }
          set_mode(MODE.BlockStatement);
        } else if (in_array(last_type, ['TK_EQUALS', 'TK_START_EXPR', 'TK_COMMA', 'TK_OPERATOR']) || last_type === 'TK_RESERVED' && in_array(flags.last_text, ['return', 'throw', 'import', 'default'])) {
          // Detecting shorthand function syntax is difficult by scanning forward,
          //     so check the surrounding context.
          // If the block is being returned, imported, export default, passed as arg,
          //     assigned with = or assigned in a nested object, treat as an ObjectLiteral.
          set_mode(MODE.ObjectLiteral);
        } else {
          set_mode(MODE.BlockStatement);
        }

        var empty_braces = !next_token.comments_before.length && next_token.text === '}';
        var empty_anonymous_function = empty_braces && flags.last_word === 'function' && last_type === 'TK_END_EXPR';

        if (opt.brace_preserve_inline) // check for inline, set inline_frame if so
          {
            // search forward for a newline wanted inside this block
            var index = 0;
            var check_token = null;
            flags.inline_frame = true;

            do {
              index += 1;
              check_token = get_token(index);

              if (check_token.wanted_newline) {
                flags.inline_frame = false;
                break;
              }
            } while (check_token.type !== 'TK_EOF' && !(check_token.type === 'TK_END_BLOCK' && check_token.opened === current_token));
          }

        if ((opt.brace_style === "expand" || opt.brace_style === "none" && current_token.wanted_newline) && !flags.inline_frame) {
          if (last_type !== 'TK_OPERATOR' && (empty_anonymous_function || last_type === 'TK_EQUALS' || last_type === 'TK_RESERVED' && is_special_word(flags.last_text) && flags.last_text !== 'else')) {
            output.space_before_token = true;
          } else {
            print_newline(false, true);
          }
        } else {
          // collapse || inline_frame
          if (is_array(previous_flags.mode) && (last_type === 'TK_START_EXPR' || last_type === 'TK_COMMA')) {
            if (last_type === 'TK_COMMA' || opt.space_in_paren) {
              output.space_before_token = true;
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' && flags.inline_frame) {
              allow_wrap_or_preserved_newline();
              previous_flags.multiline_frame = previous_flags.multiline_frame || flags.multiline_frame;
              flags.multiline_frame = false;
            }
          }

          if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
            if (last_type === 'TK_START_BLOCK' && !flags.inline_frame) {
              print_newline();
            } else {
              output.space_before_token = true;
            }
          }
        }

        print_token();
        indent();
      }

      function handle_end_block() {
        // statements must all be closed when their container closes
        handle_whitespace_and_comments(current_token);

        while (flags.mode === MODE.Statement) {
          restore_mode();
        }

        var empty_braces = last_type === 'TK_START_BLOCK';

        if (flags.inline_frame && !empty_braces) {
          // try inline_frame (only set if opt.braces-preserve-inline) first
          output.space_before_token = true;
        } else if (opt.brace_style === "expand") {
          if (!empty_braces) {
            print_newline();
          }
        } else {
          // skip {}
          if (!empty_braces) {
            if (is_array(flags.mode) && opt.keep_array_indentation) {
              // we REALLY need a newline here, but newliner would skip that
              opt.keep_array_indentation = false;
              print_newline();
              opt.keep_array_indentation = true;
            } else {
              print_newline();
            }
          }
        }

        restore_mode();
        print_token();
      }

      function handle_word() {
        if (current_token.type === 'TK_RESERVED') {
          if (in_array(current_token.text, ['set', 'get']) && flags.mode !== MODE.ObjectLiteral) {
            current_token.type = 'TK_WORD';
          } else if (in_array(current_token.text, ['as', 'from']) && !flags.import_block) {
            current_token.type = 'TK_WORD';
          } else if (flags.mode === MODE.ObjectLiteral) {
            var next_token = get_token(1);

            if (next_token.text === ':') {
              current_token.type = 'TK_WORD';
            }
          }
        }

        if (start_of_statement()) {
          // The conditional starts the statement if appropriate.
          if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const']) && current_token.type === 'TK_WORD') {
            flags.declaration_statement = true;
          }
        } else if (current_token.wanted_newline && !is_expression(flags.mode) && (last_type !== 'TK_OPERATOR' || flags.last_text === '--' || flags.last_text === '++') && last_type !== 'TK_EQUALS' && (opt.preserve_newlines || !(last_type === 'TK_RESERVED' && in_array(flags.last_text, ['var', 'let', 'const', 'set', 'get'])))) {
          handle_whitespace_and_comments(current_token);
          print_newline();
        } else {
          handle_whitespace_and_comments(current_token);
        }

        if (flags.do_block && !flags.do_while) {
          if (current_token.type === 'TK_RESERVED' && current_token.text === 'while') {
            // do {} ## while ()
            output.space_before_token = true;
            print_token();
            output.space_before_token = true;
            flags.do_while = true;
            return;
          } else {
            // do {} should always have while as the next word.
            // if we don't see the expected while, recover
            print_newline();
            flags.do_block = false;
          }
        } // if may be followed by else, or not
        // Bare/inline ifs are tricky
        // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();


        if (flags.if_block) {
          if (!flags.else_block && current_token.type === 'TK_RESERVED' && current_token.text === 'else') {
            flags.else_block = true;
          } else {
            while (flags.mode === MODE.Statement) {
              restore_mode();
            }

            flags.if_block = false;
            flags.else_block = false;
          }
        }

        if (current_token.type === 'TK_RESERVED' && (current_token.text === 'case' || current_token.text === 'default' && flags.in_case_statement)) {
          print_newline();

          if (flags.case_body || opt.jslint_happy) {
            // switch cases following one another
            deindent();
            flags.case_body = false;
          }

          print_token();
          flags.in_case = true;
          flags.in_case_statement = true;
          return;
        }

        if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
          if (!start_of_object_property()) {
            allow_wrap_or_preserved_newline();
          }
        }

        if (current_token.type === 'TK_RESERVED' && current_token.text === 'function') {
          if (in_array(flags.last_text, ['}', ';']) || output.just_added_newline() && !(in_array(flags.last_text, ['(', '[', '{', ':', '=', ',']) || last_type === 'TK_OPERATOR')) {
            // make sure there is a nice clean space of at least one blank line
            // before a new function definition
            if (!output.just_added_blankline() && !current_token.comments_before.length) {
              print_newline();
              print_newline(true);
            }
          }

          if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD') {
            if (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['get', 'set', 'new', 'return', 'export', 'async'])) {
              output.space_before_token = true;
            } else if (last_type === 'TK_RESERVED' && flags.last_text === 'default' && last_last_text === 'export') {
              output.space_before_token = true;
            } else {
              print_newline();
            }
          } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
            // foo = function
            output.space_before_token = true;
          } else if (!flags.multiline_frame && (is_expression(flags.mode) || is_array(flags.mode))) {// (function
          } else {
            print_newline();
          }

          print_token();
          flags.last_word = current_token.text;
          return;
        }

        prefix = 'NONE';

        if (last_type === 'TK_END_BLOCK') {
          if (previous_flags.inline_frame) {
            prefix = 'SPACE';
          } else if (!(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally', 'from']))) {
            prefix = 'NEWLINE';
          } else {
            if (opt.brace_style === "expand" || opt.brace_style === "end-expand" || opt.brace_style === "none" && current_token.wanted_newline) {
              prefix = 'NEWLINE';
            } else {
              prefix = 'SPACE';
              output.space_before_token = true;
            }
          }
        } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
          // TODO: Should this be for STATEMENT as well?
          prefix = 'NEWLINE';
        } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
          prefix = 'SPACE';
        } else if (last_type === 'TK_STRING') {
          prefix = 'NEWLINE';
        } else if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' || flags.last_text === '*' && (in_array(last_last_text, ['function', 'yield']) || flags.mode === MODE.ObjectLiteral && in_array(last_last_text, ['{', ',']))) {
          prefix = 'SPACE';
        } else if (last_type === 'TK_START_BLOCK') {
          if (flags.inline_frame) {
            prefix = 'SPACE';
          } else {
            prefix = 'NEWLINE';
          }
        } else if (last_type === 'TK_END_EXPR') {
          output.space_before_token = true;
          prefix = 'NEWLINE';
        }

        if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
          if (flags.inline_frame || flags.last_text === 'else' || flags.last_text === 'export') {
            prefix = 'SPACE';
          } else {
            prefix = 'NEWLINE';
          }
        }

        if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['else', 'catch', 'finally'])) {
          if ((!(last_type === 'TK_END_BLOCK' && previous_flags.mode === MODE.BlockStatement) || opt.brace_style === "expand" || opt.brace_style === "end-expand" || opt.brace_style === "none" && current_token.wanted_newline) && !flags.inline_frame) {
            print_newline();
          } else {
            output.trim(true);
            var line = output.current_line; // If we trimmed and there's something other than a close block before us
            // put a newline back in.  Handles '} // comment' scenario.

            if (line.last() !== '}') {
              print_newline();
            }

            output.space_before_token = true;
          }
        } else if (prefix === 'NEWLINE') {
          if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
            // no newline between 'return nnn'
            output.space_before_token = true;
          } else if (last_type !== 'TK_END_EXPR') {
            if ((last_type !== 'TK_START_EXPR' || !(current_token.type === 'TK_RESERVED' && in_array(current_token.text, ['var', 'let', 'const']))) && flags.last_text !== ':') {
              // no need to force newline on 'var': for (var x = 0...)
              if (current_token.type === 'TK_RESERVED' && current_token.text === 'if' && flags.last_text === 'else') {
                // no newline for } else if {
                output.space_before_token = true;
              } else {
                print_newline();
              }
            }
          } else if (current_token.type === 'TK_RESERVED' && in_array(current_token.text, Tokenizer.line_starters) && flags.last_text !== ')') {
            print_newline();
          }
        } else if (flags.multiline_frame && is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
          print_newline(); // }, in lists get a newline treatment
        } else if (prefix === 'SPACE') {
          output.space_before_token = true;
        }

        print_token();
        flags.last_word = current_token.text;

        if (current_token.type === 'TK_RESERVED') {
          if (current_token.text === 'do') {
            flags.do_block = true;
          } else if (current_token.text === 'if') {
            flags.if_block = true;
          } else if (current_token.text === 'import') {
            flags.import_block = true;
          } else if (flags.import_block && current_token.type === 'TK_RESERVED' && current_token.text === 'from') {
            flags.import_block = false;
          }
        }
      }

      function handle_semicolon() {
        if (start_of_statement()) {
          // The conditional starts the statement if appropriate.
          // Semicolon can be the start (and end) of a statement
          output.space_before_token = false;
        } else {
          handle_whitespace_and_comments(current_token);
        }

        var next_token = get_token(1);

        while (flags.mode === MODE.Statement && !(flags.if_block && next_token && next_token.type === 'TK_RESERVED' && next_token.text === 'else') && !flags.do_block) {
          restore_mode();
        } // hacky but effective for the moment


        if (flags.import_block) {
          flags.import_block = false;
        }

        print_token();
      }

      function handle_string() {
        if (start_of_statement()) {
          // The conditional starts the statement if appropriate.
          // One difference - strings want at least a space before
          output.space_before_token = true;
        } else {
          handle_whitespace_and_comments(current_token);

          if (last_type === 'TK_RESERVED' || last_type === 'TK_WORD' || flags.inline_frame) {
            output.space_before_token = true;
          } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
            if (!start_of_object_property()) {
              allow_wrap_or_preserved_newline();
            }
          } else {
            print_newline();
          }
        }

        print_token();
      }

      function handle_equals() {
        if (start_of_statement()) {// The conditional starts the statement if appropriate.
        } else {
          handle_whitespace_and_comments(current_token);
        }

        if (flags.declaration_statement) {
          // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
          flags.declaration_assignment = true;
        }

        output.space_before_token = true;
        print_token();
        output.space_before_token = true;
      }

      function handle_comma() {
        handle_whitespace_and_comments(current_token, true);
        print_token();
        output.space_before_token = true;

        if (flags.declaration_statement) {
          if (is_expression(flags.parent.mode)) {
            // do not break on comma, for(var a = 1, b = 2)
            flags.declaration_assignment = false;
          }

          if (flags.declaration_assignment) {
            flags.declaration_assignment = false;
            print_newline(false, true);
          } else if (opt.comma_first) {
            // for comma-first, we want to allow a newline before the comma
            // to turn into a newline after the comma, which we will fixup later
            allow_wrap_or_preserved_newline();
          }
        } else if (flags.mode === MODE.ObjectLiteral || flags.mode === MODE.Statement && flags.parent.mode === MODE.ObjectLiteral) {
          if (flags.mode === MODE.Statement) {
            restore_mode();
          }

          if (!flags.inline_frame) {
            print_newline();
          }
        } else if (opt.comma_first) {
          // EXPR or DO_BLOCK
          // for comma-first, we want to allow a newline before the comma
          // to turn into a newline after the comma, which we will fixup later
          allow_wrap_or_preserved_newline();
        }
      }

      function handle_operator() {
        var isGeneratorAsterisk = current_token.text === '*' && (last_type === 'TK_RESERVED' && in_array(flags.last_text, ['function', 'yield']) || in_array(last_type, ['TK_START_BLOCK', 'TK_COMMA', 'TK_END_BLOCK', 'TK_SEMICOLON']));
        var isUnary = in_array(current_token.text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, Tokenizer.line_starters) || flags.last_text === ',');

        if (start_of_statement()) {// The conditional starts the statement if appropriate.
        } else {
          var preserve_statement_flags = !isGeneratorAsterisk;
          handle_whitespace_and_comments(current_token, preserve_statement_flags);
        }

        if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
          // "return" had a special handling in TK_WORD. Now we need to return the favor
          output.space_before_token = true;
          print_token();
          return;
        } // hack for actionscript's import .*;


        if (current_token.text === '*' && last_type === 'TK_DOT') {
          print_token();
          return;
        }

        if (current_token.text === '::') {
          // no spaces around exotic namespacing syntax operator
          print_token();
          return;
        } // Allow line wrapping between operators when operator_position is
        //   set to before or preserve


        if (last_type === 'TK_OPERATOR' && in_array(opt.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
          allow_wrap_or_preserved_newline();
        }

        if (current_token.text === ':' && flags.in_case) {
          flags.case_body = true;
          indent();
          print_token();
          print_newline();
          flags.in_case = false;
          return;
        }

        var space_before = true;
        var space_after = true;
        var in_ternary = false;

        if (current_token.text === ':') {
          if (flags.ternary_depth === 0) {
            // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
            space_before = false;
          } else {
            flags.ternary_depth -= 1;
            in_ternary = true;
          }
        } else if (current_token.text === '?') {
          flags.ternary_depth += 1;
        } // let's handle the operator_position option prior to any conflicting logic


        if (!isUnary && !isGeneratorAsterisk && opt.preserve_newlines && in_array(current_token.text, Tokenizer.positionable_operators)) {
          var isColon = current_token.text === ':';
          var isTernaryColon = isColon && in_ternary;
          var isOtherColon = isColon && !in_ternary;

          switch (opt.operator_position) {
            case OPERATOR_POSITION.before_newline:
              // if the current token is : and it's not a ternary statement then we set space_before to false
              output.space_before_token = !isOtherColon;
              print_token();

              if (!isColon || isTernaryColon) {
                allow_wrap_or_preserved_newline();
              }

              output.space_before_token = true;
              return;

            case OPERATOR_POSITION.after_newline:
              // if the current token is anything but colon, or (via deduction) it's a colon and in a ternary statement,
              //   then print a newline.
              output.space_before_token = true;

              if (!isColon || isTernaryColon) {
                if (get_token(1).wanted_newline) {
                  print_newline(false, true);
                } else {
                  allow_wrap_or_preserved_newline();
                }
              } else {
                output.space_before_token = false;
              }

              print_token();
              output.space_before_token = true;
              return;

            case OPERATOR_POSITION.preserve_newline:
              if (!isOtherColon) {
                allow_wrap_or_preserved_newline();
              } // if we just added a newline, or the current token is : and it's not a ternary statement,
              //   then we set space_before to false


              space_before = !(output.just_added_newline() || isOtherColon);
              output.space_before_token = space_before;
              print_token();
              output.space_before_token = true;
              return;
          }
        }

        if (isGeneratorAsterisk) {
          allow_wrap_or_preserved_newline();
          space_before = false;
          var next_token = get_token(1);
          space_after = next_token && in_array(next_token.type, ['TK_WORD', 'TK_RESERVED']);
        } else if (current_token.text === '...') {
          allow_wrap_or_preserved_newline();
          space_before = last_type === 'TK_START_BLOCK';
          space_after = false;
        } else if (in_array(current_token.text, ['--', '++', '!', '~']) || isUnary) {
          // unary operators (and binary +/- pretending to be unary) special cases
          space_before = false;
          space_after = false; // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
          // if there is a newline between -- or ++ and anything else we should preserve it.

          if (current_token.wanted_newline && (current_token.text === '--' || current_token.text === '++')) {
            print_newline(false, true);
          }

          if (flags.last_text === ';' && is_expression(flags.mode)) {
            // for (;; ++i)
            //        ^^^
            space_before = true;
          }

          if (last_type === 'TK_RESERVED') {
            space_before = true;
          } else if (last_type === 'TK_END_EXPR') {
            space_before = !(flags.last_text === ']' && (current_token.text === '--' || current_token.text === '++'));
          } else if (last_type === 'TK_OPERATOR') {
            // a++ + ++b;
            // a - -b
            space_before = in_array(current_token.text, ['--', '-', '++', '+']) && in_array(flags.last_text, ['--', '-', '++', '+']); // + and - are not unary when preceeded by -- or ++ operator
            // a-- + b
            // a * +b
            // a - -b

            if (in_array(current_token.text, ['+', '-']) && in_array(flags.last_text, ['--', '++'])) {
              space_after = true;
            }
          }

          if ((flags.mode === MODE.BlockStatement && !flags.inline_frame || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
            // { foo; --i }
            // foo(); --bar;
            print_newline();
          }
        }

        output.space_before_token = output.space_before_token || space_before;
        print_token();
        output.space_before_token = space_after;
      }

      function handle_block_comment(preserve_statement_flags) {
        if (output.raw) {
          output.add_raw_token(current_token);

          if (current_token.directives && current_token.directives.preserve === 'end') {
            // If we're testing the raw output behavior, do not allow a directive to turn it off.
            output.raw = opt.test_output_raw;
          }

          return;
        }

        if (current_token.directives) {
          print_newline(false, preserve_statement_flags);
          print_token();

          if (current_token.directives.preserve === 'start') {
            output.raw = true;
          }

          print_newline(false, true);
          return;
        } // inline block


        if (!acorn.newline.test(current_token.text) && !current_token.wanted_newline) {
          output.space_before_token = true;
          print_token();
          output.space_before_token = true;
          return;
        }

        var lines = split_linebreaks(current_token.text);
        var j; // iterator for this case

        var javadoc = false;
        var starless = false;
        var lastIndent = current_token.whitespace_before;
        var lastIndentLength = lastIndent.length; // block comment starts with a new line

        print_newline(false, preserve_statement_flags);

        if (lines.length > 1) {
          javadoc = all_lines_start_with(lines.slice(1), '*');
          starless = each_line_matches_indent(lines.slice(1), lastIndent);
        } // first line always indented


        print_token(lines[0]);

        for (j = 1; j < lines.length; j++) {
          print_newline(false, true);

          if (javadoc) {
            // javadoc: reformat and re-indent
            print_token(' ' + ltrim(lines[j]));
          } else if (starless && lines[j].length > lastIndentLength) {
            // starless: re-indent non-empty content, avoiding trim
            print_token(lines[j].substring(lastIndentLength));
          } else {
            // normal comments output raw
            output.add_token(lines[j]);
          }
        } // for comments of more than one line, make sure there's a new line after


        print_newline(false, preserve_statement_flags);
      }

      function handle_comment(preserve_statement_flags) {
        if (current_token.wanted_newline) {
          print_newline(false, preserve_statement_flags);
        } else {
          output.trim(true);
        }

        output.space_before_token = true;
        print_token();
        print_newline(false, preserve_statement_flags);
      }

      function handle_dot() {
        if (start_of_statement()) {// The conditional starts the statement if appropriate.
        } else {
          handle_whitespace_and_comments(current_token, true);
        }

        if (last_type === 'TK_RESERVED' && is_special_word(flags.last_text)) {
          output.space_before_token = true;
        } else {
          // allow preserved newlines before dots in general
          // force newlines on dots after close paren when break_chained - for bar().baz()
          allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
        }

        print_token();
      }

      function handle_unknown(preserve_statement_flags) {
        print_token();

        if (current_token.text[current_token.text.length - 1] === '\n') {
          print_newline(false, preserve_statement_flags);
        }
      }

      function handle_eof() {
        // Unwind any open statements
        while (flags.mode === MODE.Statement) {
          restore_mode();
        }

        handle_whitespace_and_comments(current_token);
      }
    }

    function OutputLine(parent) {
      var _character_count = 0; // use indent_count as a marker for lines that have preserved indentation

      var _indent_count = -1;

      var _items = [];
      var _empty = true;

      this.set_indent = function (level) {
        _character_count = parent.baseIndentLength + level * parent.indent_length;
        _indent_count = level;
      };

      this.get_character_count = function () {
        return _character_count;
      };

      this.is_empty = function () {
        return _empty;
      };

      this.last = function () {
        if (!this._empty) {
          return _items[_items.length - 1];
        } else {
          return null;
        }
      };

      this.push = function (input) {
        _items.push(input);

        _character_count += input.length;
        _empty = false;
      };

      this.pop = function () {
        var item = null;

        if (!_empty) {
          item = _items.pop();
          _character_count -= item.length;
          _empty = _items.length === 0;
        }

        return item;
      };

      this.remove_indent = function () {
        if (_indent_count > 0) {
          _indent_count -= 1;
          _character_count -= parent.indent_length;
        }
      };

      this.trim = function () {
        while (this.last() === ' ') {
          _items.pop();

          _character_count -= 1;
        }

        _empty = _items.length === 0;
      };

      this.toString = function () {
        var result = '';

        if (!this._empty) {
          if (_indent_count >= 0) {
            result = parent.indent_cache[_indent_count];
          }

          result += _items.join('');
        }

        return result;
      };
    }

    function Output(indent_string, baseIndentString) {
      baseIndentString = baseIndentString || '';
      this.indent_cache = [baseIndentString];
      this.baseIndentLength = baseIndentString.length;
      this.indent_length = indent_string.length;
      this.raw = false;
      var lines = [];
      this.baseIndentString = baseIndentString;
      this.indent_string = indent_string;
      this.previous_line = null;
      this.current_line = null;
      this.space_before_token = false;

      this.add_outputline = function () {
        this.previous_line = this.current_line;
        this.current_line = new OutputLine(this);
        lines.push(this.current_line);
      }; // initialize


      this.add_outputline();

      this.get_line_number = function () {
        return lines.length;
      }; // Using object instead of string to allow for later expansion of info about each line


      this.add_new_line = function (force_newline) {
        if (this.get_line_number() === 1 && this.just_added_newline()) {
          return false; // no newline on start of file
        }

        if (force_newline || !this.just_added_newline()) {
          if (!this.raw) {
            this.add_outputline();
          }

          return true;
        }

        return false;
      };

      this.get_code = function () {
        var sweet_code = lines.join('\n').replace(/[\r\n\t ]+$/, '');
        return sweet_code;
      };

      this.set_indent = function (level) {
        // Never indent your first output indent at the start of the file
        if (lines.length > 1) {
          while (level >= this.indent_cache.length) {
            this.indent_cache.push(this.indent_cache[this.indent_cache.length - 1] + this.indent_string);
          }

          this.current_line.set_indent(level);
          return true;
        }

        this.current_line.set_indent(0);
        return false;
      };

      this.add_raw_token = function (token) {
        for (var x = 0; x < token.newlines; x++) {
          this.add_outputline();
        }

        this.current_line.push(token.whitespace_before);
        this.current_line.push(token.text);
        this.space_before_token = false;
      };

      this.add_token = function (printable_token) {
        this.add_space_before_token();
        this.current_line.push(printable_token);
      };

      this.add_space_before_token = function () {
        if (this.space_before_token && !this.just_added_newline()) {
          this.current_line.push(' ');
        }

        this.space_before_token = false;
      };

      this.remove_redundant_indentation = function (frame) {
        // This implementation is effective but has some issues:
        //     - can cause line wrap to happen too soon due to indent removal
        //           after wrap points are calculated
        // These issues are minor compared to ugly indentation.
        if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
          return;
        } // remove one indent from each line inside this section


        var index = frame.start_line_index;
        var output_length = lines.length;

        while (index < output_length) {
          lines[index].remove_indent();
          index++;
        }
      };

      this.trim = function (eat_newlines) {
        eat_newlines = eat_newlines === undefined ? false : eat_newlines;
        this.current_line.trim(indent_string, baseIndentString);

        while (eat_newlines && lines.length > 1 && this.current_line.is_empty()) {
          lines.pop();
          this.current_line = lines[lines.length - 1];
          this.current_line.trim();
        }

        this.previous_line = lines.length > 1 ? lines[lines.length - 2] : null;
      };

      this.just_added_newline = function () {
        return this.current_line.is_empty();
      };

      this.just_added_blankline = function () {
        if (this.just_added_newline()) {
          if (lines.length === 1) {
            return true; // start of the file and newline = blank
          }

          var line = lines[lines.length - 2];
          return line.is_empty();
        }

        return false;
      };
    }

    var InputScanner = function InputScanner(input) {
      var _input = input;
      var _input_length = _input.length;
      var _position = 0;

      this.back = function () {
        _position -= 1;
      };

      this.hasNext = function () {
        return _position < _input_length;
      };

      this.next = function () {
        var val = null;

        if (this.hasNext()) {
          val = _input.charAt(_position);
          _position += 1;
        }

        return val;
      };

      this.peek = function (index) {
        var val = null;
        index = index || 0;
        index += _position;

        if (index >= 0 && index < _input_length) {
          val = _input.charAt(index);
        }

        return val;
      };

      this.peekCharCode = function (index) {
        var val = 0;
        index = index || 0;
        index += _position;

        if (index >= 0 && index < _input_length) {
          val = _input.charCodeAt(index);
        }

        return val;
      };

      this.test = function (pattern, index) {
        index = index || 0;
        pattern.lastIndex = _position + index;
        return pattern.test(_input);
      };

      this.testChar = function (pattern, index) {
        var val = this.peek(index);
        return val !== null && pattern.test(val);
      };

      this.match = function (pattern) {
        pattern.lastIndex = _position;
        var pattern_match = pattern.exec(_input);

        if (pattern_match && pattern_match.index === _position) {
          _position += pattern_match[0].length;
        } else {
          pattern_match = null;
        }

        return pattern_match;
      };
    };

    var Token = function Token(type, text, newlines, whitespace_before, parent) {
      this.type = type;
      this.text = text; // comments_before are
      // comments that have a new line before them
      // and may or may not have a newline after
      // this is a set of comments before

      this.comments_before =
      /* inline comment*/
      [];
      this.comments_after = []; // no new line before and newline after

      this.newlines = newlines || 0;
      this.wanted_newline = newlines > 0;
      this.whitespace_before = whitespace_before || '';
      this.parent = parent || null;
      this.opened = null;
      this.directives = null;
    };

    function tokenizer(input_string, opts) {
      var whitespace = "\n\r\t ".split('');
      var digit = /[0-9]/;
      var digit_bin = /[01]/;
      var digit_oct = /[01234567]/;
      var digit_hex = /[0123456789abcdefABCDEF]/;
      this.positionable_operators = '!= !== % & && * ** + - / : < << <= == === > >= >> >>> ? ^ | ||'.split(' ');
      var punct = this.positionable_operators.concat( // non-positionable operators - these do not follow operator position settings
      '! %= &= *= **= ++ += , -- -= /= :: <<= = => >>= >>>= ^= |= ~ ...'.split(' ')); // words which should always start on new line.

      this.line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export'.split(',');
      var reserved_words = this.line_starters.concat(['do', 'in', 'of', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof', 'yield', 'async', 'await', 'from', 'as']); //  /* ... */ comment ends with nearest */ or end of file

      var block_comment_pattern = /([\s\S]*?)((?:\*\/)|$)/g; // comment ends just before nearest linefeed or end of file

      var comment_pattern = /([^\n\r\u2028\u2029]*)/g;
      var directives_block_pattern = /\/\* beautify( \w+[:]\w+)+ \*\//g;
      var directive_pattern = / (\w+)[:](\w+)/g;
      var directives_end_ignore_pattern = /([\s\S]*?)((?:\/\*\sbeautify\signore:end\s\*\/)|$)/g;
      var template_pattern = /((<\?php|<\?=)[\s\S]*?\?>)|(<%[\s\S]*?%>)/g;
      var n_newlines, whitespace_before_token, in_html_comment, tokens;
      var input;

      this.tokenize = function () {
        input = new InputScanner(input_string);
        in_html_comment = false;
        tokens = [];
        var next, last;
        var token_values;
        var open = null;
        var open_stack = [];
        var comments = [];

        while (!(last && last.type === 'TK_EOF')) {
          token_values = tokenize_next();
          next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);

          while (next.type === 'TK_COMMENT' || next.type === 'TK_BLOCK_COMMENT' || next.type === 'TK_UNKNOWN') {
            if (next.type === 'TK_BLOCK_COMMENT') {
              next.directives = token_values[2];
            }

            comments.push(next);
            token_values = tokenize_next();
            next = new Token(token_values[1], token_values[0], n_newlines, whitespace_before_token);
          }

          if (comments.length) {
            next.comments_before = comments;
            comments = [];
          }

          if (next.type === 'TK_START_BLOCK' || next.type === 'TK_START_EXPR') {
            next.parent = last;
            open_stack.push(open);
            open = next;
          } else if ((next.type === 'TK_END_BLOCK' || next.type === 'TK_END_EXPR') && open && (next.text === ']' && open.text === '[' || next.text === ')' && open.text === '(' || next.text === '}' && open.text === '{')) {
            next.parent = open.parent;
            next.opened = open;
            open = open_stack.pop();
          }

          tokens.push(next);
          last = next;
        }

        return tokens;
      };

      function get_directives(text) {
        if (!text.match(directives_block_pattern)) {
          return null;
        }

        var directives = {};
        directive_pattern.lastIndex = 0;
        var directive_match = directive_pattern.exec(text);

        while (directive_match) {
          directives[directive_match[1]] = directive_match[2];
          directive_match = directive_pattern.exec(text);
        }

        return directives;
      }

      function tokenize_next() {
        var resulting_string;
        var whitespace_on_this_line = [];
        n_newlines = 0;
        whitespace_before_token = '';
        var c = input.next();

        if (c === null) {
          return ['', 'TK_EOF'];
        }

        var last_token;

        if (tokens.length) {
          last_token = tokens[tokens.length - 1];
        } else {
          // For the sake of tokenizing we can pretend that there was on open brace to start
          last_token = new Token('TK_START_BLOCK', '{');
        }

        while (in_array(c, whitespace)) {
          if (acorn.newline.test(c)) {
            if (!(c === '\n' && input.peek(-2) === '\r')) {
              n_newlines += 1;
              whitespace_on_this_line = [];
            }
          } else {
            whitespace_on_this_line.push(c);
          }

          c = input.next();

          if (c === null) {
            return ['', 'TK_EOF'];
          }
        }

        if (whitespace_on_this_line.length) {
          whitespace_before_token = whitespace_on_this_line.join('');
        }

        if (digit.test(c) || c === '.' && input.testChar(digit)) {
          var allow_decimal = true;
          var allow_e = true;
          var local_digit = digit;

          if (c === '0' && input.testChar(/[XxOoBb]/)) {
            // switch to hex/oct/bin number, no decimal or e, just hex/oct/bin digits
            allow_decimal = false;
            allow_e = false;

            if (input.testChar(/[Bb]/)) {
              local_digit = digit_bin;
            } else if (input.testChar(/[Oo]/)) {
              local_digit = digit_oct;
            } else {
              local_digit = digit_hex;
            }

            c += input.next();
          } else if (c === '.') {
            // Already have a decimal for this literal, don't allow another
            allow_decimal = false;
          } else {
            // we know this first loop will run.  It keeps the logic simpler.
            c = '';
            input.back();
          } // Add the digits


          while (input.testChar(local_digit)) {
            c += input.next();

            if (allow_decimal && input.peek() === '.') {
              c += input.next();
              allow_decimal = false;
            } // a = 1.e-7 is valid, so we test for . then e in one loop


            if (allow_e && input.testChar(/[Ee]/)) {
              c += input.next();

              if (input.testChar(/[+-]/)) {
                c += input.next();
              }

              allow_e = false;
              allow_decimal = false;
            }
          }

          return [c, 'TK_WORD'];
        }

        if (acorn.isIdentifierStart(input.peekCharCode(-1))) {
          if (input.hasNext()) {
            while (acorn.isIdentifierChar(input.peekCharCode())) {
              c += input.next();

              if (!input.hasNext()) {
                break;
              }
            }
          }

          if (!(last_token.type === 'TK_DOT' || last_token.type === 'TK_RESERVED' && in_array(last_token.text, ['set', 'get'])) && in_array(c, reserved_words)) {
            if (c === 'in' || c === 'of') {
              // hack for 'in' and 'of' operators
              return [c, 'TK_OPERATOR'];
            }

            return [c, 'TK_RESERVED'];
          }

          return [c, 'TK_WORD'];
        }

        if (c === '(' || c === '[') {
          return [c, 'TK_START_EXPR'];
        }

        if (c === ')' || c === ']') {
          return [c, 'TK_END_EXPR'];
        }

        if (c === '{') {
          return [c, 'TK_START_BLOCK'];
        }

        if (c === '}') {
          return [c, 'TK_END_BLOCK'];
        }

        if (c === ';') {
          return [c, 'TK_SEMICOLON'];
        }

        if (c === '/') {
          var comment = '';
          var comment_match; // peek for comment /* ... */

          if (input.peek() === '*') {
            input.next();
            comment_match = input.match(block_comment_pattern);
            comment = '/*' + comment_match[0];
            var directives = get_directives(comment);

            if (directives && directives.ignore === 'start') {
              comment_match = input.match(directives_end_ignore_pattern);
              comment += comment_match[0];
            }

            comment = comment.replace(acorn.allLineBreaks, '\n');
            return [comment, 'TK_BLOCK_COMMENT', directives];
          } // peek for comment // ...


          if (input.peek() === '/') {
            input.next();
            comment_match = input.match(comment_pattern);
            comment = '//' + comment_match[0];
            return [comment, 'TK_COMMENT'];
          }
        }

        var startXmlRegExp = /<()([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;

        if (c === '`' || c === "'" || c === '"' || // string
        (c === '/' || // regexp
        opts.e4x && c === "<" && input.test(startXmlRegExp, -1) // xml
        ) && ( // regex and xml can only appear in specific locations during parsing
        last_token.type === 'TK_RESERVED' && in_array(last_token.text, ['return', 'case', 'throw', 'else', 'do', 'typeof', 'yield']) || last_token.type === 'TK_END_EXPR' && last_token.text === ')' && last_token.parent && last_token.parent.type === 'TK_RESERVED' && in_array(last_token.parent.text, ['if', 'while', 'for']) || in_array(last_token.type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK', 'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA']))) {
          var sep = c,
              esc = false,
              has_char_escapes = false;
          resulting_string = c;

          if (sep === '/') {
            //
            // handle regexp
            //
            var in_char_class = false;

            while (input.hasNext() && (esc || in_char_class || input.peek() !== sep) && !input.testChar(acorn.newline)) {
              resulting_string += input.peek();

              if (!esc) {
                esc = input.peek() === '\\';

                if (input.peek() === '[') {
                  in_char_class = true;
                } else if (input.peek() === ']') {
                  in_char_class = false;
                }
              } else {
                esc = false;
              }

              input.next();
            }
          } else if (opts.e4x && sep === '<') {
            //
            // handle e4x xml literals
            //
            var xmlRegExp = /[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;
            input.back();
            var xmlStr = '';
            var match = input.match(startXmlRegExp);

            if (match) {
              // Trim root tag to attempt to
              var rootTag = match[2].replace(/^{\s+/, '{').replace(/\s+}$/, '}');
              var isCurlyRoot = rootTag.indexOf('{') === 0;
              var depth = 0;

              while (match) {
                var isEndTag = !!match[1];
                var tagName = match[2];
                var isSingletonTag = !!match[match.length - 1] || tagName.slice(0, 8) === "![CDATA[";

                if (!isSingletonTag && (tagName === rootTag || isCurlyRoot && tagName.replace(/^{\s+/, '{').replace(/\s+}$/, '}'))) {
                  if (isEndTag) {
                    --depth;
                  } else {
                    ++depth;
                  }
                }

                xmlStr += match[0];

                if (depth <= 0) {
                  break;
                }

                match = input.match(xmlRegExp);
              } // if we didn't close correctly, keep unformatted.


              if (!match) {
                xmlStr += input.match(/[\s\S]*/g)[0];
              }

              xmlStr = xmlStr.replace(acorn.allLineBreaks, '\n');
              return [xmlStr, "TK_STRING"];
            }
          } else {
            //
            // handle string
            //
            var parse_string = function parse_string(delimiter, allow_unescaped_newlines, start_sub) {
              // Template strings can travers lines without escape characters.
              // Other strings cannot
              var current_char;

              while (input.hasNext()) {
                current_char = input.peek();

                if (!(esc || current_char !== delimiter && (allow_unescaped_newlines || !acorn.newline.test(current_char)))) {
                  break;
                } // Handle \r\n linebreaks after escapes or in template strings


                if ((esc || allow_unescaped_newlines) && acorn.newline.test(current_char)) {
                  if (current_char === '\r' && input.peek(1) === '\n') {
                    input.next();
                    current_char = input.peek();
                  }

                  resulting_string += '\n';
                } else {
                  resulting_string += current_char;
                }

                if (esc) {
                  if (current_char === 'x' || current_char === 'u') {
                    has_char_escapes = true;
                  }

                  esc = false;
                } else {
                  esc = current_char === '\\';
                }

                input.next();

                if (start_sub && resulting_string.indexOf(start_sub, resulting_string.length - start_sub.length) !== -1) {
                  if (delimiter === '`') {
                    parse_string('}', allow_unescaped_newlines, '`');
                  } else {
                    parse_string('`', allow_unescaped_newlines, '${');
                  }

                  if (input.hasNext()) {
                    resulting_string += input.next();
                  }
                }
              }
            };

            if (sep === '`') {
              parse_string('`', true, '${');
            } else {
              parse_string(sep);
            }
          }

          if (has_char_escapes && opts.unescape_strings) {
            resulting_string = unescape_string(resulting_string);
          }

          if (input.peek() === sep) {
            resulting_string += sep;
            input.next();

            if (sep === '/') {
              // regexps may have modifiers /regexp/MOD , so fetch those, too
              // Only [gim] are valid, but if the user puts in garbage, do what we can to take it.
              while (input.hasNext() && acorn.isIdentifierStart(input.peekCharCode())) {
                resulting_string += input.next();
              }
            }
          }

          return [resulting_string, 'TK_STRING'];
        }

        if (c === '#') {
          if (tokens.length === 0 && input.peek() === '!') {
            // shebang
            resulting_string = c;

            while (input.hasNext() && c !== '\n') {
              c = input.next();
              resulting_string += c;
            }

            return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
          } // Spidermonkey-specific sharp variables for circular references
          // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
          // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935


          var sharp = '#';

          if (input.hasNext() && input.testChar(digit)) {
            do {
              c = input.next();
              sharp += c;
            } while (input.hasNext() && c !== '#' && c !== '=');

            if (c === '#') {//
            } else if (input.peek() === '[' && input.peek(1) === ']') {
              sharp += '[]';
              input.next();
              input.next();
            } else if (input.peek() === '{' && input.peek(1) === '}') {
              sharp += '{}';
              input.next();
              input.next();
            }

            return [sharp, 'TK_WORD'];
          }
        }

        if (c === '<' && (input.peek() === '?' || input.peek() === '%')) {
          input.back();
          var template_match = input.match(template_pattern);

          if (template_match) {
            c = template_match[0];
            c = c.replace(acorn.allLineBreaks, '\n');
            return [c, 'TK_STRING'];
          }
        }

        if (c === '<' && input.match(/\!--/g)) {
          c = '<!--';

          while (input.hasNext() && !input.testChar(acorn.newline)) {
            c += input.next();
          }

          in_html_comment = true;
          return [c, 'TK_COMMENT'];
        }

        if (c === '-' && in_html_comment && input.match(/->/g)) {
          in_html_comment = false;
          return ['-->', 'TK_COMMENT'];
        }

        if (c === '.') {
          if (input.peek() === '.' && input.peek(1) === '.') {
            c += input.next() + input.next();
            return [c, 'TK_OPERATOR'];
          }

          return [c, 'TK_DOT'];
        }

        if (in_array(c, punct)) {
          while (input.hasNext() && in_array(c + input.peek(), punct)) {
            c += input.next();

            if (!input.hasNext()) {
              break;
            }
          }

          if (c === ',') {
            return [c, 'TK_COMMA'];
          } else if (c === '=') {
            return [c, 'TK_EQUALS'];
          } else {
            return [c, 'TK_OPERATOR'];
          }
        }

        return [c, 'TK_UNKNOWN'];
      }

      function unescape_string(s) {
        // You think that a regex would work for this
        // return s.replace(/\\x([0-9a-f]{2})/gi, function(match, val) {
        //         return String.fromCharCode(parseInt(val, 16));
        //     })
        // However, dealing with '\xff', '\\xff', '\\\xff' makes this more fun.
        var out = '',
            escaped = 0;
        var input_scan = new InputScanner(s);
        var matched = null;

        while (input_scan.hasNext()) {
          // Keep any whitespace, non-slash characters
          // also keep slash pairs.
          matched = input_scan.match(/([\s]|[^\\]|\\\\)+/g);

          if (matched) {
            out += matched[0];
          }

          if (input_scan.peek() === '\\') {
            input_scan.next();

            if (input_scan.peek() === 'x') {
              matched = input_scan.match(/x([0-9A-Fa-f]{2})/g);
            } else if (input_scan.peek() === 'u') {
              matched = input_scan.match(/u([0-9A-Fa-f]{4})/g);
            } else {
              out += '\\';

              if (input_scan.hasNext()) {
                out += input_scan.next();
              }

              continue;
            } // If there's some error decoding, return the original string


            if (!matched) {
              return s;
            }

            escaped = parseInt(matched[1], 16);

            if (escaped > 0x7e && escaped <= 0xff && matched[0].indexOf('x') === 0) {
              // we bail out on \x7f..\xff,
              // leaving whole string escaped,
              // as it's probably completely binary
              return s;
            } else if (escaped >= 0x00 && escaped < 0x20) {
              // leave 0x00...0x1f escaped
              out += '\\' + matched[0];
              continue;
            } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
              // single-quote, apostrophe, backslash - escape these
              out += '\\' + String.fromCharCode(escaped);
            } else {
              out += String.fromCharCode(escaped);
            }
          }
        }

        return out;
      }
    }

    var beautifier = new Beautifier(js_source_text, options);
    return beautifier.beautify();
  }

  if (true) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return {
        js_beautify: js_beautify
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})();

/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 CSS Beautifier
---------------

    Written by Harutyun Amirjanyan, (amirjanyan@gmail.com)

    Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
        http://jsbeautifier.org/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                         — indentation size,
        indent_char (space)                     — character to indent with,
        preserve_newlines (default false)       - whether existing line breaks should be preserved,
        selector_separator_newline (true)       - separate selectors with newline or
                                                  not (e.g. "a,\nbr" or "a, br")
        end_with_newline (false)                - end with a newline
        newline_between_rules (true)            - add a new line after every css rule
        space_around_selector_separator (false) - ensure space around selector separators:
                                                  '>', '+', '~' (e.g. "a>b" -> "a > b")
    e.g

    css_beautify(css_source_text, {
      'indent_size': 1,
      'indent_char': '\t',
      'selector_separator': ' ',
      'end_with_newline': false,
      'newline_between_rules': true,
      'space_around_selector_separator': true
    });
*/
// http://www.w3.org/TR/CSS21/syndata.html#tokenization
// http://www.w3.org/TR/css3-syntax/
(function () {
  function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
      if (name !== targetType) {
        finalOpts[name] = allOptions[name];
      }
    } //merge in the per type settings for the targetType


    if (targetType in allOptions) {
      for (name in allOptions[targetType]) {
        finalOpts[name] = allOptions[targetType][name];
      }
    }

    return finalOpts;
  }

  var lineBreak = /\r\n|[\n\r\u2028\u2029]/;
  var allLineBreaks = new RegExp(lineBreak.source, 'g');

  function css_beautify(source_text, options) {
    options = options || {}; // Allow the setting of language/file-type specific options
    // with inheritance of overall settings

    options = mergeOpts(options, 'css');
    source_text = source_text || '';
    var newlinesFromLastWSEat = 0;
    var indentSize = options.indent_size ? parseInt(options.indent_size, 10) : 4;
    var indentCharacter = options.indent_char || ' ';
    var preserve_newlines = options.preserve_newlines === undefined ? false : options.preserve_newlines;
    var selectorSeparatorNewline = options.selector_separator_newline === undefined ? true : options.selector_separator_newline;
    var end_with_newline = options.end_with_newline === undefined ? false : options.end_with_newline;
    var newline_between_rules = options.newline_between_rules === undefined ? true : options.newline_between_rules;
    var space_around_combinator = options.space_around_combinator === undefined ? false : options.space_around_combinator;
    space_around_combinator = space_around_combinator || (options.space_around_selector_separator === undefined ? false : options.space_around_selector_separator);
    var eol = options.eol ? options.eol : 'auto';

    if (options.indent_with_tabs) {
      indentCharacter = '\t';
      indentSize = 1;
    }

    if (eol === 'auto') {
      eol = '\n';

      if (source_text && lineBreak.test(source_text || '')) {
        eol = source_text.match(lineBreak)[0];
      }
    }

    eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n'); // HACK: newline parsing inconsistent. This brute force normalizes the input.

    source_text = source_text.replace(allLineBreaks, '\n'); // tokenizer

    var whiteRe = /^\s+$/;
    var pos = -1,
        ch;
    var parenLevel = 0;

    function next() {
      ch = source_text.charAt(++pos);
      return ch || '';
    }

    function peek(skipWhitespace) {
      var result = '';
      var prev_pos = pos;

      if (skipWhitespace) {
        eatWhitespace();
      }

      result = source_text.charAt(pos + 1) || '';
      pos = prev_pos - 1;
      next();
      return result;
    }

    function eatString(endChars) {
      var start = pos;

      while (next()) {
        if (ch === "\\") {
          next();
        } else if (endChars.indexOf(ch) !== -1) {
          break;
        } else if (ch === "\n") {
          break;
        }
      }

      return source_text.substring(start, pos + 1);
    }

    function peekString(endChar) {
      var prev_pos = pos;
      var str = eatString(endChar);
      pos = prev_pos - 1;
      next();
      return str;
    }

    function eatWhitespace(preserve_newlines_local) {
      var result = 0;

      while (whiteRe.test(peek())) {
        next();

        if (ch === '\n' && preserve_newlines_local && preserve_newlines) {
          print.newLine(true);
          result++;
        }
      }

      newlinesFromLastWSEat = result;
      return result;
    }

    function skipWhitespace() {
      var result = '';

      if (ch && whiteRe.test(ch)) {
        result = ch;
      }

      while (whiteRe.test(next())) {
        result += ch;
      }

      return result;
    }

    function eatComment(singleLine) {
      var start = pos;
      singleLine = peek() === "/";
      next();

      while (next()) {
        if (!singleLine && ch === "*" && peek() === "/") {
          next();
          break;
        } else if (singleLine && ch === "\n") {
          return source_text.substring(start, pos);
        }
      }

      return source_text.substring(start, pos) + ch;
    }

    function lookBack(str) {
      return source_text.substring(pos - str.length, pos).toLowerCase() === str;
    } // Nested pseudo-class if we are insideRule
    // and the next special character found opens
    // a new block


    function foundNestedPseudoClass() {
      var openParen = 0;

      for (var i = pos + 1; i < source_text.length; i++) {
        var ch = source_text.charAt(i);

        if (ch === "{") {
          return true;
        } else if (ch === '(') {
          // pseudoclasses can contain ()
          openParen += 1;
        } else if (ch === ')') {
          if (openParen === 0) {
            return false;
          }

          openParen -= 1;
        } else if (ch === ";" || ch === "}") {
          return false;
        }
      }

      return false;
    } // printer


    var basebaseIndentString = source_text.match(/^[\t ]*/)[0];
    var singleIndent = new Array(indentSize + 1).join(indentCharacter);
    var indentLevel = 0;
    var nestedLevel = 0;

    function indent() {
      indentLevel++;
      basebaseIndentString += singleIndent;
    }

    function outdent() {
      indentLevel--;
      basebaseIndentString = basebaseIndentString.slice(0, -indentSize);
    }

    var print = {};

    print["{"] = function (ch) {
      print.singleSpace();
      output.push(ch);

      if (!eatWhitespace(true)) {
        print.newLine();
      }
    };

    print["}"] = function (newline) {
      if (newline) {
        print.newLine();
      }

      output.push('}');

      if (!eatWhitespace(true)) {
        print.newLine();
      }
    };

    print._lastCharWhitespace = function () {
      return whiteRe.test(output[output.length - 1]);
    };

    print.newLine = function (keepWhitespace) {
      if (output.length) {
        if (!keepWhitespace && output[output.length - 1] !== '\n') {
          print.trim();
        } else if (output[output.length - 1] === basebaseIndentString) {
          output.pop();
        }

        output.push('\n');

        if (basebaseIndentString) {
          output.push(basebaseIndentString);
        }
      }
    };

    print.singleSpace = function () {
      if (output.length && !print._lastCharWhitespace()) {
        output.push(' ');
      }
    };

    print.preserveSingleSpace = function () {
      if (isAfterSpace) {
        print.singleSpace();
      }
    };

    print.trim = function () {
      while (print._lastCharWhitespace()) {
        output.pop();
      }
    };

    var output = [];
    /*_____________________--------------------_____________________*/

    var insideRule = false;
    var insidePropertyValue = false;
    var enteringConditionalGroup = false;
    var top_ch = '';
    var last_top_ch = '';

    while (true) {
      var whitespace = skipWhitespace();
      var isAfterSpace = whitespace !== '';
      var isAfterNewline = whitespace.indexOf('\n') !== -1;
      last_top_ch = top_ch;
      top_ch = ch;

      if (!ch) {
        break;
      } else if (ch === '/' && peek() === '*') {
        /* css comment */
        var header = indentLevel === 0;

        if (isAfterNewline || header) {
          print.newLine();
        }

        output.push(eatComment());
        print.newLine();

        if (header) {
          print.newLine(true);
        }
      } else if (ch === '/' && peek() === '/') {
        // single line comment
        if (!isAfterNewline && last_top_ch !== '{') {
          print.trim();
        }

        print.singleSpace();
        output.push(eatComment());
        print.newLine();
      } else if (ch === '@') {
        print.preserveSingleSpace(); // deal with less propery mixins @{...}

        if (peek() === '{') {
          output.push(eatString('}'));
        } else {
          output.push(ch); // strip trailing space, if present, for hash property checks

          var variableOrRule = peekString(": ,;{}()[]/='\"");

          if (variableOrRule.match(/[ :]$/)) {
            // we have a variable or pseudo-class, add it and insert one space before continuing
            next();
            variableOrRule = eatString(": ").replace(/\s$/, '');
            output.push(variableOrRule);
            print.singleSpace();
          }

          variableOrRule = variableOrRule.replace(/\s$/, ''); // might be a nesting at-rule

          if (variableOrRule in css_beautify.NESTED_AT_RULE) {
            nestedLevel += 1;

            if (variableOrRule in css_beautify.CONDITIONAL_GROUP_RULE) {
              enteringConditionalGroup = true;
            }
          }
        }
      } else if (ch === '#' && peek() === '{') {
        print.preserveSingleSpace();
        output.push(eatString('}'));
      } else if (ch === '{') {
        if (peek(true) === '}') {
          eatWhitespace();
          next();
          print.singleSpace();
          output.push("{");
          print['}'](false);

          if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
            print.newLine(true);
          }
        } else {
          indent();
          print["{"](ch); // when entering conditional groups, only rulesets are allowed

          if (enteringConditionalGroup) {
            enteringConditionalGroup = false;
            insideRule = indentLevel > nestedLevel;
          } else {
            // otherwise, declarations are also allowed
            insideRule = indentLevel >= nestedLevel;
          }
        }
      } else if (ch === '}') {
        outdent();
        print["}"](true);
        insideRule = false;
        insidePropertyValue = false;

        if (nestedLevel) {
          nestedLevel--;
        }

        if (newlinesFromLastWSEat < 2 && newline_between_rules && indentLevel === 0) {
          print.newLine(true);
        }
      } else if (ch === ":") {
        eatWhitespace();

        if ((insideRule || enteringConditionalGroup) && !(lookBack("&") || foundNestedPseudoClass()) && !lookBack("(")) {
          // 'property: value' delimiter
          // which could be in a conditional group query
          output.push(':');

          if (!insidePropertyValue) {
            insidePropertyValue = true;
            print.singleSpace();
          }
        } else {
          // sass/less parent reference don't use a space
          // sass nested pseudo-class don't use a space
          // preserve space before pseudoclasses/pseudoelements, as it means "in any child"
          if (lookBack(" ") && output[output.length - 1] !== " ") {
            output.push(" ");
          }

          if (peek() === ":") {
            // pseudo-element
            next();
            output.push("::");
          } else {
            // pseudo-class
            output.push(':');
          }
        }
      } else if (ch === '"' || ch === '\'') {
        print.preserveSingleSpace();
        output.push(eatString(ch));
      } else if (ch === ';') {
        insidePropertyValue = false;
        output.push(ch);

        if (!eatWhitespace(true)) {
          print.newLine();
        }
      } else if (ch === '(') {
        // may be a url
        if (lookBack("url")) {
          output.push(ch);
          eatWhitespace();

          if (next()) {
            if (ch !== ')' && ch !== '"' && ch !== '\'') {
              output.push(eatString(')'));
            } else {
              pos--;
            }
          }
        } else {
          parenLevel++;
          print.preserveSingleSpace();
          output.push(ch);
          eatWhitespace();
        }
      } else if (ch === ')') {
        output.push(ch);
        parenLevel--;
      } else if (ch === ',') {
        output.push(ch);

        if (!eatWhitespace(true) && selectorSeparatorNewline && !insidePropertyValue && parenLevel < 1) {
          print.newLine();
        } else {
          print.singleSpace();
        }
      } else if ((ch === '>' || ch === '+' || ch === '~') && !insidePropertyValue && parenLevel < 1) {
        //handle combinator spacing
        if (space_around_combinator) {
          print.singleSpace();
          output.push(ch);
          print.singleSpace();
        } else {
          output.push(ch);
          eatWhitespace(); // squash extra whitespace

          if (ch && whiteRe.test(ch)) {
            ch = '';
          }
        }
      } else if (ch === ']') {
        output.push(ch);
      } else if (ch === '[') {
        print.preserveSingleSpace();
        output.push(ch);
      } else if (ch === '=') {
        // no whitespace before or after
        eatWhitespace();
        output.push('=');

        if (whiteRe.test(ch)) {
          ch = '';
        }
      } else {
        print.preserveSingleSpace();
        output.push(ch);
      }
    }

    var sweetCode = '';

    if (basebaseIndentString) {
      sweetCode += basebaseIndentString;
    }

    sweetCode += output.join('').replace(/[\r\n\t ]+$/, ''); // establish end_with_newline

    if (end_with_newline) {
      sweetCode += '\n';
    }

    if (eol !== '\n') {
      sweetCode = sweetCode.replace(/[\n]/g, eol);
    }

    return sweetCode;
  } // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule


  css_beautify.NESTED_AT_RULE = {
    "@page": true,
    "@font-face": true,
    "@keyframes": true,
    // also in CONDITIONAL_GROUP_RULE below
    "@media": true,
    "@supports": true,
    "@document": true
  };
  css_beautify.CONDITIONAL_GROUP_RULE = {
    "@media": true,
    "@supports": true,
    "@document": true
  };
  /*global define */

  if (true) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return {
        css_beautify: css_beautify
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})();

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2017 Einar Lielmanis, Liam Newman, and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <einar@jsbeautifier.org>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_inner_html (default false)  — indent <head> and <body> sections,
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    wrap_line_length (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand" | "none"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    content_unformatted (defaults to pre tag) - list of tags, that its content shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"
    preserve_newlines (default true) - whether existing line breaks before elements should be preserved
                                        Only works before elements, not inside tags or for text.
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk
    indent_handlebars (default false) - format and indent {{#foo}} and {{/foo}}
    end_with_newline (false)          - end with a newline
    extra_liners (default [head,body,/html]) -List of tags that should have an extra newline before them.

    e.g.

    style_html(html_source, {
      'indent_inner_html': false,
      'indent_size': 2,
      'indent_char': ' ',
      'wrap_line_length': 78,
      'brace_style': 'expand',
      'preserve_newlines': true,
      'max_preserve_newlines': 5,
      'indent_handlebars': false,
      'extra_liners': ['/html']
    });
*/
(function () {
  // function trim(s) {
  //     return s.replace(/^\s+|\s+$/g, '');
  // }
  function ltrim(s) {
    return s.replace(/^\s+/g, '');
  }

  function rtrim(s) {
    return s.replace(/\s+$/g, '');
  }

  function mergeOpts(allOptions, targetType) {
    var finalOpts = {};
    var name;

    for (name in allOptions) {
      if (name !== targetType) {
        finalOpts[name] = allOptions[name];
      }
    } //merge in the per type settings for the targetType


    if (targetType in allOptions) {
      for (name in allOptions[targetType]) {
        finalOpts[name] = allOptions[targetType][name];
      }
    }

    return finalOpts;
  }

  var lineBreak = /\r\n|[\n\r\u2028\u2029]/;
  var allLineBreaks = new RegExp(lineBreak.source, 'g');

  function style_html(html_source, options, js_beautify, css_beautify) {
    //Wrapper function to invoke all the necessary constructors and deal with the output.
    var multi_parser, indent_inner_html, indent_body_inner_html, indent_head_inner_html, indent_size, indent_character, wrap_line_length, brace_style, unformatted, content_unformatted, preserve_newlines, max_preserve_newlines, indent_handlebars, wrap_attributes, wrap_attributes_indent_size, is_wrap_attributes_force, is_wrap_attributes_force_expand_multiline, is_wrap_attributes_force_aligned, end_with_newline, extra_liners, eol;
    options = options || {}; // Allow the setting of language/file-type specific options
    // with inheritance of overall settings

    options = mergeOpts(options, 'html'); // backwards compatibility to 1.3.4

    if ((options.wrap_line_length === undefined || parseInt(options.wrap_line_length, 10) === 0) && options.max_char !== undefined && parseInt(options.max_char, 10) !== 0) {
      options.wrap_line_length = options.max_char;
    }

    indent_inner_html = options.indent_inner_html === undefined ? false : options.indent_inner_html;
    indent_body_inner_html = options.indent_body_inner_html === undefined ? true : options.indent_body_inner_html;
    indent_head_inner_html = options.indent_head_inner_html === undefined ? true : options.indent_head_inner_html;
    indent_size = options.indent_size === undefined ? 4 : parseInt(options.indent_size, 10);
    indent_character = options.indent_char === undefined ? ' ' : options.indent_char;
    brace_style = options.brace_style === undefined ? 'collapse' : options.brace_style;
    wrap_line_length = parseInt(options.wrap_line_length, 10) === 0 ? 32786 : parseInt(options.wrap_line_length || 250, 10);
    unformatted = options.unformatted || [// https://www.w3.org/TR/html5/dom.html#phrasing-content
    'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp',
    /* 'script', */
    'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', // prexisting - not sure of full effect of removing, leaving in
    'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'];
    content_unformatted = options.content_unformatted || ['pre'];
    preserve_newlines = options.preserve_newlines === undefined ? true : options.preserve_newlines;
    max_preserve_newlines = preserve_newlines ? isNaN(parseInt(options.max_preserve_newlines, 10)) ? 32786 : parseInt(options.max_preserve_newlines, 10) : 0;
    indent_handlebars = options.indent_handlebars === undefined ? false : options.indent_handlebars;
    wrap_attributes = options.wrap_attributes === undefined ? 'auto' : options.wrap_attributes;
    wrap_attributes_indent_size = isNaN(parseInt(options.wrap_attributes_indent_size, 10)) ? indent_size : parseInt(options.wrap_attributes_indent_size, 10);
    is_wrap_attributes_force = wrap_attributes.substr(0, 'force'.length) === 'force';
    is_wrap_attributes_force_expand_multiline = wrap_attributes === 'force-expand-multiline';
    is_wrap_attributes_force_aligned = wrap_attributes === 'force-aligned';
    end_with_newline = options.end_with_newline === undefined ? false : options.end_with_newline;
    extra_liners = _typeof(options.extra_liners) === 'object' && options.extra_liners ? options.extra_liners.concat() : typeof options.extra_liners === 'string' ? options.extra_liners.split(',') : 'head,body,/html'.split(',');
    eol = options.eol ? options.eol : 'auto';

    if (options.indent_with_tabs) {
      indent_character = '\t';
      indent_size = 1;
    }

    if (eol === 'auto') {
      eol = '\n';

      if (html_source && lineBreak.test(html_source || '')) {
        eol = html_source.match(lineBreak)[0];
      }
    }

    eol = eol.replace(/\\r/, '\r').replace(/\\n/, '\n'); // HACK: newline parsing inconsistent. This brute force normalizes the input.

    html_source = html_source.replace(allLineBreaks, '\n');

    function Parser() {
      this.pos = 0; //Parser position

      this.token = '';
      this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT

      this.tags = {
        //An object to hold tags, their position, and their parent-tags, initiated with default values
        parent: 'parent1',
        parentcount: 1,
        parent1: ''
      };
      this.tag_type = '';
      this.token_text = this.last_token = this.last_text = this.token_type = '';
      this.newlines = 0;
      this.indent_content = indent_inner_html;
      this.indent_body_inner_html = indent_body_inner_html;
      this.indent_head_inner_html = indent_head_inner_html;
      this.Utils = {
        //Uilities made available to the various functions
        whitespace: "\n\r\t ".split(''),
        single_token: options.void_elements || [// HTLM void elements - aka self-closing tags - aka singletons
        // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', // NOTE: Optional tags - are not understood.
        // https://www.w3.org/TR/html5/syntax.html#optional-tags
        // The rules for optional tags are too complex for a simple list
        // Also, the content of these tags should still be indented in many cases.
        // 'li' is a good exmple.
        // Doctype and xml elements
        '!doctype', '?xml', // ?php tag
        '?php', // other tags that were in this list, keeping just in case
        'basefont', 'isindex'],
        extra_liners: extra_liners,
        //for tags that need a line of whitespace before them
        in_array: function in_array(what, arr) {
          for (var i = 0; i < arr.length; i++) {
            if (what === arr[i]) {
              return true;
            }
          }

          return false;
        }
      }; // Return true if the given text is composed entirely of whitespace.

      this.is_whitespace = function (text) {
        for (var n = 0; n < text.length; n++) {
          if (!this.Utils.in_array(text.charAt(n), this.Utils.whitespace)) {
            return false;
          }
        }

        return true;
      };

      this.traverse_whitespace = function () {
        var input_char = '';
        input_char = this.input.charAt(this.pos);

        if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
          this.newlines = 0;

          while (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            if (preserve_newlines && input_char === '\n' && this.newlines <= max_preserve_newlines) {
              this.newlines += 1;
            }

            this.pos++;
            input_char = this.input.charAt(this.pos);
          }

          return true;
        }

        return false;
      }; // Append a space to the given content (string array) or, if we are
      // at the wrap_line_length, append a newline/indentation.
      // return true if a newline was added, false if a space was added


      this.space_or_wrap = function (content) {
        if (this.line_char_count >= this.wrap_line_length) {
          //insert a line when the wrap_line_length is reached
          this.print_newline(false, content);
          this.print_indentation(content);
          return true;
        } else {
          this.line_char_count++;
          content.push(' ');
          return false;
        }
      };

      this.get_content = function () {
        //function to capture regular content between tags
        var input_char = '',
            content = [],
            handlebarsStarted = 0;

        while (this.input.charAt(this.pos) !== '<' || handlebarsStarted === 2) {
          if (this.pos >= this.input.length) {
            return content.length ? content.join('') : ['', 'TK_EOF'];
          }

          if (handlebarsStarted < 2 && this.traverse_whitespace()) {
            this.space_or_wrap(content);
            continue;
          }

          input_char = this.input.charAt(this.pos);

          if (indent_handlebars) {
            if (input_char === '{') {
              handlebarsStarted += 1;
            } else if (handlebarsStarted < 2) {
              handlebarsStarted = 0;
            }

            if (input_char === '}' && handlebarsStarted > 0) {
              if (handlebarsStarted-- === 0) {
                break;
              }
            } // Handlebars parsing is complicated.
            // {{#foo}} and {{/foo}} are formatted tags.
            // {{something}} should get treated as content, except:
            // {{else}} specifically behaves like {{#if}} and {{/if}}


            var peek3 = this.input.substr(this.pos, 3);

            if (peek3 === '{{#' || peek3 === '{{/') {
              // These are tags and not content.
              break;
            } else if (peek3 === '{{!') {
              return [this.get_tag(), 'TK_TAG_HANDLEBARS_COMMENT'];
            } else if (this.input.substr(this.pos, 2) === '{{') {
              if (this.get_tag(true) === '{{else}}') {
                break;
              }
            }
          }

          this.pos++;
          this.line_char_count++;
          content.push(input_char); //letter at-a-time (or string) inserted to an array
        }

        return content.length ? content.join('') : '';
      };

      this.get_contents_to = function (name) {
        //get the full content of a script or style to pass to js_beautify
        if (this.pos === this.input.length) {
          return ['', 'TK_EOF'];
        }

        var content = '';
        var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
        reg_match.lastIndex = this.pos;
        var reg_array = reg_match.exec(this.input);
        var end_script = reg_array ? reg_array.index : this.input.length; //absolute end of script

        if (this.pos < end_script) {
          //get everything in between the script tags
          content = this.input.substring(this.pos, end_script);
          this.pos = end_script;
        }

        return content;
      };

      this.record_tag = function (tag) {
        //function to record a tag and its parent in this.tags Object
        if (this.tags[tag + 'count']) {
          //check for the existence of this tag type
          this.tags[tag + 'count']++;
          this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        } else {
          //otherwise initialize this tag type
          this.tags[tag + 'count'] = 1;
          this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
        }

        this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)

        this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
      };

      this.retrieve_tag = function (tag) {
        //function to retrieve the opening tag to the corresponding closer
        if (this.tags[tag + 'count']) {
          //if the openener is not in the Object we ignore it
          var temp_parent = this.tags.parent; //check to see if it's a closable tag.

          while (temp_parent) {
            //till we reach '' (the initial value);
            if (tag + this.tags[tag + 'count'] === temp_parent) {
              //if this is it use it
              break;
            }

            temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
          }

          if (temp_parent) {
            //if we caught something
            this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly

            this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
          }

          delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...

          delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself

          if (this.tags[tag + 'count'] === 1) {
            delete this.tags[tag + 'count'];
          } else {
            this.tags[tag + 'count']--;
          }
        }
      };

      this.indent_to_tag = function (tag) {
        // Match the indentation level to the last use of this tag, but don't remove it.
        if (!this.tags[tag + 'count']) {
          return;
        }

        var temp_parent = this.tags.parent;

        while (temp_parent) {
          if (tag + this.tags[tag + 'count'] === temp_parent) {
            break;
          }

          temp_parent = this.tags[temp_parent + 'parent'];
        }

        if (temp_parent) {
          this.indent_level = this.tags[tag + this.tags[tag + 'count']];
        }
      };

      this.get_tag = function (peek) {
        //function to get a full tag and parse its type
        var input_char = '',
            content = [],
            comment = '',
            space = false,
            first_attr = true,
            has_wrapped_attrs = false,
            tag_start,
            tag_end,
            tag_start_char,
            orig_pos = this.pos,
            orig_line_char_count = this.line_char_count,
            is_tag_closed = false,
            tail;
        peek = peek !== undefined ? peek : false;

        do {
          if (this.pos >= this.input.length) {
            if (peek) {
              this.pos = orig_pos;
              this.line_char_count = orig_line_char_count;
            }

            return content.length ? content.join('') : ['', 'TK_EOF'];
          }

          input_char = this.input.charAt(this.pos);
          this.pos++;

          if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            //don't want to insert unnecessary space
            space = true;
            continue;
          }

          if (input_char === "'" || input_char === '"') {
            input_char += this.get_unformatted(input_char);
            space = true;
          }

          if (input_char === '=') {
            //no space before =
            space = false;
          }

          tail = this.input.substr(this.pos - 1);

          if (is_wrap_attributes_force_expand_multiline && has_wrapped_attrs && !is_tag_closed && (input_char === '>' || input_char === '/')) {
            if (tail.match(/^\/?\s*>/)) {
              space = false;
              is_tag_closed = true;
              this.print_newline(false, content);
              this.print_indentation(content);
            }
          }

          if (content.length && content[content.length - 1] !== '=' && input_char !== '>' && space) {
            //no space after = or before >
            var wrapped = this.space_or_wrap(content);
            var indentAttrs = wrapped && input_char !== '/' && !is_wrap_attributes_force;
            space = false;

            if (is_wrap_attributes_force && input_char !== '/') {
              var force_first_attr_wrap = false;

              if (is_wrap_attributes_force_expand_multiline && first_attr) {
                var is_only_attribute = tail.match(/^\S*(="([^"]|\\")*")?\s*\/?\s*>/) !== null;
                force_first_attr_wrap = !is_only_attribute;
              }

              if (!first_attr || force_first_attr_wrap) {
                this.print_newline(false, content);
                this.print_indentation(content);
                indentAttrs = true;
              }
            }

            if (indentAttrs) {
              has_wrapped_attrs = true; //indent attributes an auto, forced, or forced-align line-wrap

              var alignment_size = wrap_attributes_indent_size;

              if (is_wrap_attributes_force_aligned) {
                alignment_size = content.indexOf(' ') + 1;
              }

              for (var count = 0; count < alignment_size; count++) {
                // only ever further indent with spaces since we're trying to align characters
                content.push(' ');
              }
            }

            if (first_attr) {
              for (var i = 0; i < content.length; i++) {
                if (content[i] === ' ') {
                  first_attr = false;
                  break;
                }
              }
            }
          }

          if (indent_handlebars && tag_start_char === '<') {
            // When inside an angle-bracket tag, put spaces around
            // handlebars not inside of strings.
            if (input_char + this.input.charAt(this.pos) === '{{') {
              input_char += this.get_unformatted('}}');

              if (content.length && content[content.length - 1] !== ' ' && content[content.length - 1] !== '<') {
                input_char = ' ' + input_char;
              }

              space = true;
            }
          }

          if (input_char === '<' && !tag_start_char) {
            tag_start = this.pos - 1;
            tag_start_char = '<';
          }

          if (indent_handlebars && !tag_start_char) {
            if (content.length >= 2 && content[content.length - 1] === '{' && content[content.length - 2] === '{') {
              if (input_char === '#' || input_char === '/' || input_char === '!') {
                tag_start = this.pos - 3;
              } else {
                tag_start = this.pos - 2;
              }

              tag_start_char = '{';
            }
          }

          this.line_char_count++;
          content.push(input_char); //inserts character at-a-time (or string)

          if (content[1] && (content[1] === '!' || content[1] === '?' || content[1] === '%')) {
            //if we're in a comment, do something special
            // We treat all comments as literals, even more than preformatted tags
            // we just look for the appropriate close tag
            content = [this.get_comment(tag_start)];
            break;
          }

          if (indent_handlebars && content[1] && content[1] === '{' && content[2] && content[2] === '!') {
            //if we're in a comment, do something special
            // We treat all comments as literals, even more than preformatted tags
            // we just look for the appropriate close tag
            content = [this.get_comment(tag_start)];
            break;
          }

          if (indent_handlebars && tag_start_char === '{' && content.length > 2 && content[content.length - 2] === '}' && content[content.length - 1] === '}') {
            break;
          }
        } while (input_char !== '>');

        var tag_complete = content.join('');
        var tag_index;
        var tag_offset; // must check for space first otherwise the tag could have the first attribute included, and
        // then not un-indent correctly

        if (tag_complete.indexOf(' ') !== -1) {
          //if there's whitespace, thats where the tag name ends
          tag_index = tag_complete.indexOf(' ');
        } else if (tag_complete.indexOf('\n') !== -1) {
          //if there's a line break, thats where the tag name ends
          tag_index = tag_complete.indexOf('\n');
        } else if (tag_complete.charAt(0) === '{') {
          tag_index = tag_complete.indexOf('}');
        } else {
          //otherwise go with the tag ending
          tag_index = tag_complete.indexOf('>');
        }

        if (tag_complete.charAt(0) === '<' || !indent_handlebars) {
          tag_offset = 1;
        } else {
          tag_offset = tag_complete.charAt(2) === '#' ? 3 : 2;
        }

        var tag_check = tag_complete.substring(tag_offset, tag_index).toLowerCase();

        if (tag_complete.charAt(tag_complete.length - 2) === '/' || this.Utils.in_array(tag_check, this.Utils.single_token)) {
          //if this tag name is a single tag type (either in the list or has a closing /)
          if (!peek) {
            this.tag_type = 'SINGLE';
          }
        } else if (indent_handlebars && tag_complete.charAt(0) === '{' && tag_check === 'else') {
          if (!peek) {
            this.indent_to_tag('if');
            this.tag_type = 'HANDLEBARS_ELSE';
            this.indent_content = true;
            this.traverse_whitespace();
          }
        } else if (this.is_unformatted(tag_check, unformatted) || this.is_unformatted(tag_check, content_unformatted)) {
          // do not reformat the "unformatted" or "content_unformatted" tags
          comment = this.get_unformatted('</' + tag_check + '>', tag_complete); //...delegate to get_unformatted function

          content.push(comment);
          tag_end = this.pos - 1;
          this.tag_type = 'SINGLE';
        } else if (tag_check === 'script' && (tag_complete.search('type') === -1 || tag_complete.search('type') > -1 && tag_complete.search(/\b(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1)) {
          if (!peek) {
            this.record_tag(tag_check);
            this.tag_type = 'SCRIPT';
          }
        } else if (tag_check === 'style' && (tag_complete.search('type') === -1 || tag_complete.search('type') > -1 && tag_complete.search('text/css') > -1)) {
          if (!peek) {
            this.record_tag(tag_check);
            this.tag_type = 'STYLE';
          }
        } else if (tag_check.charAt(0) === '!') {
          //peek for <! comment
          // for comments content is already correct.
          if (!peek) {
            this.tag_type = 'SINGLE';
            this.traverse_whitespace();
          }
        } else if (!peek) {
          if (tag_check.charAt(0) === '/') {
            //this tag is a double tag so check for tag-ending
            this.retrieve_tag(tag_check.substring(1)); //remove it and all ancestors

            this.tag_type = 'END';
          } else {
            //otherwise it's a start-tag
            this.record_tag(tag_check); //push it on the tag stack

            if (tag_check.toLowerCase() !== 'html') {
              this.indent_content = true;
            }

            this.tag_type = 'START';
          } // Allow preserving of newlines after a start or end tag


          if (this.traverse_whitespace()) {
            this.space_or_wrap(content);
          }

          if (this.Utils.in_array(tag_check, this.Utils.extra_liners)) {
            //check if this double needs an extra line
            this.print_newline(false, this.output);

            if (this.output.length && this.output[this.output.length - 2] !== '\n') {
              this.print_newline(true, this.output);
            }
          }
        }

        if (peek) {
          this.pos = orig_pos;
          this.line_char_count = orig_line_char_count;
        }

        return content.join(''); //returns fully formatted tag
      };

      this.get_comment = function (start_pos) {
        //function to return comment content in its entirety
        // this is will have very poor perf, but will work for now.
        var comment = '',
            delimiter = '>',
            matched = false;
        this.pos = start_pos;
        var input_char = this.input.charAt(this.pos);
        this.pos++;

        while (this.pos <= this.input.length) {
          comment += input_char; // only need to check for the delimiter if the last chars match

          if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) && comment.indexOf(delimiter) !== -1) {
            break;
          } // only need to search for custom delimiter for the first few characters


          if (!matched && comment.length < 10) {
            if (comment.indexOf('<![if') === 0) {
              //peek for <![if conditional comment
              delimiter = '<![endif]>';
              matched = true;
            } else if (comment.indexOf('<![cdata[') === 0) {
              //if it's a <[cdata[ comment...
              delimiter = ']]>';
              matched = true;
            } else if (comment.indexOf('<![') === 0) {
              // some other ![ comment? ...
              delimiter = ']>';
              matched = true;
            } else if (comment.indexOf('<!--') === 0) {
              // <!-- comment ...
              delimiter = '-->';
              matched = true;
            } else if (comment.indexOf('{{!--') === 0) {
              // {{!-- handlebars comment
              delimiter = '--}}';
              matched = true;
            } else if (comment.indexOf('{{!') === 0) {
              // {{! handlebars comment
              if (comment.length === 5 && comment.indexOf('{{!--') === -1) {
                delimiter = '}}';
                matched = true;
              }
            } else if (comment.indexOf('<?') === 0) {
              // {{! handlebars comment
              delimiter = '?>';
              matched = true;
            } else if (comment.indexOf('<%') === 0) {
              // {{! handlebars comment
              delimiter = '%>';
              matched = true;
            }
          }

          input_char = this.input.charAt(this.pos);
          this.pos++;
        }

        return comment;
      };

      function tokenMatcher(delimiter) {
        var token = '';

        var add = function add(str) {
          var newToken = token + str.toLowerCase();
          token = newToken.length <= delimiter.length ? newToken : newToken.substr(newToken.length - delimiter.length, delimiter.length);
        };

        var doesNotMatch = function doesNotMatch() {
          return token.indexOf(delimiter) === -1;
        };

        return {
          add: add,
          doesNotMatch: doesNotMatch
        };
      }

      this.get_unformatted = function (delimiter, orig_tag) {
        //function to return unformatted content in its entirety
        if (orig_tag && orig_tag.toLowerCase().indexOf(delimiter) !== -1) {
          return '';
        }

        var input_char = '';
        var content = '';
        var space = true;
        var delimiterMatcher = tokenMatcher(delimiter);

        do {
          if (this.pos >= this.input.length) {
            return content;
          }

          input_char = this.input.charAt(this.pos);
          this.pos++;

          if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
            if (!space) {
              this.line_char_count--;
              continue;
            }

            if (input_char === '\n' || input_char === '\r') {
              content += '\n';
              /*  Don't change tab indention for unformatted blocks.  If using code for html editing, this will greatly affect <pre> tags if they are specified in the 'unformatted array'
              for (var i=0; i<this.indent_level; i++) {
              content += this.indent_string;
              }
              space = false; //...and make sure other indentation is erased
              */

              this.line_char_count = 0;
              continue;
            }
          }

          content += input_char;
          delimiterMatcher.add(input_char);
          this.line_char_count++;
          space = true;

          if (indent_handlebars && input_char === '{' && content.length && content.charAt(content.length - 2) === '{') {
            // Handlebars expressions in strings should also be unformatted.
            content += this.get_unformatted('}}'); // Don't consider when stopping for delimiters.
          }
        } while (delimiterMatcher.doesNotMatch());

        return content;
      };

      this.get_token = function () {
        //initial handler for token-retrieval
        var token;

        if (this.last_token === 'TK_TAG_SCRIPT' || this.last_token === 'TK_TAG_STYLE') {
          //check if we need to format javascript
          var type = this.last_token.substr(7);
          token = this.get_contents_to(type);

          if (typeof token !== 'string') {
            return token;
          }

          return [token, 'TK_' + type];
        }

        if (this.current_mode === 'CONTENT') {
          token = this.get_content();

          if (typeof token !== 'string') {
            return token;
          } else {
            return [token, 'TK_CONTENT'];
          }
        }

        if (this.current_mode === 'TAG') {
          token = this.get_tag();

          if (typeof token !== 'string') {
            return token;
          } else {
            var tag_name_type = 'TK_TAG_' + this.tag_type;
            return [token, tag_name_type];
          }
        }
      };

      this.get_full_indent = function (level) {
        level = this.indent_level + level || 0;

        if (level < 1) {
          return '';
        }

        return Array(level + 1).join(this.indent_string);
      };

      this.is_unformatted = function (tag_check, unformatted) {
        //is this an HTML5 block-level link?
        if (!this.Utils.in_array(tag_check, unformatted)) {
          return false;
        }

        if (tag_check.toLowerCase() !== 'a' || !this.Utils.in_array('a', unformatted)) {
          return true;
        } //at this point we have an  tag; is its first child something we want to remain
        //unformatted?


        var next_tag = this.get_tag(true
        /* peek. */
        ); // test next_tag to see if it is just html tag (no external content)

        var tag = (next_tag || "").match(/^\s*<\s*\/?([a-z]*)\s*[^>]*>\s*$/); // if next_tag comes back but is not an isolated tag, then
        // let's treat the 'a' tag as having content
        // and respect the unformatted option

        if (!tag || this.Utils.in_array(tag[1], unformatted)) {
          return true;
        } else {
          return false;
        }
      };

      this.printer = function (js_source, indent_character, indent_size, wrap_line_length, brace_style) {
        //handles input/output and some other printing functions
        this.input = js_source || ''; //gets the input for the Parser
        // HACK: newline parsing inconsistent. This brute force normalizes the input.

        this.input = this.input.replace(/\r\n|[\r\u2028\u2029]/g, '\n');
        this.output = [];
        this.indent_character = indent_character;
        this.indent_string = '';
        this.indent_size = indent_size;
        this.brace_style = brace_style;
        this.indent_level = 0;
        this.wrap_line_length = wrap_line_length;
        this.line_char_count = 0; //count to see if wrap_line_length was exceeded

        for (var i = 0; i < this.indent_size; i++) {
          this.indent_string += this.indent_character;
        }

        this.print_newline = function (force, arr) {
          this.line_char_count = 0;

          if (!arr || !arr.length) {
            return;
          }

          if (force || arr[arr.length - 1] !== '\n') {
            //we might want the extra line
            if (arr[arr.length - 1] !== '\n') {
              arr[arr.length - 1] = rtrim(arr[arr.length - 1]);
            }

            arr.push('\n');
          }
        };

        this.print_indentation = function (arr) {
          for (var i = 0; i < this.indent_level; i++) {
            arr.push(this.indent_string);
            this.line_char_count += this.indent_string.length;
          }
        };

        this.print_token = function (text) {
          // Avoid printing initial whitespace.
          if (this.is_whitespace(text) && !this.output.length) {
            return;
          }

          if (text || text !== '') {
            if (this.output.length && this.output[this.output.length - 1] === '\n') {
              this.print_indentation(this.output);
              text = ltrim(text);
            }
          }

          this.print_token_raw(text);
        };

        this.print_token_raw = function (text) {
          // If we are going to print newlines, truncate trailing
          // whitespace, as the newlines will represent the space.
          if (this.newlines > 0) {
            text = rtrim(text);
          }

          if (text && text !== '') {
            if (text.length > 1 && text.charAt(text.length - 1) === '\n') {
              // unformatted tags can grab newlines as their last character
              this.output.push(text.slice(0, -1));
              this.print_newline(false, this.output);
            } else {
              this.output.push(text);
            }
          }

          for (var n = 0; n < this.newlines; n++) {
            this.print_newline(n > 0, this.output);
          }

          this.newlines = 0;
        };

        this.indent = function () {
          this.indent_level++;
        };

        this.unindent = function () {
          if (this.indent_level > 0) {
            this.indent_level--;
          }
        };
      };

      return this;
    }
    /*_____________________--------------------_____________________*/


    multi_parser = new Parser(); //wrapping functions Parser

    multi_parser.printer(html_source, indent_character, indent_size, wrap_line_length, brace_style); //initialize starting values

    while (true) {
      var t = multi_parser.get_token();
      multi_parser.token_text = t[0];
      multi_parser.token_type = t[1];

      if (multi_parser.token_type === 'TK_EOF') {
        break;
      }

      switch (multi_parser.token_type) {
        case 'TK_TAG_START':
          multi_parser.print_newline(false, multi_parser.output);
          multi_parser.print_token(multi_parser.token_text);

          if (multi_parser.indent_content) {
            if ((multi_parser.indent_body_inner_html || !multi_parser.token_text.match(/<body(?:.*)>/)) && (multi_parser.indent_head_inner_html || !multi_parser.token_text.match(/<head(?:.*)>/))) {
              multi_parser.indent();
            }

            multi_parser.indent_content = false;
          }

          multi_parser.current_mode = 'CONTENT';
          break;

        case 'TK_TAG_STYLE':
        case 'TK_TAG_SCRIPT':
          multi_parser.print_newline(false, multi_parser.output);
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;

        case 'TK_TAG_END':
          //Print new line only if the tag has no content and has child
          if (multi_parser.last_token === 'TK_CONTENT' && multi_parser.last_text === '') {
            var tag_name = (multi_parser.token_text.match(/\w+/) || [])[0];
            var tag_extracted_from_last_output = null;

            if (multi_parser.output.length) {
              tag_extracted_from_last_output = multi_parser.output[multi_parser.output.length - 1].match(/(?:<|{{#)\s*(\w+)/);
            }

            if (tag_extracted_from_last_output === null || tag_extracted_from_last_output[1] !== tag_name && !multi_parser.Utils.in_array(tag_extracted_from_last_output[1], unformatted)) {
              multi_parser.print_newline(false, multi_parser.output);
            }
          }

          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;

        case 'TK_TAG_SINGLE':
          // Don't add a newline before elements that should remain unformatted.
          var tag_check = multi_parser.token_text.match(/^\s*<([a-z-]+)/i);

          if (!tag_check || !multi_parser.Utils.in_array(tag_check[1], unformatted)) {
            multi_parser.print_newline(false, multi_parser.output);
          }

          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'CONTENT';
          break;

        case 'TK_TAG_HANDLEBARS_ELSE':
          // Don't add a newline if opening {{#if}} tag is on the current line
          var foundIfOnCurrentLine = false;

          for (var lastCheckedOutput = multi_parser.output.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
            if (multi_parser.output[lastCheckedOutput] === '\n') {
              break;
            } else {
              if (multi_parser.output[lastCheckedOutput].match(/{{#if/)) {
                foundIfOnCurrentLine = true;
                break;
              }
            }
          }

          if (!foundIfOnCurrentLine) {
            multi_parser.print_newline(false, multi_parser.output);
          }

          multi_parser.print_token(multi_parser.token_text);

          if (multi_parser.indent_content) {
            multi_parser.indent();
            multi_parser.indent_content = false;
          }

          multi_parser.current_mode = 'CONTENT';
          break;

        case 'TK_TAG_HANDLEBARS_COMMENT':
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'TAG';
          break;

        case 'TK_CONTENT':
          multi_parser.print_token(multi_parser.token_text);
          multi_parser.current_mode = 'TAG';
          break;

        case 'TK_STYLE':
        case 'TK_SCRIPT':
          if (multi_parser.token_text !== '') {
            multi_parser.print_newline(false, multi_parser.output);

            var text = multi_parser.token_text,
                _beautifier,
                script_indent_level = 1;

            if (multi_parser.token_type === 'TK_SCRIPT') {
              _beautifier = typeof js_beautify === 'function' && js_beautify;
            } else if (multi_parser.token_type === 'TK_STYLE') {
              _beautifier = typeof css_beautify === 'function' && css_beautify;
            }

            if (options.indent_scripts === "keep") {
              script_indent_level = 0;
            } else if (options.indent_scripts === "separate") {
              script_indent_level = -multi_parser.indent_level;
            }

            var indentation = multi_parser.get_full_indent(script_indent_level);

            if (_beautifier) {
              // call the Beautifier if avaliable
              var Child_options = function Child_options() {
                this.eol = '\n';
              };

              Child_options.prototype = options;
              var child_options = new Child_options();
              text = _beautifier(text.replace(/^\s*/, indentation), child_options);
            } else {
              // simply indent the string otherwise
              var white = text.match(/^\s*/)[0];

              var _level = white.match(/[^\n\r]*$/)[0].split(multi_parser.indent_string).length - 1;

              var reindent = multi_parser.get_full_indent(script_indent_level - _level);
              text = text.replace(/^\s*/, indentation).replace(/\r\n|\r|\n/g, '\n' + reindent).replace(/\s+$/, '');
            }

            if (text) {
              multi_parser.print_token_raw(text);
              multi_parser.print_newline(true, multi_parser.output);
            }
          }

          multi_parser.current_mode = 'TAG';
          break;

        default:
          // We should not be getting here but we don't want to drop input on the floor
          // Just output the text and move on
          if (multi_parser.token_text !== '') {
            multi_parser.print_token(multi_parser.token_text);
          }

          break;
      }

      multi_parser.last_token = multi_parser.token_type;
      multi_parser.last_text = multi_parser.token_text;
    }

    var sweet_code = multi_parser.output.join('').replace(/[\r\n\t ]+$/, ''); // establish end_with_newline

    if (end_with_newline) {
      sweet_code += '\n';
    }

    if (eol !== '\n') {
      sweet_code = sweet_code.replace(/[\n]/g, eol);
    }

    return sweet_code;
  }

  if (true) {
    // Add support for AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, __webpack_require__(249), __webpack_require__(250)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (requireamd) {
      var js_beautify = __webpack_require__(249);
      var css_beautify = __webpack_require__(250);
      return {
        html_beautify: function html_beautify(html_source, options) {
          return style_html(html_source, options, js_beautify.js_beautify, css_beautify.css_beautify);
        }
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var css_beautify, js_beautify; }
})();

/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for displaying Media objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MediaViewer =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(MediaViewer, _Crisp$View);

  /**
   * Constructor
   */
  function MediaViewer(params) {
    var _this;

    _classCallCheck(this, MediaViewer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaViewer).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Pre render
   */


  _createClass(MediaViewer, [{
    key: "prerender",
    value: function prerender() {
      if (this.model instanceof HashBrown.Models.Media === false) {
        this.model = new HashBrown.Models.Media(this.model);
      }
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var mediaSrc = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + this.model.id + '?width=800&t=' + Date.now();
      return _.div({
        class: 'editor editor--media'
      }, _.div({
        class: 'editor__header'
      }, _.span({
        class: 'editor__header__icon fa fa-file-image-o'
      }), _.h4({
        class: 'editor__header__title'
      }, this.model.name, _.span({
        class: 'editor__header__title__appendix'
      }, this.model.getContentTypeHeader()))), _.div({
        class: 'editor__body'
      }, _.if(this.model.isImage(), _.img({
        class: 'editor--media__preview',
        src: mediaSrc
      })), _.if(this.model.isVideo(), _.video({
        class: 'editor--media__preview',
        controls: true
      }, _.source({
        src: mediaSrc,
        type: this.model.getContentTypeHeader()
      }))), _.if(this.model.isAudio(), _.audio({
        class: 'editor--media__preview',
        controls: true
      }, _.source({
        src: mediaSrc,
        type: this.model.getContentTypeHeader()
      })))));
    }
  }]);

  return MediaViewer;
}(Crisp.View);

module.exports = MediaViewer;

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for Users
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var UserEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(UserEditor, _HashBrown$Views$Moda);

  /**
   * Constructor
   */
  function UserEditor(params) {
    var _this;

    _classCallCheck(this, UserEditor);

    params.title = 'Settings for "' + (params.model.fullName || params.model.username || params.model.email || params.model.id) + '"';
    params.actions = [{
      label: 'Save',
      onClick: function onClick() {
        _this.onClickSave();
      }
    }];
    params.autoFetch = false;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(UserEditor).call(this, params));
    HashBrown.Helpers.RequestHelper.customRequest('get', '/api/server/projects').then(function (projects) {
      _this.projects = projects;

      _this.fetch();
    });
    return _this;
  }
  /**
   * Event: Click save.
   */


  _createClass(UserEditor, [{
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      var newUserObject = this.model.getObject();

      if (this.newPassword) {
        newUserObject.password = this.newPassword;
      }

      HashBrown.Helpers.RequestHelper.request('post', 'user/' + this.model.id, newUserObject).then(function () {
        _this2.close();

        _this2.trigger('save', _this2.model);
      }).catch(UI.errorModal);
    }
    /**
     * Renders the username editor
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "renderUserNameEditor",
    value: function renderUserNameEditor() {
      var _this3 = this;

      return new HashBrown.Views.Widgets.Input({
        value: this.model.username,
        placeholder: 'Input the username here',
        onChange: function onChange(newValue) {
          _this3.model.username = newValue;
        }
      }).$element;
    }
    /**
     * Renders the scopes editor
     *
     * @param {String} project
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "renderScopesEditor",
    value: function renderScopesEditor(project) {
      var _this4 = this;

      return new HashBrown.Views.Widgets.Dropdown({
        value: this.model.getScopes(project),
        useMultiple: true,
        placeholder: '(no scopes)',
        options: ['connections', 'schemas'],
        onChange: function onChange(newValue) {
          _this4.model.scopes[project] = newValue;

          _this4.fetch();
        }
      }).$element;
    }
    /**
     * Renders the full name editor
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderFullNameEditor",
    value: function renderFullNameEditor() {
      var _this5 = this;

      return new HashBrown.Views.Widgets.Input({
        value: this.model.fullName,
        onChange: function onChange(newValue) {
          _this5.model.fullName = newValue;
        }
      }).$element;
    }
    /**
     * Renders the email editor
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderEmailEditor",
    value: function renderEmailEditor() {
      var _this6 = this;

      return new HashBrown.Views.Widgets.Input({
        value: this.model.email,
        onChange: function onChange(newValue) {
          _this6.model.email = newValue;
        }
      }).$element;
    }
    /**
     * Renders the password
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderPasswordEditor",
    value: function renderPasswordEditor() {
      var _this7 = this;

      var password1;
      var password2;

      var _onChange = function onChange() {
        var isMatch = password1 == password2;
        var isLongEnough = password1 && password1.length > 3;
        var isValid = isMatch && isLongEnough;

        _this7.$element.find('.modal__footer .widget--button').toggleClass('disabled', !isValid);

        var $passwordWarning = _this7.$element.find('.editor--user__password-warning');

        if (isValid) {
          _this7.newPassword = password1;
          $passwordWarning.hide();
        } else {
          $passwordWarning.show();
          _this7.newPassword = null;

          if (!isMatch) {
            $passwordWarning.html('Passwords do not match');
          } else if (!isLongEnough) {
            $passwordWarning.html('Passwords are too short');
          }
        }
      };

      return _.div({
        class: 'widget-group'
      }, new HashBrown.Views.Widgets.Input({
        placeholder: 'Type new password',
        type: 'password',
        onChange: function onChange(newValue) {
          password1 = newValue;

          _onChange();
        }
      }).$element, new HashBrown.Views.Widgets.Input({
        placeholder: 'Confirm new password',
        type: 'password',
        onChange: function onChange(newValue) {
          password2 = newValue;

          _onChange();
        }
      }).$element);
    }
    /**
     * Renders the admin editor
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderAdminEditor",
    value: function renderAdminEditor() {
      var _this8 = this;

      return new HashBrown.Views.Widgets.Input({
        type: 'checkbox',
        value: this.model.isAdmin == true,
        onChange: function onChange(newValue) {
          _this8.model.isAdmin = newValue;
          setTimeout(function () {
            _this8.fetch();
          }, 300);
        }
      }).$element;
    }
    /**
     * Renders a single field
     *
     * @return {HTMLElement} Element
     */

  }, {
    key: "renderField",
    value: function renderField(label, $content) {
      return _.div({
        class: 'widget-group'
      }, _.div({
        class: 'widget widget--label'
      }, label), $content);
    }
    /**
     * Renders this editor
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this9 = this;

      return [this.renderField('Username', this.renderUserNameEditor()), this.renderField('Full name', this.renderFullNameEditor()), this.renderField('Email', this.renderEmailEditor()), this.renderField('Password', this.renderPasswordEditor()), _.div({
        class: 'widget widget--label warning hidden editor--user__password-warning'
      }), _.if(currentUserIsAdmin() && !this.hidePermissions, this.renderField('Is admin', this.renderAdminEditor()), _.if(!this.model.isAdmin, _.div({
        class: 'widget widget--separator'
      }, 'Projects'), _.each(this.projects, function (i, project) {
        return _.div({
          class: 'widget-group'
        }, new HashBrown.Views.Widgets.Input({
          type: 'checkbox',
          value: _this9.model.hasScope(project.id),
          onChange: function onChange(newValue) {
            if (newValue) {
              _this9.model.giveScope(project.id);
            } else {
              _this9.model.removeScope(project.id);
            }
          }
        }).$element, _.div({
          class: 'widget widget--label'
        }, project.settings.info.name), _this9.renderScopesEditor(project.id));
      })))];
    }
  }]);

  return UserEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = UserEditor;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // Icons

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var icons = __webpack_require__(238).icons;
/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */


var SchemaEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(SchemaEditor, _Crisp$View);

  function SchemaEditor(params) {
    var _this;

    _classCallCheck(this, SchemaEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SchemaEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click advanced. Routes to the JSON editor
   */


  _createClass(SchemaEditor, [{
    key: "onClickAdvanced",
    value: function onClickAdvanced() {
      location.hash = location.hash.replace('/schemas/', '/schemas/json/');
    }
    /**
     * Event: Click save. Posts the model to the modelUrl
     */

  }, {
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      if (this.jsonEditor && this.jsonEditor.isValid == false) {
        return;
      }

      this.$saveBtn.toggleClass('working', true);
      HashBrown.Helpers.RequestHelper.request('post', 'schemas/' + Crisp.Router.params.id, this.model).then(function (schema) {
        _this2.$saveBtn.toggleClass('working', false);

        return HashBrown.Helpers.RequestHelper.reloadResource('schemas');
      }).then(function () {
        Crisp.View.get('NavbarMain').reload(); // If id changed, change the hash

        if (Crisp.Router.params.id != _this2.model.id) {
          location.hash = '/schemas/' + _this2.model.id;
        }
      }).catch(function (e) {
        UI.errorModal(e);

        _this2.$saveBtn.toggleClass('working', false);
      });
    }
    /**
     * Renders the icon editor
     *  
     * @return {Object} element
     */

  }, {
    key: "renderIconEditor",
    value: function renderIconEditor() {
      var _this3 = this;

      return _.button({
        class: 'widget small widget--button fa fa-' + this.getIcon()
      }).click(function (e) {
        var modal = new HashBrown.Views.Modals.IconModal();
        modal.on('change', function (newIcon) {
          _this3.model.icon = newIcon;
          e.currentTarget.className = 'widget small widget--button fa fa-' + _this3.model.icon;
        });
      });
    }
    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} content
     * @param {Boolean} isVertical
     * @param {Boolean} isLocked
     *
     * @return {HTMLElement} Editor element
     */

  }, {
    key: "renderField",
    value: function renderField(label, $content, isVertical, isLocked) {
      if (!$content) {
        return;
      }

      return _.div({
        class: 'editor__field ' + (isVertical ? 'vertical' : '')
      }, _.div({
        class: 'editor__field__key'
      }, label), _.div({
        class: 'editor__field__value'
      }, _.if(isLocked, _.input({
        class: 'editor__field__value__lock',
        title: 'Only edit this field if you know what you\'re doing',
        type: 'checkbox',
        checked: true
      })), $content));
    }
    /**
     * Renders all fields
     *
     * @return {Object} element
     */

  }, {
    key: "renderFields",
    value: function renderFields() {
      var _this4 = this;

      var id = parseInt(this.model.id);

      var $element = _.div({
        class: 'editor__body'
      });

      $element.empty();
      $element.append(this.renderField('Id', new HashBrown.Views.Widgets.Input({
        value: this.model.id,
        onChange: function onChange(newValue) {
          _this4.model.id = newValue;
        }
      }).$element, false, true));
      $element.append(this.renderField('Name', new HashBrown.Views.Widgets.Input({
        value: this.model.name,
        onChange: function onChange(newValue) {
          _this4.model.name = newValue;
        }
      }).$element));
      $element.append(this.renderField('Icon', this.renderIconEditor()));
      $element.append(this.renderField('Parent', new HashBrown.Views.Widgets.Dropdown({
        value: this.model.parentSchemaId,
        options: resources.schemas,
        valueKey: 'id',
        labelKey: 'name',
        disabledOptions: [{
          id: this.model.id,
          name: this.model.name
        }],
        onChange: function onChange(newParent) {
          _this4.model.parentSchemaId = newParent;

          _this4.fetch();
        }
      }).$element));
      return $element;
    }
    /**
     * Gets the schema icon
     *
     * @returns {String} Icon
     */

  }, {
    key: "getIcon",
    value: function getIcon() {
      if (this.model.icon) {
        return this.model.icon;
      }

      if (this.parentSchema && this.parentSchema.icon) {
        return this.parentSchema.icon;
      }

      return 'cogs';
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this5 = this;

      return _.div({
        class: 'editor editor--schema' + (this.model.isLocked ? ' locked' : '')
      }, _.div({
        class: 'editor__header'
      }, _.span({
        class: 'editor__header__icon fa fa-' + this.getIcon()
      }), _.h4({
        class: 'editor__header__title'
      }, this.model.name)), this.renderFields(), _.div({
        class: 'editor__footer'
      }, _.div({
        class: 'editor__footer__buttons'
      }, _.button({
        class: 'widget widget--button embedded'
      }, 'Advanced').click(function () {
        _this5.onClickAdvanced();
      }), _.if(!this.model.isLocked, this.$saveBtn = _.button({
        class: 'widget widget--button editor__footer__buttons__save'
      }, _.span({
        class: 'widget--button__text-default'
      }, 'Save '), _.span({
        class: 'widget--button__text-working'
      }, 'Saving ')).click(function () {
        _this5.onClickSave();
      })))));
    }
  }]);

  return SchemaEditor;
}(Crisp.View);

module.exports = SchemaEditor;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for Content Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ContentSchemaEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(ContentSchemaEditor, _HashBrown$Views$Edit);

  function ContentSchemaEditor() {
    _classCallCheck(this, ContentSchemaEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContentSchemaEditor).apply(this, arguments));
  }

  _createClass(ContentSchemaEditor, [{
    key: "getParentTabs",

    /**
     * Gets parent tabs
     *
     * @returns {Object} Parent tabs
     */
    value: function getParentTabs() {
      if (!this.parentSchema) {
        return {};
      }

      return this.parentSchema.tabs;
    }
    /**
     * Gets all tabs
     *
     * @returns {Object} All tabs
     */

  }, {
    key: "getAllTabs",
    value: function getAllTabs() {
      var allTabs = {};
      var parentTabs = this.getParentTabs();

      for (var tabId in parentTabs) {
        allTabs[tabId] = parentTabs[tabId];
      }

      for (var _tabId in this.model.tabs) {
        allTabs[_tabId] = this.model.tabs[_tabId];
      }

      return allTabs;
    }
    /**
     * Gets parent properties
     *
     * @param {String} tabId
     *
     * @returns {Object} Parent properties
     */

  }, {
    key: "getParentProperties",
    value: function getParentProperties(tabId) {
      var parentProperties = {};

      if (!this.parentSchema) {
        return parentProperties;
      }

      for (var key in this.parentSchema.fields.properties) {
        // If a tab is specified, we only want properties in this tab
        if (tabId && this.parentSchema.fields.properties[key].tabId !== tabId) {
          continue;
        }

        parentProperties[key] = this.parentSchema.fields.properties[key];
      }

      return parentProperties;
    }
    /**
     * Renders the editor fields
     */

  }, {
    key: "renderFields",
    value: function renderFields() {
      var _this = this;

      var $element = _get(_getPrototypeOf(ContentSchemaEditor.prototype), "renderFields", this).call(this); // Allowed child Schemas


      $element.append(this.renderField('Allowed child Schemas', new HashBrown.Views.Widgets.Dropdown({
        options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('content'),
        value: this.model.allowedChildSchemas,
        labelKey: 'name',
        valueKey: 'id',
        useMultiple: true,
        useClearButton: true,
        useTypeAhead: true,
        onChange: function onChange(newValue) {
          _this.model.allowedChildSchemas = newValue;
        }
      }).$element)); // Default tab

      var defaultTabEditor = new HashBrown.Views.Widgets.Dropdown({
        options: this.getAllTabs(),
        useClearButton: true,
        value: this.model.defaultTabId,
        onChange: function onChange(newValue) {
          _this.model.defaultTabId = newValue;
        }
      });

      if (!this.model.defaultTabId && this.parentSchema) {
        this.model.defaultTabId = this.parentSchema.defaultTabId;
      }

      $element.append(this.renderField('Default tab', defaultTabEditor.$element)); // Tabs

      $element.append(this.renderField('Tabs', new HashBrown.Views.Widgets.Chips({
        disabledValue: Object.values(this.getParentTabs()),
        value: Object.values(this.model.tabs),
        placeholder: 'New tab',
        onChange: function onChange(newValue) {
          var newTabs = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = newValue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var tab = _step.value;
              newTabs[tab.toLowerCase().replace(/[^a-zA-Z]/g, '')] = tab;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this.model.tabs = newTabs;
          defaultTabEditor.options = _this.getAllTabs();
          defaultTabEditor.fetch();
          renderFieldProperties();
        }
      }).$element)); // Field properties

      var $tabs = _.div({
        class: 'editor--schema__tabs'
      });

      var $fieldProperties = _.div({
        class: 'editor__field'
      });

      var $parentFieldProperties = _.div({
        class: 'editor__field editor--schema__parent-field-properties'
      });

      $element.append($tabs);
      $element.append($parentFieldProperties);
      $element.append($fieldProperties);

      var renderFieldProperties = function renderFieldProperties() {
        // Render tabs
        if (!_this.currentTab) {
          _this.currentTab = Object.keys(_this.getAllTabs())[0] || 'meta';
        }

        _.append($tabs.empty(), _.each(_this.getAllTabs(), function (id, name) {
          return _.button({
            class: 'editor--schema__tab' + (_this.currentTab === id ? ' active' : '')
          }, name).click(function () {
            _this.currentTab = id;
            renderFieldProperties();
          });
        }), _.button({
          class: 'editor--schema__tab' + (_this.currentTab === 'meta' ? ' active' : '')
        }, 'meta').click(function () {
          _this.currentTab = 'meta';
          renderFieldProperties();
        })); // Render parent Schema's field properties


        _.append($parentFieldProperties.empty(), _.if(Object.keys(_this.getParentProperties(_this.currentTab)).length > 0, _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, 'Parent properties'), _.div({
          class: 'editor__field__key__description'
        }, 'Properties that are inherited and can be changed if you add them to this Schema')), _.div({
          class: 'editor__field__value'
        }, _.each(_this.getParentProperties(_this.currentTab), function (fieldKey, fieldValue) {
          if (_this.model.fields.properties[fieldKey]) {
            return;
          }

          return _.button({
            class: 'widget widget--button condensed',
            title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'
          }, _.span({
            class: 'fa fa-plus'
          }), fieldValue.label || fieldKey).click(function () {
            var newProperties = {};
            newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

            for (var key in _this.model.fields.properties) {
              newProperties[key] = _this.model.fields.properties[key];
            }

            _this.model.fields.properties = newProperties;
            renderFieldProperties();
          });
        })))); // Render this Schema's fields


        _.append($fieldProperties.empty(), _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, 'Properties'), _.div({
          class: 'editor__field__key__description'
        }, 'This Schema\'s own properties'), _.div({
          class: 'editor__field__key__actions'
        }, _.button({
          class: 'editor__field__key__action editor__field__key__action--sort'
        }).click(function (e) {
          HashBrown.Helpers.UIHelper.fieldSortableObject(_this.model.fields.properties, $(e.currentTarget).parents('.editor__field')[0], function (newProperties) {
            _this.model.fields.properties = newProperties;
          });
        }))), _.div({
          class: 'editor__field__value segmented'
        }, _.each(_this.model.fields.properties, function (fieldKey, fieldValue) {
          if (!fieldValue) {
            return;
          }

          var isValidTab = !!_this.getAllTabs()[fieldValue.tabId];

          if (isValidTab && fieldValue.tabId !== _this.currentTab) {
            return;
          }

          if (!isValidTab && _this.currentTab !== 'meta') {
            return;
          }

          var $field = _.div({
            class: 'editor__field'
          }); // Sanity check


          fieldValue.config = fieldValue.config || {};
          fieldValue.schemaId = fieldValue.schemaId || 'array';

          var renderField = function renderField() {
            _.append($field.empty(), _.div({
              class: 'editor__field__sort-key'
            }, fieldKey), _.div({
              class: 'editor__field__value'
            }, _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Tab'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Dropdown({
              useClearButton: true,
              options: _this.getAllTabs(),
              value: fieldValue.tabId,
              onChange: function onChange(newValue) {
                fieldValue.tabId = newValue;
                renderFieldProperties();
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Key'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A variable name, e.g. "myField"',
              tooltip: 'The field variable name',
              value: fieldKey,
              onChange: function onChange(newKey) {
                if (!newKey) {
                  return;
                }

                var newProperties = {}; // Insert the changed key into the correct place in the object

                for (var key in _this.model.fields.properties) {
                  if (key === fieldKey) {
                    newProperties[newKey] = _this.model.fields.properties[fieldKey];
                  } else {
                    newProperties[key] = _this.model.fields.properties[key];
                  }
                } // Change internal reference to new key


                fieldKey = newKey; // Reassign the properties object

                _this.model.fields.properties = newProperties; // Update the sort key

                $field.find('.editor__field__sort-key').html(fieldKey);
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Label'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A label, e.g. "My field"',
              tooltip: 'The field label',
              value: fieldValue.label,
              onChange: function onChange(newValue) {
                fieldValue.label = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Description'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A description',
              tooltip: 'The field description',
              value: fieldValue.description,
              onChange: function onChange(newValue) {
                fieldValue.description = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Multilingual'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'checkbox',
              tooltip: 'Whether or not this field should support multiple languages',
              value: fieldValue.multilingual || false,
              onChange: function onChange(newValue) {
                fieldValue.multilingual = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Schema'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Dropdown({
              useTypeAhead: true,
              options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field'),
              value: fieldValue.schemaId,
              labelKey: 'name',
              valueKey: 'id',
              onChange: function onChange(newValue) {
                fieldValue.schemaId = newValue;
                renderField();
              }
            }).$element)), _.do(function () {
              var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(fieldValue.schemaId);

              if (!schema) {
                return;
              }

              var editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

              if (!editor) {
                return;
              }

              fieldValue.config = fieldValue.config || {};
              return editor.renderConfigEditor(fieldValue.config);
            })), _.div({
              class: 'editor__field__actions'
            }, _.button({
              class: 'editor__field__action editor__field__action--remove',
              title: 'Remove field'
            }).click(function () {
              delete _this.model.fields.properties[fieldKey];
              renderFieldProperties();
            })));
          };

          renderField();
          return $field;
        }), _.button({
          title: 'Add a Content property',
          class: 'editor__field__add widget widget--button round fa fa-plus'
        }).click(function () {
          if (_this.model.fields.properties.newField) {
            return;
          }

          _this.model.fields.properties.newField = {
            label: 'New field',
            schemaId: 'array',
            tabId: _this.currentTab
          };
          renderFieldProperties();
        })));
      };

      renderFieldProperties();
      return $element;
    }
  }]);

  return ContentSchemaEditor;
}(HashBrown.Views.Editors.SchemaEditor);

module.exports = ContentSchemaEditor;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for field Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FieldSchemaEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(FieldSchemaEditor, _HashBrown$Views$Edit);

  function FieldSchemaEditor() {
    _classCallCheck(this, FieldSchemaEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(FieldSchemaEditor).apply(this, arguments));
  }

  _createClass(FieldSchemaEditor, [{
    key: "prerender",

    /**
     * Pre render
     */
    value: function prerender() {
      if (!this.model.editorId && this.parentSchema) {
        this.model.editorId = this.parentSchema.editorId;
      }
    }
    /**
     * Renders the field config editor
     *
     * @returns {HTMLElement} Editor element
     */

  }, {
    key: "renderFieldConfigEditor",
    value: function renderFieldConfigEditor() {
      var editor = HashBrown.Views.Editors.FieldEditors[this.model.editorId];

      if (!editor) {
        return;
      }

      return _.div({
        class: 'config'
      }, editor.renderConfigEditor(this.model.config, this.model.id));
    }
    /**
     * Renders the editor fields
     */

  }, {
    key: "renderFields",
    value: function renderFields() {
      var _this = this;

      var $element = _get(_getPrototypeOf(FieldSchemaEditor.prototype), "renderFields", this).call(this);

      $element.append(this.renderField('Field editor', new HashBrown.Views.Widgets.Dropdown({
        useTypeahead: true,
        value: this.model.editorId,
        options: HashBrown.Views.Editors.FieldEditors,
        valueKey: 'name',
        labelKey: 'name',
        onChange: function onChange(newEditor) {
          _this.model.editorId = newEditor;

          _this.fetch();
        }
      }).$element));
      $element.append(this.renderField('Config', this.renderFieldConfigEditor(), true));
      return $element;
    }
  }]);

  return FieldSchemaEditor;
}(HashBrown.Views.Editors.SchemaEditor);

module.exports = FieldSchemaEditor;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Editors.FieldEditors
 */

namespace('Views.Editors.FieldEditors').add(__webpack_require__(258)).add(__webpack_require__(259)).add(__webpack_require__(260)).add(__webpack_require__(261)).add(__webpack_require__(262)).add(__webpack_require__(263)).add(__webpack_require__(264)).add(__webpack_require__(265)).add(__webpack_require__(266)).add(__webpack_require__(267)).add(__webpack_require__(268)).add(__webpack_require__(269)).add(__webpack_require__(270)).add(__webpack_require__(271)).add(__webpack_require__(272)).add(__webpack_require__(273));

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The base for all field editors
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FieldEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(FieldEditor, _Crisp$View);

  function FieldEditor() {
    _classCallCheck(this, FieldEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(FieldEditor).apply(this, arguments));
  }

  _createClass(FieldEditor, [{
    key: "renderKeyActions",

    /**
     * Renders key actions
     *
     * @returns {HTMLElement} Actions
     */
    value: function renderKeyActions() {}
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      if (!this.$keyActions) {
        return;
      }

      _.append(this.$keyActions.empty(), this.renderKeyActions());
    }
  }], [{
    key: "renderConfigEditor",

    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    value: function renderConfigEditor(config) {
      return null;
    }
  }]);

  return FieldEditor;
}(Crisp.View);

module.exports = FieldEditor;

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An array editor for editing a list of other field values
 *
 * @description Example:
 * <pre>
 * {
 *     "myArray": {
 *         "label": "My array",
 *         "tabId": "content",
 *         "schemaId": "array",
 *         "config": {
 *             "allowedSchemas": [ "string", "mediaReference", "myCustomSchema" ],
 *             "minItems": 5,
 *             "maxItems": 5
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ArrayEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(ArrayEditor, _HashBrown$Views$Edit);

  /**
   * Constructor
   */
  function ArrayEditor(params) {
    var _this;

    _classCallCheck(this, ArrayEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ArrayEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Render key actions
   *
   * @returns {HTMLElement} Actions
   */


  _createClass(ArrayEditor, [{
    key: "renderKeyActions",
    value: function renderKeyActions() {
      var _this2 = this;

      if (!this.value || this.value.length < 1 || this.config.useGrid) {
        return;
      }

      return [_.button({
        class: 'editor__field__key__action editor__field__key__action--sort'
      }).click(function (e) {
        HashBrown.Helpers.UHashBrown.Helpers.IHelper.fieldSortableArray(_this2.value, $(e.currentTarget).parents('.editor__field')[0], function (newArray) {
          _this2.value = newArray;

          _this2.trigger('change', _this2.value);
        });
      }), _.button({
        class: 'editor__field__key__action editor__field__key__action--collapse'
      }, 'Collapse all').click(function (e) {
        Array.from(_this2.element.children).forEach(function (field) {
          field.classList.toggle('collapsed', true);
        });
      }), _.button({
        class: 'editor__field__key__action editor__field__key__action--expand'
      }, 'Expand all').click(function (e) {
        Array.from(_this2.element.children).forEach(function (field) {
          field.classList.toggle('collapsed', false);
        });
      })];
    }
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "sanityCheck",

    /**
     * Sanity check
     */
    value: function sanityCheck() {
      var _this3 = this;

      // The value was null
      if (!this.value) {
        this.value = [];
      } // Config


      this.config = this.config || {}; // Sanity check for allowed Schemas array

      this.config.allowedSchemas = this.config.allowedSchemas || []; // The value was not an array, recover the items

      if (!Array.isArray(this.value)) {
        debug.log('Restructuring array from old format...', this); // If this value isn't using the old system, we can't recover it

        if (!Array.isArray(this.value.items) || !Array.isArray(this.value.schemaBindings)) {
          return UI.errorModal(new Error('The type "' + _typeof(this.value) + '" of the value is incorrect or corrupted'));
        }

        var newItems = []; // Restructure "items" array into objects

        for (var i in this.value.items) {
          newItems[i] = {
            value: this.value.items[i]
          }; // Try to get the Schema id

          if (this.value.schemaBindings[i]) {
            newItems[i].schemaId = this.value.schemaBindings[i]; // If we couldn't find it, just use the first allowed Schema
          } else {
            newItems[i].schemaId = this.config.allowedSchemas[0];
          }
        }

        this.value = newItems;
        setTimeout(function () {
          _this3.trigger('silentchange', _this3.value);
        }, 500);
      } // The value was below the required amount


      if (this.value.length < this.config.minItems) {
        var diff = this.config.minItems - this.value.length;

        for (var _i = 0; _i < diff; _i++) {
          this.value.push({
            value: null,
            schemaId: null
          });
        }
      } // The value was above the required amount


      if (this.value.length > this.config.maxItems) {
        for (var _i2 = this.config.maxItems; _i2 < this.value.length; _i2++) {
          delete this.value[_i2];
        }
      }
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      this.sanityCheck();
    }
    /**
     * Gets the label of an item
     *
     * @param {Object} item
     * @param {Schema} schema
     *
     * @return {String} Label
     */

  }, {
    key: "getItemLabel",
    value: function getItemLabel(item, schema) {
      if (schema.config) {
        if (schema.config.label && item.value && item.value[schema.config.label]) {
          return item.value[schema.config.label];
        }
      }

      if (item.value !== null && item.value !== undefined && typeof item.value === 'string' || typeof item.value === 'number') {
        return item.value;
      }

      return schema.name;
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this4 = this;

      return _.div({
        class: 'editor__field__value segmented ' + (this.config.useGrid ? 'grid' : '')
      }, _.each(this.value, function (i, item) {
        // Render field
        var $field = _.div({
          class: 'editor__field'
        });

        var renderField = function renderField() {
          var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId); // Schema could not be found, assign first allowed Schema

          if (!schema || _this4.config.allowedSchemas.indexOf(item.schemaId) < 0) {
            item.schemaId = _this4.config.allowedSchemas[0];
            schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);
          }

          if (!schema) {
            UI.errorModal(new Error('Item #' + i + ' has no available Schemas'));
            $field = null;
            return;
          } // Obtain the field editor


          if (schema.editorId.indexOf('Editor') < 0) {
            schema.editorId = schema.editorId[0].toUpperCase() + schema.editorId.substring(1) + 'Editor';
          }

          var editorClass = HashBrown.Views.Editors.FieldEditors[schema.editorId];

          if (!editorClass) {
            UI.errorModal(new Error('The field editor "' + schema.editorId + '" for Schema "' + schema.name + '" was not found'));
            $field = null;
            return;
          } // Perform sanity check on item value


          item.value = HashBrown.Helpers.ContentHelper.fieldSanityCheck(item.value, schema); // Init the field editor

          var editorInstance = new editorClass({
            value: item.value,
            config: schema.config,
            schema: schema
          }); // Hook up the change event

          editorInstance.on('change', function (newValue) {
            item.value = newValue;
          });
          editorInstance.on('silentchange', function (newValue) {
            item.value = newValue;
          }); // Render Schema picker

          if (_this4.config.allowedSchemas.length > 1) {
            editorInstance.$element.prepend(_.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Schema'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Dropdown({
              value: item.schemaId,
              placeholder: 'Schema',
              valueKey: 'id',
              labelKey: 'name',
              iconKey: 'icon',
              options: resources.schemas.filter(function (schema) {
                return _this4.config.allowedSchemas.indexOf(schema.id) > -1;
              }),
              onChange: function onChange(newSchemaId) {
                item.schemaId = newSchemaId;
                item.value = null;
                renderField();

                _this4.trigger('change', _this4.value);
              }
            }).$element)));
          }

          _.append($field.empty(), _.div({
            class: 'editor__field__sort-key'
          }, _this4.getItemLabel(item, schema)), editorInstance.$element, _.div({
            class: 'editor__field__actions'
          }, _.if(!_this4.config.useGrid, _.button({
            class: 'editor__field__action editor__field__action--collapse',
            title: 'Collapse/expand item'
          }).click(function () {
            $field.toggleClass('collapsed');
          })), _.button({
            class: 'editor__field__action editor__field__action--remove',
            title: 'Remove item'
          }).click(function () {
            _this4.value.splice(i, 1);

            _this4.trigger('change', _this4.value);

            _this4.fetch();
          })));
        };

        renderField();
        return $field;
      }), _.button({
        title: 'Add an item',
        class: 'editor__field__add widget widget--button round fa fa-plus'
      }).click(function () {
        var index = _this4.value.length;

        if (_this4.config.maxItems && index >= _this4.config.maxItems) {
          UI.messageModal('Item maximum reached', 'You  can maximum add ' + _this4.config.maxItems + ' items here');
          return;
        }

        _this4.value[index] = {
          value: null,
          schemaId: null
        };

        _this4.trigger('change', _this4.value); // Restore the scroll position with 100ms delay


        HashBrown.Views.Editors.ContentEditor.restoreScrollPos(100);

        _this4.fetch();
      }));
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Min items'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: 'number',
        min: 0,
        step: 1,
        tooltip: 'How many items are required in this array (0 is unlimited)',
        value: config.minItems || 0,
        onChange: function onChange(newValue) {
          config.minItems = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Max items'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: 'number',
        min: 0,
        step: 1,
        tooltip: 'How many items are allowed in this array (0 is unlimited)',
        value: config.maxItems || 0,
        onChange: function onChange(newValue) {
          config.maxItems = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Allowed Schemas'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        useMultiple: true,
        useTypeAhead: true,
        labelKey: 'name',
        valueKey: 'id',
        value: config.allowedSchemas,
        useClearButton: true,
        options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field'),
        onChange: function onChange(newValue) {
          config.allowedSchemas = newValue;
        }
      }).$element))];
    }
  }]);

  return ArrayEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = ArrayEditor;

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple boolean editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myBoolean": {
 *         "label": "My boolean",
 *         "tabId": "content",
 *         "schemaId": "boolean"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BooleanEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(BooleanEditor, _HashBrown$Views$Edit);

  /**
   * Constructor
   */
  function BooleanEditor(params) {
    var _this;

    _classCallCheck(this, BooleanEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BooleanEditor).call(this, params)); // Sanity check

    if (typeof _this.value === 'undefined') {
      _this.value = false;
    } else if (typeof _this.value === 'string') {
      _this.value = _this.value == 'true';
    } else if (typeof _this.value !== 'boolean') {
      _this.value = false;
    } // Just to make sure the model has the right type of value


    setTimeout(function () {
      _this.trigger('silentchange', _this.value);
    }, 20);

    _this.fetch();

    return _this;
  }
  /**
   * Render this editor
   */


  _createClass(BooleanEditor, [{
    key: "template",
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value field-editor--boolean'
      }, new HashBrown.Views.Widgets.Input({
        type: 'checkbox',
        value: this.value,
        tooltip: this.description || '',
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }).$element);
    }
  }]);

  return BooleanEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = BooleanEditor;

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for referring to other Content
 *
 * @description Example:
 * <pre>
 * {
 *     "myContentReference": {
 *         "label": "My content reference",
 *         "tabId": "content",
 *         "schemaId": "contentReference",
 *         "config": {
 *            "allowedSchemas": [ "page", "myCustomSchema" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ContentReferenceEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(ContentReferenceEditor, _HashBrown$Views$Edit);

  function ContentReferenceEditor(params) {
    var _this;

    _classCallCheck(this, ContentReferenceEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentReferenceEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Change value
   */


  _createClass(ContentReferenceEditor, [{
    key: "onChange",
    value: function onChange(newValue) {
      this.value = newValue;
      this.trigger('change', this.value);
    }
    /**
     * Gets a list of allowed Content options
     *
     * @returns {Array} List of options
     */

  }, {
    key: "getDropdownOptions",
    value: function getDropdownOptions() {
      var allowedContent = [];
      var areRulesDefined = this.config && Array.isArray(this.config.allowedSchemas) && this.config.allowedSchemas.length > 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = resources.content[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var content = _step.value;

          if (areRulesDefined) {
            var isContentAllowed = this.config.allowedSchemas.indexOf(content.schemaId) > -1;

            if (!isContentAllowed) {
              continue;
            }
          }

          allowedContent[allowedContent.length] = {
            title: content.prop('title', window.language) || content.id,
            id: content.id
          };
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return allowedContent;
    }
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "template",

    /**
     * Render this editor
     */
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, [new HashBrown.Views.Widgets.Dropdown({
        value: this.value,
        options: this.getDropdownOptions(),
        useTypeAhead: true,
        valueKey: 'id',
        useClearButton: true,
        tooltip: this.description || '',
        labelKey: 'title',
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }).$element]);
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      config.allowedSchemas = config.allowedSchemas || [];
      return _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Allowed Schemas'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('content'),
        useMultiple: true,
        value: config.allowedSchemas,
        useClearButton: true,
        valueKey: 'id',
        labelKey: 'name',
        onChange: function onChange(newValue) {
          config.allowedSchemas = newValue;
        }
      }).$element));
    }
  }]);

  return ContentReferenceEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = ContentReferenceEditor;

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for referencing Content Schemas
 *
 * @descripton Example:
 * <pre>
 * {
 *     "myContentSchemaReference": {
 *         "label": "My content schema reference",
 *         "tabId": "content",
 *         "schemaId": "contentSchemaReference",
 *         "config": {
 *             "allowedSchemas": "fromParent" || [ "myCustomSchema" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ContentSchemaReferenceEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(ContentSchemaReferenceEditor, _HashBrown$Views$Edit);

  function ContentSchemaReferenceEditor(params) {
    var _this;

    _classCallCheck(this, ContentSchemaReferenceEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ContentSchemaReferenceEditor).call(this, params)); // Adopt allowed Schemas from parent if applicable

    var parentSchema = _this.getParentSchema();

    if (parentSchema && _this.config && _this.config.allowedSchemas == 'fromParent') {
      _this.config.allowedSchemas = parentSchema.allowedChildSchemas;
    }

    _this.fetch();

    return _this;
  }
  /**
   * Gets the parent Schema
   *
   * @returns {Schema} Parentn Schema
   */


  _createClass(ContentSchemaReferenceEditor, [{
    key: "getParentSchema",
    value: function getParentSchema() {
      // Return config parent Schema if available
      if (this.config.parentSchema) {
        return this.config.parentSchema;
      } // Fetch current ContentEditor


      var contentEditor = Crisp.View.get('ContentEditor');

      if (!contentEditor) {
        return null;
      } // Fetch current Content model


      var thisContent = contentEditor.model;

      if (!thisContent) {
        return null;
      } // Fetch parent Content


      if (!thisContent.parentId) {
        return null;
      }

      var parentContent = HashBrown.Helpers.ContentHelper.getContentByIdSync(thisContent.parentId);

      if (!parentContent) {
        UI.errorModal(new Error('Content by id "' + thisContent.parentId + '" not found'));
        return null;
      } // Fetch parent Schema


      var parentSchema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(parentContent.schemaId);

      if (!parentSchema) {
        UI.errorModal(new Error('Schema by id "' + parentContent.schemaId + '" not found'));
        return null;
      } // Return parent Schema


      return parentSchema;
    }
    /**
     * Gets schema types
     *
     * @returns {Array} List of options
     */

  }, {
    key: "getDropdownOptions",
    value: function getDropdownOptions() {
      var contentSchemas = [];

      for (var i in window.resources.schemas) {
        var schema = window.resources.schemas[i];
        var isNative = schema.id == 'page' || schema.id == 'contentBase';

        if (schema.type == 'content' && !isNative && (!this.config || !this.config.allowedSchemas || !Array.isArray(this.config.allowedSchemas) || this.config.allowedSchemas.indexOf(schema.id) > -1)) {
          contentSchemas[contentSchemas.length] = {
            name: schema.name,
            id: schema.id
          };
        }
      }

      return contentSchemas;
    }
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "pickFirstSchema",

    /**
     * Picks the first available Schema
     */
    value: function pickFirstSchema() {
      var options = this.getDropdownOptions();

      if (options.length < 1) {
        return;
      }

      this.value = options[0].id;
      this.trigger('change', this.value);
      this.fetch();
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: this.value,
        options: this.getDropdownOptions(),
        valueKey: 'id',
        tooltip: this.description || '',
        labelKey: 'name',
        iconKey: 'icon',
        useClearButton: true,
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }).$element);
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      config.allowedSchemas = config.allowedSchemas || [];
      return _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Allowed Schemas'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('content'),
        useMultiple: true,
        value: config.allowedSchemas,
        useClearButton: true,
        valueKey: 'id',
        labelKey: 'name',
        iconKey: 'icon',
        onChange: function onChange(newValue) {
          config.allowedSchemas = newValue;
        }
      }).$element));
    }
  }]);

  return ContentSchemaReferenceEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = ContentSchemaReferenceEditor;

/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for date values
 *
 * @description Example:
 * <pre>
 * {
 *     "myDate": {
 *         "label": "My date",
 *         "schemaId": "date",
 *         "tabId": "content"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DateEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(DateEditor, _HashBrown$Views$Edit);

  function DateEditor(params) {
    var _this;

    _classCallCheck(this, DateEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DateEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: On click remove
   */


  _createClass(DateEditor, [{
    key: "onClickRemove",
    value: function onClickRemove() {
      this.value = null;
      this.trigger('change', this.value);
      this.fetch();
    }
    /**
     * Event: Click open
     */

  }, {
    key: "onClickOpen",
    value: function onClickOpen() {
      var _this2 = this;

      var modal = new HashBrown.Views.Modals.DateModal({
        value: this.value
      });
      modal.on('change', function (newValue) {
        _this2.value = newValue.toISOString();

        _this2.trigger('change', _this2.value);

        _this2.fetch();
      });
    }
    /**
     * Format a date string
     *
     * @param {String} input
     *
     * @returns {String} Formatted date string
     */

  }, {
    key: "formatDate",
    value: function formatDate(input) {
      var output = '(none)';
      var date = new Date(input);

      if (input && !isNaN(date.getTime())) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var hours = date.getHours();
        var minutes = date.getMinutes();

        if (day < 10) {
          day = '0' + day;
        }

        if (month < 10) {
          month = '0' + month;
        }

        if (hours < 10) {
          hours = '0' + hours;
        }

        if (minutes < 10) {
          minutes = '0' + minutes;
        }

        output = date.getFullYear() + '.' + month + '.' + day + ' - ' + hours + ':' + minutes;
      }

      return output;
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this3 = this;

      return _.div({
        class: 'editor__field__value'
      }, _.do(function () {
        if (_this3.disabled) {
          return _this3.formatDate(_this3.value);
        }

        return _.div({
          class: 'widget widget-group',
          title: _this3.description || ''
        }, _.button({
          class: 'widget widget--button low'
        }, _this3.formatDate(_this3.value)).click(function () {
          _this3.onClickOpen();
        }), _.div({
          class: 'widget widget--button small fa fa-remove'
        }).click(function () {
          _this3.onClickRemove();
        }));
      }));
    }
  }]);

  return DateEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = DateEditor;

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple list picker
 *
 * @description Example:
 * <pre>
 * {
 *     "myDropdown": {
 *         "label": "My dropdown",
 *         "tabId": "content",
 *         "schemaId": "dropdown",
 *         "config": {
 *             "options": [
 *                 {
 *                     "label": "Option #1",
 *                     "value": "option-1"
 *                 },
 *                 {
 *                     "label": "Option #2",
 *                     "value": "option-2"
 *                 }
 *             ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DropdownEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(DropdownEditor, _HashBrown$Views$Edit);

  function DropdownEditor(params) {
    var _this;

    _classCallCheck(this, DropdownEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropdownEditor).call(this, params));

    if (!_this.config.options) {
      _this.config.options = [];
    }

    _this.fetch();

    return _this;
  }
  /**
   * Renders the config editor
   *
   * @param {Object} config
   *
   * @returns {HTMLElement} Element
   */


  _createClass(DropdownEditor, [{
    key: "template",

    /**
     * Renders this editor
     */
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, _.if(this.config.options.length < 1, _.span({
        class: 'editor__field__value__warning'
      }, 'No options configured')), _.if(this.config.options.length > 0, new HashBrown.Views.Widgets.Dropdown({
        value: this.value,
        useClearButton: true,
        options: this.config.options,
        valueKey: 'value',
        tooltip: this.description || '',
        labelKey: 'label',
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }).$element));
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      config.options = config.options || [];
      return _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Options'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Chips({
        value: config.options,
        valueKey: 'value',
        labelKey: 'label',
        placeholder: 'New option',
        onChange: function onChange(newValue) {
          config.options = newValue;
        }
      }).$element));
    }
  }]);

  return DropdownEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = DropdownEditor;

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A field editor for specifying one of the selected languages
 *
 * @description Example:
 * <pre>
 * {
 *     "myLanguage": {
 *         "label": "My language",
 *         "tabId": "content",
 *         "schemaId": "language"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LanguageEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(LanguageEditor, _HashBrown$Views$Edit);

  /**
   * Constructor
   */
  function LanguageEditor(params) {
    var _this;

    _classCallCheck(this, LanguageEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LanguageEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Prerender
   */


  _createClass(LanguageEditor, [{
    key: "prerender",
    value: function prerender() {
      var options = HashBrown.Helpers.LanguageHelper.getLanguagesSync();

      if (!this.value || options.indexOf(this.value) < 0) {
        this.value = options[0];
      }
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: this.value,
        options: HashBrown.Helpers.LanguageHelper.getLanguagesSync(),
        tooltip: this.description || '',
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }).$element);
    }
  }]);

  return LanguageEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = LanguageEditor;

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A picker for referencing Media 
 *
 * @description Example:
 * <pre>
 * {
 *     "myMediaReference": {
 *         "label": "My medie reference",
 *         "tabId": "content",
 *         "schemaId": "mediaReference"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MediaReferenceEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(MediaReferenceEditor, _HashBrown$Views$Edit);

  function MediaReferenceEditor(params) {
    var _this;

    _classCallCheck(this, MediaReferenceEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaReferenceEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Renders this editor
   */


  _createClass(MediaReferenceEditor, [{
    key: "template",
    value: function template() {
      var _this2 = this;

      var media = HashBrown.Helpers.MediaHelper.getMediaByIdSync(this.value);
      return _.div({
        class: 'editor__field__value editor__field--media-reference',
        title: this.description || ''
      }, _.button({
        class: 'editor__field--media-reference__pick'
      }, _.do(function () {
        if (!media) {
          return _.div({
            class: 'editor__field--media-reference__empty'
          });
        }

        if (media.isAudio()) {
          return _.div({
            class: 'editor__field--media-reference__preview fa fa-file-audio-o'
          });
        }

        if (media.isVideo()) {
          return _.div({
            class: 'editor__field--media-reference__preview fa fa-file-video-o'
          });
        }

        if (media.isImage()) {
          return _.img({
            class: 'editor__field--media-reference__preview',
            src: '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + media.id + '?width=200'
          });
        }
      })).click(function () {
        new HashBrown.Views.Modals.MediaBrowser({
          value: _this2.value
        }).on('select', function (id) {
          _this2.value = id;

          _this2.trigger('change', _this2.value);

          _this2.fetch();
        });
      }), _.div({
        class: 'editor__field--media-reference__footer'
      }, _.label({
        class: 'editor__field--media-reference__name'
      }, media ? media.name : ''), _.button({
        class: 'editor__field--media-reference__remove',
        title: 'Clear the Media selection'
      }).click(function () {
        _this2.value = null;

        _this2.trigger('change', _this2.value);

        _this2.fetch();
      })));
    }
  }]);

  return MediaReferenceEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = MediaReferenceEditor;

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple number editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myNumber": {
 *         "label": "My number",
 *         "tabId": "content",
 *         "schemaId": "number",
 *         "config": {
 *             "step": 0.5
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var NumberEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(NumberEditor, _HashBrown$Views$Edit);

  function NumberEditor(params) {
    var _this;

    _classCallCheck(this, NumberEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NumberEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Change
   */


  _createClass(NumberEditor, [{
    key: "onChange",
    value: function onChange() {
      this.value = parseFloat(this.$input.val());
      this.trigger('change', this.value);
    }
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "template",

    /**
     * Renders this editor
     */
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        value: this.value || '0',
        type: this.config.isSlider ? 'range' : 'number',
        step: this.config.step || 'any',
        tooltip: this.description || '',
        min: this.config.min || '0',
        max: this.config.max || '0',
        onChange: function onChange(newValue) {
          _this2.value = parseFloat(newValue);

          _this2.trigger('change', _this2.value);
        }
      }).$element);
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      config.step = config.step || 'any';
      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Step'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: 'number',
        step: 'any',
        tooltip: 'The division by which the input number is allowed (0 is any division)',
        value: config.step === 'any' ? 0 : config.step,
        onChange: function onChange(newValue) {
          if (newValue == 0) {
            newValue = 'any';
          }

          config.step = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Min value'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        tooltip: 'The minimum required value',
        type: 'number',
        step: 'any',
        value: config.min || 0,
        onChange: function onChange(newValue) {
          config.min = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Max value'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        tooltip: 'The maximum allowed value (0 is infinite)',
        type: 'number',
        step: 'any',
        value: config.max || 0,
        onChange: function onChange(newValue) {
          config.max = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Is slider'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        tooltip: 'Whether or not this number should be edited as a range slider',
        type: 'checkbox',
        value: config.isSlider || false,
        onChange: function onChange(newValue) {
          config.isSlider = newValue;
        }
      }).$element))];
    }
  }]);

  return NumberEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = NumberEditor;

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple string editor
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ResourceReferenceEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(ResourceReferenceEditor, _HashBrown$Views$Edit);

  function ResourceReferenceEditor(params) {
    var _this;

    _classCallCheck(this, ResourceReferenceEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ResourceReferenceEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Renders the config editor
   *
   * @param {Object} config
   *
   * @returns {HTMLElement} Element
   */


  _createClass(ResourceReferenceEditor, [{
    key: "template",

    /**
     * Renders this editor
     */
    value: function template() {
      var resource = resources[this.config.resource];
      var value;

      if (resource) {
        value = resource[this.value];

        if (!value) {
          for (var i in resource) {
            if (resource[i].id == this.value) {
              value = resource[i];
              break;
            }
          }
        }

        if (value) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (this.config.resourceKeys || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              if (value[key]) {
                value = value[key];
                break;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else if (this.value) {
          var singularResourceName = this.config.resource;

          if (singularResourceName[singularResourceName.length - 1] == 's') {
            singularResourceName = singularResourceName.substring(0, singularResourceName.length - 1);
          }

          value = '(' + singularResourceName + ' not found)';
        }
      }

      return _.div({
        class: 'editor__field__value'
      }, value || '(none)');
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      config.resourceKeys = config.resourceKeys || [];
      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Resource'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: config.resource,
        options: Object.keys(resources),
        onChange: function onChange(newValue) {
          config.resource = newValue;
        }
      }).$element)), _.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Resource keys'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Chips({
        value: config.resourceKeys,
        placeholder: 'keyName',
        onChange: function onChange(newValue) {
          config.resourceKeys = newValue;
        }
      }).$element))];
    }
  }]);

  return ResourceReferenceEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = ResourceReferenceEditor;

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A rich text editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myRichText": {
 *         "label": "My rich text",
 *         "tabId": "content",
 *         "schemaId": "richText"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RichTextEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(RichTextEditor, _HashBrown$Views$Edit);

  function RichTextEditor(params) {
    var _this;

    _classCallCheck(this, RichTextEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RichTextEditor).call(this, params)); // Sanity check of value

    if (typeof _this.value !== 'string') {
      _this.value = _this.value || '';
    } // Make sure the string is HTML


    try {
      _this.value = marked(_this.value);
    } catch (e) {// Catch this silly exception that marked does sometimes
    }

    _this.fetch();

    return _this;
  }
  /**
   * Renders the config editor
   *
   * @param {Object} config
   *
   * @returns {HTMLElement} Element
   */


  _createClass(RichTextEditor, [{
    key: "onChange",

    /**
     * Event: Change input
     *
     * @param {String} value
     */
    value: function onChange(value) {
      value = value || '';
      this.value = value;

      if (this.silentChange === true) {
        this.silentChange = false;
        this.trigger('silentchange', this.value);
      } else {
        this.trigger('change', this.value);
      }
    }
    /**
     * Event: On click tab
     *
     * @param {String} source
     */

  }, {
    key: "onClickTab",
    value: function onClickTab(source) {
      this.silentChange = true;
      this.activeView = source;
      this.fetch();
    }
    /**
     * Event: Click insert media
     */

  }, {
    key: "onClickInsertMedia",
    value: function onClickInsertMedia() {
      var _this2 = this;

      var mediaBrowser = new HashBrown.Views.Modals.MediaBrowser();
      mediaBrowser.on('select', function (id) {
        HashBrown.Helpers.MediaHelper.getMediaById(id).then(function (media) {
          var html = '';

          if (media.isImage()) {
            html = '<img data-id="' + id + '" alt="' + media.name + '" src="/' + media.url + '">';
          } else if (media.isVideo()) {
            html = '<video data-id="' + id + '" alt="' + media.name + '" src="/' + media.url + '">';
          }

          var activeView = _this2.activeView || 'wysiwyg';

          switch (activeView) {
            case 'wysiwyg':
              _this2.wysiwyg.insertHtml(html);

              break;

            case 'html':
              _this2.html.replaceSelection(html, 'end');

              break;

            case 'markdown':
              _this2.markdown.replaceSelection(toMarkdown(html), 'end');

              break;
          }
        }).catch(UI.errorModal);
      });
    }
    /**
     * Gets the tab content
     *
     * @returns {HTMLElement} Tab content
     */

  }, {
    key: "getTabContent",
    value: function getTabContent() {
      return this.element.querySelector('.editor__field--rich-text-editor__tab__content');
    }
    /**
     * Initialises the HTML editor
     */

  }, {
    key: "initHtmlEditor",
    value: function initHtmlEditor() {
      var _this3 = this;

      setTimeout(function () {
        // Kepp reference to editor
        _this3.html = CodeMirror.fromTextArea(_this3.getTabContent(), {
          lineNumbers: false,
          mode: {
            name: 'xml'
          },
          viewportMargin: Infinity,
          tabSize: 4,
          indentUnit: 4,
          indentWithTabs: true,
          theme: 'default',
          value: _this3.value
        }); // Change event

        _this3.html.on('change', function () {
          _this3.onChange(_this3.html.getDoc().getValue());
        }); // Set value initially


        _this3.silentChange = true;

        _this3.html.getDoc().setValue(_this3.value);
      }, 1);
    }
    /**
     * Initialises the markdown editor
     */

  }, {
    key: "initMarkdownEditor",
    value: function initMarkdownEditor() {
      var _this4 = this;

      setTimeout(function () {
        // Keep reference to editor
        _this4.markdown = CodeMirror.fromTextArea(_this4.getTabContent(), {
          lineNumbers: false,
          mode: {
            name: 'markdown'
          },
          viewportMargin: Infinity,
          tabSize: 4,
          indentUnit: 4,
          indentWithTabs: true,
          theme: 'default',
          value: toMarkdown(_this4.value)
        }); // Change event

        _this4.markdown.on('change', function () {
          _this4.onChange(marked(_this4.markdown.getDoc().getValue()));
        }); // Set value initially


        _this4.silentChange = true;

        _this4.markdown.getDoc().setValue(toMarkdown(_this4.value));
      }, 1);
    }
    /**
     * Initialises the WYSIWYG editor
     */

  }, {
    key: "initWYSIWYGEditor",
    value: function initWYSIWYGEditor() {
      var _this5 = this;

      this.wysiwyg = CKEDITOR.replace(this.getTabContent(), {
        removePlugins: 'contextmenu,liststyle,tabletools',
        allowedContent: true,
        height: 400,
        toolbarGroups: [{
          name: 'styles'
        }, {
          name: 'basicstyles',
          groups: ['basicstyles', 'cleanup']
        }, {
          name: 'paragraph',
          groups: ['list', 'indent', 'blocks', 'align', 'bidi']
        }, {
          name: 'links'
        }, {
          name: 'insert'
        }, {
          name: 'forms'
        }, {
          name: 'tools'
        }, {
          name: 'document',
          groups: ['mode', 'document', 'doctools']
        }, {
          name: 'others'
        }],
        extraPlugins: 'justify,divarea',
        removeButtons: 'Image,Styles,Underline,Subscript,Superscript,Source,SpecialChar,HorizontalRule,Maximize,Table',
        removeDialogTabs: 'image:advanced;link:advanced'
      });
      this.wysiwyg.on('change', function () {
        _this5.onChange(_this5.wysiwyg.getData());
      });
      this.wysiwyg.on('instanceReady', function () {
        // Strips the style information
        var stripStyle = function stripStyle(element) {
          delete element.attributes.style;
        }; // Filtering rules


        _this5.wysiwyg.dataProcessor.dataFilter.addRules({
          elements: {
            // Strip styling from these elements
            p: stripStyle,
            h1: stripStyle,
            h2: stripStyle,
            h3: stripStyle,
            h4: stripStyle,
            h5: stripStyle,
            h6: stripStyle,
            span: stripStyle,
            div: stripStyle,
            section: stripStyle,
            hr: stripStyle,
            header: stripStyle,
            aside: stripStyle,
            footer: stripStyle,
            ul: stripStyle,
            li: stripStyle,
            blockquote: stripStyle,
            // Refactor image src url to fit MediaController
            img: function img(element) {
              stripStyle(element); // Fetch from data attribute

              if (element.attributes['data-id']) {
                element.attributes.src = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + element.attributes['data-id']; // Failing that, use regex
              } else {
                element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]+)\/.+/g, '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/$1');
              }
            },
            // Refactor video src url to fit MediaController
            video: function video(element) {
              stripStyle(element); // Fetch from data attribute

              if (element.attributes['data-id']) {
                element.attributes.src = '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + element.attributes['data-id']; // Failing that, use regex
              } else {
                element.attributes.src = element.attributes.src.replace(/.+media\/([0-9a-z]+)\/.+/g, '/media/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/$1');
              }
            }
          }
        }); // Set value initially


        _this5.silentChange = true;

        _this5.wysiwyg.setData(_this5.value);
      });
    }
    /**
     * Prerender
     */

  }, {
    key: "prerender",
    value: function prerender() {
      this.markdown = null;
      this.wysiwyg = null;
      this.html = null;
    }
    /** 
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this6 = this;

      var activeView = this.activeView || 'wysiwyg';
      return _.div({
        class: 'editor__field__value editor__field--rich-text-editor',
        title: this.description || ''
      }, _.div({
        class: 'editor__field--rich-text-editor__header'
      }, _.each({
        wysiwyg: 'Visual',
        markdown: 'Markdown',
        html: 'HTML'
      }, function (alias, label) {
        return _.button({
          class: (activeView === alias ? 'active ' : '') + 'editor__field--rich-text-editor__header__tab'
        }, label).click(function () {
          _this6.onClickTab(alias);
        });
      }), _.button({
        class: 'editor__field--rich-text-editor__header__add-media'
      }, 'Add media').click(function () {
        _this6.onClickInsertMedia();
      })), _.div({
        class: 'editor__field--rich-text-editor__body'
      }, _.if(activeView === 'wysiwyg', _.div({
        class: 'editor__field--rich-text-editor__tab wysiwyg'
      }, _.div({
        class: 'editor__field--rich-text-editor__tab__content',
        'contenteditable': true
      }))), _.if(activeView === 'markdown', _.div({
        class: 'editor__field--rich-text-editor__tab markdown'
      }, _.textarea({
        class: 'editor__field--rich-text-editor__tab__content'
      }))), _.if(activeView === 'html', _.div({
        class: 'editor__field--rich-text-editor__tab html'
      }, _.textarea({
        class: 'editor__field--rich-text-editor__tab__content'
      })))));
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      var activeView = this.activeView || 'wysiwyg';

      switch (activeView) {
        case 'html':
          this.initHtmlEditor();
          break;

        case 'markdown':
          this.initMarkdownEditor();
          break;

        case 'wysiwyg':
          this.initWYSIWYGEditor();
          break;
      }
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Disable markdown'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: 'checkbox',
        tooltip: 'Hides the markdown tab if enabled',
        value: config.isMarkdownDisabled || false,
        onChange: function onChange(newValue) {
          config.isMarkdownDisabled = newValue;
        }
      }).$element))];
    }
  }]);

  return RichTextEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = RichTextEditor;

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A simple string editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myString": {
 *         "label": "My string",
 *         "tabId": "content",
 *         "schemaId": "string",
 *         "config": {
 *             "isMultiLine": false
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var StringEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(StringEditor, _HashBrown$Views$Edit);

  /**
   * Constructor
   */
  function StringEditor(params) {
    var _this;

    _classCallCheck(this, StringEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StringEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Renders the config editor
   *
   * @param {Object} config
   *
   * @returns {HTMLElement} Element
   */


  _createClass(StringEditor, [{
    key: "template",

    /**
     * Render this editor
     */
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: this.config.isMultiLine ? 'textarea' : 'text',
        value: this.value,
        tooltip: this.description || '',
        onChange: function onChange(newValue) {
          _this2.value = newValue;

          _this2.trigger('change', _this2.value);
        }
      }));
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config) {
      return [_.div({
        class: 'editor__field'
      }, _.div({
        class: 'editor__field__key'
      }, 'Is multi-line'), _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Input({
        type: 'checkbox',
        tooltip: 'Whether or not this string uses line breaks',
        value: config.isMultiLine || false,
        onChange: function onChange(newValue) {
          config.isMultiLine = newValue;
        }
      }).$element))];
    }
  }]);

  return StringEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = StringEditor;

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A struct editor for editing any arbitrary object value
 *
 * @description Example:
 * <pre>
 * {
 *     "myStruct": {
 *         "label": "My struct",
 *         "tabId": "content",
 *         "schemaId": "struct",
 *         "config": {
 *             "label": "myString",
 *             "struct": {
 *                 "myString": {
 *                     "label": "My string",
 *                     "schemaId": "string"
 *                 },
 *                 "myArray": {
 *                     "label": "My array",
 *                     "schemaId": "array",
 *                     "config": {
 *                         "allowedSchemas": [ "string", "mediaReference", "myCustomSchema" ]
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var StructEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(StructEditor, _HashBrown$Views$Edit);

  function StructEditor(params) {
    var _this;

    _classCallCheck(this, StructEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StructEditor).call(this, params)); // A sanity check to make sure we're working with an object

    if (!_this.value || _typeof(_this.value) !== 'object') {
      _this.value = {};
    }

    _this.fetch();

    return _this;
  }
  /**
   * Event: Change value
   *
   * @param {Object} newValue
   * @param {String} key
   * @param {Object} keySchema
   * @param {Boolean} isSilent
   */


  _createClass(StructEditor, [{
    key: "onChange",
    value: function onChange(newValue, key, keySchema, isSilent) {
      if (keySchema.multilingual) {
        // Sanity check to make sure multilingual fields are accomodated for
        if (!this.value[key] || _typeof(this.value[key]) !== 'object') {
          this.value[key] = {};
        }

        this.value[key]._multilingual = true;
        this.value[key][window.language] = newValue;
      } else {
        this.value[key] = newValue;
      }

      this.trigger(isSilent ? 'silentchange' : 'change', this.value);
    }
    /**
     * Renders the config editor
     *
     * @param {Object} config
     * @param {String} fieldSchemaId
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "template",

    /**
     * Renders this editor
     */
    value: function template() {
      var _this2 = this;

      var compiledSchema = HashBrown.Helpers.SchemaHelper.getFieldSchemaWithParentConfigs(this.schema.id);
      return _.div({
        class: 'editor__field__value field-editor--struct'
      }, // Loop through each key in the struct
      _.each(compiledSchema.config.struct, function (k, keySchema) {
        var value = _this2.value[k];

        if (!keySchema.schemaId) {
          UI.errorModal(new Error('Schema id not set for key "' + k + '"'));
        }

        var fieldSchema = HashBrown.Helpers.SchemaHelper.getFieldSchemaWithParentConfigs(keySchema.schemaId);

        if (!fieldSchema) {
          UI.errorModal(new Error('Field schema "' + keySchema.schemaId + '" could not be found for key " + k + "'));
        }

        var fieldEditor = HashBrown.Views.Editors.ContentEditor.getFieldEditor(fieldSchema.editorId); // Sanity check

        value = HashBrown.Helpers.ContentHelper.fieldSanityCheck(value, keySchema);
        _this2.value[k] = value; // Init the field editor

        var fieldEditorInstance = new fieldEditor({
          value: keySchema.multilingual ? value[window.language] : value,
          disabled: keySchema.disabled || false,
          config: keySchema.config || fieldSchema.config || {},
          schema: keySchema
        }); // Hook up the change event

        fieldEditorInstance.on('change', function (newValue) {
          _this2.onChange(newValue, k, keySchema);
        });
        fieldEditorInstance.on('silentchange', function (newValue) {
          _this2.onChange(newValue, k, keySchema, true);
        }); // Return the DOM element

        return _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, keySchema.label), _.if(keySchema.description, _.div({
          class: 'editor__field__key__description'
        }, keySchema.description)), fieldEditorInstance.renderKeyActions()), fieldEditorInstance.$element);
      }));
    }
  }], [{
    key: "renderConfigEditor",
    value: function renderConfigEditor(config, fieldSchemaId) {
      config.struct = config.struct || {};

      var $element = _.div({
        class: 'editor--schema__struct'
      });

      var compiledFieldSchema = HashBrown.Helpers.SchemaHelper.getFieldSchemaWithParentConfigs(fieldSchemaId);

      var renderEditor = function renderEditor() {
        // Get the parent struct fields
        var parentStruct = {};

        if (compiledFieldSchema && compiledFieldSchema.config && compiledFieldSchema.config.struct) {
          for (var key in compiledFieldSchema.config.struct) {
            // We only want parent struct values
            if (config.struct[key]) {
              continue;
            }

            parentStruct[key] = compiledFieldSchema.config.struct[key];
          }
        } // Compile the label options


        var labelOptions = {};

        for (var _key in parentStruct) {
          if (!parentStruct[_key]) {
            continue;
          }

          labelOptions[_key] = parentStruct[_key].label;
        }

        for (var _key2 in config.struct) {
          if (!config.struct[_key2]) {
            continue;
          }

          labelOptions[_key2] = config.struct[_key2].label;
        } // Render everything


        _.append($element.empty(), // Render the label picker
        _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, 'Label'), _.div({
          class: 'editor__field__key__description'
        }, 'The value of the field picked here will represent this struct when collapsed')), _.div({
          class: 'editor__field__value'
        }, new HashBrown.Views.Widgets.Dropdown({
          options: labelOptions,
          value: config.label,
          onChange: function onChange(newLabel) {
            config.label = newLabel;
          }
        }))), // Render the parent struct
        _.if(Object.keys(parentStruct).length > 0, _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, _.div({
          class: 'editor__field__key__label'
        }, 'Parent struct'), _.div({
          class: 'editor__field__key__description'
        }, 'Properties that are inherited and can be changed if you add them to this struct')), _.div({
          class: 'editor__field__value flex'
        }, _.each(parentStruct, function (fieldKey, fieldValue) {
          return _.button({
            class: 'widget widget--button condensed',
            title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'
          }, _.span({
            class: 'fa fa-plus'
          }), fieldValue.label || fieldKey).click(function () {
            var newProperties = {};
            newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

            for (var _key3 in config.struct) {
              newProperties[_key3] = config.struct[_key3];
            }

            config.struct = newProperties;
            renderEditor();
          });
        })))), // Render this struct
        _.div({
          class: 'editor__field'
        }, _.div({
          class: 'editor__field__key'
        }, 'Struct', _.div({
          class: 'editor__field__key__actions'
        }, _.button({
          class: 'editor__field__key__action editor__field__key__action--sort'
        }).click(function (e) {
          HashBrown.Helpers.UIHelper.fieldSortableObject(config.struct, $(e.currentTarget).parents('.editor__field')[0], function (newStruct) {
            config.struct = newStruct;
          });
        }))), _.div({
          class: 'editor__field__value segmented'
        }, _.each(config.struct, function (fieldKey, fieldValue) {
          // Sanity check
          fieldValue.config = fieldValue.config || {};
          fieldValue.schemaId = fieldValue.schemaId || 'array';

          var $field = _.div({
            class: 'editor__field'
          });

          var renderField = function renderField() {
            _.append($field.empty(), _.div({
              class: 'editor__field__sort-key'
            }, fieldKey), _.div({
              class: 'editor__field__value'
            }, _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Key'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A variable name, e.g. "myField"',
              tooltip: 'The field variable name',
              value: fieldKey,
              onChange: function onChange(newKey) {
                if (!newKey) {
                  return;
                }

                var newStruct = {}; // Insert the changed key into the correct place in the struct

                for (var _key4 in config.struct) {
                  if (_key4 === fieldKey) {
                    newStruct[newKey] = config.struct[fieldKey];
                  } else {
                    newStruct[_key4] = config.struct[_key4];
                  }
                } // Change internal reference to new key


                fieldKey = newKey; // Reassign the struct object

                config.struct = newStruct; // Update the sort key

                $field.find('.editor__field__sort-key').html(fieldKey);
              }
            }))), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Label'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A label, e.g. "My field"',
              tooltip: 'The field label',
              value: fieldValue.label,
              onChange: function onChange(newValue) {
                fieldValue.label = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Description'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'text',
              placeholder: 'A description',
              tooltip: 'The field description',
              value: fieldValue.description,
              onChange: function onChange(newValue) {
                fieldValue.description = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Multilingual'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Input({
              type: 'checkbox',
              tooltip: 'Whether or not this field should support multiple languages',
              value: fieldValue.multilingual || false,
              onChange: function onChange(newValue) {
                fieldValue.multilingual = newValue;
              }
            }).$element)), _.div({
              class: 'editor__field'
            }, _.div({
              class: 'editor__field__key'
            }, 'Schema'), _.div({
              class: 'editor__field__value'
            }, new HashBrown.Views.Widgets.Dropdown({
              useTypeAhead: true,
              options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field'),
              value: fieldValue.schemaId,
              labelKey: 'name',
              valueKey: 'id',
              onChange: function onChange(newValue) {
                fieldValue.schemaId = newValue;
                renderField();
              }
            }).$element)), _.do(function () {
              var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(fieldValue.schemaId);

              if (!schema) {
                return;
              }

              var editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

              if (!editor) {
                return;
              }

              return editor.renderConfigEditor(fieldValue.config);
            })), _.div({
              class: 'editor__field__actions'
            }, _.button({
              class: 'editor__field__action editor__field__action--remove',
              title: 'Remove field'
            }).click(function () {
              delete config.struct[fieldKey];
              renderEditor();
            })));
          };

          renderField();
          return $field;
        }), _.button({
          class: 'editor__field__add widget widget--button round right fa fa-plus',
          title: 'Add a struct property'
        }).click(function () {
          if (config.struct.newField) {
            return;
          }

          config.struct.newField = {
            label: 'New field',
            schemaId: 'string'
          };
          renderEditor();
        }))));
      };

      renderEditor();
      return $element;
    }
  }]);

  return StructEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = StructEditor;

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A CSV string editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myTags": {
 *         "label": "My tags",
 *         "tabId": "content",
 *         "schemaId": "tags"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TagsEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(TagsEditor, _HashBrown$Views$Edit);

  /**
   * Constructor
   */
  function TagsEditor(params) {
    var _this;

    _classCallCheck(this, TagsEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TagsEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Renders this editor
   */


  _createClass(TagsEditor, [{
    key: "template",
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value'
      }, new HashBrown.Views.Widgets.Chips({
        tooltip: this.description || '',
        value: (this.value || '').split(','),
        onChange: function onChange(newValue) {
          _this2.value = newValue.join(',');

          _this2.trigger('change', _this2.value);
        }
      }).$element);
    }
  }]);

  return TagsEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = TagsEditor;

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * An editor for content URLs
 *
 * @description Example:
 * <pre>
 * {
 *     "myUrl": {
 *         "label": "My URL",
 *         "tabId": "content",
 *         "schemaId": "url"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var UrlEditor =
/*#__PURE__*/
function (_HashBrown$Views$Edit) {
  _inherits(UrlEditor, _HashBrown$Views$Edit);

  function UrlEditor(params) {
    var _this;

    _classCallCheck(this, UrlEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UrlEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Get all parent content nodes
   *
   * @param {String} contentId
   *
   * @return {Array} nodes
   */


  _createClass(UrlEditor, [{
    key: "generateUrl",

    /**
     * Generates a new url based on content id
     *
     * @param {String} contentId
     *
     * @return {String} url
     */
    value: function generateUrl(contentId) {
      var nodes = UrlEditor.getAllParents(contentId);
      var url = '/';

      if (this.multilingual) {
        url += window.language + '/';
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;
          var title = ''; // If the node equals the currently edited node, take the value directly from the "title" field

          if (node.id == Crisp.Router.params.id) {
            title = $('.editor__field[data-key="title"] .editor__field__value input').val(); // If it's not, try to get the title from the model
          } else {
            // If title is set directly (unlikely), pass it
            if (typeof node.title === 'string') {
              title = node.title; // If title is defined in properties (typical)
            } else if (node.properties && node.properties.title) {
              // If title is multilingual
              if (node.properties.title[window.language]) {
                title = node.properties.title[window.language]; // If title is not multilingual
              } else if (typeof node.properties.title === 'string') {
                title = node.properties.title;
              }
            }
          }

          url += HashBrown.Helpers.ContentHelper.getSlug(title) + '/';
        } // Check for duplicate URLs

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var sameUrls = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = window.resources.content[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var content = _step2.value;

          if (content.id != contentId) {
            var thatUrl = content.prop('url', window.language);
            var isMatchWithNumber = new RegExp(url.substring(0, url.lastIndexOf('/')) + '-[0-9]+/').test(thatUrl);
            var isSameUrl = url == thatUrl || isMatchWithNumber;

            if (isSameUrl) {
              sameUrls++;
            }
          }
        } // Append a number, if duplidate URLs were found

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (sameUrls > 0) {
        url = url.replace(/\/$/, '-' + sameUrls + '/');
      }

      return url;
    }
    /**
     * Regenerates the URL
     */

  }, {
    key: "regenerate",
    value: function regenerate() {
      var newUrl = this.generateUrl(Crisp.Router.params.id);
      this.$input.val(newUrl);
      this.trigger('silentchange', this.$input.val());
    }
  }, {
    key: "fetchFromTitle",

    /**
     * Fetch the URL from the Content title
     */
    value: function fetchFromTitle() {
      this.value = this.$titleInput.val();
      this.regenerate();
    }
    /**
     * Event: Change value
     */

  }, {
    key: "onChange",
    value: function onChange() {
      this.value = this.$input.val();

      if (this.value.length > 0) {
        if (this.value[0] != '/') {
          this.value = '/' + this.value;
          this.$input.val(this.value);
        }

        if (this.value.length > 1 && this.value[this.value.length - 1] != '/') {
          this.value = this.value + '/';
          this.$input.val(this.value);
        }
      } else {
        this.fetchFromTitle();
      }

      this.trigger('change', this.value);
    }
  }, {
    key: "template",

    /**
     * Renders this editor
     */
    value: function template() {
      var _this2 = this;

      return _.div({
        class: 'editor__field__value field-editor--url'
      }, _.div({
        class: 'widget-group',
        title: this.description || ''
      }, this.$input = _.input({
        class: 'widget widget--input text',
        type: 'text',
        value: this.value
      }).on('change', function () {
        _this2.onChange();
      }), _.button({
        class: 'widget widget--button small fa fa-refresh',
        title: 'Regenerate URL'
      }).click(function () {
        _this2.regenerate();
      })));
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      var _this3 = this;

      //  Wait a bit before checking for title field
      setTimeout(function () {
        _this3.$titleInput = $('.editor__field[data-key="title"] input[type="text"]');

        if (_this3.$titleInput.length === 1) {
          _this3.$titleInput.on('input', function () {
            _this3.fetchFromTitle();
          });
        }

        if (!_this3.value) {
          _this3.fetchFromTitle();
        }
      }, 100);
    }
  }], [{
    key: "getAllParents",
    value: function getAllParents(contentId) {
      var nodes = [];
      var contentEditor = Crisp.View.get('ContentEditor');

      function iterate(id) {
        var node;
        node = window.resources.content.filter(function (node) {
          return node.id == id;
        })[0];

        if (node) {
          nodes.push(node);

          if (node.parentId) {
            iterate(node.parentId);
          }
        } else {
          debug.log('Content not found: "' + id + '"', this);
        }
      }

      iterate(contentId);
      nodes.reverse();
      return nodes;
    }
  }]);

  return UrlEditor;
}(HashBrown.Views.Editors.FieldEditors.FieldEditor);

module.exports = UrlEditor;

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Navigation
 */

namespace('Views.Navigation').add(__webpack_require__(275)).add(__webpack_require__(277)).add(__webpack_require__(278)).add(__webpack_require__(279)).add(__webpack_require__(280)).add(__webpack_require__(281)).add(__webpack_require__(282)).add(__webpack_require__(283));

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The main navbar
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var NavbarMain =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(NavbarMain, _Crisp$View);

  function NavbarMain(params) {
    var _this;

    _classCallCheck(this, NavbarMain);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NavbarMain).call(this, params));
    _this.template = __webpack_require__(276);
    _this.tabPanes = [];
    HashBrown.Views.Navigation.ContentPane.init();
    HashBrown.Views.Navigation.MediaPane.init();
    HashBrown.Views.Navigation.FormsPane.init();
    HashBrown.Views.Navigation.ConnectionPane.init();
    HashBrown.Views.Navigation.SchemaPane.init();

    _this.fetch();

    $('.page--environment__space--nav').html(_this.$element);
    return _this;
  }
  /**
   * Event: Change filter
   *
   * @param {HTMLElement} $pane
   * @param {NavbarPane} pane
   * @param {String} search
   */


  _createClass(NavbarMain, [{
    key: "onChangeFilter",
    value: function onChangeFilter($pane, pane, search) {
      search = search.toLowerCase();
      $pane.find('.navbar-main__pane__item').each(function (i, item) {
        var label = item.querySelector('.navbar-main__pane__item__label').innerText.toLowerCase();
        item.classList.toggle('filter-not-matched', label.indexOf(search) < 0);
      });
    }
    /**
     * Event: Change sorting
     *
     * @param {HTMLElement} $pane
     * @param {NavbarPane} pane
     * @param {String} sortingMethod
     */

  }, {
    key: "onChangeSorting",
    value: function onChangeSorting($pane, pane, sortingMethod) {
      this.applySorting($pane, pane, sortingMethod);
    }
    /**
     * Event: Error was returned
     */

  }, {
    key: "onError",
    value: function onError(err) {
      UI.errorModal(err);
    }
    /**
     * Event: Click copy item id
     */

  }, {
    key: "onClickCopyItemId",
    value: function onClickCopyItemId() {
      var id = $('.context-menu-target').data('id');
      copyToClipboard(id);
    }
    /**
     * Event: Click tab
     */

  }, {
    key: "onClickTab",
    value: function onClickTab(e) {
      e.preventDefault();
      location.hash = e.currentTarget.dataset.route;
      $('.navbar-main__pane__item.active').toggleClass('active', false);
      $('.page--environment__space--nav').toggleClass('expanded', true);
    }
    /**
     * Event: Toggle children
     */

  }, {
    key: "onClickToggleChildren",
    value: function onClickToggleChildren(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.parentElement.parentElement.classList.toggle('open');
    }
    /**
     * Toggles the tab buttons
     *
     * @param {Boolean} isActive
     */

  }, {
    key: "toggleTabButtons",
    value: function toggleTabButtons(isActive) {
      this.$element.toggleClass('hide-tabs', !isActive);
    }
    /**
     * Shows a tab
     *
     * @param {String} tabName
     */

  }, {
    key: "showTab",
    value: function showTab(tabRoute) {
      this.$element.find('.navbar-main__pane').each(function (i) {
        $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
      });
      this.$element.find('.navbar-main__tab').each(function (i) {
        $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
      });
    }
    /**
     * Saves the navbar state
     */

  }, {
    key: "save",
    value: function save() {
      var _this2 = this;

      this.state = {
        buttons: {},
        panes: {},
        items: {},
        scroll: $('.navbar-main__pane.active .navbar-main__pane__items').scrollTop() || 0
      };
      this.$element.find('.navbar-main__tab').each(function (i, element) {
        var key = element.dataset.route;

        if (!key) {
          return;
        }

        _this2.state.buttons[key] = element.className;
      });
      this.$element.find('.navbar-main__pane').each(function (i, element) {
        var key = element.dataset.route;
        _this2.state.panes[key] = element.className;
      });
      this.$element.find('.navbar-main__pane__item').each(function (i, element) {
        var key = element.dataset.routingPath || element.dataset.mediaFolder;
        _this2.state.items[key] = element.className.replace('loading', '');
      });
    }
    /**
     * Restores the navbar state
     */

  }, {
    key: "restore",
    value: function restore() {
      var _this3 = this;

      if (!this.state) {
        return;
      } // Restore tab buttons


      this.$element.find('.navbar-main__tab').each(function (i, element) {
        var key = element.dataset.route;

        if (key && _this3.state.buttons[key]) {
          element.className = _this3.state.buttons[key];
        }
      }); // Restore pane containers

      this.$element.find('.navbar-main__pane').each(function (i, element) {
        var key = element.dataset.route;

        if (key && _this3.state.panes[key]) {
          element.className = _this3.state.panes[key];
        }
      }); // Restore pane items

      this.$element.find('.navbar-main__pane__item').each(function (i, element) {
        var key = element.dataset.routingPath || element.dataset.mediaFolder;

        if (key && _this3.state.items[key]) {
          element.className = _this3.state.items[key];
        }
      }); // Restore scroll position

      $('.navbar-main__pane.active .navbar-main__pane__items').scrollTop(this.state.scroll || 0);
      this.state = null;
    }
    /**
     * Reloads this view
     */

  }, {
    key: "reload",
    value: function reload() {
      this.save();
      this.fetch();
      this.restore();
    }
    /**
     * Static version of the reload method
     */

  }, {
    key: "getItemIcon",

    /**
     * Gets the icons of an item
     *
     * @param {Object} item
     * @param {Object} settings
     *
     * @returns {String} Icon name
     */
    value: function getItemIcon(item, settings) {
      // If this item has a Schema id, fetch the appropriate icon
      if (item.schemaId) {
        var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);

        if (schema) {
          return schema.icon;
        }
      }

      return item.icon || settings.icon || 'file';
    }
    /**
     * Gets whether the item is a directory
     *
     * @param {Object} item
     *
     * @return {Boolean} Is directory
     */

  }, {
    key: "isItemDirectory",
    value: function isItemDirectory(item) {
      if (item.properties && item.createDate) {
        return true;
      }

      return false;
    }
    /**
     * Gets the routing path for an item
     *
     * @param {Object} item
     * @param {Object} settings
     *
     * @returns {String} Routing path
     */

  }, {
    key: "getItemRoutingPath",
    value: function getItemRoutingPath(item, settings) {
      if (typeof settings.itemPath === 'function') {
        return settings.itemPath(item);
      }

      return item.shortPath || item.path || item.id || null;
    }
    /**
     * Gets the name of an item
     *
     * @param {Object} item
     *
     * @returns {String} Item name
     */

  }, {
    key: "getItemName",
    value: function getItemName(item) {
      var name = ''; // This is a Content node

      if (item.properties && item.createDate) {
        // Use title directly if available
        if (typeof item.properties.title === 'string') {
          name = item.properties.title;
        } else if (item.properties.title && _typeof(item.properties.title) === 'object') {
          // Use the current language title
          if (item.properties.title[window.language]) {
            name = item.properties.title[window.language]; // If no title was found, search in other languages
          } else {
            name = 'Untitled';

            for (var language in item.properties.title) {
              var languageTitle = item.properties.title[language];

              if (languageTitle) {
                name += ' - (' + language + ': ' + languageTitle + ')';
                break;
              }
            }
          }
        }

        if (!name || name === 'Untitled') {
          name = 'Untitled (id: ' + item.id.substring(0, 6) + '...)';
        }
      } else if (item.title && typeof item.title === 'string') {
        name = item.title;
      } else if (item.name && typeof item.name === 'string') {
        name = item.name;
      } else {
        name = item.id;
      }

      return name;
    }
    /**
     * Highlights an item
     */

  }, {
    key: "highlightItem",
    value: function highlightItem(tab, route) {
      this.showTab(tab);
      this.$element.find('.navbar-main__pane.active .navbar-main__pane__item').each(function (i, element) {
        var $item = $(element);
        var id = ($item.children('a').attr('data-id') || '').toLowerCase();
        var routingPath = ($item.attr('data-routing-path') || '').toLowerCase();
        $item.toggleClass('active', false);

        if (id == route.toLowerCase() || routingPath == route.toLowerCase()) {
          $item.toggleClass('active', true);
          $item.parents('.navbar-main__pane__item').toggleClass('open', true);
        }
      });
    }
    /**
     * Clears all content within the navbar
     */

  }, {
    key: "clear",
    value: function clear() {
      this.$element.find('.navbar-main__tabs').empty();
      this.$element.find('.navbar-main__panes').empty();
    }
    /**
     * Applies item sorting
     *
     * @param {HTMLElement} $pane
     * @param {Object} pane
     * @param {String} sortingMethod
     */

  }, {
    key: "applySorting",
    value: function applySorting($pane, pane, sortingMethod) {
      var performSort = function performSort(a, b) {
        switch (sortingMethod) {
          case 'alphaAsc':
            return a.querySelector('.navbar-main__pane__item__label').innerText > b.querySelector('.navbar-main__pane__item__label').innerText ? 1 : -1;

          case 'alphaDesc':
            return a.querySelector('.navbar-main__pane__item__label').innerText < b.querySelector('.navbar-main__pane__item__label').innerText ? 1 : -1;

          case 'dateAsc':
            return new Date(a.dataset.updateDate) > new Date(b.dataset.updateDate) ? 1 : -1;

          case 'dateDesc':
            return new Date(a.dataset.updateDate) < new Date(b.dataset.updateDate) ? 1 : -1;

          default:
            return parseInt(a.dataset.sort) > parseInt(b.dataset.sort) ? 1 : -1;
        }
      }; // Sort direct and nested children


      $pane.find('.navbar-main__pane__items, .navbar-main__pane__item .navbar-main__pane__item__children').each(function (i, container) {
        var $nestedChildren = $(container).find('>.navbar-main__pane__item');
        $nestedChildren.sort(performSort);
        $nestedChildren.appendTo($(container));
      });
    }
    /**
     * Applies item hierarchy
     *
     * @param {HTMLElement} $pane
     * @param {Object} pane
     * @param {Array} queue
     */

  }, {
    key: "applyHierarchy",
    value: function applyHierarchy($pane, pane, queue) {
      var _this4 = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var queueItem = _step.value;

          if (!queueItem.parentDirAttr) {
            continue;
          } // Find parent item


          var parentDirAttrKey = Object.keys(queueItem.parentDirAttr)[0];
          var parentDirAttrValue = queueItem.parentDirAttr[parentDirAttrKey];
          var parentDirSelector = '.navbar-main__pane__item[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
          var $parentDir = $pane.find(parentDirSelector); // If parent element already exists, just append the queue item element

          if (parentDirAttrKey && parentDirAttrValue && $parentDir.length > 0) {
            $parentDir.children('.navbar-main__pane__item__children').append(queueItem.$element); // If not, create parent elements if specified
          } else if (queueItem.createDir) {
            var dirNames = parentDirAttrValue.split('/').filter(function (item) {
              return item != '';
            });
            var finalDirName = '/'; // Create a folder for each directory name in the path

            for (var i in dirNames) {
              var dirName = dirNames[i];
              var prevFinalDirName = finalDirName;
              finalDirName += dirName + '/'; // Look for an existing directory element

              var $dir = $pane.find('[' + parentDirAttrKey + '="' + finalDirName + '"]'); // Create it if not found

              if ($dir.length < 1) {
                $dir = _.div({
                  class: 'navbar-main__pane__item',
                  'data-is-directory': true
                }, _.a({
                  class: 'navbar-main__pane__item__content'
                }, _.span({
                  class: 'navbar-main__pane__item__icon fa fa-folder'
                }), _.span({
                  class: 'navbar-main__pane__item__label'
                }, dirName), // Toggle button
                _.button({
                  class: 'navbar-main__pane__item__toggle-children'
                }).click(function (e) {
                  _this4.onClickToggleChildren(e);
                })), _.div({
                  class: 'navbar-main__pane__item__children'
                }));
                $dir.attr(parentDirAttrKey, finalDirName); // Extra parent dir attributes

                if (queueItem.parentDirExtraAttr) {
                  for (var k in queueItem.parentDirExtraAttr) {
                    var v = queueItem.parentDirExtraAttr[k];
                    $dir.attr(k, v);
                  }
                } // Append to previous dir 


                var $prevDir = $pane.find('[' + parentDirAttrKey + '="' + prevFinalDirName + '"]');

                if ($prevDir.length > 0) {
                  $prevDir.children('.navbar-main__pane__item__children').prepend($dir); // If no previous dir was found, append directly to pane
                } else {
                  $pane.children('.navbar-main__pane__items').prepend($dir);
                } // Attach item context menu


                if (pane.settings.dirContextMenu) {
                  UI.context($dir[0], pane.settings.dirContextMenu);
                }
              } // Only append the queue item to the final parent element


              if (i >= dirNames.length - 1) {
                $parentDir = $dir;
              }
            }

            $parentDir.children('.navbar-main__pane__item__children').append(queueItem.$element);
          } // Add expand/collapse buttons


          if ($parentDir.children('.navbar-main__pane__item__content').children('.navbar-main__pane__item__toggle-children').length < 1) {
            $parentDir.children('.navbar-main__pane__item__content').append(_.button({
              class: 'navbar-main__pane__item__toggle-children'
            }).click(function (e) {
              _this4.onClickToggleChildren(e);
            }));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }], [{
    key: "reload",
    value: function reload() {
      Crisp.View.get('NavbarMain').reload();
    }
    /**
     * Adds a tab pane
     *
     * @param {String} route
     * @param {Object} settings
     */

  }, {
    key: "addTabPane",
    value: function addTabPane(route, label, icon, settings) {
      Crisp.View.get('NavbarMain').tabPanes.push({
        label: label,
        route: route,
        icon: icon,
        settings: settings
      });
    }
  }]);

  return NavbarMain;
}(Crisp.View);

module.exports = NavbarMain;

/***/ }),
/* 276 */
/***/ (function(module, exports) {

module.exports = function () {
  var _this = this;

  var currentUser = HashBrown.Models.User.current;
  var currentProject = HashBrown.Helpers.ProjectHelper.currentProject;
  var hasConnectionsScope = currentUser.hasScope(currentProject, 'connections');
  var hasSchemasScope = currentUser.hasScope(currentProject, 'schemas');
  var hasSettingsScope = currentUser.hasScope(currentProject, 'settings');
  return _.nav({
    class: 'navbar-main'
  }, // Buttons
  _.div({
    class: 'navbar-main__tabs'
  }, _.a({
    href: '/',
    class: 'navbar-main__tab'
  }, _.img({
    src: '/svg/logo_white.svg',
    class: 'navbar-main__tab__icon'
  }), _.div({
    class: 'navbar-main__tab__label'
  }, 'Dashboard')), _.each(this.tabPanes, function (i, pane) {
    return _.button({
      class: 'navbar-main__tab',
      'data-route': pane.route,
      title: pane.label
    }, _.div({
      class: 'navbar-main__tab__icon fa fa-' + pane.icon
    }), _.div({
      class: 'navbar-main__tab__label'
    }, pane.label)).on('click', function (e) {
      _this.onClickTab(e);
    });
  })), // Panes
  _.div({
    class: 'navbar-main__panes'
  }, _.each(this.tabPanes, function (i, pane) {
    var queue = [];
    var sortingOptions = {
      default: 'Default',
      alphaAsc: 'A → Z',
      alphaDesc: 'Z → A'
    };

    if (pane.label === 'Content') {
      sortingOptions.dateAsc = 'Old → new';
      sortingOptions.dateDesc = 'New → old';
    }

    var $pane = _.div({
      class: 'navbar-main__pane',
      'data-route': pane.route
    }, // Filter/sort bar
    _.div({
      class: 'navbar-main__pane__filter-sort-bar'
    }, _.div({
      class: 'widget-group'
    }, new HashBrown.Views.Widgets.Input({
      placeholder: 'Filter',
      onChange: function onChange(newValue) {
        _this.onChangeFilter($pane, pane, newValue);
      },
      type: 'text'
    }), new HashBrown.Views.Widgets.Dropdown({
      placeholder: 'Sort',
      options: sortingOptions,
      onChange: function onChange(newValue) {
        _this.onChangeSorting($pane, pane, newValue);
      }
    }))), // Move buttons
    _.div({
      class: 'navbar-main__pane__move-buttons widget-group'
    }, _.button({
      class: 'widget widget--button low expanded navbar-main__pane__move-button navbar-main__pane__move-button--root-dir'
    }, 'Move to root'), _.button({
      class: 'widget widget--button low expanded navbar-main__pane__move-button navbar-main__pane__move-button--new-dir'
    }, 'New folder')), // Items
    _.div({
      class: 'navbar-main__pane__items'
    }, _.each(pane.settings.items || pane.settings.getItems(), function (i, item) {
      var id = item.id || i;

      var name = _this.getItemName(item);

      var icon = _this.getItemIcon(item, pane.settings);

      var routingPath = _this.getItemRoutingPath(item, pane.settings);

      var isDirectory = _this.isItemDirectory(item);

      var queueItem = {};
      var hasRemote = item.sync ? item.sync.hasRemote : false;
      var isRemote = item.sync ? item.sync.isRemote : false;

      var $item = _.div({
        class: 'navbar-main__pane__item',
        'data-routing-path': routingPath,
        'data-locked': item.isLocked,
        'data-remote': isRemote,
        'data-local': hasRemote,
        'data-is-directory': isDirectory,
        'data-sort': item.sort || 0,
        'data-update-date': item.updateDate || item.createDate
      }, _.a({
        'data-id': id,
        'data-name': name,
        href: '#' + (routingPath ? pane.route + routingPath : pane.route),
        class: 'navbar-main__pane__item__content'
      }, _.div({
        class: 'navbar-main__pane__item__icon fa fa-' + icon
      }), _.div({
        class: 'navbar-main__pane__item__label'
      }, name)), _.div({
        class: 'navbar-main__pane__item__children'
      }), _.div({
        class: 'navbar-main__pane__item__insert-below'
      })); // Attach item context menu


      if (pane.settings.getItemContextMenu) {
        UI.context($item.find('a')[0], pane.settings.getItemContextMenu(item));
      } else if (pane.settings.itemContextMenu) {
        UI.context($item.find('a')[0], pane.settings.itemContextMenu);
      } // Add element to queue item


      queueItem.$element = $item; // Use specific hierarchy behaviours

      if (pane.settings.hierarchy) {
        pane.settings.hierarchy(item, queueItem);
      } // Add queue item to sorting queue


      queue.push(queueItem);
      return $item;
    })));

    _this.applyHierarchy($pane, pane, queue);

    _this.applySorting($pane, pane); // Attach pane context menu


    if (pane.settings.paneContextMenu) {
      UI.context($pane[0], pane.settings.paneContextMenu);
    }

    return $pane;
  })), // Toggle button (mobile only)
  _.button({
    class: 'navbar-main__toggle'
  }).click(function (e) {
    $('.page--environment__space--nav').toggleClass('expanded');
  }));
};

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The main menu
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MainMenu =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(MainMenu, _Crisp$View);

  function MainMenu(params) {
    var _this;

    _classCallCheck(this, MainMenu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MainMenu).call(this, params));

    _this.fetch();

    $('.page--environment__space--menu').html(_this.$element);
    return _this;
  }
  /**
   * Event: On change language
   *
   * @param {String} newLanguage
   */


  _createClass(MainMenu, [{
    key: "onChangeLanguage",
    value: function onChangeLanguage(newLanguage) {
      var _this2 = this;

      localStorage.setItem('language', newLanguage);
      window.language = newLanguage;
      HashBrown.Helpers.RequestHelper.reloadResource('content').then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        var contentEditor = Crisp.View.get('ContentEditor');

        if (contentEditor) {
          contentEditor.model = null;
          contentEditor.fetch();
        }

        _this2.fetch();
      });
    }
    /**
     * Event: Click question
     *
     * @param {String} topic
     */

  }, {
    key: "onClickQuestion",
    value: function onClickQuestion(topic) {
      switch (topic) {
        case 'content':
          var modal = UI.messageModal('Content', [_.p('This section contains all of your authored work. The content is a hierarchical tree of nodes that can contain text and media, in simple or complex structures.')]);
          break;

        case 'media':
          UI.messageModal('Media', [_.p('This is a gallery of your statically hosted files, such as images, videos and PDFs.'), _.p('The contents of this gallery depends on which <a href="#/connections">Connection</a> has been set up as the Media provider')]);
          break;

        case 'forms':
          UI.messageModal('Forms', 'If you need an input form on your website, you can create the model for it here and see a list of the user submitted input.');
          break;

        case 'connections':
          UI.messageModal('Connections', [_.p('Connections are endpoints and resources for your content. Connections can be set up to publish your Content and Media to remote servers.'), _.p('They can also be set up to provide statically hosted media.')]);
          break;

        case 'schemas':
          UI.messageModal('Schemas', 'This is a library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and property fields.');
          break;
      }
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      this.languages = HashBrown.Helpers.LanguageHelper.getLanguagesSync() || [];
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      this.languageDropdown.notify(window.language);
    }
    /**
     * Renders this menu
     */

  }, {
    key: "template",
    value: function template() {
      var _this3 = this;

      return _.div({
        class: 'main-menu widget-group'
      }, // Language picker
      _.if(Array.isArray(this.languages) && this.languages.length > 1, this.languageDropdown = new HashBrown.Views.Widgets.Dropdown({
        tooltip: 'Language',
        icon: 'flag',
        value: window.language,
        options: this.languages,
        onChange: function onChange(newValue) {
          _this3.onChangeLanguage(newValue);
        }
      })), // User dropdown
      this.userDropdown = new HashBrown.Views.Widgets.Dropdown({
        tooltip: 'Logged in as "' + (HashBrown.Models.User.current.fullName || HashBrown.Models.User.current.username) + '"',
        icon: 'user',
        reverseKeys: true,
        options: {
          'User settings': function UserSettings() {
            new HashBrown.Views.Editors.UserEditor({
              hidePermissions: true,
              model: HashBrown.Models.User.current
            });
          },
          'Log out': function LogOut() {
            HashBrown.Helpers.RequestHelper.customRequest('post', '/api/user/logout').then(function () {
              location = '/';
            });
          }
        }
      }), // Help
      this.helpDropdown = new HashBrown.Views.Widgets.Dropdown({
        tooltip: 'Get help',
        icon: 'question-circle',
        reverseKeys: true,
        options: {
          'Connections': function Connections() {
            _this3.onClickQuestion('connections');
          },
          'Content': function Content() {
            _this3.onClickQuestion('content');
          },
          'Forms': function Forms() {
            _this3.onClickQuestion('forms');
          },
          'Media': function Media() {
            _this3.onClickQuestion('media');
          },
          'Schemas': function Schemas() {
            _this3.onClickQuestion('schemas');
          }
        }
      }));
    }
  }]);

  return MainMenu;
}(Crisp.View);

module.exports = MainMenu;

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NavbarPane =
/*#__PURE__*/
function () {
  function NavbarPane() {
    _classCallCheck(this, NavbarPane);
  }

  _createClass(NavbarPane, null, [{
    key: "init",

    /**
     * Init
     */
    value: function init() {
      HashBrown.Views.Navigation.NavbarMain.addTabButton('My pane', '/my-route', 'question');
    }
    /**
     * Event: Click copy item id
     */

  }, {
    key: "onClickCopyItemId",
    value: function onClickCopyItemId() {
      var id = $('.context-menu-target').data('id');
      copyToClipboard(id);
    }
    /**
     * Event: Click open in new tab
     */

  }, {
    key: "onClickOpenInNewTab",
    value: function onClickOpenInNewTab() {
      var href = $('.context-menu-target').attr('href');
      window.open(location.protocol + '//' + location.host + '/' + HashBrown.Helpers.ProjectHelper.currentProject + '/' + HashBrown.Helpers.ProjectHelper.currentEnvironment + '/' + href);
    }
    /**
     * Event: Click refresh resource
     *
     * @param {String} resource
     */

  }, {
    key: "onClickRefreshResource",
    value: function onClickRefreshResource(resource) {
      HashBrown.Helpers.RequestHelper.reloadResource(resource).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      });
    }
    /**
     * Event: Change directory
     *
     * @param {String} id
     * @param {String} newParent
     */

  }, {
    key: "onChangeDirectory",
    value: function onChangeDirectory(id, newParent) {}
    /**
     * Event: Change sort index
     *
     * @param {String} id
     * @param {Number} newIndex
     * @param {String} newParent
     */

  }, {
    key: "onChangeSortIndex",
    value: function onChangeSortIndex(id, newIndex, newParent) {}
    /**
     * Event: Click move item
     */

  }, {
    key: "onClickMoveItem",
    value: function onClickMoveItem() {
      var _this = this;

      var id = $('.context-menu-target').data('id');
      var navbar = Crisp.View.get('NavbarMain');
      var $pane = navbar.$element.find('.navbar-main__pane.active');
      $pane.find('.navbar-main__pane__item a[data-id="' + id + '"]').parent().toggleClass('moving-item', true);
      $pane.toggleClass('select-dir', true); // Reset

      function reset(newPath) {
        $pane.find('.navbar-main__pane__item[data-id="' + id + '"]').toggleClass('moving-item', false);
        $pane.toggleClass('select-dir', false);
        $pane.find('.navbar-main__pane__move-button').off('click');
        $pane.find('.navbar-main__pane__item__content').off('click');
        $pane.find('.moving-item').toggleClass('moving-item', false);
      } // Cancel by escape key


      $(document).on('keyup', function (e) {
        if (e.which == 27) {
          reset();
        }
      }); // Click existing directory

      $pane.find('.navbar-main__pane__item[data-is-directory="true"]:not(.moving-item)').each(function (i, element) {
        $(element).children('.navbar-main__pane__item__content').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var newPath = $(element).attr('data-media-folder') || $(element).attr('data-content-id');
          reset(newPath);

          _this.onChangeDirectory(id, newPath);
        });
      }); // Click below item

      $pane.find('.navbar-main__pane__item__insert-below').click(function (e) {
        e.preventDefault();
        e.stopPropagation(); // Create new sort index based on the container we clicked below

        var $container = $(e.target).parent();
        var containerIndex = parseInt($container.data('sort') || 0);
        var newIndex = containerIndex + 1; // Reset the move state

        reset(); // Fetch the parent id as well, in case that changed

        var $parentItem = $container.parents('.navbar-main__pane__item');
        var newPath = $parentItem.length > 0 ? $parentItem.attr('data-media-folder') || $parentItem.attr('data-content-id') : null; // Trigger sort change event

        _this.onChangeSortIndex(id, newIndex, newPath);
      }); // Click "move to root" button

      $pane.find('.navbar-main__pane__move-button--root-dir').on('click', function (e) {
        var newPath = '/';
        reset(newPath);

        _this.onChangeDirectory(id, newPath);
      });
      $pane.find('.navbar-main__pane__move-button--new-dir').toggle(this.canCreateDirectory == true);

      if (this.canCreateDirectory) {
        $pane.find('.navbar-main__pane__move-button--new-dir').on('click', function () {
          HashBrown.Helpers.MediaHelper.getMediaById(id).then(function (item) {
            var messageModal = new HashBrown.Views.Modals.Modal({
              title: 'Move item',
              body: _.div({
                class: 'widget-group'
              }, _.input({
                class: 'widget widget--input text',
                value: item.folder || item.parentId || '',
                placeholder: '/path/to/media/'
              }), _.div({
                class: 'widget widget--label'
              }, item.name || item.title || item.id)),
              actions: [{
                label: 'OK',
                onClick: function onClick() {
                  var newPath = messageModal.$element.find('.widget--input').val();
                  reset(newPath);

                  _this.onChangeDirectory(item.id, newPath);
                }
              }]
            });
          }).catch(UI.errorModal);
        });
      }
    }
  }]);

  return NavbarPane;
}();

module.exports = NavbarPane;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The Connection navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ConnectionPane =
/*#__PURE__*/
function (_HashBrown$Views$Navi) {
  _inherits(ConnectionPane, _HashBrown$Views$Navi);

  function ConnectionPane() {
    _classCallCheck(this, ConnectionPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectionPane).apply(this, arguments));
  }

  _createClass(ConnectionPane, null, [{
    key: "onClickNewConnection",

    /**
     * Event: Click new connection
     */
    value: function onClickNewConnection() {
      var newConnection;
      HashBrown.Helpers.RequestHelper.request('post', 'connections/new').then(function (connection) {
        newConnection = connection;
        return HashBrown.Helpers.RequestHelper.reloadResource('connections');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/connections/' + newConnection.id;
      }).catch(UI.errorModal);
    }
    /**
     * Event: On click remove connection
     */

  }, {
    key: "onClickRemoveConnection",
    value: function onClickRemoveConnection() {
      var _this = this;

      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var name = $element.data('name');
      new UI.confirmModal('delete', 'Delete connection', 'Are you sure you want to remove the connection "' + name + '"?', function () {
        HashBrown.Helpers.RequestHelper.request('delete', 'connections/' + id).then(function () {
          debug.log('Removed connection with alias "' + id + '"', _this);
          return HashBrown.Helpers.RequestHelper.reloadResource('connections');
        }).then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload(); // Cancel the ConnectionEditor view if it was displaying the deleted connection

          if (location.hash == '#/connections/' + id) {
            location.hash = '/connections/';
          }
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click pull connection
     */

  }, {
    key: "onClickPullConnection",
    value: function onClickPullConnection() {
      var connectionEditor = Crisp.View.get('ConnectionEditor');
      var pullId = $('.context-menu-target').data('id'); // API call to pull the Connection by id

      HashBrown.Helpers.RequestHelper.request('post', 'connections/pull/' + pullId, {}) // Upon success, reload all Connection models    
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('connections');
      }) // Reload the UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/connections/' + pullId;
        var editor = Crisp.View.get('ConnectionEditor');

        if (editor && editor.model.id == pullId) {
          editor.model = null;
          editor.fetch();
        }
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click push connection
     */

  }, {
    key: "onClickPushConnection",
    value: function onClickPushConnection() {
      var $element = $('.context-menu-target');
      var pushId = $element.data('id');
      $element.parent().addClass('loading'); // API call to push the Connection by id

      HashBrown.Helpers.RequestHelper.request('post', 'connections/push/' + pushId) // Upon success, reload all Connection models
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('connections');
      }) // Reload the UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Init
     */

  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      if (!currentUserHasScope('connections')) {
        return;
      }

      HashBrown.Views.Navigation.NavbarMain.addTabPane('/connections/', 'Connections', 'exchange', {
        icon: 'exchange',
        getItems: function getItems() {
          return resources.connections;
        },
        // Item context menu
        getItemContextMenu: function getItemContextMenu(item) {
          var menu = {};
          var isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
          menu['This connection'] = '---';

          menu['Open in new tab'] = function () {
            _this2.onClickOpenInNewTab();
          };

          if (!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = function () {
              _this2.onClickRemoveConnection();
            };
          }

          menu['Copy id'] = function () {
            _this2.onClickCopyItemId();
          };

          if (item.isLocked && !item.sync.isRemote) {
            isSyncEnabled = false;
          }

          if (isSyncEnabled) {
            menu['Sync'] = '---';

            if (!item.sync.isRemote) {
              menu['Push to remote'] = function () {
                _this2.onClickPushConnection();
              };
            }

            if (item.sync.hasRemote) {
              menu['Remove local copy'] = function () {
                _this2.onClickRemoveConnection();
              };
            }

            if (item.sync.isRemote) {
              menu['Pull from remote'] = function () {
                _this2.onClickPullConnection();
              };
            }
          }

          menu['General'] = '---';

          menu['New connection'] = function () {
            _this2.onClickNewConnection();
          };

          menu['Refresh'] = function () {
            _this2.onClickRefreshResource('connections');
          };

          return menu;
        },
        // General context menu
        paneContextMenu: {
          'Connections': '---',
          'New connection': function NewConnection() {
            _this2.onClickNewConnection();
          },
          'Refresh': function Refresh() {
            _this2.onClickRefreshResource('connections');
          }
        }
      });
    }
  }]);

  return ConnectionPane;
}(HashBrown.Views.Navigation.NavbarPane);

module.exports = ConnectionPane;

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The Content navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ContentPane =
/*#__PURE__*/
function (_HashBrown$Views$Navi) {
  _inherits(ContentPane, _HashBrown$Views$Navi);

  function ContentPane() {
    _classCallCheck(this, ContentPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContentPane).apply(this, arguments));
  }

  _createClass(ContentPane, null, [{
    key: "onChangeDirectory",

    /**
     * Event: Change parent
     */
    value: function onChangeDirectory(id, parentId) {
      if (parentId == '/') {
        parentId = '';
      } // Get the Content model


      HashBrown.Helpers.ContentHelper.getContentById(id) // API call to apply changes to Content parent
      .then(function (content) {
        content.parentId = parentId;
        return HashBrown.Helpers.RequestHelper.request('post', 'content/' + id, content);
      }) // Reload all Content models
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('content');
      }) // Reload UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Event: Change sort index
     */

  }, {
    key: "onChangeSortIndex",
    value: function onChangeSortIndex(id, newIndex, parentId) {
      if (parentId == '/') {
        parentId = '';
      } // Get the Content model


      HashBrown.Helpers.ContentHelper.getContentById(id) // API call to apply changes to Content parent
      .then(function (content) {
        content.sort = newIndex;
        content.parentId = parentId;
        return HashBrown.Helpers.RequestHelper.request('post', 'content/' + id, content);
      }) // Reload all Content models
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('content');
      }) // Reload UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click pull content
     */

  }, {
    key: "onClickPullContent",
    value: function onClickPullContent() {
      var contentEditor = Crisp.View.get('ContentEditor');
      var pullId = $('.context-menu-target').data('id'); // API call to pull the Content by id

      HashBrown.Helpers.RequestHelper.request('post', 'content/pull/' + pullId, {}) // Upon success, reload all Content models    
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('content');
      }) // Reload the UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/content/' + pullId;
        var editor = Crisp.View.get('ContentEditor');

        if (editor && editor.model && editor.model.id == pullId) {
          editor.model = null;
          editor.fetch();
        }
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click push content
     */

  }, {
    key: "onClickPushContent",
    value: function onClickPushContent() {
      var $element = $('.context-menu-target');
      var pushId = $element.data('id');
      $element.parent().addClass('loading'); // API call to push the Content by id

      HashBrown.Helpers.RequestHelper.request('post', 'content/push/' + pushId) // Upon success, reload all Content models
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('content');
      }) // Reload the UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */

  }, {
    key: "onClickNewContent",
    value: function onClickNewContent(parentId, asSibling) {
      // Try to get a parent Schema if it exists
      return function getParentSchema() {
        if (parentId) {
          return HashBrown.Helpers.ContentHelper.getContentById(parentId).then(function (parentContent) {
            return HashBrown.Helpers.SchemaHelper.getSchemaById(parentContent.schemaId);
          });
        } else {
          return Promise.resolve();
        }
      }() // Parent Schema logic resolved, move on
      .then(function (parentSchema) {
        var allowedSchemas = parentSchema ? parentSchema.allowedChildSchemas : null; // If allowed child Schemas were found, but none were provided, don't create the Content node

        if (allowedSchemas && allowedSchemas.length < 1) {
          return Promise.reject(new Error('No child content schemas are allowed under this parent')); // Some child Schemas were provided, or no restrictions were defined
        } else {
          var schemaId;
          var sortIndex = HashBrown.Helpers.ContentHelper.getNewSortIndex(parentId); // Instatiate a new Content Schema reference editor

          var schemaReference = new HashBrown.Views.Editors.FieldEditors.ContentSchemaReferenceEditor({
            config: {
              allowedSchemas: allowedSchemas,
              parentSchema: parentSchema
            }
          });
          schemaReference.on('change', function (newValue) {
            schemaId = newValue;
          });
          schemaReference.pickFirstSchema();
          schemaReference.$element.addClass('widget'); // Render the confirmation modal

          UI.confirmModal('OK', 'Create new content', _.div({
            class: 'widget-group'
          }, _.label({
            class: 'widget widget--label'
          }, 'Schema'), schemaReference.$element), // Event fired when clicking "OK"
          function () {
            if (!schemaId) {
              return false;
            }

            var apiUrl = 'content/new/' + schemaId + '?sort=' + sortIndex;
            var newContent; // Append parent Content id to request URL

            if (parentId) {
              apiUrl += '&parent=' + parentId;
            } // API call to create new Content node


            HashBrown.Helpers.RequestHelper.request('post', apiUrl) // Upon success, reload resource and UI elements    
            .then(function (result) {
              newContent = result;
              return HashBrown.Helpers.RequestHelper.reloadResource('content');
            }).then(function () {
              HashBrown.Views.Navigation.NavbarMain.reload();
              location.hash = '/content/' + newContent.id;
            }).catch(UI.errorModal);
          });
        }
      }).catch(UI.errorModal);
    }
    /**
     * Render Content publishing modal
     *
     * @param {Content} content
     */

  }, {
    key: "renderPublishingModal",
    value: function renderPublishingModal(content) {
      var modal = new HashBrown.Views.Modals.PublishingSettingsModal({
        model: content
      });
      modal.on('change', function (newValue) {
        if (newValue.governedBy) {
          return;
        } // Commit publishing settings to Content model


        content.settings.publishing = newValue; // API call to save the Content model

        HashBrown.Helpers.RequestHelper.request('post', 'content/' + content.id, content) // Upon success, reload the UI    
        .then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload();

          if (Crisp.Router.params.id == content.id) {
            var contentEditor = Crisp.View.get('ContentEditor');
            contentEditor.model = content;
            return contentEditor.fetch();
          } else {
            return Promise.resolve();
          }
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click Content settings
     */

  }, {
    key: "onClickContentPublishing",
    value: function onClickContentPublishing() {
      var id = $('.context-menu-target').data('id'); // Get Content model

      var content = HashBrown.Helpers.ContentHelper.getContentByIdSync(id);
      this.renderPublishingModal(content);
    }
    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */

  }, {
    key: "onClickRemoveContent",
    value: function onClickRemoveContent(shouldUnpublish) {
      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var name = $element.data('name');
      HashBrown.Helpers.ContentHelper.getContentById(id).then(function (content) {
        content.settingsSanityCheck('publishing');

        function unpublishConnection() {
          return HashBrown.Helpers.RequestHelper.request('post', 'content/unpublish', content).then(function () {
            return onSuccess();
          });
        }

        function onSuccess() {
          return HashBrown.Helpers.RequestHelper.reloadResource('content').then(function () {
            HashBrown.Views.Navigation.NavbarMain.reload();
            var contentEditor = Crisp.View.get('ContentEditor'); // Change the ContentEditor view if it was displaying the deleted content

            if (contentEditor && contentEditor.model && contentEditor.model.id == id) {
              // The Content was actually deleted
              if (shouldUnpublish) {
                location.hash = '/content/'; // The Content still has a synced remote
              } else {
                contentEditor.model = null;
                contentEditor.fetch();
              }
            }

            $element.parent().toggleClass('loading', false);
            return Promise.resolve();
          });
        }

        var shouldDeleteChildren = false;
        UI.confirmModal('Remove', 'Remove the content "' + name + '"?', _.div({
          class: 'widget-group'
        }, _.label({
          class: 'widget widget--label'
        }, 'Remove child Content too'), new HashBrown.Views.Widgets.Input({
          value: shouldDeleteChildren,
          type: 'checkbox',
          onChange: function onChange(newValue) {
            shouldDeleteChildren = newValue;
          }
        }).$element), function () {
          $element.parent().toggleClass('loading', true);
          HashBrown.Helpers.RequestHelper.request('delete', 'content/' + id + '?removeChildren=' + shouldDeleteChildren).then(function () {
            if (shouldUnpublish && content.getSettings('publishing').connectionId) {
              return unpublishConnection();
            } else {
              return onSuccess();
            }
          }).catch(function (e) {
            $element.parent().toggleClass('loading', false);
            UI.errorModal(e);
          });
        });
      });
    }
    /**
     * Event: Click rename
     */

  }, {
    key: "onClickRename",
    value: function onClickRename() {
      var id = $('.context-menu-target').data('id');
      var content = HashBrown.Helpers.ContentHelper.getContentByIdSync(id);
      UI.messageModal('Rename "' + content.getPropertyValue('title', window.language) + '"', _.div({
        class: 'widget-group'
      }, _.label({
        class: 'widget widget--label'
      }, 'New name'), new HashBrown.Views.Widgets.Input({
        value: content.getPropertyValue('title', window.language),
        onChange: function onChange(newValue) {
          content.setPropertyValue('title', newValue, window.language);
        }
      })), function () {
        HashBrown.Helpers.ContentHelper.setContentById(id, content).then(function () {
          return HashBrown.Helpers.RequestHelper.reloadResource('content');
        }).then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload(); // Update ContentEditor if needed

          var contentEditor = Crisp.View.get('ContentEditor');

          if (!contentEditor || contentEditor.model.id !== id) {
            return;
          }

          contentEditor.model = null;
          contentEditor.fetch();
        }).catch(UI.errorModal);
      });
    }
    /**
     * Init
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      HashBrown.Views.Navigation.NavbarMain.addTabPane('/content/', 'Content', 'file', {
        getItems: function getItems() {
          return resources.content;
        },
        // Item context menu
        getItemContextMenu: function getItemContextMenu(item) {
          var menu = {};
          var isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
          menu['This content'] = '---';

          menu['Open in new tab'] = function () {
            _this.onClickOpenInNewTab();
          };

          menu['Rename'] = function () {
            _this.onClickRename();
          };

          menu['New child content'] = function () {
            _this.onClickNewContent($('.context-menu-target').data('id'));
          };

          if (!item.sync.isRemote && !item.isLocked) {
            menu['Move'] = function () {
              _this.onClickMoveItem();
            };
          }

          if (!item.sync.hasRemote && !item.isLocked) {
            menu['Remove'] = function () {
              _this.onClickRemoveContent(true);
            };
          }

          menu['Copy id'] = function () {
            _this.onClickCopyItemId();
          };

          if (!item.sync.isRemote && !item.isLocked) {
            menu['Settings'] = '---';

            menu['Publishing'] = function () {
              _this.onClickContentPublishing();
            };
          }

          if (item.isLocked && !item.sync.isRemote) {
            isSyncEnabled = false;
          }

          if (isSyncEnabled) {
            menu['Sync'] = '---';

            if (!item.sync.isRemote) {
              menu['Push to remote'] = function () {
                _this.onClickPushContent();
              };
            }

            if (item.sync.hasRemote) {
              menu['Remove local copy'] = function () {
                _this.onClickRemoveContent();
              };
            }

            if (item.sync.isRemote) {
              menu['Pull from remote'] = function () {
                _this.onClickPullContent();
              };
            }
          }

          menu['General'] = '---';

          menu['New content'] = function () {
            _this.onClickNewContent();
          };

          menu['Refresh'] = function () {
            _this.onClickRefreshResource('content');
          };

          return menu;
        },
        // Set general context menu items
        paneContextMenu: {
          'Content': '---',
          'New content': function NewContent() {
            _this.onClickNewContent();
          },
          'Refresh': function Refresh() {
            _this.onClickRefreshResource('content');
          }
        },
        // Hierarchy logic
        hierarchy: function hierarchy(item, queueItem) {
          // Set id data attributes
          queueItem.$element.attr('data-content-id', item.id);
          queueItem.parentDirAttr = {
            'data-content-id': item.parentId
          };
        }
      });
    }
  }]);

  return ContentPane;
}(HashBrown.Views.Navigation.NavbarPane);

module.exports = ContentPane;

/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The Forms navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var FormsPane =
/*#__PURE__*/
function (_HashBrown$Views$Navi) {
  _inherits(FormsPane, _HashBrown$Views$Navi);

  function FormsPane() {
    _classCallCheck(this, FormsPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormsPane).apply(this, arguments));
  }

  _createClass(FormsPane, null, [{
    key: "onClickNewForm",

    /**
     * Event: Click create new form
     */
    value: function onClickNewForm() {
      HashBrown.Helpers.RequestHelper.request('post', 'forms/new').then(function (newFormId) {
        return HashBrown.Helpers.RequestHelper.reloadResource('forms').then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload();
          location.hash = '/forms/' + newFormId;
        });
      }).catch(UI.errorModal);
    }
    /**
     * Event: On click remove
     */

  }, {
    key: "onClickRemoveForm",
    value: function onClickRemoveForm() {
      var view = this;
      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var form = resources.forms.filter(function (form) {
        return form.id == id;
      })[0];
      UI.confirmModal('delete', 'Delete form', 'Are you sure you want to delete the form "' + form.title + '"?', function () {
        HashBrown.Helpers.RequestHelper.request('delete', 'forms/' + form.id).then(function () {
          debug.log('Removed Form with id "' + form.id + '"', view);
          return HashBrown.Helpers.RequestHelper.reloadResource('forms');
        }).then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload(); // Cancel the FormEditor view

          location.hash = '/forms/';
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click pull Form
     */

  }, {
    key: "onClickPullForm",
    value: function onClickPullForm() {
      var pullId = $('.context-menu-target').data('id'); // API call to pull the Form by id

      HashBrown.Helpers.RequestHelper.request('post', 'forms/pull/' + pullId, {}) // Upon success, reload all Form models    
      .then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('forms');
      }) // Reload the UI
      .then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/forms/' + pullId;
        var editor = Crisp.View.get('FormEditor');

        if (editor && editor.model.id == pullId) {
          editor.model = null;
          editor.fetch();
        }
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click push Form
     */

  }, {
    key: "onClickPushForm",
    value: function onClickPushForm() {
      var $element = $('.context-menu-target');
      var pushId = $element.data('id');
      $element.parent().addClass('loading');
      HashBrown.Helpers.RequestHelper.request('post', 'forms/push/' + pushId).then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('forms');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Init
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      HashBrown.Views.Navigation.NavbarMain.addTabPane('/forms/', 'Forms', 'wpforms', {
        icon: 'wpforms',
        getItems: function getItems() {
          return resources.forms;
        },
        // Hierarchy logic
        hierarchy: function hierarchy(item, queueItem) {
          queueItem.$element.attr('data-form-id', item.id);

          if (item.folder) {
            queueItem.createDir = true;
            queueItem.parentDirAttr = {
              'data-form-folder': item.folder
            };
          }
        },
        // Item context menu
        getItemContextMenu: function getItemContextMenu(item) {
          var menu = {};
          var isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
          menu['This form'] = '---';

          menu['Open in new tab'] = function () {
            _this.onClickOpenInNewTab();
          };

          if (!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = function () {
              _this.onClickRemoveForm();
            };
          }

          menu['Copy id'] = function () {
            _this.onClickCopyItemId();
          };

          if (item.isLocked && !item.sync.isRemote) {
            isSyncEnabled = false;
          }

          if (isSyncEnabled) {
            menu['Sync'] = '---';

            if (!item.sync.isRemote) {
              menu['Push to remote'] = function () {
                _this.onClickPushForm();
              };
            }

            if (item.sync.hasRemote) {
              menu['Remove local copy'] = function () {
                _this.onClickRemoveForm();
              };
            }

            if (item.sync.isRemote) {
              menu['Pull from remote'] = function () {
                _this.onClickPullForm();
              };
            }
          }

          menu['General'] = '---';

          menu['New form'] = function () {
            _this.onClickNewForm();
          };

          menu['Refresh'] = function () {
            _this.onClickRefreshResource('forms');
          };

          return menu;
        },
        // General context menu
        paneContextMenu: {
          'Forms': '---',
          'New form': function NewForm() {
            _this.onClickNewForm();
          },
          'Refresh': function Refresh() {
            _this.onClickRefreshResource('forms');
          }
        }
      });
    }
  }]);

  return FormsPane;
}(HashBrown.Views.Navigation.NavbarPane);

module.exports = FormsPane;

/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The Media navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MediaPane =
/*#__PURE__*/
function (_HashBrown$Views$Navi) {
  _inherits(MediaPane, _HashBrown$Views$Navi);

  function MediaPane() {
    _classCallCheck(this, MediaPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(MediaPane).apply(this, arguments));
  }

  _createClass(MediaPane, null, [{
    key: "onChangeDirectory",

    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    value: function onChangeDirectory(id, newFolder) {
      HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, newFolder ? {
        id: id,
        folder: newFolder
      } : null).then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('media');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/media/' + id;
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click rename media
     */

  }, {
    key: "onClickRenameMedia",
    value: function onClickRenameMedia() {
      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var name = $element.data('name');
      var modal = UI.messageModal('Rename ' + name, new HashBrown.Views.Widgets.Input({
        type: 'text',
        value: name,
        onChange: function onChange(newValue) {
          name = newValue;
        }
      }), function () {
        HashBrown.Helpers.RequestHelper.request('post', 'media/rename/' + id + '?name=' + name).then(function () {
          return HashBrown.Helpers.RequestHelper.reloadResource('media');
        }).then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload();
          var mediaViewer = Crisp.View.get(HashBrown.Views.Editors.MediaViewer);

          if (mediaViewer && mediaViewer.model && mediaViewer.model.id === id) {
            mediaViewer.model = null;
            mediaViewer.fetch();
          }
        }).catch(UI.errorModal);
      });
      modal.$element.find('input').focus();
    }
    /**
     * Event: Click remove media
     */

  }, {
    key: "onClickRemoveMedia",
    value: function onClickRemoveMedia() {
      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var name = $element.data('name');
      UI.confirmModal('delete', 'Delete media', 'Are you sure you want to delete the media object "' + name + '"?', function () {
        $element.parent().toggleClass('loading', true);
        HashBrown.Helpers.RequestHelper.request('delete', 'media/' + id).then(function () {
          return HashBrown.Helpers.RequestHelper.reloadResource('media');
        }).then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload(); // Cancel the MediaViever view if it was displaying the deleted object

          if (location.hash == '#/media/' + id) {
            location.hash = '/media/';
          }
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click replace media
     */

  }, {
    key: "onClickReplaceMedia",
    value: function onClickReplaceMedia() {
      var id = $('.context-menu-target').data('id');
      this.onClickUploadMedia(id);
    }
    /**
     * Event: Click upload media
     */

  }, {
    key: "onClickUploadMedia",
    value: function onClickUploadMedia(replaceId) {
      var folder = $('.context-menu-target').data('media-folder') || '/';
      new HashBrown.Views.Modals.MediaUploader({
        onSuccess: function onSuccess(ids) {
          // We got one id back
          if (typeof ids === 'string') {
            location.hash = '/media/' + ids; // We got several ids back
          } else if (Array.isArray(ids)) {
            location.hash = '/media/' + ids[0];
          } // Refresh on replace


          if (replaceId) {
            var mediaViewer = Crisp.View.get(HashBrown.Views.Editors.MediaViewer);

            if (mediaViewer) {
              mediaViewer.model = null;
              mediaViewer.fetch();
            }
          }
        },
        replaceId: replaceId,
        folder: folder
      });
    }
    /**
     * Init
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      HashBrown.Views.Navigation.NavbarMain.addTabPane('/media/', 'Media', 'file-image-o', {
        getItems: function getItems() {
          return resources.media;
        },
        // Hierarchy logic
        hierarchy: function hierarchy(item, queueItem) {
          var isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
          queueItem.$element.attr('data-media-id', item.id);
          queueItem.$element.attr('data-remote', true);

          if (item.folder) {
            queueItem.createDir = true;
            queueItem.parentDirAttr = {
              'data-media-folder': item.folder
            };
            queueItem.parentDirExtraAttr = {
              'data-remote': isSyncEnabled
            };
          }
        },
        // Item context menu
        itemContextMenu: {
          'This media': '---',
          'Open in new tab': function OpenInNewTab() {
            _this.onClickOpenInNewTab();
          },
          'Move': function Move() {
            _this.onClickMoveItem();
          },
          'Rename': function Rename() {
            _this.onClickRenameMedia();
          },
          'Remove': function Remove() {
            _this.onClickRemoveMedia();
          },
          'Replace': function Replace() {
            _this.onClickReplaceMedia();
          },
          'Copy id': function CopyId() {
            _this.onClickCopyItemId();
          },
          'General': '---',
          'Upload new media': function UploadNewMedia() {
            _this.onClickUploadMedia();
          },
          'Refresh': function Refresh() {
            _this.onClickRefreshResource('media');
          }
        },
        // Dir context menu
        dirContextMenu: {
          'Directory': '---',
          'Upload new media': function UploadNewMedia() {
            _this.onClickUploadMedia();
          },
          'General': '---',
          'Refresh': function Refresh() {
            _this.onClickRefreshResource('media');
          }
        },
        // General context menu
        paneContextMenu: {
          'Media': '---',
          'Upload new media': function UploadNewMedia() {
            _this.onClickUploadMedia();
          },
          'Refresh': function Refresh() {
            _this.onClickRefreshResource('media');
          }
        }
      });
    }
  }]);

  return MediaPane;
}(HashBrown.Views.Navigation.NavbarPane); // Settings


MediaPane.canCreateDirectory = true;
module.exports = MediaPane;

/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The Schema navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SchemaPane =
/*#__PURE__*/
function (_HashBrown$Views$Navi) {
  _inherits(SchemaPane, _HashBrown$Views$Navi);

  function SchemaPane() {
    _classCallCheck(this, SchemaPane);

    return _possibleConstructorReturn(this, _getPrototypeOf(SchemaPane).apply(this, arguments));
  }

  _createClass(SchemaPane, null, [{
    key: "onClickRemoveSchema",

    /**
     * Event: Click remove schema
     */
    value: function onClickRemoveSchema() {
      var _this = this;

      var $element = $('.context-menu-target');
      var id = $element.data('id');
      var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(id);

      if (!schema.isLocked) {
        UI.confirmModal('delete', 'Delete schema', 'Are you sure you want to delete the schema "' + schema.name + '"?', function () {
          HashBrown.Helpers.RequestHelper.request('delete', 'schemas/' + id).then(function () {
            debug.log('Removed schema with id "' + id + '"', _this);
            return HashBrown.Helpers.RequestHelper.reloadResource('schemas');
          }).then(function () {
            HashBrown.Views.Navigation.NavbarMain.reload(); // Cancel the SchemaEditor view if it was displaying the deleted content

            if (location.hash == '#/schemas/' + id) {
              location.hash = '/schemas/';
            }
          }).catch(UI.errorModal);
        });
      } else {
        UI.messageModal('Delete schema', 'The schema "' + schema.name + '" is locked and cannot be removed');
      }
    }
    /**
     * Event: Click new Schema
     */

  }, {
    key: "onClickNewSchema",
    value: function onClickNewSchema() {
      var parentId = $('.context-menu-target').data('id');
      var parentSchema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(parentId);
      HashBrown.Helpers.RequestHelper.request('post', 'schemas/new', parentSchema).then(function (newSchema) {
        return HashBrown.Helpers.RequestHelper.reloadResource('schemas').then(function () {
          HashBrown.Views.Navigation.NavbarMain.reload();
          location.hash = '/schemas/' + newSchema.id;
        });
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click pull Schema
     */

  }, {
    key: "onClickPullSchema",
    value: function onClickPullSchema() {
      var schemaEditor = Crisp.View.get('SchemaEditor');
      var pullId = $('.context-menu-target').data('id');
      HashBrown.Helpers.RequestHelper.request('post', 'schemas/pull/' + pullId, {}).then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('schemas');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
        location.hash = '/schemas/' + pullId;
        var editor = Crisp.View.get('SchemaEditor');

        if (editor && editor.model.id == pullId) {
          editor.model = null;
          editor.fetch();
        }
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click push Schema
     */

  }, {
    key: "onClickPushSchema",
    value: function onClickPushSchema() {
      var $element = $('.context-menu-target');
      var pushId = $element.data('id');
      $element.parent().addClass('loading');
      HashBrown.Helpers.RequestHelper.request('post', 'schemas/push/' + pushId).then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('schemas');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      }).catch(UI.errorModal);
    }
    /**
     * Init
     */

  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      if (!currentUserHasScope('schemas')) {
        return;
      }

      HashBrown.Views.Navigation.NavbarMain.addTabPane('/schemas/', 'Schemas', 'gears', {
        getItems: function getItems() {
          return resources.schemas;
        },
        // Item context menu
        getItemContextMenu: function getItemContextMenu(item) {
          var menu = {};
          var isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(HashBrown.Helpers.ProjectHelper.currentProject, null, 'sync').enabled;
          menu['This schema'] = '---';

          menu['Open in new tab'] = function () {
            _this2.onClickOpenInNewTab();
          };

          menu['New child schema'] = function () {
            _this2.onClickNewSchema();
          };

          if (!item.sync.hasRemote && !item.sync.isRemote && !item.isLocked) {
            menu['Remove'] = function () {
              _this2.onClickRemoveSchema();
            };
          }

          menu['Copy id'] = function () {
            _this2.onClickCopyItemId();
          };

          if (item.isLocked && !item.sync.isRemote) {
            isSyncEnabled = false;
          }

          if (isSyncEnabled) {
            menu['Sync'] = '---';

            if (!item.sync.isRemote) {
              menu['Push to remote'] = function () {
                _this2.onClickPushSchema();
              };
            }

            if (item.sync.hasRemote) {
              menu['Remove local copy'] = function () {
                _this2.onClickRemoveSchema();
              };
            }

            if (item.sync.isRemote) {
              menu['Pull from remote'] = function () {
                _this2.onClickPullSchema();
              };
            }
          }

          menu['General'] = '---';

          menu['Refresh'] = function () {
            _this2.onClickRefreshResource('schemas');
          };

          return menu;
        },
        // Set general context menu items
        paneContextMenu: {
          'Schemas': '---',
          'Refresh': function Refresh() {
            _this2.onClickRefreshResource('schemas');
          }
        },
        // Hierarchy logic
        hierarchy: function hierarchy(item, queueItem) {
          queueItem.$element.attr('data-schema-id', item.id);

          if (item.parentSchemaId) {
            queueItem.parentDirAttr = {
              'data-schema-id': item.parentSchemaId
            };
          } else {
            queueItem.parentDirAttr = {
              'data-schema-type': item.type
            };
          }
        }
      });
    }
  }]);

  return SchemaPane;
}(HashBrown.Views.Navigation.NavbarPane);

module.exports = SchemaPane;

/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Views.Dashboard
 */

namespace('Views.Dashboard').add(__webpack_require__(285)).add(__webpack_require__(286)).add(__webpack_require__(287)).add(__webpack_require__(288)).add(__webpack_require__(289)).add(__webpack_require__(290));

/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The project backup editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BackupEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(BackupEditor, _HashBrown$Views$Moda);

  function BackupEditor() {
    _classCallCheck(this, BackupEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(BackupEditor).apply(this, arguments));
  }

  _createClass(BackupEditor, [{
    key: "onClickUploadBackup",

    /**
     * Event: Click upload button
     */
    value: function onClickUploadBackup() {
      var _this = this;

      var uploadModal = new HashBrown.Views.Modals.Modal({
        title: 'Upload a backup file',
        body: new HashBrown.Views.Widgets.Input({
          type: 'file',
          name: 'backup',
          onSubmit: function onSubmit(formData) {
            var apiPath = 'server/backups/' + _this.model.id + '/upload'; // TODO: Use the HashBrown.Helpers.ReqestHelper for this

            $.ajax({
              url: HashBrown.Helpers.RequestHelper.environmentUrl(apiPath),
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
              success: function success(id) {
                _this.model = null;

                _this.fetch();

                uploadModal.close();
              }
            });
          }
        }).$element,
        actions: [{
          label: 'OK',
          onClick: function onClick() {
            uploadModal.$element.find('form').submit();
            return false;
          }
        }]
      });
    }
    /**
     * Event: Click backup button
     */

  }, {
    key: "onClickCreateBackup",
    value: function onClickCreateBackup() {
      var _this2 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      HashBrown.Helpers.RequestHelper.request('post', 'server/backups/' + this.model.id + '/new').then(function (data) {
        _this2.model = null;

        _this2.fetch();
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click restore backup button
     *
     * @param {String} timestamp
     */

  }, {
    key: "onClickRestoreBackup",
    value: function onClickRestoreBackup(timestamp) {
      var _this3 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      var label = '"' + timestamp + '"';
      var date = new Date(parseInt(timestamp));

      if (!isNaN(date.getTime())) {
        label = date.toString();
      }

      var modal = UI.confirmModal('restore', 'Restore backup', 'Are you sure you want to restore the backup ' + label + '? Current content will be replaced.', function () {
        HashBrown.Helpers.RequestHelper.request('post', 'server/backups/' + _this3.model.id + '/' + timestamp + '/restore').then(function () {
          modal.close();

          _this3.trigger('change');

          _this3.close();
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click delete backup button
     */

  }, {
    key: "onClickDeleteBackup",
    value: function onClickDeleteBackup(timestamp) {
      var _this4 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      var label = timestamp;
      var date = new Date(parseInt(timestamp));

      if (!isNaN(date.getTime())) {
        label = date.toString();
      }

      var modal = UI.confirmModal('delete', 'Delete backup', 'Are you sure you want to delete the backup "' + label + '"?', function () {
        HashBrown.Helpers.RequestHelper.request('delete', 'server/backups/' + _this4.model.id + '/' + timestamp).then(function () {
          modal.close();
          _this4.model = null;

          _this4.fetch();
        }).catch(UI.errorModal);
      });
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      var _this5 = this;

      if (this.model instanceof HashBrown.Models.Project === false) {
        this.model = new HashBrown.Models.Project(this.model);
      }

      this.title = this.model.settings.info.name + ' backups';
      this.body = _.div(_.if(!this.model.backups || this.model.backups.length < 1, _.label({
        class: 'widget widget--label'
      }, 'No backups yet')), // List existing backups
      _.each(this.model.backups, function (i, backup) {
        var label = backup;
        var date = new Date(parseInt(backup));

        if (!isNaN(date.getTime())) {
          label = date.toString();
        }

        return _.div({
          class: 'page--dashboard__backup-editor__backup widget-group'
        }, _.p({
          class: 'widget widget--label page--dashboard__backup-editor__back__label'
        }, label), new HashBrown.Views.Widgets.Dropdown({
          icon: 'ellipsis-v',
          reverseKeys: true,
          options: {
            'Restore': function Restore() {
              _this5.onClickRestoreBackup(backup);
            },
            'Download': function Download() {
              location = HashBrown.Helpers.ReqestHelper.environmentUrl('server/backups/' + _this5.model.id + '/' + backup + '.hba');
            },
            'Delete': function Delete() {
              _this5.onClickDeleteBackup(backup);
            }
          }
        }).$element);
      }));
    }
    /**
     * Renders the modal footer
     *
     * @returns {HTMLElement} Footer
     */

  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this6 = this;

      return [_.button({
        class: 'widget widget--button',
        title: 'Upload backup'
      }, 'Upload').click(function () {
        _this6.onClickUploadBackup();
      }), _.button({
        class: 'widget widget--button',
        title: 'Create a new backup'
      }, 'Create').click(function () {
        _this6.onClickCreateBackup();
      })];
    }
  }]);

  return BackupEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = BackupEditor;

/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The info settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InfoEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(InfoEditor, _HashBrown$Views$Moda);

  function InfoEditor(params) {
    var _this;

    _classCallCheck(this, InfoEditor);

    params.title = 'Project info';
    params.actions = [{
      label: 'Save',
      onClick: function onClick() {
        _this.onClickSave();

        return false;
      }
    }];
    params.autoFetch = false;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(InfoEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click save. Posts the model to the modelUrl
   */


  _createClass(InfoEditor, [{
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      HashBrown.Helpers.SettingsHelper.setSettings(this.model.id, null, 'info', this.model.settings.info).then(function () {
        _this2.close();

        _this2.trigger('change', _this2.model);
      }).catch(UI.errorModal);
    }
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this3 = this;

      if (!this.model) {
        return;
      }

      return _.div({
        class: 'widget-group'
      }, _.span({
        class: 'widget widget--label'
      }, 'Name'), new HashBrown.Views.Widgets.Input({
        value: this.model.settings.info.name,
        onChange: function onChange(newName) {
          _this3.model.settings.info.name = newName;
        }
      }));
    }
  }]);

  return InfoEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = InfoEditor;

/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The language settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LanguageEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(LanguageEditor, _HashBrown$Views$Moda);

  function LanguageEditor(params) {
    var _this;

    _classCallCheck(this, LanguageEditor);

    params.title = 'Languages';
    params.actions = [{
      label: 'Save',
      onClick: function onClick() {
        _this.onClickSave();

        return false;
      }
    }];
    params.autoFetch = false;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(LanguageEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click save
   */


  _createClass(LanguageEditor, [{
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      HashBrown.Helpers.LanguageHelper.setLanguages(this.model.id, this.model.settings.languages).then(function () {
        _this2.close();

        _this2.trigger('change');
      }).catch(UI.errorModal);
    }
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this3 = this;

      return _.div({
        class: 'widget-group'
      }, _.label({
        class: 'widget widget--label'
      }, 'Selected languages'), new HashBrown.Views.Widgets.Dropdown({
        value: this.model.settings.languages,
        useTypeAhead: true,
        useMultiple: true,
        options: HashBown.Helpers.LanguageHelper.getLanguageOptions(this.model.id),
        onChange: function onChange(newValue) {
          _this3.model.settings.languages = newValue;
        }
      }).$element);
    }
  }]);

  return LanguageEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = LanguageEditor;

/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for migrating content between environments
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MigrationEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(MigrationEditor, _HashBrown$Views$Moda);

  function MigrationEditor(params) {
    var _this;

    _classCallCheck(this, MigrationEditor);

    params.title = 'Migrate content';
    params.actions = [{
      label: 'Migrate',
      onClick: function onClick() {
        _this.onSubmit();

        return false;
      }
    }];
    params.data = {
      from: params.model.environments[0],
      to: '',
      settings: {
        schemas: true,
        replace: true
      }
    };
    return _this = _possibleConstructorReturn(this, _getPrototypeOf(MigrationEditor).call(this, params));
  }
  /**
   * Pre render
   */


  _createClass(MigrationEditor, [{
    key: "prerender",
    value: function prerender() {
      if (!this.data.to || this.getToOptions().indexOf(this.data.to) < 0) {
        this.data.to = this.getToOptions()[0];
      }
    }
    /**
     * Renders this modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      var _this2 = this;

      return [_.div({
        class: 'widget-group'
      }, new HashBrown.Views.Widgets.Dropdown({
        value: this.data.from,
        options: this.model.environments,
        onChange: function onChange(newValue) {
          _this2.data.from = newValue;

          _this2.fetch();
        }
      }).$element, _.div({
        class: 'widget-group__separator fa fa-arrow-right'
      }), new HashBrown.Views.Widgets.Dropdown({
        value: this.data.to,
        options: this.getToOptions(),
        onChange: function onChange(newValue) {
          _this2.data.to = newValue;
        }
      }).$element), _.each({
        replace: 'Overwrite on target',
        schemas: 'Schemas',
        content: 'Content',
        forms: 'Forms',
        media: 'Media',
        connections: 'Connections'
      }, function (key, label) {
        return _.div({
          class: 'widget-group'
        }, _.label({
          class: 'widget widget--label'
        }, label), new HashBrown.Views.Widgets.Input({
          type: 'checkbox',
          value: _this2.data.settings[key] === true,
          onChange: function onChange(newValue) {
            _this2.data.settings[key] = newValue;
          }
        }).$element);
      })];
    }
    /**
     * Gets the displayed "to" options
     */

  }, {
    key: "getToOptions",
    value: function getToOptions() {
      var _this3 = this;

      return this.model.environments.filter(function (environment) {
        return environment !== _this3.data.from;
      });
    }
    /**
     * Event: Clicked submit
     */

  }, {
    key: "onSubmit",
    value: function onSubmit() {
      var _this4 = this;

      HashBrown.Helpers.RequestHelper.request('post', 'server/migrate/' + this.model.id, this.data).then(function () {
        UI.messageModal('Success', 'Successfully migrated content from "' + _this4.data.from + '" to "' + _this4.data.to + '"', function () {
          _this4.trigger('change');

          _this4.close();
        });
      }).catch(UI.errorModal);
    }
  }]);

  return MigrationEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = MigrationEditor;

/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The editor for projects as seen on the dashboard
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ProjectEditor =
/*#__PURE__*/
function (_Crisp$View) {
  _inherits(ProjectEditor, _Crisp$View);

  function ProjectEditor(params) {
    var _this;

    _classCallCheck(this, ProjectEditor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProjectEditor).call(this, params));

    _.append(_this.element, _.div({
      class: 'widget--spinner embedded'
    }, _.div({
      class: 'widget--spinner__image fa fa-refresh'
    })));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click remove button
   */


  _createClass(ProjectEditor, [{
    key: "onClickRemove",
    value: function onClickRemove() {
      var _this2 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      var modal = new HashBrown.Views.Modals.Modal({
        title: 'Delete ' + this.model.settings.info.name,
        body: _.div({
          class: 'widget-group'
        }, _.p({
          class: 'widget widget--label'
        }, 'Type the project name to confirm'), _.input({
          class: 'widget widget--input text',
          type: 'text',
          placeholder: this.model.settings.info.name
        }).on('input', function (e) {
          var $btn = modal.$element.find('.widget.warning');

          var isMatch = $(e.target).val() == _this2.model.settings.info.name;

          $btn.toggleClass('disabled', !isMatch);
        })),
        actions: [{
          label: 'Cancel',
          class: 'default'
        }, {
          label: 'Delete',
          class: 'warning disabled',
          onClick: function onClick() {
            HashBrown.Helpers.RequestHelper.request('delete', 'server/projects/' + _this2.model.id).then(function () {
              location.reload();
            }).catch(UI.errorModal);
          }
        }]
      });
    }
    /**
     * Event: Click remove environment
     *
     * @param {String} environmentName
     */

  }, {
    key: "onClickRemoveEnvironment",
    value: function onClickRemoveEnvironment(environmentName) {
      var _this3 = this;

      var modal = UI.confirmModal('Remove', 'Remove environment "' + environmentName + '"', 'Are you sure want to remove the environment "' + environmentName + '" from the project "' + (this.model.settings.info.name || this.model.id) + '"?', function () {
        HashBrown.Helpers.RequestHelper.request('delete', 'server/projects/' + _this3.model.id + '/' + environmentName).then(function () {
          _this3.model = null;

          _this3.fetch();
        }).catch(UI.errorModal);
      });
    }
    /**
     * Event: Click info button */

  }, {
    key: "onClickInfo",
    value: function onClickInfo() {
      var _this4 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      new HashBrown.Views.Dashboard.InfoEditor({
        modelUrl: '/api/server/projects/' + this.model.id
      }).on('change', function (newInfo) {
        _this4.model = null;

        _this4.fetch();
      });
    }
    /**
     * Event: Click sync button
     */

  }, {
    key: "onClickSync",
    value: function onClickSync() {
      var _this5 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      new HashBrown.Views.Dashboard.SyncEditor({
        projectId: this.model.id,
        modelUrl: '/api/' + this.model.id + '/settings/sync'
      }).on('change', function (newSettings) {
        _this5.model = null;

        _this5.fetch();
      });
    }
    /**
     * Event: Click languages button
     */

  }, {
    key: "onClickLanguages",
    value: function onClickLanguages() {
      var _this6 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      new HashBrown.Views.Dashboard.LanguageEditor({
        modelUrl: '/api/server/projects/' + this.model.id
      }).on('change', function () {
        _this6.model = null;

        _this6.fetch();
      });
    }
    /**
     * Event: Click backups button
     */

  }, {
    key: "onClickBackups",
    value: function onClickBackups() {
      var _this7 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      new HashBrown.Views.Dashboard.BackupEditor({
        modelUrl: '/api/server/projects/' + this.model.id
      }).on('change', function () {
        _this7.model = null;

        _this7.fetch();
      });
    }
    /**
     * Event: Click migration button
     */

  }, {
    key: "onClickMigrate",
    value: function onClickMigrate() {
      var _this8 = this;

      if (!currentUserIsAdmin()) {
        return;
      }

      if (this.model.environments.length < 2) {
        UI.errorModal(new Error('You need at least 2 environments to migrate content'));
        return;
      }

      new HashBrown.Views.Dashboard.MigrationEditor({
        model: this.model
      }).on('change', function () {
        _this8.model = null;

        _this8.fetch();
      });
    }
    /**
     * Event: Click add environment button
     */

  }, {
    key: "onClickAddEnvironment",
    value: function onClickAddEnvironment() {
      var _this9 = this;

      var modal = new HashBrown.Views.Modals.Modal({
        title: 'New environment for "' + this.model.id + '"',
        body: _.div({
          class: 'widget-group'
        }, _.label({
          class: 'widget widget--label'
        }, 'Environment name'), new HashBrown.Views.Widgets.Input({
          placeholder: 'i.e. "testing" or "staging"'
        })),
        actions: [{
          label: 'Create',
          onClick: function onClick() {
            var environmentName = modal.$element.find('input').val();

            if (!environmentName) {
              return false;
            }

            HashBrown.Helpers.RequestHelper.request('put', 'server/projects/' + _this9.model.id + '/' + environmentName).then(function () {
              modal.close();
              _this9.model = null;

              _this9.fetch();
            }).catch(UI.errorModal);
            return false;
          }
        }]
      });
    }
    /**
     * Pre render
     */

  }, {
    key: "prerender",
    value: function prerender() {
      if (this.model instanceof HashBrown.Models.Project === false) {
        this.model = new HashBrown.Models.Project(this.model);
      }
    }
    /**
     * Renders this editor
     */

  }, {
    key: "template",
    value: function template() {
      var _this10 = this;

      var languageCount = this.model.settings.languages.length;
      var userCount = this.model.users.length;
      return _.div({
        class: 'page--dashboard__project in'
      }, _.div({
        class: 'page--dashboard__project__body'
      }, _.if(currentUserIsAdmin(), new HashBrown.Views.Widgets.Dropdown({
        icon: 'ellipsis-v',
        reverseKeys: true,
        options: {
          'Info': function Info() {
            _this10.onClickInfo();
          },
          'Languages': function Languages() {
            _this10.onClickLanguages();
          },
          'Backups': function Backups() {
            _this10.onClickBackups();
          },
          'Sync': function Sync() {
            _this10.onClickSync();
          },
          'Delete': function Delete() {
            _this10.onClickRemove();
          },
          'Migrate content': function MigrateContent() {
            _this10.onClickMigrate();
          }
        }
      }).$element.addClass('page--dashboard__project__menu')), _.div({
        class: 'page--dashboard__project__info'
      }, _.h4(this.model.settings.info.name || this.model.id), _.p(userCount + ' user' + (userCount != 1 ? 's' : '')), _.p(languageCount + ' language' + (languageCount != 1 ? 's' : '') + ' (' + this.model.settings.languages.join(', ') + ')')), _.div({
        class: 'page--dashboard__project__environments'
      }, _.each(this.model.environments, function (i, environment) {
        return _.div({
          class: 'page--dashboard__project__environment'
        }, _.a({
          title: 'Go to "' + environment + '" CMS',
          href: '/' + _this10.model.id + '/' + environment,
          class: 'widget widget--button expanded'
        }, environment), _.if(currentUserIsAdmin(), new HashBrown.Views.Widgets.Dropdown({
          icon: 'ellipsis-v',
          reverseKeys: true,
          options: {
            'Delete': function Delete() {
              _this10.onClickRemoveEnvironment(environment);
            }
          }
        }).$element.addClass('page--dashboard__project__environment__menu')));
      }), _.if(currentUserIsAdmin(), _.button({
        title: 'Add environment',
        class: 'widget widget--button round right fa fa-plus'
      }).click(function () {
        _this10.onClickAddEnvironment();
      })))));
    }
  }]);

  return ProjectEditor;
}(Crisp.View);

module.exports = ProjectEditor;

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The sync settings editor
 *
 * @memberof HashBrown.Client.Views.Dashboard
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SyncEditor =
/*#__PURE__*/
function (_HashBrown$Views$Moda) {
  _inherits(SyncEditor, _HashBrown$Views$Moda);

  function SyncEditor(params) {
    var _this;

    _classCallCheck(this, SyncEditor);

    params.title = 'Sync';
    params.actions = [{
      label: 'Apply',
      class: 'btn-primary',
      onClick: function onClick() {
        _this.onClickApply();

        return false;
      }
    }, {
      label: 'Save',
      class: 'btn-primary',
      onClick: function onClick() {
        _this.onClickSave();

        return false;
      }
    }];
    params.autoFetch = false;
    _this = _possibleConstructorReturn(this, _getPrototypeOf(SyncEditor).call(this, params));

    _this.fetch();

    return _this;
  }
  /**
   * Event: Click save. Posts the model to the modelUrl and closes
   */


  _createClass(SyncEditor, [{
    key: "onClickSave",
    value: function onClickSave() {
      var _this2 = this;

      this.model.url = this.$element.find('input[name="url"]').val();
      HashBrown.Helpers.SettingsHelper.setSettings(this.projectId, '', 'sync', this.model).then(function () {
        _this2.close();

        _this2.trigger('change', _this2.model);
      }).catch(UI.errorModal);
    }
    /**
     * Event: Click apply. Posts the model to the modelUrl
     */

  }, {
    key: "onClickApply",
    value: function onClickApply() {
      var _this3 = this;

      this.model.url = this.$element.find('input[name="url"]').val();
      HashBrown.Helpers.SettingsHelper.setSettings(this.projectId, '', 'sync', this.model).then(function () {
        _this3.trigger('change', _this3.model);
      }).catch(UI.errorModal);
    }
    /**
     * Render enabled switch
     */

  }, {
    key: "renderEnabledSwitch",
    value: function renderEnabledSwitch() {
      var _this4 = this;

      return new HashBrown.Views.Widgets.Input({
        type: 'checkbox',
        name: 'enabled',
        value: this.model.enabled === true,
        onChange: function onChange(newValue) {
          _this4.model.enabled = newValue;
        }
      }).$element;
    }
    /**
     * Renders the URL editor
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "renderUrlEditor",
    value: function renderUrlEditor() {
      return new HashBrown.Views.Widgets.Input({
        name: 'url',
        type: 'text',
        value: this.model.url || '',
        placeholder: 'e.g. "https://myserver.com/api/"'
      }).$element;
    }
    /**
     * Renders the project id editor
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "renderProjectIdEditor",
    value: function renderProjectIdEditor() {
      var _this5 = this;

      return new HashBrown.Views.Widgets.Input({
        name: 'name',
        value: this.model.project,
        onChange: function onChange(newValue) {
          _this5.model.project = newValue;
        }
      }).$element;
    }
    /**
     * Renders the token editor
     *
     * @returns {HTMLElement} Element
     */

  }, {
    key: "renderTokenEditor",
    value: function renderTokenEditor() {
      var _this6 = this;

      return [new HashBrown.Views.Widgets.Input({
        value: this.model.token,
        name: 'token',
        placeholder: 'API token',
        onChange: function onChange(newToken) {
          _this6.model.token = newToken;
        }
      }).$element, _.button({
        class: 'widget widget--button small fa fa-refresh'
      }).on('click', function () {
        if (!_this6.model.url) {
          alert('You need to specify a URL. Please do so and apply the settings first.');
          return;
        }

        var tokenModal = new HashBrown.Views.Modals.Modal({
          title: 'Refresh token',
          body: [_.div({
            class: 'widget-group'
          }, _.label({
            class: 'widget widget--label'
          }, 'Username'), _.input({
            class: 'widget widget--input text',
            type: 'text'
          })), _.div({
            class: 'widget-group'
          }, _.label({
            class: 'widget widget--label'
          }, 'Password'), _.input({
            class: 'widget widget--input text',
            type: 'password'
          }))],
          actions: [{
            label: 'Get token',
            onClick: function onClick() {
              var username = tokenModal.element.querySelector('input[type="text"]').value;
              var password = tokenModal.element.querySelector('input[type="password"]').value;
              HashBrown.Helpers.RequestHelper.request('post', _this6.projectId + '/sync/login', {
                username: username,
                password: password
              }).then(function (token) {
                _this6.model.token = token;
                _this6.element.querySelector('input[name="token"]').value = token;
              }).catch(UI.errorModal);
            }
          }]
        });
      })];
    }
    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} $content
     *
     * @return {HTMLElement} Editor element
     */

  }, {
    key: "renderField",
    value: function renderField(label, $content) {
      return _.div({
        class: 'widget-group'
      }, _.div({
        class: 'widget widget--label'
      }, label), $content);
    }
    /**
     * Renders the modal body
     *
     * @returns {HTMLElement} Body
     */

  }, {
    key: "renderBody",
    value: function renderBody() {
      return [this.renderField('Enabled', this.renderEnabledSwitch()), this.renderField('API URL', this.renderUrlEditor()), this.renderField('API Token', this.renderTokenEditor()), this.renderField('Project id', this.renderProjectIdEditor())];
    }
  }]);

  return SyncEditor;
}(HashBrown.Views.Modals.Modal);

module.exports = SyncEditor;

/***/ })
/******/ ]));
//# sourceMappingURL=views.js.map