'use strict';

/**
 * A class for processing Content before it is deployed
 *
 * @memberof HashBrown.Common.Entity
 */
class ProcessorBase extends HashBrown.Entity.EntityBase {
    static get alias() {
        if(this === ProcessorBase) { return null; }

        return this.name.replace('Processor', '').toLowerCase();
    }
  
    get alias() { return this.constructor.alias; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Object, 'context');
    }
    
    /**
     * Gets the human readable name
     *
     * @return {String} name
     */
    getName() {
        return this.title;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);
        checkParam(params.context, 'params.context', Object, true);
        checkParam(params.context.project, 'params.context.project', String, true);
        checkParam(params.context.environment, 'params.context.environment', String, true);

        super.adopt(params);

        Object.seal(this.context);
    }
    
    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
     */
    getObject() {
        let object = super.getObject();

        object.alias = this.alias;
        delete object.context;

        return object;
    }
   
    /**
     * Instantiates a new processor
     *
     * @param {Object} params
     *
     * @return {HashBrown.Entity.Processor} Instance
     */
    static new(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        let model = this.getByAlias(params.alias) || this;

        return new model(params);
    }
    
    /**
     * Gets a processor by alias
     *
     * @string {String} alias
     *
     * @returns {HashBrown.Entity.Processor} Processor
     */
    static getByAlias(alias) {
        for(let name in HashBrown.Entity.Processor) {
            let processor = HashBrown.Entity.Processor[name];

            if(processor.alias !== alias) { continue; }

            return processor;
        }

        return null;
    }


    /**
     * Processes a content node
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @returns {Object} Output
     */
    process(content) {
        return null;
    }
}

module.exports = ProcessorBase;
