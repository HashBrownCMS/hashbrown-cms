'use strict';

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
base.checkParam = (value, name, type) => {
    if(value === undefined) {
        throw new Error('Parameter "' + name + '" is required');
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
