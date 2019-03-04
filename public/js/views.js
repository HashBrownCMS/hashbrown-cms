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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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

          if (modal.group !== _this.group || modal === _assertThisInitialized(_this)) {
            continue;
          }

          modal.append(_assertThisInitialized(_this));

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
      fieldEditorInstance.element.classList.toggle('editor__field__value', true);
      fieldEditorInstance.on('ready', function () {
        fieldEditorInstance.element.classList.toggle('editor__field__value', true);
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

      var url = this.model.properties.url;

      if (url instanceof Object) {
        url = url[window.language];
      }

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
        class: 'editor__field__value'
      }, _.each(this.model.inputs, function (key, input) {
        return _.div({
          class: 'editor__field raised'
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

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jshint node:true */

/* globals define */

/*
  The MIT License (MIT)

  Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.

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

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* AUTO-GENERATED. DO NOT MODIFY. */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.

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


  Written by Einar Lielmanis, <einar@beautifier.io>
      https://beautifier.io/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@beautifier.io>


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
(function () {
  /* GENERATED_BUILD_OUTPUT */
  var legacy_beautify_js =
  /******/
  function (modules) {
    // webpackBootstrap

    /******/
    // The module cache

    /******/
    var installedModules = {};
    /******/

    /******/
    // The require function

    /******/

    function __webpack_require__(moduleId) {
      /******/

      /******/
      // Check if module is in cache

      /******/
      if (installedModules[moduleId]) {
        /******/
        return installedModules[moduleId].exports;
        /******/
      }
      /******/
      // Create a new module (and put it into the cache)

      /******/


      var module = installedModules[moduleId] = {
        /******/
        i: moduleId,

        /******/
        l: false,

        /******/
        exports: {}
        /******/

      };
      /******/

      /******/
      // Execute the module function

      /******/

      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/

      /******/
      // Flag the module as loaded

      /******/

      module.l = true;
      /******/

      /******/
      // Return the exports of the module

      /******/

      return module.exports;
      /******/
    }
    /******/

    /******/

    /******/
    // expose the modules object (__webpack_modules__)

    /******/


    __webpack_require__.m = modules;
    /******/

    /******/
    // expose the module cache

    /******/

    __webpack_require__.c = installedModules;
    /******/

    /******/
    // define getter function for harmony exports

    /******/

    __webpack_require__.d = function (exports, name, getter) {
      /******/
      if (!__webpack_require__.o(exports, name)) {
        /******/
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/

    };
    /******/

    /******/
    // define __esModule on exports

    /******/


    __webpack_require__.r = function (exports) {
      /******/
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /******/
    };
    /******/

    /******/
    // create a fake namespace object

    /******/
    // mode & 1: value is a module id, require it

    /******/
    // mode & 2: merge all properties of value into the ns

    /******/
    // mode & 4: return value when already ns object

    /******/
    // mode & 8|1: behave like require

    /******/


    __webpack_require__.t = function (value, mode) {
      /******/
      if (mode & 1) value = __webpack_require__(value);
      /******/

      if (mode & 8) return value;
      /******/

      if (mode & 4 && _typeof(value) === 'object' && value && value.__esModule) return value;
      /******/

      var ns = Object.create(null);
      /******/

      __webpack_require__.r(ns);
      /******/


      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      /******/

      if (mode & 2 && typeof value != 'string') for (var key in value) {
        __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
      }
      /******/

      return ns;
      /******/
    };
    /******/

    /******/
    // getDefaultExport function for compatibility with non-harmony modules

    /******/


    __webpack_require__.n = function (module) {
      /******/
      var getter = module && module.__esModule ?
      /******/
      function getDefault() {
        return module['default'];
      } :
      /******/
      function getModuleExports() {
        return module;
      };
      /******/

      __webpack_require__.d(getter, 'a', getter);
      /******/


      return getter;
      /******/
    };
    /******/

    /******/
    // Object.prototype.hasOwnProperty.call

    /******/


    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/

    /******/
    // __webpack_public_path__

    /******/


    __webpack_require__.p = "";
    /******/

    /******/

    /******/
    // Load entry module and return exports

    /******/

    return __webpack_require__(__webpack_require__.s = 0);
    /******/
  }(
  /************************************************************************/

  /******/
  [
  /* 0 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Beautifier = __webpack_require__(1).Beautifier,
        Options = __webpack_require__(5).Options;

    function js_beautify(js_source_text, options) {
      var beautifier = new Beautifier(js_source_text, options);
      return beautifier.beautify();
    }

    module.exports = js_beautify;

    module.exports.defaultOptions = function () {
      return new Options();
    };
    /***/

  },
  /* 1 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Output = __webpack_require__(2).Output;

    var Token = __webpack_require__(3).Token;

    var acorn = __webpack_require__(4);

    var Options = __webpack_require__(5).Options;

    var Tokenizer = __webpack_require__(7).Tokenizer;

    var line_starters = __webpack_require__(7).line_starters;

    var positionable_operators = __webpack_require__(7).positionable_operators;

    var TOKEN = __webpack_require__(7).TOKEN;

    function remove_redundant_indentation(output, frame) {
      // This implementation is effective but has some issues:
      //     - can cause line wrap to happen too soon due to indent removal
      //           after wrap points are calculated
      // These issues are minor compared to ugly indentation.
      if (frame.multiline_frame || frame.mode === MODE.ForInitializer || frame.mode === MODE.Conditional) {
        return;
      } // remove one indent from each line inside this section


      output.remove_indent(frame.start_line_index);
    }

    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }

    function ltrim(s) {
      return s.replace(/^\s+/g, '');
    }

    function generateMapFromStrings(list) {
      var result = {};

      for (var x = 0; x < list.length; x++) {
        // make the mapped names underscored instead of dash
        result[list[x].replace(/-/g, '_')] = list[x];
      }

      return result;
    }

    function reserved_word(token, word) {
      return token && token.type === TOKEN.RESERVED && token.text === word;
    }

    function reserved_array(token, words) {
      return token && token.type === TOKEN.RESERVED && in_array(token.text, words);
    } // Unsure of what they mean, but they work. Worth cleaning up in future.


    var special_words = ['case', 'return', 'do', 'if', 'throw', 'else', 'await', 'break', 'continue', 'async'];
    var validPositionValues = ['before-newline', 'after-newline', 'preserve-newline']; // Generate map from array

    var OPERATOR_POSITION = generateMapFromStrings(validPositionValues);
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

    }; // we could use just string.split, but
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

    function is_array(mode) {
      return mode === MODE.ArrayLiteral;
    }

    function is_expression(mode) {
      return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
    }

    function all_lines_start_with(lines, c) {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

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

    function Beautifier(source_text, options) {
      options = options || {};
      this._source_text = source_text || '';
      this._output = null;
      this._tokens = null;
      this._last_last_text = null;
      this._flags = null;
      this._previous_flags = null;
      this._flag_store = null;
      this._options = new Options(options);
    }

    Beautifier.prototype.create_flags = function (flags_base, mode) {
      var next_indent_level = 0;

      if (flags_base) {
        next_indent_level = flags_base.indentation_level;

        if (!this._output.just_added_newline() && flags_base.line_indent_level > next_indent_level) {
          next_indent_level = flags_base.line_indent_level;
        }
      }

      var next_flags = {
        mode: mode,
        parent: flags_base,
        last_token: flags_base ? flags_base.last_token : new Token(TOKEN.START_BLOCK, ''),
        // last token text
        last_word: flags_base ? flags_base.last_word : '',
        // last TOKEN.WORD passed
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
        start_line_index: this._output.get_line_number(),
        ternary_depth: 0
      };
      return next_flags;
    };

    Beautifier.prototype._reset = function (source_text) {
      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._last_last_text = ''; // pre-last token text

      this._output = new Output(this._options, baseIndentString); // If testing the ignore directive, start with output disable set to true

      this._output.raw = this._options.test_output_raw; // Stack of parsing/formatting states, including MODE.
      // We tokenize, parse, and output in an almost purely a forward-only stream of token input
      // and formatted output.  This makes the beautifier less accurate than full parsers
      // but also far more tolerant of syntax errors.
      //
      // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
      // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
      // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
      // most full parsers would die, but the beautifier gracefully falls back to
      // MODE.BlockStatement and continues on.

      this._flag_store = [];
      this.set_mode(MODE.BlockStatement);
      var tokenizer = new Tokenizer(source_text, this._options);
      this._tokens = tokenizer.tokenize();
      return source_text;
    };

    Beautifier.prototype.beautify = function () {
      // if disabled, return the input unchanged.
      if (this._options.disabled) {
        return this._source_text;
      }

      var sweet_code;

      var source_text = this._reset(this._source_text);

      var eol = this._options.eol;

      if (this._options.eol === 'auto') {
        eol = '\n';

        if (source_text && acorn.lineBreak.test(source_text || '')) {
          eol = source_text.match(acorn.lineBreak)[0];
        }
      }

      var current_token = this._tokens.next();

      while (current_token) {
        this.handle_token(current_token);
        this._last_last_text = this._flags.last_token.text;
        this._flags.last_token = current_token;
        current_token = this._tokens.next();
      }

      sweet_code = this._output.get_code(eol);
      return sweet_code;
    };

    Beautifier.prototype.handle_token = function (current_token, preserve_statement_flags) {
      if (current_token.type === TOKEN.START_EXPR) {
        this.handle_start_expr(current_token);
      } else if (current_token.type === TOKEN.END_EXPR) {
        this.handle_end_expr(current_token);
      } else if (current_token.type === TOKEN.START_BLOCK) {
        this.handle_start_block(current_token);
      } else if (current_token.type === TOKEN.END_BLOCK) {
        this.handle_end_block(current_token);
      } else if (current_token.type === TOKEN.WORD) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.RESERVED) {
        this.handle_word(current_token);
      } else if (current_token.type === TOKEN.SEMICOLON) {
        this.handle_semicolon(current_token);
      } else if (current_token.type === TOKEN.STRING) {
        this.handle_string(current_token);
      } else if (current_token.type === TOKEN.EQUALS) {
        this.handle_equals(current_token);
      } else if (current_token.type === TOKEN.OPERATOR) {
        this.handle_operator(current_token);
      } else if (current_token.type === TOKEN.COMMA) {
        this.handle_comma(current_token);
      } else if (current_token.type === TOKEN.BLOCK_COMMENT) {
        this.handle_block_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.COMMENT) {
        this.handle_comment(current_token, preserve_statement_flags);
      } else if (current_token.type === TOKEN.DOT) {
        this.handle_dot(current_token);
      } else if (current_token.type === TOKEN.EOF) {
        this.handle_eof(current_token);
      } else if (current_token.type === TOKEN.UNKNOWN) {
        this.handle_unknown(current_token, preserve_statement_flags);
      } else {
        this.handle_unknown(current_token, preserve_statement_flags);
      }
    };

    Beautifier.prototype.handle_whitespace_and_comments = function (current_token, preserve_statement_flags) {
      var newlines = current_token.newlines;
      var keep_whitespace = this._options.keep_array_indentation && is_array(this._flags.mode);

      if (current_token.comments_before) {
        var comment_token = current_token.comments_before.next();

        while (comment_token) {
          // The cleanest handling of inline comments is to treat them as though they aren't there.
          // Just continue formatting and the behavior should be logical.
          // Also ignore unknown tokens.  Again, this should result in better behavior.
          this.handle_whitespace_and_comments(comment_token, preserve_statement_flags);
          this.handle_token(comment_token, preserve_statement_flags);
          comment_token = current_token.comments_before.next();
        }
      }

      if (keep_whitespace) {
        for (var i = 0; i < newlines; i += 1) {
          this.print_newline(i > 0, preserve_statement_flags);
        }
      } else {
        if (this._options.max_preserve_newlines && newlines > this._options.max_preserve_newlines) {
          newlines = this._options.max_preserve_newlines;
        }

        if (this._options.preserve_newlines) {
          if (newlines > 1) {
            this.print_newline(false, preserve_statement_flags);

            for (var j = 1; j < newlines; j += 1) {
              this.print_newline(true, preserve_statement_flags);
            }
          }
        }
      }
    };

    var newline_restricted_tokens = ['async', 'break', 'continue', 'return', 'throw', 'yield'];

    Beautifier.prototype.allow_wrap_or_preserved_newline = function (current_token, force_linewrap) {
      force_linewrap = force_linewrap === undefined ? false : force_linewrap; // Never wrap the first token on a line

      if (this._output.just_added_newline()) {
        return;
      }

      var shouldPreserveOrForce = this._options.preserve_newlines && current_token.newlines || force_linewrap;
      var operatorLogicApplies = in_array(this._flags.last_token.text, positionable_operators) || in_array(current_token.text, positionable_operators);

      if (operatorLogicApplies) {
        var shouldPrintOperatorNewline = in_array(this._flags.last_token.text, positionable_operators) && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE) || in_array(current_token.text, positionable_operators);
        shouldPreserveOrForce = shouldPreserveOrForce && shouldPrintOperatorNewline;
      }

      if (shouldPreserveOrForce) {
        this.print_newline(false, true);
      } else if (this._options.wrap_line_length) {
        if (reserved_array(this._flags.last_token, newline_restricted_tokens)) {
          // These tokens should never have a newline inserted
          // between them and the following expression.
          return;
        }

        var proposed_line_length = this._output.current_line.get_character_count() + current_token.text.length + (this._output.space_before_token ? 1 : 0);

        if (proposed_line_length >= this._options.wrap_line_length) {
          this.print_newline(false, true);
        }
      }
    };

    Beautifier.prototype.print_newline = function (force_newline, preserve_statement_flags) {
      if (!preserve_statement_flags) {
        if (this._flags.last_token.text !== ';' && this._flags.last_token.text !== ',' && this._flags.last_token.text !== '=' && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === '--' || this._flags.last_token.text === '++')) {
          var next_token = this._tokens.peek();

          while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, 'else')) && !this._flags.do_block) {
            this.restore_mode();
          }
        }
      }

      if (this._output.add_new_line(force_newline)) {
        this._flags.multiline_frame = true;
      }
    };

    Beautifier.prototype.print_token_line_indentation = function (current_token) {
      if (this._output.just_added_newline()) {
        if (this._options.keep_array_indentation && is_array(this._flags.mode) && current_token.newlines) {
          this._output.current_line.push(current_token.whitespace_before);

          this._output.space_before_token = false;
        } else if (this._output.set_indent(this._flags.indentation_level)) {
          this._flags.line_indent_level = this._flags.indentation_level;
        }
      }
    };

    Beautifier.prototype.print_token = function (current_token, printable_token) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);

        return;
      }

      if (this._options.comma_first && current_token.previous && current_token.previous.type === TOKEN.COMMA && this._output.just_added_newline()) {
        if (this._output.previous_line.last() === ',') {
          var popped = this._output.previous_line.pop(); // if the comma was already at the start of the line,
          // pull back onto that line and reprint the indentation


          if (this._output.previous_line.is_empty()) {
            this._output.previous_line.push(popped);

            this._output.trim(true);

            this._output.current_line.pop();

            this._output.trim();
          } // add the comma in front of the next token


          this.print_token_line_indentation(current_token);

          this._output.add_token(',');

          this._output.space_before_token = true;
        }
      }

      printable_token = printable_token || current_token.text;
      this.print_token_line_indentation(current_token);

      this._output.add_token(printable_token);
    };

    Beautifier.prototype.indent = function () {
      this._flags.indentation_level += 1;
    };

    Beautifier.prototype.deindent = function () {
      if (this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level)) {
        this._flags.indentation_level -= 1;
      }
    };

    Beautifier.prototype.set_mode = function (mode) {
      if (this._flags) {
        this._flag_store.push(this._flags);

        this._previous_flags = this._flags;
      } else {
        this._previous_flags = this.create_flags(null, mode);
      }

      this._flags = this.create_flags(this._previous_flags, mode);
    };

    Beautifier.prototype.restore_mode = function () {
      if (this._flag_store.length > 0) {
        this._previous_flags = this._flags;
        this._flags = this._flag_store.pop();

        if (this._previous_flags.mode === MODE.Statement) {
          remove_redundant_indentation(this._output, this._previous_flags);
        }
      }
    };

    Beautifier.prototype.start_of_object_property = function () {
      return this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement && (this._flags.last_token.text === ':' && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ['get', 'set']));
    };

    Beautifier.prototype.start_of_statement = function (current_token) {
      var start = false;
      start = start || reserved_array(this._flags.last_token, ['var', 'let', 'const']) && current_token.type === TOKEN.WORD;
      start = start || reserved_word(this._flags.last_token, 'do');
      start = start || !(this._flags.parent.mode === MODE.ObjectLiteral && this._flags.mode === MODE.Statement) && reserved_array(this._flags.last_token, newline_restricted_tokens) && !current_token.newlines;
      start = start || reserved_word(this._flags.last_token, 'else') && !(reserved_word(current_token, 'if') && !current_token.comments_before);
      start = start || this._flags.last_token.type === TOKEN.END_EXPR && (this._previous_flags.mode === MODE.ForInitializer || this._previous_flags.mode === MODE.Conditional);
      start = start || this._flags.last_token.type === TOKEN.WORD && this._flags.mode === MODE.BlockStatement && !this._flags.in_case && !(current_token.text === '--' || current_token.text === '++') && this._last_last_text !== 'function' && current_token.type !== TOKEN.WORD && current_token.type !== TOKEN.RESERVED;
      start = start || this._flags.mode === MODE.ObjectLiteral && (this._flags.last_token.text === ':' && this._flags.ternary_depth === 0 || reserved_array(this._flags.last_token, ['get', 'set']));

      if (start) {
        this.set_mode(MODE.Statement);
        this.indent();
        this.handle_whitespace_and_comments(current_token, true); // Issue #276:
        // If starting a new statement with [if, for, while, do], push to a new line.
        // if (a) if (b) if(c) d(); else e(); else f();

        if (!this.start_of_object_property()) {
          this.allow_wrap_or_preserved_newline(current_token, reserved_array(current_token, ['do', 'for', 'if', 'while']));
        }

        return true;
      }

      return false;
    };

    Beautifier.prototype.handle_start_expr = function (current_token) {
      // The conditional starts the statement if appropriate.
      if (!this.start_of_statement(current_token)) {
        this.handle_whitespace_and_comments(current_token);
      }

      var next_mode = MODE.Expression;

      if (current_token.text === '[') {
        if (this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === ')') {
          // this is array index specifier, break immediately
          // a[x], fn()[x]
          if (reserved_array(this._flags.last_token, line_starters)) {
            this._output.space_before_token = true;
          }

          this.set_mode(next_mode);
          this.print_token(current_token);
          this.indent();

          if (this._options.space_in_paren) {
            this._output.space_before_token = true;
          }

          return;
        }

        next_mode = MODE.ArrayLiteral;

        if (is_array(this._flags.mode)) {
          if (this._flags.last_token.text === '[' || this._flags.last_token.text === ',' && (this._last_last_text === ']' || this._last_last_text === '}')) {
            // ], [ goes to new line
            // }, [ goes to new line
            if (!this._options.keep_array_indentation) {
              this.print_newline();
            }
          }
        }

        if (!in_array(this._flags.last_token.type, [TOKEN.START_EXPR, TOKEN.END_EXPR, TOKEN.WORD, TOKEN.OPERATOR])) {
          this._output.space_before_token = true;
        }
      } else {
        if (this._flags.last_token.type === TOKEN.RESERVED) {
          if (this._flags.last_token.text === 'for') {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.ForInitializer;
          } else if (in_array(this._flags.last_token.text, ['if', 'while'])) {
            this._output.space_before_token = this._options.space_before_conditional;
            next_mode = MODE.Conditional;
          } else if (in_array(this._flags.last_word, ['await', 'async'])) {
            // Should be a space between await and an IIFE, or async and an arrow function
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === 'import' && current_token.whitespace_before === '') {
            this._output.space_before_token = false;
          } else if (in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === 'catch') {
            this._output.space_before_token = true;
          }
        } else if (this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          // Support of this kind of newline preservation.
          // a = (b &&
          //     (c || d));
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else if (this._flags.last_token.type === TOKEN.WORD) {
          this._output.space_before_token = false; // function name() vs function name ()
          // function* name() vs function* name ()
          // async name() vs async name ()
          // In ES6, you can also define the method properties of an object
          // var obj = {a: function() {}}
          // It can be abbreviated
          // var obj = {a() {}}
          // var obj = { a() {}} vs var obj = { a () {}}
          // var obj = { * a() {}} vs var obj = { * a () {}}

          var peek_back_two = this._tokens.peek(-3);

          if (this._options.space_after_named_function && peek_back_two) {
            // peek starts at next character so -1 is current token
            var peek_back_three = this._tokens.peek(-4);

            if (reserved_array(peek_back_two, ['async', 'function']) || peek_back_two.text === '*' && reserved_array(peek_back_three, ['async', 'function'])) {
              this._output.space_before_token = true;
            } else if (this._flags.mode === MODE.ObjectLiteral) {
              if (peek_back_two.text === '{' || peek_back_two.text === ',' || peek_back_two.text === '*' && (peek_back_three.text === '{' || peek_back_three.text === ',')) {
                this._output.space_before_token = true;
              }
            }
          }
        } else {
          // Support preserving wrapped arrow function expressions
          // a.b('c',
          //     () => d.e
          // )
          this.allow_wrap_or_preserved_newline(current_token);
        } // function() vs function ()
        // yield*() vs yield* ()
        // function*() vs function* ()


        if (this._flags.last_token.type === TOKEN.RESERVED && (this._flags.last_word === 'function' || this._flags.last_word === 'typeof') || this._flags.last_token.text === '*' && (in_array(this._last_last_text, ['function', 'yield']) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ['{', ',']))) {
          this._output.space_before_token = this._options.space_after_anon_function;
        }
      }

      if (this._flags.last_token.text === ';' || this._flags.last_token.type === TOKEN.START_BLOCK) {
        this.print_newline();
      } else if (this._flags.last_token.type === TOKEN.END_EXPR || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.END_BLOCK || this._flags.last_token.text === '.' || this._flags.last_token.type === TOKEN.COMMA) {
        // do nothing on (( and )( and ][ and ]( and .(
        // TODO: Consider whether forcing this is required.  Review failing tests when removed.
        this.allow_wrap_or_preserved_newline(current_token, current_token.newlines);
      }

      this.set_mode(next_mode);
      this.print_token(current_token);

      if (this._options.space_in_paren) {
        this._output.space_before_token = true;
      } // In all cases, if we newline while inside an expression it should be indented.


      this.indent();
    };

    Beautifier.prototype.handle_end_expr = function (current_token) {
      // statements inside expressions are not valid syntax, but...
      // statements must all be closed when their container closes
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }

      this.handle_whitespace_and_comments(current_token);

      if (this._flags.multiline_frame) {
        this.allow_wrap_or_preserved_newline(current_token, current_token.text === ']' && is_array(this._flags.mode) && !this._options.keep_array_indentation);
      }

      if (this._options.space_in_paren) {
        if (this._flags.last_token.type === TOKEN.START_EXPR && !this._options.space_in_empty_paren) {
          // () [] no inner space in empty parens like these, ever, ref #320
          this._output.trim();

          this._output.space_before_token = false;
        } else {
          this._output.space_before_token = true;
        }
      }

      if (current_token.text === ']' && this._options.keep_array_indentation) {
        this.print_token(current_token);
        this.restore_mode();
      } else {
        this.restore_mode();
        this.print_token(current_token);
      }

      remove_redundant_indentation(this._output, this._previous_flags); // do {} while () // no statement required after

      if (this._flags.do_while && this._previous_flags.mode === MODE.Conditional) {
        this._previous_flags.mode = MODE.Expression;
        this._flags.do_block = false;
        this._flags.do_while = false;
      }
    };

    Beautifier.prototype.handle_start_block = function (current_token) {
      this.handle_whitespace_and_comments(current_token); // Check if this is should be treated as a ObjectLiteral

      var next_token = this._tokens.peek();

      var second_token = this._tokens.peek(1);

      if (this._flags.last_word === 'switch' && this._flags.last_token.type === TOKEN.END_EXPR) {
        this.set_mode(MODE.BlockStatement);
        this._flags.in_case_statement = true;
      } else if (second_token && (in_array(second_token.text, [':', ',']) && in_array(next_token.type, [TOKEN.STRING, TOKEN.WORD, TOKEN.RESERVED]) || in_array(next_token.text, ['get', 'set', '...']) && in_array(second_token.type, [TOKEN.WORD, TOKEN.RESERVED]))) {
        // We don't support TypeScript,but we didn't break it for a very long time.
        // We'll try to keep not breaking it.
        if (!in_array(this._last_last_text, ['class', 'interface'])) {
          this.set_mode(MODE.ObjectLiteral);
        } else {
          this.set_mode(MODE.BlockStatement);
        }
      } else if (this._flags.last_token.type === TOKEN.OPERATOR && this._flags.last_token.text === '=>') {
        // arrow function: (param1, paramN) => { statements }
        this.set_mode(MODE.BlockStatement);
      } else if (in_array(this._flags.last_token.type, [TOKEN.EQUALS, TOKEN.START_EXPR, TOKEN.COMMA, TOKEN.OPERATOR]) || reserved_array(this._flags.last_token, ['return', 'throw', 'import', 'default'])) {
        // Detecting shorthand function syntax is difficult by scanning forward,
        //     so check the surrounding context.
        // If the block is being returned, imported, export default, passed as arg,
        //     assigned with = or assigned in a nested object, treat as an ObjectLiteral.
        this.set_mode(MODE.ObjectLiteral);
      } else {
        this.set_mode(MODE.BlockStatement);
      }

      var empty_braces = !next_token.comments_before && next_token.text === '}';
      var empty_anonymous_function = empty_braces && this._flags.last_word === 'function' && this._flags.last_token.type === TOKEN.END_EXPR;

      if (this._options.brace_preserve_inline) // check for inline, set inline_frame if so
        {
          // search forward for a newline wanted inside this block
          var index = 0;
          var check_token = null;
          this._flags.inline_frame = true;

          do {
            index += 1;
            check_token = this._tokens.peek(index - 1);

            if (check_token.newlines) {
              this._flags.inline_frame = false;
              break;
            }
          } while (check_token.type !== TOKEN.EOF && !(check_token.type === TOKEN.END_BLOCK && check_token.opened === current_token));
        }

      if ((this._options.brace_style === "expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
        if (this._flags.last_token.type !== TOKEN.OPERATOR && (empty_anonymous_function || this._flags.last_token.type === TOKEN.EQUALS || reserved_array(this._flags.last_token, special_words) && this._flags.last_token.text !== 'else')) {
          this._output.space_before_token = true;
        } else {
          this.print_newline(false, true);
        }
      } else {
        // collapse || inline_frame
        if (is_array(this._previous_flags.mode) && (this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.COMMA)) {
          if (this._flags.last_token.type === TOKEN.COMMA || this._options.space_in_paren) {
            this._output.space_before_token = true;
          }

          if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR && this._flags.inline_frame) {
            this.allow_wrap_or_preserved_newline(current_token);
            this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame;
            this._flags.multiline_frame = false;
          }
        }

        if (this._flags.last_token.type !== TOKEN.OPERATOR && this._flags.last_token.type !== TOKEN.START_EXPR) {
          if (this._flags.last_token.type === TOKEN.START_BLOCK && !this._flags.inline_frame) {
            this.print_newline();
          } else {
            this._output.space_before_token = true;
          }
        }
      }

      this.print_token(current_token);
      this.indent(); // Except for specific cases, open braces are followed by a new line.

      if (!empty_braces && !(this._options.brace_preserve_inline && this._flags.inline_frame)) {
        this.print_newline();
      }
    };

    Beautifier.prototype.handle_end_block = function (current_token) {
      // statements must all be closed when their container closes
      this.handle_whitespace_and_comments(current_token);

      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }

      var empty_braces = this._flags.last_token.type === TOKEN.START_BLOCK;

      if (this._flags.inline_frame && !empty_braces) {
        // try inline_frame (only set if this._options.braces-preserve-inline) first
        this._output.space_before_token = true;
      } else if (this._options.brace_style === "expand") {
        if (!empty_braces) {
          this.print_newline();
        }
      } else {
        // skip {}
        if (!empty_braces) {
          if (is_array(this._flags.mode) && this._options.keep_array_indentation) {
            // we REALLY need a newline here, but newliner would skip that
            this._options.keep_array_indentation = false;
            this.print_newline();
            this._options.keep_array_indentation = true;
          } else {
            this.print_newline();
          }
        }
      }

      this.restore_mode();
      this.print_token(current_token);
    };

    Beautifier.prototype.handle_word = function (current_token) {
      if (current_token.type === TOKEN.RESERVED) {
        if (in_array(current_token.text, ['set', 'get']) && this._flags.mode !== MODE.ObjectLiteral) {
          current_token.type = TOKEN.WORD;
        } else if (current_token.text === 'import' && this._tokens.peek().text === '(') {
          current_token.type = TOKEN.WORD;
        } else if (in_array(current_token.text, ['as', 'from']) && !this._flags.import_block) {
          current_token.type = TOKEN.WORD;
        } else if (this._flags.mode === MODE.ObjectLiteral) {
          var next_token = this._tokens.peek();

          if (next_token.text === ':') {
            current_token.type = TOKEN.WORD;
          }
        }
      }

      if (this.start_of_statement(current_token)) {
        // The conditional starts the statement if appropriate.
        if (reserved_array(this._flags.last_token, ['var', 'let', 'const']) && current_token.type === TOKEN.WORD) {
          this._flags.declaration_statement = true;
        }
      } else if (current_token.newlines && !is_expression(this._flags.mode) && (this._flags.last_token.type !== TOKEN.OPERATOR || this._flags.last_token.text === '--' || this._flags.last_token.text === '++') && this._flags.last_token.type !== TOKEN.EQUALS && (this._options.preserve_newlines || !reserved_array(this._flags.last_token, ['var', 'let', 'const', 'set', 'get']))) {
        this.handle_whitespace_and_comments(current_token);
        this.print_newline();
      } else {
        this.handle_whitespace_and_comments(current_token);
      }

      if (this._flags.do_block && !this._flags.do_while) {
        if (reserved_word(current_token, 'while')) {
          // do {} ## while ()
          this._output.space_before_token = true;
          this.print_token(current_token);
          this._output.space_before_token = true;
          this._flags.do_while = true;
          return;
        } else {
          // do {} should always have while as the next word.
          // if we don't see the expected while, recover
          this.print_newline();
          this._flags.do_block = false;
        }
      } // if may be followed by else, or not
      // Bare/inline ifs are tricky
      // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();


      if (this._flags.if_block) {
        if (!this._flags.else_block && reserved_word(current_token, 'else')) {
          this._flags.else_block = true;
        } else {
          while (this._flags.mode === MODE.Statement) {
            this.restore_mode();
          }

          this._flags.if_block = false;
          this._flags.else_block = false;
        }
      }

      if (this._flags.in_case_statement && reserved_array(current_token, ['case', 'default'])) {
        this.print_newline();

        if (this._flags.case_body || this._options.jslint_happy) {
          // switch cases following one another
          this.deindent();
          this._flags.case_body = false;
        }

        this.print_token(current_token);
        this._flags.in_case = true;
        return;
      }

      if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
        if (!this.start_of_object_property()) {
          this.allow_wrap_or_preserved_newline(current_token);
        }
      }

      if (reserved_word(current_token, 'function')) {
        if (in_array(this._flags.last_token.text, ['}', ';']) || this._output.just_added_newline() && !(in_array(this._flags.last_token.text, ['(', '[', '{', ':', '=', ',']) || this._flags.last_token.type === TOKEN.OPERATOR)) {
          // make sure there is a nice clean space of at least one blank line
          // before a new function definition
          if (!this._output.just_added_blankline() && !current_token.comments_before) {
            this.print_newline();
            this.print_newline(true);
          }
        }

        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD) {
          if (reserved_array(this._flags.last_token, ['get', 'set', 'new', 'export']) || reserved_array(this._flags.last_token, newline_restricted_tokens)) {
            this._output.space_before_token = true;
          } else if (reserved_word(this._flags.last_token, 'default') && this._last_last_text === 'export') {
            this._output.space_before_token = true;
          } else if (this._flags.last_token.text === 'declare') {
            // accomodates Typescript declare function formatting
            this._output.space_before_token = true;
          } else {
            this.print_newline();
          }
        } else if (this._flags.last_token.type === TOKEN.OPERATOR || this._flags.last_token.text === '=') {
          // foo = function
          this._output.space_before_token = true;
        } else if (!this._flags.multiline_frame && (is_expression(this._flags.mode) || is_array(this._flags.mode))) {// (function
        } else {
          this.print_newline();
        }

        this.print_token(current_token);
        this._flags.last_word = current_token.text;
        return;
      }

      var prefix = 'NONE';

      if (this._flags.last_token.type === TOKEN.END_BLOCK) {
        if (this._previous_flags.inline_frame) {
          prefix = 'SPACE';
        } else if (!reserved_array(current_token, ['else', 'catch', 'finally', 'from'])) {
          prefix = 'NEWLINE';
        } else {
          if (this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) {
            prefix = 'NEWLINE';
          } else {
            prefix = 'SPACE';
            this._output.space_before_token = true;
          }
        }
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && this._flags.mode === MODE.BlockStatement) {
        // TODO: Should this be for STATEMENT as well?
        prefix = 'NEWLINE';
      } else if (this._flags.last_token.type === TOKEN.SEMICOLON && is_expression(this._flags.mode)) {
        prefix = 'SPACE';
      } else if (this._flags.last_token.type === TOKEN.STRING) {
        prefix = 'NEWLINE';
      } else if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.last_token.text === '*' && (in_array(this._last_last_text, ['function', 'yield']) || this._flags.mode === MODE.ObjectLiteral && in_array(this._last_last_text, ['{', ',']))) {
        prefix = 'SPACE';
      } else if (this._flags.last_token.type === TOKEN.START_BLOCK) {
        if (this._flags.inline_frame) {
          prefix = 'SPACE';
        } else {
          prefix = 'NEWLINE';
        }
      } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
        this._output.space_before_token = true;
        prefix = 'NEWLINE';
      }

      if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ')') {
        if (this._flags.inline_frame || this._flags.last_token.text === 'else' || this._flags.last_token.text === 'export') {
          prefix = 'SPACE';
        } else {
          prefix = 'NEWLINE';
        }
      }

      if (reserved_array(current_token, ['else', 'catch', 'finally'])) {
        if ((!(this._flags.last_token.type === TOKEN.END_BLOCK && this._previous_flags.mode === MODE.BlockStatement) || this._options.brace_style === "expand" || this._options.brace_style === "end-expand" || this._options.brace_style === "none" && current_token.newlines) && !this._flags.inline_frame) {
          this.print_newline();
        } else {
          this._output.trim(true);

          var line = this._output.current_line; // If we trimmed and there's something other than a close block before us
          // put a newline back in.  Handles '} // comment' scenario.

          if (line.last() !== '}') {
            this.print_newline();
          }

          this._output.space_before_token = true;
        }
      } else if (prefix === 'NEWLINE') {
        if (reserved_array(this._flags.last_token, special_words)) {
          // no newline between 'return nnn'
          this._output.space_before_token = true;
        } else if (this._flags.last_token.text === 'declare' && reserved_array(current_token, ['var', 'let', 'const'])) {
          // accomodates Typescript declare formatting
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type !== TOKEN.END_EXPR) {
          if ((this._flags.last_token.type !== TOKEN.START_EXPR || !reserved_array(current_token, ['var', 'let', 'const'])) && this._flags.last_token.text !== ':') {
            // no need to force newline on 'var': for (var x = 0...)
            if (reserved_word(current_token, 'if') && reserved_word(current_token.previous, 'else')) {
              // no newline for } else if {
              this._output.space_before_token = true;
            } else {
              this.print_newline();
            }
          }
        } else if (reserved_array(current_token, line_starters) && this._flags.last_token.text !== ')') {
          this.print_newline();
        }
      } else if (this._flags.multiline_frame && is_array(this._flags.mode) && this._flags.last_token.text === ',' && this._last_last_text === '}') {
        this.print_newline(); // }, in lists get a newline treatment
      } else if (prefix === 'SPACE') {
        this._output.space_before_token = true;
      }

      if (current_token.previous && (current_token.previous.type === TOKEN.WORD || current_token.previous.type === TOKEN.RESERVED)) {
        this._output.space_before_token = true;
      }

      this.print_token(current_token);
      this._flags.last_word = current_token.text;

      if (current_token.type === TOKEN.RESERVED) {
        if (current_token.text === 'do') {
          this._flags.do_block = true;
        } else if (current_token.text === 'if') {
          this._flags.if_block = true;
        } else if (current_token.text === 'import') {
          this._flags.import_block = true;
        } else if (this._flags.import_block && reserved_word(current_token, 'from')) {
          this._flags.import_block = false;
        }
      }
    };

    Beautifier.prototype.handle_semicolon = function (current_token) {
      if (this.start_of_statement(current_token)) {
        // The conditional starts the statement if appropriate.
        // Semicolon can be the start (and end) of a statement
        this._output.space_before_token = false;
      } else {
        this.handle_whitespace_and_comments(current_token);
      }

      var next_token = this._tokens.peek();

      while (this._flags.mode === MODE.Statement && !(this._flags.if_block && reserved_word(next_token, 'else')) && !this._flags.do_block) {
        this.restore_mode();
      } // hacky but effective for the moment


      if (this._flags.import_block) {
        this._flags.import_block = false;
      }

      this.print_token(current_token);
    };

    Beautifier.prototype.handle_string = function (current_token) {
      if (this.start_of_statement(current_token)) {
        // The conditional starts the statement if appropriate.
        // One difference - strings want at least a space before
        this._output.space_before_token = true;
      } else {
        this.handle_whitespace_and_comments(current_token);

        if (this._flags.last_token.type === TOKEN.RESERVED || this._flags.last_token.type === TOKEN.WORD || this._flags.inline_frame) {
          this._output.space_before_token = true;
        } else if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR || this._flags.last_token.type === TOKEN.EQUALS || this._flags.last_token.type === TOKEN.OPERATOR) {
          if (!this.start_of_object_property()) {
            this.allow_wrap_or_preserved_newline(current_token);
          }
        } else {
          this.print_newline();
        }
      }

      this.print_token(current_token);
    };

    Beautifier.prototype.handle_equals = function (current_token) {
      if (this.start_of_statement(current_token)) {// The conditional starts the statement if appropriate.
      } else {
        this.handle_whitespace_and_comments(current_token);
      }

      if (this._flags.declaration_statement) {
        // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
        this._flags.declaration_assignment = true;
      }

      this._output.space_before_token = true;
      this.print_token(current_token);
      this._output.space_before_token = true;
    };

    Beautifier.prototype.handle_comma = function (current_token) {
      this.handle_whitespace_and_comments(current_token, true);
      this.print_token(current_token);
      this._output.space_before_token = true;

      if (this._flags.declaration_statement) {
        if (is_expression(this._flags.parent.mode)) {
          // do not break on comma, for(var a = 1, b = 2)
          this._flags.declaration_assignment = false;
        }

        if (this._flags.declaration_assignment) {
          this._flags.declaration_assignment = false;
          this.print_newline(false, true);
        } else if (this._options.comma_first) {
          // for comma-first, we want to allow a newline before the comma
          // to turn into a newline after the comma, which we will fixup later
          this.allow_wrap_or_preserved_newline(current_token);
        }
      } else if (this._flags.mode === MODE.ObjectLiteral || this._flags.mode === MODE.Statement && this._flags.parent.mode === MODE.ObjectLiteral) {
        if (this._flags.mode === MODE.Statement) {
          this.restore_mode();
        }

        if (!this._flags.inline_frame) {
          this.print_newline();
        }
      } else if (this._options.comma_first) {
        // EXPR or DO_BLOCK
        // for comma-first, we want to allow a newline before the comma
        // to turn into a newline after the comma, which we will fixup later
        this.allow_wrap_or_preserved_newline(current_token);
      }
    };

    Beautifier.prototype.handle_operator = function (current_token) {
      var isGeneratorAsterisk = current_token.text === '*' && (reserved_array(this._flags.last_token, ['function', 'yield']) || in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.COMMA, TOKEN.END_BLOCK, TOKEN.SEMICOLON]));
      var isUnary = in_array(current_token.text, ['-', '+']) && (in_array(this._flags.last_token.type, [TOKEN.START_BLOCK, TOKEN.START_EXPR, TOKEN.EQUALS, TOKEN.OPERATOR]) || in_array(this._flags.last_token.text, line_starters) || this._flags.last_token.text === ',');

      if (this.start_of_statement(current_token)) {// The conditional starts the statement if appropriate.
      } else {
        var preserve_statement_flags = !isGeneratorAsterisk;
        this.handle_whitespace_and_comments(current_token, preserve_statement_flags);
      }

      if (reserved_array(this._flags.last_token, special_words)) {
        // "return" had a special handling in TK_WORD. Now we need to return the favor
        this._output.space_before_token = true;
        this.print_token(current_token);
        return;
      } // hack for actionscript's import .*;


      if (current_token.text === '*' && this._flags.last_token.type === TOKEN.DOT) {
        this.print_token(current_token);
        return;
      }

      if (current_token.text === '::') {
        // no spaces around exotic namespacing syntax operator
        this.print_token(current_token);
        return;
      } // Allow line wrapping between operators when operator_position is
      //   set to before or preserve


      if (this._flags.last_token.type === TOKEN.OPERATOR && in_array(this._options.operator_position, OPERATOR_POSITION_BEFORE_OR_PRESERVE)) {
        this.allow_wrap_or_preserved_newline(current_token);
      }

      if (current_token.text === ':' && this._flags.in_case) {
        this._flags.case_body = true;
        this.indent();
        this.print_token(current_token);
        this.print_newline();
        this._flags.in_case = false;
        return;
      }

      var space_before = true;
      var space_after = true;
      var in_ternary = false;

      if (current_token.text === ':') {
        if (this._flags.ternary_depth === 0) {
          // Colon is invalid javascript outside of ternary and object, but do our best to guess what was meant.
          space_before = false;
        } else {
          this._flags.ternary_depth -= 1;
          in_ternary = true;
        }
      } else if (current_token.text === '?') {
        this._flags.ternary_depth += 1;
      } // let's handle the operator_position option prior to any conflicting logic


      if (!isUnary && !isGeneratorAsterisk && this._options.preserve_newlines && in_array(current_token.text, positionable_operators)) {
        var isColon = current_token.text === ':';
        var isTernaryColon = isColon && in_ternary;
        var isOtherColon = isColon && !in_ternary;

        switch (this._options.operator_position) {
          case OPERATOR_POSITION.before_newline:
            // if the current token is : and it's not a ternary statement then we set space_before to false
            this._output.space_before_token = !isOtherColon;
            this.print_token(current_token);

            if (!isColon || isTernaryColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            }

            this._output.space_before_token = true;
            return;

          case OPERATOR_POSITION.after_newline:
            // if the current token is anything but colon, or (via deduction) it's a colon and in a ternary statement,
            //   then print a newline.
            this._output.space_before_token = true;

            if (!isColon || isTernaryColon) {
              if (this._tokens.peek().newlines) {
                this.print_newline(false, true);
              } else {
                this.allow_wrap_or_preserved_newline(current_token);
              }
            } else {
              this._output.space_before_token = false;
            }

            this.print_token(current_token);
            this._output.space_before_token = true;
            return;

          case OPERATOR_POSITION.preserve_newline:
            if (!isOtherColon) {
              this.allow_wrap_or_preserved_newline(current_token);
            } // if we just added a newline, or the current token is : and it's not a ternary statement,
            //   then we set space_before to false


            space_before = !(this._output.just_added_newline() || isOtherColon);
            this._output.space_before_token = space_before;
            this.print_token(current_token);
            this._output.space_before_token = true;
            return;
        }
      }

      if (isGeneratorAsterisk) {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = false;

        var next_token = this._tokens.peek();

        space_after = next_token && in_array(next_token.type, [TOKEN.WORD, TOKEN.RESERVED]);
      } else if (current_token.text === '...') {
        this.allow_wrap_or_preserved_newline(current_token);
        space_before = this._flags.last_token.type === TOKEN.START_BLOCK;
        space_after = false;
      } else if (in_array(current_token.text, ['--', '++', '!', '~']) || isUnary) {
        // unary operators (and binary +/- pretending to be unary) special cases
        if (this._flags.last_token.type === TOKEN.COMMA || this._flags.last_token.type === TOKEN.START_EXPR) {
          this.allow_wrap_or_preserved_newline(current_token);
        }

        space_before = false;
        space_after = false; // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
        // if there is a newline between -- or ++ and anything else we should preserve it.

        if (current_token.newlines && (current_token.text === '--' || current_token.text === '++')) {
          this.print_newline(false, true);
        }

        if (this._flags.last_token.text === ';' && is_expression(this._flags.mode)) {
          // for (;; ++i)
          //        ^^^
          space_before = true;
        }

        if (this._flags.last_token.type === TOKEN.RESERVED) {
          space_before = true;
        } else if (this._flags.last_token.type === TOKEN.END_EXPR) {
          space_before = !(this._flags.last_token.text === ']' && (current_token.text === '--' || current_token.text === '++'));
        } else if (this._flags.last_token.type === TOKEN.OPERATOR) {
          // a++ + ++b;
          // a - -b
          space_before = in_array(current_token.text, ['--', '-', '++', '+']) && in_array(this._flags.last_token.text, ['--', '-', '++', '+']); // + and - are not unary when preceeded by -- or ++ operator
          // a-- + b
          // a * +b
          // a - -b

          if (in_array(current_token.text, ['+', '-']) && in_array(this._flags.last_token.text, ['--', '++'])) {
            space_after = true;
          }
        }

        if ((this._flags.mode === MODE.BlockStatement && !this._flags.inline_frame || this._flags.mode === MODE.Statement) && (this._flags.last_token.text === '{' || this._flags.last_token.text === ';')) {
          // { foo; --i }
          // foo(); --bar;
          this.print_newline();
        }
      }

      this._output.space_before_token = this._output.space_before_token || space_before;
      this.print_token(current_token);
      this._output.space_before_token = space_after;
    };

    Beautifier.prototype.handle_block_comment = function (current_token, preserve_statement_flags) {
      if (this._output.raw) {
        this._output.add_raw_token(current_token);

        if (current_token.directives && current_token.directives.preserve === 'end') {
          // If we're testing the raw output behavior, do not allow a directive to turn it off.
          this._output.raw = this._options.test_output_raw;
        }

        return;
      }

      if (current_token.directives) {
        this.print_newline(false, preserve_statement_flags);
        this.print_token(current_token);

        if (current_token.directives.preserve === 'start') {
          this._output.raw = true;
        }

        this.print_newline(false, true);
        return;
      } // inline block


      if (!acorn.newline.test(current_token.text) && !current_token.newlines) {
        this._output.space_before_token = true;
        this.print_token(current_token);
        this._output.space_before_token = true;
        return;
      }

      var lines = split_linebreaks(current_token.text);
      var j; // iterator for this case

      var javadoc = false;
      var starless = false;
      var lastIndent = current_token.whitespace_before;
      var lastIndentLength = lastIndent.length; // block comment starts with a new line

      this.print_newline(false, preserve_statement_flags);

      if (lines.length > 1) {
        javadoc = all_lines_start_with(lines.slice(1), '*');
        starless = each_line_matches_indent(lines.slice(1), lastIndent);
      } // first line always indented


      this.print_token(current_token, lines[0]);

      for (j = 1; j < lines.length; j++) {
        this.print_newline(false, true);

        if (javadoc) {
          // javadoc: reformat and re-indent
          this.print_token(current_token, ' ' + ltrim(lines[j]));
        } else if (starless && lines[j].length > lastIndentLength) {
          // starless: re-indent non-empty content, avoiding trim
          this.print_token(current_token, lines[j].substring(lastIndentLength));
        } else {
          // normal comments output raw
          this._output.add_token(lines[j]);
        }
      } // for comments of more than one line, make sure there's a new line after


      this.print_newline(false, preserve_statement_flags);
    };

    Beautifier.prototype.handle_comment = function (current_token, preserve_statement_flags) {
      if (current_token.newlines) {
        this.print_newline(false, preserve_statement_flags);
      } else {
        this._output.trim(true);
      }

      this._output.space_before_token = true;
      this.print_token(current_token);
      this.print_newline(false, preserve_statement_flags);
    };

    Beautifier.prototype.handle_dot = function (current_token) {
      if (this.start_of_statement(current_token)) {// The conditional starts the statement if appropriate.
      } else {
        this.handle_whitespace_and_comments(current_token, true);
      }

      if (reserved_array(this._flags.last_token, special_words)) {
        this._output.space_before_token = false;
      } else {
        // allow preserved newlines before dots in general
        // force newlines on dots after close paren when break_chained - for bar().baz()
        this.allow_wrap_or_preserved_newline(current_token, this._flags.last_token.text === ')' && this._options.break_chained_methods);
      } // Only unindent chained method dot if this dot starts a new line.
      // Otherwise the automatic extra indentation removal will handle the over indent


      if (this._options.unindent_chained_methods && this._output.just_added_newline()) {
        this.deindent();
      }

      this.print_token(current_token);
    };

    Beautifier.prototype.handle_unknown = function (current_token, preserve_statement_flags) {
      this.print_token(current_token);

      if (current_token.text[current_token.text.length - 1] === '\n') {
        this.print_newline(false, preserve_statement_flags);
      }
    };

    Beautifier.prototype.handle_eof = function (current_token) {
      // Unwind any open statements
      while (this._flags.mode === MODE.Statement) {
        this.restore_mode();
      }

      this.handle_whitespace_and_comments(current_token);
    };

    module.exports.Beautifier = Beautifier;
    /***/
  },
  /* 2 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0; // use indent_count as a marker for this.__lines that have preserved indentation

      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__items = [];
    }

    OutputLine.prototype.item = function (index) {
      if (index < 0) {
        return this.__items[this.__items.length + index];
      } else {
        return this.__items[index];
      }
    };

    OutputLine.prototype.has_match = function (pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }

      return false;
    };

    OutputLine.prototype.set_indent = function (indent, alignment) {
      this.__indent_count = indent || 0;
      this.__alignment_count = alignment || 0;
      this.__character_count = this.__parent.baseIndentLength + this.__alignment_count + this.__indent_count * this.__parent.indent_length;
    };

    OutputLine.prototype.get_character_count = function () {
      return this.__character_count;
    };

    OutputLine.prototype.is_empty = function () {
      return this.__items.length === 0;
    };

    OutputLine.prototype.last = function () {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };

    OutputLine.prototype.push = function (item) {
      this.__items.push(item);

      this.__character_count += item.length;
    };

    OutputLine.prototype.push_raw = function (item) {
      this.push(item);
      var last_newline_index = item.lastIndexOf('\n');

      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      }
    };

    OutputLine.prototype.pop = function () {
      var item = null;

      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }

      return item;
    };

    OutputLine.prototype.remove_indent = function () {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_length;
      }
    };

    OutputLine.prototype.trim = function () {
      while (this.last() === ' ') {
        this.__items.pop();

        this.__character_count -= 1;
      }
    };

    OutputLine.prototype.toString = function () {
      var result = '';

      if (!this.is_empty()) {
        if (this.__indent_count >= 0) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }

        if (this.__alignment_count >= 0) {
          result += this.__parent.get_alignment_string(this.__alignment_count);
        }

        result += this.__items.join('');
      }

      return result;
    };

    function IndentCache(base_string, level_string) {
      this.__cache = [base_string];
      this.__level_string = level_string;
    }

    IndentCache.prototype.__ensure_cache = function (level) {
      while (level >= this.__cache.length) {
        this.__cache.push(this.__cache[this.__cache.length - 1] + this.__level_string);
      }
    };

    IndentCache.prototype.get_level_string = function (level) {
      this.__ensure_cache(level);

      return this.__cache[level];
    };

    function Output(options, baseIndentString) {
      var indent_string = options.indent_char;

      if (options.indent_size > 1) {
        indent_string = new Array(options.indent_size + 1).join(options.indent_char);
      } // Set to null to continue support for auto detection of base indent level.


      baseIndentString = baseIndentString || '';

      if (options.indent_level > 0) {
        baseIndentString = new Array(options.indent_level + 1).join(indent_string);
      }

      this.__indent_cache = new IndentCache(baseIndentString, indent_string);
      this.__alignment_cache = new IndentCache('', ' ');
      this.baseIndentLength = baseIndentString.length;
      this.indent_length = indent_string.length;
      this.raw = false;
      this._end_with_newline = options.end_with_newline;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.space_before_token = false; // initialize

      this.__add_outputline();
    }

    Output.prototype.__add_outputline = function () {
      this.previous_line = this.current_line;
      this.current_line = new OutputLine(this);

      this.__lines.push(this.current_line);
    };

    Output.prototype.get_line_number = function () {
      return this.__lines.length;
    };

    Output.prototype.get_indent_string = function (level) {
      return this.__indent_cache.get_level_string(level);
    };

    Output.prototype.get_alignment_string = function (level) {
      return this.__alignment_cache.get_level_string(level);
    };

    Output.prototype.is_empty = function () {
      return !this.previous_line && this.current_line.is_empty();
    };

    Output.prototype.add_new_line = function (force_newline) {
      // never newline at the start of file
      // otherwise, newline only if we didn't just add one or we're forced
      if (this.is_empty() || !force_newline && this.just_added_newline()) {
        return false;
      } // if raw output is enabled, don't print additional newlines,
      // but still return True as though you had


      if (!this.raw) {
        this.__add_outputline();
      }

      return true;
    };

    Output.prototype.get_code = function (eol) {
      var sweet_code = this.__lines.join('\n').replace(/[\r\n\t ]+$/, '');

      if (this._end_with_newline) {
        sweet_code += '\n';
      }

      if (eol !== '\n') {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }

      return sweet_code;
    };

    Output.prototype.set_indent = function (indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0; // Never indent your first output indent at the start of the file

      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }

      this.current_line.set_indent();
      return false;
    };

    Output.prototype.add_raw_token = function (token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }

      this.current_line.push(token.whitespace_before);
      this.current_line.push_raw(token.text);
      this.space_before_token = false;
    };

    Output.prototype.add_token = function (printable_token) {
      this.add_space_before_token();
      this.current_line.push(printable_token);
    };

    Output.prototype.add_space_before_token = function () {
      if (this.space_before_token && !this.just_added_newline()) {
        this.current_line.push(' ');
      }

      this.space_before_token = false;
    };

    Output.prototype.remove_indent = function (index) {
      var output_length = this.__lines.length;

      while (index < output_length) {
        this.__lines[index].remove_indent();

        index++;
      }
    };

    Output.prototype.trim = function (eat_newlines) {
      eat_newlines = eat_newlines === undefined ? false : eat_newlines;
      this.current_line.trim(this.indent_string, this.baseIndentString);

      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();

        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }

      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };

    Output.prototype.just_added_newline = function () {
      return this.current_line.is_empty();
    };

    Output.prototype.just_added_blankline = function () {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
    };

    Output.prototype.ensure_empty_line_above = function (starts_with, ends_with) {
      var index = this.__lines.length - 2;

      while (index >= 0) {
        var potentialEmptyLine = this.__lines[index];

        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index + 1, 0, new OutputLine(this));

          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }

        index--;
      }
    };

    module.exports.Output = Output;
    /***/
  },
  /* 3 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Token(type, text, newlines, whitespace_before) {
      this.type = type;
      this.text = text; // comments_before are
      // comments that have a new line before them
      // and may or may not have a newline after
      // this is a set of comments before

      this.comments_before = null;
      /* inline comment*/
      // this.comments_after =  new TokenStream(); // no new line before and newline after

      this.newlines = newlines || 0;
      this.whitespace_before = whitespace_before || '';
      this.parent = null;
      this.next = null;
      this.previous = null;
      this.opened = null;
      this.closed = null;
      this.directives = null;
    }

    module.exports.Token = Token;
    /***/
  },
  /* 4 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /* jshint node: true, curly: false */
    // Parts of this section of code is taken from acorn.
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
    // acorn used char codes to squeeze the last bit of performance out
    // Beautifier is okay without that, so we're using regex
    // permit $ (36) and @ (64). @ is used in ES7 decorators.
    // 65 through 91 are uppercase letters.
    // permit _ (95).
    // 97 through 123 are lowercase letters.

    var baseASCIIidentifierStartChars = "\x24\x40\x41-\x5a\x5f\x61-\x7a"; // inside an identifier @ is not allowed but 0-9 are.

    var baseASCIIidentifierChars = "\x24\x30-\x39\x41-\x5a\x5f\x61-\x7a"; // Big ugly regular expressions that match characters in the
    // whitespace, identifier, and identifier-start categories. These
    // are only applied when a character is found to actually have a
    // code point above 128.

    var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
    var nonASCIIidentifierChars = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u0620-\u0649\u0672-\u06D3\u06E7-\u06E8\u06FB-\u06FC\u0730-\u074A\u0800-\u0814\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0840-\u0857\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09D7\u09DF-\u09E0\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5F-\u0B60\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2-\u0CE3\u0CE6-\u0CEF\u0D02\u0D03\u0D46-\u0D48\u0D57\u0D62-\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E34-\u0E3A\u0E40-\u0E45\u0E50-\u0E59\u0EB4-\u0EB9\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F41-\u0F47\u0F71-\u0F84\u0F86-\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1029\u1040-\u1049\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u170E-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17B2\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1920-\u192B\u1930-\u193B\u1951-\u196D\u19B0-\u19C0\u19C8-\u19C9\u19D0-\u19D9\u1A00-\u1A15\u1A20-\u1A53\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1B46-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C00-\u1C22\u1C40-\u1C49\u1C5B-\u1C7D\u1CD0-\u1CD2\u1D00-\u1DBE\u1E01-\u1F15\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2D81-\u2D96\u2DE0-\u2DFF\u3021-\u3028\u3099\u309A\uA640-\uA66D\uA674-\uA67D\uA69F\uA6F0-\uA6F1\uA7F8-\uA800\uA806\uA80B\uA823-\uA827\uA880-\uA881\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8F3-\uA8F7\uA900-\uA909\uA926-\uA92D\uA930-\uA945\uA980-\uA983\uA9B3-\uA9C0\uAA00-\uAA27\uAA40-\uAA41\uAA4C-\uAA4D\uAA50-\uAA59\uAA7B\uAAE0-\uAAE9\uAAF2-\uAAF3\uABC0-\uABE1\uABEC\uABED\uABF0-\uABF9\uFB20-\uFB28\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F"; //var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    //var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

    var identifierStart = "[" + baseASCIIidentifierStartChars + nonASCIIidentifierStartChars + "]";
    var identifierChars = "[" + baseASCIIidentifierChars + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]*";
    exports.identifier = new RegExp(identifierStart + identifierChars, 'g');
    var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/; // jshint ignore:line
    // Whether a single character denotes a newline.

    exports.newline = /[\n\r\u2028\u2029]/; // Matches a whole line break (where CRLF is considered a single
    // line break). Used to count lines.
    // in javascript, these two differ
    // in python they are the same, different methods are called on them

    exports.lineBreak = new RegExp('\r\n|' + exports.newline.source);
    exports.allLineBreaks = new RegExp(exports.lineBreak.source, 'g');
    /***/
  },
  /* 5 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var BaseOptions = __webpack_require__(6).Options;

    var validPositionValues = ['before-newline', 'after-newline', 'preserve-newline'];

    function Options(options) {
      BaseOptions.call(this, options, 'js'); // compatibility, re

      var raw_brace_style = this.raw_options.brace_style || null;

      if (raw_brace_style === "expand-strict") {
        //graceful handling of deprecated option
        this.raw_options.brace_style = "expand";
      } else if (raw_brace_style === "collapse-preserve-inline") {
        //graceful handling of deprecated option
        this.raw_options.brace_style = "collapse,preserve-inline";
      } else if (this.raw_options.braces_on_own_line !== undefined) {
        //graceful handling of deprecated option
        this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse"; // } else if (!raw_brace_style) { //Nothing exists to set it
        //   raw_brace_style = "collapse";
      } //preserve-inline in delimited string will trigger brace_preserve_inline, everything
      //else is considered a brace_style and the last one only will have an effect


      var brace_style_split = this._get_selection_list('brace_style', ['collapse', 'expand', 'end-expand', 'none', 'preserve-inline']);

      this.brace_preserve_inline = false; //Defaults in case one or other was not specified in meta-option

      this.brace_style = "collapse";

      for (var bs = 0; bs < brace_style_split.length; bs++) {
        if (brace_style_split[bs] === "preserve-inline") {
          this.brace_preserve_inline = true;
        } else {
          this.brace_style = brace_style_split[bs];
        }
      }

      this.unindent_chained_methods = this._get_boolean('unindent_chained_methods');
      this.break_chained_methods = this._get_boolean('break_chained_methods');
      this.space_in_paren = this._get_boolean('space_in_paren');
      this.space_in_empty_paren = this._get_boolean('space_in_empty_paren');
      this.jslint_happy = this._get_boolean('jslint_happy');
      this.space_after_anon_function = this._get_boolean('space_after_anon_function');
      this.space_after_named_function = this._get_boolean('space_after_named_function');
      this.keep_array_indentation = this._get_boolean('keep_array_indentation');
      this.space_before_conditional = this._get_boolean('space_before_conditional', true);
      this.unescape_strings = this._get_boolean('unescape_strings');
      this.e4x = this._get_boolean('e4x');
      this.comma_first = this._get_boolean('comma_first');
      this.operator_position = this._get_selection('operator_position', validPositionValues); // For testing of beautify preserve:start directive

      this.test_output_raw = this._get_boolean('test_output_raw'); // force this._options.space_after_anon_function to true if this._options.jslint_happy

      if (this.jslint_happy) {
        this.space_after_anon_function = true;
      }
    }

    Options.prototype = new BaseOptions();
    module.exports.Options = Options;
    /***/
  },
  /* 6 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Options(options, merge_child_field) {
      this.raw_options = _mergeOpts(options, merge_child_field); // Support passing the source text back with no change

      this.disabled = this._get_boolean('disabled');
      this.eol = this._get_characters('eol', 'auto');
      this.end_with_newline = this._get_boolean('end_with_newline');
      this.indent_size = this._get_number('indent_size', 4);
      this.indent_char = this._get_characters('indent_char', ' ');
      this.indent_level = this._get_number('indent_level');
      this.preserve_newlines = this._get_boolean('preserve_newlines', true);
      this.max_preserve_newlines = this._get_number('max_preserve_newlines', 32786);

      if (!this.preserve_newlines) {
        this.max_preserve_newlines = 0;
      }

      this.indent_with_tabs = this._get_boolean('indent_with_tabs');

      if (this.indent_with_tabs) {
        this.indent_char = '\t';
        this.indent_size = 1;
      } // Backwards compat with 1.3.x


      this.wrap_line_length = this._get_number('wrap_line_length', this._get_number('max_char'));
    }

    Options.prototype._get_array = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || [];

      if (_typeof(option_value) === 'object') {
        if (option_value !== null && typeof option_value.concat === 'function') {
          result = option_value.concat();
        }
      } else if (typeof option_value === 'string') {
        result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
      }

      return result;
    };

    Options.prototype._get_boolean = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = option_value === undefined ? !!default_value : !!option_value;
      return result;
    };

    Options.prototype._get_characters = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || '';

      if (typeof option_value === 'string') {
        result = option_value.replace(/\\r/, '\r').replace(/\\n/, '\n').replace(/\\t/, '\t');
      }

      return result;
    };

    Options.prototype._get_number = function (name, default_value) {
      var option_value = this.raw_options[name];
      default_value = parseInt(default_value, 10);

      if (isNaN(default_value)) {
        default_value = 0;
      }

      var result = parseInt(option_value, 10);

      if (isNaN(result)) {
        result = default_value;
      }

      return result;
    };

    Options.prototype._get_selection = function (name, selection_list, default_value) {
      var result = this._get_selection_list(name, selection_list, default_value);

      if (result.length !== 1) {
        throw new Error("Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result[0];
    };

    Options.prototype._get_selection_list = function (name, selection_list, default_value) {
      if (!selection_list || selection_list.length === 0) {
        throw new Error("Selection list cannot be empty.");
      }

      default_value = default_value || [selection_list[0]];

      if (!this._is_valid_selection(default_value, selection_list)) {
        throw new Error("Invalid Default Value!");
      }

      var result = this._get_array(name, default_value);

      if (!this._is_valid_selection(result, selection_list)) {
        throw new Error("Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result;
    };

    Options.prototype._is_valid_selection = function (result, selection_list) {
      return result.length && selection_list.length && !result.some(function (item) {
        return selection_list.indexOf(item) === -1;
      });
    }; // merges child options up with the parent options object
    // Example: obj = {a: 1, b: {a: 2}}
    //          mergeOpts(obj, 'b')
    //
    //          Returns: {a: 2}


    function _mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      allOptions = _normalizeOpts(allOptions);
      var name;

      for (name in allOptions) {
        if (name !== childFieldName) {
          finalOpts[name] = allOptions[name];
        }
      } //merge in the per type settings for the childFieldName


      if (childFieldName && allOptions[childFieldName]) {
        for (name in allOptions[childFieldName]) {
          finalOpts[name] = allOptions[childFieldName][name];
        }
      }

      return finalOpts;
    }

    function _normalizeOpts(options) {
      var convertedOpts = {};
      var key;

      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }

      return convertedOpts;
    }

    module.exports.Options = Options;
    module.exports.normalizeOpts = _normalizeOpts;
    module.exports.mergeOpts = _mergeOpts;
    /***/
  },
  /* 7 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var InputScanner = __webpack_require__(8).InputScanner;

    var BaseTokenizer = __webpack_require__(9).Tokenizer;

    var BASETOKEN = __webpack_require__(9).TOKEN;

    var Directives = __webpack_require__(11).Directives;

    var acorn = __webpack_require__(4);

    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }

    var TOKEN = {
      START_EXPR: 'TK_START_EXPR',
      END_EXPR: 'TK_END_EXPR',
      START_BLOCK: 'TK_START_BLOCK',
      END_BLOCK: 'TK_END_BLOCK',
      WORD: 'TK_WORD',
      RESERVED: 'TK_RESERVED',
      SEMICOLON: 'TK_SEMICOLON',
      STRING: 'TK_STRING',
      EQUALS: 'TK_EQUALS',
      OPERATOR: 'TK_OPERATOR',
      COMMA: 'TK_COMMA',
      BLOCK_COMMENT: 'TK_BLOCK_COMMENT',
      COMMENT: 'TK_COMMENT',
      DOT: 'TK_DOT',
      UNKNOWN: 'TK_UNKNOWN',
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/\/\*/, /\*\//);
    var number_pattern = /0[xX][0123456789abcdefABCDEF]*|0[oO][01234567]*|0[bB][01]*|\d+n|(?:\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/g;
    var digit = /[0-9]/; // Dot "." must be distinguished from "..." and decimal

    var dot_pattern = /[^\d\.]/;
    var positionable_operators = (">>> === !== " + "<< && >= ** != == <= >> || " + "< / - + > : & % ? ^ | *").split(' '); // IMPORTANT: this must be sorted longest to shortest or tokenizing many not work.
    // Also, you must update possitionable operators separately from punct

    var punct = ">>>= " + "... >>= <<= === >>> !== **= " + "=> ^= :: /= << <= == && -= >= >> != -- += ** || ++ %= &= *= |= " + "= ! ? > < : / ^ - + * & % ~ |";
    punct = punct.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    punct = punct.replace(/ /g, '|');
    var punct_pattern = new RegExp(punct, 'g');
    var shebang_pattern = /#![^\n\r\u2028\u2029]*(?:\r\n|[\n\r\u2028\u2029])?/g;
    var include_pattern = /#include[^\n\r\u2028\u2029]*(?:\r\n|[\n\r\u2028\u2029])?/g; // words which should always start on new line.

    var line_starters = 'continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export'.split(',');
    var reserved_words = line_starters.concat(['do', 'in', 'of', 'else', 'get', 'set', 'new', 'catch', 'finally', 'typeof', 'yield', 'async', 'await', 'from', 'as']);
    var reserved_word_pattern = new RegExp('^(?:' + reserved_words.join('|') + ')$'); //  /* ... */ comment ends with nearest */ or end of file

    var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g; // comment ends just before nearest linefeed or end of file

    var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
    var template_pattern = /(?:(?:<\?php|<\?=)[\s\S]*?\?>)|(?:<%[\s\S]*?%>)/g;
    var in_html_comment;

    var Tokenizer = function Tokenizer(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._whitespace_pattern = /[\n\r\u2028\u2029\t\u000B\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff ]+/g;
      this._newline_pattern = /([^\n\r\u2028\u2029]*)(\r\n|[\n\r\u2028\u2029])?/g;
    };

    Tokenizer.prototype = new BaseTokenizer();

    Tokenizer.prototype._is_comment = function (current_token) {
      return current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.BLOCK_COMMENT || current_token.type === TOKEN.UNKNOWN;
    };

    Tokenizer.prototype._is_opening = function (current_token) {
      return current_token.type === TOKEN.START_BLOCK || current_token.type === TOKEN.START_EXPR;
    };

    Tokenizer.prototype._is_closing = function (current_token, open_token) {
      return (current_token.type === TOKEN.END_BLOCK || current_token.type === TOKEN.END_EXPR) && open_token && (current_token.text === ']' && open_token.text === '[' || current_token.text === ')' && open_token.text === '(' || current_token.text === '}' && open_token.text === '{');
    };

    Tokenizer.prototype._reset = function () {
      in_html_comment = false;
    };

    Tokenizer.prototype._get_next_token = function (previous_token, open_token) {
      // jshint unused:false
      this._readWhitespace();

      var token = null;

      var c = this._input.peek();

      token = token || this._read_singles(c);
      token = token || this._read_word(previous_token);
      token = token || this._read_comment(c);
      token = token || this._read_string(c);
      token = token || this._read_regexp(c, previous_token);
      token = token || this._read_xml(c, previous_token);
      token = token || this._read_non_javascript(c);
      token = token || this._read_punctuation();
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };

    Tokenizer.prototype._read_word = function (previous_token) {
      var resulting_string;
      resulting_string = this._input.read(acorn.identifier);

      if (resulting_string !== '') {
        if (!(previous_token.type === TOKEN.DOT || previous_token.type === TOKEN.RESERVED && (previous_token.text === 'set' || previous_token.text === 'get')) && reserved_word_pattern.test(resulting_string)) {
          if (resulting_string === 'in' || resulting_string === 'of') {
            // hack for 'in' and 'of' operators
            return this._create_token(TOKEN.OPERATOR, resulting_string);
          }

          return this._create_token(TOKEN.RESERVED, resulting_string);
        }

        return this._create_token(TOKEN.WORD, resulting_string);
      }

      resulting_string = this._input.read(number_pattern);

      if (resulting_string !== '') {
        return this._create_token(TOKEN.WORD, resulting_string);
      }
    };

    Tokenizer.prototype._read_singles = function (c) {
      var token = null;

      if (c === null) {
        token = this._create_token(TOKEN.EOF, '');
      } else if (c === '(' || c === '[') {
        token = this._create_token(TOKEN.START_EXPR, c);
      } else if (c === ')' || c === ']') {
        token = this._create_token(TOKEN.END_EXPR, c);
      } else if (c === '{') {
        token = this._create_token(TOKEN.START_BLOCK, c);
      } else if (c === '}') {
        token = this._create_token(TOKEN.END_BLOCK, c);
      } else if (c === ';') {
        token = this._create_token(TOKEN.SEMICOLON, c);
      } else if (c === '.' && dot_pattern.test(this._input.peek(1))) {
        token = this._create_token(TOKEN.DOT, c);
      } else if (c === ',') {
        token = this._create_token(TOKEN.COMMA, c);
      }

      if (token) {
        this._input.next();
      }

      return token;
    };

    Tokenizer.prototype._read_punctuation = function () {
      var resulting_string = this._input.read(punct_pattern);

      if (resulting_string !== '') {
        if (resulting_string === '=') {
          return this._create_token(TOKEN.EQUALS, resulting_string);
        } else {
          return this._create_token(TOKEN.OPERATOR, resulting_string);
        }
      }
    };

    Tokenizer.prototype._read_non_javascript = function (c) {
      var resulting_string = '';

      if (c === '#') {
        if (this._is_first_token()) {
          resulting_string = this._input.read(shebang_pattern);

          if (resulting_string) {
            return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + '\n');
          }
        } // handles extendscript #includes


        resulting_string = this._input.read(include_pattern);

        if (resulting_string) {
          return this._create_token(TOKEN.UNKNOWN, resulting_string.trim() + '\n');
        }

        c = this._input.next(); // Spidermonkey-specific sharp variables for circular references. Considered obsolete.

        var sharp = '#';

        if (this._input.hasNext() && this._input.testChar(digit)) {
          do {
            c = this._input.next();
            sharp += c;
          } while (this._input.hasNext() && c !== '#' && c !== '=');

          if (c === '#') {//
          } else if (this._input.peek() === '[' && this._input.peek(1) === ']') {
            sharp += '[]';

            this._input.next();

            this._input.next();
          } else if (this._input.peek() === '{' && this._input.peek(1) === '}') {
            sharp += '{}';

            this._input.next();

            this._input.next();
          }

          return this._create_token(TOKEN.WORD, sharp);
        }

        this._input.back();
      } else if (c === '<') {
        if (this._input.peek(1) === '?' || this._input.peek(1) === '%') {
          resulting_string = this._input.read(template_pattern);

          if (resulting_string) {
            resulting_string = resulting_string.replace(acorn.allLineBreaks, '\n');
            return this._create_token(TOKEN.STRING, resulting_string);
          }
        } else if (this._input.match(/<\!--/g)) {
          c = '<!--';

          while (this._input.hasNext() && !this._input.testChar(acorn.newline)) {
            c += this._input.next();
          }

          in_html_comment = true;
          return this._create_token(TOKEN.COMMENT, c);
        }
      } else if (c === '-' && in_html_comment && this._input.match(/-->/g)) {
        in_html_comment = false;
        return this._create_token(TOKEN.COMMENT, '-->');
      }

      return null;
    };

    Tokenizer.prototype._read_comment = function (c) {
      var token = null;

      if (c === '/') {
        var comment = '';

        if (this._input.peek(1) === '*') {
          // peek for comment /* ... */
          comment = this._input.read(block_comment_pattern);
          var directives = directives_core.get_directives(comment);

          if (directives && directives.ignore === 'start') {
            comment += directives_core.readIgnored(this._input);
          }

          comment = comment.replace(acorn.allLineBreaks, '\n');
          token = this._create_token(TOKEN.BLOCK_COMMENT, comment);
          token.directives = directives;
        } else if (this._input.peek(1) === '/') {
          // peek for comment // ...
          comment = this._input.read(comment_pattern);
          token = this._create_token(TOKEN.COMMENT, comment);
        }
      }

      return token;
    };

    Tokenizer.prototype._read_string = function (c) {
      if (c === '`' || c === "'" || c === '"') {
        var resulting_string = this._input.next();

        this.has_char_escapes = false;

        if (c === '`') {
          resulting_string += this._read_string_recursive('`', true, '${');
        } else {
          resulting_string += this._read_string_recursive(c);
        }

        if (this.has_char_escapes && this._options.unescape_strings) {
          resulting_string = unescape_string(resulting_string);
        }

        if (this._input.peek() === c) {
          resulting_string += this._input.next();
        }

        return this._create_token(TOKEN.STRING, resulting_string);
      }

      return null;
    };

    Tokenizer.prototype._allow_regexp_or_xml = function (previous_token) {
      // regex and xml can only appear in specific locations during parsing
      return previous_token.type === TOKEN.RESERVED && in_array(previous_token.text, ['return', 'case', 'throw', 'else', 'do', 'typeof', 'yield']) || previous_token.type === TOKEN.END_EXPR && previous_token.text === ')' && previous_token.opened.previous.type === TOKEN.RESERVED && in_array(previous_token.opened.previous.text, ['if', 'while', 'for']) || in_array(previous_token.type, [TOKEN.COMMENT, TOKEN.START_EXPR, TOKEN.START_BLOCK, TOKEN.START, TOKEN.END_BLOCK, TOKEN.OPERATOR, TOKEN.EQUALS, TOKEN.EOF, TOKEN.SEMICOLON, TOKEN.COMMA]);
    };

    Tokenizer.prototype._read_regexp = function (c, previous_token) {
      if (c === '/' && this._allow_regexp_or_xml(previous_token)) {
        // handle regexp
        //
        var resulting_string = this._input.next();

        var esc = false;
        var in_char_class = false;

        while (this._input.hasNext() && (esc || in_char_class || this._input.peek() !== c) && !this._input.testChar(acorn.newline)) {
          resulting_string += this._input.peek();

          if (!esc) {
            esc = this._input.peek() === '\\';

            if (this._input.peek() === '[') {
              in_char_class = true;
            } else if (this._input.peek() === ']') {
              in_char_class = false;
            }
          } else {
            esc = false;
          }

          this._input.next();
        }

        if (this._input.peek() === c) {
          resulting_string += this._input.next(); // regexps may have modifiers /regexp/MOD , so fetch those, too
          // Only [gim] are valid, but if the user puts in garbage, do what we can to take it.

          resulting_string += this._input.read(acorn.identifier);
        }

        return this._create_token(TOKEN.STRING, resulting_string);
      }

      return null;
    };

    var startXmlRegExp = /<()([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;
    var xmlRegExp = /[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/g;

    Tokenizer.prototype._read_xml = function (c, previous_token) {
      if (this._options.e4x && c === "<" && this._input.test(startXmlRegExp) && this._allow_regexp_or_xml(previous_token)) {
        // handle e4x xml literals
        //
        var xmlStr = '';

        var match = this._input.match(startXmlRegExp);

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

            match = this._input.match(xmlRegExp);
          } // if we didn't close correctly, keep unformatted.


          if (!match) {
            xmlStr += this._input.match(/[\s\S]*/g)[0];
          }

          xmlStr = xmlStr.replace(acorn.allLineBreaks, '\n');
          return this._create_token(TOKEN.STRING, xmlStr);
        }
      }

      return null;
    };

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
    } // handle string
    //


    Tokenizer.prototype._read_string_recursive = function (delimiter, allow_unescaped_newlines, start_sub) {
      // Template strings can travers lines without escape characters.
      // Other strings cannot
      var current_char;
      var resulting_string = '';
      var esc = false;

      while (this._input.hasNext()) {
        current_char = this._input.peek();

        if (!(esc || current_char !== delimiter && (allow_unescaped_newlines || !acorn.newline.test(current_char)))) {
          break;
        } // Handle \r\n linebreaks after escapes or in template strings


        if ((esc || allow_unescaped_newlines) && acorn.newline.test(current_char)) {
          if (current_char === '\r' && this._input.peek(1) === '\n') {
            this._input.next();

            current_char = this._input.peek();
          }

          resulting_string += '\n';
        } else {
          resulting_string += current_char;
        }

        if (esc) {
          if (current_char === 'x' || current_char === 'u') {
            this.has_char_escapes = true;
          }

          esc = false;
        } else {
          esc = current_char === '\\';
        }

        this._input.next();

        if (start_sub && resulting_string.indexOf(start_sub, resulting_string.length - start_sub.length) !== -1) {
          if (delimiter === '`') {
            resulting_string += this._read_string_recursive('}', allow_unescaped_newlines, '`');
          } else {
            resulting_string += this._read_string_recursive('`', allow_unescaped_newlines, '${');
          }

          if (this._input.hasNext()) {
            resulting_string += this._input.next();
          }
        }
      }

      return resulting_string;
    };

    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
    module.exports.positionable_operators = positionable_operators.slice();
    module.exports.line_starters = line_starters.slice();
    /***/
  },
  /* 8 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function InputScanner(input_string) {
      this.__input = input_string || '';
      this.__input_length = this.__input.length;
      this.__position = 0;
    }

    InputScanner.prototype.restart = function () {
      this.__position = 0;
    };

    InputScanner.prototype.back = function () {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };

    InputScanner.prototype.hasNext = function () {
      return this.__position < this.__input_length;
    };

    InputScanner.prototype.next = function () {
      var val = null;

      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }

      return val;
    };

    InputScanner.prototype.peek = function (index) {
      var val = null;
      index = index || 0;
      index += this.__position;

      if (index >= 0 && index < this.__input_length) {
        val = this.__input.charAt(index);
      }

      return val;
    };

    InputScanner.prototype.test = function (pattern, index) {
      index = index || 0;
      index += this.__position;
      pattern.lastIndex = index;

      if (index >= 0 && index < this.__input_length) {
        var pattern_match = pattern.exec(this.__input);
        return pattern_match && pattern_match.index === index;
      } else {
        return false;
      }
    };

    InputScanner.prototype.testChar = function (pattern, index) {
      // test one character regex match
      var val = this.peek(index);
      return val !== null && pattern.test(val);
    };

    InputScanner.prototype.match = function (pattern) {
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match && pattern_match.index === this.__position) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }

      return pattern_match;
    };

    InputScanner.prototype.read = function (pattern) {
      var val = '';
      var match = this.match(pattern);

      if (match) {
        val = match[0];
      }

      return val;
    };

    InputScanner.prototype.readUntil = function (pattern, include_match) {
      var val = '';
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match) {
        if (include_match) {
          match_index = pattern_match.index + pattern_match[0].length;
        } else {
          match_index = pattern_match.index;
        }
      } else {
        match_index = this.__input_length;
      }

      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };

    InputScanner.prototype.readUntilAfter = function (pattern) {
      return this.readUntil(pattern, true);
    };
    /* css beautifier legacy helpers */


    InputScanner.prototype.peekUntilAfter = function (pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };

    InputScanner.prototype.lookBack = function (testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };

    module.exports.InputScanner = InputScanner;
    /***/
  },
  /* 9 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var InputScanner = __webpack_require__(8).InputScanner;

    var Token = __webpack_require__(3).Token;

    var TokenStream = __webpack_require__(10).TokenStream;

    var TOKEN = {
      START: 'TK_START',
      RAW: 'TK_RAW',
      EOF: 'TK_EOF'
    };

    var Tokenizer = function Tokenizer(input_string, options) {
      this._input = new InputScanner(input_string);
      this._options = options || {};
      this.__tokens = null;
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      this._whitespace_pattern = /[\n\r\t ]+/g;
      this._newline_pattern = /([^\n\r]*)(\r\n|[\n\r])?/g;
    };

    Tokenizer.prototype.tokenize = function () {
      this._input.restart();

      this.__tokens = new TokenStream();

      this._reset();

      var current;
      var previous = new Token(TOKEN.START, '');
      var open_token = null;
      var open_stack = [];
      var comments = new TokenStream();

      while (previous.type !== TOKEN.EOF) {
        current = this._get_next_token(previous, open_token);

        while (this._is_comment(current)) {
          comments.add(current);
          current = this._get_next_token(previous, open_token);
        }

        if (!comments.isEmpty()) {
          current.comments_before = comments;
          comments = new TokenStream();
        }

        current.parent = open_token;

        if (this._is_opening(current)) {
          open_stack.push(open_token);
          open_token = current;
        } else if (open_token && this._is_closing(current, open_token)) {
          current.opened = open_token;
          open_token.closed = current;
          open_token = open_stack.pop();
          current.parent = open_token;
        }

        current.previous = previous;
        previous.next = current;

        this.__tokens.add(current);

        previous = current;
      }

      return this.__tokens;
    };

    Tokenizer.prototype._is_first_token = function () {
      return this.__tokens.isEmpty();
    };

    Tokenizer.prototype._reset = function () {};

    Tokenizer.prototype._get_next_token = function (previous_token, open_token) {
      // jshint unused:false
      this._readWhitespace();

      var resulting_string = this._input.read(/.+/g);

      if (resulting_string) {
        return this._create_token(TOKEN.RAW, resulting_string);
      } else {
        return this._create_token(TOKEN.EOF, '');
      }
    };

    Tokenizer.prototype._is_comment = function (current_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._is_opening = function (current_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._is_closing = function (current_token, open_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._create_token = function (type, text) {
      var token = new Token(type, text, this.__newline_count, this.__whitespace_before_token);
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      return token;
    };

    Tokenizer.prototype._readWhitespace = function () {
      var resulting_string = this._input.read(this._whitespace_pattern);

      if (resulting_string === ' ') {
        this.__whitespace_before_token = resulting_string;
      } else if (resulting_string !== '') {
        this._newline_pattern.lastIndex = 0;

        var nextMatch = this._newline_pattern.exec(resulting_string);

        while (nextMatch[2]) {
          this.__newline_count += 1;
          nextMatch = this._newline_pattern.exec(resulting_string);
        }

        this.__whitespace_before_token = nextMatch[1];
      }
    };

    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
    /***/
  },
  /* 10 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function TokenStream(parent_token) {
      // private
      this.__tokens = [];
      this.__tokens_length = this.__tokens.length;
      this.__position = 0;
      this.__parent_token = parent_token;
    }

    TokenStream.prototype.restart = function () {
      this.__position = 0;
    };

    TokenStream.prototype.isEmpty = function () {
      return this.__tokens_length === 0;
    };

    TokenStream.prototype.hasNext = function () {
      return this.__position < this.__tokens_length;
    };

    TokenStream.prototype.next = function () {
      var val = null;

      if (this.hasNext()) {
        val = this.__tokens[this.__position];
        this.__position += 1;
      }

      return val;
    };

    TokenStream.prototype.peek = function (index) {
      var val = null;
      index = index || 0;
      index += this.__position;

      if (index >= 0 && index < this.__tokens_length) {
        val = this.__tokens[index];
      }

      return val;
    };

    TokenStream.prototype.add = function (token) {
      if (this.__parent_token) {
        token.parent = this.__parent_token;
      }

      this.__tokens.push(token);

      this.__tokens_length += 1;
    };

    module.exports.TokenStream = TokenStream;
    /***/
  },
  /* 11 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Directives(start_block_pattern, end_block_pattern) {
      start_block_pattern = typeof start_block_pattern === 'string' ? start_block_pattern : start_block_pattern.source;
      end_block_pattern = typeof end_block_pattern === 'string' ? end_block_pattern : end_block_pattern.source;
      this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, 'g');
      this.__directive_pattern = / (\w+)[:](\w+)/g;
      this.__directives_end_ignore_pattern = new RegExp('(?:[\\s\\S]*?)((?:' + start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern + ')|$)', 'g');
    }

    Directives.prototype.get_directives = function (text) {
      if (!text.match(this.__directives_block_pattern)) {
        return null;
      }

      var directives = {};
      this.__directive_pattern.lastIndex = 0;

      var directive_match = this.__directive_pattern.exec(text);

      while (directive_match) {
        directives[directive_match[1]] = directive_match[2];
        directive_match = this.__directive_pattern.exec(text);
      }

      return directives;
    };

    Directives.prototype.readIgnored = function (input) {
      return input.read(this.__directives_end_ignore_pattern);
    };

    module.exports.Directives = Directives;
    /***/
  }]);

  var js_beautify = legacy_beautify_js;
  /* Footer */

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

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* AUTO-GENERATED. DO NOT MODIFY. */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.

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

    Based on code initially developed by: Einar Lielmanis, <einar@beautifier.io>
        https://beautifier.io/

    Usage:
        css_beautify(source_text);
        css_beautify(source_text, options);

    The options are (default in brackets):
        indent_size (4)                         — indentation size,
        indent_char (space)                     — character to indent with,
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
  /* GENERATED_BUILD_OUTPUT */
  var legacy_beautify_css =
  /******/
  function (modules) {
    // webpackBootstrap

    /******/
    // The module cache

    /******/
    var installedModules = {};
    /******/

    /******/
    // The require function

    /******/

    function __webpack_require__(moduleId) {
      /******/

      /******/
      // Check if module is in cache

      /******/
      if (installedModules[moduleId]) {
        /******/
        return installedModules[moduleId].exports;
        /******/
      }
      /******/
      // Create a new module (and put it into the cache)

      /******/


      var module = installedModules[moduleId] = {
        /******/
        i: moduleId,

        /******/
        l: false,

        /******/
        exports: {}
        /******/

      };
      /******/

      /******/
      // Execute the module function

      /******/

      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/

      /******/
      // Flag the module as loaded

      /******/

      module.l = true;
      /******/

      /******/
      // Return the exports of the module

      /******/

      return module.exports;
      /******/
    }
    /******/

    /******/

    /******/
    // expose the modules object (__webpack_modules__)

    /******/


    __webpack_require__.m = modules;
    /******/

    /******/
    // expose the module cache

    /******/

    __webpack_require__.c = installedModules;
    /******/

    /******/
    // define getter function for harmony exports

    /******/

    __webpack_require__.d = function (exports, name, getter) {
      /******/
      if (!__webpack_require__.o(exports, name)) {
        /******/
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/

    };
    /******/

    /******/
    // define __esModule on exports

    /******/


    __webpack_require__.r = function (exports) {
      /******/
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /******/
    };
    /******/

    /******/
    // create a fake namespace object

    /******/
    // mode & 1: value is a module id, require it

    /******/
    // mode & 2: merge all properties of value into the ns

    /******/
    // mode & 4: return value when already ns object

    /******/
    // mode & 8|1: behave like require

    /******/


    __webpack_require__.t = function (value, mode) {
      /******/
      if (mode & 1) value = __webpack_require__(value);
      /******/

      if (mode & 8) return value;
      /******/

      if (mode & 4 && _typeof(value) === 'object' && value && value.__esModule) return value;
      /******/

      var ns = Object.create(null);
      /******/

      __webpack_require__.r(ns);
      /******/


      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      /******/

      if (mode & 2 && typeof value != 'string') for (var key in value) {
        __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
      }
      /******/

      return ns;
      /******/
    };
    /******/

    /******/
    // getDefaultExport function for compatibility with non-harmony modules

    /******/


    __webpack_require__.n = function (module) {
      /******/
      var getter = module && module.__esModule ?
      /******/
      function getDefault() {
        return module['default'];
      } :
      /******/
      function getModuleExports() {
        return module;
      };
      /******/

      __webpack_require__.d(getter, 'a', getter);
      /******/


      return getter;
      /******/
    };
    /******/

    /******/
    // Object.prototype.hasOwnProperty.call

    /******/


    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/

    /******/
    // __webpack_public_path__

    /******/


    __webpack_require__.p = "";
    /******/

    /******/

    /******/
    // Load entry module and return exports

    /******/

    return __webpack_require__(__webpack_require__.s = 12);
    /******/
  }(
  /************************************************************************/

  /******/
  [,,
  /* 0 */

  /* 1 */

  /* 2 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0; // use indent_count as a marker for this.__lines that have preserved indentation

      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__items = [];
    }

    OutputLine.prototype.item = function (index) {
      if (index < 0) {
        return this.__items[this.__items.length + index];
      } else {
        return this.__items[index];
      }
    };

    OutputLine.prototype.has_match = function (pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }

      return false;
    };

    OutputLine.prototype.set_indent = function (indent, alignment) {
      this.__indent_count = indent || 0;
      this.__alignment_count = alignment || 0;
      this.__character_count = this.__parent.baseIndentLength + this.__alignment_count + this.__indent_count * this.__parent.indent_length;
    };

    OutputLine.prototype.get_character_count = function () {
      return this.__character_count;
    };

    OutputLine.prototype.is_empty = function () {
      return this.__items.length === 0;
    };

    OutputLine.prototype.last = function () {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };

    OutputLine.prototype.push = function (item) {
      this.__items.push(item);

      this.__character_count += item.length;
    };

    OutputLine.prototype.push_raw = function (item) {
      this.push(item);
      var last_newline_index = item.lastIndexOf('\n');

      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      }
    };

    OutputLine.prototype.pop = function () {
      var item = null;

      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }

      return item;
    };

    OutputLine.prototype.remove_indent = function () {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_length;
      }
    };

    OutputLine.prototype.trim = function () {
      while (this.last() === ' ') {
        this.__items.pop();

        this.__character_count -= 1;
      }
    };

    OutputLine.prototype.toString = function () {
      var result = '';

      if (!this.is_empty()) {
        if (this.__indent_count >= 0) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }

        if (this.__alignment_count >= 0) {
          result += this.__parent.get_alignment_string(this.__alignment_count);
        }

        result += this.__items.join('');
      }

      return result;
    };

    function IndentCache(base_string, level_string) {
      this.__cache = [base_string];
      this.__level_string = level_string;
    }

    IndentCache.prototype.__ensure_cache = function (level) {
      while (level >= this.__cache.length) {
        this.__cache.push(this.__cache[this.__cache.length - 1] + this.__level_string);
      }
    };

    IndentCache.prototype.get_level_string = function (level) {
      this.__ensure_cache(level);

      return this.__cache[level];
    };

    function Output(options, baseIndentString) {
      var indent_string = options.indent_char;

      if (options.indent_size > 1) {
        indent_string = new Array(options.indent_size + 1).join(options.indent_char);
      } // Set to null to continue support for auto detection of base indent level.


      baseIndentString = baseIndentString || '';

      if (options.indent_level > 0) {
        baseIndentString = new Array(options.indent_level + 1).join(indent_string);
      }

      this.__indent_cache = new IndentCache(baseIndentString, indent_string);
      this.__alignment_cache = new IndentCache('', ' ');
      this.baseIndentLength = baseIndentString.length;
      this.indent_length = indent_string.length;
      this.raw = false;
      this._end_with_newline = options.end_with_newline;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.space_before_token = false; // initialize

      this.__add_outputline();
    }

    Output.prototype.__add_outputline = function () {
      this.previous_line = this.current_line;
      this.current_line = new OutputLine(this);

      this.__lines.push(this.current_line);
    };

    Output.prototype.get_line_number = function () {
      return this.__lines.length;
    };

    Output.prototype.get_indent_string = function (level) {
      return this.__indent_cache.get_level_string(level);
    };

    Output.prototype.get_alignment_string = function (level) {
      return this.__alignment_cache.get_level_string(level);
    };

    Output.prototype.is_empty = function () {
      return !this.previous_line && this.current_line.is_empty();
    };

    Output.prototype.add_new_line = function (force_newline) {
      // never newline at the start of file
      // otherwise, newline only if we didn't just add one or we're forced
      if (this.is_empty() || !force_newline && this.just_added_newline()) {
        return false;
      } // if raw output is enabled, don't print additional newlines,
      // but still return True as though you had


      if (!this.raw) {
        this.__add_outputline();
      }

      return true;
    };

    Output.prototype.get_code = function (eol) {
      var sweet_code = this.__lines.join('\n').replace(/[\r\n\t ]+$/, '');

      if (this._end_with_newline) {
        sweet_code += '\n';
      }

      if (eol !== '\n') {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }

      return sweet_code;
    };

    Output.prototype.set_indent = function (indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0; // Never indent your first output indent at the start of the file

      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }

      this.current_line.set_indent();
      return false;
    };

    Output.prototype.add_raw_token = function (token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }

      this.current_line.push(token.whitespace_before);
      this.current_line.push_raw(token.text);
      this.space_before_token = false;
    };

    Output.prototype.add_token = function (printable_token) {
      this.add_space_before_token();
      this.current_line.push(printable_token);
    };

    Output.prototype.add_space_before_token = function () {
      if (this.space_before_token && !this.just_added_newline()) {
        this.current_line.push(' ');
      }

      this.space_before_token = false;
    };

    Output.prototype.remove_indent = function (index) {
      var output_length = this.__lines.length;

      while (index < output_length) {
        this.__lines[index].remove_indent();

        index++;
      }
    };

    Output.prototype.trim = function (eat_newlines) {
      eat_newlines = eat_newlines === undefined ? false : eat_newlines;
      this.current_line.trim(this.indent_string, this.baseIndentString);

      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();

        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }

      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };

    Output.prototype.just_added_newline = function () {
      return this.current_line.is_empty();
    };

    Output.prototype.just_added_blankline = function () {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
    };

    Output.prototype.ensure_empty_line_above = function (starts_with, ends_with) {
      var index = this.__lines.length - 2;

      while (index >= 0) {
        var potentialEmptyLine = this.__lines[index];

        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index + 1, 0, new OutputLine(this));

          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }

        index--;
      }
    };

    module.exports.Output = Output;
    /***/
  },,,,
  /* 3 */

  /* 4 */

  /* 5 */

  /* 6 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Options(options, merge_child_field) {
      this.raw_options = _mergeOpts(options, merge_child_field); // Support passing the source text back with no change

      this.disabled = this._get_boolean('disabled');
      this.eol = this._get_characters('eol', 'auto');
      this.end_with_newline = this._get_boolean('end_with_newline');
      this.indent_size = this._get_number('indent_size', 4);
      this.indent_char = this._get_characters('indent_char', ' ');
      this.indent_level = this._get_number('indent_level');
      this.preserve_newlines = this._get_boolean('preserve_newlines', true);
      this.max_preserve_newlines = this._get_number('max_preserve_newlines', 32786);

      if (!this.preserve_newlines) {
        this.max_preserve_newlines = 0;
      }

      this.indent_with_tabs = this._get_boolean('indent_with_tabs');

      if (this.indent_with_tabs) {
        this.indent_char = '\t';
        this.indent_size = 1;
      } // Backwards compat with 1.3.x


      this.wrap_line_length = this._get_number('wrap_line_length', this._get_number('max_char'));
    }

    Options.prototype._get_array = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || [];

      if (_typeof(option_value) === 'object') {
        if (option_value !== null && typeof option_value.concat === 'function') {
          result = option_value.concat();
        }
      } else if (typeof option_value === 'string') {
        result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
      }

      return result;
    };

    Options.prototype._get_boolean = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = option_value === undefined ? !!default_value : !!option_value;
      return result;
    };

    Options.prototype._get_characters = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || '';

      if (typeof option_value === 'string') {
        result = option_value.replace(/\\r/, '\r').replace(/\\n/, '\n').replace(/\\t/, '\t');
      }

      return result;
    };

    Options.prototype._get_number = function (name, default_value) {
      var option_value = this.raw_options[name];
      default_value = parseInt(default_value, 10);

      if (isNaN(default_value)) {
        default_value = 0;
      }

      var result = parseInt(option_value, 10);

      if (isNaN(result)) {
        result = default_value;
      }

      return result;
    };

    Options.prototype._get_selection = function (name, selection_list, default_value) {
      var result = this._get_selection_list(name, selection_list, default_value);

      if (result.length !== 1) {
        throw new Error("Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result[0];
    };

    Options.prototype._get_selection_list = function (name, selection_list, default_value) {
      if (!selection_list || selection_list.length === 0) {
        throw new Error("Selection list cannot be empty.");
      }

      default_value = default_value || [selection_list[0]];

      if (!this._is_valid_selection(default_value, selection_list)) {
        throw new Error("Invalid Default Value!");
      }

      var result = this._get_array(name, default_value);

      if (!this._is_valid_selection(result, selection_list)) {
        throw new Error("Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result;
    };

    Options.prototype._is_valid_selection = function (result, selection_list) {
      return result.length && selection_list.length && !result.some(function (item) {
        return selection_list.indexOf(item) === -1;
      });
    }; // merges child options up with the parent options object
    // Example: obj = {a: 1, b: {a: 2}}
    //          mergeOpts(obj, 'b')
    //
    //          Returns: {a: 2}


    function _mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      allOptions = _normalizeOpts(allOptions);
      var name;

      for (name in allOptions) {
        if (name !== childFieldName) {
          finalOpts[name] = allOptions[name];
        }
      } //merge in the per type settings for the childFieldName


      if (childFieldName && allOptions[childFieldName]) {
        for (name in allOptions[childFieldName]) {
          finalOpts[name] = allOptions[childFieldName][name];
        }
      }

      return finalOpts;
    }

    function _normalizeOpts(options) {
      var convertedOpts = {};
      var key;

      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }

      return convertedOpts;
    }

    module.exports.Options = Options;
    module.exports.normalizeOpts = _normalizeOpts;
    module.exports.mergeOpts = _mergeOpts;
    /***/
  },,
  /* 7 */

  /* 8 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function InputScanner(input_string) {
      this.__input = input_string || '';
      this.__input_length = this.__input.length;
      this.__position = 0;
    }

    InputScanner.prototype.restart = function () {
      this.__position = 0;
    };

    InputScanner.prototype.back = function () {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };

    InputScanner.prototype.hasNext = function () {
      return this.__position < this.__input_length;
    };

    InputScanner.prototype.next = function () {
      var val = null;

      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }

      return val;
    };

    InputScanner.prototype.peek = function (index) {
      var val = null;
      index = index || 0;
      index += this.__position;

      if (index >= 0 && index < this.__input_length) {
        val = this.__input.charAt(index);
      }

      return val;
    };

    InputScanner.prototype.test = function (pattern, index) {
      index = index || 0;
      index += this.__position;
      pattern.lastIndex = index;

      if (index >= 0 && index < this.__input_length) {
        var pattern_match = pattern.exec(this.__input);
        return pattern_match && pattern_match.index === index;
      } else {
        return false;
      }
    };

    InputScanner.prototype.testChar = function (pattern, index) {
      // test one character regex match
      var val = this.peek(index);
      return val !== null && pattern.test(val);
    };

    InputScanner.prototype.match = function (pattern) {
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match && pattern_match.index === this.__position) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }

      return pattern_match;
    };

    InputScanner.prototype.read = function (pattern) {
      var val = '';
      var match = this.match(pattern);

      if (match) {
        val = match[0];
      }

      return val;
    };

    InputScanner.prototype.readUntil = function (pattern, include_match) {
      var val = '';
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match) {
        if (include_match) {
          match_index = pattern_match.index + pattern_match[0].length;
        } else {
          match_index = pattern_match.index;
        }
      } else {
        match_index = this.__input_length;
      }

      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };

    InputScanner.prototype.readUntilAfter = function (pattern) {
      return this.readUntil(pattern, true);
    };
    /* css beautifier legacy helpers */


    InputScanner.prototype.peekUntilAfter = function (pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };

    InputScanner.prototype.lookBack = function (testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };

    module.exports.InputScanner = InputScanner;
    /***/
  },,,,
  /* 9 */

  /* 10 */

  /* 11 */

  /* 12 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Beautifier = __webpack_require__(13).Beautifier,
        Options = __webpack_require__(14).Options;

    function css_beautify(source_text, options) {
      var beautifier = new Beautifier(source_text, options);
      return beautifier.beautify();
    }

    module.exports = css_beautify;

    module.exports.defaultOptions = function () {
      return new Options();
    };
    /***/

  },
  /* 13 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Options = __webpack_require__(14).Options;

    var Output = __webpack_require__(2).Output;

    var InputScanner = __webpack_require__(8).InputScanner;

    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g; // tokenizer

    var whitespaceChar = /\s/;
    var whitespacePattern = /(?:\s|\n)+/g;
    var block_comment_pattern = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g;
    var comment_pattern = /\/\/(?:[^\n\r\u2028\u2029]*)/g;

    function Beautifier(source_text, options) {
      this._source_text = source_text || ''; // Allow the setting of language/file-type specific options
      // with inheritance of overall settings

      this._options = new Options(options);
      this._ch = null;
      this._input = null; // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule

      this.NESTED_AT_RULE = {
        "@page": true,
        "@font-face": true,
        "@keyframes": true,
        // also in CONDITIONAL_GROUP_RULE below
        "@media": true,
        "@supports": true,
        "@document": true
      };
      this.CONDITIONAL_GROUP_RULE = {
        "@media": true,
        "@supports": true,
        "@document": true
      };
    }

    Beautifier.prototype.eatString = function (endChars) {
      var result = '';
      this._ch = this._input.next();

      while (this._ch) {
        result += this._ch;

        if (this._ch === "\\") {
          result += this._input.next();
        } else if (endChars.indexOf(this._ch) !== -1 || this._ch === "\n") {
          break;
        }

        this._ch = this._input.next();
      }

      return result;
    }; // Skips any white space in the source text from the current position.
    // When allowAtLeastOneNewLine is true, will output new lines for each
    // newline character found; if the user has preserve_newlines off, only
    // the first newline will be output


    Beautifier.prototype.eatWhitespace = function (allowAtLeastOneNewLine) {
      var result = whitespaceChar.test(this._input.peek());
      var isFirstNewLine = true;

      while (whitespaceChar.test(this._input.peek())) {
        this._ch = this._input.next();

        if (allowAtLeastOneNewLine && this._ch === '\n') {
          if (this._options.preserve_newlines || isFirstNewLine) {
            isFirstNewLine = false;

            this._output.add_new_line(true);
          }
        }
      }

      return result;
    }; // Nested pseudo-class if we are insideRule
    // and the next special character found opens
    // a new block


    Beautifier.prototype.foundNestedPseudoClass = function () {
      var openParen = 0;
      var i = 1;

      var ch = this._input.peek(i);

      while (ch) {
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

        i++;
        ch = this._input.peek(i);
      }

      return false;
    };

    Beautifier.prototype.print_string = function (output_string) {
      if (this._output.just_added_newline()) {
        this._output.set_indent(this._indentLevel);
      }

      this._output.add_token(output_string);
    };

    Beautifier.prototype.preserveSingleSpace = function (isAfterSpace) {
      if (isAfterSpace) {
        this._output.space_before_token = true;
      }
    };

    Beautifier.prototype.indent = function () {
      this._indentLevel++;
    };

    Beautifier.prototype.outdent = function () {
      if (this._indentLevel > 0) {
        this._indentLevel--;
      }
    };
    /*_____________________--------------------_____________________*/


    Beautifier.prototype.beautify = function () {
      if (this._options.disabled) {
        return this._source_text;
      }

      var source_text = this._source_text;
      var eol = this._options.eol;

      if (eol === 'auto') {
        eol = '\n';

        if (source_text && lineBreak.test(source_text || '')) {
          eol = source_text.match(lineBreak)[0];
        }
      } // HACK: newline parsing inconsistent. This brute force normalizes the this._input.


      source_text = source_text.replace(allLineBreaks, '\n'); // reset

      var baseIndentString = source_text.match(/^[\t ]*/)[0];
      this._output = new Output(this._options, baseIndentString);
      this._input = new InputScanner(source_text);
      this._indentLevel = 0;
      this._nestedLevel = 0;
      this._ch = null;
      var parenLevel = 0;
      var insideRule = false; // This is the value side of a property value pair (blue in the following ex)
      // label { content: blue }

      var insidePropertyValue = false;
      var enteringConditionalGroup = false;
      var insideAtExtend = false;
      var insideAtImport = false;
      var topCharacter = this._ch;

      while (true) {
        var whitespace = this._input.read(whitespacePattern);

        var isAfterSpace = whitespace !== '';
        var previous_ch = topCharacter;
        this._ch = this._input.next();
        topCharacter = this._ch;

        if (!this._ch) {
          break;
        } else if (this._ch === '/' && this._input.peek() === '*') {
          // /* css comment */
          // Always start block comments on a new line.
          // This handles scenarios where a block comment immediately
          // follows a property definition on the same line or where
          // minified code is being beautified.
          this._output.add_new_line();

          this._input.back();

          this.print_string(this._input.read(block_comment_pattern)); // Ensures any new lines following the comment are preserved

          this.eatWhitespace(true); // Block comments are followed by a new line so they don't
          // share a line with other properties

          this._output.add_new_line();
        } else if (this._ch === '/' && this._input.peek() === '/') {
          // // single line comment
          // Preserves the space before a comment
          // on the same line as a rule
          this._output.space_before_token = true;

          this._input.back();

          this.print_string(this._input.read(comment_pattern)); // Ensures any new lines following the comment are preserved

          this.eatWhitespace(true);
        } else if (this._ch === '@') {
          this.preserveSingleSpace(isAfterSpace); // deal with less propery mixins @{...}

          if (this._input.peek() === '{') {
            this.print_string(this._ch + this.eatString('}'));
          } else {
            this.print_string(this._ch); // strip trailing space, if present, for hash property checks

            var variableOrRule = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);

            if (variableOrRule.match(/[ :]$/)) {
              // we have a variable or pseudo-class, add it and insert one space before continuing
              variableOrRule = this.eatString(": ").replace(/\s$/, '');
              this.print_string(variableOrRule);
              this._output.space_before_token = true;
            }

            variableOrRule = variableOrRule.replace(/\s$/, '');

            if (variableOrRule === 'extend') {
              insideAtExtend = true;
            } else if (variableOrRule === 'import') {
              insideAtImport = true;
            } // might be a nesting at-rule


            if (variableOrRule in this.NESTED_AT_RULE) {
              this._nestedLevel += 1;

              if (variableOrRule in this.CONDITIONAL_GROUP_RULE) {
                enteringConditionalGroup = true;
              } // might be less variable

            } else if (!insideRule && parenLevel === 0 && variableOrRule.indexOf(':') !== -1) {
              insidePropertyValue = true;
              this.indent();
            }
          }
        } else if (this._ch === '#' && this._input.peek() === '{') {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch + this.eatString('}'));
        } else if (this._ch === '{') {
          if (insidePropertyValue) {
            insidePropertyValue = false;
            this.outdent();
          }

          this.indent();
          this._output.space_before_token = true;
          this.print_string(this._ch); // when entering conditional groups, only rulesets are allowed

          if (enteringConditionalGroup) {
            enteringConditionalGroup = false;
            insideRule = this._indentLevel > this._nestedLevel;
          } else {
            // otherwise, declarations are also allowed
            insideRule = this._indentLevel >= this._nestedLevel;
          }

          if (this._options.newline_between_rules && insideRule) {
            if (this._output.previous_line && this._output.previous_line.item(-1) !== '{') {
              this._output.ensure_empty_line_above('/', ',');
            }
          }

          this.eatWhitespace(true);

          this._output.add_new_line();
        } else if (this._ch === '}') {
          this.outdent();

          this._output.add_new_line();

          if (previous_ch === '{') {
            this._output.trim(true);
          }

          insideAtImport = false;
          insideAtExtend = false;

          if (insidePropertyValue) {
            this.outdent();
            insidePropertyValue = false;
          }

          this.print_string(this._ch);
          insideRule = false;

          if (this._nestedLevel) {
            this._nestedLevel--;
          }

          this.eatWhitespace(true);

          this._output.add_new_line();

          if (this._options.newline_between_rules && !this._output.just_added_blankline()) {
            if (this._input.peek() !== '}') {
              this._output.add_new_line(true);
            }
          }
        } else if (this._ch === ":") {
          if ((insideRule || enteringConditionalGroup) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !insideAtExtend) {
            // 'property: value' delimiter
            // which could be in a conditional group query
            this.print_string(':');

            if (!insidePropertyValue) {
              insidePropertyValue = true;
              this._output.space_before_token = true;
              this.eatWhitespace(true);
              this.indent();
            }
          } else {
            // sass/less parent reference don't use a space
            // sass nested pseudo-class don't use a space
            // preserve space before pseudoclasses/pseudoelements, as it means "in any child"
            if (this._input.lookBack(" ")) {
              this._output.space_before_token = true;
            }

            if (this._input.peek() === ":") {
              // pseudo-element
              this._ch = this._input.next();
              this.print_string("::");
            } else {
              // pseudo-class
              this.print_string(':');
            }
          }
        } else if (this._ch === '"' || this._ch === '\'') {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch + this.eatString(this._ch));
          this.eatWhitespace(true);
        } else if (this._ch === ';') {
          if (insidePropertyValue) {
            this.outdent();
            insidePropertyValue = false;
          }

          insideAtExtend = false;
          insideAtImport = false;
          this.print_string(this._ch);
          this.eatWhitespace(true); // This maintains single line comments on the same
          // line. Block comments are also affected, but
          // a new line is always output before one inside
          // that section

          if (this._input.peek() !== '/') {
            this._output.add_new_line();
          }
        } else if (this._ch === '(') {
          // may be a url
          if (this._input.lookBack("url")) {
            this.print_string(this._ch);
            this.eatWhitespace();
            this._ch = this._input.next();

            if (this._ch === ')' || this._ch === '"' || this._ch === '\'') {
              this._input.back();

              parenLevel++;
            } else if (this._ch) {
              this.print_string(this._ch + this.eatString(')'));
            }
          } else {
            parenLevel++;
            this.preserveSingleSpace(isAfterSpace);
            this.print_string(this._ch);
            this.eatWhitespace();
          }
        } else if (this._ch === ')') {
          this.print_string(this._ch);
          parenLevel--;
        } else if (this._ch === ',') {
          this.print_string(this._ch);
          this.eatWhitespace(true);

          if (this._options.selector_separator_newline && !insidePropertyValue && parenLevel < 1 && !insideAtImport) {
            this._output.add_new_line();
          } else {
            this._output.space_before_token = true;
          }
        } else if ((this._ch === '>' || this._ch === '+' || this._ch === '~') && !insidePropertyValue && parenLevel < 1) {
          //handle combinator spacing
          if (this._options.space_around_combinator) {
            this._output.space_before_token = true;
            this.print_string(this._ch);
            this._output.space_before_token = true;
          } else {
            this.print_string(this._ch);
            this.eatWhitespace(); // squash extra whitespace

            if (this._ch && whitespaceChar.test(this._ch)) {
              this._ch = '';
            }
          }
        } else if (this._ch === ']') {
          this.print_string(this._ch);
        } else if (this._ch === '[') {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch);
        } else if (this._ch === '=') {
          // no whitespace before or after
          this.eatWhitespace();
          this.print_string('=');

          if (whitespaceChar.test(this._ch)) {
            this._ch = '';
          }
        } else if (this._ch === '!') {
          // !important
          this.print_string(' ');
          this.print_string(this._ch);
        } else {
          this.preserveSingleSpace(isAfterSpace);
          this.print_string(this._ch);
        }
      }

      var sweetCode = this._output.get_code(eol);

      return sweetCode;
    };

    module.exports.Beautifier = Beautifier;
    /***/
  },
  /* 14 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var BaseOptions = __webpack_require__(6).Options;

    function Options(options) {
      BaseOptions.call(this, options, 'css');
      this.selector_separator_newline = this._get_boolean('selector_separator_newline', true);
      this.newline_between_rules = this._get_boolean('newline_between_rules', true);

      var space_around_selector_separator = this._get_boolean('space_around_selector_separator');

      this.space_around_combinator = this._get_boolean('space_around_combinator') || space_around_selector_separator;
    }

    Options.prototype = new BaseOptions();
    module.exports.Options = Options;
    /***/
  }]);

  var css_beautify = legacy_beautify_css;
  /* Footer */

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

/* AUTO-GENERATED. DO NOT MODIFY. */

/*

  The MIT License (MIT)

  Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.

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

  Based on code initially developed by: Einar Lielmanis, <einar@beautifier.io>
    https://beautifier.io/

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
    inline (defaults to inline tags) - list of tags to be considered inline tags
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    content_unformatted (defaults to ["pre", "textarea"] tags) - list of tags, whose content shouldn't be reformatted
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
  /* GENERATED_BUILD_OUTPUT */
  var legacy_beautify_html =
  /******/
  function (modules) {
    // webpackBootstrap

    /******/
    // The module cache

    /******/
    var installedModules = {};
    /******/

    /******/
    // The require function

    /******/

    function __webpack_require__(moduleId) {
      /******/

      /******/
      // Check if module is in cache

      /******/
      if (installedModules[moduleId]) {
        /******/
        return installedModules[moduleId].exports;
        /******/
      }
      /******/
      // Create a new module (and put it into the cache)

      /******/


      var module = installedModules[moduleId] = {
        /******/
        i: moduleId,

        /******/
        l: false,

        /******/
        exports: {}
        /******/

      };
      /******/

      /******/
      // Execute the module function

      /******/

      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/

      /******/
      // Flag the module as loaded

      /******/

      module.l = true;
      /******/

      /******/
      // Return the exports of the module

      /******/

      return module.exports;
      /******/
    }
    /******/

    /******/

    /******/
    // expose the modules object (__webpack_modules__)

    /******/


    __webpack_require__.m = modules;
    /******/

    /******/
    // expose the module cache

    /******/

    __webpack_require__.c = installedModules;
    /******/

    /******/
    // define getter function for harmony exports

    /******/

    __webpack_require__.d = function (exports, name, getter) {
      /******/
      if (!__webpack_require__.o(exports, name)) {
        /******/
        Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter
        });
        /******/
      }
      /******/

    };
    /******/

    /******/
    // define __esModule on exports

    /******/


    __webpack_require__.r = function (exports) {
      /******/
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
        /******/
      }
      /******/


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /******/
    };
    /******/

    /******/
    // create a fake namespace object

    /******/
    // mode & 1: value is a module id, require it

    /******/
    // mode & 2: merge all properties of value into the ns

    /******/
    // mode & 4: return value when already ns object

    /******/
    // mode & 8|1: behave like require

    /******/


    __webpack_require__.t = function (value, mode) {
      /******/
      if (mode & 1) value = __webpack_require__(value);
      /******/

      if (mode & 8) return value;
      /******/

      if (mode & 4 && _typeof(value) === 'object' && value && value.__esModule) return value;
      /******/

      var ns = Object.create(null);
      /******/

      __webpack_require__.r(ns);
      /******/


      Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value
      });
      /******/

      if (mode & 2 && typeof value != 'string') for (var key in value) {
        __webpack_require__.d(ns, key, function (key) {
          return value[key];
        }.bind(null, key));
      }
      /******/

      return ns;
      /******/
    };
    /******/

    /******/
    // getDefaultExport function for compatibility with non-harmony modules

    /******/


    __webpack_require__.n = function (module) {
      /******/
      var getter = module && module.__esModule ?
      /******/
      function getDefault() {
        return module['default'];
      } :
      /******/
      function getModuleExports() {
        return module;
      };
      /******/

      __webpack_require__.d(getter, 'a', getter);
      /******/


      return getter;
      /******/
    };
    /******/

    /******/
    // Object.prototype.hasOwnProperty.call

    /******/


    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/

    /******/
    // __webpack_public_path__

    /******/


    __webpack_require__.p = "";
    /******/

    /******/

    /******/
    // Load entry module and return exports

    /******/

    return __webpack_require__(__webpack_require__.s = 15);
    /******/
  }(
  /************************************************************************/

  /******/
  [,,
  /* 0 */

  /* 1 */

  /* 2 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function OutputLine(parent) {
      this.__parent = parent;
      this.__character_count = 0; // use indent_count as a marker for this.__lines that have preserved indentation

      this.__indent_count = -1;
      this.__alignment_count = 0;
      this.__items = [];
    }

    OutputLine.prototype.item = function (index) {
      if (index < 0) {
        return this.__items[this.__items.length + index];
      } else {
        return this.__items[index];
      }
    };

    OutputLine.prototype.has_match = function (pattern) {
      for (var lastCheckedOutput = this.__items.length - 1; lastCheckedOutput >= 0; lastCheckedOutput--) {
        if (this.__items[lastCheckedOutput].match(pattern)) {
          return true;
        }
      }

      return false;
    };

    OutputLine.prototype.set_indent = function (indent, alignment) {
      this.__indent_count = indent || 0;
      this.__alignment_count = alignment || 0;
      this.__character_count = this.__parent.baseIndentLength + this.__alignment_count + this.__indent_count * this.__parent.indent_length;
    };

    OutputLine.prototype.get_character_count = function () {
      return this.__character_count;
    };

    OutputLine.prototype.is_empty = function () {
      return this.__items.length === 0;
    };

    OutputLine.prototype.last = function () {
      if (!this.is_empty()) {
        return this.__items[this.__items.length - 1];
      } else {
        return null;
      }
    };

    OutputLine.prototype.push = function (item) {
      this.__items.push(item);

      this.__character_count += item.length;
    };

    OutputLine.prototype.push_raw = function (item) {
      this.push(item);
      var last_newline_index = item.lastIndexOf('\n');

      if (last_newline_index !== -1) {
        this.__character_count = item.length - last_newline_index;
      }
    };

    OutputLine.prototype.pop = function () {
      var item = null;

      if (!this.is_empty()) {
        item = this.__items.pop();
        this.__character_count -= item.length;
      }

      return item;
    };

    OutputLine.prototype.remove_indent = function () {
      if (this.__indent_count > 0) {
        this.__indent_count -= 1;
        this.__character_count -= this.__parent.indent_length;
      }
    };

    OutputLine.prototype.trim = function () {
      while (this.last() === ' ') {
        this.__items.pop();

        this.__character_count -= 1;
      }
    };

    OutputLine.prototype.toString = function () {
      var result = '';

      if (!this.is_empty()) {
        if (this.__indent_count >= 0) {
          result = this.__parent.get_indent_string(this.__indent_count);
        }

        if (this.__alignment_count >= 0) {
          result += this.__parent.get_alignment_string(this.__alignment_count);
        }

        result += this.__items.join('');
      }

      return result;
    };

    function IndentCache(base_string, level_string) {
      this.__cache = [base_string];
      this.__level_string = level_string;
    }

    IndentCache.prototype.__ensure_cache = function (level) {
      while (level >= this.__cache.length) {
        this.__cache.push(this.__cache[this.__cache.length - 1] + this.__level_string);
      }
    };

    IndentCache.prototype.get_level_string = function (level) {
      this.__ensure_cache(level);

      return this.__cache[level];
    };

    function Output(options, baseIndentString) {
      var indent_string = options.indent_char;

      if (options.indent_size > 1) {
        indent_string = new Array(options.indent_size + 1).join(options.indent_char);
      } // Set to null to continue support for auto detection of base indent level.


      baseIndentString = baseIndentString || '';

      if (options.indent_level > 0) {
        baseIndentString = new Array(options.indent_level + 1).join(indent_string);
      }

      this.__indent_cache = new IndentCache(baseIndentString, indent_string);
      this.__alignment_cache = new IndentCache('', ' ');
      this.baseIndentLength = baseIndentString.length;
      this.indent_length = indent_string.length;
      this.raw = false;
      this._end_with_newline = options.end_with_newline;
      this.__lines = [];
      this.previous_line = null;
      this.current_line = null;
      this.space_before_token = false; // initialize

      this.__add_outputline();
    }

    Output.prototype.__add_outputline = function () {
      this.previous_line = this.current_line;
      this.current_line = new OutputLine(this);

      this.__lines.push(this.current_line);
    };

    Output.prototype.get_line_number = function () {
      return this.__lines.length;
    };

    Output.prototype.get_indent_string = function (level) {
      return this.__indent_cache.get_level_string(level);
    };

    Output.prototype.get_alignment_string = function (level) {
      return this.__alignment_cache.get_level_string(level);
    };

    Output.prototype.is_empty = function () {
      return !this.previous_line && this.current_line.is_empty();
    };

    Output.prototype.add_new_line = function (force_newline) {
      // never newline at the start of file
      // otherwise, newline only if we didn't just add one or we're forced
      if (this.is_empty() || !force_newline && this.just_added_newline()) {
        return false;
      } // if raw output is enabled, don't print additional newlines,
      // but still return True as though you had


      if (!this.raw) {
        this.__add_outputline();
      }

      return true;
    };

    Output.prototype.get_code = function (eol) {
      var sweet_code = this.__lines.join('\n').replace(/[\r\n\t ]+$/, '');

      if (this._end_with_newline) {
        sweet_code += '\n';
      }

      if (eol !== '\n') {
        sweet_code = sweet_code.replace(/[\n]/g, eol);
      }

      return sweet_code;
    };

    Output.prototype.set_indent = function (indent, alignment) {
      indent = indent || 0;
      alignment = alignment || 0; // Never indent your first output indent at the start of the file

      if (this.__lines.length > 1) {
        this.current_line.set_indent(indent, alignment);
        return true;
      }

      this.current_line.set_indent();
      return false;
    };

    Output.prototype.add_raw_token = function (token) {
      for (var x = 0; x < token.newlines; x++) {
        this.__add_outputline();
      }

      this.current_line.push(token.whitespace_before);
      this.current_line.push_raw(token.text);
      this.space_before_token = false;
    };

    Output.prototype.add_token = function (printable_token) {
      this.add_space_before_token();
      this.current_line.push(printable_token);
    };

    Output.prototype.add_space_before_token = function () {
      if (this.space_before_token && !this.just_added_newline()) {
        this.current_line.push(' ');
      }

      this.space_before_token = false;
    };

    Output.prototype.remove_indent = function (index) {
      var output_length = this.__lines.length;

      while (index < output_length) {
        this.__lines[index].remove_indent();

        index++;
      }
    };

    Output.prototype.trim = function (eat_newlines) {
      eat_newlines = eat_newlines === undefined ? false : eat_newlines;
      this.current_line.trim(this.indent_string, this.baseIndentString);

      while (eat_newlines && this.__lines.length > 1 && this.current_line.is_empty()) {
        this.__lines.pop();

        this.current_line = this.__lines[this.__lines.length - 1];
        this.current_line.trim();
      }

      this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
    };

    Output.prototype.just_added_newline = function () {
      return this.current_line.is_empty();
    };

    Output.prototype.just_added_blankline = function () {
      return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
    };

    Output.prototype.ensure_empty_line_above = function (starts_with, ends_with) {
      var index = this.__lines.length - 2;

      while (index >= 0) {
        var potentialEmptyLine = this.__lines[index];

        if (potentialEmptyLine.is_empty()) {
          break;
        } else if (potentialEmptyLine.item(0).indexOf(starts_with) !== 0 && potentialEmptyLine.item(-1) !== ends_with) {
          this.__lines.splice(index + 1, 0, new OutputLine(this));

          this.previous_line = this.__lines[this.__lines.length - 2];
          break;
        }

        index--;
      }
    };

    module.exports.Output = Output;
    /***/
  },
  /* 3 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Token(type, text, newlines, whitespace_before) {
      this.type = type;
      this.text = text; // comments_before are
      // comments that have a new line before them
      // and may or may not have a newline after
      // this is a set of comments before

      this.comments_before = null;
      /* inline comment*/
      // this.comments_after =  new TokenStream(); // no new line before and newline after

      this.newlines = newlines || 0;
      this.whitespace_before = whitespace_before || '';
      this.parent = null;
      this.next = null;
      this.previous = null;
      this.opened = null;
      this.closed = null;
      this.directives = null;
    }

    module.exports.Token = Token;
    /***/
  },,,
  /* 4 */

  /* 5 */

  /* 6 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Options(options, merge_child_field) {
      this.raw_options = _mergeOpts(options, merge_child_field); // Support passing the source text back with no change

      this.disabled = this._get_boolean('disabled');
      this.eol = this._get_characters('eol', 'auto');
      this.end_with_newline = this._get_boolean('end_with_newline');
      this.indent_size = this._get_number('indent_size', 4);
      this.indent_char = this._get_characters('indent_char', ' ');
      this.indent_level = this._get_number('indent_level');
      this.preserve_newlines = this._get_boolean('preserve_newlines', true);
      this.max_preserve_newlines = this._get_number('max_preserve_newlines', 32786);

      if (!this.preserve_newlines) {
        this.max_preserve_newlines = 0;
      }

      this.indent_with_tabs = this._get_boolean('indent_with_tabs');

      if (this.indent_with_tabs) {
        this.indent_char = '\t';
        this.indent_size = 1;
      } // Backwards compat with 1.3.x


      this.wrap_line_length = this._get_number('wrap_line_length', this._get_number('max_char'));
    }

    Options.prototype._get_array = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || [];

      if (_typeof(option_value) === 'object') {
        if (option_value !== null && typeof option_value.concat === 'function') {
          result = option_value.concat();
        }
      } else if (typeof option_value === 'string') {
        result = option_value.split(/[^a-zA-Z0-9_\/\-]+/);
      }

      return result;
    };

    Options.prototype._get_boolean = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = option_value === undefined ? !!default_value : !!option_value;
      return result;
    };

    Options.prototype._get_characters = function (name, default_value) {
      var option_value = this.raw_options[name];
      var result = default_value || '';

      if (typeof option_value === 'string') {
        result = option_value.replace(/\\r/, '\r').replace(/\\n/, '\n').replace(/\\t/, '\t');
      }

      return result;
    };

    Options.prototype._get_number = function (name, default_value) {
      var option_value = this.raw_options[name];
      default_value = parseInt(default_value, 10);

      if (isNaN(default_value)) {
        default_value = 0;
      }

      var result = parseInt(option_value, 10);

      if (isNaN(result)) {
        result = default_value;
      }

      return result;
    };

    Options.prototype._get_selection = function (name, selection_list, default_value) {
      var result = this._get_selection_list(name, selection_list, default_value);

      if (result.length !== 1) {
        throw new Error("Invalid Option Value: The option '" + name + "' can only be one of the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result[0];
    };

    Options.prototype._get_selection_list = function (name, selection_list, default_value) {
      if (!selection_list || selection_list.length === 0) {
        throw new Error("Selection list cannot be empty.");
      }

      default_value = default_value || [selection_list[0]];

      if (!this._is_valid_selection(default_value, selection_list)) {
        throw new Error("Invalid Default Value!");
      }

      var result = this._get_array(name, default_value);

      if (!this._is_valid_selection(result, selection_list)) {
        throw new Error("Invalid Option Value: The option '" + name + "' can contain only the following values:\n" + selection_list + "\nYou passed in: '" + this.raw_options[name] + "'");
      }

      return result;
    };

    Options.prototype._is_valid_selection = function (result, selection_list) {
      return result.length && selection_list.length && !result.some(function (item) {
        return selection_list.indexOf(item) === -1;
      });
    }; // merges child options up with the parent options object
    // Example: obj = {a: 1, b: {a: 2}}
    //          mergeOpts(obj, 'b')
    //
    //          Returns: {a: 2}


    function _mergeOpts(allOptions, childFieldName) {
      var finalOpts = {};
      allOptions = _normalizeOpts(allOptions);
      var name;

      for (name in allOptions) {
        if (name !== childFieldName) {
          finalOpts[name] = allOptions[name];
        }
      } //merge in the per type settings for the childFieldName


      if (childFieldName && allOptions[childFieldName]) {
        for (name in allOptions[childFieldName]) {
          finalOpts[name] = allOptions[childFieldName][name];
        }
      }

      return finalOpts;
    }

    function _normalizeOpts(options) {
      var convertedOpts = {};
      var key;

      for (key in options) {
        var newKey = key.replace(/-/g, "_");
        convertedOpts[newKey] = options[key];
      }

      return convertedOpts;
    }

    module.exports.Options = Options;
    module.exports.normalizeOpts = _normalizeOpts;
    module.exports.mergeOpts = _mergeOpts;
    /***/
  },,
  /* 7 */

  /* 8 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function InputScanner(input_string) {
      this.__input = input_string || '';
      this.__input_length = this.__input.length;
      this.__position = 0;
    }

    InputScanner.prototype.restart = function () {
      this.__position = 0;
    };

    InputScanner.prototype.back = function () {
      if (this.__position > 0) {
        this.__position -= 1;
      }
    };

    InputScanner.prototype.hasNext = function () {
      return this.__position < this.__input_length;
    };

    InputScanner.prototype.next = function () {
      var val = null;

      if (this.hasNext()) {
        val = this.__input.charAt(this.__position);
        this.__position += 1;
      }

      return val;
    };

    InputScanner.prototype.peek = function (index) {
      var val = null;
      index = index || 0;
      index += this.__position;

      if (index >= 0 && index < this.__input_length) {
        val = this.__input.charAt(index);
      }

      return val;
    };

    InputScanner.prototype.test = function (pattern, index) {
      index = index || 0;
      index += this.__position;
      pattern.lastIndex = index;

      if (index >= 0 && index < this.__input_length) {
        var pattern_match = pattern.exec(this.__input);
        return pattern_match && pattern_match.index === index;
      } else {
        return false;
      }
    };

    InputScanner.prototype.testChar = function (pattern, index) {
      // test one character regex match
      var val = this.peek(index);
      return val !== null && pattern.test(val);
    };

    InputScanner.prototype.match = function (pattern) {
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match && pattern_match.index === this.__position) {
        this.__position += pattern_match[0].length;
      } else {
        pattern_match = null;
      }

      return pattern_match;
    };

    InputScanner.prototype.read = function (pattern) {
      var val = '';
      var match = this.match(pattern);

      if (match) {
        val = match[0];
      }

      return val;
    };

    InputScanner.prototype.readUntil = function (pattern, include_match) {
      var val = '';
      var match_index = this.__position;
      pattern.lastIndex = this.__position;
      var pattern_match = pattern.exec(this.__input);

      if (pattern_match) {
        if (include_match) {
          match_index = pattern_match.index + pattern_match[0].length;
        } else {
          match_index = pattern_match.index;
        }
      } else {
        match_index = this.__input_length;
      }

      val = this.__input.substring(this.__position, match_index);
      this.__position = match_index;
      return val;
    };

    InputScanner.prototype.readUntilAfter = function (pattern) {
      return this.readUntil(pattern, true);
    };
    /* css beautifier legacy helpers */


    InputScanner.prototype.peekUntilAfter = function (pattern) {
      var start = this.__position;
      var val = this.readUntilAfter(pattern);
      this.__position = start;
      return val;
    };

    InputScanner.prototype.lookBack = function (testVal) {
      var start = this.__position - 1;
      return start >= testVal.length && this.__input.substring(start - testVal.length, start).toLowerCase() === testVal;
    };

    module.exports.InputScanner = InputScanner;
    /***/
  },
  /* 9 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var InputScanner = __webpack_require__(8).InputScanner;

    var Token = __webpack_require__(3).Token;

    var TokenStream = __webpack_require__(10).TokenStream;

    var TOKEN = {
      START: 'TK_START',
      RAW: 'TK_RAW',
      EOF: 'TK_EOF'
    };

    var Tokenizer = function Tokenizer(input_string, options) {
      this._input = new InputScanner(input_string);
      this._options = options || {};
      this.__tokens = null;
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      this._whitespace_pattern = /[\n\r\t ]+/g;
      this._newline_pattern = /([^\n\r]*)(\r\n|[\n\r])?/g;
    };

    Tokenizer.prototype.tokenize = function () {
      this._input.restart();

      this.__tokens = new TokenStream();

      this._reset();

      var current;
      var previous = new Token(TOKEN.START, '');
      var open_token = null;
      var open_stack = [];
      var comments = new TokenStream();

      while (previous.type !== TOKEN.EOF) {
        current = this._get_next_token(previous, open_token);

        while (this._is_comment(current)) {
          comments.add(current);
          current = this._get_next_token(previous, open_token);
        }

        if (!comments.isEmpty()) {
          current.comments_before = comments;
          comments = new TokenStream();
        }

        current.parent = open_token;

        if (this._is_opening(current)) {
          open_stack.push(open_token);
          open_token = current;
        } else if (open_token && this._is_closing(current, open_token)) {
          current.opened = open_token;
          open_token.closed = current;
          open_token = open_stack.pop();
          current.parent = open_token;
        }

        current.previous = previous;
        previous.next = current;

        this.__tokens.add(current);

        previous = current;
      }

      return this.__tokens;
    };

    Tokenizer.prototype._is_first_token = function () {
      return this.__tokens.isEmpty();
    };

    Tokenizer.prototype._reset = function () {};

    Tokenizer.prototype._get_next_token = function (previous_token, open_token) {
      // jshint unused:false
      this._readWhitespace();

      var resulting_string = this._input.read(/.+/g);

      if (resulting_string) {
        return this._create_token(TOKEN.RAW, resulting_string);
      } else {
        return this._create_token(TOKEN.EOF, '');
      }
    };

    Tokenizer.prototype._is_comment = function (current_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._is_opening = function (current_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._is_closing = function (current_token, open_token) {
      // jshint unused:false
      return false;
    };

    Tokenizer.prototype._create_token = function (type, text) {
      var token = new Token(type, text, this.__newline_count, this.__whitespace_before_token);
      this.__newline_count = 0;
      this.__whitespace_before_token = '';
      return token;
    };

    Tokenizer.prototype._readWhitespace = function () {
      var resulting_string = this._input.read(this._whitespace_pattern);

      if (resulting_string === ' ') {
        this.__whitespace_before_token = resulting_string;
      } else if (resulting_string !== '') {
        this._newline_pattern.lastIndex = 0;

        var nextMatch = this._newline_pattern.exec(resulting_string);

        while (nextMatch[2]) {
          this.__newline_count += 1;
          nextMatch = this._newline_pattern.exec(resulting_string);
        }

        this.__whitespace_before_token = nextMatch[1];
      }
    };

    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
    /***/
  },
  /* 10 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function TokenStream(parent_token) {
      // private
      this.__tokens = [];
      this.__tokens_length = this.__tokens.length;
      this.__position = 0;
      this.__parent_token = parent_token;
    }

    TokenStream.prototype.restart = function () {
      this.__position = 0;
    };

    TokenStream.prototype.isEmpty = function () {
      return this.__tokens_length === 0;
    };

    TokenStream.prototype.hasNext = function () {
      return this.__position < this.__tokens_length;
    };

    TokenStream.prototype.next = function () {
      var val = null;

      if (this.hasNext()) {
        val = this.__tokens[this.__position];
        this.__position += 1;
      }

      return val;
    };

    TokenStream.prototype.peek = function (index) {
      var val = null;
      index = index || 0;
      index += this.__position;

      if (index >= 0 && index < this.__tokens_length) {
        val = this.__tokens[index];
      }

      return val;
    };

    TokenStream.prototype.add = function (token) {
      if (this.__parent_token) {
        token.parent = this.__parent_token;
      }

      this.__tokens.push(token);

      this.__tokens_length += 1;
    };

    module.exports.TokenStream = TokenStream;
    /***/
  },
  /* 11 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    function Directives(start_block_pattern, end_block_pattern) {
      start_block_pattern = typeof start_block_pattern === 'string' ? start_block_pattern : start_block_pattern.source;
      end_block_pattern = typeof end_block_pattern === 'string' ? end_block_pattern : end_block_pattern.source;
      this.__directives_block_pattern = new RegExp(start_block_pattern + / beautify( \w+[:]\w+)+ /.source + end_block_pattern, 'g');
      this.__directive_pattern = / (\w+)[:](\w+)/g;
      this.__directives_end_ignore_pattern = new RegExp('(?:[\\s\\S]*?)((?:' + start_block_pattern + /\sbeautify\signore:end\s/.source + end_block_pattern + ')|$)', 'g');
    }

    Directives.prototype.get_directives = function (text) {
      if (!text.match(this.__directives_block_pattern)) {
        return null;
      }

      var directives = {};
      this.__directive_pattern.lastIndex = 0;

      var directive_match = this.__directive_pattern.exec(text);

      while (directive_match) {
        directives[directive_match[1]] = directive_match[2];
        directive_match = this.__directive_pattern.exec(text);
      }

      return directives;
    };

    Directives.prototype.readIgnored = function (input) {
      return input.read(this.__directives_end_ignore_pattern);
    };

    module.exports.Directives = Directives;
    /***/
  },,,,
  /* 12 */

  /* 13 */

  /* 14 */

  /* 15 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Beautifier = __webpack_require__(16).Beautifier,
        Options = __webpack_require__(17).Options;

    function style_html(html_source, options, js_beautify, css_beautify) {
      var beautifier = new Beautifier(html_source, options, js_beautify, css_beautify);
      return beautifier.beautify();
    }

    module.exports = style_html;

    module.exports.defaultOptions = function () {
      return new Options();
    };
    /***/

  },
  /* 16 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var Options = __webpack_require__(17).Options;

    var Output = __webpack_require__(2).Output;

    var Tokenizer = __webpack_require__(18).Tokenizer;

    var TOKEN = __webpack_require__(18).TOKEN;

    var lineBreak = /\r\n|[\r\n]/;
    var allLineBreaks = /\r\n|[\r\n]/g;

    var Printer = function Printer(options, base_indent_string) {
      //handles input/output and some other printing functions
      this.indent_level = 0;
      this.alignment_size = 0;
      this.wrap_line_length = options.wrap_line_length;
      this.max_preserve_newlines = options.max_preserve_newlines;
      this.preserve_newlines = options.preserve_newlines;
      this._output = new Output(options, base_indent_string);
    };

    Printer.prototype.current_line_has_match = function (pattern) {
      return this._output.current_line.has_match(pattern);
    };

    Printer.prototype.set_space_before_token = function (value) {
      this._output.space_before_token = value;
    };

    Printer.prototype.add_raw_token = function (token) {
      this._output.add_raw_token(token);
    };

    Printer.prototype.print_preserved_newlines = function (raw_token) {
      var newlines = 0;

      if (raw_token.type !== TOKEN.TEXT && raw_token.previous.type !== TOKEN.TEXT) {
        newlines = raw_token.newlines ? 1 : 0;
      }

      if (this.preserve_newlines) {
        newlines = raw_token.newlines < this.max_preserve_newlines + 1 ? raw_token.newlines : this.max_preserve_newlines + 1;
      }

      for (var n = 0; n < newlines; n++) {
        this.print_newline(n > 0);
      }

      return newlines !== 0;
    };

    Printer.prototype.traverse_whitespace = function (raw_token) {
      if (raw_token.whitespace_before || raw_token.newlines) {
        if (!this.print_preserved_newlines(raw_token)) {
          this._output.space_before_token = true;
          this.print_space_or_wrap(raw_token.text);
        }

        return true;
      }

      return false;
    }; // Append a space to the given content (string array) or, if we are
    // at the wrap_line_length, append a newline/indentation.
    // return true if a newline was added, false if a space was added


    Printer.prototype.print_space_or_wrap = function (text) {
      if (this.wrap_line_length) {
        if (this._output.current_line.get_character_count() + text.length + 1 >= this.wrap_line_length) {
          //insert a line when the wrap_line_length is reached
          return this._output.add_new_line();
        }
      }

      return false;
    };

    Printer.prototype.print_newline = function (force) {
      this._output.add_new_line(force);
    };

    Printer.prototype.print_token = function (text) {
      if (text) {
        if (this._output.current_line.is_empty()) {
          this._output.set_indent(this.indent_level, this.alignment_size);
        }

        this._output.add_token(text);
      }
    };

    Printer.prototype.print_raw_text = function (text) {
      this._output.current_line.push_raw(text);
    };

    Printer.prototype.indent = function () {
      this.indent_level++;
    };

    Printer.prototype.unindent = function () {
      if (this.indent_level > 0) {
        this.indent_level--;
      }
    };

    Printer.prototype.get_full_indent = function (level) {
      level = this.indent_level + (level || 0);

      if (level < 1) {
        return '';
      }

      return this._output.get_indent_string(level);
    };

    var uses_beautifier = function uses_beautifier(tag_check, start_token) {
      var raw_token = start_token.next;

      if (!start_token.closed) {
        return false;
      }

      while (raw_token.type !== TOKEN.EOF && raw_token.closed !== start_token) {
        if (raw_token.type === TOKEN.ATTRIBUTE && raw_token.text === 'type') {
          // For script and style tags that have a type attribute, only enable custom beautifiers for matching values
          var peekEquals = raw_token.next ? raw_token.next : raw_token;
          var peekValue = peekEquals.next ? peekEquals.next : peekEquals;

          if (peekEquals.type === TOKEN.EQUALS && peekValue.type === TOKEN.VALUE) {
            return tag_check === 'style' && peekValue.text.search('text/css') > -1 || tag_check === 'script' && peekValue.text.search(/(text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect)/) > -1;
          }

          return false;
        }

        raw_token = raw_token.next;
      }

      return true;
    };

    function in_array(what, arr) {
      return arr.indexOf(what) !== -1;
    }

    function TagFrame(parent, parser_token, indent_level) {
      this.parent = parent || null;
      this.tag = parser_token ? parser_token.tag_name : '';
      this.indent_level = indent_level || 0;
      this.parser_token = parser_token || null;
    }

    function TagStack(printer) {
      this._printer = printer;
      this._current_frame = null;
    }

    TagStack.prototype.get_parser_token = function () {
      return this._current_frame ? this._current_frame.parser_token : null;
    };

    TagStack.prototype.record_tag = function (parser_token) {
      //function to record a tag and its parent in this.tags Object
      var new_frame = new TagFrame(this._current_frame, parser_token, this._printer.indent_level);
      this._current_frame = new_frame;
    };

    TagStack.prototype._try_pop_frame = function (frame) {
      //function to retrieve the opening tag to the corresponding closer
      var parser_token = null;

      if (frame) {
        parser_token = frame.parser_token;
        this._printer.indent_level = frame.indent_level;
        this._current_frame = frame.parent;
      }

      return parser_token;
    };

    TagStack.prototype._get_frame = function (tag_list, stop_list) {
      //function to retrieve the opening tag to the corresponding closer
      var frame = this._current_frame;

      while (frame) {
        //till we reach '' (the initial value);
        if (tag_list.indexOf(frame.tag) !== -1) {
          //if this is it use it
          break;
        } else if (stop_list && stop_list.indexOf(frame.tag) !== -1) {
          frame = null;
          break;
        }

        frame = frame.parent;
      }

      return frame;
    };

    TagStack.prototype.try_pop = function (tag, stop_list) {
      //function to retrieve the opening tag to the corresponding closer
      var frame = this._get_frame([tag], stop_list);

      return this._try_pop_frame(frame);
    };

    TagStack.prototype.indent_to_tag = function (tag_list) {
      var frame = this._get_frame(tag_list);

      if (frame) {
        this._printer.indent_level = frame.indent_level;
      }
    };

    function Beautifier(source_text, options, js_beautify, css_beautify) {
      //Wrapper function to invoke all the necessary constructors and deal with the output.
      this._source_text = source_text || '';
      options = options || {};
      this._js_beautify = js_beautify;
      this._css_beautify = css_beautify;
      this._tag_stack = null; // Allow the setting of language/file-type specific options
      // with inheritance of overall settings

      var optionHtml = new Options(options, 'html');
      this._options = optionHtml;
      this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 'force'.length) === 'force';
      this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === 'force-expand-multiline';
      this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === 'force-aligned';
      this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === 'aligned-multiple';
      this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, 'preserve'.length) === 'preserve';
      this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === 'preserve-aligned';
    }

    Beautifier.prototype.beautify = function () {
      // if disabled, return the input unchanged.
      if (this._options.disabled) {
        return this._source_text;
      }

      var source_text = this._source_text;
      var eol = this._options.eol;

      if (this._options.eol === 'auto') {
        eol = '\n';

        if (source_text && lineBreak.test(source_text)) {
          eol = source_text.match(lineBreak)[0];
        }
      } // HACK: newline parsing inconsistent. This brute force normalizes the input.


      source_text = source_text.replace(allLineBreaks, '\n');
      var baseIndentString = ''; // Including commented out text would change existing html beautifier behavior to autodetect base indent.
      // baseIndentString = source_text.match(/^[\t ]*/)[0];

      var last_token = {
        text: '',
        type: ''
      };
      var last_tag_token = new TagOpenParserToken();
      var printer = new Printer(this._options, baseIndentString);
      var tokens = new Tokenizer(source_text, this._options).tokenize();
      this._tag_stack = new TagStack(printer);
      var parser_token = null;
      var raw_token = tokens.next();

      while (raw_token.type !== TOKEN.EOF) {
        if (raw_token.type === TOKEN.TAG_OPEN || raw_token.type === TOKEN.COMMENT) {
          parser_token = this._handle_tag_open(printer, raw_token, last_tag_token, last_token);
          last_tag_token = parser_token;
        } else if (raw_token.type === TOKEN.ATTRIBUTE || raw_token.type === TOKEN.EQUALS || raw_token.type === TOKEN.VALUE || raw_token.type === TOKEN.TEXT && !last_tag_token.tag_complete) {
          parser_token = this._handle_inside_tag(printer, raw_token, last_tag_token, tokens);
        } else if (raw_token.type === TOKEN.TAG_CLOSE) {
          parser_token = this._handle_tag_close(printer, raw_token, last_tag_token);
        } else if (raw_token.type === TOKEN.TEXT) {
          parser_token = this._handle_text(printer, raw_token, last_tag_token);
        } else {
          // This should never happen, but if it does. Print the raw token
          printer.add_raw_token(raw_token);
        }

        last_token = parser_token;
        raw_token = tokens.next();
      }

      var sweet_code = printer._output.get_code(eol);

      return sweet_code;
    };

    Beautifier.prototype._handle_tag_close = function (printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.alignment_size = 0;
      last_tag_token.tag_complete = true;
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');

      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        if (last_tag_token.tag_start_char === '<') {
          printer.set_space_before_token(raw_token.text[0] === '/'); // space before />, no space before >

          if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.has_wrapped_attrs) {
            printer.print_newline(false);
          }
        }

        printer.print_token(raw_token.text);
      }

      if (last_tag_token.indent_content && !(last_tag_token.is_unformatted || last_tag_token.is_content_unformatted)) {
        printer.indent(); // only indent once per opened tag

        last_tag_token.indent_content = false;
      }

      return parser_token;
    };

    Beautifier.prototype._handle_inside_tag = function (printer, raw_token, last_tag_token, tokens) {
      var parser_token = {
        text: raw_token.text,
        type: raw_token.type
      };
      printer.set_space_before_token(raw_token.newlines || raw_token.whitespace_before !== '');

      if (last_tag_token.is_unformatted) {
        printer.add_raw_token(raw_token);
      } else if (last_tag_token.tag_start_char === '{' && raw_token.type === TOKEN.TEXT) {
        // For the insides of handlebars allow newlines or a single space between open and contents
        if (printer.print_preserved_newlines(raw_token)) {
          printer.print_raw_text(raw_token.whitespace_before + raw_token.text);
        } else {
          printer.print_token(raw_token.text);
        }
      } else {
        if (raw_token.type === TOKEN.ATTRIBUTE) {
          printer.set_space_before_token(true);
          last_tag_token.attr_count += 1;
        } else if (raw_token.type === TOKEN.EQUALS) {
          //no space before =
          printer.set_space_before_token(false);
        } else if (raw_token.type === TOKEN.VALUE && raw_token.previous.type === TOKEN.EQUALS) {
          //no space before value
          printer.set_space_before_token(false);
        }

        if (printer._output.space_before_token && last_tag_token.tag_start_char === '<') {
          // Allow the current attribute to wrap
          // Set wrapped to true if the line is wrapped
          var wrapped = printer.print_space_or_wrap(raw_token.text);

          if (raw_token.type === TOKEN.ATTRIBUTE) {
            if (this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) {
              printer.traverse_whitespace(raw_token);
              wrapped = wrapped || raw_token.newlines !== 0;
            } // Save whether we have wrapped any attributes


            last_tag_token.has_wrapped_attrs = last_tag_token.has_wrapped_attrs || wrapped;

            if (this._is_wrap_attributes_force) {
              var force_attr_wrap = last_tag_token.attr_count > 1;

              if (this._is_wrap_attributes_force_expand_multiline && last_tag_token.attr_count === 1) {
                var is_only_attribute = true;
                var peek_index = 0;
                var peek_token;

                do {
                  peek_token = tokens.peek(peek_index);

                  if (peek_token.type === TOKEN.ATTRIBUTE) {
                    is_only_attribute = false;
                    break;
                  }

                  peek_index += 1;
                } while (peek_index < 4 && peek_token.type !== TOKEN.EOF && peek_token.type !== TOKEN.TAG_CLOSE);

                force_attr_wrap = !is_only_attribute;
              }

              if (force_attr_wrap) {
                printer.print_newline(false);
                last_tag_token.has_wrapped_attrs = true;
              }
            }
          }
        }

        printer.print_token(raw_token.text);
      }

      return parser_token;
    };

    Beautifier.prototype._handle_text = function (printer, raw_token, last_tag_token) {
      var parser_token = {
        text: raw_token.text,
        type: 'TK_CONTENT'
      };

      if (last_tag_token.custom_beautifier) {
        //check if we need to format javascript
        this._print_custom_beatifier_text(printer, raw_token, last_tag_token);
      } else if (last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) {
        printer.add_raw_token(raw_token);
      } else {
        printer.traverse_whitespace(raw_token);
        printer.print_token(raw_token.text);
      }

      return parser_token;
    };

    Beautifier.prototype._print_custom_beatifier_text = function (printer, raw_token, last_tag_token) {
      if (raw_token.text !== '') {
        printer.print_newline(false);

        var text = raw_token.text,
            _beautifier,
            script_indent_level = 1;

        if (last_tag_token.tag_name === 'script') {
          _beautifier = typeof this._js_beautify === 'function' && this._js_beautify;
        } else if (last_tag_token.tag_name === 'style') {
          _beautifier = typeof this._css_beautify === 'function' && this._css_beautify;
        }

        if (this._options.indent_scripts === "keep") {
          script_indent_level = 0;
        } else if (this._options.indent_scripts === "separate") {
          script_indent_level = -printer.indent_level;
        }

        var indentation = printer.get_full_indent(script_indent_level); // if there is at least one empty line at the end of this text, strip it
        // we'll be adding one back after the text but before the containing tag.

        text = text.replace(/\n[ \t]*$/, '');

        if (_beautifier) {
          // call the Beautifier if avaliable
          var Child_options = function Child_options() {
            this.eol = '\n';
          };

          Child_options.prototype = this._options.raw_options;
          var child_options = new Child_options();
          text = _beautifier(indentation + text, child_options);
        } else {
          // simply indent the string otherwise
          var white = text.match(/^\s*/)[0];

          var _level = white.match(/[^\n\r]*$/)[0].split(this._options.indent_string).length - 1;

          var reindent = this._get_full_indent(script_indent_level - _level);

          text = (indentation + text.trim()).replace(/\r\n|\r|\n/g, '\n' + reindent);
        }

        if (text) {
          printer.print_raw_text(text);
          printer.print_newline(true);
        }
      }
    };

    Beautifier.prototype._handle_tag_open = function (printer, raw_token, last_tag_token, last_token) {
      var parser_token = this._get_tag_open_token(raw_token);

      if ((last_tag_token.is_unformatted || last_tag_token.is_content_unformatted) && raw_token.type === TOKEN.TAG_OPEN && raw_token.text.indexOf('</') === 0) {
        // End element tags for unformatted or content_unformatted elements
        // are printed raw to keep any newlines inside them exactly the same.
        printer.add_raw_token(raw_token);
      } else {
        printer.traverse_whitespace(raw_token);

        this._set_tag_position(printer, raw_token, parser_token, last_tag_token, last_token);

        printer.print_token(raw_token.text);
      } //indent attributes an auto, forced, aligned or forced-align line-wrap


      if (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) {
        parser_token.alignment_size = raw_token.text.length + 1;
      }

      if (!parser_token.tag_complete && !parser_token.is_unformatted) {
        printer.alignment_size = parser_token.alignment_size;
      }

      return parser_token;
    };

    var TagOpenParserToken = function TagOpenParserToken(parent, raw_token) {
      this.parent = parent || null;
      this.text = '';
      this.type = 'TK_TAG_OPEN';
      this.tag_name = '';
      this.is_inline_element = false;
      this.is_unformatted = false;
      this.is_content_unformatted = false;
      this.is_empty_element = false;
      this.is_start_tag = false;
      this.is_end_tag = false;
      this.indent_content = false;
      this.multiline_content = false;
      this.custom_beautifier = false;
      this.start_tag_token = null;
      this.attr_count = 0;
      this.has_wrapped_attrs = false;
      this.alignment_size = 0;
      this.tag_complete = false;
      this.tag_start_char = '';
      this.tag_check = '';

      if (!raw_token) {
        this.tag_complete = true;
      } else {
        var tag_check_match;
        this.tag_start_char = raw_token.text[0];
        this.text = raw_token.text;

        if (this.tag_start_char === '<') {
          tag_check_match = raw_token.text.match(/^<([^\s>]*)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : '';
        } else {
          tag_check_match = raw_token.text.match(/^{{\#?([^\s}]+)/);
          this.tag_check = tag_check_match ? tag_check_match[1] : '';
        }

        this.tag_check = this.tag_check.toLowerCase();

        if (raw_token.type === TOKEN.COMMENT) {
          this.tag_complete = true;
        }

        this.is_start_tag = this.tag_check.charAt(0) !== '/';
        this.tag_name = !this.is_start_tag ? this.tag_check.substr(1) : this.tag_check;
        this.is_end_tag = !this.is_start_tag || raw_token.closed && raw_token.closed.text === '/>'; // handlebars tags that don't start with # or ^ are single_tags, and so also start and end.

        this.is_end_tag = this.is_end_tag || this.tag_start_char === '{' && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(2)));
      }
    };

    Beautifier.prototype._get_tag_open_token = function (raw_token) {
      //function to get a full tag and parse its type
      var parser_token = new TagOpenParserToken(this._tag_stack.get_parser_token(), raw_token);
      parser_token.alignment_size = this._options.wrap_attributes_indent_size;
      parser_token.is_end_tag = parser_token.is_end_tag || in_array(parser_token.tag_check, this._options.void_elements);
      parser_token.is_empty_element = parser_token.tag_complete || parser_token.is_start_tag && parser_token.is_end_tag;
      parser_token.is_unformatted = !parser_token.tag_complete && in_array(parser_token.tag_check, this._options.unformatted);
      parser_token.is_content_unformatted = !parser_token.is_empty_element && in_array(parser_token.tag_check, this._options.content_unformatted);
      parser_token.is_inline_element = in_array(parser_token.tag_name, this._options.inline) || parser_token.tag_start_char === '{';
      return parser_token;
    };

    Beautifier.prototype._set_tag_position = function (printer, raw_token, parser_token, last_tag_token, last_token) {
      if (!parser_token.is_empty_element) {
        if (parser_token.is_end_tag) {
          //this tag is a double tag so check for tag-ending
          parser_token.start_tag_token = this._tag_stack.try_pop(parser_token.tag_name); //remove it and all ancestors
        } else {
          // it's a start-tag
          // check if this tag is starting an element that has optional end element
          // and do an ending needed
          this._do_optional_end_element(parser_token);

          this._tag_stack.record_tag(parser_token); //push it on the tag stack


          if ((parser_token.tag_name === 'script' || parser_token.tag_name === 'style') && !(parser_token.is_unformatted || parser_token.is_content_unformatted)) {
            parser_token.custom_beautifier = uses_beautifier(parser_token.tag_check, raw_token);
          }
        }
      }

      if (in_array(parser_token.tag_check, this._options.extra_liners)) {
        //check if this double needs an extra line
        printer.print_newline(false);

        if (!printer._output.just_added_blankline()) {
          printer.print_newline(true);
        }
      }

      if (parser_token.is_empty_element) {
        //if this tag name is a single tag type (either in the list or has a closing /)
        // if you hit an else case, reset the indent level if you are inside an:
        // 'if', 'unless', or 'each' block.
        if (parser_token.tag_start_char === '{' && parser_token.tag_check === 'else') {
          this._tag_stack.indent_to_tag(['if', 'unless', 'each']);

          parser_token.indent_content = true; // Don't add a newline if opening {{#if}} tag is on the current line

          var foundIfOnCurrentLine = printer.current_line_has_match(/{{#if/);

          if (!foundIfOnCurrentLine) {
            printer.print_newline(false);
          }
        } // Don't add a newline before elements that should remain where they are.


        if (parser_token.tag_name === '!--' && last_token.type === TOKEN.TAG_CLOSE && last_tag_token.is_end_tag && parser_token.text.indexOf('\n') === -1) {//Do nothing. Leave comments on same line.
        } else if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
          printer.print_newline(false);
        }
      } else if (parser_token.is_unformatted || parser_token.is_content_unformatted) {
        if (!parser_token.is_inline_element && !parser_token.is_unformatted) {
          printer.print_newline(false);
        }
      } else if (parser_token.is_end_tag) {
        //this tag is a double tag so check for tag-ending
        if (parser_token.start_tag_token && parser_token.start_tag_token.multiline_content || !(parser_token.is_inline_element || last_tag_token.is_inline_element || last_token.type === TOKEN.TAG_CLOSE && parser_token.start_tag_token === last_tag_token || last_token.type === 'TK_CONTENT')) {
          printer.print_newline(false);
        }
      } else {
        // it's a start-tag
        parser_token.indent_content = !parser_token.custom_beautifier;

        if (parser_token.tag_start_char === '<') {
          if (parser_token.tag_name === 'html') {
            parser_token.indent_content = this._options.indent_inner_html;
          } else if (parser_token.tag_name === 'head') {
            parser_token.indent_content = this._options.indent_head_inner_html;
          } else if (parser_token.tag_name === 'body') {
            parser_token.indent_content = this._options.indent_body_inner_html;
          }
        }

        if (!parser_token.is_inline_element && last_token.type !== 'TK_CONTENT') {
          if (parser_token.parent) {
            parser_token.parent.multiline_content = true;
          }

          printer.print_newline(false);
        }
      }
    }; //To be used for <p> tag special case:
    //var p_closers = ['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'];


    Beautifier.prototype._do_optional_end_element = function (parser_token) {
      // NOTE: cases of "if there is no more content in the parent element"
      // are handled automatically by the beautifier.
      // It assumes parent or ancestor close tag closes all children.
      // https://www.w3.org/TR/html5/syntax.html#optional-tags
      if (parser_token.is_empty_element || !parser_token.is_start_tag || !parser_token.parent) {
        return;
      } else if (parser_token.tag_name === 'body') {
        // A head element’s end tag may be omitted if the head element is not immediately followed by a space character or a comment.
        this._tag_stack.try_pop('head'); //} else if (parser_token.tag_name === 'body') {
        // DONE: A body element’s end tag may be omitted if the body element is not immediately followed by a comment.

      } else if (parser_token.tag_name === 'li') {
        // An li element’s end tag may be omitted if the li element is immediately followed by another li element or if there is no more content in the parent element.
        this._tag_stack.try_pop('li', ['ol', 'ul']);
      } else if (parser_token.tag_name === 'dd' || parser_token.tag_name === 'dt') {
        // A dd element’s end tag may be omitted if the dd element is immediately followed by another dd element or a dt element, or if there is no more content in the parent element.
        // A dt element’s end tag may be omitted if the dt element is immediately followed by another dt element or a dd element.
        this._tag_stack.try_pop('dt', ['dl']);

        this._tag_stack.try_pop('dd', ['dl']); //} else if (p_closers.indexOf(parser_token.tag_name) !== -1) {
        //TODO: THIS IS A BUG FARM. We are not putting this into 1.8.0 as it is likely to blow up.
        //A p element’s end tag may be omitted if the p element is immediately followed by an address, article, aside, blockquote, details, div, dl, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hr, main, nav, ol, p, pre, section, table, or ul element, or if there is no more content in the parent element and the parent element is an HTML element that is not an a, audio, del, ins, map, noscript, or video element, or an autonomous custom element.
        //this._tag_stack.try_pop('p', ['body']);

      } else if (parser_token.tag_name === 'rp' || parser_token.tag_name === 'rt') {
        // An rt element’s end tag may be omitted if the rt element is immediately followed by an rt or rp element, or if there is no more content in the parent element.
        // An rp element’s end tag may be omitted if the rp element is immediately followed by an rt or rp element, or if there is no more content in the parent element.
        this._tag_stack.try_pop('rt', ['ruby', 'rtc']);

        this._tag_stack.try_pop('rp', ['ruby', 'rtc']);
      } else if (parser_token.tag_name === 'optgroup') {
        // An optgroup element’s end tag may be omitted if the optgroup element is immediately followed by another optgroup element, or if there is no more content in the parent element.
        // An option element’s end tag may be omitted if the option element is immediately followed by another option element, or if it is immediately followed by an optgroup element, or if there is no more content in the parent element.
        this._tag_stack.try_pop('optgroup', ['select']); //this._tag_stack.try_pop('option', ['select']);

      } else if (parser_token.tag_name === 'option') {
        // An option element’s end tag may be omitted if the option element is immediately followed by another option element, or if it is immediately followed by an optgroup element, or if there is no more content in the parent element.
        this._tag_stack.try_pop('option', ['select', 'datalist', 'optgroup']);
      } else if (parser_token.tag_name === 'colgroup') {
        // DONE: A colgroup element’s end tag may be omitted if the colgroup element is not immediately followed by a space character or a comment.
        // A caption element's end tag may be ommitted if a colgroup, thead, tfoot, tbody, or tr element is started.
        this._tag_stack.try_pop('caption', ['table']);
      } else if (parser_token.tag_name === 'thead') {
        // A colgroup element's end tag may be ommitted if a thead, tfoot, tbody, or tr element is started.
        // A caption element's end tag may be ommitted if a colgroup, thead, tfoot, tbody, or tr element is started.
        this._tag_stack.try_pop('caption', ['table']);

        this._tag_stack.try_pop('colgroup', ['table']); //} else if (parser_token.tag_name === 'caption') {
        // DONE: A caption element’s end tag may be omitted if the caption element is not immediately followed by a space character or a comment.

      } else if (parser_token.tag_name === 'tbody' || parser_token.tag_name === 'tfoot') {
        // A thead element’s end tag may be omitted if the thead element is immediately followed by a tbody or tfoot element.
        // A tbody element’s end tag may be omitted if the tbody element is immediately followed by a tbody or tfoot element, or if there is no more content in the parent element.
        // A colgroup element's end tag may be ommitted if a thead, tfoot, tbody, or tr element is started.
        // A caption element's end tag may be ommitted if a colgroup, thead, tfoot, tbody, or tr element is started.
        this._tag_stack.try_pop('caption', ['table']);

        this._tag_stack.try_pop('colgroup', ['table']);

        this._tag_stack.try_pop('thead', ['table']);

        this._tag_stack.try_pop('tbody', ['table']); //} else if (parser_token.tag_name === 'tfoot') {
        // DONE: A tfoot element’s end tag may be omitted if there is no more content in the parent element.

      } else if (parser_token.tag_name === 'tr') {
        // A tr element’s end tag may be omitted if the tr element is immediately followed by another tr element, or if there is no more content in the parent element.
        // A colgroup element's end tag may be ommitted if a thead, tfoot, tbody, or tr element is started.
        // A caption element's end tag may be ommitted if a colgroup, thead, tfoot, tbody, or tr element is started.
        this._tag_stack.try_pop('caption', ['table']);

        this._tag_stack.try_pop('colgroup', ['table']);

        this._tag_stack.try_pop('tr', ['table', 'thead', 'tbody', 'tfoot']);
      } else if (parser_token.tag_name === 'th' || parser_token.tag_name === 'td') {
        // A td element’s end tag may be omitted if the td element is immediately followed by a td or th element, or if there is no more content in the parent element.
        // A th element’s end tag may be omitted if the th element is immediately followed by a td or th element, or if there is no more content in the parent element.
        this._tag_stack.try_pop('td', ['tr']);

        this._tag_stack.try_pop('th', ['tr']);
      } // Start element omission not handled currently
      // A head element’s start tag may be omitted if the element is empty, or if the first thing inside the head element is an element.
      // A tbody element’s start tag may be omitted if the first thing inside the tbody element is a tr element, and if the element is not immediately preceded by a tbody, thead, or tfoot element whose end tag has been omitted. (It can’t be omitted if the element is empty.)
      // A colgroup element’s start tag may be omitted if the first thing inside the colgroup element is a col element, and if the element is not immediately preceded by another colgroup element whose end tag has been omitted. (It can’t be omitted if the element is empty.)
      // Fix up the parent of the parser token


      parser_token.parent = this._tag_stack.get_parser_token();
    };

    module.exports.Beautifier = Beautifier;
    /***/
  },
  /* 17 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var BaseOptions = __webpack_require__(6).Options;

    function Options(options) {
      BaseOptions.call(this, options, 'html');
      this.indent_inner_html = this._get_boolean('indent_inner_html');
      this.indent_body_inner_html = this._get_boolean('indent_body_inner_html', true);
      this.indent_head_inner_html = this._get_boolean('indent_head_inner_html', true);
      this.indent_handlebars = this._get_boolean('indent_handlebars', true);
      this.wrap_attributes = this._get_selection('wrap_attributes', ['auto', 'force', 'force-aligned', 'force-expand-multiline', 'aligned-multiple', 'preserve', 'preserve-aligned']);
      this.wrap_attributes_indent_size = this._get_number('wrap_attributes_indent_size', this.indent_size);
      this.extra_liners = this._get_array('extra_liners', ['head', 'body', '/html']);
      this.inline = this._get_array('inline', [// https://www.w3.org/TR/html5/dom.html#phrasing-content
      'a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp',
      /* 'script', */
      'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', // prexisting - not sure of full effect of removing, leaving in
      'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt']);
      this.void_elements = this._get_array('void_elements', [// HTLM void elements - aka self-closing tags - aka singletons
      // https://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr', // NOTE: Optional tags are too complex for a simple list
      // they are hard coded in _do_optional_end_element
      // Doctype and xml elements
      '!doctype', '?xml', // ?php and ?= tags
      '?php', '?=', // other tags that were in this list, keeping just in case
      'basefont', 'isindex']);
      this.unformatted = this._get_array('unformatted', []);
      this.content_unformatted = this._get_array('content_unformatted', ['pre', 'textarea']);
      this.indent_scripts = this._get_selection('indent_scripts', ['normal', 'keep', 'separate']);
    }

    Options.prototype = new BaseOptions();
    module.exports.Options = Options;
    /***/
  },
  /* 18 */

  /***/
  function (module, exports, __webpack_require__) {
    "use strict";
    /*jshint node:true */

    /*
    
      The MIT License (MIT)
    
      Copyright (c) 2007-2018 Einar Lielmanis, Liam Newman, and contributors.
    
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

    var BaseTokenizer = __webpack_require__(9).Tokenizer;

    var BASETOKEN = __webpack_require__(9).TOKEN;

    var Directives = __webpack_require__(11).Directives;

    var TOKEN = {
      TAG_OPEN: 'TK_TAG_OPEN',
      TAG_CLOSE: 'TK_TAG_CLOSE',
      ATTRIBUTE: 'TK_ATTRIBUTE',
      EQUALS: 'TK_EQUALS',
      VALUE: 'TK_VALUE',
      COMMENT: 'TK_COMMENT',
      TEXT: 'TK_TEXT',
      UNKNOWN: 'TK_UNKNOWN',
      START: BASETOKEN.START,
      RAW: BASETOKEN.RAW,
      EOF: BASETOKEN.EOF
    };
    var directives_core = new Directives(/<\!--/, /-->/);

    var Tokenizer = function Tokenizer(input_string, options) {
      BaseTokenizer.call(this, input_string, options);
      this._current_tag_name = ''; // Words end at whitespace or when a tag starts
      // if we are indenting handlebars, they are considered tags

      this._word_pattern = this._options.indent_handlebars ? /[\n\r\t <]|{{/g : /[\n\r\t <]/g;
    };

    Tokenizer.prototype = new BaseTokenizer();

    Tokenizer.prototype._is_comment = function (current_token) {
      // jshint unused:false
      return false; //current_token.type === TOKEN.COMMENT || current_token.type === TOKEN.UNKNOWN;
    };

    Tokenizer.prototype._is_opening = function (current_token) {
      return current_token.type === TOKEN.TAG_OPEN;
    };

    Tokenizer.prototype._is_closing = function (current_token, open_token) {
      return current_token.type === TOKEN.TAG_CLOSE && open_token && ((current_token.text === '>' || current_token.text === '/>') && open_token.text[0] === '<' || current_token.text === '}}' && open_token.text[0] === '{' && open_token.text[1] === '{');
    };

    Tokenizer.prototype._reset = function () {
      this._current_tag_name = '';
    };

    Tokenizer.prototype._get_next_token = function (previous_token, open_token) {
      // jshint unused:false
      this._readWhitespace();

      var token = null;

      var c = this._input.peek();

      if (c === null) {
        return this._create_token(TOKEN.EOF, '');
      }

      token = token || this._read_attribute(c, previous_token, open_token);
      token = token || this._read_raw_content(previous_token, open_token);
      token = token || this._read_comment(c);
      token = token || this._read_open(c, open_token);
      token = token || this._read_close(c, open_token);
      token = token || this._read_content_word();
      token = token || this._create_token(TOKEN.UNKNOWN, this._input.next());
      return token;
    };

    Tokenizer.prototype._read_comment = function (c) {
      // jshint unused:false
      var token = null;

      if (c === '<' || c === '{') {
        var peek1 = this._input.peek(1);

        var peek2 = this._input.peek(2);

        if (c === '<' && (peek1 === '!' || peek1 === '?' || peek1 === '%') || this._options.indent_handlebars && c === '{' && peek1 === '{' && peek2 === '!') {
          //if we're in a comment, do something special
          // We treat all comments as literals, even more than preformatted tags
          // we just look for the appropriate close tag
          // this is will have very poor perf, but will work for now.
          var comment = '',
              delimiter = '>',
              matched = false;

          var input_char = this._input.next();

          while (input_char) {
            comment += input_char; // only need to check for the delimiter if the last chars match

            if (comment.charAt(comment.length - 1) === delimiter.charAt(delimiter.length - 1) && comment.indexOf(delimiter) !== -1) {
              break;
            } // only need to search for custom delimiter for the first few characters


            if (!matched) {
              matched = comment.length > 10;

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

            input_char = this._input.next();
          }

          var directives = directives_core.get_directives(comment);

          if (directives && directives.ignore === 'start') {
            comment += directives_core.readIgnored(this._input);
          }

          token = this._create_token(TOKEN.COMMENT, comment);
          token.directives = directives;
        }
      }

      return token;
    };

    Tokenizer.prototype._read_open = function (c, open_token) {
      var resulting_string = null;
      var token = null;

      if (!open_token) {
        if (c === '<') {
          resulting_string = this._input.read(/<(?:[^\n\r\t >{][^\n\r\t >{/]*)?/g);
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        } else if (this._options.indent_handlebars && c === '{' && this._input.peek(1) === '{') {
          resulting_string = this._input.readUntil(/[\n\r\t }]/g);
          token = this._create_token(TOKEN.TAG_OPEN, resulting_string);
        }
      }

      return token;
    };

    Tokenizer.prototype._read_close = function (c, open_token) {
      var resulting_string = null;
      var token = null;

      if (open_token) {
        if (open_token.text[0] === '<' && (c === '>' || c === '/' && this._input.peek(1) === '>')) {
          resulting_string = this._input.next();

          if (c === '/') {
            //  for close tag "/>"
            resulting_string += this._input.next();
          }

          token = this._create_token(TOKEN.TAG_CLOSE, resulting_string);
        } else if (open_token.text[0] === '{' && c === '}' && this._input.peek(1) === '}') {
          this._input.next();

          this._input.next();

          token = this._create_token(TOKEN.TAG_CLOSE, '}}');
        }
      }

      return token;
    };

    Tokenizer.prototype._read_attribute = function (c, previous_token, open_token) {
      var token = null;
      var resulting_string = '';

      if (open_token && open_token.text[0] === '<') {
        if (c === '=') {
          token = this._create_token(TOKEN.EQUALS, this._input.next());
        } else if (c === '"' || c === "'") {
          var content = this._input.next();

          var input_string = '';
          var string_pattern = new RegExp(c + '|{{', 'g');

          while (this._input.hasNext()) {
            input_string = this._input.readUntilAfter(string_pattern);
            content += input_string;

            if (input_string[input_string.length - 1] === '"' || input_string[input_string.length - 1] === "'") {
              break;
            } else if (this._input.hasNext()) {
              content += this._input.readUntilAfter(/}}/g);
            }
          }

          token = this._create_token(TOKEN.VALUE, content);
        } else {
          if (c === '{' && this._input.peek(1) === '{') {
            resulting_string = this._input.readUntilAfter(/}}/g);
          } else {
            resulting_string = this._input.readUntil(/[\n\r\t =\/>]/g);
          }

          if (resulting_string) {
            if (previous_token.type === TOKEN.EQUALS) {
              token = this._create_token(TOKEN.VALUE, resulting_string);
            } else {
              token = this._create_token(TOKEN.ATTRIBUTE, resulting_string);
            }
          }
        }
      }

      return token;
    };

    Tokenizer.prototype._is_content_unformatted = function (tag_name) {
      // void_elements have no content and so cannot have unformatted content
      // script and style tags should always be read as unformatted content
      // finally content_unformatted and unformatted element contents are unformatted
      return this._options.void_elements.indexOf(tag_name) === -1 && (tag_name === 'script' || tag_name === 'style' || this._options.content_unformatted.indexOf(tag_name) !== -1 || this._options.unformatted.indexOf(tag_name) !== -1);
    };

    Tokenizer.prototype._read_raw_content = function (previous_token, open_token) {
      // jshint unused:false
      var resulting_string = '';

      if (open_token && open_token.text[0] === '{') {
        resulting_string = this._input.readUntil(/}}/g);
      } else if (previous_token.type === TOKEN.TAG_CLOSE && previous_token.opened.text[0] === '<') {
        var tag_name = previous_token.opened.text.substr(1).toLowerCase();

        if (this._is_content_unformatted(tag_name)) {
          resulting_string = this._input.readUntil(new RegExp('</' + tag_name + '[\\n\\r\\t ]*?>', 'ig'));
        }
      }

      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }

      return null;
    };

    Tokenizer.prototype._read_content_word = function () {
      // if we get here and we see handlebars treat them as plain text
      var resulting_string = this._input.readUntil(this._word_pattern);

      if (resulting_string) {
        return this._create_token(TOKEN.TEXT, resulting_string);
      }
    };

    module.exports.Tokenizer = Tokenizer;
    module.exports.TOKEN = TOKEN;
    /***/
  }]);

  var style_html = legacy_beautify_html;
  /* Footer */

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
          class: 'editor__field__value'
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
            class: 'editor__field raised'
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
        HashBrown.Helpers.UIHelper.fieldSortableArray(_this2.value, _this2.element.parentElement, function (newArray) {
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

      // Config
      this.config = this.config || {}; // Sanity check for allowed Schemas array

      this.config.allowedSchemas = this.config.allowedSchemas || []; // The value was null

      if (!this.value) {
        this.value = [];
        setTimeout(function () {
          _this3.trigger('silentchange', _this3.value);
        }, 500); // The value was not an array, recover the items
      } else if (!Array.isArray(this.value)) {
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
        class: 'field-editor field-editor--array ' + (this.config.useGrid ? 'grid' : '')
      }, _.each(this.value, function (i, item) {
        // Render field
        var $field = _.div({
          class: 'editor__field raised field-editor--array__item'
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
          }); // Assign the "value" class name to the field editor

          editorInstance.element.classList.toggle('editor__field__value', true);
          editorInstance.on('ready', function () {
            editorInstance.element.classList.toggle('editor__field__value', true);
          }); // Hook up the change event

          editorInstance.on('change', function (newValue) {
            item.value = newValue;
          });
          editorInstance.on('silentchange', function (newValue) {
            item.value = newValue;
          });

          _.append($field.empty(), // Render sort key
          _.div({
            class: 'editor__field__sort-key'
          }, _this4.getItemLabel(item, schema)), // Render Schema picker
          _.if(_this4.config.allowedSchemas.length > 1, _.div({
            class: 'field-editor--array__item__toolbar'
          }, _.div({
            class: 'widget--label'
          }, 'Schema'), new HashBrown.Views.Widgets.Dropdown({
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
          }).$element)), // Render field editor instance
          editorInstance.$element, // Render field actions (collapse/expand, remove)
          _.div({
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
        class: 'field-editor field-editor--boolean'
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
        class: 'field-editor field-editor--content-reference'
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
        class: 'field-editor field-editor--content-schema-reference'
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
        class: 'field-editor field-editor--date'
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
        class: 'field-editor field-editor--dropdown'
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
        class: 'field-editor field-editor--language'
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
        class: 'field-editor field-editor--media-reference',
        title: this.description || ''
      }, _.button({
        class: 'field-editor--media-reference__pick'
      }, _.do(function () {
        if (!media) {
          return _.div({
            class: 'field-editor--media-reference__empty'
          });
        }

        if (media.isAudio()) {
          return _.div({
            class: 'field-editor--media-reference__preview fa fa-file-audio-o'
          });
        }

        if (media.isVideo()) {
          return _.div({
            class: 'field-editor--media-reference__preview fa fa-file-video-o'
          });
        }

        if (media.isImage()) {
          return _.img({
            class: 'field-editor--media-reference__preview',
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
        class: 'field-editor--media-reference__footer'
      }, _.label({
        class: 'field-editor--media-reference__name'
      }, media ? media.name : ''), _.button({
        class: 'field-editor--media-reference__remove',
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
        class: 'field-editor field-editor--number'
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
        class: 'field-editor field-editor--resource-reference'
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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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
            html = '<img data-id="' + id + '" alt="' + media.name + '" src="' + media.url + '">';
          } else if (media.isVideo()) {
            html = '<video data-id="' + id + '" alt="' + media.name + '" src="' + media.url + '">';
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
      return this.element.querySelector('.field-editor--rich-text__tab__content');
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
        class: 'field-editor field-editor--rich-text',
        title: this.description || ''
      }, _.div({
        class: 'field-editor--rich-text__header'
      }, _.each({
        wysiwyg: 'Visual',
        markdown: 'Markdown',
        html: 'HTML'
      }, function (alias, label) {
        return _.button({
          class: (activeView === alias ? 'active ' : '') + 'field-editor--rich-text__header__tab'
        }, label).click(function () {
          _this6.onClickTab(alias);
        });
      }), _.button({
        class: 'field-editor--rich-text__header__add-media'
      }, 'Add media').click(function () {
        _this6.onClickInsertMedia();
      })), _.div({
        class: 'field-editor--rich-text__body'
      }, _.if(activeView === 'wysiwyg', _.div({
        class: 'field-editor--rich-text__tab wysiwyg'
      }, _.div({
        class: 'field-editor--rich-text__tab__content',
        'contenteditable': true
      }))), _.if(activeView === 'markdown', _.div({
        class: 'field-editor--rich-text__tab markdown'
      }, _.textarea({
        class: 'field-editor--rich-text__tab__content'
      }))), _.if(activeView === 'html', _.div({
        class: 'field-editor--rich-text__tab html'
      }, _.textarea({
        class: 'field-editor--rich-text__tab__content'
      })))));
    }
    /**
     * Post render
     */

  }, {
    key: "postrender",
    value: function postrender() {
      _get(_getPrototypeOf(RichTextEditor.prototype), "postrender", this).call(this);

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
        class: 'field-editor field-editor--string'
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
        class: 'field-editor field-editor--struct'
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
          class: 'editor__field__value'
        }, _.each(config.struct, function (fieldKey, fieldValue) {
          // Sanity check
          fieldValue.config = fieldValue.config || {};
          fieldValue.schemaId = fieldValue.schemaId || 'array';

          var $field = _.div({
            class: 'editor__field raised'
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
        class: 'field-editor field-editor--tags'
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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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
        class: 'field-editor field-editor--url'
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

      _get(_getPrototypeOf(UrlEditor.prototype), "postrender", this).call(this); //  Wait a bit before checking for title field


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
            var apiPath = 'server/backups/' + _this.model.id + '/upload'; // TODO: Use the HashBrown.Helpers.RequestHelper for this

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
              location = HashBrown.Helpers.RequestHelper.environmentUrl('server/backups/' + _this5.model.id + '/' + backup + '.hba');
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
        options: HashBrown.Helpers.LanguageHelper.getLanguageOptions(this.model.id),
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
        title: 'New environment for "' + this.model.settings.info.name + '"',
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
        class: 'widget widget--button dashed standard expanded'
      }, 'Add environment').click(function () {
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