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
/******/ 	return __webpack_require__(__webpack_require__.s = 270);
/******/ })
/************************************************************************/
/******/ ({

/***/ 270:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ----------
// User
// ----------

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.currentUserIsAdmin = function () {
    return true;
};
window.currentUserHasScope = function () {
    return true;
};

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
window.startDebugSocket = function () {};

/**
 * Fake API
 */

var FakeAPI = function () {
    function FakeAPI() {
        _classCallCheck(this, FakeAPI);
    }

    /**
     * Gets the fake API cache
     */
    FakeAPI.getCache = function getCache(resource, id) {
        var cache = localStorage.getItem('demo') || '{}';

        try {
            cache = JSON.parse(cache);
        } catch (e) {
            cache = {};
        }

        cache[resource] = cache[resource] || FakeAPI.getNativeResource(resource);

        if (!resource) {
            return cache;
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


    FakeAPI.setCache = function setCache(resource, id, data) {
        var cache = FakeAPI.getCache();

        if (!cache[resource] || !Array.isArray(cache[resource])) {
            cache[resource] = FakeAPI.getNativeResource(resource) || [];
        }

        var foundExisting = false;

        for (var i in cache[resource]) {
            if (cache[resource].id == id) {
                cache[resource] = data;
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


    FakeAPI.request = function request(method, url, data) {
        url = url.replace('/api/demo/live/', '');
        method = method.toUpperCase();

        return new Promise(function (resolve, reject) {
            switch (method) {
                case 'GET':
                    return resolve(FakeAPI.get(url));

                case 'POST':
                    return resolve(FakeAPI.post(url, data));
            }

            resolve();
        });
    };

    /**
     * Parses a resource url
     */


    FakeAPI.parseUrl = function parseUrl(url) {
        return {
            resource: url.split('/')[0],
            id: url.split('/')[1]
        };
    };

    /**
     * Get
     */


    FakeAPI.get = function get(url) {
        var query = FakeAPI.parseUrl(url);

        return FakeAPI.getCache(query.resource, query.id);
    };

    /**
     * Post
     */


    FakeAPI.post = function post(url, data) {
        var query = FakeAPI.parseUrl(url);

        return FakeAPI.setCache(query.resource, query.id, data);
    };

    /**
     * Gets a native resource
     */


    FakeAPI.getNativeResource = function getNativeResource(type) {
        switch (type) {
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
                    'contentBase': __webpack_require__(271),
                    'page': __webpack_require__(272),
                    'array': __webpack_require__(273),
                    'boolean': __webpack_require__(274),
                    'contentReference': __webpack_require__(275),
                    'contentSchemaReference': __webpack_require__(276),
                    'date': __webpack_require__(277),
                    'dropdown': __webpack_require__(278),
                    'fieldBase': __webpack_require__(279),
                    'language': __webpack_require__(280),
                    'mediaReference': __webpack_require__(281),
                    'number': __webpack_require__(282),
                    'resourceReference': __webpack_require__(283),
                    'richText': __webpack_require__(284),
                    'string': __webpack_require__(285),
                    'struct': __webpack_require__(286),
                    'tags': __webpack_require__(287),
                    'templateReference': __webpack_require__(288),
                    'url': __webpack_require__(289),
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
        }
    };

    return FakeAPI;
}();

/**
 * Wraps an API call with a custom path
 *
 * @param {String} method
 * @param {String} url
 * @param {Object} data
 *
 * @returns {Promise} Response
 */


window.customApiCall = FakeAPI.request;

/**
 * Gets a Schema by id
 */
HashBrown.Helpers.SchemaHelper.getSchemaByIdSync = function (id) {
    var object = FakeAPI.get('schemas', id);

    return HashBrown.Helpers.SchemaHelper.getModel(object);
};

HashBrown.Helpers.SchemaHelper.getSchemaById = function (id) {
    return FakeAPI.request('get', 'schemas/' + id).then(function (object) {
        return Promise.resolve(HashBrown.Helpers.SchemaHelper.getModel(object));
    });
};

/**
 * Gets a Schema with parent fields
 */
HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields = function (id) {
    // Get the Schema by id
    return HashBrown.Helpers.SchemaHelper.getSchemaById(id)

    // Return object along with any parent objects
    .then(function (schema) {
        schema = schema.getObject();

        // If this Schema has a parent, merge fields with it
        if (schema.parentSchemaId) {
            return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId).then(function (parentSchema) {
                parentSchema = parentSchema.getObject();

                var mergedSchema = HashBrown.Helpers.SchemaHelper.mergeSchemas(schema, parentSchema);

                return Promise.resolve(mergedSchema);
            });
        }

        schema = HashBrown.Helpers.SchemaHelper.getModel(schema);

        // If this Schema doesn't have a parent, return this Schema
        return Promise.resolve(schema);
    });
};

/**
 * Fetches view model data
 */
View.prototype.fetch = function fetch() {
    var view = this;

    function getModel() {
        // Get model from URL
        if (!view.model && typeof view.modelUrl === 'string') {
            customApiCall('get', view.modelUrl).then(function (result) {
                view.model = result;

                view.init();
            });

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

/**
 * Reloads a resource
 */
window.reloadResource = function reloadResource(name) {
    var model = null;
    var result = [];

    switch (name) {
        case 'content':
            model = HashBrown.Models.Content;
            result = FakeAPI.get('content');
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
            result = FakeAPI.get('connections');
            break;

        case 'schemas':
            result = FakeAPI.get('schemas');
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

/***/ 271:
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

/***/ 272:
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

/***/ 273:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ArrayEditor",
	"icon": "list-ol",
	"name": "Array"
};

/***/ }),

/***/ 274:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "BooleanEditor",
	"icon": "toggle-on",
	"name": "Boolean"
};

/***/ }),

/***/ 275:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentReferenceEditor",
	"icon": "file",
	"name": "Content Reference"
};

/***/ }),

/***/ 276:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ContentSchemaReferenceEditor",
	"icon": "gears",
	"name": "Content Schema Reference"
};

/***/ }),

/***/ 277:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DateEditor",
	"icon": "calendar",
	"name": "Date"
};

/***/ }),

/***/ 278:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "DropdownEditor",
	"icon": "list-alt",
	"name": "Dropdown"
};

/***/ }),

/***/ 279:
/***/ (function(module, exports) {

module.exports = {
	"name": "Field Base",
	"icon": "cogs"
};

/***/ }),

/***/ 280:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "LanguageEditor",
	"icon": "globe",
	"name": "Language"
};

/***/ }),

/***/ 281:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "MediaReferenceEditor",
	"icon": "file-image-o",
	"name": "Media Reference"
};

/***/ }),

/***/ 282:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "NumberEditor",
	"icon": "sort-numeric-asc",
	"name": "Number"
};

/***/ }),

/***/ 283:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "ResourceReferenceEditor",
	"icon": "book",
	"name": "Resource Reference"
};

/***/ }),

/***/ 284:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "RichTextEditor",
	"icon": "font",
	"name": "Rich Text"
};

/***/ }),

/***/ 285:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StringEditor",
	"icon": "font",
	"name": "String"
};

/***/ }),

/***/ 286:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "StructEditor",
	"icon": "cubes",
	"name": "Struct"
};

/***/ }),

/***/ 287:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TagsEditor",
	"icon": "tag",
	"name": "Tags"
};

/***/ }),

/***/ 288:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "TemplateReferenceEditor",
	"icon": "code",
	"name": "Template Reference"
};

/***/ }),

/***/ 289:
/***/ (function(module, exports) {

module.exports = {
	"parentSchemaId": "fieldBase",
	"editorId": "UrlEditor",
	"icon": "link",
	"name": "Url"
};

/***/ })

/******/ });