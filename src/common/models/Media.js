'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Media objects
 */
class Media extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(String, 'data');
    }

    /**
     * Creates a new Media object
     *
     * @param {Object} file
     *
     * @return {Media} media
     */
    static create(file) {
        let media = new Media({
            id: Entity.createId()
        });
    
        return media;
    }
}

module.exports = Media;
