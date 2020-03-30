'use strict';

const QueryString = require('querystring');
const Path = require('path');

const MAX_CACHE_TIME = 1000 * 60 * 60 * 24 * 10 // 10 days

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
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async save(user, project, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        await super.save(user, project, environment, options);

        await this.clearCache(project, environment);
    }
    
    /**
     * Removes this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async remove(user, project, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        await super.remove(user, project, environment, options);

        await this.clearCache(project, environment);
    }

    /**
     * Gets content in published format
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} query
     *
     * @return {Array|FileSystem.ReadStream} Items
     */
    async getContent(projectId, environment, query = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(query, 'query', Object, true);
        
        if(!this.processor) {
            throw new HttpError('Processor not specified', 500);
        }

        let cache = await this.getCache(projectId, environment, query);

        if(cache) { console.log('CACHED!'); return cache; }
        
        let items = await HashBrown.Entity.Resource.Content.list(projectId, environment);
        let result = [];

        for(let item of items) {
            if(this.allowedSchemas.length > 0 && this.allowedSchemas.indexOf(item.schemaId) < 0) { continue; }
            
            if(this.rootContent && (!this.includeRoot || this.rootContent !== item.id)) {
                let isDescendant = await item.isDescendantOf(projectId, environment, this.rootContent);

                if(!isDescendant) { continue; }
            }
            
            let output = await this.processor.process(projectId, environment, item, query.language || 'en');

            let isMatch = this.isQueryMatch(query, output);

            if(!isMatch) { continue; }

            result.push(output);
        }

        await this.setCache(projectId, environment, query, result);

        return result;
    }
    
    /**
     * Clears all cache
     *
     * @param {String} projectId
     * @param {String} environment
     */
    async clearCache(projectId, environment) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        
        let cacheFolder = Path.join(APP_ROOT, 'storage', projectId, environment, 'publications', this.id);

        await HashBrown.Service.FileService.remove(cacheFolder);
    }

    /**
     * Sets a cache object
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} query
     * @param {Array} data
     */
    async setCache(projectId, environment, query, data) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(data, 'data', Array, true);
        
        let key = Buffer.from(`${projectId}-${environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', projectId, environment, 'publications', this.id);
        let cacheFile = Path.join(cacheFolder, key + '.json');

        if(!HashBrown.Service.FileService.exists(cacheFolder)) {
            await HashBrown.Service.FileService.makeDirectory(cacheFolder);
        }

        data = JSON.stringify(data);

        await HashBrown.Service.FileService.write(data, cacheFile);
    }
    
    /**
     * Gets a cache object
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} query
     * 
     * @return {Array|FileSystem.ReadStream} Data
     */
    async getCache(projectId, environment, query) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(query, 'query', Object, true);
        
        let key = Buffer.from(`${projectId}-${environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', projectId, environment, 'publications', this.id);
        let cacheFile = Path.join(cacheFolder, key + '.json');

        let stats = await HashBrown.Service.FileService.stat(cacheFile);

        if(!stats || stats.mtime.getTime() + MAX_CACHE_TIME < Date.now()) {
            return null;
        }

        return HashBrown.Service.FileService.readStream(cacheFile, 'utf8');
    }
}

module.exports = Publication;
