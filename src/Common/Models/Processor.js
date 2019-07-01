'use strict';

const Entity = require('./Entity');

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Models
 */
class Processor extends Entity {
    static get title() { return 'Processor'; }
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
        this.def(String, 'fileExtension');
    }
   
    /**
     * Parameter sanity check
     */
    static paramsCheck(params) {
        params = params || {};

        delete params.title;
        delete params.name;
        delete params.alias;

        return params;
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
