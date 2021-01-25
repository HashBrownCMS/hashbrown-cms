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

            params.deployer.ensureRootPath('content');
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
        return this.processor && this.processor.alias && this.deployer && this.deployer.alias;
    }

    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        await super.save(options);

        await this.clearCache();
    }
    
    /**
     * Removes this entity
     *
     * @param {Object} options
     */
    async remove(options = {}) {
        checkParam(options, 'options', Object, true);

        await super.remove(options);

        await this.clearCache();
    }

    /**
     * Deploys a content entity
     *
     * @param {String} contentId
     */
    async deployContent(contentId) {
        checkParam(contentId, 'contentId', String, true);
       
        if(!this.canDeploy()) { return; }
        
        let content = await HashBrown.Entity.Resource.Content.get(this.context, contentId);

        let locales = content.publishFor;

        if(!locales || locales.length < 1) {
            locales = await this.context.project.getLocales();
        }

        for(let locale of locales) {
            let data = await this.processor.process(content, locale);
            let extension = this.processor.fileExtension || '.json';
            
            if(!data) { continue; }
            
            if(typeof data !== 'string') {
                try {
                    data = JSON.stringify(data);
                } catch(e) {
                    data = data.toString();
                }
            }

            data = Buffer.from(data, 'utf8').toString('base64');

            await this.deployer.setFile(this.deployer.getPath(locale, contentId + extension), data);
        }
    }
    
    /**
     * Removes a content entity
     *
     * @param {String} contentId
     */
    async redactContent(contentId) {
        checkParam(contentId, 'contentId', String, true);

        if(!this.canDeploy()) { return; }
            
        let extension = this.processor.fileExtension || '.json';

        await this.deployer.removeFile(this.deployer.getPath('*', contentId + extension));
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
            throw new HashBrown.Http.Exception('Processor not specified', 500);
        }

        let locale = query.locale;

        if(!locale) {
            let locales = await this.context.project.getLocales();

            locale = locales[0] || 'en';
        }

        if(!query.nocache) {
            let cache = await this.getCache(query);

            if(cache) { return cache; }
        }
       
        delete query.nocache;

        let items = await HashBrown.Entity.Resource.Content.list(this.context);
        let result = [];

        for(let item of items) {
            if(
                !item.isPublished ||
                (
                    item.publishFor.length > 0 &&
                    item.publishFor.indexOf(locale) < 0
                )
            ) { continue; }

            if(this.allowedSchemas && this.allowedSchemas.length > 0 && this.allowedSchemas.indexOf(item.schemaId) < 0) { continue; }
            
            if(this.rootContents && this.rootContents.length > 0 && (!this.includeRoot || this.rootContents.indexOf(item.id) < 0)) {
                let isDescendant = false;
                
                for(let rootContent of this.rootContents) {
                    let isThisDescendant = await item.isDescendantOf(rootContent);

                    if(!isThisDescendant) { continue; }

                    isDescendant = true;
                    break;
                }

                if(!isDescendant) { continue; }
            }
           
            let isMatch = this.isQueryMatch(query, item);

            if(!isMatch) { continue; }
            
            let output = await this.processor.process(item, locale);

            result.push(output);
        }

        await this.setCache(query, result);

        return result;
    }
    
    /**
     * Clears all cache
     */
    async clearCache() {
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project.id, this.context.environment, 'publications', this.id);

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
        
        let key = Buffer.from(`${this.context.project.id}-${this.context.environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project.id, this.context.environment, 'publications', this.id);
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
        
        let key = Buffer.from(`${this.context.project.id}-${this.context.environment}-${QueryString.encode(query)}`).toString('base64');
        let cacheFolder = Path.join(APP_ROOT, 'storage', this.context.project.id, this.context.environment, 'publications', this.id);
        let cacheFile = Path.join(cacheFolder, key + '.json');

        let stats = await HashBrown.Service.FileService.stat(cacheFile);

        if(!stats || stats.mtime.getTime() + MAX_CACHE_TIME < Date.now()) {
            return null;
        }

        return HashBrown.Service.FileService.readStream(cacheFile, 'utf8');
    }
    
    /**
     * Performs a series of unit test
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Function} report
     */
    static async test(context, report) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(report, 'report', Function, true);

        report('Create publication');
        
        let publication = await this.create(context, { name: 'Test publication' });
        
        report(`Get publication ${publication.getName()}`);
        
        publication = await this.get(context, publication.id);

        report(`Update publication ${publication.getName()}`);
       
        publication.name += ' (updated)';
        await publication.save();
        
        report('Get all publications');
        
        await this.list(context);

        report(`Remove publication ${publication.getName()}`);
        
        await publication.remove();
    }
}

module.exports = Publication;
