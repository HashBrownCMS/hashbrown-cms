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
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ (Array(33).concat([
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @namespace HashBrown.Client.Helpers
 */
namespace('Helpers')
.add(__webpack_require__(34))
.add(__webpack_require__(36))
.add(__webpack_require__(38))
.add(__webpack_require__(39))
.add(__webpack_require__(41))
.add(__webpack_require__(43))
.add(__webpack_require__(44))
.add(__webpack_require__(46))
.add(__webpack_require__(47))
.add(__webpack_require__(48))
.add(__webpack_require__(49))
.add(__webpack_require__(51))
.add(__webpack_require__(53))
.add(__webpack_require__(54));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ConnectionHelperCommon = __webpack_require__(35);

/**
 * The client side connection helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class ConnectionHelper extends ConnectionHelperCommon {
    /**
     * Gets all connections
     *
     * @return {Array} Connections
     */
    static async getAllConnections() {
        return await HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Connection, 'connections');
    }
    
    /**
     * Gets a Connection by id
     *
     * @param {String} id
     *
     * @return {HashBrown.Models.Connection} Connection
     */
    static async getConnectionById(id) {
        return await HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Connection, 'connections', id);
    }

    /**
     * Sets the Media provider
     *
     * @param {String} id
     *
     * @returns {Promise}
     */
    static async setMediaProvider(id) {
        await super.setMediaProvider(HashBrown.Context.projectId, HashBrown.Context.environment, id);

        await HashBrown.Helpers.ResourceHelper.reloadResource('media');
    }
    
    /**
     * Starts a tour of the Connection section
     */
    static async startTour() {
        if(location.hash.indexOf('connections/') < 0) {
            location.hash = '/connections/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/connections/"]', 'This the Connections section, where you will configure how HashBrown talks to the outside world.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/connections/"]', 'Here you will find all of your Connections. You can right click here to create a new Connection.', 'right', 'next');
        
        let editor = document.querySelector('.editor--connection');

        if(editor) {
            await UI.highlight('.editor--connection', 'This is the Connection editor, where you edit Connections.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Connection editor will be when you click a Connection.', 'left', 'next');
        }
    }

    /**
     * Gets the Media provider
     *
     * @return {HashBrown.Models.Connection} Connection object
     */
    static async getMediaProvider() {
        let providers = await HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Context.projectId, HashBrown.Context.environment, 'providers');
        
        if(providers.media) {
            return await this.getConnectionById(providers.media);
        } else {
            return null;
        }
    }
}

module.exports = ConnectionHelper;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The helper class for Connections
 *
 * @memberof HashBrown.Common.Helpers
 */
class ConnectionHelper {
    /**
     * Gets all connections
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise(Array)} connections
     */
    static getAllConnections(project, environment) {
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
    static setMediaProvider(project, environment, id = null) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return HashBrown.Helpers.SettingsHelper.getSettings(project, environment, 'providers')
        .then((providers) => {
            providers = providers || {};
            providers.media = id;

            return HashBrown.Helpers.SettingsHelper.setSettings(project, environment, 'providers', providers)
        });
    }
}

module.exports = ConnectionHelper;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ContentHelperCommon = __webpack_require__(37);

/**
 * The client side content helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class ContentHelper extends ContentHelperCommon {
    /**
     * Gets all ancestors of a Content node by id
     *
     * @param {String} id
     * @param {Boolean} includeSelf
     *
     * @returns {Array} Content node
     */
    static async getContentAncestorsById(id, includeSelf = false) {
        checkParam(id, 'id', String, true);

        let ancestors = [];
        let ancestorId = id;

        while(ancestorId) {
            let ancestor = await this.getContentById(ancestorId);

            if(ancestorId !== id || includeSelf) {
                ancestors.push(ancestor);
            }
            
            ancestorId = ancestor.parentId;
        }

        ancestors.reverse();

        return ancestors;
    }
    
    /**
     * Gets Content by id
     *
     * @param {String} id
     *
     * @returns {HashBrown.Models.Content} Content node
     */
    static async getContentById(id) {
        checkParam(id, 'id', String, true);

        return await HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Content, 'content', id);
    }
    
    /**
     * Gets all Content
     *
     * @returns {Array} Content nodes
     */
    static async getAllContent() {
        return await HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Content, 'content');
    }
    
    /**
     * Sets Content by id
     *
     * @param {String} id
     * @param {HashBrown.Models.Content} content
     */
    static setContentById(id, content) {
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return HashBrown.Helpers.ResourceHelper.set('content', id, content);
    }

    /**
     * A check for field definitions
     *
     * @param {Object} definition
     *
     * @return {Boolean} Whether or not the definition is empty
     */
    static isFieldDefinitionEmpty(definition) {
        if(!definition) { return true; }

        let isEmpty = true;
        let checkRecursive = (object) => {
            if(!object) { return; }

            // We consider a definition not empty, if it has a value that is not an object
            // Remember, null is of type 'object' too
            if(typeof object !== 'object') { return isEmpty = false; }

            for(let k in object) {
                checkRecursive(object[k]);
            }
        };
            
        checkRecursive(definition);

        return isEmpty;
    }

    /**
     * A sanity check for fields
     *
     * @param {Object} value
     * @param {Object} definition
     *
     * @return {Object} Checked value
     */
    static fieldSanityCheck(value, definition) {
        // If the definition value is set to multilingual, but the value isn't an object, convert it
        if(definition.multilingual && (!value || typeof value !== 'object')) {
            let oldValue = value;

            value = {};
            value[HashBrown.Context.language] = oldValue;
        }

        // If the definition value is not set to multilingual, but the value is an object
        // containing the _multilingual flag, convert it
        if(!definition.multilingual && value && typeof value === 'object' && value._multilingual) {
            value = value[HashBrown.Context.language];
        }

        // Update the _multilingual flag
        if(definition.multilingual && value && !value._multilingual) {
            value._multilingual = true;    
        
        } else if(!definition.multilingual && value && value._multilingual) {
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
     *
     * @return {Number} New index
     */
    static async getNewSortIndex(parentId, aboveId, belowId) {
        if(aboveId) {
            let aboveContent = await this.getContentById(aboveId);
            
            return aboveContent.sort + 1;
        }

        if(belowId) {
            let belowContent = await this.getContentById(belowId);
            
            return belowContent.sort + 1;
        }

        // Filter out content that doesn't have the same parent
        let allContent = await HashBrown.Helpers.ContentHelper.getAllContent();
        
        allContent.filter((x) => {
            return x.parentId == parentId || (!x.parentId && !parentId);
        });

        // Find new index
        // NOTE: The index should be the highest sort number + 10000 to give a bit of leg room for sorting later
        let newIndex = 10000;

        for(let content of allContent) {
            if(newIndex - 10000 <= content.sort) {
                newIndex = content.sort + 10000;
            }
        }

        return newIndex;
    }

    /**
     * Starts a tour of the Content section
     */
    static async startTour() {
        if(location.hash.indexOf('content/') < 0) {
            location.hash = '/content/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/content/"]', 'This the Content section, where you will do all of your authoring.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/content/"]', 'Here you will find all of your authored Content, like webpages. You can right click here to create a Content node.', 'right', 'next');
        
        let editor = document.querySelector('.editor--content');

        if(editor) {
            await UI.highlight('.editor--content', 'This is the Content editor, where you edit Content nodes.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Content editor will be when you click a Content node.', 'left', 'next');
        }
    }
}

module.exports = ContentHelper;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper class for Content
 *
 * @memberof HashBrown.Common.Helpers
 */
class ContentHelper {
    /**
     * Gets all Content objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Array} Content
     */
    static getAllContent(project, environment) {
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
    static getSlug(string) {
        return (string || '')
            .toLowerCase()
            .replace(/[æ|ä]/g, 'ae')
            .replace(/[ø|ö]/g, 'oe')
            .replace(/å/g, 'aa')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            ;
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
    static getContentById(project, environment, id) {
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
    static setContentById(project, environment, id, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return new Promise((resolve, reject) => {
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
    static isSchemaAllowedAsChild(project, environment, parentId, childSchemaId) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(parentId, 'parentId', String);
        checkParam(childSchemaId, 'childSchemaId', String);

        // No parent ID means root, and all Schemas are allowed there
        if(!parentId) {
            return Promise.resolve();

        } else {
            return this.getContentById(project, environment, parentId)
            .then((parentContent) => {
                return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, parentContent.schemaId);
            })
            .then((parentSchema) => {
                // The Schema was not an allowed child
                if(parentSchema.allowedChildSchemas.indexOf(childSchemaId) < 0) {
                    return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, childSchemaId)
                    .then((childSchema) => {
                        return Promise.reject(new Error('Content with Schema "' + childSchema.name + '" is not an allowed child of Content with Schema "' + parentSchema.name + '"'));
                    });
                
                // The Schema was an allowed child, resolve
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
    static createContent() {
        return new Promise((resolve, reject) => {
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
    static removeContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

module.exports = ContentHelper;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The client side helper class for Forms
 */
class FormHelper {
    /**
     * Gets all Forms
     *
     * @return {Array} Forms
     */
    static getAllForms() {
        return HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Form, 'forms');
    }
    
    /**
     * Gets a Form by id
     *
     * @param {String} id
     *
     * @return {HashBrown.Models.Form} Form
     */
    static getFormById(id) {
        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Form, 'forms', id);
    }
    
    /**
     * Starts a tour of the Forms section
     */
    static async startTour() {
        if(location.hash.indexOf('forms/') < 0) {
            location.hash = '/forms/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navbar-main__tab[data-route="/forms/"]', 'This the Forms section, where user submitted content lives.', 'right', 'next');

        await UI.highlight('.navbar-main__pane[data-route="/forms/"]', 'Here you will find all of your Forms. You can right click here to create a new Form.', 'right', 'next');
        
        let editor = document.querySelector('.editor--form');

        if(editor) {
            await UI.highlight('.editor--form', 'This is the Form editor, where you edit Forms.', 'left', 'next');
        } else {
            await UI.highlight('.page--environment__space--editor', 'This is where the Form editor will be when you click a Form.', 'left', 'next');
        }
    }
}

module.exports = FormHelper;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const DebugHelperCommon = __webpack_require__(40);

/**
 * The client side debug helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class DebugHelper extends DebugHelperCommon {
}

module.exports = DebugHelper;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper for debugging
 *
 * @memberof HashBrown.Common.Helpers
 */
class DebugHelper {
    /**
     * Event: Log
     *
     * @param {String} dateString
     * @param {String} senderString
     * @param {String} message
     * @param {String} type
     */
    static onLog(dateString, senderString, message, type) {
        if(type) {
            message = '[' + type.toUpperCase() + '] ' + message;
        }

        console.log(dateString + ' | ' + senderString + ' | ' + message);
    }

    /**
     * Gets the date string
     *
     * @returns {String} date
     */
    static getDateString() {
        let date = new Date();

        let monthString = (date.getMonth() + 1);

        if(monthString < 10) {
            monthString = '0' + monthString;
        }

        let dateString = date.getDate();

        if(dateString < 10) {
            dateString = '0' + dateString;
        }
        
        let hoursString = date.getHours();

        if(hoursString < 10) {
            hoursString = '0' + hoursString;
        }
        
        let minutesString = date.getMinutes();

        if(minutesString < 10) {
            minutesString = '0' + minutesString;
        }
        
        let secondsString = date.getSeconds();

        if(secondsString < 10) {
            secondsString = '0' + secondsString;
        }

        let output =
            date.getFullYear() + '.' +
            monthString + '.' +
            dateString + ' ' +
            hoursString + ':' + 
            minutesString + ':' + 
            secondsString;

        return output;
    }
    
    /**
     * Parse sender
     *
     * @param {Object} sender
     *
     * @returns {String} name
     */
    static parseSender(sender, ignoreLast) {
        let senderName = '';

        if(sender) {
            if(typeof sender === 'string') {
                senderName = sender;

            } else if(typeof sender === 'function') {
                senderName = sender.name;

            } else if(sender.constructor) {
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
    static getDebugVerbosity() {
        return 1;
    }

    /**
     * Logs a message
     *
     * @param {String} message
     * @param {Object} sender
     * @param {Number} verbosity
     */
    static log(message, sender, verbosity = 1) {
        if(verbosity == 0) {
            this.error('Verbosity cannot be set to 0', this);

        } else if(!verbosity) {
            verbosity = 1;
        }

        if(this.getDebugVerbosity() >= verbosity) {
            this.onLog(this.getDateString(), this.parseSender(sender), message);
        }
    }

    /**
     * Shows an error
     *
     * @param {String|Error} error
     * @param {Object} sender
     */
    static error(error, sender) {
        if(error instanceof Error !== true) {
            error = new Error(error);
        }

        this.onLog(this.getDateString(), this.parseSender(sender), error.message || error.trace , 'error');
    
        throw error;
    }

    /**
     * Shows a warning
     */
    static warning(message, sender) {
        this.onLog(this.getDateString(), this.parseSender(sender), message, 'warning');
    }

    /**
     * Starts a timer
     *
     * @param {String} id
     */
    static startTimer(id) {
        checkParam(id, 'id', String, true);

        if(!this.timers) { this.timers = {}; }

        this.timers[id] = Date.now();
        
        console.log('timer/' + id + ': Start!');
    }

    /**
     * Prints the timer duration
     *
     * @param {String} id
     * @param {String} message
     */
    static printTimer(id, message) {
        checkParam(id, 'id', String, true);
        checkParam(message, 'message', String, true);
        
        if(!this.timers || !this.timers[id]) { this.startTimer(id); }

        console.log('timer/' + id + ': ' + message + '(' + (Date.now() - this.timers[id]) + 'ms)');
        
        this.timers[id] = Date.now();
    }
}

module.exports = DebugHelper;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const LanguageHelperCommon = __webpack_require__(42);

let selectedLanguages = {};

/**
 * The client side language helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class LanguageHelper extends LanguageHelperCommon {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getLanguages(project) {
        project = project || HashBrown.Helpers.ProjectHelper.currentProject;

        return HashBrown.Helpers.SettingsHelper.getSettings(project, null, 'languages')
        .then((selected) => {
            if(!selected || !Array.isArray(selected)) {
                selected = ['en'];
            }

            selected.sort();

            selectedLanguages[project] = selected;

            return Promise.resolve(selected);
        });
    }

    /**
     * Sets all languages
     *
     * @param {String} project
     * @param {Array} languages
     *
     * @returns {Promise} promise
     */
    static setLanguages(project, languages) {
        checkParam(project, 'project', String);
        checkParam(languages, 'languages', Array);

        if(!Array.isArray(languages)) {
            return Promise.reject(new Error('Language array cannot be of type "' + typeof languages + '"'));
        }

        return HashBrown.Helpers.SettingsHelper.setSettings(project, null, 'languages', languages);
    }
}

module.exports = LanguageHelper;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper for language
 *
 * @memberof HashBrown.Common.Helpers
 */
class LanguageHelper {
    /**
     * Gets all selected languages
     *
     * @param {String} project
     *
     * @returns {Array} List of language names
     */
    static getLanguages(project) {
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
    static setLanguages(project, languages) {
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
    static getAllLocalizedPropertySets(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return this.getLanguages(project)
        .then((languages) => {
            let sets = {};

            for(let language of languages) {
                let properties = content.getLocalizedProperties(language);
                
                sets[language] = properties;
            }

            return Promise.resolve(sets);
        });
    }
    
    /**
     * Gets all languages
     *
     * @returns {Array} List of language names
     */
    static getLanguageOptions() {
        return [
            "aa",
            "ab",
            "ae",
            "af",
            "ak",
            "am",
            "an",
            "ar",
            "as",
            "av",
            "ay",
            "az",
            "ba",
            "be",
            "bg",
            "bh",
            "bi",
            "bm",
            "bn",
            "bo",
            "br",
            "bs",
            "ca",
            "ce",
            "ch",
            "co",
            "cr",
            "cs",
            "cu",
            "cv",
            "cy",
            "da",
            "de",
            "dv",
            "dz",
            "ee",
            "el",
            "en",
            "eo",
            "es",
            "et",
            "eu",
            "fa",
            "ff",
            "fi",
            "fj",
            "fo",
            "fr",
            "fy",
            "ga",
            "gd",
            "gl",
            "gn",
            "gu",
            "gv",
            "ha",
            "he",
            "hi",
            "ho",
            "hr",
            "ht",
            "hu",
            "hy",
            "hz",
            "ia",
            "id",
            "ie",
            "ig",
            "ii",
            "ik",
            "io",
            "is",
            "it",
            "iu",
            "ja",
            "jv",
            "ka",
            "kg",
            "ki",
            "kj",
            "kk",
            "kl",
            "km",
            "kn",
            "ko",
            "kr",
            "ks",
            "ku",
            "kv",
            "kw",
            "ky",
            "la",
            "lb",
            "lg",
            "li",
            "ln",
            "lo",
            "lt",
            "lu",
            "lv",
            "mg",
            "mh",
            "mi",
            "mk",
            "ml",
            "mn",
            "mr",
            "ms",
            "mt",
            "my",
            "na",
            "nb",
            "nd",
            "ne",
            "ng",
            "nl",
            "nn",
            "no",
            "nr",
            "nv",
            "ny",
            "oc",
            "oj",
            "om",
            "or",
            "os",
            "pa",
            "pi",
            "pl",
            "ps",
            "pt",
            "qu",
            "rc",
            "rm",
            "rn",
            "ro",
            "ru",
            "rw",
            "sa",
            "sc",
            "sd",
            "se",
            "sg",
            "si",
            "sk",
            "sl",
            "sm",
            "sn",
            "so",
            "sq",
            "sr",
            "ss",
            "st",
            "su",
            "sv",
            "sw",
            "ta",
            "te",
            "tg",
            "th",
            "ti",
            "tk",
            "tl",
            "tn",
            "to",
            "tr",
            "ts",
            "tt",
            "tw",
            "ty",
            "ug",
            "uk",
            "ur",
            "uz",
            "ve",
            "vi",
            "vo",
            "wa",
            "wo",
            "xh",
            "yi",
            "yo",
            "za",
            "zh",
            "zu"
        ];
    }
}

module.exports = LanguageHelper;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper class for handling markdown
 *
 * @memberof HashBrown.Client.Helpers
 */
class MarkdownHelper {
    /**
     * Converts a string from HTML to markdown
     *
     * @param {String} html
     *
     * @return {String} Markdown
     *
     * MIT License
     *  
     * Copyright (c) 2017 Dom Christie
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    static toMarkdown(html) {
        function extend (destination) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (source.hasOwnProperty(key)) destination[key] = source[key];
                }
            }
            return destination
        }

        function repeat (character, count) {
            return Array(count + 1).join(character)
        }

        var blockElements = [
            'address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas',
            'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
            'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
            'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
            'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
        ];

        function isBlock (node) {
            return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
        }

        var voidElements = [
            'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
            'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        ];

        function isVoid (node) {
            return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1
        }

        var voidSelector = voidElements.join();
        
        function hasVoid (node) {
            return node.querySelector && node.querySelector(voidSelector)
        }

        var rules = {};

        rules.paragraph = {
            filter: 'p',

            replacement: function (content) {
                return '\n\n' + content + '\n\n'
            }
        };

        rules.lineBreak = {
            filter: 'br',

            replacement: function (content, node, options) {
                return options.br + '\n'
            }
        };

        rules.heading = {
            filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

            replacement: function (content, node, options) {
                var hLevel = Number(node.nodeName.charAt(1));

                if (options.headingStyle === 'setext' && hLevel < 3) {
                    var underline = repeat((hLevel === 1 ? '=' : '-'), content.length);
                    return (
                        '\n\n' + content + '\n' + underline + '\n\n'
                    )
                } else {
                    return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
                }
            }
        };

        rules.blockquote = {
            filter: 'blockquote',

            replacement: function (content) {
                content = content.replace(/^\n+|\n+$/g, '');
                content = content.replace(/^/gm, '> ');
                return '\n\n' + content + '\n\n'
            }
        };

        rules.list = {
            filter: ['ul', 'ol'],

            replacement: function (content, node) {
                var parent = node.parentNode;
                if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
                    return '\n' + content
                } else {
                    return '\n\n' + content + '\n\n'
                }
            }
        };

        rules.listItem = {
            filter: 'li',

            replacement: function (content, node, options) {
                content = content
                    .replace(/^\n+/, '') // remove leading newlines
                    .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
                    .replace(/\n/gm, '\n    '); // indent
                var prefix = options.bulletListMarker + '   ';
                var parent = node.parentNode;
                if (parent.nodeName === 'OL') {
                    var start = parent.getAttribute('start');
                    var index = Array.prototype.indexOf.call(parent.children, node);
                    prefix = (start ? Number(start) + index : index + 1) + '.  ';
                }
                return (
                    prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
                )
            }
        };

        rules.indentedCodeBlock = {
            filter: function (node, options) {
                return (
                    options.codeBlockStyle === 'indented' &&
                    node.nodeName === 'PRE' &&
                    node.firstChild &&
                    node.firstChild.nodeName === 'CODE'
                )
            },

            replacement: function (content, node, options) {
                return (
                    '\n\n    ' +
                    node.firstChild.textContent.replace(/\n/g, '\n    ') +
                    '\n\n'
                )
            }
        };

        rules.fencedCodeBlock = {
            filter: function (node, options) {
                return (
                    options.codeBlockStyle === 'fenced' &&
                    node.nodeName === 'PRE' &&
                    node.firstChild &&
                    node.firstChild.nodeName === 'CODE'
                )
            },

            replacement: function (content, node, options) {
                var className = node.firstChild.className || '';
                var language = (className.match(/language-(\S+)/) || [null, ''])[1];

                return (
                    '\n\n' + options.fence + language + '\n' +
                    node.firstChild.textContent +
                    '\n' + options.fence + '\n\n'
                )
            }
        };

        rules.horizontalRule = {
            filter: 'hr',

            replacement: function (content, node, options) {
                return '\n\n' + options.hr + '\n\n'
            }
        };

        rules.inlineLink = {
            filter: function (node, options) {
                return (
                    options.linkStyle === 'inlined' &&
                    node.nodeName === 'A' &&
                    node.getAttribute('href')
                )
            },

            replacement: function (content, node) {
                var href = node.getAttribute('href');
                var title = node.title ? ' "' + node.title + '"' : '';
                return '[' + content + '](' + href + title + ')'
            }
        };

        rules.referenceLink = {
            filter: function (node, options) {
                return (
                    options.linkStyle === 'referenced' &&
                    node.nodeName === 'A' &&
                    node.getAttribute('href')
                )
            },

            replacement: function (content, node, options) {
                var href = node.getAttribute('href');
                var title = node.title ? ' "' + node.title + '"' : '';
                var replacement;
                var reference;

                switch (options.linkReferenceStyle) {
                    case 'collapsed':
                        replacement = '[' + content + '][]';
                        reference = '[' + content + ']: ' + href + title;
                        break
                    case 'shortcut':
                        replacement = '[' + content + ']';
                        reference = '[' + content + ']: ' + href + title;
                        break
                    default:
                        var id = this.references.length + 1;
                        replacement = '[' + content + '][' + id + ']';
                        reference = '[' + id + ']: ' + href + title;
                }

                this.references.push(reference);
                return replacement
            },

            references: [],

            append: function (options) {
                var references = '';
                if (this.references.length) {
                    references = '\n\n' + this.references.join('\n') + '\n\n';
                    this.references = []; // Reset references
                }
                return references
            }
        };

        rules.emphasis = {
            filter: ['em', 'i'],

            replacement: function (content, node, options) {
                if (!content.trim()) return ''
                return options.emDelimiter + content + options.emDelimiter
            }
        };

        rules.strong = {
            filter: ['strong', 'b'],

            replacement: function (content, node, options) {
                if (!content.trim()) return ''
                return options.strongDelimiter + content + options.strongDelimiter
            }
        };

        rules.code = {
            filter: function (node) {
                var hasSiblings = node.previousSibling || node.nextSibling;
                var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

                return node.nodeName === 'CODE' && !isCodeBlock
            },

            replacement: function (content) {
                if (!content.trim()) return ''

                var delimiter = '`';
                var leadingSpace = '';
                var trailingSpace = '';
                var matches = content.match(/`+/gm);
                if (matches) {
                    if (/^`/.test(content)) leadingSpace = ' ';
                    if (/`$/.test(content)) trailingSpace = ' ';
                    while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';
                }

                return delimiter + leadingSpace + content + trailingSpace + delimiter
            }
        };

        rules.image = {
            filter: 'img',

            replacement: function (content, node) {
                var alt = node.alt || '';
                var src = node.getAttribute('src') || '';
                var title = node.title || '';
                var titlePart = title ? ' "' + title + '"' : '';
                return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
            }
        };

        /**
         * Manages a collection of rules used to convert HTML to Markdown
         */
        function Rules (options) {
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
            for (var key in options.rules) this.array.push(options.rules[key]);
        }

        Rules.prototype = {
            add: function (key, rule) {
                this.array.unshift(rule);
            },

            keep: function (filter) {
                this._keep.unshift({
                    filter: filter,
                    replacement: this.keepReplacement
                });
            },

            remove: function (filter) {
                this._remove.unshift({
                    filter: filter,
                    replacement: function () {
                        return ''
                    }
                });
            },

            forNode: function (node) {
                if (node.isBlank) return this.blankRule
                var rule;

                if ((rule = findRule(this.array, node, this.options))) return rule
                if ((rule = findRule(this._keep, node, this.options))) return rule
                if ((rule = findRule(this._remove, node, this.options))) return rule

                return this.defaultRule
            },

            forEach: function (fn) {
                for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
            }
        };

        function findRule (rules, node, options) {
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (filterValue(rule, node, options)) return rule
            }
            return void 0
        }

        function filterValue (rule, node, options) {
            var filter = rule.filter;
            if (typeof filter === 'string') {
                if (filter === node.nodeName.toLowerCase()) return true
            } else if (Array.isArray(filter)) {
                if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
            } else if (typeof filter === 'function') {
                if (filter.call(rule, node, options)) return true
            } else {
                throw new TypeError('`filter` needs to be a string, array, or function')
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
        function collapseWhitespace (options) {
            var element = options.element;
            var isBlock = options.isBlock;
            var isVoid = options.isVoid;
            var isPre = options.isPre || function (node) {
                return node.nodeName === 'PRE'
            };

            if (!element.firstChild || isPre(element)) return

            var prevText = null;
            var prevVoid = false;

            var prev = null;
            var node = next(prev, element, isPre);

            while (node !== element) {
                if (node.nodeType === 3 || node.nodeType === 4) { // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
                    var text = node.data.replace(/[ \r\n\t]+/g, ' ');

                    if ((!prevText || / $/.test(prevText.data)) &&
                        !prevVoid && text[0] === ' ') {
                        text = text.substr(1);
                    }

                    // `text` might be empty at this point.
                    if (!text) {
                        node = remove(node);
                        continue
                    }

                    node.data = text;

                    prevText = node;
                } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
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
                    continue
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
        function remove (node) {
            var next = node.nextSibling || node.parentNode;

            node.parentNode.removeChild(node);

            return next
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
        function next (prev, current, isPre) {
            if ((prev && prev.parentNode === current) || isPre(current)) {
                return current.nextSibling || current.parentNode
            }

            return current.firstChild || current.nextSibling || current.parentNode
        }

        /*
         * Set up window for Node.js
         */

        var root = (typeof window !== 'undefined' ? window : {});

        /*
         * Parsing HTML strings
         */

        function canParseHTMLNatively () {
            var Parser = root.DOMParser;
            var canParse = false;

            // Adapted from https://gist.github.com/1129031
            // Firefox/Opera/IE throw errors on unsupported types
            try {
                // WebKit returns null on unsupported types
                if (new Parser().parseFromString('', 'text/html')) {
                    canParse = true;
                }
            } catch (e) {}

            return canParse
        }

        function createHTMLParser () {
            var Parser = function () {};

            {
                if (shouldUseActiveX()) {
                    Parser.prototype.parseFromString = function (string) {
                        var doc = new window.ActiveXObject('htmlfile');
                        doc.designMode = 'on'; // disable on-page scripts
                        doc.open();
                        doc.write(string);
                        doc.close();
                        return doc
                    };
                } else {
                    Parser.prototype.parseFromString = function (string) {
                        var doc = document.implementation.createHTMLDocument('');
                        doc.open();
                        doc.write(string);
                        doc.close();
                        return doc
                    };
                }
            }
            return Parser
        }

        function shouldUseActiveX () {
            var useActiveX = false;
            try {
                document.implementation.createHTMLDocument('').open();
            } catch (e) {
                if (window.ActiveXObject) useActiveX = true;
            }
            return useActiveX
        }

        var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

        function RootNode (input) {
            var root;
            if (typeof input === 'string') {
                var doc = htmlParser().parseFromString(
                    // DOM parsers arrange elements in the <head> and <body>.
                    // Wrapping in a custom element ensures elements are reliably arranged in
                    // a single element.
                    '<x-turndown id="turndown-root">' + input + '</x-turndown>',
                    'text/html'
                );
                root = doc.getElementById('turndown-root');
            } else {
                root = input.cloneNode(true);
            }
            collapseWhitespace({
                element: root,
                isBlock: isBlock,
                isVoid: isVoid
            });

            return root
        }

        var _htmlParser;
        function htmlParser () {
            _htmlParser = _htmlParser || new HTMLParser();
            return _htmlParser
        }

        function Node (node) {
            node.isBlock = isBlock(node);
            node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
            node.isBlank = isBlank(node);
            node.flankingWhitespace = flankingWhitespace(node);
            return node
        }

        function isBlank (node) {
            return (
                ['A', 'TH', 'TD', 'IFRAME', 'SCRIPT', 'AUDIO', 'VIDEO'].indexOf(node.nodeName) === -1 &&
                /^\s*$/i.test(node.textContent) &&
                !isVoid(node) &&
                !hasVoid(node)
            )
        }

        function flankingWhitespace (node) {
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

            return { leading: leading, trailing: trailing }
        }

        function isFlankedByWhitespace (side, node) {
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
            return isFlanked
        }

        var reduce = Array.prototype.reduce;
        var leadingNewLinesRegExp = /^\n*/;
        var trailingNewLinesRegExp = /\n*$/;
        var escapes = [
            [/\\/g, '\\\\'],
            [/\*/g, '\\*'],
            [/^-/g, '\\-'],
            [/^\+ /g, '\\+ '],
            [/^(=+)/g, '\\$1'],
            [/^(#{1,6}) /g, '\\$1 '],
            [/`/g, '\\`'],
            [/^~~~/g, '\\~~~'],
            [/\[/g, '\\['],
            [/\]/g, '\\]'],
            [/^>/g, '\\>'],
            [/_/g, '\\_'],
            [/^(\d+)\. /g, '$1\\. ']
        ];

        function TurndownService (options) {
            if (!(this instanceof TurndownService)) return new TurndownService(options)

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
                blankReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' : ''
                },
                keepReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' + node.outerHTML + '\n\n' : node.outerHTML
                },
                defaultReplacement: function (content, node) {
                    return node.isBlock ? '\n\n' + content + '\n\n' : content
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

            turndown: function (input) {
                if (!canConvert(input)) {
                    throw new TypeError(
                        input + ' is not a string, or an element/document/fragment node.'
                    )
                }

                if (input === '') return ''

                var output = process.call(this, new RootNode(input));
                return postProcess.call(this, output)
            },

            /**
             * Add one or more plugins
             * @public
             * @param {Function|Array} plugin The plugin or array of plugins to add
             * @returns The Turndown instance for chaining
             * @type Object
             */

            use: function (plugin) {
                if (Array.isArray(plugin)) {
                    for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
                } else if (typeof plugin === 'function') {
                    plugin(this);
                } else {
                    throw new TypeError('plugin must be a Function or an Array of Functions')
                }
                return this
            },

            /**
             * Adds a rule
             * @public
             * @param {String} key The unique key of the rule
             * @param {Object} rule The rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            addRule: function (key, rule) {
                this.rules.add(key, rule);
                return this
            },

            /**
             * Keep a node (as HTML) that matches the filter
             * @public
             * @param {String|Array|Function} filter The unique key of the rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            keep: function (filter) {
                this.rules.keep(filter);
                return this
            },

            /**
             * Remove a node that matches the filter
             * @public
             * @param {String|Array|Function} filter The unique key of the rule
             * @returns The Turndown instance for chaining
             * @type Object
             */

            remove: function (filter) {
                this.rules.remove(filter);
                return this
            },

            /**
             * Escapes Markdown syntax
             * @public
             * @param {String} string The string to escape
             * @returns A string with Markdown syntax escaped
             * @type String
             */

            escape: function (string) {
                return escapes.reduce(function (accumulator, escape) {
                    return accumulator.replace(escape[0], escape[1])
                }, string)
            }
        };

        /**
         * Reduces a DOM node down to its Markdown string equivalent
         * @private
         * @param {HTMLElement} parentNode The node to convert
         * @returns A Markdown representation of the node
         * @type String
         */

        function process (parentNode) {
            var self = this;
            return reduce.call(parentNode.childNodes, function (output, node) {
                node = new Node(node);

                var replacement = '';
                if (node.nodeType === 3) {
                    replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
                } else if (node.nodeType === 1) {
                    replacement = replacementForNode.call(self, node);
                }

                return join(output, replacement)
            }, '')
        }

        /**
         * Appends strings as each rule requires and trims the output
         * @private
         * @param {String} output The conversion output
         * @returns A trimmed version of the ouput
         * @type String
         */

        function postProcess (output) {
            var self = this;
            this.rules.forEach(function (rule) {
                if (typeof rule.append === 'function') {
                    output = join(output, rule.append(self.options));
                }
            });

            return output.replace(/^[\t\r\n]+/, '').replace(/[\t\r\n\s]+$/, '')
        }

        /**
         * Converts an element node to its Markdown equivalent
         * @private
         * @param {HTMLElement} node The node to convert
         * @returns A Markdown representation of the node
         * @type String
         */

        function replacementForNode (node) {
            var rule = this.rules.forNode(node);
            var content = process.call(this, node);
            var whitespace = node.flankingWhitespace;
            if (whitespace.leading || whitespace.trailing) content = content.trim();
            return (
                whitespace.leading +
                rule.replacement(content, node, this.options) +
                whitespace.trailing
            )
        }

        /**
         * Determines the new lines between the current output and the replacement
         * @private
         * @param {String} output The current conversion output
         * @param {String} replacement The string to append to the output
         * @returns The whitespace to separate the current output and the replacement
         * @type String
         */

        function separatingNewlines (output, replacement) {
            var newlines = [
                output.match(trailingNewLinesRegExp)[0],
                replacement.match(leadingNewLinesRegExp)[0]
            ].sort();
            var maxNewlines = newlines[newlines.length - 1];
            return maxNewlines.length < 2 ? maxNewlines : '\n\n'
        }

        function join (string1, string2) {
            var separator = separatingNewlines(string1, string2);

            // Remove trailing/leading newlines and replace with separator
            string1 = string1.replace(trailingNewLinesRegExp, '');
            string2 = string2.replace(leadingNewLinesRegExp, '');

            return string1 + separator + string2
        }

        /**
         * Determines whether an input can be converted
         * @private
         * @param {String|HTMLElement} input Describe this parameter
         * @returns Describe what it returns
         * @type String|Object|Array|Boolean|Number
         */

        function canConvert (input) {
            return (
                input != null && (
                    typeof input === 'string' ||
                    (input.nodeType && (
                        input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
                    ))
                )
            )
        }

        return new TurndownService().turndown(html);
    }

    /**
     * Converts a markdown string to HTML
     *
     * @param {String} markdown
     *
     * @return {String} HTML
     *
     * Copyright (c) 2011-2018, Christopher Jeffrey (https://github.com/chjj/)
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    static toHtml(markdown) {
        /**
         * Block-Level Grammar
         */
        var block = {
            newline: /^\n+/,
            code: /^( {4}[^\n]+\n*)+/,
            fences: noop,
            hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
            heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
            nptable: noop,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
            html: '^ {0,3}(?:' // optional indentation
            + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
            + '|comment[^\\n]*(\\n+|$)' // (2)
            + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
            + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
            + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
            + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
            + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
            + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
            + ')',
            def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
            table: noop,
            lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
            paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,
            text: /^[^\n]+/
        };

        block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
        block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
        block.def = edit(block.def)
            .replace('label', block._label)
            .replace('title', block._title)
            .getRegex();

        block.bullet = /(?:[*+-]|\d{1,9}\.)/;
        block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
        block.item = edit(block.item, 'gm')
            .replace(/bull/g, block.bullet)
            .getRegex();

        block.list = edit(block.list)
            .replace(/bull/g, block.bullet)
            .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
            .replace('def', '\\n+(?=' + block.def.source + ')')
            .getRegex();

        block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
            + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
            + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
            + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
            + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
            + '|track|ul';
        block._comment = /<!--(?!-?>)[\s\S]*?-->/;
        block.html = edit(block.html, 'i')
            .replace('comment', block._comment)
            .replace('tag', block._tag)
            .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
            .getRegex();

        block.paragraph = edit(block.paragraph)
            .replace('hr', block.hr)
            .replace('heading', block.heading)
            .replace('lheading', block.lheading)
            .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
            .getRegex();

        block.blockquote = edit(block.blockquote)
            .replace('paragraph', block.paragraph)
            .getRegex();

        /**
         * Normal Block Grammar
         */

        block.normal = merge({}, block);

        /**
         * GFM Block Grammar
         */

        block.gfm = merge({}, block.normal, {
            fences: /^ {0,3}(`{3,}|~{3,})([^`\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
            paragraph: /^/,
            heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
        });

        block.gfm.paragraph = edit(block.paragraph)
            .replace('(?!', '(?!'
                + block.gfm.fences.source.replace('\\1', '\\2') + '|'
                + block.list.source.replace('\\1', '\\3') + '|')
            .getRegex();

        /**
         * GFM + Tables Block Grammar
         */

        block.tables = merge({}, block.gfm, {
            nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
            table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
        });

        /**
         * Pedantic grammar
         */

        block.pedantic = merge({}, block.normal, {
            html: edit(
                '^ *(?:comment *(?:\\n|\\s*$)'
                + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
                + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
            .replace('comment', block._comment)
            .replace(/tag/g, '(?!(?:'
                + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
                + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
                + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
            .getRegex(),
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/
        });

        /**
         * Block Lexer
         */

        function Lexer(options) {
            this.tokens = [];
            this.tokens.links = Object.create(null);
            this.options = options || marked.defaults;
            this.rules = block.normal;

            if (this.options.pedantic) {
                this.rules = block.pedantic;
            } else if (this.options.gfm) {
                if (this.options.tables) {
                    this.rules = block.tables;
                } else {
                    this.rules = block.gfm;
                }
            }
        }

        /**
         * Expose Block Rules
         */

        Lexer.rules = block;

        /**
         * Static Lex Method
         */

        Lexer.lex = function(src, options) {
            var lexer = new Lexer(options);
            return lexer.lex(src);
        };

        /**
         * Preprocessing
         */

        Lexer.prototype.lex = function(src) {
            src = src
                .replace(/\r\n|\r/g, '\n')
                .replace(/\t/g, '    ')
                .replace(/\u00a0/g, ' ')
                .replace(/\u2424/g, '\n');

            return this.token(src, true);
        };

        /**
         * Lexing
         */

        Lexer.prototype.token = function(src, top) {
            src = src.replace(/^ +$/gm, '');
            var next,
                loose,
                cap,
                bull,
                b,
                item,
                listStart,
                listItems,
                t,
                space,
                i,
                tag,
                l,
                isordered,
                istask,
                ischecked;

            while (src) {
                // newline
                if (cap = this.rules.newline.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[0].length > 1) {
                        this.tokens.push({
                            type: 'space'
                        });
                    }
                }

                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    cap = cap[0].replace(/^ {4}/gm, '');
                    this.tokens.push({
                        type: 'code',
                        text: !this.options.pedantic
                        ? rtrim(cap, '\n')
                        : cap
                    });
                    continue;
                }

                // fences (gfm)
                if (cap = this.rules.fences.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'code',
                        lang: cap[2] ? cap[2].trim() : cap[2],
                        text: cap[3] || ''
                    });
                    continue;
                }

                // heading
                if (cap = this.rules.heading.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'heading',
                        depth: cap[1].length,
                        text: cap[2]
                    });
                    continue;
                }

                // table no leading pipe (gfm)
                if (cap = this.rules.nptable.exec(src)) {
                    item = {
                        type: 'table',
                        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                    };

                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);

                        for (i = 0; i < item.align.length; i++) {
                            if (/^ *-+: *$/.test(item.align[i])) {
                                item.align[i] = 'right';
                            } else if (/^ *:-+: *$/.test(item.align[i])) {
                                item.align[i] = 'center';
                            } else if (/^ *:-+ *$/.test(item.align[i])) {
                                item.align[i] = 'left';
                            } else {
                                item.align[i] = null;
                            }
                        }

                        for (i = 0; i < item.cells.length; i++) {
                            item.cells[i] = splitCells(item.cells[i], item.header.length);
                        }

                        this.tokens.push(item);

                        continue;
                    }
                }

                // hr
                if (cap = this.rules.hr.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'hr'
                    });
                    continue;
                }

                // blockquote
                if (cap = this.rules.blockquote.exec(src)) {
                    src = src.substring(cap[0].length);

                    this.tokens.push({
                        type: 'blockquote_start'
                    });

                    cap = cap[0].replace(/^ *> ?/gm, '');

                    // Pass `top` to keep the current
                    // "toplevel" state. This is exactly
                    // how markdown.pl works.
                    this.token(cap, top);

                    this.tokens.push({
                        type: 'blockquote_end'
                    });

                    continue;
                }

                // list
                if (cap = this.rules.list.exec(src)) {
                    src = src.substring(cap[0].length);
                    bull = cap[2];
                    isordered = bull.length > 1;

                    listStart = {
                        type: 'list_start',
                        ordered: isordered,
                        start: isordered ? +bull : '',
                        loose: false
                    };

                    this.tokens.push(listStart);

                    // Get each top-level item.
                    cap = cap[0].match(this.rules.item);

                    listItems = [];
                    next = false;
                    l = cap.length;
                    i = 0;

                    for (; i < l; i++) {
                        item = cap[i];

                        // Remove the list item's bullet
                        // so it is seen as the next token.
                        space = item.length;
                        item = item.replace(/^ *([*+-]|\d+\.) */, '');

                        // Outdent whatever the
                        // list item contains. Hacky.
                        if (~item.indexOf('\n ')) {
                            space -= item.length;
                            item = !this.options.pedantic
                                ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                                : item.replace(/^ {1,4}/gm, '');
                        }

                        // Determine whether the next list item belongs here.
                        // Backpedal if it does not belong in this list.
                        if (i !== l - 1) {
                            b = block.bullet.exec(cap[i + 1])[0];
                            if (bull.length > 1 ? b.length === 1
                                : (b.length > 1 || (this.options.smartLists && b !== bull))) {
                                src = cap.slice(i + 1).join('\n') + src;
                                i = l - 1;
                            }
                        }

                        // Determine whether item is loose or not.
                        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                        // for discount behavior.
                        loose = next || /\n\n(?!\s*$)/.test(item);
                        if (i !== l - 1) {
                            next = item.charAt(item.length - 1) === '\n';
                            if (!loose) loose = next;
                        }

                        if (loose) {
                            listStart.loose = true;
                        }

                        // Check for task list items
                        istask = /^\[[ xX]\] /.test(item);
                        ischecked = undefined;
                        if (istask) {
                            ischecked = item[1] !== ' ';
                            item = item.replace(/^\[[ xX]\] +/, '');
                        }

                        t = {
                            type: 'list_item_start',
                            task: istask,
                            checked: ischecked,
                            loose: loose
                        };

                        listItems.push(t);
                        this.tokens.push(t);

                        // Recurse.
                        this.token(item, false);

                        this.tokens.push({
                            type: 'list_item_end'
                        });
                    }

                    if (listStart.loose) {
                        l = listItems.length;
                        i = 0;
                        for (; i < l; i++) {
                            listItems[i].loose = true;
                        }
                    }

                    this.tokens.push({
                        type: 'list_end'
                    });

                    continue;
                }

                // html
                if (cap = this.rules.html.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: this.options.sanitize
                        ? 'paragraph'
                        : 'html',
                        pre: !this.options.sanitizer
                        && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                        text: cap[0]
                    });
                    continue;
                }

                // def
                if (top && (cap = this.rules.def.exec(src))) {
                    src = src.substring(cap[0].length);
                    if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
                    tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
                    if (!this.tokens.links[tag]) {
                        this.tokens.links[tag] = {
                            href: cap[2],
                            title: cap[3]
                        };
                    }
                    continue;
                }

                // table (gfm)
                if (cap = this.rules.table.exec(src)) {
                    item = {
                        type: 'table',
                        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
                        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                        cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
                    };

                    if (item.header.length === item.align.length) {
                        src = src.substring(cap[0].length);

                        for (i = 0; i < item.align.length; i++) {
                            if (/^ *-+: *$/.test(item.align[i])) {
                                item.align[i] = 'right';
                            } else if (/^ *:-+: *$/.test(item.align[i])) {
                                item.align[i] = 'center';
                            } else if (/^ *:-+ *$/.test(item.align[i])) {
                                item.align[i] = 'left';
                            } else {
                                item.align[i] = null;
                            }
                        }

                        for (i = 0; i < item.cells.length; i++) {
                            item.cells[i] = splitCells(
                                item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
                                item.header.length);
                        }

                        this.tokens.push(item);

                        continue;
                    }
                }

                // lheading
                if (cap = this.rules.lheading.exec(src)) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'heading',
                        depth: cap[2] === '=' ? 1 : 2,
                        text: cap[1]
                    });
                    continue;
                }

                // top-level paragraph
                if (top && (cap = this.rules.paragraph.exec(src))) {
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'paragraph',
                        text: cap[1].charAt(cap[1].length - 1) === '\n'
                        ? cap[1].slice(0, -1)
                        : cap[1]
                    });
                    continue;
                }

                // text
                if (cap = this.rules.text.exec(src)) {
                    // Top-level should never reach here.
                    src = src.substring(cap[0].length);
                    this.tokens.push({
                        type: 'text',
                        text: cap[0]
                    });
                    continue;
                }

                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }

            return this.tokens;
        };

        /**
         * Inline-Level Grammar
         */

        var inline = {
            escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
            autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
            url: noop,
            tag: '^comment'
            + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
            + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
            + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
            + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
            + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
            link: /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,
            reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
            nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
            strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
            em: /^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
            code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
            br: /^( {2,}|\\)\n(?!\s*$)/,
            del: noop,
            text: /^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/
        };

        // list of punctuation marks from common mark spec
        // without ` and ] to workaround Rule 17 (inline code blocks/links)
        inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
        inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

        inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

        inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
        inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
        inline.autolink = edit(inline.autolink)
            .replace('scheme', inline._scheme)
            .replace('email', inline._email)
            .getRegex();

        inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

        inline.tag = edit(inline.tag)
            .replace('comment', block._comment)
            .replace('attribute', inline._attribute)
            .getRegex();

        inline._label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|`(?!`)|[^\[\]\\`])*?/;
        inline._href = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*)/;
        inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

        inline.link = edit(inline.link)
            .replace('label', inline._label)
            .replace('href', inline._href)
            .replace('title', inline._title)
            .getRegex();

        inline.reflink = edit(inline.reflink)
            .replace('label', inline._label)
            .getRegex();

        /**
         * Normal Inline Grammar
         */

        inline.normal = merge({}, inline);

        /**
         * Pedantic Inline Grammar
         */

        inline.pedantic = merge({}, inline.normal, {
            strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
            em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
            link: edit(/^!?\[(label)\]\((.*?)\)/)
            .replace('label', inline._label)
            .getRegex(),
            reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
            .replace('label', inline._label)
            .getRegex()
        });

        /**
         * GFM Inline Grammar
         */

        inline.gfm = merge({}, inline.normal, {
            escape: edit(inline.escape).replace('])', '~|])').getRegex(),
            _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
            url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
            _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
            del: /^~+(?=\S)([\s\S]*?\S)~+/,
            text: edit(inline.text)
            .replace(']|', '~]|')
            .replace('|$', '|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&\'*+/=?^_`{\\|}~-]+@|$')
            .getRegex()
        });

        inline.gfm.url = edit(inline.gfm.url, 'i')
            .replace('email', inline.gfm._extended_email)
            .getRegex();
        /**
         * GFM + Line Breaks Inline Grammar
         */

        inline.breaks = merge({}, inline.gfm, {
            br: edit(inline.br).replace('{2,}', '*').getRegex(),
            text: edit(inline.gfm.text).replace('{2,}', '*').getRegex()
        });

        /**
         * Inline Lexer & Compiler
         */

        function InlineLexer(links, options) {
            this.options = options || marked.defaults;
            this.links = links;
            this.rules = inline.normal;
            this.renderer = this.options.renderer || new Renderer();
            this.renderer.options = this.options;

            if (!this.links) {
                throw new Error('Tokens array requires a `links` property.');
            }

            if (this.options.pedantic) {
                this.rules = inline.pedantic;
            } else if (this.options.gfm) {
                if (this.options.breaks) {
                    this.rules = inline.breaks;
                } else {
                    this.rules = inline.gfm;
                }
            }
        }

        /**
         * Expose Inline Rules
         */

        InlineLexer.rules = inline;

        /**
         * Static Lexing/Compiling Method
         */

        InlineLexer.output = function(src, links, options) {
            var inline = new InlineLexer(links, options);
            return inline.output(src);
        };

        /**
         * Lexing/Compiling
         */

        InlineLexer.prototype.output = function(src) {
            var out = '',
                link,
                text,
                href,
                title,
                cap,
                prevCapZero;

            while (src) {
                // escape
                if (cap = this.rules.escape.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += escape(cap[1]);
                    continue;
                }

                // tag
                if (cap = this.rules.tag.exec(src)) {
                    if (!this.inLink && /^<a /i.test(cap[0])) {
                        this.inLink = true;
                    } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                        this.inLink = false;
                    }
                    if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = true;
                    } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
                        this.inRawBlock = false;
                    }

                    src = src.substring(cap[0].length);
                    out += this.options.sanitize
                        ? this.options.sanitizer
                        ? this.options.sanitizer(cap[0])
                        : escape(cap[0])
                        : cap[0];
                    continue;
                }

                // link
                if (cap = this.rules.link.exec(src)) {
                    var lastParenIndex = findClosingBracket(cap[2], '()');
                    if (lastParenIndex > -1) {
                        var linkLen = cap[0].length - (cap[2].length - lastParenIndex) - (cap[3] || '').length;
                        cap[2] = cap[2].substring(0, lastParenIndex);
                        cap[0] = cap[0].substring(0, linkLen).trim();
                        cap[3] = '';
                    }
                    src = src.substring(cap[0].length);
                    this.inLink = true;
                    href = cap[2];
                    if (this.options.pedantic) {
                        link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

                        if (link) {
                            href = link[1];
                            title = link[3];
                        } else {
                            title = '';
                        }
                    } else {
                        title = cap[3] ? cap[3].slice(1, -1) : '';
                    }
                    href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
                    out += this.outputLink(cap, {
                        href: InlineLexer.escapes(href),
                        title: InlineLexer.escapes(title)
                    });
                    this.inLink = false;
                    continue;
                }

                // reflink, nolink
                if ((cap = this.rules.reflink.exec(src))
                    || (cap = this.rules.nolink.exec(src))) {
                    src = src.substring(cap[0].length);
                    link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                    link = this.links[link.toLowerCase()];
                    if (!link || !link.href) {
                        out += cap[0].charAt(0);
                        src = cap[0].substring(1) + src;
                        continue;
                    }
                    this.inLink = true;
                    out += this.outputLink(cap, link);
                    this.inLink = false;
                    continue;
                }

                // strong
                if (cap = this.rules.strong.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }

                // em
                if (cap = this.rules.em.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
                    continue;
                }

                // code
                if (cap = this.rules.code.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.codespan(escape(cap[2].trim(), true));
                    continue;
                }

                // br
                if (cap = this.rules.br.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.br();
                    continue;
                }

                // del (gfm)
                if (cap = this.rules.del.exec(src)) {
                    src = src.substring(cap[0].length);
                    out += this.renderer.del(this.output(cap[1]));
                    continue;
                }

                // autolink
                if (cap = this.rules.autolink.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (cap[2] === '@') {
                        text = escape(this.mangle(cap[1]));
                        href = 'mailto:' + text;
                    } else {
                        text = escape(cap[1]);
                        href = text;
                    }
                    out += this.renderer.link(href, null, text);
                    continue;
                }

                // url (gfm)
                if (!this.inLink && (cap = this.rules.url.exec(src))) {
                    if (cap[2] === '@') {
                        text = escape(cap[0]);
                        href = 'mailto:' + text;
                    } else {
                        // do extended autolink path validation
                        do {
                            prevCapZero = cap[0];
                            cap[0] = this.rules._backpedal.exec(cap[0])[0];
                        } while (prevCapZero !== cap[0]);
                        text = escape(cap[0]);
                        if (cap[1] === 'www.') {
                            href = 'http://' + text;
                        } else {
                            href = text;
                        }
                    }
                    src = src.substring(cap[0].length);
                    out += this.renderer.link(href, null, text);
                    continue;
                }

                // text
                if (cap = this.rules.text.exec(src)) {
                    src = src.substring(cap[0].length);
                    if (this.inRawBlock) {
                        out += this.renderer.text(cap[0]);
                    } else {
                        out += this.renderer.text(escape(this.smartypants(cap[0])));
                    }
                    continue;
                }

                if (src) {
                    throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
                }
            }

            return out;
        };

        InlineLexer.escapes = function(text) {
            return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
        };

        /**
         * Compile Link
         */

        InlineLexer.prototype.outputLink = function(cap, link) {
            var href = link.href,
                title = link.title ? escape(link.title) : null;

            return cap[0].charAt(0) !== '!'
                ? this.renderer.link(href, title, this.output(cap[1]))
                : this.renderer.image(href, title, escape(cap[1]));
        };

        /**
         * Smartypants Transformations
         */

        InlineLexer.prototype.smartypants = function(text) {
            if (!this.options.smartypants) return text;
            return text
            // em-dashes
                .replace(/---/g, '\u2014')
            // en-dashes
                .replace(/--/g, '\u2013')
            // opening singles
                .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
            // closing singles & apostrophes
                .replace(/'/g, '\u2019')
            // opening doubles
                .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
            // closing doubles
                .replace(/"/g, '\u201d')
            // ellipses
                .replace(/\.{3}/g, '\u2026');
        };

        /**
         * Mangle Links
         */

        InlineLexer.prototype.mangle = function(text) {
            if (!this.options.mangle) return text;
            var out = '',
                l = text.length,
                i = 0,
                ch;

            for (; i < l; i++) {
                ch = text.charCodeAt(i);
                if (Math.random() > 0.5) {
                    ch = 'x' + ch.toString(16);
                }
                out += '&#' + ch + ';';
            }

            return out;
        };

        /**
         * Renderer
         */

        function Renderer(options) {
            this.options = options || marked.defaults;
        }

        Renderer.prototype.code = function(code, infostring, escaped) {
            var lang = (infostring || '').match(/\S*/)[0];
            if (this.options.highlight) {
                var out = this.options.highlight(code, lang);
                if (out != null && out !== code) {
                    escaped = true;
                    code = out;
                }
            }

            if (!lang) {
                return '<pre><code>'
                    + (escaped ? code : escape(code, true))
                    + '</code></pre>';
            }

            return '<pre><code class="'
                + this.options.langPrefix
                + escape(lang, true)
                + '">'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        };

        Renderer.prototype.blockquote = function(quote) {
            return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        Renderer.prototype.html = function(html) {
            return html;
        };

        Renderer.prototype.heading = function(text, level, raw, slugger) {
            if (this.options.headerIds) {
                return '<h'
                    + level
                    + ' id="'
                    + this.options.headerPrefix
                    + slugger.slug(raw)
                    + '">'
                    + text
                    + '</h'
                    + level
                    + '>\n';
            }
            // ignore IDs
            return '<h' + level + '>' + text + '</h' + level + '>\n';
        };

        Renderer.prototype.hr = function() {
            return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        Renderer.prototype.list = function(body, ordered, start) {
            var type = ordered ? 'ol' : 'ul',
                startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
            return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };

        Renderer.prototype.listitem = function(text) {
            return '<li>' + text + '</li>\n';
        };

        Renderer.prototype.checkbox = function(checked) {
            return '<input '
                + (checked ? 'checked="" ' : '')
                + 'disabled="" type="checkbox"'
                + (this.options.xhtml ? ' /' : '')
                + '> ';
        };

        Renderer.prototype.paragraph = function(text) {
            return '<p>' + text + '</p>\n';
        };

        Renderer.prototype.table = function(header, body) {
            if (body) body = '<tbody>' + body + '</tbody>';

            return '<table>\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + body
                + '</table>\n';
        };

        Renderer.prototype.tablerow = function(content) {
            return '<tr>\n' + content + '</tr>\n';
        };

        Renderer.prototype.tablecell = function(content, flags) {
            var type = flags.header ? 'th' : 'td';
            var tag = flags.align
                ? '<' + type + ' align="' + flags.align + '">'
                : '<' + type + '>';
            return tag + content + '</' + type + '>\n';
        };

        // span level renderer
        Renderer.prototype.strong = function(text) {
            return '<strong>' + text + '</strong>';
        };

        Renderer.prototype.em = function(text) {
            return '<em>' + text + '</em>';
        };

        Renderer.prototype.codespan = function(text) {
            return '<code>' + text + '</code>';
        };

        Renderer.prototype.br = function() {
            return this.options.xhtml ? '<br/>' : '<br>';
        };

        Renderer.prototype.del = function(text) {
            return '<del>' + text + '</del>';
        };

        Renderer.prototype.link = function(href, title, text) {
            href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }
            var out = '<a href="' + escape(href) + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>' + text + '</a>';
            return out;
        };

        Renderer.prototype.image = function(href, title, text) {
            href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
            if (href === null) {
                return text;
            }

            var out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            return out;
        };

        Renderer.prototype.text = function(text) {
            return text;
        };

        /**
         * TextRenderer
         * returns only the textual part of the token
         */

        function TextRenderer() {}

        // no need for block level renderers

        TextRenderer.prototype.strong =
            TextRenderer.prototype.em =
            TextRenderer.prototype.codespan =
            TextRenderer.prototype.del =
            TextRenderer.prototype.text = function (text) {
                return text;
            };

        TextRenderer.prototype.link =
            TextRenderer.prototype.image = function(href, title, text) {
                return '' + text;
            };

        TextRenderer.prototype.br = function() {
            return '';
        };

        /**
         * Parsing & Compiling
         */

        function Parser(options) {
            this.tokens = [];
            this.token = null;
            this.options = options || marked.defaults;
            this.options.renderer = this.options.renderer || new Renderer();
            this.renderer = this.options.renderer;
            this.renderer.options = this.options;
            this.slugger = new Slugger();
        }

        /**
         * Static Parse Method
         */

        Parser.parse = function(src, options) {
            var parser = new Parser(options);
            return parser.parse(src);
        };

        /**
         * Parse Loop
         */

        Parser.prototype.parse = function(src) {
            this.inline = new InlineLexer(src.links, this.options);
            // use an InlineLexer with a TextRenderer to extract pure text
            this.inlineText = new InlineLexer(
                src.links,
                merge({}, this.options, {renderer: new TextRenderer()})
            );
            this.tokens = src.reverse();

            var out = '';
            while (this.next()) {
                out += this.tok();
            }

            return out;
        };

        /**
         * Next Token
         */

        Parser.prototype.next = function() {
            return this.token = this.tokens.pop();
        };

        /**
         * Preview Next Token
         */

        Parser.prototype.peek = function() {
            return this.tokens[this.tokens.length - 1] || 0;
        };

        /**
         * Parse Text Tokens
         */

        Parser.prototype.parseText = function() {
            var body = this.token.text;

            while (this.peek().type === 'text') {
                body += '\n' + this.next().text;
            }

            return this.inline.output(body);
        };

        /**
         * Parse Current Token
         */

        Parser.prototype.tok = function() {
            switch (this.token.type) {
                case 'space': {
                    return '';
                }
                case 'hr': {
                    return this.renderer.hr();
                }
                case 'heading': {
                    return this.renderer.heading(
                        this.inline.output(this.token.text),
                        this.token.depth,
                        unescape(this.inlineText.output(this.token.text)),
                        this.slugger);
                }
                case 'code': {
                    return this.renderer.code(this.token.text,
                        this.token.lang,
                        this.token.escaped);
                }
                case 'table': {
                    var header = '',
                    body = '',
                    i,
                    row,
                    cell,
                    j;

                    // header
                    cell = '';
                    for (i = 0; i < this.token.header.length; i++) {
                        cell += this.renderer.tablecell(
                            this.inline.output(this.token.header[i]),
                            { header: true, align: this.token.align[i] }
                        );
                    }
                    header += this.renderer.tablerow(cell);

                    for (i = 0; i < this.token.cells.length; i++) {
                        row = this.token.cells[i];

                        cell = '';
                        for (j = 0; j < row.length; j++) {
                            cell += this.renderer.tablecell(
                                this.inline.output(row[j]),
                                { header: false, align: this.token.align[j] }
                            );
                        }

                        body += this.renderer.tablerow(cell);
                    }
                    return this.renderer.table(header, body);
                }
                case 'blockquote_start': {
                    body = '';

                    while (this.next().type !== 'blockquote_end') {
                        body += this.tok();
                    }

                    return this.renderer.blockquote(body);
                }
                case 'list_start': {
                    body = '';
                    var ordered = this.token.ordered,
                    start = this.token.start;

                    while (this.next().type !== 'list_end') {
                        body += this.tok();
                    }

                    return this.renderer.list(body, ordered, start);
                }
                case 'list_item_start': {
                    body = '';
                    var loose = this.token.loose;
                    var checked = this.token.checked;
                    var task = this.token.task;

                    if (this.token.task) {
                        body += this.renderer.checkbox(checked);
                    }

                    while (this.next().type !== 'list_item_end') {
                        body += !loose && this.token.type === 'text'
                            ? this.parseText()
                            : this.tok();
                    }
                    return this.renderer.listitem(body, task, checked);
                }
                case 'html': {
                    // TODO parse inline content if parameter markdown=1
                    return this.renderer.html(this.token.text);
                }
                case 'paragraph': {
                    return this.renderer.paragraph(this.inline.output(this.token.text));
                }
                case 'text': {
                    return this.renderer.paragraph(this.parseText());
                }
                default: {
                    var errMsg = 'Token with "' + this.token.type + '" type was not found.';
                    if (this.options.silent) {
                        console.log(errMsg);
                    } else {
                        throw new Error(errMsg);
                    }
                }
            }
        };

        /**
         * Slugger generates header id
         */

        function Slugger () {
            this.seen = {};
        }

        /**
         * Convert string to unique id
         */

        Slugger.prototype.slug = function (value) {
            var slug = value
                .toLowerCase()
                .trim()
                .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
                .replace(/\s/g, '-');

            if (this.seen.hasOwnProperty(slug)) {
                var originalSlug = slug;
                do {
                    this.seen[originalSlug]++;
                    slug = originalSlug + '-' + this.seen[originalSlug];
                } while (this.seen.hasOwnProperty(slug));
            }
            this.seen[slug] = 0;

            return slug;
        };

        /**
         * Helpers
         */

        function escape(html, encode) {
            if (encode) {
                if (escape.escapeTest.test(html)) {
                    return html.replace(escape.escapeReplace, function (ch) { return escape.replacements[ch]; });
                }
            } else {
                if (escape.escapeTestNoEncode.test(html)) {
                    return html.replace(escape.escapeReplaceNoEncode, function (ch) { return escape.replacements[ch]; });
                }
            }

            return html;
        }

        escape.escapeTest = /[&<>"']/;
        escape.escapeReplace = /[&<>"']/g;
        escape.replacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
        escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

        function unescape(html) {
            // explicitly match decimal, hex, and named HTML entities
            return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
                n = n.toLowerCase();
                if (n === 'colon') return ':';
                if (n.charAt(0) === '#') {
                    return n.charAt(1) === 'x'
                        ? String.fromCharCode(parseInt(n.substring(2), 16))
                        : String.fromCharCode(+n.substring(1));
                }
                return '';
            });
        }

        function edit(regex, opt) {
            regex = regex.source || regex;
            opt = opt || '';
            return {
                replace: function(name, val) {
                    val = val.source || val;
                    val = val.replace(/(^|[^\[])\^/g, '$1');
                    regex = regex.replace(name, val);
                    return this;
                },
                getRegex: function() {
                    return new RegExp(regex, opt);
                }
            };
        }

        function cleanUrl(sanitize, base, href) {
            if (sanitize) {
                try {
                    var prot = decodeURIComponent(unescape(href))
                        .replace(/[^\w:]/g, '')
                        .toLowerCase();
                } catch (e) {
                    return null;
                }
                if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
                    return null;
                }
            }
            if (base && !originIndependentUrl.test(href)) {
                href = resolveUrl(base, href);
            }
            try {
                href = encodeURI(href).replace(/%25/g, '%');
            } catch (e) {
                return null;
            }
            return href;
        }

        function resolveUrl(base, href) {
            if (!baseUrls[' ' + base]) {
                // we can ignore everything in base after the last slash of its path component,
                // but we might need to add _that_
                // https://tools.ietf.org/html/rfc3986#section-3
                if (/^[^:]+:\/*[^/]*$/.test(base)) {
                    baseUrls[' ' + base] = base + '/';
                } else {
                    baseUrls[' ' + base] = rtrim(base, '/', true);
                }
            }
            base = baseUrls[' ' + base];

            if (href.slice(0, 2) === '//') {
                return base.replace(/:[\s\S]*/, ':') + href;
            } else if (href.charAt(0) === '/') {
                return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
            } else {
                return base + href;
            }
        }
        var baseUrls = {};
        var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

        function noop() {}
        noop.exec = noop;

        function merge(obj) {
            var i = 1,
                target,
                key;

            for (; i < arguments.length; i++) {
                target = arguments[i];
                for (key in target) {
                    if (Object.prototype.hasOwnProperty.call(target, key)) {
                        obj[key] = target[key];
                    }
                }
            }

            return obj;
        }

        function splitCells(tableRow, count) {
            // ensure that every cell-delimiting pipe has a space
            // before it to distinguish it from an escaped pipe
            var row = tableRow.replace(/\|/g, function (match, offset, str) {
                var escaped = false,
                    curr = offset;
                while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
                if (escaped) {
                    // odd number of slashes means | is escaped
                    // so we leave it alone
                    return '|';
                } else {
                    // add space before unescaped |
                    return ' |';
                }
            }),
                cells = row.split(/ \|/),
                i = 0;

            if (cells.length > count) {
                cells.splice(count);
            } else {
                while (cells.length < count) cells.push('');
            }

            for (; i < cells.length; i++) {
                // leading or trailing whitespace is ignored per the gfm spec
                cells[i] = cells[i].trim().replace(/\\\|/g, '|');
            }
            return cells;
        }

        // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
        // /c*$/ is vulnerable to REDOS.
        // invert: Remove suffix of non-c chars instead. Default falsey.
        function rtrim(str, c, invert) {
            if (str.length === 0) {
                return '';
            }

            // Length of suffix matching the invert condition.
            var suffLen = 0;

            // Step left until we fail to match the invert condition.
            while (suffLen < str.length) {
                var currChar = str.charAt(str.length - suffLen - 1);
                if (currChar === c && !invert) {
                    suffLen++;
                } else if (currChar !== c && invert) {
                    suffLen++;
                } else {
                    break;
                }
            }

            return str.substr(0, str.length - suffLen);
        }

        function findClosingBracket(str, b) {
            if (str.indexOf(b[1]) === -1) {
                return -1;
            }
            var level = 0;
            for (var i = 0; i < str.length; i++) {
                if (str[i] === '\\') {
                    i++;
                } else if (str[i] === b[0]) {
                    level++;
                } else if (str[i] === b[1]) {
                    level--;
                    if (level < 0) {
                        return i;
                    }
                }
            }
            return -1;
        }

        /**
         * Marked
         */

        function marked(src, opt, callback) {
            // throw error in case of non string input
            if (typeof src === 'undefined' || src === null) {
                throw new Error('marked(): input parameter is undefined or null');
            }
            if (typeof src !== 'string') {
                throw new Error('marked(): input parameter is of type '
                    + Object.prototype.toString.call(src) + ', string expected');
            }

            if (callback || typeof opt === 'function') {
                if (!callback) {
                    callback = opt;
                    opt = null;
                }

                opt = merge({}, marked.defaults, opt || {});

                var highlight = opt.highlight,
                    tokens,
                    pending,
                    i = 0;

                try {
                    tokens = Lexer.lex(src, opt);
                } catch (e) {
                    return callback(e);
                }

                pending = tokens.length;

                var done = function(err) {
                    if (err) {
                        opt.highlight = highlight;
                        return callback(err);
                    }

                    var out;

                    try {
                        out = Parser.parse(tokens, opt);
                    } catch (e) {
                        err = e;
                    }

                    opt.highlight = highlight;

                    return err
                        ? callback(err)
                        : callback(null, out);
                };

                if (!highlight || highlight.length < 3) {
                    return done();
                }

                delete opt.highlight;

                if (!pending) return done();

                for (; i < tokens.length; i++) {
                    (function(token) {
                        if (token.type !== 'code') {
                            return --pending || done();
                        }
                        return highlight(token.text, token.lang, function(err, code) {
                            if (err) return done(err);
                            if (code == null || code === token.text) {
                                return --pending || done();
                            }
                            token.text = code;
                            token.escaped = true;
                            --pending || done();
                        });
                    })(tokens[i]);
                }

                return;
            }
            try {
                if (opt) opt = merge({}, marked.defaults, opt);
                return Parser.parse(Lexer.lex(src, opt), opt);
            } catch (e) {
                e.message += '\nPlease report this to https://github.com/markedjs/marked.';
                if ((opt || marked.defaults).silent) {
                    return '<p>An error occurred:</p><pre>'
                        + escape(e.message + '', true)
                        + '</pre>';
                }
                throw e;
            }
        }

        /**
         * Options
         */

        marked.options =
            marked.setOptions = function(opt) {
                merge(marked.defaults, opt);
                return marked;
            };

        marked.getDefaults = function () {
            return {
                baseUrl: null,
                breaks: false,
                gfm: true,
                headerIds: true,
                headerPrefix: '',
                highlight: null,
                langPrefix: 'language-',
                mangle: true,
                pedantic: false,
                renderer: new Renderer(),
                sanitize: false,
                sanitizer: null,
                silent: false,
                smartLists: false,
                smartypants: false,
                tables: true,
                xhtml: false
            };
        };

        marked.defaults = marked.getDefaults();

        /**
         * Expose
         */

        marked.Parser = Parser;
        marked.parser = Parser.parse;

        marked.Renderer = Renderer;
        marked.TextRenderer = TextRenderer;

        marked.Lexer = Lexer;
        marked.lexer = Lexer.lex;

        marked.InlineLexer = InlineLexer;
        marked.inlineLexer = InlineLexer.output;

        marked.Slugger = Slugger;

        marked.parse = marked;

        return marked(markdown);
    }
}

module.exports = MarkdownHelper;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const MediaHelperCommon = __webpack_require__(45);

/**
 * The client side media helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class MediaHelper extends MediaHelperCommon {
    /**
     * Gets whether the Media provider exists
     *
     * @returns {Promise} Promise
     */
    static checkMediaProvider() {
        return HashBrown.Helpers.SettingsHelper.getSettings(HashBrown.Helpers.ProjectHelper.currentProject, HashBrown.Helpers.ProjectHelper.currentEnvironment, 'providers')
        .then((result) => {
            if(!result || !result.media) {
                return Promise.reject(new Error('No Media provider has been set for this project. Please make sure one of your <a href="#/connections/">Connections</a> has the "is Media provider" setting switched on.'));
            }  

            return Promise.resolve();
        }); 
    }
    
    /**
     * Gets the Media Url
     */
    static getMediaUrl(id) {
        return '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + id;
    } 

    /**
     * Gets Media object by id
     *
     * @param {String} id
     *
     * @return {Promise} Media object
     */
    static getMediaById(id) {
        if(!id) { return Promise.resolve(null); }
        
        return HashBrown.Helpers.ResourceHelper.get(HashBrown.Models.Media, 'media', id);
    }
    
    /**
     * Gets all Media objects
     *
     * @return {Promise} Media objects
     */
    static getAllMedia(id) {
        return HashBrown.Helpers.ResourceHelper.getAll(HashBrown.Models.Media, 'media');
    }

    /**
     * Initialises the media picker mode
     *
     * @param {Function} onPickMedia
     * @param {Function} onChangeResource
     */
    static initMediaPickerMode(onPickMedia, onChangeResource, onError) {
        // Set the context
        HashBrown.Context.isMediaPicker = true;
        
        // Claim debug messages
        UI.errorModal = onError;
        
        // Listen for picked Media
        window.addEventListener('hashchange', () => {
            let isMediaView = location.hash.indexOf('#/media/') === 0;

            if(isMediaView) {
                let id = location.hash.replace('#/media/', '');

                onPickMedia(id);
            }
        }); 
       
        // Listen for resource change
        HashBrown.Views.Navigation.NavbarMain.reload = () => {
            Crisp.View.get('NavbarMain').reload();

            onChangeResource();
        };

        // Set visual fixes for media picker mode
        $('.page--environment').addClass('media-picker');
    }
}

module.exports = MediaHelper;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper for Media objects
 *
 * @memberof HashBrown.Common.Helpers
 */
class MediaHelper {
    /**
     * Gets the media root path
     *
     * @returns {Promise} Path
     */
    static getRootPath() {
        return ConnectionHelper.getMediaProvider()
        .then((connection) => {
            resolve(connection.getMediaPath());   
        })
        .catch(() => {
            resolve('');  
        });
    }

    /**
     * Gets the Media tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
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
    static setTreeItem(id, item) {
        return Promise.resolve();
    }

    /**
     * Gets the media temp path
     *
     * @param {String} project
     *
     * @returns {String} Path
     */
    static getTempPath(project) {
        checkParam(project, 'project', String);

        let path = 
            '/storage/' +
            ProjectHelper.currentProject +
            '/temp';

        return path;
    }
}

module.exports = MediaHelper;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper class for managing projects client side
 *
 * @memberof HashBrown.Client.Helpers
 */
class ProjectHelper {
    /**
     * Gets the current project id
     *
     * @return {String} Project id
     */
    static get currentProject() {
        let parts = location.pathname.substring(1).split('/');

        if(parts.indexOf('dashboard') > -1) { return null; }

        return parts[0];
    }
    
    /**
     * Gets the current environment name
     *
     * @return {String} Environment name
     */
    static get currentEnvironment() {
        let parts = location.pathname.substring(1).split('/');

        if(parts.indexOf('dashboard') > -1) { return null; }

        return parts[1];
    }
}

module.exports = ProjectHelper;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper class for making HTTP/S requests
 *
 * @memberof HashBrown.Client.Helpers
 */
class RequestHelper {
    /**
     * An environment specific request
     *
     * @param {String} method
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} Response
     */
    static request(method, url, data) {
        return RequestHelper.customRequest(method, this.environmentUrl(url), data);
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
    static uploadFile(url, type, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: this.environmentUrl(url),
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: (response) => {
                    resolve(response);
                },
                error: (e) => {
                    reject(e);            
                }
            })
        });
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
    static customRequest(method, url, data, headers) {
        headers = headers || {
            'Content-Type': 'application/json; charset=utf-8'
        };

        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method.toUpperCase(), url);

            for(let k in headers) {
                xhr.setRequestHeader(k, headers[k]);
            }

            if(data) {
                if(typeof data === 'object' && data instanceof FormData === false) {
                    data = JSON.stringify(data);
                }
               
                xhr.send(data);

            } else {
                xhr.send();
            
            }

            xhr.onreadystatechange = () => {
                const DONE = 4;
                const OK = 200;
                const NOT_MODIFIED = 304;
                const UNAUTHORIZED = 403;

                if(xhr.readyState === DONE) {
                    if(xhr.status === UNAUTHORIZED) {
                        location = '/login/?path=' + location.pathname + location.hash;

                        reject(new Error('User is not logged in'));

                    } else if(xhr.status == OK || xhr.status == NOT_MODIFIED) {
                        let response = xhr.responseText;

                        if(response && response != 'OK') {
                            try {
                                response = JSON.parse(response);
                            
                            } catch(e) {
                                // If the response isn't JSON, then so be it

                            }
                        }

                        if(response === '') { response = null; }

                        resolve(response);

                    } else {
                        let error = new Error(xhr.responseText);

                        error.statusCode = xhr.status;

                        reject(error);
                    
                    }
                }
            }
        });
    }

    /**
     * Wraps a URL to include environment
     *
     * @param {String} url
     */
    static environmentUrl(url) {
        let newUrl = '/api/';

        if(HashBrown.Context.projectId) {
            newUrl += HashBrown.Context.projectId + '/';
        }

        if(HashBrown.Context.environment) {
            newUrl += HashBrown.Context.environment + '/';
        }

        newUrl += url;

        return newUrl;
    }

    /**
     * Listens for server restart
     */
    static listenForRestart() {
        UI.messageModal('Restart', 'HashBrown is restarting...', false);

        function poke() {
            $.ajax({
                type: 'get',
                url: '/',
                success: () => {
                    location.reload();
                },
                error: () => {
                    poke();
                }
            });
        }

        poke();
    };
}

module.exports = RequestHelper;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper class for accessing resources on the server
 *
 * @memberof HashBrown.Client.Helpers
 */
class ResourceHelper {
    /**
     * Gets the indexedDB name
     *
     * @return {String} Name
     */
    static getIndexedDbName() {
        if(HashBrown.Context.projectId && HashBrown.Context.environment) {
            return 'hb_' + HashBrown.Context.projectId + '_' + HashBrown.Context.environment;
        }

        if(HashBrown.Context.view) {
            return 'hb_' + HashBrown.Context.view;
        }
        
        throw new Error('Unknown context');
    }
        
    /**
     * Clears the indexedDB
     *
     * @return {Promise} Result
     */
    static clearIndexedDb() {
        return new Promise((resolve, reject) => {
            try {
                let request = indexedDB.deleteDatabase(this.getIndexedDbName());

                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
                
                request.onerror = (e) => {
                    reject(e);
                };

            } catch(e) {
                reject(e);

            }
        });
    }
    
    /**
     * Opens a connection to the indexedDB
     *
     * @param {String} action
     * @param {String} store
     * @param {Object} query
     *
     * @return {Promise} Result
     */
    static indexedDbTransaction(action, store, id = null, data = null) {
        checkParam(action, 'action', String);
        checkParam(store, 'store', String);
        checkParam(id, 'id', String);
        checkParam(data, 'data', Object);

        return new Promise((resolve, reject) => {
            try {
                let request = indexedDB.open(this.getIndexedDbName(), 1);

                request.onsuccess = (e) => {
                    resolve(e.target.result);
                };
                
                request.onerror = (e) => {
                    reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
                };

                request.onupgradeneeded = (e) => {
                    let db = e.target.result;
                    
                    db.createObjectStore('connections', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('content', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('schemas', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('media', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('forms', { keyPath: 'id', autoIncrement: false });
                    db.createObjectStore('users', { keyPath: 'id', autoIncrement: false });
                };

            } catch(e) {
                reject(e);

            }
        })
        .then((db) => {
            return new Promise((resolve, reject) => {
                try {
                    let objectStore = db.transaction([store], 'readwrite').objectStore(store);
                    let request = null;

                    if(action === 'put') {
                        data.id = id;
                        request = objectStore.put(data);
                    } else if(action === 'get') {
                        request = objectStore.get(id);
                    } else if(action === 'getAll') {
                        request = objectStore.getAll();
                    } else if(action === 'delete') {
                        request = objectStore.delete(id);
                    } else if(action === 'clear') {
                        request = objectStore.clear();
                    }

                    request.onsuccess = (e) => {
                        resolve(e.target.result);
                    };
                    
                    request.onerror = (e) => {
                        reject(new Error('Query ' + JSON.stringify(query) + ' with action "' + action + '" for store "' + store + '" failed. Error code: ' + e.target.errorCode));
                    };

                } catch(e) {
                    reject(e);

                }
            });
        });
    }

    /**
     * Preloads all resources
     */
    static async preloadAllResources() {
        $('.page--environment__spinner').toggleClass('hidden', false); 
        $('.page--environment__spinner__messages').empty();

        await this.clearIndexedDb();

        for(let resourceName of this.getResourceNames()) {
            let $msg = _.div({class: 'widget--spinner__message', 'data-name': resourceName}, resourceName);
            
            $('.page--environment__spinner__messages').append($msg);
        }
        
        for(let resourceName of this.getResourceNames()) {
            await this.getAll(null, resourceName);
            
            $('.page--environment__spinner__messages [data-name="' + resourceName + '"]').toggleClass('loaded', true);
        }
       
        $('.page--environment__spinner').toggleClass('hidden', true);

        HashBrown.Helpers.EventHelper.trigger('resource');  
    }

    /**
     * Gets a list of all resource names
     *
     * @return {Array} Names
     */
    static getResourceNames() {
        return ['content', 'connections', 'forms', 'media', 'schemas', 'users'];
    }
   
    /**
     * Reloads a resource category
     *
     * @param {String} cateogry
     */
    static async reloadResource(category) {
        checkParam(category, 'category', String, true);

        await this.indexedDbTransaction('clear', category);

        await this.getAll(null, category);

        HashBrown.Helpers.EventHelper.trigger('resource');  
    }

    /**
     * Removes a resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async remove(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);

        await this.indexedDbTransaction('delete', category, id);

        await HashBrown.Helpers.RequestHelper.request('delete', category + '/' + id);
        
        HashBrown.Helpers.EventHelper.trigger('resource');  
    }
    
    /**
     * Gets a list of resources
     *
     * @param {HashBrown.Models.Resource} model
     * @param {String} category
     *
     * @returns {Array} Result
     */
    static async getAll(model, category) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String);

        let results = await this.indexedDbTransaction('getAll', category);

        if(!results || results.length < 2) {
            results = await HashBrown.Helpers.RequestHelper.request('get', category);
            
            if(!results) { throw new Error('Resource list ' + category + ' not found'); }
       
            for(let result of results) {
                if(!result.id) { continue; }

                await this.indexedDbTransaction('put', category, result.id, result);
            }
        }
            
        if(typeof model === 'function') {
            for(let i in results) {
                results[i] = new model(results[i]);
            }
        }

        return results;
    }
    
    /**
     * Pulls a synced resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async pull(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/pull/' + id);
    
        await this.reloadResource(category);
    }
    
    /**
     * Pushes a synced resource
     *
     * @param {String} category
     * @param {String} id
     */
    static async push(category, id) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/push/' + id);
    
        await this.reloadResource(category);

        HashBrown.Helpers.EventHelper.trigger('resource');  
    }

    /**
     * Gets a resource
     *
     * @param {HashBrown.Models.Resource} model
     * @param {String} category
     * @param {String} id
     *
     * @returns {HashBrown.Models.Resource} Result
     */
    static async get(model, category, id) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);

        let result = await this.indexedDbTransaction('get', category, id);

        if(!result) {
            result = await HashBrown.Helpers.RequestHelper.request('get', category + '/' + id);
            
            if(!result) { throw new Error('Resource ' + category + '/' + id + ' not found'); }
        
            await this.indexedDbTransaction('put', category, id, result);
        }

        if(typeof model === 'function') {
            result = new model(result);
        }

        return result;
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
    static async set(category, id, data) {
        checkParam(category, 'category', String, true);
        checkParam(id, 'id', String, true);
        checkParam(data, 'data', Object, true);

        if(data instanceof HashBrown.Models.Resource) {
            data = data.getObject();
        }

        await this.indexedDbTransaction('put', category, id, data);

        await HashBrown.Helpers.RequestHelper.request('post', category + '/' + id, data);
    
        HashBrown.Helpers.EventHelper.trigger('resource');  
    }
    
    /**
     * Creates a new resource
     *
     * @param {String} category
     * @param {Resource} model
     * @param {String} query
     * @param {Object} data
     *
     * @returns {Resource} Result
     */
    static async new(model, category, query = '', data = null) {
        checkParam(model, 'model', HashBrown.Models.Resource);
        checkParam(category, 'category', String, true);
        checkParam(query, 'query', String);
        checkParam(data, 'data', Object);

        let resource = await HashBrown.Helpers.RequestHelper.request('post', category + '/new' + query, data);
    
        await this.indexedDbTransaction('put', category, resource.id, resource);

        HashBrown.Helpers.EventHelper.trigger('resource');  

        if(model) {
            resource = new model(resource);
        }

        return resource;
    }
}

module.exports = ResourceHelper;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SchemaHelperCommon = __webpack_require__(50);

/**
 * The client side Schema helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets a Schema by id
     *
     * @param {String} id
     * @param {Boolean} withParentFields
     *
     * @return {Schema} Schema
     */
    static async getSchemaById(id, withParentFields = false) {
        checkParam(id, 'id', String, true);
        checkParam(withParentFields, 'withParentFields', Boolean, true);

        let schema = await HashBrown.Helpers.ResourceHelper.get(null, 'schemas', id);
       
        // Get parent fields if specified
        if(withParentFields && schema.parentSchemaId) {
            let childSchema = this.getModel(schema);
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.getSchemaById(childSchema.parentSchemaId);
                
                mergedSchema = this.mergeSchemas(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }

            return mergedSchema;
        }
        
        return this.getModel(schema);
    }
    
    /**
     * Gets all Schemas
     *
     * @param {String} type
     *
     * @returns {Array} All Schemas
     */
    static async getAllSchemas(type = null) {
        let results = await HashBrown.Helpers.ResourceHelper.getAll(null, 'schemas');

        let schemas = [];

        for(let schema of results) {
            if(type && schema.type !== type) { continue; }

            if(schema.type === 'content') {
                schema = new HashBrown.Models.ContentSchema(schema);
            } else if(schema.type === 'field') {
                schema = new HashBrown.Models.FieldSchema(schema);
            }

            schemas.push(schema);
        }

        return schemas;
    }
}

module.exports = SchemaHelper;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * The common base for SchemaHelper
 *
 * @memberof HashBrown.Common.Helpers
 */
class SchemaHelper {
    /**
     * Gets the appropriate model
     *
     * @param {Object} properties
     *
     * @return {Schema} Schema
     */
    static getModel(properties) {
        if(!properties) { return null; }

        // If the properties object is already a recognised model, return it
        if(properties instanceof HashBrown.Models.ContentSchema || properties instanceof HashBrown.Models.FieldSchema) {
            return properties;
        }

        // If the properties object is using an unrecognised model, serialise it
        if(typeof properties.getObject === 'function') {
            properties = properties.getObject();
        }

        if(properties.type === 'content') {
            return new HashBrown.Models.ContentSchema(properties);
        } else if(properties.type === 'field') {
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
    static mergeSchemas(childSchema, parentSchema) {
        checkParam(childSchema, 'childSchema', HashBrown.Models.Schema);
        checkParam(parentSchema, 'parentSchema', HashBrown.Models.Schema);

        childSchema = childSchema.getObject();
        parentSchema = parentSchema.getObject();

        let mergedSchema = parentSchema;

        // Recursive merge
        function merge(parentValues, childValues) {
            for(let k in childValues) {
                if(typeof parentValues[k] === 'object' && typeof childValues[k] === 'object') {
                    merge(parentValues[k], childValues[k]);
                
                } else if(childValues[k]) {
                    parentValues[k] = childValues[k];
                
                }
            }
        }

        // Overwrite common values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentSchemaId = childSchema.parentSchemaId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;
        
        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'field':
                mergedSchema.editorId = childSchema.editorId || mergedSchema.editorId;
                
                // Merge config
                if(!mergedSchema.config) { mergedSchema.config = {}; }
                if(!parentSchema.config) { parentSchema.config = {}; }

                merge(mergedSchema.config, childSchema.config);
                break;

            case 'content':
                // Merge tabs
                if(!mergedSchema.tabs) { mergedSchema.tabs = {}; }
                if(!childSchema.tabs) { childSchema.tabs = {}; }
               
                merge(mergedSchema.tabs, childSchema.tabs);

                // Merge fields
                if(!mergedSchema.fields) { mergedSchema.fields = {}; }
                if(!mergedSchema.fields.properties) { mergedSchema.fields.properties = {}; }
                if(!childSchema.fields) { childSchema.fields = {}; }
                if(!childSchema.fields.properties) { childSchema.fields.properties = {}; }

                merge(mergedSchema.fields, childSchema.fields);
       
                // Set default tab id
                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return this.getModel(mergedSchema);
    }
}

module.exports = SchemaHelper;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SettingsHelperCommon = __webpack_require__(52);

/**
 * The client side settings helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class SettingsHelper extends SettingsHelperCommon {
    /**
     * Gets all settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} section
     *
     * @return {Promise(Object)}  settings
     */
    static getSettings(project, environment = null, section = null) {
        checkParam(project, 'project', String);

        if(environment === '*') { environment = null; }

        let apiUrl = '/api/' + project + '/';

        if(environment) {
            apiUrl += environment + '/'; 
        }
       
        apiUrl += 'settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Helpers.RequestHelper.customRequest('get', apiUrl);
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
    static setSettings(project, environment = null, section = null, settings) {
        checkParam(project, 'project', String);
        checkParam(settings, 'settings', Object);

        if(environment === '*') { environment = null; }

        let apiUrl = '/api/' + project + '/';

        settings.usedBy = 'project';

        if(environment) {
            apiUrl += environment + '/'; 

            settings.usedBy = environment;
        }
       
        apiUrl += 'settings';

        if(section) {
            apiUrl += '/' + section;
        }

        return HashBrown.Helpers.RequestHelper.customRequest('post', apiUrl, settings);
    }
}

module.exports = SettingsHelper;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A helper for settings
 *
 * @memberof HashBrown.Common.Helpers
 */
class SettingsHelper {
}

module.exports = SettingsHelper;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A UI helper for creating and handling common interface behaviours
 *
 * @memberof HashBrown.Client.Helpers
 */
class UIHelper {
    /**
     * Renders a spinner
     *
     * @param {HTMLElement} element
     * @param {Boolean} noBackground
     *
     * @return {HTMLElement} Spinner
     */
    static spinner(element = null, noBackground = false) {
        let spinner = _.div({class: 'widget widget--spinner ' + (element ? 'embedded ' : '' ) + (noBackground ? 'no-background' : '')},
            _.div({class: 'widget--spinner__inner'},
                _.div({class: 'widget--spinner__image fa fa-refresh'})
            )
        );

        if(element) {
            _.append(element, spinner);
        } else {
            _.append(document.body, spinner);
        }

        return spinner;
    }
    
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
    static highlight(element, label, direction = 'right', buttonLabel) {
        if(element === false) {
            $('.widget--highlight').remove();

            return;
        }

        if(typeof element === 'string') {
            element = document.querySelector(element);
        }

        if(!element) { return Promise.resolve(); }

        return new Promise((resolve) => {
            let dismiss = () => {
                $highlight.remove();

                resolve(element);
            };
            
            let $highlight = _.div({class: 'widget--highlight' + (label ? ' ' + direction : ''), style: 'top: ' + element.offsetTop + 'px; left: ' + element.offsetLeft + 'px;'},
                _.div({class: 'widget--highlight__backdrop'}),
                _.div({class: 'widget--highlight__frame', style: 'width: ' + element.offsetWidth + 'px; height: ' + element.offsetHeight + 'px;'}),
                _.if(label,
                    _.div({class: 'widget--highlight__label'},
                        _.div({class: 'widget--highlight__label__text'}, label),
                        _.if(buttonLabel,
                            _.button({class: 'widget widget--button widget--highlight__button condensed'}, buttonLabel)
                                .click(() => {
                                    dismiss();
                                })
                        )
                    )
                )
            ).click(() => {
                if(buttonLabel) { return; }

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
    static setEditorSpaceContent(content, className) {
        let $space = $('.page--environment__space--editor');

        if(className) {
            content = _.div({class: 'page--environment__space--editor__' + className}, content);
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
    static fieldSortableArray(array, field, onChange) {
        array = array || [];

        // Set indices on all elements
        let items = field.querySelector('.editor__field__value').children;

        for(let i = 0; i < items.length; i++) {
            if(items[i] instanceof HTMLElement === false || !items[i].classList.contains('editor__field')) { continue; }

            items[i].dataset.index = i;
        }

        // Init the sortable context
        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            let oldIndex = element.dataset.index;
            let newIndex = 0;

            // Discover new index
            let items = field.querySelector('.editor__field__value').children;

            for(let i = 0; i < items.length; i++) {
                if(items[i] === element) {
                    newIndex = i;
                    break;
                }
            }

            // Swap indices
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])

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
    static fieldSortableObject(object, field, onChange) {
        object = object || {};

        this.fieldSortable(field, (element) => {
            if(!element) { return; }

            let itemSortKeyElement = element.querySelector('.editor__field__sort-key');
            let itemKey = itemSortKeyElement.value || itemSortKeyElement.innerHTML;
            let itemValue = object[itemKey];

            // Try to get the next key
            let nextKey = '';
            let nextSortKeyElement = element.nextElementSibling ? element.nextElementSibling.querySelector('.editor__field__sort-key') : null;

            if(nextSortKeyElement) {
                nextKey = nextSortKeyElement.value || nextSortKeyElement.innerHTML;
            }

            // Construct a new object based on the old one
            let newObject = {};

            for(let fieldKey in object) {
                // Omit existing key
                if(fieldKey === itemKey) { continue; }

                let fieldValue = object[fieldKey];

                // If there is a next key, and it's the same as this field key,
                // the sorted item should be inserted just before it
                if(nextKey === fieldKey) {
                    newObject[itemKey] = itemValue;
                }

                newObject[fieldKey] = fieldValue;
            }

            // If the item wasn't reinserted, insert it now
            if(!newObject[itemKey]) {
                newObject[itemKey] = itemValue;
            }

            // Assign the new object to the old one
            object = newObject;

            // Fire the change event
            onChange(newObject);
        });
    }

    /**
     * Creates a sortable context specific to fields
     *
     * @param {HTMLElement} field
     * @param {Function} onChange
     */
    static fieldSortable(field, onChange) {
        let btnSort = field.querySelector('.editor__field__key__action--sort');
        let divValue = field.querySelector('.editor__field__value');
        let isSorting = !divValue.classList.contains('sorting');

        if(this.sortable(divValue, 'editor__field', isSorting, onChange)) {
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
    static sortable(parentElement, sortableClassName, isActive, onChange) {
        let children = Array.prototype.slice.call(parentElement.children || []);
        let canSort = true;
        let currentDraggedChild;
        
        children = children.filter((child) => {
            return child instanceof HTMLElement && child.classList.contains(sortableClassName);
        });

        if(!children || children.length < 1) { return false; }

        if(typeof isActive === 'undefined') {
            isActive = !parentElement.classList.contains('sorting');
        }

        if(isActive) {
            parentElement.ondragover = (e) => {
                if(!canSort || !currentDraggedChild) { return; }

                let bodyRect = document.body.getBoundingClientRect();

                _.each(children, (i, sibling) => {
                    if(sibling === currentDraggedChild || !canSort || e.pageY < 1) { return; }

                    let cursorY = e.pageY;
                    let childY = currentDraggedChild.getBoundingClientRect().y - bodyRect.y;
                    let siblingY = sibling.getBoundingClientRect().y - bodyRect.y;
                    let hasMoved = false;

                    // Dragging above a sibling
                    if(cursorY < siblingY && childY > siblingY) {
                        sibling.parentElement.insertBefore(currentDraggedChild, sibling);    
                        hasMoved = true;
                    }

                    // Dragging below a sibling
                    if(cursorY > siblingY && childY < siblingY) {
                        sibling.parentElement.insertBefore(currentDraggedChild, sibling.nextElementSibling);
                        hasMoved = true;
                    }

                    // Init transition
                    if(hasMoved) {
                        canSort = false;

                        let newChildY = currentDraggedChild.getBoundingClientRect().y - document.body.getBoundingClientRect().y;
                        let newSiblingY = sibling.getBoundingClientRect().y - document.body.getBoundingClientRect().y;

                        currentDraggedChild.style.transform = 'translateY(' + (childY - newChildY) + 'px)';
                        sibling.style.transform = 'translateY(' + (siblingY - newSiblingY) + 'px)';

                        setTimeout(() => {
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

        _.each(children, (i, child) => {
            child.draggable = isActive;

            if(isActive) {
                child.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', '');
                    child.classList.toggle('dragging', true);
                    currentDraggedChild = child;
                };
                
                child.ondragend = (e) => {
                    onChange(child);
                    currentDraggedChild = null;
                    child.classList.toggle('dragging', false);
                };

                child.ondragcancel = (e) => {
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
    static inputSwitch(initialValue, onChange) {
        let id = 'switch-' + (10000 + Math.floor(Math.random() * 10000));
        let $input;

        let $element = _.div({class: 'switch', 'data-checked': initialValue},
            $input = _.input({
                id: id,
                class: 'form-control switch',
                type: 'checkbox'
            }).change(function() {
                this.parentElement.dataset.checked = this.checked;

                if(onChange) {
                    onChange(this.checked);
                }
            }),
            _.label({for: id})
        );

        $element.on('set', (e, newValue) => {
            $input[0].checked = newValue;
        });

        if(initialValue) {
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
    static inputChipGroup(items, dropdownItems, onChange, isDropdownUnique) {
        let $element = _.div({class: 'chip-group'});

        if(!items) { items = []; }

        function render() {
            _.append($element.empty(),

                // Render individual chips
                _.each(items, (itemIndex, item) => {
                    let label = item.label || item.name || item.title;
                    
                    if(!label) {
                        for(let dropdownItem of dropdownItems) {
                            let value = dropdownItem.id || dropdownItem.value || dropdownItem;

                            if(value === item) {
                                label = dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem;
                            }
                        }
                    }

                    if(!label) { 
                        label = item;
                    }

                    let $chip = _.div({class: 'chip'},

                        // Dropdown
                        _.if(Array.isArray(dropdownItems),
                            _.div({class: 'chip-label dropdown'},
                                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                                    label
                                ),
                                _.if(onChange,
                                    _.ul({class: 'dropdown-menu'},
                                        _.each(dropdownItems, (dropdownItemIndex, dropdownItem) => {
                                            // Look for unique dropdown items
                                            if(isDropdownUnique) {
                                                for(let item of items) {
                                                    if(item == dropdownItem) {
                                                        return;
                                                    }
                                                }
                                            }

                                            return _.li(
                                                _.a({href: '#'},
                                                    dropdownItem.label || dropdownItem.name || dropdownItem.title || dropdownItem
                                                ).click(function(e) {
                                                    e.preventDefault();
                                                        
                                                    items[itemIndex] = dropdownItem.value || dropdownItem.id || dropdownItem;

                                                    render();
                                
                                                    if(typeof onChange === 'function') {
                                                        onChange(items);
                                                    }
                                                })
                                            );
                                        })
                                    )
                                )
                            )
                        ),

                        // Regular string
                        _.if(!Array.isArray(dropdownItems),
                            _.if(!onChange,
                                _.p({class: 'chip-label'}, item)
                            ),
                            _.if(onChange,
                                _.input({type: 'text', class: 'chip-label', value: item})
                                    .change((e) => {
                                        items[itemIndex] = e.target.value;
                                    })
                            )
                        ),

                        // Remove button
                        _.if(onChange,
                            _.button({class: 'btn chip-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                items.splice(itemIndex, 1);

                                render();

                                if(typeof onChange === 'function') {
                                    onChange(items);
                                }
                            })
                        )
                    );
                    
                    return $chip;
                }),

                // Add button
                _.if(onChange,
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(() => {
                        if(Array.isArray(dropdownItems)) {
                            if(isDropdownUnique) {
                                for(let dropdownItem of dropdownItems) {
                                    let isSelected = false;

                                    for(let item of items) {
                                        if(item == dropdownItem) {
                                            isSelected = true;
                                            break;
                                        }
                                    }

                                    if(!isSelected) {
                                        items.push(dropdownItem.value || dropdownItem);
                                        break;
                                    }
                                }
                            } else {
                                items.push(dropdownItems[0].value || dropdownItems[0]);
                            }
                        
                        } else if(typeof dropdownItems === 'string') {
                            items.push(dropdownItems);

                        } else {
                            items.push('New item');

                        }

                        render(); 

                        if(typeof onChange === 'function') {
                            onChange(items);
                        }
                    })
                )
            );
        };

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
    static carousel(items, useIndicators, useControls, height) {
        let id = 'carousel-' + (10000 + Math.floor(Math.random() * 10000));
        
        return _.div({class: 'carousel slide', id: id, 'data-ride': 'carousel', 'data-interval': 0},
            _.if(useIndicators,
                _.ol({class: 'carousel-indicators'},
                    _.each(items, (i, item) => {
                        return _.li({'data-target': '#' + id, 'data-slide-to': i, class: i == 0 ? 'active' : ''});
                    })
                )
            ),
            _.div({class: 'carousel-inner', role: 'listbox'},
                _.each(items, (i, item) => {
                    return _.div({class: 'item' + (i == 0? ' active': ''), style: 'height:' + (height || '500px')},
                        item
                    );
                })
            ),
            _.if(useControls,
                _.a({href: '#' + id, role: 'button', class: 'left carousel-control', 'data-slide': 'prev'},
                    _.span({class: 'fa fa-arrow-left'})
                ),
                _.a({href: '#' + id, role: 'button', class: 'right carousel-control', 'data-slide': 'next'},
                    _.span({class: 'fa fa-arrow-right'})
                )
            )
        );
    }

    /**
     * Brings up an error modal
     *
     * @param {String|Error} error
     * @param {Function} onClickOK
     */
    static errorModal(error, onClickOK) {
        if(!error) { return; }

        if(error instanceof String) {
            error = new Error(error);
        
        } else if(error instanceof Object) {
            if(error.responseText) {
                error = new Error(error.responseText);
            }
        
        } else if(error instanceof Error === false) {
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
    static warningModal(warning, onClickOK) {
        if(!warning) { return; }

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
    static messageModal(title, body, onClickOK, group) {
        let modal = new HashBrown.Views.Modals.Modal({
            isBlocking: onClickOK === false,
            title: title,
            group: group,
            body: body
        });

        if(onClickOK) {
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
    static iframeModal(title, url, onSubmit, onCancel) {
        let modal = new HashBrown.Views.Modals.IframeModal({
            title: title,
            url: url
        });

        if(typeof onSubmit === 'function') {
            modal.on('ok', onSubmit);
        }

        if(typeof onCancel === 'function') {
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
    static confirmModal(type, title, body, onSubmit, onCancel) {
        let modal = new HashBrown.Views.Modals.ConfirmModal({
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
    static context(element, items) {
        let openContextMenu = (e) => {
            // Find any existing context menu targets and remove their classes
            let clearTargets = () => {
                let targets = document.querySelectorAll('.context-menu-target');
            
                if(targets) {
                    for(let i = 0; i < targets.length; i++) {
                        targets[i].classList.remove('context-menu-target');
                    }
                }
            };

            clearTargets();

            // Set new target
            element.classList.toggle('context-menu-target', true);
            
            // Remove existing dropdowns
            let existingMenu = _.find('.widget--dropdown.context-menu');

            if(existingMenu) { existingMenu.remove(); }

            // Init new dropdown
            let dropdown = new HashBrown.Views.Widgets.Dropdown({
                options: items,
                reverseKeys: true,
                onChange: (pickedItem) => {
                    if(typeof pickedItem !== 'function') { return; }

                    pickedItem();
                }
            });

            // Prevent the toggle button from blocking new context menu events
            let toggle = dropdown.element.querySelector('.widget--dropdown__toggle');

            toggle.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                dropdown.toggle(false);
            });

            // Set cancel event
            dropdown.on('cancel', () => {
                dropdown.remove();

                // Wait a bit before removing the classes, as they are often used as references in the functions executed by the context menu
                setTimeout(() => {
                    clearTargets();
                }, 100);
            });

            // Set styles
            let pageY = e.touches ? e.touches[0].pageY : e.pageY;
            let pageX = e.touches ? e.touches[0].pageX : e.pageX;

            dropdown.element.classList.toggle('context-menu', true);
            dropdown.element.setAttribute('style', 'top: ' + pageY + 'px; left: ' + pageX + 'px;');

            // Open it
            dropdown.toggle(true);

            // Append to body
            document.body.appendChild(dropdown.element);
        };
        
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
                
            openContextMenu(e);
        });

        element.addEventListener('click', (e) => {
            if(e.which === 3 || e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
            
                openContextMenu(e);
            }
        });
        
        element.addEventListener('touchstart', (e) => {
            if(e.touchTargets && e.touchTargets.length > 1) {
                e.preventDefault();
                e.stopPropagation();

                openContextMenu(e);
            }
        });
    }
}

module.exports = UIHelper;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const EVENTS = {};

/**
 * A helper class for triggering and registering EVENTS
 *
 * @memberof HashBrown.Client.Helpers
 */
class EventHelper {
    /**
     * Bind an event
     *
     * @param {String} type
     * @param {String} id
     * @param {Function} callback
     */
    static on(type, id, callback) {
        checkParam(type, 'type', String);
        checkParam(id, 'id', String);
        checkParam(callback, 'callback', Function);

        if(!EVENTS[type]) { EVENTS[type] = {}; }

        EVENTS[type][id] = callback;
    }

    /**
     * Unbind an event
     *
     * @param {String} type
     * @param {String} id
     */
    static off(type, id) {
        checkParam(type, 'type', String);
        checkParam(id, 'id', String);

        if(!EVENTS[type]) { return; }

        delete EVENTS[type][id];
    }

    /**
     * Triggers an event type
     *
     * @param {String} type
     * @param {*} value
     */
    static trigger(type, value) {
        if(!EVENTS[type]) { return; }

        for(let id in EVENTS[type]) {
            if(typeof EVENTS[type][id] !== 'function') { continue; }

            EVENTS[type][id](value);
        }
    }
}

module.exports = EventHelper;


/***/ })
/******/ ]));
//# sourceMappingURL=helpers.js.map