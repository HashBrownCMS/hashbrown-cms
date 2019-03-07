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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @namespace HashBrown.Client.Helpers
 */

namespace('Helpers').add(__webpack_require__(1)).add(__webpack_require__(3)).add(__webpack_require__(5)).add(__webpack_require__(6)).add(__webpack_require__(8)).add(__webpack_require__(10)).add(__webpack_require__(11)).add(__webpack_require__(13)).add(__webpack_require__(14)).add(__webpack_require__(15)).add(__webpack_require__(16)).add(__webpack_require__(18)).add(__webpack_require__(20)).add(__webpack_require__(21));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

var ConnectionHelperCommon = __webpack_require__(2);
/**
 * The client side connection helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var ConnectionHelper =
/*#__PURE__*/
function (_ConnectionHelperComm) {
  _inherits(ConnectionHelper, _ConnectionHelperComm);

  function ConnectionHelper() {
    _classCallCheck(this, ConnectionHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectionHelper).apply(this, arguments));
  }

  _createClass(ConnectionHelper, null, [{
    key: "getAllConnections",

    /**
     * Gets all connections
     *
     * @return {Promise} Array of Connections
     */
    value: function getAllConnections() {
      return Promise.resolve(resources.connections);
    }
    /**
     * Gets a Connection by id (sync)
     *
     * @param {string} id
     *
     * @return {Promise} Connection
     */

  }, {
    key: "getConnectionByIdSync",
    value: function getConnectionByIdSync(id) {
      checkParam(id, 'id', String);

      for (var i in resources.connections) {
        var connection = resources.connections[i];

        if (connection.id == id) {
          return connection;
        }
      }
    }
    /**
     * Gets a Connection by id
     *
     * @param {String} id
     *
     * @return {Promise} Connection
     */

  }, {
    key: "getConnectionById",
    value: function getConnectionById(id) {
      if (!id) {
        return Promise.resolve(null);
      }

      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Connection, 'connections', id);
    }
    /**
     * Sets the Media provider
     *
     * @param {String} id
     *
     * @returns {Promise}
     */

  }, {
    key: "setMediaProvider",
    value: function setMediaProvider(id) {
      return _get(_getPrototypeOf(ConnectionHelper), "setMediaProvider", this).call(this, HashBrown.Helpers.ProjectHelper.currentProject, HashBrown.Helpers.ProjectHelper.currentEnvironment, id).then(function () {
        return HashBrown.Helpers.RequestHelper.reloadResource('media');
      }).then(function () {
        HashBrown.Views.Navigation.NavbarMain.reload();
      });
    }
    /**
     * Gets the Media provider
     *
     * @returns {Promise} Connection
     */

  }, {
    key: "getMediaProvider",
    value: function getMediaProvider() {
      return _get(_getPrototypeOf(ConnectionHelper), "getMediaProvider", this).call(this, HashBrown.Helpers.ProjectHelper.currentProject, HashBrown.Helpers.ProjectHelper.currentEnvironment);
    }
  }]);

  return ConnectionHelper;
}(ConnectionHelperCommon);

module.exports = ConnectionHelper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ConnectionHelper =
/*#__PURE__*/
function () {
  function ConnectionHelper() {
    _classCallCheck(this, ConnectionHelper);
  }

  _createClass(ConnectionHelper, null, [{
    key: "getAllConnections",

    /**
     * Gets all connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise(Array)} connections
     */
    value: function getAllConnections(project, environment) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      return Promise.resolve();
    }
    /**
     * Sets the Media provider
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} Promise
     */

  }, {
    key: "setMediaProvider",
    value: function setMediaProvider(project, environment) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers').then(function (providers) {
        providers = providers || {};
        providers.media = id;
        return HashBrown.Helpers.SettingsHelper.setSettings(project, environment, 'providers', providers);
      });
    }
    /**
     * Gets the Media provider
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Connection object
     */

  }, {
    key: "getMediaProvider",
    value: function getMediaProvider(project, environment) {
      var _this = this;

      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers') // Previously, providers were set project-wide, so retrieve automatically if needed
      .then(function (providers) {
        if (!providers) {
          return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'providers');
        } else {
          return Promise.resolve(providers);
        }
      }) // Return requested provider
      .then(function (providers) {
        providers = providers || {};

        if (providers.media) {
          return _this.getConnectionById(project, environment, providers.media);
        } else {
          return Promise.resolve(null);
        }
      });
    }
  }]);

  return ConnectionHelper;
}();

module.exports = ConnectionHelper;

/***/ }),
/* 3 */
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

var ContentHelperCommon = __webpack_require__(4);
/**
 * The client side content helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var ContentHelper =
/*#__PURE__*/
function (_ContentHelperCommon) {
  _inherits(ContentHelper, _ContentHelperCommon);

  function ContentHelper() {
    _classCallCheck(this, ContentHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(ContentHelper).apply(this, arguments));
  }

  _createClass(ContentHelper, null, [{
    key: "getContentByIdSync",

    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Content} Content node
     */
    value: function getContentByIdSync(id) {
      if (!id) {
        return null;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = resources.content[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var content = _step.value;

          if (content.id === id) {
            return content;
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
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {Promise} Content node
     */

  }, {
    key: "getContentById",
    value: function getContentById(id) {
      if (!id) {
        return Promise.resolve(null);
      }

      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Content, 'content', id);
    }
    /**
     * Gets all Content
     *
     * @returns {Promise} Content node
     */

  }, {
    key: "getAllContent",
    value: function getAllContent() {
      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Content, 'content');
    }
    /**
     * Sets Content by id
     *
     * @param {String} id
     * @param {Content} content
     *
     * @returns {Promise} Content node
     */

  }, {
    key: "setContentById",
    value: function setContentById(id, content) {
      checkParam(id, 'id', String);
      checkParam(content, 'content', HashBrown.Models.Content);
      return HashBrown.Helpers.ResourceHelper.set('content', id, content);
    }
    /**
     * A sanity check for fields
     *
     * @param {Object} value
     * @param {Schema} schema
     */

  }, {
    key: "fieldSanityCheck",
    value: function fieldSanityCheck(value, schema) {
      // If the schema value is set to multilingual, but the value isn't an object, convert it
      if (schema.multilingual && (!value || _typeof(value) !== 'object')) {
        var oldValue = value;
        value = {};
        value[window.language] = oldValue;
      } // If the schema value is not set to multilingual, but the value is an object
      // containing the _multilingual flag, convert it


      if (!schema.multilingual && value && _typeof(value) === 'object' && value._multilingual) {
        value = value[window.language];
      } // Update the _multilingual flag


      if (schema.multilingual && value && !value._multilingual) {
        value._multilingual = true;
      } else if (!schema.multilingual && value && value._multilingual) {
        delete value._multilingual;
      }

      return value;
    }
    /**
     * Get new sort index
     *
     * @param {String} parentId
     * @param {String} aboveId
     * @param {String} belowId
     */

  }, {
    key: "getNewSortIndex",
    value: function getNewSortIndex(parentId, aboveId, belowId) {
      if (aboveId) {
        return this.getContentByIdSync(aboveId).sort + 1;
      }

      if (belowId) {
        return this.getContentByIdSync(belowId).sort - 1;
      } // Filter out content that doesn't have the same parent


      var nodes = resources.content.filter(function (x) {
        return x.parentId == parentId || !x.parentId && !parentId;
      }); // Find new index
      // NOTE: The index should be the highest sort number + 10000 to give a bit of leg room for sorting later

      var newIndex = 10000;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var content = _step2.value;

          if (newIndex - 10000 <= content.sort) {
            newIndex = content.sort + 10000;
          }
        }
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

      return newIndex;
    }
    /**
     * Starts a tour of the Content section
     */

  }, {
    key: "startTour",
    value: function startTour() {
      if (location.hash.indexOf('content/') < 0) {
        location.hash = '/content/';
      }

      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 500);
      }).then(function () {
        return UI.highlight('.navbar-main__tab[data-route="/content/"]', 'This the Content section, where you will do all of your authoring.', 'right', 'next');
      }).then(function () {
        return UI.highlight('.navbar-main__pane[data-route="/content/"]', 'Here you will find all of your authored Content, like webpages. You can right click here to create a Content node.', 'right', 'next');
      }).then(function () {
        var editor = document.querySelector('.editor--content');

        if (!editor) {
          return UI.highlight('.page--environment__space--editor', 'This is where the Content editor will be when you click a Content node.', 'left', 'next');
        }

        return UI.highlight('.editor--content', 'This is the Content editor, where you edit Content nodes.', 'left', 'next');
      });
    }
  }]);

  return ContentHelper;
}(ContentHelperCommon);

module.exports = ContentHelper;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper class for Content
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ContentHelper =
/*#__PURE__*/
function () {
  function ContentHelper() {
    _classCallCheck(this, ContentHelper);
  }

  _createClass(ContentHelper, null, [{
    key: "getAllContents",

    /**
     * Gets all Content objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} promise
     */
    value: function getAllContents(project, environment) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      return Promise.resolve();
    }
    /**
     * Gets a URL-friendly version of a string
     *
     * @param {String} string
     *
     * @param {String} slug
     */

  }, {
    key: "getSlug",
    value: function getSlug(string) {
      return (string || '').toLowerCase().replace(/[æ|ä]/g, 'ae').replace(/[ø|ö]/g, 'oe').replace(/å/g, 'aa').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
    /**
     * Gets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} promise
     */

  }, {
    key: "getContentById",
    value: function getContentById(project, environment, id) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      checkParam(id, 'id', String);
      return Promise.resolve();
    }
    /**
     * Sets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Content} content
     *
     * @return {Promise} promise
     */

  }, {
    key: "setContentById",
    value: function setContentById(project, environment, id, content) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      checkParam(id, 'id', String);
      checkParam(content, 'content', HashBrown.Models.Content);
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
    /**
     * Checks if a Schema type is allowed as a child of a Content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} parentId
     * @param {String} childSchemaId
     *
     * @returns {Promise} Is the Content node allowed as a child
     */

  }, {
    key: "isSchemaAllowedAsChild",
    value: function isSchemaAllowedAsChild(project, environment, parentId, childSchemaId) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      checkParam(parentId, 'parentId', String);
      checkParam(childSchemaId, 'childSchemaId', String); // No parent ID means root, and all Schemas are allowed there

      if (!parentId) {
        return Promise.resolve();
      } else {
        return this.getContentById(project, environment, parentId).then(function (parentContent) {
          return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, parentContent.schemaId);
        }).then(function (parentSchema) {
          // The Schema was not an allowed child
          if (parentSchema.allowedChildSchemas.indexOf(childSchemaId) < 0) {
            return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, childSchemaId).then(function (childSchema) {
              return Promise.reject(new Error('Content with Schema "' + childSchema.name + '" is not an allowed child of Content with Schema "' + parentSchema.name + '"'));
            }); // The Schema was an allowed child, resolve
          } else {
            return Promise.resolve();
          }
        });
      }
    }
    /**
     * Creates a new content object
     *
     * @return {Promise} promise
     */

  }, {
    key: "createContent",
    value: function createContent() {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
    /**
     * Removes a content object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */

  }, {
    key: "removeContentById",
    value: function removeContentById(id) {
      return new Promise(function (resolve, reject) {
        resolve();
      });
    }
  }]);

  return ContentHelper;
}();

module.exports = ContentHelper;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The client side helper class for Forms
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FormHelper =
/*#__PURE__*/
function () {
  function FormHelper() {
    _classCallCheck(this, FormHelper);
  }

  _createClass(FormHelper, null, [{
    key: "getAllForms",

    /**
     * Gets all Forms
     */
    value: function getAllForms() {
      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Form, 'forms');
    }
  }]);

  return FormHelper;
}();

module.exports = FormHelper;

/***/ }),
/* 6 */
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

var DebugHelperCommon = __webpack_require__(7);
/**
 * The client side debug helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var DebugHelper =
/*#__PURE__*/
function (_DebugHelperCommon) {
  _inherits(DebugHelper, _DebugHelperCommon);

  function DebugHelper() {
    _classCallCheck(this, DebugHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(DebugHelper).apply(this, arguments));
  }

  _createClass(DebugHelper, null, [{
    key: "startSocket",

    /**
     * Start the debug socket
     */
    value: function startSocket() {
      var _this = this;

      var debugSocket = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.host + '/api/debug');

      debugSocket.onopen = function (ev) {
        debug.log('Debug socket open', 'HashBrown');
      };

      debugSocket.onmessage = function (ev) {
        _this.onSocketMessage(ev);
      };
    }
    /**
     * Event: On debug socket message
     */

  }, {
    key: "onSocketMessage",
    value: function onSocketMessage(ev) {
      try {
        var data = JSON.parse(ev.data);

        switch (data.type) {
          case 'error':
            UI.errorModal(new Error(data.sender + ': ' + data.message));
            break;

          case 'warning':
            UI.errorModal(new Error(data.sender + ': ' + data.message));
            break;
        }
      } catch (e) {
        UI.errorModal(ev);
      }
    }
  }]);

  return DebugHelper;
}(DebugHelperCommon);

module.exports = DebugHelper;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper for debugging
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DebugHelper =
/*#__PURE__*/
function () {
  function DebugHelper() {
    _classCallCheck(this, DebugHelper);
  }

  _createClass(DebugHelper, null, [{
    key: "onLog",

    /**
     * Event: Log
     *
     * @param {String} dateString
     * @param {String} senderString
     * @param {String} message
     * @param {String} type
     */
    value: function onLog(dateString, senderString, message, type) {
      if (type) {
        message = '[' + type.toUpperCase() + '] ' + message;
      }

      console.log(dateString + ' | ' + senderString + ' | ' + message);
    }
    /**
     * Gets the date string
     *
     * @returns {String} date
     */

  }, {
    key: "getDateString",
    value: function getDateString() {
      var date = new Date();
      var monthString = date.getMonth() + 1;

      if (monthString < 10) {
        monthString = '0' + monthString;
      }

      var dateString = date.getDate();

      if (dateString < 10) {
        dateString = '0' + dateString;
      }

      var hoursString = date.getHours();

      if (hoursString < 10) {
        hoursString = '0' + hoursString;
      }

      var minutesString = date.getMinutes();

      if (minutesString < 10) {
        minutesString = '0' + minutesString;
      }

      var secondsString = date.getSeconds();

      if (secondsString < 10) {
        secondsString = '0' + secondsString;
      }

      var output = date.getFullYear() + '.' + monthString + '.' + dateString + ' ' + hoursString + ':' + minutesString + ':' + secondsString;
      return output;
    }
    /**
     * Parse sender
     *
     * @param {Object} sender
     *
     * @returns {String} name
     */

  }, {
    key: "parseSender",
    value: function parseSender(sender, ignoreLast) {
      var senderName = '';

      if (sender) {
        if (typeof sender === 'string') {
          senderName = sender;
        } else if (typeof sender === 'function') {
          senderName = sender.name;
        } else if (sender.constructor) {
          senderName = sender.constructor.name;
        } else {
          senderName = sender.toString();
        }
      }

      return senderName;
    }
    /**
     * Gets the debug verbosity
     *
     * @returns {Number} Verbosity
     */

  }, {
    key: "getDebugVerbosity",
    value: function getDebugVerbosity() {
      return 1;
    }
    /**
     * Logs a message
     *
     * @param {String} message
     * @param {Object} sender
     * @param {Number} verbosity
     */

  }, {
    key: "log",
    value: function log(message, sender) {
      var verbosity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      if (verbosity == 0) {
        this.error('Verbosity cannot be set to 0', this);
      } else if (!verbosity) {
        verbosity = 1;
      }

      if (this.getDebugVerbosity() >= verbosity) {
        this.onLog(this.getDateString(), this.parseSender(sender), message);
      }
    }
    /**
     * Shows an error
     *
     * @param {String|Error} error
     * @param {Object} sender
     */

  }, {
    key: "error",
    value: function error(_error, sender) {
      if (_error instanceof Error !== true) {
        _error = new Error(_error);
      }

      this.onLog(this.getDateString(), this.parseSender(sender), _error.message || _error.trace, 'error');
      throw _error;
    }
    /**
     * Shows a warning
     */

  }, {
    key: "warning",
    value: function warning(message, sender) {
      this.onLog(this.getDateString(), this.parseSender(sender), message, 'warning');
    }
  }]);

  return DebugHelper;
}();

module.exports = DebugHelper;

/***/ }),
/* 8 */
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

var LanguageHelperCommon = __webpack_require__(9);

var selectedLanguages = {};
/**
 * The client side language helper
 *
 * @memberof HashBrown.Client.Helpers
 */

var LanguageHelper =
/*#__PURE__*/
function (_LanguageHelperCommon) {
  _inherits(LanguageHelper, _LanguageHelperCommon);

  function LanguageHelper() {
    _classCallCheck(this, LanguageHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(LanguageHelper).apply(this, arguments));
  }

  _createClass(LanguageHelper, null, [{
    key: "getLanguages",

    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    value: function getLanguages(project) {
      project = project || HashBrown.Helpers.ProjectHelper.currentProject;
      return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'languages').then(function (selected) {
        if (!selected || !Array.isArray(selected)) {
          selected = ['en'];
        }

        selected.sort();
        selectedLanguages[project] = selected;
        return Promise.resolve(selected);
      });
    }
    /**
     * Gets all selected languages (sync)
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */

  }, {
    key: "getLanguagesSync",
    value: function getLanguagesSync(project) {
      project = project || HashBrown.Helpers.ProjectHelper.currentProject;
      return selectedLanguages[project] || ['en'];
    }
    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise} promise
     */

  }, {
    key: "setLanguages",
    value: function setLanguages(project, languages) {
      checkParam(project, 'project', String);
      checkParam(languages, 'languages', Array);

      if (!Array.isArray(languages)) {
        return Promise.reject(new Error('Language array cannot be of type "' + _typeof(languages) + '"'));
      }

      return HashBrown.Helpers.SettingsHelper.setSettings(project, null, 'languages', languages);
    }
  }]);

  return LanguageHelper;
}(LanguageHelperCommon);

module.exports = LanguageHelper;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper for language
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LanguageHelper =
/*#__PURE__*/
function () {
  function LanguageHelper() {
    _classCallCheck(this, LanguageHelper);
  }

  _createClass(LanguageHelper, null, [{
    key: "getLanguages",

    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    value: function getLanguages(project) {
      checkParam(project, 'project', String);
      return Promise.resolve([]);
    }
    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise} Promise
     */

  }, {
    key: "setLanguages",
    value: function setLanguages(project, languages) {
      checkParam(project, 'project', String);
      checkParam(languages, 'languages', Array);
      return Promise.resolve();
    }
    /**
     * Gets localised sets of properties for a Content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     *
     * @return {Promise} Properties
     */

  }, {
    key: "getAllLocalizedPropertySets",
    value: function getAllLocalizedPropertySets(project, environment, content) {
      checkParam(project, 'project', String);
      checkParam(environment, 'environment', String);
      checkParam(content, 'content', HashBrown.Models.Content);
      return this.getLanguages(project).then(function (languages) {
        var sets = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = languages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var language = _step.value;
            var properties = content.getLocalizedProperties(language);
            sets[language] = properties;
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

        return Promise.resolve(sets);
      });
    }
    /**
     * Gets all languages
     *
     * @returns {Array} List of language names
     */

  }, {
    key: "getLanguageOptions",
    value: function getLanguageOptions() {
      return ["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rc", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu"];
    }
  }]);

  return LanguageHelper;
}();

module.exports = LanguageHelper;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper class for handling markdown
 *
 * @memberof HashBrown.Client.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MarkdownHelper =
/*#__PURE__*/
function () {
  function MarkdownHelper() {
    _classCallCheck(this, MarkdownHelper);
  }

  _createClass(MarkdownHelper, null, [{
    key: "fromHtml",

    /**
     * Converts a string from HTML to markdown (based on "turndown")
     *
     * NOTE: This terrible approach had to be implemented since "to-markdown"
     * became "turndown" and employed an ugly implementation that we're
     * encapsulating here to prevent polluting the global namespace with libraries
     *
     * In the future, we should fork the project and integrate it more neatly
     *
     * @return {String} Markdown
     */
    value: function fromHtml(html) {
      var TurndownService = function () {
        'use strict';

        function extend(destination) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (source.hasOwnProperty(key)) destination[key] = source[key];
            }
          }

          return destination;
        }

        function repeat(character, count) {
          return Array(count + 1).join(character);
        }

        var blockElements = ['address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav', 'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

        function isBlock(node) {
          return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1;
        }

        var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        function isVoid(node) {
          return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1;
        }

        var voidSelector = voidElements.join();

        function hasVoid(node) {
          return node.querySelector && node.querySelector(voidSelector);
        }

        var rules = {};
        rules.paragraph = {
          filter: 'p',
          replacement: function replacement(content) {
            return '\n\n' + content + '\n\n';
          }
        };
        rules.lineBreak = {
          filter: 'br',
          replacement: function replacement(content, node, options) {
            return options.br + '\n';
          }
        };
        rules.heading = {
          filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
          replacement: function replacement(content, node, options) {
            var hLevel = Number(node.nodeName.charAt(1));

            if (options.headingStyle === 'setext' && hLevel < 3) {
              var underline = repeat(hLevel === 1 ? '=' : '-', content.length);
              return '\n\n' + content + '\n' + underline + '\n\n';
            } else {
              return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n';
            }
          }
        };
        rules.blockquote = {
          filter: 'blockquote',
          replacement: function replacement(content) {
            content = content.replace(/^\n+|\n+$/g, '');
            content = content.replace(/^/gm, '> ');
            return '\n\n' + content + '\n\n';
          }
        };
        rules.list = {
          filter: ['ul', 'ol'],
          replacement: function replacement(content, node) {
            var parent = node.parentNode;

            if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
              return '\n' + content;
            } else {
              return '\n\n' + content + '\n\n';
            }
          }
        };
        rules.listItem = {
          filter: 'li',
          replacement: function replacement(content, node, options) {
            content = content.replace(/^\n+/, '') // remove leading newlines
            .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
            .replace(/\n/gm, '\n    '); // indent

            var prefix = options.bulletListMarker + '   ';
            var parent = node.parentNode;

            if (parent.nodeName === 'OL') {
              var start = parent.getAttribute('start');
              var index = Array.prototype.indexOf.call(parent.children, node);
              prefix = (start ? Number(start) + index : index + 1) + '.  ';
            }

            return prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '');
          }
        };
        rules.indentedCodeBlock = {
          filter: function filter(node, options) {
            return options.codeBlockStyle === 'indented' && node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
          },
          replacement: function replacement(content, node, options) {
            return '\n\n    ' + node.firstChild.textContent.replace(/\n/g, '\n    ') + '\n\n';
          }
        };
        rules.fencedCodeBlock = {
          filter: function filter(node, options) {
            return options.codeBlockStyle === 'fenced' && node.nodeName === 'PRE' && node.firstChild && node.firstChild.nodeName === 'CODE';
          },
          replacement: function replacement(content, node, options) {
            var className = node.firstChild.className || '';
            var language = (className.match(/language-(\S+)/) || [null, ''])[1];
            return '\n\n' + options.fence + language + '\n' + node.firstChild.textContent + '\n' + options.fence + '\n\n';
          }
        };
        rules.horizontalRule = {
          filter: 'hr',
          replacement: function replacement(content, node, options) {
            return '\n\n' + options.hr + '\n\n';
          }
        };
        rules.inlineLink = {
          filter: function filter(node, options) {
            return options.linkStyle === 'inlined' && node.nodeName === 'A' && node.getAttribute('href');
          },
          replacement: function replacement(content, node) {
            var href = node.getAttribute('href');
            var title = node.title ? ' "' + node.title + '"' : '';
            return '[' + content + '](' + href + title + ')';
          }
        };
        rules.referenceLink = {
          filter: function filter(node, options) {
            return options.linkStyle === 'referenced' && node.nodeName === 'A' && node.getAttribute('href');
          },
          replacement: function replacement(content, node, options) {
            var href = node.getAttribute('href');
            var title = node.title ? ' "' + node.title + '"' : '';
            var replacement;
            var reference;

            switch (options.linkReferenceStyle) {
              case 'collapsed':
                replacement = '[' + content + '][]';
                reference = '[' + content + ']: ' + href + title;
                break;

              case 'shortcut':
                replacement = '[' + content + ']';
                reference = '[' + content + ']: ' + href + title;
                break;

              default:
                var id = this.references.length + 1;
                replacement = '[' + content + '][' + id + ']';
                reference = '[' + id + ']: ' + href + title;
            }

            this.references.push(reference);
            return replacement;
          },
          references: [],
          append: function append(options) {
            var references = '';

            if (this.references.length) {
              references = '\n\n' + this.references.join('\n') + '\n\n';
              this.references = []; // Reset references
            }

            return references;
          }
        };
        rules.emphasis = {
          filter: ['em', 'i'],
          replacement: function replacement(content, node, options) {
            if (!content.trim()) return '';
            return options.emDelimiter + content + options.emDelimiter;
          }
        };
        rules.strong = {
          filter: ['strong', 'b'],
          replacement: function replacement(content, node, options) {
            if (!content.trim()) return '';
            return options.strongDelimiter + content + options.strongDelimiter;
          }
        };
        rules.code = {
          filter: function filter(node) {
            var hasSiblings = node.previousSibling || node.nextSibling;
            var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;
            return node.nodeName === 'CODE' && !isCodeBlock;
          },
          replacement: function replacement(content) {
            if (!content.trim()) return '';
            var delimiter = '`';
            var leadingSpace = '';
            var trailingSpace = '';
            var matches = content.match(/`+/gm);

            if (matches) {
              if (/^`/.test(content)) leadingSpace = ' ';
              if (/`$/.test(content)) trailingSpace = ' ';

              while (matches.indexOf(delimiter) !== -1) {
                delimiter = delimiter + '`';
              }
            }

            return delimiter + leadingSpace + content + trailingSpace + delimiter;
          }
        };
        rules.image = {
          filter: 'img',
          replacement: function replacement(content, node) {
            var alt = node.alt || '';
            var src = node.getAttribute('src') || '';
            var title = node.title || '';
            var titlePart = title ? ' "' + title + '"' : '';
            return src ? '![' + alt + '](' + src + titlePart + ')' : '';
          }
        };
        /**
        * Manages a collection of rules used to convert HTML to Markdown
        */

        function Rules(options) {
          this.options = options;
          this._keep = [];
          this._remove = [];
          this.blankRule = {
            replacement: options.blankReplacement
          };
          this.keepReplacement = options.keepReplacement;
          this.defaultRule = {
            replacement: options.defaultReplacement
          };
          this.array = [];

          for (var key in options.rules) {
            this.array.push(options.rules[key]);
          }
        }

        Rules.prototype = {
          add: function add(key, rule) {
            this.array.unshift(rule);
          },
          keep: function keep(filter) {
            this._keep.unshift({
              filter: filter,
              replacement: this.keepReplacement
            });
          },
          remove: function remove(filter) {
            this._remove.unshift({
              filter: filter,
              replacement: function replacement() {
                return '';
              }
            });
          },
          forNode: function forNode(node) {
            if (node.isBlank) return this.blankRule;
            var rule;
            if (rule = findRule(this.array, node, this.options)) return rule;
            if (rule = findRule(this._keep, node, this.options)) return rule;
            if (rule = findRule(this._remove, node, this.options)) return rule;
            return this.defaultRule;
          },
          forEach: function forEach(fn) {
            for (var i = 0; i < this.array.length; i++) {
              fn(this.array[i], i);
            }
          }
        };

        function findRule(rules, node, options) {
          for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (filterValue(rule, node, options)) return rule;
          }

          return void 0;
        }

        function filterValue(rule, node, options) {
          var filter = rule.filter;

          if (typeof filter === 'string') {
            if (filter === node.nodeName.toLowerCase()) return true;
          } else if (Array.isArray(filter)) {
            if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
          } else if (typeof filter === 'function') {
            if (filter.call(rule, node, options)) return true;
          } else {
            throw new TypeError('`filter` needs to be a string, array, or function');
          }
        }
        /**
        * The collapseWhitespace function is adapted from collapse-whitespace
        * by Luc Thevenard.
        *
        * The MIT License (MIT)
        *
        * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
        *
        * Permission is hereby granted, free of charge, to any person obtaining a copy
        * of this software and associated documentation files (the "Software"), to deal
        * in the Software without restriction, including without limitation the rights
        * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        * copies of the Software, and to permit persons to whom the Software is
        * furnished to do so, subject to the following conditions:
        *
        * The above copyright notice and this permission notice shall be included in
        * all copies or substantial portions of the Software.
        *
        * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        * THE SOFTWARE.
        */

        /**
        * collapseWhitespace(options) removes extraneous whitespace from an the given element.
        *
        * @param {Object} options
        */


        function collapseWhitespace(options) {
          var element = options.element;
          var isBlock = options.isBlock;
          var isVoid = options.isVoid;

          var isPre = options.isPre || function (node) {
            return node.nodeName === 'PRE';
          };

          if (!element.firstChild || isPre(element)) return;
          var prevText = null;
          var prevVoid = false;
          var prev = null;
          var node = next(prev, element, isPre);

          while (node !== element) {
            if (node.nodeType === 3 || node.nodeType === 4) {
              // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
              var text = node.data.replace(/[ \r\n\t]+/g, ' ');

              if ((!prevText || / $/.test(prevText.data)) && !prevVoid && text[0] === ' ') {
                text = text.substr(1);
              } // `text` might be empty at this point.


              if (!text) {
                node = remove(node);
                continue;
              }

              node.data = text;
              prevText = node;
            } else if (node.nodeType === 1) {
              // Node.ELEMENT_NODE
              if (isBlock(node) || node.nodeName === 'BR') {
                if (prevText) {
                  prevText.data = prevText.data.replace(/ $/, '');
                }

                prevText = null;
                prevVoid = false;
              } else if (isVoid(node)) {
                // Avoid trimming space around non-block, non-BR void elements.
                prevText = null;
                prevVoid = true;
              }
            } else {
              node = remove(node);
              continue;
            }

            var nextNode = next(prev, node, isPre);
            prev = node;
            node = nextNode;
          }

          if (prevText) {
            prevText.data = prevText.data.replace(/ $/, '');

            if (!prevText.data) {
              remove(prevText);
            }
          }
        }
        /**
        * remove(node) removes the given node from the DOM and returns the
        * next node in the sequence.
        *
        * @param {Node} node
        * @return {Node} node
        */


        function remove(node) {
          var next = node.nextSibling || node.parentNode;
          node.parentNode.removeChild(node);
          return next;
        }
        /**
        * next(prev, current, isPre) returns the next node in the sequence, given the
        * current and previous nodes.
        *
        * @param {Node} prev
        * @param {Node} current
        * @param {Function} isPre
        * @return {Node}
        */


        function next(prev, current, isPre) {
          if (prev && prev.parentNode === current || isPre(current)) {
            return current.nextSibling || current.parentNode;
          }

          return current.firstChild || current.nextSibling || current.parentNode;
        }
        /*
        * Set up window for Node.js
        */


        var root = typeof window !== 'undefined' ? window : {};
        /*
        * Parsing HTML strings
        */

        function canParseHTMLNatively() {
          var Parser = root.DOMParser;
          var canParse = false; // Adapted from https://gist.github.com/1129031 Firefox/Opera/IE throw errors on
          // unsupported types

          try {
            // WebKit returns null on unsupported types
            if (new Parser().parseFromString('', 'text/html')) {
              canParse = true;
            }
          } catch (e) {}

          return canParse;
        }

        function createHTMLParser() {
          var Parser = function Parser() {};

          {
            if (shouldUseActiveX()) {
              Parser.prototype.parseFromString = function (string) {
                var doc = new window.ActiveXObject('htmlfile');
                doc.designMode = 'on'; // disable on-page scripts

                doc.open();
                doc.write(string);
                doc.close();
                return doc;
              };
            } else {
              Parser.prototype.parseFromString = function (string) {
                var doc = document.implementation.createHTMLDocument('');
                doc.open();
                doc.write(string);
                doc.close();
                return doc;
              };
            }
          }
          return Parser;
        }

        function shouldUseActiveX() {
          var useActiveX = false;

          try {
            document.implementation.createHTMLDocument('').open();
          } catch (e) {
            if (window.ActiveXObject) useActiveX = true;
          }

          return useActiveX;
        }

        var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

        function RootNode(input) {
          var root;

          if (typeof input === 'string') {
            var doc = htmlParser().parseFromString( // DOM parsers arrange elements in the <head> and <body>. Wrapping in a custom
            // element ensures elements are reliably arranged in a single element.
            '<x-turndown id="turndown-root">' + input + '</x-turndown>', 'text/html');
            root = doc.getElementById('turndown-root');
          } else {
            root = input.cloneNode(true);
          }

          collapseWhitespace({
            element: root,
            isBlock: isBlock,
            isVoid: isVoid
          });
          return root;
        }

        var _htmlParser;

        function htmlParser() {
          _htmlParser = _htmlParser || new HTMLParser();
          return _htmlParser;
        }

        function Node(node) {
          node.isBlock = isBlock(node);
          node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
          node.isBlank = isBlank(node);
          node.flankingWhitespace = flankingWhitespace(node);
          return node;
        }

        function isBlank(node) {
          return ['A', 'TH', 'TD', 'IFRAME', 'SCRIPT', 'AUDIO', 'VIDEO'].indexOf(node.nodeName) === -1 && /^\s*$/i.test(node.textContent) && !isVoid(node) && !hasVoid(node);
        }

        function flankingWhitespace(node) {
          var leading = '';
          var trailing = '';

          if (!node.isBlock) {
            var hasLeading = /^[ \r\n\t]/.test(node.textContent);
            var hasTrailing = /[ \r\n\t]$/.test(node.textContent);

            if (hasLeading && !isFlankedByWhitespace('left', node)) {
              leading = ' ';
            }

            if (hasTrailing && !isFlankedByWhitespace('right', node)) {
              trailing = ' ';
            }
          }

          return {
            leading: leading,
            trailing: trailing
          };
        }

        function isFlankedByWhitespace(side, node) {
          var sibling;
          var regExp;
          var isFlanked;

          if (side === 'left') {
            sibling = node.previousSibling;
            regExp = / $/;
          } else {
            sibling = node.nextSibling;
            regExp = /^ /;
          }

          if (sibling) {
            if (sibling.nodeType === 3) {
              isFlanked = regExp.test(sibling.nodeValue);
            } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
              isFlanked = regExp.test(sibling.textContent);
            }
          }

          return isFlanked;
        }

        var reduce = Array.prototype.reduce;
        var leadingNewLinesRegExp = /^\n*/;
        var trailingNewLinesRegExp = /\n*$/;
        var escapes = [[/\\/g, '\\\\'], [/\*/g, '\\*'], [/^-/g, '\\-'], [/^\+ /g, '\\+ '], [/^(=+)/g, '\\$1'], [/^(#{1,6}) /g, '\\$1 '], [/`/g, '\\`'], [/^~~~/g, '\\~~~'], [/\[/g, '\\['], [/\]/g, '\\]'], [/^>/g, '\\>'], [/_/g, '\\_'], [/^(\d+)\. /g, '$1\\. ']];

        function TurndownService(options) {
          if (!(this instanceof TurndownService)) return new TurndownService(options);
          var defaults = {
            rules: rules,
            headingStyle: 'setext',
            hr: '* * *',
            bulletListMarker: '*',
            codeBlockStyle: 'indented',
            fence: '```',
            emDelimiter: '_',
            strongDelimiter: '**',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full',
            br: '  ',
            blankReplacement: function blankReplacement(content, node) {
              return node.isBlock ? '\n\n' : '';
            },
            keepReplacement: function keepReplacement(content, node) {
              return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML;
            },
            defaultReplacement: function defaultReplacement(content, node) {
              return node.isBlock ? '\n\n' + content + '\n\n' : content;
            }
          };
          this.options = extend({}, defaults, options);
          this.rules = new Rules(this.options);
        }

        TurndownService.prototype = {
          /**
          * The entry point for converting a string or DOM node to Markdown
          * @public
          * @param {String|HTMLElement} input The string or DOM node to convert
          * @returns A Markdown representation of the input
          * @type String
          */
          turndown: function turndown(input) {
            if (!canConvert(input)) {
              throw new TypeError(input + ' is not a string, or an element/document/fragment node.');
            }

            if (input === '') return '';
            var output = process.call(this, new RootNode(input));
            return postProcess.call(this, output);
          },

          /**
          * Add one or more plugins
          * @public
          * @param {Function|Array} plugin The plugin or array of plugins to add
          * @returns The Turndown instance for chaining
          * @type Object
          */
          use: function use(plugin) {
            if (Array.isArray(plugin)) {
              for (var i = 0; i < plugin.length; i++) {
                this.use(plugin[i]);
              }
            } else if (typeof plugin === 'function') {
              plugin(this);
            } else {
              throw new TypeError('plugin must be a Function or an Array of Functions');
            }

            return this;
          },

          /**
          * Adds a rule
          * @public
          * @param {String} key The unique key of the rule
          * @param {Object} rule The rule
          * @returns The Turndown instance for chaining
          * @type Object
          */
          addRule: function addRule(key, rule) {
            this.rules.add(key, rule);
            return this;
          },

          /**
          * Keep a node (as HTML) that matches the filter
          * @public
          * @param {String|Array|Function} filter The unique key of the rule
          * @returns The Turndown instance for chaining
          * @type Object
          */
          keep: function keep(filter) {
            this.rules.keep(filter);
            return this;
          },

          /**
          * Remove a node that matches the filter
          * @public
          * @param {String|Array|Function} filter The unique key of the rule
          * @returns The Turndown instance for chaining
          * @type Object
          */
          remove: function remove(filter) {
            this.rules.remove(filter);
            return this;
          },

          /**
          * Escapes Markdown syntax
          * @public
          * @param {String} string The string to escape
          * @returns A string with Markdown syntax escaped
          * @type String
          */
          escape: function escape(string) {
            return escapes.reduce(function (accumulator, escape) {
              return accumulator.replace(escape[0], escape[1]);
            }, string);
          }
        };
        /**
        * Reduces a DOM node down to its Markdown string equivalent
        * @private
        * @param {HTMLElement} parentNode The node to convert
        * @returns A Markdown representation of the node
        * @type String
        */

        function process(parentNode) {
          var self = this;
          return reduce.call(parentNode.childNodes, function (output, node) {
            node = new Node(node);
            var replacement = '';

            if (node.nodeType === 3) {
              replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
            } else if (node.nodeType === 1) {
              replacement = replacementForNode.call(self, node);
            }

            return join(output, replacement);
          }, '');
        }
        /**
        * Appends strings as each rule requires and trims the output
        * @private
        * @param {String} output The conversion output
        * @returns A trimmed version of the ouput
        * @type String
        */


        function postProcess(output) {
          var self = this;
          this.rules.forEach(function (rule) {
            if (typeof rule.append === 'function') {
              output = join(output, rule.append(self.options));
            }
          });
          return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '');
        }
        /**
        * Converts an element node to its Markdown equivalent
        * @private
        * @param {HTMLElement} node The node to convert
        * @returns A Markdown representation of the node
        * @type String
        */


        function replacementForNode(node) {
          var rule = this.rules.forNode(node);
          var content = process.call(this, node);
          var whitespace = node.flankingWhitespace;
          if (whitespace.leading || whitespace.trailing) content = content.trim();
          return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
        }
        /**
        * Determines the new lines between the current output and the replacement
        * @private
        * @param {String} output The current conversion output
        * @param {String} replacement The string to append to the output
        * @returns The whitespace to separate the current output and the replacement
        * @type String
        */


        function separatingNewlines(output, replacement) {
          var newlines = [output.match(trailingNewLinesRegExp)[0], replacement.match(leadingNewLinesRegExp)[0]].sort();
          var maxNewlines = newlines[newlines.length - 1];
          return maxNewlines.length < 2 ? maxNewlines : '\n\n';
        }

        function join(string1, string2) {
          var separator = separatingNewlines(string1, string2); // Remove trailing/leading newlines and replace with separator

          string1 = string1.replace(trailingNewLinesRegExp, '');
          string2 = string2.replace(leadingNewLinesRegExp, '');
          return string1 + separator + string2;
        }
        /**
        * Determines whether an input can be converted
        * @private
        * @param {String|HTMLElement} input Describe this parameter
        * @returns Describe what it returns
        * @type String|Object|Array|Boolean|Number
        */


        function canConvert(input) {
          return input != null && (typeof input === 'string' || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
        }

        return TurndownService;
      }();

      return new TurndownService().turndown(html);
    }
  }]);

  return MarkdownHelper;
}();

module.exports = MarkdownHelper;

/***/ }),
/* 11 */
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

var MediaHelperCommon = __webpack_require__(12);
/**
 * The client side media helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var MediaHelper =
/*#__PURE__*/
function (_MediaHelperCommon) {
  _inherits(MediaHelper, _MediaHelperCommon);

  function MediaHelper() {
    _classCallCheck(this, MediaHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(MediaHelper).apply(this, arguments));
  }

  _createClass(MediaHelper, null, [{
    key: "getTree",

    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    value: function getTree() {
      return HashBrown.Helpers.RequestHelper.request('get', 'media/tree');
    }
    /**
     * Gets whether the Media provider exists
     *
     * @returns {Promise} Promise
     */

  }, {
    key: "checkMediaProvider",
    value: function checkMediaProvider() {
      return HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Helpers.ProjectHelper.currentProject, HashBrown.Helpers.ProjectHelper.currentEnvironment, 'providers').then(function (result) {
        if (!result || !result.media) {
          return Promise.reject(new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> has the "is Media provider" setting switched on.'));
        }

        return Promise.resolve();
      });
    }
    /**
     * Gets Media object by id synchronously
     *
     * @param {String} id
     *
     * @return {Media} Media object
     */

  }, {
    key: "getMediaByIdSync",
    value: function getMediaByIdSync(id) {
      for (var i = 0; i < resources.media.length; i++) {
        var media = resources.media[i];

        if (media.id == id) {
          return media;
        }
      }

      return null;
    }
    /**
     * Gets the Media Url
     */

  }, {
    key: "getMediaUrl",
    value: function getMediaUrl(id) {
      return '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    }
    /**
     * Gets Media object by id
     *
     * @param {String} id
     *
     * @return {Promise} Media object
     */

  }, {
    key: "getMediaById",
    value: function getMediaById(id) {
      if (!id) {
        return Promise.resolve(null);
      }

      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Media, 'media', id);
    }
    /**
     * Gets all Media objects
     *
     * @return {Promise} Media objects
     */

  }, {
    key: "getAllMedia",
    value: function getAllMedia(id) {
      return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Media, 'media');
    }
    /**
     * Sets a Media tree item
     *
     * @param {String} id
     * @param {Object} item
     *
     * @returns {Promise} promise
     */

  }, {
    key: "setTreeItem",
    value: function setTreeItem(id, item) {
      return HashBrown.Helpers.RequestHelper.request('post', 'media/tree/' + id, item);
    }
    /**
     * Initialises the media picker mode
     *
     * @param {Function} onPickMedia
     * @param {Function} onChangeResource
     * @param {Object} allResources
     */

  }, {
    key: "initMediaPickerMode",
    value: function initMediaPickerMode(onPickMedia, onChangeResource, onError, allResources) {
      // Claim debug messages
      UI.errorModal = onError; // Use the provided resources instead of reloading them

      HashBrown.Helpers.RequestHelper.reloadAllResources = function () {
        resources = allResources;
        return Promise.resolve();
      }; // Listen for picked Media


      window.addEventListener('hashchange', function () {
        var isMediaView = location.hash.indexOf('#/media/') === 0;

        if (isMediaView) {
          var id = location.hash.replace('#/media/', '');
          onPickMedia(id);
        }
      }); // Listen for resource change

      HashBrown.Views.Navigation.NavbarMain.reload = function () {
        Crisp.View.get('NavbarMain').reload();
        onChangeResource();
      }; // Set visual fixes for media picker mode


      $('.page--environment').addClass('media-picker');
    }
  }]);

  return MediaHelper;
}(MediaHelperCommon);

module.exports = MediaHelper;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper for Media objects
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MediaHelper =
/*#__PURE__*/
function () {
  function MediaHelper() {
    _classCallCheck(this, MediaHelper);
  }

  _createClass(MediaHelper, null, [{
    key: "getRootPath",

    /**
     * Gets the media root path
     *
     * @returns {Promise} Path
     */
    value: function getRootPath() {
      return ConnectionHelper.getMediaProvider().then(function (connection) {
        resolve(connection.getMediaPath());
      }).catch(function () {
        resolve('');
      });
    }
    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */

  }, {
    key: "getTree",
    value: function getTree() {
      return Promise.resolve({});
    }
    /**
     * Sets a Media tree item
     *
     * @param {String} id
     * @param {Object} item
     *
     * @returns {Promise} promise
     */

  }, {
    key: "setTreeItem",
    value: function setTreeItem(id, item) {
      return Promise.resolve();
    }
    /**
     * Gets the media temp path
     *
     * @param {String} project
     *
     * @returns {String} Path
     */

  }, {
    key: "getTempPath",
    value: function getTempPath(project) {
      checkParam(project, 'project', String);
      var path = '/storage/' + ProjectHelper.currentProject + '/temp';
      return path;
    }
  }]);

  return MediaHelper;
}();

module.exports = MediaHelper;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper class for managing projects client side
 *
 * @memberof HashBrown.Client.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ProjectHelper =
/*#__PURE__*/
function () {
  function ProjectHelper() {
    _classCallCheck(this, ProjectHelper);
  }

  _createClass(ProjectHelper, null, [{
    key: "currentProject",

    /**
     * Gets the current project id
     *
     * @return {String} Project id
     */
    get: function get() {
      var parts = location.pathname.substring(1).split('/');

      if (parts.indexOf('dashboard') > -1) {
        return null;
      }

      return parts[0];
    }
    /**
     * Gets the current environment name
     *
     * @return {String} Environment name
     */

  }, {
    key: "currentEnvironment",
    get: function get() {
      var parts = location.pathname.substring(1).split('/');

      if (parts.indexOf('dashboard') > -1) {
        return null;
      }

      return parts[1];
    }
  }]);

  return ProjectHelper;
}();

module.exports = ProjectHelper;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper class for making HTTP/S requests
 *
 * @memberof HashBrown.Client.Helpers
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RequestHelper =
/*#__PURE__*/
function () {
  function RequestHelper() {
    _classCallCheck(this, RequestHelper);
  }

  _createClass(RequestHelper, null, [{
    key: "request",

    /**
     * An environment specific request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} Response
     */
    value: function request(method, url, data) {
      return RequestHelper.customRequest(method, RequestHelper.environmentUrl(url), data);
    }
    /**
     * Uploads a file
     *
     * @param {String} url
     * @param {String} type
     * @param {FormData} data
     *
     * @returns {Promise} Response
     */

  }, {
    key: "uploadFile",
    value: function uploadFile(url, type, data) {
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: RequestHelper.environmentUrl(url),
          type: 'POST',
          data: data,
          processData: false,
          contentType: false,
          success: function success(response) {
            resolve(response);
          },
          error: function error(e) {
            reject(e);
          }
        });
      }); //return RequestHelper.customRequest('POST', RequestHelper.environmentUrl(url), data, { 'Content-Type': type });
    }
    /**
     * An environment-independent request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     * @param {Object} headers
     *
     * @returns {Promise} Response
     */

  }, {
    key: "customRequest",
    value: function customRequest(method, url, data, headers) {
      headers = headers || {
        'Content-Type': 'application/json; charset=utf-8'
      };
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url);

        for (var k in headers) {
          xhr.setRequestHeader(k, headers[k]);
        }

        if (data) {
          if (_typeof(data) === 'object' && data instanceof FormData === false) {
            data = JSON.stringify(data);
          }

          xhr.send(data);
        } else {
          xhr.send();
        }

        xhr.onreadystatechange = function () {
          var DONE = 4;
          var OK = 200;
          var NOT_MODIFIED = 304;
          var UNAUTHORIZED = 403;

          if (xhr.readyState === DONE) {
            if (xhr.status === UNAUTHORIZED) {
              location = '/login/?path=' + location.pathname + location.hash;
              reject(new Error('User is not logged in'));
            } else if (xhr.status == OK || xhr.status == NOT_MODIFIED) {
              var response = xhr.responseText;

              if (response && response != 'OK') {
                try {
                  response = JSON.parse(response);
                } catch (e) {// If the response isn't JSON, then so be it
                }
              }

              if (response === '') {
                response = null;
              }

              resolve(response);
            } else {
              var error = new Error(xhr.responseText);
              error.statusCode = xhr.status;
              reject(error);
            }
          }
        };
      });
    }
    /**
     * Wraps a URL to include environment
     *
     * @param {String} url
     */

  }, {
    key: "environmentUrl",
    value: function environmentUrl(url) {
      var newUrl = '/api/';

      if (HashBrown.Helpers.ProjectHelper.currentProject) {
        newUrl += HashBrown.Helpers.ProjectHelper.currentProject + '/';
      }

      if (HashBrown.Helpers.ProjectHelper.currentEnvironment) {
        newUrl += HashBrown.Helpers.ProjectHelper.currentEnvironment + '/';
      }

      newUrl += url;
      return newUrl;
    }
    /**
     * Listens for server restart
     */

  }, {
    key: "listenForRestart",
    value: function listenForRestart() {
      UI.messageModal('Restart', 'HashBrown is restarting...', false);

      function poke() {
        $.ajax({
          type: 'get',
          url: '/',
          success: function success() {
            location.reload();
          },
          error: function error() {
            poke();
          }
        });
      }

      poke();
    }
  }, {
    key: "reloadResource",

    /**
     * Reloads a resource
     */
    value: function reloadResource(name) {
      return RequestHelper.request('get', name).then(function (result) {
        window.resources[name] = result; // Apply correct model

        for (var i in window.resources[name]) {
          var object = window.resources[name][i];
          var model = null;

          switch (name) {
            case 'connections':
              model = new HashBrown.Models.Connection(object);
              break;

            case 'content':
              model = new HashBrown.Models.Content(object);
              break;

            case 'forms':
              model = new HashBrown.Models.Form(object);
              break;

            case 'users':
              model = new HashBrown.Models.User(object);
              break;

            case 'media':
              model = new HashBrown.Models.Media(object);
              break;

            case 'schemas':
              model = HashBrown.Helpers.SchemaHelper.getModel(object);
              break;

            default:
              return Promise.reject(new Error('Resource "' + name + '" has no model defined'));
          }

          window.resources[name][i] = model;
        }

        return Promise.resolve(result);
      }).catch(function (e) {
        // If the error is a 404, it's an intended response from the controller
        if (e.statusCode !== 404) {
          UI.errorModal(e);
        }

        window.resources[name] = [];
        return Promise.resolve([]);
      });
    }
  }, {
    key: "reloadAllResources",

    /**
     * Reloads all resources
     */
    value: function reloadAllResources() {
      $('.page--environment__spinner__messages').empty();
      var queue = ['content', 'schemas', 'media', 'connections', 'forms', 'users'];

      for (var _i = 0; _i < queue.length; _i++) {
        var item = queue[_i];

        var $msg = _.div({
          class: 'widget--spinner__message',
          'data-name': item
        }, item);

        $('.page--environment__spinner__messages').append($msg);
      }

      var processQueue = function processQueue() {
        var name = queue.shift();
        return RequestHelper.reloadResource(name).then(function () {
          $('.page--environment__spinner__messages [data-name="' + name + '"]').toggleClass('loaded', true);

          if (queue.length < 1) {
            return Promise.resolve();
          } else {
            return processQueue();
          }
        });
      };

      return processQueue();
    }
  }]);

  return RequestHelper;
}();

module.exports = RequestHelper;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResourceHelper =
/*#__PURE__*/
function () {
  function ResourceHelper() {
    _classCallCheck(this, ResourceHelper);
  }

  _createClass(ResourceHelper, null, [{
    key: "indexedDbTransaction",

    /**
     * Opens a connection to the indexedDB
     *
     * @param {String} action
     * @param {String} store
     * @param {Object} query
     *
     * @return {Promise} Result
     */
    value: function indexedDbTransaction(action, store) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      checkParam(action, 'action', String);
      checkParam(store, 'store', String);
      checkParam(id, 'id', String);
      checkParam(data, 'data', Object);
      return new Promise(function (resolve, reject) {
        try {
          var request = indexedDB.open('hb_' + HashBrown.Helpers.ProjectHelper.currentProject + '_' + HashBrown.Helpers.ProjectHelper.currentEnvironment, 1);

          request.onsuccess = function (e) {
            resolve(e.target.result);
          };

          request.onerror = function (e) {
            reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
          };

          request.onupgradeneeded = function (e) {
            var db = e.target.result;
            db.createObjectStore('connections', {
              keyPath: 'id',
              autoIncrement: false
            });
            db.createObjectStore('content', {
              keyPath: 'id',
              autoIncrement: false
            });
            db.createObjectStore('schemas', {
              keyPath: 'id',
              autoIncrement: false
            });
            db.createObjectStore('media', {
              keyPath: 'id',
              autoIncrement: false
            });
            db.createObjectStore('forms', {
              keyPath: 'id',
              autoIncrement: false
            });
            db.createObjectStore('users', {
              keyPath: 'id',
              autoIncrement: false
            });
          };
        } catch (e) {
          reject(e);
        }
      }).then(function (db) {
        return new Promise(function (resolve, reject) {
          try {
            var objectStore = db.transaction([store], 'readwrite').objectStore(store);
            var request = null;

            if (action === 'put') {
              data.id = id;
              request = objectStore.put(data);
            } else if (action === 'get') {
              request = objectStore.get(id);
            } else if (action === 'delete') {
              request = objectStore.delete(id);
            }

            request.onsuccess = function (e) {
              resolve(e.target.result);
            };

            request.onerror = function (e) {
              reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
            };
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    /**
     * Removes a resource
     *
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */

  }, {
    key: "remove",
    value: function remove(category, id) {
      checkParam(category, 'category', String);
      checkParam(id, 'id', String);
      HashBrown.Helpers.EventHelper.trigger(category, id);
      return HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
    }
    /**
     * Gets a resource or a list of resources
     *
     * @param {Resource} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {Promise} Result
     */

  }, {
    key: "get",
    value: function get(model, category) {
      var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      checkParam(model, 'model', HashBrown.Models.Resource);
      checkParam(category, 'category', String);
      return HashBrown.Helpers.RequestHelper.request('get', category + (id ? '/' + id : '')).then(function (result) {
        if (!result) {
          throw new Error('Resource ' + category + (id ? '/' + id : '') + ' not found');
        }

        if (typeof model === 'function') {
          if (!Array.isArray(result)) {
            result = new model(result);
          } else {
            for (var i in result) {
              result[i] = new model(result[i]);
            }
          }
        }

        return Promise.resolve(result);
      });
    }
    /**
     * Sets a resource
     *
     * @param {String} category
     * @param {String} id
     * @param {Resource} data
     *
     * @returns {Promise} Result
     */

  }, {
    key: "set",
    value: function set(category, id, data) {
      checkParam(category, 'category', String);
      checkParam(category, 'id', String);
      checkParam(data, 'data', HashBrown.Models.Resource);
      HashBrown.Helpers.EventHelper.trigger(category, id);
      return HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data.getObject());
    }
  }]);

  return ResourceHelper;
}();

module.exports = ResourceHelper;

/***/ }),
/* 16 */
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

var SchemaHelperCommon = __webpack_require__(17);
/**
 * The client side Schema helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var SchemaHelper =
/*#__PURE__*/
function (_SchemaHelperCommon) {
  _inherits(SchemaHelper, _SchemaHelperCommon);

  function SchemaHelper() {
    _classCallCheck(this, SchemaHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(SchemaHelper).apply(this, arguments));
  }

  _createClass(SchemaHelper, null, [{
    key: "getSchemaWithParentFields",

    /**
     * Gets a Schema with all parent fields
     *
     * @param {String} id
     *
     * @returns {Promise} Schema with parent fields
     */
    value: function getSchemaWithParentFields(id) {
      if (!id) {
        return Promise.resolve(null);
      }

      return HashBrown.Helpers.RequestHelper.request('get', 'schemas/' + id + '/?withParentFields=true').then(function (schema) {
        return Promise.resolve(SchemaHelper.getModel(schema));
      });
    }
    /**
     * Gets a FieldSchema with all parent configs
     *
     * @param {String} id
     *
     * @returns {FieldSchema} Compiled FieldSchema
     */

  }, {
    key: "getFieldSchemaWithParentConfigs",
    value: function getFieldSchemaWithParentConfigs(id) {
      var fieldSchema = this.getSchemaByIdSync(id);

      if (!fieldSchema) {
        return null;
      }

      var nextSchema = this.getSchemaByIdSync(fieldSchema.parentSchemaId);
      var compiledSchema = new HashBrown.Models.FieldSchema(fieldSchema.getObject());

      while (nextSchema) {
        compiledSchema.appendConfig(nextSchema.config);
        nextSchema = this.getSchemaByIdSync(nextSchema.parentSchemaId);
      }

      return compiledSchema;
    }
    /**
     * Gets a Schema by id
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */

  }, {
    key: "getSchemaById",
    value: function getSchemaById(id) {
      var _this = this;

      return HashBrown.Helpers.RequestHelper.request('get', 'schemas/' + id).then(function (schema) {
        return Promise.resolve(_this.getModel(schema));
      });
    }
    /**
     * Gets all Schemas by type (sync)
     *
     * @param {String} type
     *
     * @returns {Array} All Schemas
     */

  }, {
    key: "getAllSchemasSync",
    value: function getAllSchemasSync(type) {
      if (!type) {
        return resources.schemas;
      }

      return resources.schemas.filter(function (schema) {
        if (schema.id == type + 'Base') {
          return false;
        }

        return schema.type === type;
      });
    }
    /**
     * Gets all Schemas
     *
     * @returns {Array} All Schemas
     */

  }, {
    key: "getAllSchemas",
    value: function getAllSchemas() {
      return HashBrown.Helpers.ResourceHelper.get(null, 'schemas').then(function (result) {
        var schemas = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var schema = _step.value;

            if (!schema.parentId) {
              continue;
            }

            if (schema.type === 'content') {
              schema = new HashBrown.Models.ContentSchema(schema);
            } else if (schema.type === 'field') {
              schema = new HashBrown.Models.FieldSchema(schema);
            }

            schemas.push(schema);
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

        return Promise.resolve(schemas);
      });
    }
    /**
     * Gets a Schema by id (sync)
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */

  }, {
    key: "getSchemaByIdSync",
    value: function getSchemaByIdSync(id) {
      for (var i in resources.schemas) {
        var schema = resources.schemas[i];

        if (schema.id == id) {
          if (schema instanceof HashBrown.Models.ContentSchema || schema instanceof HashBrown.Models.FieldSchema) {
            return schema;
          }

          return this.getModel(schema);
        }
      }
    }
  }]);

  return SchemaHelper;
}(SchemaHelperCommon);

module.exports = SchemaHelper;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * The common base for SchemaHelper
 *
 * @memberof HashBrown.Common.Helpers
 */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SchemaHelper =
/*#__PURE__*/
function () {
  function SchemaHelper() {
    _classCallCheck(this, SchemaHelper);
  }

  _createClass(SchemaHelper, null, [{
    key: "getSchemaWithParentFields",

    /**
     * Gets all parent fields
     *
     * @param {String} id
     *
     * @returns {Promise(Schema)} schema
     */
    value: function getSchemaWithParentFields(id) {
      return new Promise(function (callback) {
        callback();
      });
    }
    /**
     * Gets the appropriate model
     *
     * @param {Object} properties
     *
     * @return {Schema} Schema
     */

  }, {
    key: "getModel",
    value: function getModel(properties) {
      if (!properties) {
        return null;
      } // If the properties object is already a recognised model, return it


      if (properties instanceof HashBrown.Models.ContentSchema || properties instanceof HashBrown.Models.FieldSchema) {
        return properties;
      } // If the properties object is using an unrecognised model, serialise it


      if (typeof properties.getObject === 'function') {
        properties = properties.getObject();
      }

      if (properties.type === 'content') {
        return new HashBrown.Models.ContentSchema(properties);
      } else if (properties.type === 'field') {
        return new HashBrown.Models.FieldSchema(properties);
      }

      throw new Error('Schema data is incorrectly formatted: ' + JSON.stringify(properties));
    }
    /**
     * Merges two Schemas
     *
     * @param Schema childSchema
     * @param Schema parentSchema
     *
     * @returns {Schema} Merged Schema
     */

  }, {
    key: "mergeSchemas",
    value: function mergeSchemas(childSchema, parentSchema) {
      checkParam(childSchema, 'childSchema', HashBrown.Models.Schema);
      checkParam(parentSchema, 'parentSchema', HashBrown.Models.Schema);
      childSchema = childSchema.getObject();
      parentSchema = parentSchema.getObject();
      var mergedSchema = parentSchema; // Recursive merge

      function merge(parentValues, childValues) {
        for (var k in childValues) {
          if (_typeof(parentValues[k]) === 'object' && _typeof(childValues[k]) === 'object') {
            merge(parentValues[k], childValues[k]);
          } else if (childValues[k]) {
            parentValues[k] = childValues[k];
          }
        }
      } // Overwrite native values 


      mergedSchema.id = childSchema.id;
      mergedSchema.name = childSchema.name;
      mergedSchema.parentSchemaId = childSchema.parentSchemaId;
      mergedSchema.icon = childSchema.icon || mergedSchema.icon; // Specific values for schema types

      switch (mergedSchema.type) {
        case 'field':
          mergedSchema.editorId = mergedSchema.editorId || parentSchema.editorId; // Merge config

          if (!mergedSchema.config) {
            mergedSchema.config = {};
          }

          if (!parentSchema.config) {
            parentSchema.config = {};
          }

          merge(mergedSchema.config, childSchema.config);
          break;

        case 'content':
          // Merge tabs
          if (!mergedSchema.tabs) {
            mergedSchema.tabs = {};
          }

          if (!childSchema.tabs) {
            childSchema.tabs = {};
          }

          merge(mergedSchema.tabs, childSchema.tabs); // Merge fields

          if (!mergedSchema.fields) {
            mergedSchema.fields = {};
          }

          if (!mergedSchema.fields.properties) {
            mergedSchema.fields.properties = {};
          }

          if (!childSchema.fields) {
            childSchema.fields = {};
          }

          if (!childSchema.fields.properties) {
            childSchema.fields.properties = {};
          }

          merge(mergedSchema.fields, childSchema.fields); // Set default tab id

          mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
          break;
      }

      return this.getModel(mergedSchema);
    }
  }]);

  return SchemaHelper;
}();

module.exports = SchemaHelper;

/***/ }),
/* 18 */
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

var SettingsHelperCommon = __webpack_require__(19);
/**
 * The client side settings helper
 *
 * @memberof HashBrown.Client.Helpers
 */


var SettingsHelper =
/*#__PURE__*/
function (_SettingsHelperCommon) {
  _inherits(SettingsHelper, _SettingsHelperCommon);

  function SettingsHelper() {
    _classCallCheck(this, SettingsHelper);

    return _possibleConstructorReturn(this, _getPrototypeOf(SettingsHelper).apply(this, arguments));
  }

  _createClass(SettingsHelper, null, [{
    key: "getSettings",

    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise(Object)}  settings
     */
    value: function getSettings(project) {
      var _this = this;

      var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      checkParam(project, 'project', String);

      if (environment === '*') {
        environment = null;
      }

      var apiUrl = '/api/' + project + '/';

      if (environment) {
        apiUrl += environment + '/';
      }

      apiUrl += 'settings';

      if (section) {
        apiUrl += '/' + section;
      }

      return HashBrown.Helpers.RequestHelper.customRequest('get', apiUrl) // Cache settings client-side
      .then(function (settings) {
        _this.updateCache(project, environment, section, settings);

        return Promise.resolve(settings || {});
      });
    }
    /**
     * Cache update
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     */

  }, {
    key: "cacheSanityCheck",
    value: function cacheSanityCheck(project) {
      var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      checkParam(project, 'project', String);

      if (environment === '*') {
        environment = null;
      }

      this.cache = this.cache || {};
      this.cache[project] = this.cache[project] || {};

      if (environment) {
        this.cache[project][environment] = this.cache[project][environment] || {};

        if (section) {
          this.cache[project][environment][section] = this.cache[project][environment][section] || {};
        }
      } else if (section) {
        this.cache[project][section] = this.cache[project][section] || {};
      }
    }
    /**
     * Cache update
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     */

  }, {
    key: "updateCache",
    value: function updateCache(project) {
      var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var settings = arguments.length > 3 ? arguments[3] : undefined;
      checkParam(project, 'project', String);
      checkParam(settings, 'settings', Object);

      if (environment === '*') {
        environment = null;
      }

      this.cacheSanityCheck(project, environment, section);

      if (environment && !section) {
        return this.cache[project][environment] = settings;
      }

      if (!environment && section) {
        return this.cache[project][section] = settings;
      }

      if (environment && section) {
        return this.cache[project][environment][section] = settings;
      }

      return this.cache[project] = settings;
    }
    /**
     * Gets cached settings
     *
     * @param {String} section
     *
     * @returns {Object} Settings
     */

  }, {
    key: "getCachedSettings",
    value: function getCachedSettings(project) {
      var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      checkParam(project, 'project', String);

      if (environment === '*') {
        environment = null;
      }

      this.cacheSanityCheck(project, environment, section);

      if (environment) {
        if (section) {
          return this.cache[project][environment][section];
        }

        return this.cache[project][environment];
      }

      if (section) {
        return this.cache[project][section];
      }

      return this.cache[project];
    }
    /**
     * Sets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */

  }, {
    key: "setSettings",
    value: function setSettings(project) {
      var _this2 = this;

      var environment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var section = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var settings = arguments.length > 3 ? arguments[3] : undefined;
      checkParam(project, 'project', String);
      checkParam(settings, 'settings', Object);

      if (environment === '*') {
        environment = null;
      }

      var apiUrl = '/api/' + project + '/';
      settings.usedBy = 'project';

      if (environment) {
        apiUrl += environment + '/';
        settings.usedBy = environment;
      }

      apiUrl += 'settings';

      if (section) {
        apiUrl += '/' + section;
      }

      return HashBrown.Helpers.RequestHelper.customRequest('post', apiUrl, settings) // Cache new settings
      .then(function () {
        _this2.updateCache(project, environment, section, settings);

        return Promise.resolve();
      });
    }
  }]);

  return SettingsHelper;
}(SettingsHelperCommon);

module.exports = SettingsHelper;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A helper for settings
 *
 * @memberof HashBrown.Common.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SettingsHelper = function SettingsHelper() {
  _classCallCheck(this, SettingsHelper);
};

module.exports = SettingsHelper;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A UI helper for creating and handling common interface behaviours
 *
 * @memberof HashBrown.Client.Helpers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UIHelper =
/*#__PURE__*/
function () {
  function UIHelper() {
    _classCallCheck(this, UIHelper);
  }

  _createClass(UIHelper, null, [{
    key: "highlight",

    /**
     * Highlights an element with an optional label
     *
     * @param {Boolean|HTMLElement} element
     * @param {String} label
     * @param {String} direction
     * @param {String} buttonLabel
     *
     * @return {Promise} Callback on dismiss
     */
    value: function highlight(element, label) {
      var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'right';
      var buttonLabel = arguments.length > 3 ? arguments[3] : undefined;

      if (element === false) {
        $('.widget--highlight').remove();
        return;
      }

      if (typeof element === 'string') {
        element = document.querySelector(element);
      }

      if (!element) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        var dismiss = function dismiss() {
          $highlight.remove();
          resolve(element);
        };

        var $highlight = _.div({
          class: 'widget--highlight' + (label ? ' ' + direction : ''),
          style: 'top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;'
        }, _.div({
          class: 'widget--highlight__backdrop'
        }), _.div({
          class: 'widget--highlight__frame',
          style: 'width: ' + element.offsetWidth + 'px; height: ' + element.offsetHeight + 'px;'
        }), _.if(label, _.div({
          class: 'widget--highlight__label'
        }, _.div({
          class: 'widget--highlight__label__text'
        }, label), _.if(buttonLabel, _.button({
          class: 'widget widget--button widget--highlight__button condensed'
        }, buttonLabel).click(function () {
          dismiss();
        }))))).click(function () {
          if (buttonLabel) {
            return;
          }

          dismiss();
        });

        _.append(element.parentElement, $highlight);
      });
    }
    /**
     * Sets the content of the editor space
     *
     * @param {Array|HTMLElement} content
     * @param {String} className
     */

  }, {
    key: "setEditorSpaceContent",
    value: function setEditorSpaceContent(content, className) {
      var $space = $('.page--environment__space--editor');

      if (className) {
        content = _.div({
          class: 'page--environment__space--editor__' + className
        }, content);
      }

      _.append($space.empty(), content);
    }
    /**
     * Creates a sortable context specific to arrays using editor fields
     *
     * @param {Array} array
     * @param {HTMLElement} field
     * @param {Function} onChange
     */

  }, {
    key: "fieldSortableArray",
    value: function fieldSortableArray(array, field, onChange) {
      array = array || []; // Set indices on all elements

      var items = field.querySelector('.editor__field__value').children;

      for (var i = 0; i < items.length; i++) {
        if (items[i] instanceof HTMLElement === false || !items[i].classList.contains('editor__field')) {
          continue;
        }

        items[i].dataset.index = i;
      } // Init the sortable context


      this.fieldSortable(field, function (element) {
        if (!element) {
          return;
        }

        var oldIndex = element.dataset.index;
        var newIndex = 0; // Discover new index

        var items = field.querySelector('.editor__field__value').children;

        for (var _i = 0; _i < items.length; _i++) {
          if (items[_i] === element) {
            newIndex = _i;
            break;
          }
        } // Swap indices


        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        onChange(array);
      });
    }
    /**
     * Creates a sortable context specific to objects using editor fields
     *
     * @param {Object} object
     * @param {HTMLElement} field
     * @param {Function} onChange
     */

  }, {
    key: "fieldSortableObject",
    value: function fieldSortableObject(object, field, onChange) {
      object = object || {};
      this.fieldSortable(field, function (element) {
        if (!element) {
          return;
        }

        var itemSortKeyElement = element.querySelector('.editor__field__sort-key');
        var itemKey = itemSortKeyElement.value || itemSortKeyElement.innerHTML;
        var itemValue = object[itemKey]; // Try to get the next key

        var nextKey = '';
        var nextSortKeyElement = element.nextElementSibling ? element.nextElementSibling.querySelector('.editor__field__sort-key') : null;

        if (nextSortKeyElement) {
          nextKey = nextSortKeyElement.value || nextSortKeyElement.innerHTML;
        } // Construct a new object based on the old one


        var newObject = {};

        for (var fieldKey in object) {
          // Omit existing key
          if (fieldKey === itemKey) {
            continue;
          }

          var fieldValue = object[fieldKey]; // If there is a next key, and it's the same as this field key,
          // the sorted item should be inserted just before it

          if (nextKey === fieldKey) {
            newObject[itemKey] = itemValue;
          }

          newObject[fieldKey] = fieldValue;
        } // If the item wasn't reinserted, insert it now


        if (!newObject[itemKey]) {
          newObject[itemKey] = itemValue;
        } // Assign the new object to the old one


        object = newObject; // Fire the change event

        onChange(newObject);
      });
    }
    /**
     * Creates a sortable context specific to fields
     *
     * @param {HTMLElement} field
     * @param {Function} onChange
     */

  }, {
    key: "fieldSortable",
    value: function fieldSortable(field, onChange) {
      var btnSort = field.querySelector('.editor__field__key__action--sort');
      var divValue = field.querySelector('.editor__field__value');
      var isSorting = !divValue.classList.contains('sorting');

      if (this.sortable(divValue, 'editor__field', isSorting, onChange)) {
        btnSort.classList.toggle('sorting', isSorting);
        divValue.classList.toggle('sorting', isSorting);
      }
    }
    /**
     * Creates a sortable context
     *
     * @param {HTMLElement} parentElement
     * @param {String} sortableClassName
     * @param {Boolean} isActive
     * @param {Function} onChange
     *
     * @returns {Boolean} Whether or not sorting was initialised
     */

  }, {
    key: "sortable",
    value: function sortable(parentElement, sortableClassName, isActive, onChange) {
      var children = Array.prototype.slice.call(parentElement.children || []);
      var canSort = true;
      var currentDraggedChild;
      children = children.filter(function (child) {
        return child instanceof HTMLElement && child.classList.contains(sortableClassName);
      });

      if (!children || children.length < 1) {
        return false;
      }

      if (typeof isActive === 'undefined') {
        isActive = !parentElement.classList.contains('sorting');
      }

      if (isActive) {
        parentElement.ondragover = function (e) {
          if (!canSort || !currentDraggedChild) {
            return;
          }

          var bodyRect = document.body.getBoundingClientRect();

          _.each(children, function (i, sibling) {
            if (sibling === currentDraggedChild || !canSort || e.pageY < 1) {
              return;
            }

            var cursorY = e.pageY;
            var childY = currentDraggedChild.getBoundingClientRect().y - bodyRect.y;
            var siblingY = sibling.getBoundingClientRect().y - bodyRect.y;
            var hasMoved = false; // Dragging above a sibling

            if (cursorY < siblingY && childY > siblingY) {
              sibling.parentElement.insertBefore(currentDraggedChild, sibling);
              hasMoved = true;
            } // Dragging below a sibling


            if (cursorY > siblingY && childY < siblingY) {
              sibling.parentElement.insertBefore(currentDraggedChild, sibling.nextElementSibling);
              hasMoved = true;
            } // Init transition


            if (hasMoved) {
              canSort = false;
              var newChildY = currentDraggedChild.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
              var newSiblingY = sibling.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
              currentDraggedChild.style.transform = 'translateY(' + (childY - newChildY) + 'px)';
              sibling.style.transform = 'translateY(' + (siblingY - newSiblingY) + 'px)';
              setTimeout(function () {
                currentDraggedChild.removeAttribute('style');
                sibling.removeAttribute('style');
                canSort = true;
              }, 100);
            }
          });
        };
      } else {
        parentElement.ondragover = null;
      }

      _.each(children, function (i, child) {
        child.draggable = isActive;

        if (isActive) {
          child.ondragstart = function (e) {
            e.dataTransfer.setData('text/plain', '');
            child.classList.toggle('dragging', true);
            currentDraggedChild = child;
          };

          child.ondragend = function (e) {
            onChange(child);
            currentDraggedChild = null;
            child.classList.toggle('dragging', false);
          };

          child.ondragcancel = function (e) {
            onChange(child);
            currentDraggedChild = null;
            child.classList.toggle('dragging', false);
          };
        } else {
          child.classList.toggle('dragging', false);
          child.ondragstart = null;
          child.ondrag = null;
          child.ondragstop = null;
          child.ondragcancel = null;
          currentDraggedChild = null;
        }
      });

      parentElement.classList.toggle('sorting', isActive);
      return true;
    }
    /**
     * Creates a switch
     *
     * @param {Boolean} initialValue
     * @param {Function} onChange
     *
     * @returns {HTMLElement} Switch element
     */

  }, {
    key: "inputSwitch",
    value: function inputSwitch(initialValue, onChange) {
      var id = 'switch-' + (10000 + Math.floor(Math.random() * 10000));
      var $input;

      var $element = _.div({
        class: 'switch',
        'data-checked': initialValue
      }, $input = _.input({
        id: id,
        class: 'form-control switch',
        type: 'checkbox'
      }).change(function () {
        this.parentElement.dataset.checked = this.checked;

        if (onChange) {
          onChange(this.checked);
        }
      }), _.label({
        for: id
      }));

      $element.on('set', function (e, newValue) {
        $input[0].checked = newValue;
      });

      if (initialValue) {
        $input.attr('checked', true);
      }

      return $element;
    }
    /**
     * Creates a group of chips
     *
     * @param {Array} items
     * @param {Array} dropdownItems
     * @param {Function} onChange
     * @param {Boolean} isDropdownUnique
     *
     * @returns {HtmlElement} Chip group element
     */

  }, {
    key: "inputChipGroup",
    value: function inputChipGroup(items, dropdownItems, onChange, isDropdownUnique) {
      var $element = _.div({
        class: 'chip-group'
      });

      if (!items) {
        items = [];
      }

      function render() {
        _.append($element.empty(), // Render individual chips
        _.each(items, function (itemIndex, item) {
          var label = item.label || item.name || item.title;

          if (!label) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = dropdownItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var dropdownItem = _step.value;
                var value = dropdownItem.id || dropdownItem.value || dropdownItem;

                if (value === item) {
                  label = dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem;
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

          if (!label) {
            label = item;
          }

          var $chip = _.div({
            class: 'chip'
          }, // Dropdown
          _.if(Array.isArray(dropdownItems), _.div({
            class: 'chip-label dropdown'
          }, _.button({
            class: 'dropdown-toggle',
            'data-toggle': 'dropdown'
          }, label), _.if(onChange, _.ul({
            class: 'dropdown-menu'
          }, _.each(dropdownItems, function (dropdownItemIndex, dropdownItem) {
            // Look for unique dropdown items
            if (isDropdownUnique) {
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var _item = _step2.value;

                  if (_item == dropdownItem) {
                    return;
                  }
                }
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
            }

            return _.li(_.a({
              href: '#'
            }, dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem).click(function (e) {
              e.preventDefault();
              items[itemIndex] = dropdownItem.value || dropdownItem.id || dropdownItem;
              render();

              if (typeof onChange === 'function') {
                onChange(items);
              }
            }));
          }))))), // Regular string
          _.if(!Array.isArray(dropdownItems), _.if(!onChange, _.p({
            class: 'chip-label'
          }, item)), _.if(onChange, _.input({
            type: 'text',
            class: 'chip-label',
            value: item
          }).change(function (e) {
            items[itemIndex] = e.target.value;
          }))), // Remove button
          _.if(onChange, _.button({
            class: 'btn chip-remove'
          }, _.span({
            class: 'fa fa-remove'
          })).click(function () {
            items.splice(itemIndex, 1);
            render();

            if (typeof onChange === 'function') {
              onChange(items);
            }
          })));

          return $chip;
        }), // Add button
        _.if(onChange, _.button({
          class: 'btn chip-add'
        }, _.span({
          class: 'fa fa-plus'
        })).click(function () {
          if (Array.isArray(dropdownItems)) {
            if (isDropdownUnique) {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = dropdownItems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var dropdownItem = _step3.value;
                  var isSelected = false;
                  var _iteratorNormalCompletion4 = true;
                  var _didIteratorError4 = false;
                  var _iteratorError4 = undefined;

                  try {
                    for (var _iterator4 = items[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                      var item = _step4.value;

                      if (item == dropdownItem) {
                        isSelected = true;
                        break;
                      }
                    }
                  } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                        _iterator4.return();
                      }
                    } finally {
                      if (_didIteratorError4) {
                        throw _iteratorError4;
                      }
                    }
                  }

                  if (!isSelected) {
                    items.push(dropdownItem.value || dropdownItem);
                    break;
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            } else {
              items.push(dropdownItems[0].value || dropdownItems[0]);
            }
          } else if (typeof dropdownItems === 'string') {
            items.push(dropdownItems);
          } else {
            items.push('New item');
          }

          render();

          if (typeof onChange === 'function') {
            onChange(items);
          }
        })));
      }

      ;
      render();
      return $element;
    }
    /**
     * Renders a carousel
     *
     * @param {Array} items
     * @param {Boolean} useIndicators
     * @param {Boolean} useControls
     * @param {String} height
     *
     * @returns {HtmlElement} Carousel element
     */

  }, {
    key: "carousel",
    value: function carousel(items, useIndicators, useControls, height) {
      var id = 'carousel-' + (10000 + Math.floor(Math.random() * 10000));
      return _.div({
        class: 'carousel slide',
        id: id,
        'data-ride': 'carousel',
        'data-interval': 0
      }, _.if(useIndicators, _.ol({
        class: 'carousel-indicators'
      }, _.each(items, function (i, item) {
        return _.li({
          'data-target': '#' + id,
          'data-slide-to': i,
          class: i == 0 ? 'active' : ''
        });
      }))), _.div({
        class: 'carousel-inner',
        role: 'listbox'
      }, _.each(items, function (i, item) {
        return _.div({
          class: 'item' + (i == 0 ? ' active' : ''),
          style: 'height:' + (height || '500px')
        }, item);
      })), _.if(useControls, _.a({
        href: '#' + id,
        role: 'button',
        class: 'left carousel-control',
        'data-slide': 'prev'
      }, _.span({
        class: 'fa fa-arrow-left'
      })), _.a({
        href: '#' + id,
        role: 'button',
        class: 'right carousel-control',
        'data-slide': 'next'
      }, _.span({
        class: 'fa fa-arrow-right'
      }))));
    }
    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */

  }, {
    key: "errorModal",
    value: function errorModal(error, onClickOK) {
      if (!error) {
        return;
      }

      if (error instanceof String) {
        error = new Error(error);
      } else if (error instanceof Object) {
        if (error.responseText) {
          error = new Error(error.responseText);
        }
      } else if (error instanceof Error === false) {
        error = new Error(error.toString());
      }

      debug.log(error.message + ': ' + error.stack, 'HashBrown');
      return UIHelper.messageModal('<span class="fa fa-warning"></span> Error', error.message, onClickOK, 'error');
    }
    /**
     * Brings up a warning modal
     *
     * @param {String} warning
     * @param {Function} onClickOK
     */

  }, {
    key: "warningModal",
    value: function warningModal(warning, onClickOK) {
      if (!warning) {
        return;
      }

      return UIHelper.messageModal('<span class="fa fa-warning"></span> Warning', warning, onClickOK, 'warning');
    }
    /**
     * Brings up a message modal
     *
     * @param {String} title
     * @param {String} body
     * @param {Function} onClickOK
     * @param {String} group
     */

  }, {
    key: "messageModal",
    value: function messageModal(title, body, onClickOK, group) {
      var modal = new HashBrown.Views.Modals.Modal({
        isBlocking: onClickOK === false,
        title: title,
        group: group,
        body: body
      });

      if (onClickOK) {
        modal.on('ok', onClickOK);
      }

      return modal;
    }
    /**
     * Brings up an iframe modal
     *
     * @param {String} title
     * @param {String} url
     * @param {Function} onSubmit
     * @param {Function} onCancel
     */

  }, {
    key: "iframeModal",
    value: function iframeModal(title, url, onSubmit, onCancel) {
      var modal = new HashBrown.Views.Modals.IframeModal({
        title: title,
        url: url
      });

      if (typeof onSubmit === 'function') {
        modal.on('ok', onSubmit);
      }

      if (typeof onCancel === 'function') {
        modal.on('cancel', onCancel);
      }

      return modal;
    }
    /**
     * Brings up a confirm modal
     *
     * @param {String} type
     * @param {String} title
     * @param {String} body
     * @param {Function} onSubmit
     */

  }, {
    key: "confirmModal",
    value: function confirmModal(type, title, body, onSubmit, onCancel) {
      var modal = new HashBrown.Views.Modals.ConfirmModal({
        type: type ? type.toLowerCase() : null,
        title: title,
        body: body
      });
      modal.on('cancel', onCancel);
      modal.on('ok', onSubmit);
      return modal;
    }
    /**
     * Creates a context menu
     */

  }, {
    key: "context",
    value: function context(element, items) {
      var openContextMenu = function openContextMenu(e) {
        // Find any existing context menu targets and remove their classes
        var clearTargets = function clearTargets() {
          var targets = document.querySelectorAll('.context-menu-target');

          if (targets) {
            for (var i = 0; i < targets.length; i++) {
              targets[i].classList.remove('context-menu-target');
            }
          }
        };

        clearTargets(); // Set new target

        element.classList.toggle('context-menu-target', true); // Remove existing dropdowns

        var existingMenu = _.find('.widget--dropdown.context-menu');

        if (existingMenu) {
          existingMenu.remove();
        } // Init new dropdown


        var dropdown = new HashBrown.Views.Widgets.Dropdown({
          options: items,
          reverseKeys: true,
          onChange: function onChange(pickedItem) {
            if (typeof pickedItem !== 'function') {
              return;
            }

            pickedItem();
          }
        }); // Prevent the toggle button from blocking new context menu events

        var toggle = dropdown.element.querySelector('.widget--dropdown__toggle');
        toggle.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          dropdown.toggle(false);
        }); // Set cancel event

        dropdown.on('cancel', function () {
          dropdown.remove(); // Wait a bit before removing the classes, as they are often used as references in the functions executed by the context menu

          setTimeout(function () {
            clearTargets();
          }, 100);
        }); // Set styles

        dropdown.element.classList.toggle('context-menu', true);
        dropdown.element.style.top = e.touches ? e.touches[0].pageY : e.pageY;
        dropdown.element.style.left = e.touches ? e.touches[0].pageX : e.pageX; // Open it

        dropdown.toggle(true); // Append to body

        document.body.appendChild(dropdown.element);
      };

      element.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openContextMenu(e);
      });
      element.addEventListener('click', function (e) {
        if (e.which === 3 || e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e);
        }
      });
      element.addEventListener('touchstart', function (e) {
        if (e.touchTargets && e.touchTargets.length > 1) {
          e.preventDefault();
          e.stopPropagation();
          openContextMenu(e);
        }
      });
    }
  }]);

  return UIHelper;
}();

module.exports = UIHelper;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EVENTS = {};
/**
 * A helper class for triggering and registering EVENTS
 *
 * @memberof HashBrown.Client.Helpers
 */

var EventHelper =
/*#__PURE__*/
function () {
  function EventHelper() {
    _classCallCheck(this, EventHelper);
  }

  _createClass(EventHelper, null, [{
    key: "on",

    /**
     * Bind an event
     *
     * @param {String} type
     * @param {String} id
     * @param {Function} callback
     */
    value: function on(type, id, callback) {
      checkParam(type, 'type', String);
      checkParam(id, 'id', String);
      checkParam(callback, 'callback', Function);

      if (!EVENTS[type]) {
        EVENTS[type] = {};
      }

      EVENTS[type][id] = callback;
    }
    /**
     * Unbind an event
     *
     * @param {String} type
     * @param {String} id
     */

  }, {
    key: "off",
    value: function off(type, id) {
      checkParam(type, 'type', String);
      checkParam(id, 'id', String);

      if (!EVENTS[type]) {
        return;
      }

      delete EVENTS[type][id];
    }
    /**
     * Triggers an event type
     *
     * @param {String} type
     * @param {*} value
     */

  }, {
    key: "trigger",
    value: function trigger(type, value) {
      if (!EVENTS[type]) {
        return;
      }

      for (var id in EVENTS[type]) {
        if (typeof EVENTS[type][id] !== 'function') {
          continue;
        }

        EVENTS[type][id](value);
      }
    }
  }]);

  return EventHelper;
}();

module.exports = EventHelper;

/***/ })
/******/ ]);
//# sourceMappingURL=helpers.js.map