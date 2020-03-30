'use strict';

const Path = require('path');

/**
 * The media resource
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Media extends require('Common/Entity/Resource/Media') {
    /**
     * Gets the thumbnail URL
     *
     * @return {String} Thumbnail URL
     */
    get thumbnailUrl() {
        if(!this.contentUrl) { return null; }

        let url = null;

        if(!this.isImage()) {
            url = Path.join(Path.dirname(this.contentUrl), 'thumbnail.jpg');

        } else if(this.isSvg()) {
            url = this.contentUrl;

        } else {
            url = Path.join(Path.dirname(this.contentUrl), 'thumbnail' + Path.extname(this.contentUrl));

        }

        if(!url) { return null }

        // If the path module removed doubles slashes for protocols, add them back
        url = url.replace(/:\/([^\/])/, '://$1');

        return url;
    }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'contentUrl');
    }

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

        let environments = await project.getSettings('environments');

        if(!environments || !environments[environment] || !environments[environment].mediaProvider) { return null; }

        let connection = await HashBrown.Entity.Resource.Connection.get(projectId, environment, environments[environment].mediaProvider);

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
        
        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }
        
        let connection = await HashBrown.Entity.Resource.Connection.get(projectId, environment, connectionId);

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
        checkParam(options, 'options', Object, true);
        checkParam(options.full, 'options.full', String, true);
        
        let connection = await this.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        let resource = await super.create(user, project, environment, data, options);

        await connection.setMedia(resource.id, options.filename, options.full, true);
        
        let thumbnail = await this.generateThumbnail(project, environment, options.filename, Buffer.from(options.full, 'base64'));
       
        if(thumbnail) {
            await connection.setMedia(resource.id, `thumbnail${Path.extname(options.filename)}`, thumbnail.toString('base64'));
        }

        return resource;
    }
    
    /**
     * Gets an instance of this entity type
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(projectId, environment, id, options = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object, true);

        let resource = await super.get(projectId, environment, id, options);
        
        let connection = await this.getProvider(projectId, environment);

        if(connection) {
            let contentUrl = await connection.getMediaUrl(id);

            if(contentUrl) {
                if(!resource) {
                    resource = this.new({ id: id });
                }

                resource.filename = Path.basename(contentUrl);
                resource.contentUrl = contentUrl;
            }
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

        if(!connection) { return []; }

        // Make sure we include all media items, even ones not in the database
        let resources = await super.list(project, environment, options);
        let urls = await connection.getAllMediaUrls();
       
        // Adopt media URLs into resources
        for(let resource of resources) {
            let url = urls[resource.id];

            delete urls[resource.id];

            if(!url) { continue; }

            resource.filename = Path.basename(url);
            resource.contentUrl = url;
        }
       
        // Create resources for leftover URLs
        for(let id in urls) {
            let url = urls[id];

            let resource = new Media({
                id: id,
                filename: Path.basename(url),
                contentUrl: url
            });

            resources.push(resource);
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

        await super.remove(user, project, environment, options);
        
        let connection = await this.constructor.getProvider(project, environment);

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

        let connection = await this.constructor.getProvider(project, environment);

        if(!connection) {
            throw new Error('No connection set as media provider');
        }

        if(this.filename && options.full) {
            await connection.setMedia(this.id, this.filename, options.full, true);
        }
        
        // Save thumbnail if specified
        if(options.thumbnail) {
            await connection.setMedia(this.id, `thumbnail${Path.extname(this.filename)}`, options.thumbnail);
        
        // If no thumbnail was specified, attempt to generate one
        } else if(options.full && options.filename) {
            let thumbnail = await this.constructor.generateThumbnail(project, environment, options.filename, Buffer.from(options.full, 'base64'));
           
            if(thumbnail) {
                await connection.setMedia(this.id, `thumbnail${Path.extname(options.filename)}`, thumbnail.toString('base64'));
            }
        }

        await super.save(user, project, environment);
    }

    /**
     * Generates a thumbnail, if possible
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} filename
     * @param {Buffer} data
     *
     * @return {Buffer} Thumbnail
     */
    static async generateThumbnail(project, environment, filename, data, width = 200, height = 200) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(filename, 'filename', String, true);
        checkParam(data, 'data', Buffer, true);

        let type = getMIMEType(filename);
        
        // If not an image, or SVG, we won't be generating anything
        if(type.indexOf('image') < 0 || type.indexOf('svg') > -1) { return null; }

        let tempFolder = Path.join(APP_ROOT, 'storage', project, environment, 'media');
        let tempFile = Path.join(tempFolder, 'thumbnail' + Path.extname(filename));
        
        // Write the temporary file of the full source
        await HashBrown.Service.FileService.makeDirectory(tempFolder);

        await HashBrown.Service.FileService.write(data, tempFile);
   
        // Scale down the image
        await HashBrown.Service.AppService.exec('convert ' + tempFile + ' -auto-orient -resize ' + width + (height ? 'x' + height : '') + '\\> ' + tempFile);
       
        // Read the scaled down image
        data = await HashBrown.Service.FileService.read(tempFile);
        
        // Remove the temporary folder
        await HashBrown.Service.FileService.remove(tempFolder);
        
        return data;
    }
}

module.exports = Media;
