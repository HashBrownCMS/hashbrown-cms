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
     * Structure
     */
    structure() {
        super.structure();
        
        this.def(HashBrown.Entity.Processor.ProcessorBase, 'processor');
        this.def(HashBrown.Entity.Deployer.DeployerBase, 'deployer');
    }
    
    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        params = params || {};

        if(params.deployer && params.deployer.alias && params.deployer instanceof HashBrown.Entity.Deployer.DeployerBase === false) {
            params.deployer.context = params.context || this.context;
            params.deployer = HashBrown.Entity.Deployer.DeployerBase.new(params.deployer);
        }
        
        if(params.processor && params.processor.alias && params.processor instanceof HashBrown.Entity.Processor.ProcessorBase === false) {
            params.processor.context = params.context || this.context;
            params.processor = HashBrown.Entity.Processor.ProcessorBase.new(params.processor);
        }
        
        super.adopt(params);
    }

    /**
     * Gets a mutable object from this entity
     *
     * @return {Object} Object
     */
    getObject() {
        let object = super.getObject();

        if(this.processor) {
            object.processor = this.processor.getObject();
        }
        
        if(this.deployer) {
            object.deployer = this.deployer.getObject();
        }

        return object;
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
     * Checks whether content can be deployed
     *
     * @return {Boolean} Can deploy
     */
    canDeploy() {
        return
            this.processor && this.processor.alias &&
            this.deployer && this.deployer.alias;
    }

    /**
     *

    /**
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {Object} options
     */
    async save(user, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User);
        checkParam(options, 'options', Object, true);

        await super.save(user, options);

        await this.clearCache();
    }
    
    /**
     * Removes this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {Object} options
     */
    async remove(user, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(options, 'options', Object, true);

        await super.remove(user, options);

        await this.clearCache();
    }

    /**
     * Deploys a content entity
     *
     * @param {String} contentId
     * @param {String} language
     */
    async deployContent(contentId, language) {
        checkParam(contentId, 'contentId', String, true);
        checkParam(language, 'language', String, true);

        if(!this.canDeploy()) { return; }

        let data = await this.getContent({ id: contentId, language: language });

        if(!data) { return; }

        data = data.pop();
        
        if(!data) { return; }

        if(typeof data !== 'string') {
            try {
                data = JSON.stringify(data);
            } catch(e) {
                data = data.toString();
            }
        }

        data = Buffer.from(data, 'utf8').toString('base64');

        await this.deployer.setFile(this.deployer.getPath(language, contentId + '.json'), data);
    }
    
    /**
     * Removes a content entity
     *
     * @param {String} contentId
     * @param {String} language
     */
    async removeContent(contentId, language) {
        checkParam(contentId, 'contentId', String, true);
        checkParam(language, 'language', String, true);

        if(!this.canDeploy()) { return; }

        await this.deployer.removeFile(this.deployer.getPath(language, contentId + '.json'));
    }

    /**
     * Gets content in published format
     *
     * @param {Object} query
     *
     * @return {Array} Items
     */
    async getContent(query = {}) {
        checkParam(query, 'query', Object, true);
        
        if(!this.processor) {
            throw new HttpError('Processor not specified', 500);
        }

        let cache = await this.getCache(query);

        if(cache) { return cache; }
        
        let items = await HashBrown.Entity.Resource.Content.list(this.context.project, this.context.environment);
        let result = [];

        for(let item of items) {
            if(!item.isPublished) { continue; }

            if(this.allowedSchemas.length > 0 && this.allowedSchemas.indexOf(item.schemaId) < 0) { continue; }
            
            if(this.rootContent && (!this.includeRoot || this.rootContent !== item.id)) {
                let isDescendant = await item.isDescendantOf(this.rootContent);

                if(!isDescendant) { continue; }
            }
           
            let output = await this.processor.process(item, query.language || 'en');

            let isMatch = this.isQueryMatch(query, output);

            if(!isMatch) { continue; }

            result.push(output);
        }

        await this.setCache(query, result);

        return result;
    }
    
    /**
     * Clears all cache
     */
    async clearCache() {
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project, this.context.environment, 'publications', this.id);

        await HashBrown.Service.FileService.remove(cacheFolder);
    }

    /**
     * Sets a cache object
     *
     * @param {Object} query
     * @param {Array} data
     */
    async setCache(query, data) {
        checkParam(query, 'query', Object, true);
        checkParam(data, 'data', Array, true);
        
        let key = Buffer.from(`${this.context.project}-${this.context.environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project, this.context.environment, 'publications', this.id);
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
     * @param {Object} query
     * 
     * @return {Array|FileSystem.ReadStream} Data
     */
    async getCache(query) {
        checkParam(query, 'query', Object, true);
        
        let key = Buffer.from(`${this.context.project}-${this.context.environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project, this.context.environment, 'publications', this.id);
        let cacheFile = Path.join(cacheFolder, key + '.json');

        let stats = await HashBrown.Service.FileService.stat(cacheFile);

        if(!stats || stats.mtime.getTime() + MAX_CACHE_TIME < Date.now()) {
            return null;
        }

        return HashBrown.Service.FileService.readStream(cacheFile, 'utf8');
    }
}

module.exports = Publication;
