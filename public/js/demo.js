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
/******/ 	return __webpack_require__(__webpack_require__.s = 272);
/******/ })
/************************************************************************/
/******/ ({

/***/ 272:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Demo API
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DemoApi = function () {
    function DemoApi() {
        _classCallCheck(this, DemoApi);
    }

    /**
     * Clears the cache
     */
    DemoApi.reset = function reset() {
        localStorage.setItem('demo', null);

        location.reload();
    };

    /**
     * Gets the fake API cache
     */


    DemoApi.getCache = function getCache(resource, id) {
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
            if (cache[resource][i].id == id) {
                return cache[resource][i];
            }
        }

        return null;
    };

    /**
     * Sets the fake API
     */


    DemoApi.setCache = function setCache(resource, id, data) {
        var cache = DemoApi.getCache();

        if (!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = DemoApi.getNativeResource(resource) || [];
        }

        var foundExisting = false;

        for (var i in cache[resource]) {
            if (cache[resource][i].id == id) {
                cache[resource][i] = data;
                foundExisting = true;
                break;
            }
        }

        if (!foundExisting) {
            cache[resource].push(data);
        }

        localStorage.setItem('demo', JSON.stringify(cache));
    };

    /**
     * Request
     */


    DemoApi.request = function request(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        debug.log(method + ' ' + url, DemoApi);

        return new Promise(function (resolve, reject) {
            switch (method) {
                case 'GET':
                    return resolve(DemoApi.get(url));

                case 'POST':
                    return resolve(DemoApi.post(url, data));
            }

            resolve();
        });
    };

    DemoApi.requestSync = function requestSync(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        debug.log(method + ' ' + url, DemoApi);

        switch (method) {
            case 'GET':
                return DemoApi.get(url);

            case 'POST':
                return DemoApi.post(url, data);
        }
    };

    /**
     * Parses a resource url
     */


    DemoApi.parseUrl = function parseUrl(url) {
        return {
            resource: url.split('/')[0],
            id: url.split('/')[1]
        };
    };

    /**
     * Get
     */


    DemoApi.get = function get(url) {
        var query = DemoApi.parseUrl(url);

        return DemoApi.getCache(query.resource, query.id);
    };

    /**
     * Post
     */


    DemoApi.post = function post(url, data) {
        var query = DemoApi.parseUrl(url);

        return DemoApi.setCache(query.resource, query.id, data);
    };

    /**
     * Gets a native resource
     */


    DemoApi.getNativeResource = function getNativeResource(type) {
        switch (type) {
            case 'settings':
                return {};

            case 'connections':
                return [{
                    id: '87afb0x4cd9e75666589a084079e340766f94xb1',
                    title: 'My website',
                    url: 'example.com',
                    locked: true
                }];

            case 'content':
                return [{
                    "id": "a9c44cf7c7bffc1420a43ff7e68e8fbf32261470",
                    "parentId": "",
                    "createdBy": "db14905b261792b6dd1f5a442375fc266aa6e7ca",
                    "updatedBy": "db14905b261792b6dd1f5a442375fc266aa6e7ca",
                    "createDate": "2017-07-30T10:24:22.140Z",
                    "updateDate": "2017-07-30T10:24:22.141Z",
                    "publishOn": null,
                    "unpublishOn": null,
                    "schemaId": "9e522d637efc8fe2320ff7471c815d2c55a3e439",
                    "isPublished": false,
                    "hasPreview": false,
                    "sort": 10000,
                    "properties": {
                        "url": "/my-home-page/",
                        "title": "My Home Page",
                        "text": "<h2>This is a rich text page</h2><p>A simple page for inserting formatted text and media</p>"
                    },
                    "settings": {
                        "publishing": {
                            "connections": []
                        }
                    }
                }];

            case 'schemas':
                var schemas = {
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
                    'url': __webpack_require__(291),
                    '9e522d637efc8fe2320ff7471c815d2c55a3e439': {
                        'id': '9e522d637efc8fe2320ff7471c815d2c55a3e439',
                        'name': 'Rich Text Page',
                        'icon': 'file',
                        'parentSchemaId': 'page',
                        'locked': false,
                        'hiddenProperties': [],
                        'defaultTabId': 'content',
                        'tabs': {},
                        'fields': {
                            'properties': {
                                'text': {
                                    'label': 'Text',
                                    'tabId': 'content',
                                    'schemaId': 'richText'
                                }
                            }
                        },
                        'allowedChildSchemas': [],
                        'type': 'content'
                    }
                };

                var result = [];

                for (var k in schemas) {
                    schemas[k].id = k;

                    if (k === 'contentBase' || k === 'page' || schemas[k].type == 'content') {
                        schemas[k].type = 'content';
                    } else {
                        schemas[k].type = 'field';
                    }

                    if (schemas[k].locked !== false) {
                        schemas[k].locked = true;
                    }

                    result.push(schemas[k]);
                }

                return result;

            default:
                return [];
        }
    };

    return DemoApi;
}();

HashBrown.DemoApi = DemoApi;

// Override normal api call
window.customApiCall = DemoApi.request;

// ----------
// User
// ----------
HashBrown.Models.User.current = new HashBrown.Models.User({
    id: '93afb0e4cd9e7545c589a084079e340766f94xb1',
    isAdmin: true,
    isCurrent: true,
    username: 'demouser',
    fullName: 'Demo User',
    email: 'demo@user.com',
    scopes: {}
});

// ----------
// Debug socket
// ----------
debug.startSocket = function () {};

// ----------
// SchemaHelper
// ----------
HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = function (id) {
    var schema = DemoApi.requestSync('get', 'schemas/' + id);

    if (schema.parentSchemaId) {
        return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId).then(function (parentSchema) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (typeof parentSchema.getObject === 'function') {
                        parentSchema = parentSchema.getObject();
                    }

                    var mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);

                    resolve(mergedSchema);
                }, 100);
            });
        });
    }

    schema = HashBrown.Helpers.SchemaHelper.getModel(schema);

    return Promise.resolve(schema);
};

// ----------
// Crisp UI
// ----------
View.prototype.fetch = function fetch() {
    var view = this;

    function getModel() {
        // Get model from URL
        if (!view.model && typeof view.modelUrl === 'string') {
            view.model = DemoApi.requestSync('get', view.modelUrl);
            view.init();

            // Get model with function
        } else if (!view.model && typeof view.modelFunction === 'function') {
            view.modelFunction(function (data) {
                view.model = data;

                view.init();
            });

            // Just perform the initialisation
        } else {
            view.init();
        }
    }

    // Get the model
    getModel();
};

// ----------
// Resource loading
// ----------
window.reloadResource = function reloadResource(name) {
    var model = null;
    var result = [];

    switch (name) {
        case 'content':
            model = HashBrown.Models.Content;
            result = HashBrown.DemoApi.requestSync('get', 'content');
            break;

        case 'templates':
            model = HashBrown.Models.Template;
            break;

        case 'users':
            model = HashBrown.Models.User;
            break;

        case 'media':
            model = HashBrown.Models.Media;
            break;

        case 'connections':
            model = HashBrown.Models.Connection;
            result = HashBrown.DemoApi.requestSync('get', 'connections');
            break;

        case 'schemas':
            result = HashBrown.DemoApi.requestSync('get', 'schemas');
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

module.exports = {
	"defaultTabId": "meta",
	"icon": "cogs",
	"name": "Content Base",
	"fields": {
		"createDate": {
			"disabled": "true",
			"label": "Created at",
			"schemaId": "date"
		},
		"updateDate": {
			"disabled": "true",
			"label": "Updated at",
			"schemaId": "date"
		},
		"createdBy": {
			"disabled": "true",
			"label": "Created by",
			"schemaId": "resourceReference",
			"config": {
				"resource": "users",
				"resourceKeys": [
					"fullName",
					"username"
				]
			}
		},
		"updatedBy": {
			"disabled": "true",
			"label": "Updated by",
			"schemaId": "resourceReference",
			"config": {
				"resource": "users",
				"resourceKeys": [
					"fullName",
					"username"
				]
			}
		},
		"publishOn": {
			"label": "Publish on",
			"schemaId": "date"
		},
		"unpublishOn": {
			"label": "Unpublish on",
			"schemaId": "date"
		},
		"schemaId": {
			"label": "Schema",
			"schemaId": "contentSchemaReference",
			"config": {
				"allowedSchemas": "fromParent"
			}
		},
		"properties": {
			"title": {
				"label": "Title",
				"schemaId": "string"
			}
		}
	}
};

/***/ }),

/***/ 274:
/***/ (function(module, exports) {

module.exports = {
	"icon": "file",
	"name": "Page",
	"parentSchemaId": "contentBase",
	"tabs": {
		"content": "Content"
	},
	"defaultTabId": "content",
	"fields": {
		"properties": {
			"title": {
				"label": "Title",
				"schemaId": "string",
				"tabId": "content"
			},
			"description": {
				"label": "Description",
				"schemaId": "string",
				"tabId": "content"
			},
			"template": {
				"label": "Template",
				"schemaId": "templateReference",
				"tabId": "content",
				"config": {
					"allowedTemplates": []
				}
			},
			"url": {
				"label": "URL",
				"schemaId": "url",
				"tabId": "content"
			}
		}
	}
};

/***/ }),

/***/ 275:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ArrayEditor",
	"icon": "list-ol",
	"name": "Array"
};

/***/ }),

/***/ 276:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "BooleanEditor",
	"icon": "toggle-on",
	"name": "Boolean"
};

/***/ }),

/***/ 277:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentReferenceEditor",
	"icon": "file",
	"name": "Content Reference"
};

/***/ }),

/***/ 278:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentSchemaReferenceEditor",
	"icon": "gears",
	"name": "Content Schema Reference"
};

/***/ }),

/***/ 279:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DateEditor",
	"icon": "calendar",
	"name": "Date"
};

/***/ }),

/***/ 280:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DropdownEditor",
	"icon": "list-alt",
	"name": "Dropdown"
};

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

module.exports = {
	"name": "Field Base",
	"icon": "cogs"
};

/***/ }),

/***/ 282:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "LanguageEditor",
	"icon": "globe",
	"name": "Language"
};

/***/ }),

/***/ 283:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "MediaReferenceEditor",
	"icon": "file-image-o",
	"name": "Media Reference"
};

/***/ }),

/***/ 284:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "NumberEditor",
	"icon": "sort-numeric-asc",
	"name": "Number"
};

/***/ }),

/***/ 285:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ResourceReferenceEditor",
	"icon": "book",
	"name": "Resource Reference"
};

/***/ }),

/***/ 286:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "RichTextEditor",
	"icon": "font",
	"name": "Rich Text"
};

/***/ }),

/***/ 287:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StringEditor",
	"icon": "font",
	"name": "String"
};

/***/ }),

/***/ 288:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StructEditor",
	"icon": "cubes",
	"name": "Struct"
};

/***/ }),

/***/ 289:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TagsEditor",
	"icon": "tag",
	"name": "Tags"
};

/***/ }),

/***/ 290:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TemplateReferenceEditor",
	"icon": "code",
	"name": "Template Reference"
};

/***/ }),

/***/ 291:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "UrlEditor",
	"icon": "link",
	"name": "Url"
};

/***/ })

/******/ });