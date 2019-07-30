'use strict';

let crypto = require('crypto');

/**
 * The base class for everything
 *
 * @memberof HashBrown.Common.Models
 */
class Entity {
    /**
     * Constructs an entity
     *
     * @param {Object} params
     */
    constructor(params) {
        this.structure();
        params = this.constructor.paramsCheck(params);

        Object.seal(this);

        for(let k in params) {
            try {
                if(typeof params[k] !== 'undefined') {
                    this[k] = params[k]
                }
            
            } catch(e) {
                debug.log(e.message, this, 4);
            }
        }
    }

    /**
     * Sets up a structure before sealing the object
     */
    structure() {

    }

    /**
     * Checks the parameters before they're committed
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        return params;
    }

    /**
     * Generates a new random id
     *
     * @param {Number} length
     *
     * @returns {String} id
     */
    static createId(length) {
        if(!length) { length = 8; }
        if(length < 4) { length = 4; }

        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
     */
    getObject() {
        return JSON.parse(JSON.stringify(this));
    }

    /**
     * Defines a type safe member variable
     *
     * @param {String} type
     * @param {String} name
     * @param {Anything} defaultValue
     */
    def(type, name, defaultValue) {
        if(typeof type !== 'function') {
            throw new TypeError('Parameter \'type\' cannot be of type \'' + (typeof type) + '\'.');
        }
        
        if(typeof name !== 'string') {
            throw new TypeError('Parameter \'name\' cannot be of type \'' + (typeof name) + '\'.');
        }

        if(typeof defaultValue === 'undefined') {
            switch(type) {
                case String:
                    defaultValue = '';
                    break;

                case Number:
                    defaultValue = 0;
                    break;

                case Date:
                    defaultValue = null;
                    break;

                case Boolean:
                    defaultValue = false;
                    break;

                default:
                    defaultValue = null;
                    break;
            }
        }

        let thisValue = defaultValue;
        let thisType = type;

        Object.defineProperty(this, name, {
            enumerable: true,
            get: () => {
                return thisValue;
            },
            set: (thatValue) => {
                // Auto cast for Booleans
                if(thisType == Boolean) {
                    if(!thatValue) {
                        thatValue = false;

                    } else if(typeof thatValue === 'string') {
                        if(thatValue === 'false') {
                            thatValue = false;
                        } else if(thatValue === 'true') {
                            thatValue = true;
                        }
                    }
                }

                // Auto cast for numbers
                if(thisType == Number) {
                    if(!thatValue) {
                        thatValue = 0;
                    
                    } else if(thatValue.constructor == String && !isNaN(thatValue)) {
                        thatValue = parseFloat(thatValue);

                    }
                }

                // Auto cast for dates
                if(thisType == Date) {
                    if(!thatValue) {
                        thatValue = null;
                    
                    } else if(thatValue.constructor == String || thatValue.constructor == Number) {
                        thatValue = new Date(thatValue);

                    }
                }

                if(typeof thatValue !== 'undefined') {
                    if(thatValue == null) {
                        thisValue = thatValue;
                        return;
                    }

                    let thatType = thatValue.constructor;

                    if(thisType.name !== thatType.name && thatValue instanceof thisType === false) {
                        throw new TypeError(this.constructor.name + '.' + name + ' is of type \'' + thisType.name + '\' and cannot implicitly be converted to \'' + thatType.name + '\'.');
                    } else {
                        thisValue = thatValue; 
                    }
                
                } else {
                    thisValue = defaultValue;
                
                }
            }
        });
    }
}

module.exports = Entity;
