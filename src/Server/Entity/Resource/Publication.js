'use strict';

/**
 * The publication class
 *
 * @memberof HashBrown.Client.Entity.Resource
 */
class Publication extends require('Common/Entity/Resource/Publication') {
    /**
     * Gets the processor
     *
     * @return {HashBrown.Entity.Processor.ProcessorBase} Processor
     */
    get processor() {
        let model = HashBrown.Entity.Processor.ProcessorBase.getByAlias(this.processorAlias);

        if(!model) { return null; }

        return model.new();
    }
        
    /**
     * Gets whether a query matches some data
     *
     * @param {Object} query
     * @param {Object} data
     *
     * @return {Boolean} Match
     */
    isQueryMatch(query, data) {
        for(let key in data) {
            if(query[key] && query[key] != data[key]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets content in published format
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} query
     *
     * @return {Array} Items
     */
    async getContent(projectId, environment, query = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(query, 'query', Object, true);
        
        if(!this.processor) {
            throw new HttpError('Processor not specified', 500);
        }

        // TODO: Enable cache

        let items = await HashBrown.Entity.Resource.Content.list(projectId, environment);
        let result = [];

        for(let item of items) {
            if(this.allowedSchemas.length > 0 && this.allowedSchemas.indexOf(item.schemaId) < 0) { continue; }
            
            if(this.rootContent) {
                let isDescendant = await item.isDescendantOf(projectId, environment, this.rootContent);

                if(!isDescendant) { continue; }
            }
            
            let output = await this.processor.process(projectId, environment, item, query.language || 'en');

            let isMatch = this.isQueryMatch(query, output);

            if(!isMatch) { continue; }

            result.push(output);
        }

        return result;
    }
}

module.exports = Publication;
