'use strict';

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
                this[k] = properties[k];
            
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
}

module.exports = Entity;
