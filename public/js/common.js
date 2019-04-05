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
/******/ 	return __webpack_require__(__webpack_require__.s = 32);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

let base;

if(typeof window !== 'undefined') {
    base = window;
} else if(typeof global !== 'undefined') {
    base = global;
}

if(!base) {
    throw new Error('Base not found');
}

/**
 * Handles namespace creation
 *
 * @param {String} query
 *
 * @return {Function} Chain
 */
base.namespace = function namespace(query) {
    if(!base.HashBrown) { base.HashBrown = {}; }
    
    let current = HashBrown;

    query.split('.').forEach((ns) => {
        if(!current[ns]) { current[ns] = {}; }
        
        current = current[ns];
    });

    let add = (module) => {
        current[module.name] = module;
        
        return { add: add };
    };

    return { add: add };
}

/**
 * Throws an error if parameter was null (used as a default param hack)
 *
 * @param {String} name
 */
base.requiredParam = (name) => {
    throw new Error('Parameter "' + name + '" is required');
}

/**
 * Checks a parameter for type
 *
 * @param {Anything} value
 * @param {String} name
 * @param {Type} type
 */
base.checkParam = (value, name, type, notNull = false) => {
    if(value === undefined) {
        console.trace();
        throw new Error('Parameter "' + name + '" is required');
    }
    
    if(notNull && (value === null || value === '')) {
        console.trace();
        throw new Error('Parameter "' + name + '" cannot be null');
    }

    if(value === null) { return; }
    if(value.constructor === type) { return; }
    if(value.prototype instanceof type) { return; }
    if(value instanceof type) { return; }
    if(value === type) { return; }

    let valueTypeName = typeof value;

    if(value.constructor) {
        valueTypeName = value.constructor.name;
    
    } else if(value.prototype) {
        valueTypename = value.prototype.name;

    }

    throw new TypeError('Parameter "' + name + '" is of type "' + valueTypeName + '", should be "' + type.name + '". Value was: ' + (valueTypeName === 'Object' ? JSON.stringify(value) : value.toString()));
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(3)))

/***/ })

/******/ });
//# sourceMappingURL=common.js.map