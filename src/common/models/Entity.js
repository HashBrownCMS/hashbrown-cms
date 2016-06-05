'use strict';

let crypto = require('crypto');

/**
 * The base class for everything
 */
class Entity {
    /**
     * Constructs an entity
     *
     * @param {Object} properties
     */
    constructor(properties) {
        this.structure();

        Object.seal(this);

        for(let k in properties) {
            try {
                this[k] = properties[k] || this[k];
            
            } catch(e) {
                console.log(e);
                console.log(e.stack);
            }
        }
    }

    /**
     * Sets up a structure before sealing the object
     */
    structure() {

    }

    /**
     * Generates a new random id
     *
     * @returns {String} id
     */
    static createId() {
        return crypto.randomBytes(20).toString('hex');
    }

    /**
     * Gets a copy of every field in this object as a mutable object
     */
    getFields() {
        let fields = {};

        for(let k in this) {
            let v = this[k];

            if(typeof v !== 'function') {
                fields[k] = v;
            }
        }

        return fields;
    }
}

module.exports = Entity;
