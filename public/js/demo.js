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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Demo API
 *
 * @memberof HashBrown.Client
 */

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DemoApi =
/*#__PURE__*/
function () {
  function DemoApi() {
    _classCallCheck(this, DemoApi);
  }

  _createClass(DemoApi, null, [{
    key: "reset",

    /**
     * Clears the cache
     */
    value: function reset() {
      localStorage.setItem('demo', null);
      location.hash = '/content/';
      location.reload();
    }
    /**
     * Gets the fake API cache
     */

  }, {
    key: "getCache",
    value: function getCache(resource, id) {
      var cache = this.cache;

      if (!cache) {
        try {
          cache = localStorage.getItem('demo') || '{}';
          cache = JSON.parse(cache);
        } catch (e) {
          cache = {};
        }

        cache = cache || {};
      }

      this.cache = cache;

      if (!resource) {
        return cache;
      }

      if (!cache[resource] || !Array.isArray(cache[resource])) {
        cache[resource] = DemoApi.getNativeResource(resource) || [];
      }

      if (!id) {
        return cache[resource];
      }

      for (var i in cache[resource]) {
        if (cache[resource][i].id === id || cache[resource][i].name === id) {
          return cache[resource][i];
        }
      }

      return null;
    }
    /**
     * Sets the fake API
     */

  }, {
    key: "setCache",
    value: function setCache(resource, id, data) {
      var cache = DemoApi.getCache();

      if (!cache[resource] || !Array.isArray(cache[resource])) {
        cache[resource] = DemoApi.getNativeResource(resource) || [];
      }

      var foundExisting = false;

      for (var i in cache[resource]) {
        if (cache[resource][i].id == id) {
          // Update data
          if (data) {
            cache[resource][i] = data; // Delete data
          } else {
            cache[resource].splice(i, 1);
          }

          foundExisting = true;
          break;
        }
      }

      if (!foundExisting && data) {
        cache[resource].push(data);
      }

      localStorage.setItem('demo', JSON.stringify(cache));
      return data;
    }
    /**
     * Request
     */

  }, {
    key: "request",
    value: function request(method, url, data) {
      url = url.replace('/api/demo/live/', '');
      method = method.toUpperCase();
      debug.log(method + ' ' + url, DemoApi);
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(DemoApi.requestSync(method, url, data));
        }, 100);
      });
    }
  }, {
    key: "requestSync",
    value: function requestSync(method, url, data) {
      url = url.replace('/api/demo/live/', '');
      method = method.toUpperCase();
      debug.log(method + ' ' + url, DemoApi);

      switch (method) {
        case 'GET':
          return DemoApi.get(url);

        case 'POST':
          return DemoApi.post(url, data);

        case 'DELETE':
          return DemoApi.delete(url);
      }

      return data;
    }
    /**
     * Parses a resource url
     */

  }, {
    key: "parseUrl",
    value: function parseUrl(url) {
      var query = {};
      var split = url.split('/');
      query.resource = split[0];
      query.params = url.split('?')[1];

      if (split.length > 1) {
        query.id = split[1].replace('?' + query.params, '');
      }

      return query;
    }
    /**
     * Delete
     */

  }, {
    key: "delete",
    value: function _delete(url) {
      var query = DemoApi.parseUrl(url);
      return DemoApi.setCache(query.resource, query.id, null);
    }
    /**
     * Get
     */

  }, {
    key: "get",
    value: function get(url) {
      var query = DemoApi.parseUrl(url);
      return DemoApi.getCache(query.resource, query.id);
    }
    /**
     * Post
     */

  }, {
    key: "post",
    value: function post(url, data) {
      var query = DemoApi.parseUrl(url); // Publish

      if (url == 'content/publish' || url == 'content/unpublish' || url == 'content/preview') {
        return Promise.resolve();
      } // Create new


      if (url.indexOf('content/new') > -1) {
        var schemaId = url.match(/content\/new\/([a-zA-Z0-9]+)/);

        if (!schemaId) {
          throw new Error('No Schema id specified');
        }

        schemaId = schemaId[1];
        var sort = url.match(/\?sort=([0-9]*)/);

        if (sort) {
          sort = sort[2];
        }

        var parentId = url.match(/\&parent=([0-9a-z]*)/);

        if (parentId) {
          parentId = parentId[1];
        }

        data = HashBrown.Models.Content.create(schemaId);
        data.parentId = parentId;
        data.sort = sort;
        query = {
          resource: 'content',
          id: data.id
        };
      }

      console.log('--- POST data:', data);
      return DemoApi.setCache(query.resource, query.id, data);
    }
    /**
     * Gets a native resource
     */

  }, {
    key: "getNativeResource",
    value: function getNativeResource(type) {
      var _sections;

      switch (type) {
        case 'users':
          return [{
            id: '4173f094621d4a882f912ccaf1cc6613a386519e',
            isAdmin: true,
            isCurrent: true,
            username: 'demouser',
            fullName: 'Demo User',
            email: 'demo@user.com',
            scopes: {}
          }];

        case 'settings':
          return [{
            id: 'providers',
            media: '8c75aa0739cf66bcac269f01ab9007e666bd941b'
          }];

        case 'media':
          return [{
            "id": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b",
            "remote": true,
            "icon": "file-image-o",
            "name": "banner.jpg",
            "url": "media/50d05eee9088c589bfd5a5a3a3043c0ebcc4972b/banner-flat-pink.jpg",
            "folder": "banners"
          }];

        case 'connections':
          return [{
            id: '8c75aa0739cf66bcac269f01ab9007e666bd941b',
            title: 'My website',
            url: 'example.com',
            locked: true
          }];

        case 'content':
          return [{
            "locked": false,
            "local": false,
            "remote": false,
            "id": "91f1ec2b984f291377c2dc488be2ebbefb46dd9a",
            "parentId": "",
            "createdBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
            "updatedBy": "4173f094621d4a882f912ccaf1cc6613a386519e",
            "createDate": "2016-09-05T06:52:17.646Z",
            "updateDate": "2017-08-03T15:55:10.590Z",
            "publishOn": null,
            "unpublishOn": null,
            "schemaId": "591a897ad572cadae5115ef05726d9ead2725dc5",
            "isPublished": true,
            "hasPreview": false,
            "sort": -1,
            "properties": {
              "title": "HashBrown CMS",
              "url": "/",
              "sections": [{
                "value": {
                  "image": "50d05eee9088c589bfd5a5a3a3043c0ebcc4972b",
                  "text": "## HashBrown CMS\n\nCreate once. Publish anywhere."
                },
                "schemaId": "f5c4cf4dffb088a2753760ad1da9cd64ff781003"
              }, {
                "value": {
                  "text": "## Why HashBrown?\n\n### Remote management\n\nSeparate your concerns with a truly modern approach to content management. Your websites won't know what hit them.\n\n### Multiple projects at once\n\nWhy worry about several CMS'es, when you only need one?\n\n### Several environments for each project\n\nWe get it. You need to test your content before you go live.\n\n### Multilingual\n\nRemember the last time you used a truly elegant localisation solution in a CMS? We don't either.\n\n### Plugin support\n\nIf your needs aren't met at the core level, you can add anything you can imagine.\n\n### Content format consistency\n\nWhen you are passing complex, format-agnostic data around, document databases are the way to go. HashBrown knows what's up.\n\n### Painless backups\n\nHashBrown has your back in seconds.\n\n### Small footprint\n\nYou could probably run HashBrown on your toaster at home."
                },
                "schemaId": "904e8e7570ddb37ea1f31d210db47cd15f92ff92"
              }],
              "description": "Create once. Publish anywhere."
            },
            "settings": {
              "publishing": {
                "connectionId": "8c75aa0739cf66bcac269f01ab9007e666bd941b",
                "applyToChildren": true
              }
            }
          }];

        case 'schemas':
          var schemas = {
            'contentBase': __webpack_require__(7),
            'page': __webpack_require__(8),
            'array': __webpack_require__(9),
            'boolean': __webpack_require__(10),
            'contentReference': __webpack_require__(11),
            'contentSchemaReference': __webpack_require__(12),
            'date': __webpack_require__(13),
            'dropdown': __webpack_require__(14),
            'fieldBase': __webpack_require__(15),
            'language': __webpack_require__(16),
            'mediaReference': __webpack_require__(17),
            'number': __webpack_require__(18),
            'resourceReference': __webpack_require__(19),
            'richText': __webpack_require__(20),
            'string': __webpack_require__(21),
            'struct': __webpack_require__(22),
            'tags': __webpack_require__(23),
            'url': __webpack_require__(24)
          };
          var result = [];

          for (var k in schemas) {
            schemas[k].id = k;

            if (k === 'contentBase' || k === 'page' || schemas[k].type == 'content') {
              schemas[k].type = 'content';
            } else {
              schemas[k].type = 'field';
            }

            if (schemas[k].isLocked !== false) {
              schemas[k].isLocked = true;
            }

            result.push(HashBrown.Helpers.SchemaHelper.getModel(schemas[k]));
          } // Section page


          result.push(new HashBrown.Models.ContentSchema({
            "isLocked": false,
            "sync": {
              "hasRemote": false,
              "isRemote": false
            },
            "id": "591a897ad572cadae5115ef05726d9ead2725dc5",
            "name": "Section Page",
            "icon": "file",
            "parentSchemaId": "page",
            "hiddenProperties": [],
            "defaultTabId": "content",
            "tabs": {},
            "fields": {
              "properties": {
                "sections": (_sections = {
                  "tabId": "content",
                  "label": "Sections"
                }, _defineProperty(_sections, "tabId", "content"), _defineProperty(_sections, "schemaId", "array"), _defineProperty(_sections, "config", {
                  "allowedSchemas": ["904e8e7570ddb37ea1f31d210db47cd15f92ff92", "f5c4cf4dffb088a2753760ad1da9cd64ff781003"]
                }), _sections)
              }
            },
            "allowedChildSchemas": ["591a897ad572cadae5115ef05726d9ead2725dc5"],
            "type": "content"
          })); // Section

          result.push(new HashBrown.Models.FieldSchema({
            "isLocked": false,
            "sync": {
              "hasRemote": false,
              "isRemote": false
            },
            "local": false,
            "remote": false,
            "id": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
            "name": "Section",
            "icon": "file",
            "parentSchemaId": "struct",
            "hiddenProperties": [],
            "editorId": "struct",
            "type": "field"
          })); // Rich text section

          result.push(new HashBrown.Models.FieldSchema({
            "isLocked": false,
            "sync": {
              "hasRemote": false,
              "isRemote": false
            },
            "id": "904e8e7570ddb37ea1f31d210db47cd15f92ff92",
            "name": "Rich Text Section",
            "icon": "file-text-o",
            "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
            "hiddenProperties": [],
            "editorId": "struct",
            "config": {
              "struct": {
                "text": {
                  "label": "Text",
                  "tabId": "content",
                  "schemaId": "richText"
                }
              }
            },
            "type": "field"
          })); // Hero

          result.push(new HashBrown.Models.FieldSchema({
            "isLocked": false,
            "sync": {
              "hasRemote": false,
              "isRemote": false
            },
            "id": "f5c4cf4dffb088a2753760ad1da9cd64ff781003",
            "name": "Hero Section",
            "icon": "image",
            "parentSchemaId": "7ccbf2d613a4da3e5543abdde33b9eb0e5fbb8f3",
            "hiddenProperties": [],
            "editorId": "struct",
            "config": {
              "struct": {
                "image": {
                  "label": "Image",
                  "schemaId": "mediaReference"
                },
                "text": {
                  "label": "Text",
                  "schemaId": "richText"
                }
              }
            },
            "type": "field"
          }));
          return result;

        default:
          return [];
      }
    }
  }]);

  return DemoApi;
}();

HashBrown.DemoApi = DemoApi; // Add reset button

_.append(document.body, _.button({
  class: 'widget widget--button condensed page--environment__demo__reset'
}, 'Reset demo').click(function () {
  DemoApi.reset();
})); // Override normal api call


HashBrown.Helpers.RequestHelper.request = DemoApi.request;
HashBrown.Helpers.RequestHelper.customRequest = DemoApi.request; // ----------
// Debug socket
// ----------

debug.startSocket = function () {}; // ----------
// SchemaHelper
// ----------


HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = function (id) {
  var schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(id);

  if (schema.parentSchemaId) {
    return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId).then(function (parentSchema) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          var mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);
          resolve(mergedSchema);
        }, 100);
      });
    });
  } else {
    return Promise.resolve(schema);
  }
}; // ----------
// Crisp UI
// ----------


Crisp.View.prototype.fetch = function fetch() {
  var view = this;

  function getModel() {
    // Get model from URL
    if (!view.model && typeof view.modelUrl === 'string') {
      view.model = DemoApi.requestSync('get', view.modelUrl);

      view._init(); // Get model with function

    } else if (!view.model && typeof view.modelFunction === 'function') {
      view.modelFunction(function (data) {
        view.model = data;

        view._init();
      }); // Just perform the initialisation
    } else {
      view._init();
    }
  } // Get the model


  getModel();
}; // ----------
// Resource loading
// ----------


HashBrown.Helpers.RequestHelper.reloadResource = function reloadResource(name) {
  var model = null;
  var result = HashBrown.DemoApi.requestSync('get', name);

  switch (name) {
    case 'content':
      model = HashBrown.Models.Content;
      break;

    case 'users':
      model = HashBrown.Models.User;
      break;

    case 'media':
      model = HashBrown.Models.Media;
      break;

    case 'connections':
      model = HashBrown.Models.Connection;
      break;

    case 'schemas':
      break;
  }

  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      window.resources[name] = result; // If a model is specified, use it to initialise every resource

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
/* 7 */
/***/ (function(module) {

module.exports = {"defaultTabId":"meta","icon":"cogs","name":"Content Base","fields":{"createDate":{"disabled":"true","label":"Created at","schemaId":"date"},"updateDate":{"disabled":"true","label":"Updated at","schemaId":"date"},"createdBy":{"disabled":"true","label":"Created by","schemaId":"resourceReference","config":{"resource":"users","resourceKeys":["fullName","username"]}},"updatedBy":{"disabled":"true","label":"Updated by","schemaId":"resourceReference","config":{"resource":"users","resourceKeys":["fullName","username"]}},"publishOn":{"label":"Publish on","schemaId":"date"},"unpublishOn":{"label":"Unpublish on","schemaId":"date"},"schemaId":{"label":"Schema","schemaId":"contentSchemaReference","config":{"allowedSchemas":"fromParent"}},"properties":{"title":{"label":"Title","schemaId":"string"}}}};

/***/ }),
/* 8 */
/***/ (function(module) {

module.exports = {"icon":"file","name":"Page","parentSchemaId":"contentBase","tabs":{"content":"Content"},"defaultTabId":"content","fields":{"properties":{"title":{"label":"Title","schemaId":"string","tabId":"content"},"description":{"label":"Description","schemaId":"string","tabId":"content"},"url":{"label":"URL","schemaId":"url","tabId":"content"}}}};

/***/ }),
/* 9 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ArrayEditor","icon":"list-ol","name":"Array"};

/***/ }),
/* 10 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"BooleanEditor","icon":"toggle-on","name":"Boolean"};

/***/ }),
/* 11 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ContentReferenceEditor","icon":"file","name":"Content Reference"};

/***/ }),
/* 12 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ContentSchemaReferenceEditor","icon":"gears","name":"Content Schema Reference"};

/***/ }),
/* 13 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"DateEditor","icon":"calendar","name":"Date"};

/***/ }),
/* 14 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"DropdownEditor","icon":"list-alt","name":"Dropdown"};

/***/ }),
/* 15 */
/***/ (function(module) {

module.exports = {"name":"Field Base","icon":"cogs"};

/***/ }),
/* 16 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"LanguageEditor","icon":"globe","name":"Language"};

/***/ }),
/* 17 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"MediaReferenceEditor","icon":"file-image-o","name":"Media Reference"};

/***/ }),
/* 18 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"NumberEditor","icon":"sort-numeric-asc","name":"Number"};

/***/ }),
/* 19 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"ResourceReferenceEditor","icon":"book","name":"Resource Reference"};

/***/ }),
/* 20 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"RichTextEditor","icon":"font","name":"Rich Text"};

/***/ }),
/* 21 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"StringEditor","icon":"font","name":"String"};

/***/ }),
/* 22 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"StructEditor","icon":"cubes","name":"Struct"};

/***/ }),
/* 23 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"TagsEditor","icon":"tag","name":"Tags"};

/***/ }),
/* 24 */
/***/ (function(module) {

module.exports = {"parentSchemaId":"fieldBase","editorId":"UrlEditor","icon":"link","name":"Url"};

/***/ })
/******/ ]);
//# sourceMappingURL=demo.js.map