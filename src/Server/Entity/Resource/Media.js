'use strict';

const Path = require('path');

/**
 * The media resource
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Media extends require('Common/Entity/Resource/Media') { 
    /**
     * Gets the media deployer
     *
     * @param {HashBrown.Entity.Context} context
     *
     * @return {HashBrown.Entity.Deployer.DeployerBase} Deployer
     */
    static async getDeployer(context) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        
        return await context.project.getEnvironmentSettings(context.environment, 'mediaDeployer');
    }
    
    /**
     * Gets the public URL of a filename
     *
     * @param {String} filename
     *
     * @return {String} Public URL
     */
    async getPublicUrl(filename) {
        checkParam(filename, 'filename', String);
        
        filename = filename.trim();

        // If the filename contains a protocol or double slashes, return it as is
        if(filename.indexOf('http') === 0 || filename.indexOf('//') === 0) { return filename; }
       
        // Construct relative path
        filename = '/' + filename.split(/[\/\\]/).filter(Boolean).join('/');
        
        let rootUrl = await this.context.project.getEnvironmentSettings(this.context.environment, 'mediaPublicUrl');

        if(!rootUrl) { return filename; }

        try {
            // The root URL contains protocol information
            if(rootUrl.indexOf('://') > -1) {
                let url = new URL(rootUrl);

                if(url.pathname && url.pathname !== '/') { 
                    filename = Path.join(url.pathname, filename);
                }

                filename = url.protocol + '//' + url.host + filename;

            // The root URL is relative to the frontend
            } else {
                filename = Path.join(rootUrl, filename);

            }
        
        } catch(e) {
            throw new Error(`Could not parse the "mediaPublicUrl": ${e.message}`);
        
        }
        
        return filename;
    }

    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.Media} Instance
     */
    static async create(context, data = {}, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.filename, 'data.filename', String, true);
        checkParam(options, 'options', Object, true);
        checkParam(options.full, 'options.full', String, true);
        
        let deployer = await this.getDeployer(context);

        if(!deployer) {
            throw new Error('No media deployer configured');
        }

        let resource = await super.create(context, data, options);

        await deployer.removeFolder(deployer.getPath(resource.id));
        await deployer.setFile(deployer.getPath(resource.id, options.filename), options.full);

        let thumbnail = await this.generateThumbnail(context, options.filename, Buffer.from(options.full, 'base64'));
       
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
        
        if(ensureWebUrl) {
            return await this.getPublicUrl(this.id + '/' + this.filename);
        }

        let deployer = await this.constructor.getDeployer(this.context);

        if(!deployer) { return null; }
                
        let files = await deployer.getFolder(deployer.getPath(this.id));
        
        if(!files || files.length < 1) { return null; }
        
        for(let file of files) {
            if(Path.basename(file) === 'thumbnail.jpg') { continue; }

            return file;
        }

        return '';
    }

    /**
     * Gets a URL of a file inside this media folder
     *
     * @param {String} filename
     * @param {Boolean} ensureWebUrl
     *
     * @return {String} Custom URL
     */
    async getFileUrl(filename, ensureWebUrl = false) {
        checkParam(filename, 'filename', String);
        checkParam(ensureWebUrl, 'ensureWebUrl', Boolean);

        if(!filename) { return ''; }

        if(ensureWebUrl) {
            return await this.getPublicUrl(this.id + '/' + filename);
        }
        
        let deployer = await this.constructor.getDeployer(this.context);

        if(!deployer) { return ''; }
                
        return deployer.getPath(this.id, filename);
    }

    /**
     * Gets the thumbnail URL
     *
     * @return {String} Thumbnail URL
     */
    async getThumbnailUrl(ensureWebUrl = false) {
        checkParam(ensureWebUrl, 'ensureWebUrl', Boolean);

        if(this.isSvg()) {
            return this.getContentUrl(ensureWebUrl);
        }

        if(ensureWebUrl) {
            return await this.getPublicUrl(this.id + '/thumbnail.jpg');
        }

        let deployer = await this.constructor.getDeployer(this.context);

        if(!deployer) { return ''; }
                
        return deployer.getPath(this.id, 'thumbnail.jpg');
    }

    /**
     * Gets an instance of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async get(context, id, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(id, 'id', String, true);
        checkParam(options, 'options', Object, true);
        
        // First attempt to get the file on disk
        let files = [];
        let deployer = await this.getDeployer(context);

        if(deployer) {
            files = await deployer.getFolder(deployer.getPath(id)) || [];
        }
        
        // Get resource from database
        let resource = await super.get(context, id, options);

        // Associate resource with file
        for(let file of files) {
            let filename = Path.basename(file);

            if(filename === 'thumbnail.jpg') { continue; }

            if(!resource) {
                resource = this.new({
                    id: id,
                    filename: filename,
                    context: context
                });
            }

            let stats = await HashBrown.Service.FileService.stat(file);

            resource.filename = filename;
            resource.updatedOn = stats.ctime;
            break;
        }

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(context, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(options, 'options', Object, true);
       
        // Get resources from database
        let resources = await super.list(context, options);

        // Create a map of the resources for quick access
        let resourceMap = {};

        for(let resource of resources) {
            resourceMap[resource.id] = resource;
        }

        // Get the files on disk
        let files = [];
        let deployer = await this.getDeployer(context);

        if(deployer) {
            files = await deployer.getFolder(deployer.getPath(), 2) || [];
        }

        // Associate resources with files
        for(let file of files) {
            let id = Path.basename(Path.dirname(file));
            let filename = Path.basename(file);

            if(filename === 'thumbnail.jpg') { continue; }

            // Create temporary resource, if it doesn't exist in the database
            if(!resourceMap[id]) {
                // If we're looking for media inside a non-root folder, skip resources not in the database
                if(options.folder && options.folder !== '/') { continue; }

                resourceMap[id] = new Media({ id: id, context: context });
            }

            resourceMap[id].context = context;
            resourceMap[id].filename = filename;
        }

        resources = Object.values(resourceMap);

        resources.sort((a, b) => {
            a = a.getName();
            b = b.getName();

            return a === b ? 0 : a < b ? -1 : 1;
        });
        
        return resources;
    }
    
    /**
     * Removes this entity
     *
     * @param {Object} options
     */
    async remove(options = {}) {
        checkParam(options, 'options', Object, true);

        await super.remove(options);
        
        let deployer = await this.constructor.getDeployer(this.context);

        if(deployer) {
            await deployer.removeFolder(deployer.getPath(this.id));
        }
    }

    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        let deployer = await this.constructor.getDeployer(this.context);

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
            let thumbnail = await this.constructor.generateThumbnail(this.context, options.filename, Buffer.from(options.full, 'base64'));
           
            if(thumbnail) {
                await deployer.setFile(deployer.getPath(this.id, 'thumbnail.jpg'), thumbnail.toString('base64'));
            }
        }

        await super.save(options);
    }

    /**
     * Generates a thumbnail, if possible
     *
     * @param {HashBrown.Entity.Context} context
     * @param {String} filename
     * @param {Buffer} data
     *
     * @return {Buffer} Thumbnail
     */
    static async generateThumbnail(context, filename, data, width = 200, height = 200) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(filename, 'filename', String, true);
        checkParam(data, 'data', Buffer, true);

        let type = getMIMEType(filename);
        
        // If not an image, or SVG, we won't be generating anything
        if(type.indexOf('image') < 0 || type.indexOf('svg') > -1) { return null; }

        let tempFolder = Path.join(APP_ROOT, 'storage', context.project.id, context.environment, 'tmp');
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
