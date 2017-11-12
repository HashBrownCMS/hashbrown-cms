'use strict';

const Entity = require('./Entity');

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Models
 */
class Processor extends Entity {
    // Getter: Display name of this Processor
    static get name() { return 'Processor'; }

    // Getter: Alias of this Processor (used to link with the client-side editor)
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
        this.def(String, 'fileExtension', '.json');
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
