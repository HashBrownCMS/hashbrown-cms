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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 271);
/******/ })
/************************************************************************/
/******/ ({

/***/ 271:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.currentUserIsAdmin = function () {
    return true;
};
window.currentUserHasScope = function () {
    return true;
};
window.startDebugSocket = function () {};

HashBrown.Models.User.current = new HashBrown.Models.User({
    id: '93afb0e4cd9e7545c589a084079e340766f94xb1',
    isAdmin: true,
    isCurrent: true,
    username: 'demouser',
    fullName: 'Demo User',
    email: 'demo@user.com',
    scopes: {}
});

/**
 * Wraps an API call with a custom path
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */
window.customApiCall = function customApiCall(method, url, data) {
    var cache = localStorage.getItem('demo') || '{}';

    try {
        cache = JSON.parse(cache);
    } catch (e) {
        cache = {};
    }

    cache.api = cache.api || {};

    method = method.toUpperCase();

    return new Promise(function (resolve, reject) {
        // Set a timeout, so we feel like it's an ajax call
        setTimeout(function () {
            switch (method) {
                case 'GET':
                    return resolve({});
            }

            resolve();
        }, 100);
    });
};

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    var model = null;
    var result = [];

    switch (name) {
        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'schemas':
            result = {
                'contentBase': __webpack_require__(273),
                'page': __webpack_require__(274),
                'array': __webpack_require__(275),
                'boolean': __webpack_require__(276),
                'contentReference': __webpack_require__(277),
                'contentSchemaReference': __webpack_require__(278),
                'date': __webpack_require__(279),
                'dropdown': __webpack_require__(280),
                'fieldBase': __webpack_require__(281),
                'language': __webpack_require__(282),
                'mediaReference': __webpack_require__(283),
                'number': __webpack_require__(284),
                'resourceReference': __webpack_require__(285),
                'richText': __webpack_require__(286),
                'string': __webpack_require__(287),
                'struct': __webpack_require__(288),
                'tags': __webpack_require__(289),
                'templateReference': __webpack_require__(290),
                'url': __webpack_require__(291)
            };

            for (var k in result) {
                if (k === 'contentBase' || k === 'page') {
                    result[k].type = 'content';
                } else {
                    result[k].type = 'field';
                }

                result[k].locked = true;
            }

            break;
    }

    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            window.resources[name] = result;

            // If a model is specified, use it to initialise every resource
            if (model) {
                for (var i in window.resources[name]) {
                    window.resources[name][i] = new model(window.resources[name][i]);
                }
            }

            resolve(result);
        }, 100);
    });
};

/***/ }),

/***/ 273:
/***/ (function(module, exports) {

module.exports = {"defaultTabId":"meta","icon":"cogs","name":"Content Base","fields":{"createDate":{"disabled":"true","label":"Created at","schemaId":"date"},"updateDate":{"disabled":"true","label":"Updated at","schemaId":"date"},"createdBy":{"disabled":"true","label":"Created by","schemaId":"resourceReference","config":{"resource":"users","resourceKeys":["fullName","username"]}},"updatedBy":{"disabled":"true","label":"Updated by","schemaId":"resourceReference","config":{"resource":"users","resourceKeys":["fullName","username"]}},"publishOn":{"label":"Publish on","schemaId":"date"},"unpublishOn":{"label":"Unpublish on","schemaId":"date"},"schemaId":{"label":"Schema","schemaId":"contentSchemaReference","config":{"allowedSchemas":"fromParent"}},"properties":{"title":{"label":"Title","schemaId":"string"}}}}

/***/ }),

/***/ 274:
/***/ (function(module, exports) {

module.exports = {"icon":"file","name":"Page","parentSchemaId":"contentBase","tabs":{"content":"Content"},"defaultTabId":"content","fields":{"properties":{"title":{"label":"Title","schemaId":"string","tabId":"content"},"description":{"label":"Description","schemaId":"string","tabId":"content"},"template":{"label":"Template","schemaId":"templateReference","tabId":"content","config":{"allowedTemplates":[]}},"url":{"label":"URL","schemaId":"url","tabId":"content"}}}}

/***/ }),

/***/ 275:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ArrayEditor","icon":"list-ol","name":"Array"}

/***/ }),

/***/ 276:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"BooleanEditor","icon":"toggle-on","name":"Boolean"}

/***/ }),

/***/ 277:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ContentReferenceEditor","icon":"file","name":"Content Reference"}

/***/ }),

/***/ 278:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ContentSchemaReferenceEditor","icon":"gears","name":"Content Schema Reference"}

/***/ }),

/***/ 279:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"DateEditor","icon":"calendar","name":"Date"}

/***/ }),

/***/ 280:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"DropdownEditor","icon":"list-alt","name":"Dropdown"}

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

module.exports = {"name":"Field Base","icon":"cogs"}

/***/ }),

/***/ 282:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"LanguageEditor","icon":"globe","name":"Language"}

/***/ }),

/***/ 283:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"MediaReferenceEditor","icon":"file-image-o","name":"Media Reference"}

/***/ }),

/***/ 284:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"NumberEditor","icon":"sort-numeric-asc","name":"Number"}

/***/ }),

/***/ 285:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ResourceReferenceEditor","icon":"book","name":"Resource Reference"}

/***/ }),

/***/ 286:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"RichTextEditor","icon":"font","name":"Rich Text"}

/***/ }),

/***/ 287:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"StringEditor","icon":"font","name":"String"}

/***/ }),

/***/ 288:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"StructEditor","icon":"cubes","name":"Struct"}

/***/ }),

/***/ 289:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"TagsEditor","icon":"tag","name":"Tags"}

/***/ }),

/***/ 290:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"TemplateReferenceEditor","icon":"code","name":"Template Reference"}

/***/ }),

/***/ 291:
/***/ (function(module, exports) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"UrlEditor","icon":"link","name":"Url"}

/***/ })

/******/ });