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

        let search = {};

        for(let k in query) {
            search[k] = query[k];
        }

        let rootItems = [];

        if(this.rootContent) {
            rootItems.push(await HashBrown.Entity.Resource.Content.get(projectId, environment, this.rootContent));
        } else {
            rootItems = await HashBrown.Entity.Resource.Content.getOrphans(projectId, environment);
        }

        // TODO: Improve this logic
        let result = rootItems;

        for(let i in result) {
            result[i] = await this.processor.process(projectId, environment, result[i], query.language || 'en');
        }

        return result;
    }
}

module.exports = Publication;
