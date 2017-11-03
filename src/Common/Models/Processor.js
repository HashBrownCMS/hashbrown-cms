'use strict';

const Entity = require('./Entity');

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Models
 */
class Processor extends Entity {
    /**
     * Structure
     */
    structure() {
        this.def(String, 'alias');
        this.def(String, 'name');
        this.def(Object, 'settings', {});
    }

    /**
     * Processes a Content node
     *
     * @param {Content} content
     *
     * @returns {Object} Output
     */
    process(content) {
        return null;
    }
}

module.exports = Processor;
