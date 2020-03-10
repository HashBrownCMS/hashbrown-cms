'use strict';

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Entity
 */
class ProcessorBase extends HashBrown.Entity.EntityBase {
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
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        delete params.title;
        delete params.name;
        delete params.alias;

        super.params(params);
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

module.exports = ProcessorBase;
