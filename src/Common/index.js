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
    
    console.trace();
    throw new TypeError('Parameter "' + name + '" is of type "' + valueTypeName + '", should be "' + type.name + '". Value was: ' + (valueTypeName === 'Object' ? JSON.stringify(value) : value.toString()));
}
