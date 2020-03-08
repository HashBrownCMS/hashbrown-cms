'use strict';

const Path = require('path');

const MAX_CACHE_TIME = 1000 * 60 * 60 * 24 * 10 // 10 days

/**
 * The media resource
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Media extends require('Common/Entity/Resource/Media') {
    /**
     * Gets the media provider connection
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {HashBrown.Entity.Resource.Connection} Connection
     */
    static async getProvider(project, environment) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        
        let environments = await HashBrown.Service.SettingsService.getSettings(project, 'environments');

        if(!environments || !environments[environment] || !environments[environment].mediaProvider) { return null; }

        let connection = await HashBrown.Entity.Resource.Connection.get(project, environment, environments[environment].mediaProvider);

        return connection;
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.Media} Instance
     */
    static async create(project, environment, data = {}, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(options, 'options', Object, true);
        
        let connection = await this.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        if(options.filename) {
            data.name = options.filename;
        }

        let resource = await super.create(project, environment, data, options);

        if(options.filename && options.base64) {
            await connection.setMedia(resource.id, options.filename, options.base64);
        }

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        let connection = await this.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        // Make sure we include all media items, even ones not in the database
        let filenames = await connection.getAllMediaFilenames();
        let resources = await super.list();

        for(let resource of resources) {
            if(filenames[resource.id]) { 
                delete filenames[resource.id];
            }
        }

        for(let id in filenames) {
            let resource = new Media({
                id: id,
                name: filename
            });

            resources.append(resource);
        }

        return resources;
    }
    
    /**
     * Removes this entity
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async remove(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        await this.clearCache();
        await super.remove(options);
        
        let connection = await this.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        await connection.removeMedia(this.id);
    }

    /**
     * Saves the current state of this entity
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async save(project, environment, options = {}) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        let connection = await this.constructor.getProvider();

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        if(options.filename && options.base64) {
            await connection.setMedia(this.id, options.filename, options.base64);
        
            this.name = options.filename;
        }

        await super.save(project, environment);
        await super.clearCache();
    }
   
    /**
     * Clears the cache for this media item
     *
     * @param {String} project
     * @param {String} environment
     */
    async clearCache(project, environment) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, environment, 'media', this.id);
        let files = await HashBrown.Service.FileService.list(cacheFolder);

        for(let file of files) {
            await HashBrown.Service.FileService.remove(Path.join(cacheFolder, file));
        }
    }

    /**
     * Get the cache for this media item
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} width
     * @param {Number} height
     *
     * @returns {Buffer} Binary data
     */
    async getCache(project, media, width, height = 0) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(width, 'width', Number, true);
        checkParam(height, 'height', Number);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, environment, 'media', this.id);
        let cacheFile = Path.join(cacheFolder, width + (height ? 'x' + height : '') '.jpg');
        
        // Create the cache folder, if it doesn't exist
        await HashBrown.Service.FileService.makeDirectory(cacheFolder);

        // Get file stats
        let stats = await HashBrown.Service.FileService.stat(cacheFile);

        // File was OK
        if(stats && new Date().getTime() - new Date(stats.atime).getTime() < MAX_CACHE_TIME) {
            data = await HashBrown.Service.FileService.read(cacheFile);

        // File was not OK, copy and resize it
        } else {
            // Remove it, if it exists
            await HashBrown.Service.FileService.remove(cacheFile);
            
            // Procure the URL from the providing connection
            let connection = await this.constructor.getProvider();

            if(!connection) {
                throw new Error('No connection set as media provider');
            }

            let url = await connection.getMediaUrl(this.id);

            if(!url) {
                throw new Error(`Cannot fetch media "${this.id}", no URL available from provider`);
            }

            await HashBrown.Service.FileService.copy(url, cacheFile);

            // Resize file
            if(width && this.isImage() && !this.isSvg()) { 
                await HashBrown.Service.AppService.exec('convert ' + cacheFile + ' -resize ' + width + (height ? 'x' + height : '') + '\\> ' + cacheFile);
            }
            
            // Read file
            data = await HashBrown.Service.FileService.read(cacheFile);
        }

        return data;
    }
    
    /**
     * Cleans the entire media cache
     *
     * @param {String} project
     * @param {String} environment
     */
    static async clearCache(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let cacheFolders = Path.join(APP_ROOT, 'storage', project, environment, 'media', '*');
        let files = await HashBrown.Service.FileService.list(cacheFolders);
        
        for(let file of files) {
            await HashBrown.Service.FileService.remove(Path.join(cacheFolder, file));
        }
    }

    /**
     * Pulls a synced resource
     *
     * @param {String} project
     * @param {String} environment
     */
    async pull(project, environment) {
        throw new Error('Pull not enabled for media');
    }
    
    /**
     * Pushes a synced resource
     *
     * @param {String} project
     * @param {String} environment
     */
    async push(project, environment) {
        throw new Error('Push not enabled for media');
    }
    
    /**
     * Submits a heartbeat on this resource
     *
     * @param {String} project
     * @param {String} environment
     * @param {HashBrown.Entity.Resource.User} user
     */
    async heartbeat(project, environment, user) {
        throw new Error('Heartbeat not enabled for media');
    }
}

module.exports = Media;
