'use strict';

const Path = require('path');

/**
 * The media resource
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Media extends require('Common/Entity/Resource/Media') { 
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'contentUrl');
        this.def(String, 'thumbnailUrl');
    }

    /**
     * Gets the media deployer
     *
     * @param {String} projectId
     * @param {String} environment
     *
     * @return {HashBrown.Entity.Deployer.DeployerBase} Deployer
     */
    static async getDeployer(projectId, environment) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        
        let project = await HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let deployer = await project.getEnvironmentSettings(environment, 'mediaDeployer');

        if(!deployer || !deployer.alias) { return null; }

        deployer.context = {
            project: projectId,
            environment: environment
        };

        return HashBrown.Entity.Deployer.DeployerBase.new(deployer);
    }
    
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.Media} Instance
     */
    static async create(user, projectId, environment, data = {}, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.filename, 'data.filename', String, true);
        checkParam(options, 'options', Object, true);
        checkParam(options.full, 'options.full', String, true);
        
        let deployer = await this.getDeployer(projectId, environment);

        if(!deployer) {
            throw new Error('No media deployer configured');
        }

        let resource = await super.create(user, projectId, environment, data, options);

        await deployer.removeFolder(deployer.getPath(resource.id));
        await deployer.setFile(deployer.getPath(resource.id, options.filename), options.full);
        
        let thumbnail = await this.generateThumbnail(projectId, environment, options.filename, Buffer.from(options.full, 'base64'));
       
        if(thumbnail) {
            await deployer.setFile(deployer.getPath(resource.id, 'thumbnail.jpg'), thumbnail.toString('base64'));
        }

        return resource;
    }
    
    /**
     * Gets the content URL
     *
     * @param {Boolean} ensureWebUrl
     *
     * @return {String} Content URL
     */
    async getContentUrl(ensureWebUrl = false) {
        checkParam(ensureWebUrl, 'ensureWebUrl', Boolean);
       
        let deployer = await this.constructor.getDeployer(this.context.project, this.context.environment);

        if(!deployer) { return null; }
                
        let files = await deployer.getFolder(deployer.getPath(this.id));
        
        if(!files || files.length < 1) { return null; }
        
        for(let file of files) {
            if(Path.basename(file) === 'thumbnail.jpg') { continue; }

            // Ensure that this URL can be reached from a web browser
            if(ensureWebUrl && file.indexOf('://') < 0) {
                file = Path.join(deployer.publicUrl, deployer.path, this.id, Path.basename(file));

                // If the path module removed doubles slashes for protocols, add them back
                file = file.replace(/:\/([^\/])/, '://$1');
            }

            return file;
        }

        return null;
    }

    /**
     * Gets the thumbnail URL
     *
     * @return {String} Thumbnail URL
     */
    async getThumbnailUrl(ensureWebUrl = false) {
        checkParam(ensureWebUrl, 'ensureWebUrl', Boolean);

        let url = await this.getContentUrl(ensureWebUrl);

        if(!url) { return null }

        // SVGs don't use thumbnails
        if(!this.isSvg()) {
            url = Path.join(Path.dirname(url), 'thumbnail.jpg');
        }

        // If the path module removed doubles slashes for protocols, add them back
        url = url.replace(/:\/([^\/])/, '://$1');

        return url;
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
        
        if(!resource) {
            resource = this.new({
                id: id,
                context: {
                    project: projectId,
                    environment: environment
                }
            });
        }

        resource.contentUrl = await resource.getContentUrl();
        resource.thumbnailUrl = await resource.getThumbnailUrl();
        resource.filename = Path.basename(resource.contentUrl);

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(projectId, environment, options = {}) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);
        
        // Get resources from database
        let resources = await super.list(projectId, environment, options);

        // Also get resources from files
        let deployer = await this.getDeployer(projectId, environment);

        if(deployer) {
            let files = await deployer.getFolder(deployer.getPath(), 2) || [];
            let urls = {};
       
            for(let file of files) {
                if(Path.basename(file) === 'thumbnail.jpg') { continue; }

                let folder = Path.basename(Path.dirname(file));

                if(urls[folder]) { continue; }
               
                urls[folder] = file;
            }

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
        }

        // Get thumbnail URLs
        for(let resource of resources) {
            resource.context = {
                project: projectId,
                environment: environment
            };

            resource.thumbnailUrl = await resource.getThumbnailUrl();
        }

        return resources;
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
        
        let deployer = await this.constructor.getDeployer(this.context.project, this.context.environment);

        if(!deployer) {
            throw new Error('No media deployer configured');
        }

        await deployer.removeFolder(deployer.getPath(this.id));
    }

    /**
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {Object} options
     */
    async save(user, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(options, 'options', Object, true);

        let deployer = await this.constructor.getDeployer(this.context.project, this.context.environment);

        if(!deployer) {
            throw new Error('No media deployer configured');
        }

        if(this.filename && options.full) {
            await deployer.removeFolder(deployer.getPath(this.id));
            await deployer.setFile(deployer.getPath(this.id, options.filename), options.full);
        }

        // Remove thumbnail if specified
        if(options.thumbnail === false) {
            await deployer.removeFile(deployer.getPath(this.id, 'thumbnail.jpg'));

        // Save thumbnail if specified
        } else if(options.thumbnail) {
            await deployer.setFile(deployer.getPath(this.id, 'thumbnail.jpg'), options.thumbnail);
        
        // If no thumbnail was specified, attempt to generate one
        } else if(options.full && options.filename) {
            let thumbnail = await this.generateThumbnail(this.context.project, this.context.environment, options.filename, Buffer.from(options.full, 'base64'));
           
            if(thumbnail) {
                await deployer.setFile(deployer.getPath(this.id, 'thumbnail.jpg'), thumbnail.toString('base64'));
            }
        }

        await super.save(user, options);
    }

    /**
     * Generates a thumbnail, if possible
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {String} filename
     * @param {Buffer} data
     *
     * @return {Buffer} Thumbnail
     */
    static async generateThumbnail(projectId, environment, filename, data, width = 200, height = 200) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(filename, 'filename', String, true);
        checkParam(data, 'data', Buffer, true);

        let type = getMIMEType(filename);
        
        // If not an image, or SVG, we won't be generating anything
        if(type.indexOf('image') < 0 || type.indexOf('svg') > -1) { return null; }

        let tempFolder = Path.join(APP_ROOT, 'storage', projectId, environment, 'media');
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
