'use strict';

const Entity = require('./Entity');

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Models
 */
class Processor extends Entity {
    // Name and alias
    static get name() { return 'Processor'; }
    static get alias() { return 'processor'; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.name = this.constructor.name;
        this.alias = this.constructor.alias;
    }
    
    /**
     * Structure
     */
    structure() {
        this.def(String, 'name');
        this.def(String, 'alias');
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
