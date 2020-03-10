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
     * @param {String} projectId
     * @param {String} environment
     *
     * @return {HashBrown.Entity.Resource.Connection} Connection
     */
    static async getProvider(projectId, environment) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        
        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let environments = await project.getEnvironments();

        if(!environments || !environments[environment] || !environments[environment].mediaProvider) { return null; }

        let connection = await HashBrown.Entity.Resource.Connection.get(project, environment, environments[environment].mediaProvider);

        return connection;
    }
    
    /**
     * Sets the media provider connection
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} connectionId
     */
    static async setProvider(projectId, environment, connectionId) {
        checkParam(projectId, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(connectionId, 'connectionId', String, true);
        
        let project = HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }
        
        let connection = await HashBrown.Entity.Resource.Connection.get(connectionId);

        if(!connection) {
            throw new Error(`Connection ${connectionId} not found`);
        }

        let settings = await project.getEnvironmentSettings(environment) || {};

        settings.mediaProvider = connectionId;

        project.setEnvironmentSettings(environment, settings);
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.Media} Instance
     */
    static async create(user, project, environment, data = {}, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.filename, 'data.filename', String, true);
        checkParam(data.base64, 'data.base64', String, true);
        checkParam(options, 'options', Object, true);
        
        let connection = await this.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        let resource = await super.create(user, project, environment, data, options);

        await connection.setMedia(resource.id, data.filename, data.base64);

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
     * @param {HashBrown.Entity.User} user
     * @param {String} project
     * @param {String} environment
     * @param {Object} options
     */
    async save(user, project, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        let connection = await this.constructor.getProvider();

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        await connection.renameMedia(this.id, this.filename);

        if(this.base64) {
            await connection.setMedia(this.id, this.filename, this.base64);
        }

        await super.save(user, project, environment);
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
        let cacheFile = Path.join(cacheFolder, width + (height ? 'x' + height : '') + '.jpg');
        
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
     * @param {HashBrown.Entity.User} user
     */
    async heartbeat(project, environment, user) {
        throw new Error('Heartbeat not enabled for media');
    }
}

module.exports = Media;
