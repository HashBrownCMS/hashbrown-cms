'use strict';

const Path = require('path');

/**
 * The server side Connection class
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class Connection extends require('Common/Entity/Resource/Connection') {
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
        checkParam(params, 'params', Object);

        params = params || {};

        if(params.processor instanceof HashBrown.Entity.Processor.ProcessorBase === false) {
            if(params.processor.alias) {
                params.processor = params.processor.alias;
            }

            params.processor = HashBrown.Entity.Processor.ProcessorBase.new({ alias: params.processor });
        }
        
        if(params.deployer instanceof HashBrown.Entity.Deployer.DeployerBase === false) {
            params.deployer = HashBrown.Entity.Deployer.DeployerBase.new(params.deployer);
        }

        super.adopt(params);
    }
    
    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
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
     * Checks a string for illegal path components
     *
     * @param {String} name
     * @param {String} value
     */
    pathComponentCheck(name, value) {
        checkParam(name, 'name', String);
        checkParam(value, 'value', String);

        const values = [ '.' ];

        for(let v of values) {
            if(value === v) {
                throw new Error(`The value of "${name}" cannot be "${v}"`);
            }
        }

        const components = [ '..', '\\', '/', '*' ];

        for(let c of components) {
            if(value.indexOf(c) > -1) {
                throw new Error(`The value of "${name}" cannot contain "${c}"`);
            }
        }
    }

    /**
     * Unpublishes content
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Content} content
     */
    async unpublishContent(projectId, environment, content) {
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content, true);
        
        debug.log('Unpublishing all localised property sets...', this);
       
        let project = HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let languages = await project.getLanguages();

        for(let language of languages) {
            await this.removeContent(content.id, language);
        }

        debug.log('Unpublished all localised property sets successfully!', this);
    }
    
    /**
     * Publishes content
     *
     * @param {String} projectId
     * @param {String} environment
     * @param {Content} content
     */
    async publishContent(projectId, environment, content) {
        checkParam(projectId, 'projectId', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Entity.Resource.Content);

        debug.log('Publishing all localisations of content "' + content.id + '"...', this);

        let project = HashBrown.Entity.Project.get(projectId);

        if(!project) {
            throw new Error(`Project ${projectId} not found`);
        }

        let languages = await project.getLanguages();
        
        for(let language of languages) { 
            await this.setContent(projectId, environment, content.id, content, language);
        }

        debug.log('Published all localisations successfully!', this);
    }
    
    /**
     * Sets a Content node by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Content} content
     * @param {String} language
     */
    async setContent(project, environment, id, content, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(content,  'content', HashBrown.Entity.Resource.Content);
        checkParam(language, 'language', String);
       
        if(!this.processor || typeof this.processor.process !== 'function') {
            throw new Error('This Connection has no processor defined');
        }

        if(!this.deployer || typeof this.deployer.setFile !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

        this.pathComponentCheck('id', id);
        this.pathComponentCheck('language', language);
        this.pathComponentCheck('fileExtension', this.deployer.fileExtension);
        
        let result = await this.processor.process(project, environment, content, language);

        // Convert to string
        if(typeof result !== 'string') {
            try {
                result = JSON.stringify(result);
            } catch(e) {
                result = result.toString();
            }
        }

        result = Buffer.from(result, 'utf8').toString('base64');

        await this.deployer.setFile(this.deployer.getPath('content', language + '/' + id + this.deployer.fileExtension), result);
    }
    
    /**
     * Removes a Content node by id
     *
     * @param {String} id
     * @param {String} language
     */
    async removeContent(id, language) {
        checkParam(id, 'id', String);
        checkParam(language, 'language', String);

        if(!this.deployer || typeof this.deployer.removeFile !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

        this.pathComponentCheck('id', id);
        this.pathComponentCheck('language', language);
        this.pathComponentCheck('fileExtension', this.deployer.fileExtension);
        
        await this.deployer.removeFile(this.deployer.getPath('content', language + '/' + id + this.deployer.fileExtension));
    }
    
    /**
     * Gets a list of media urls
     *
     * @returns {Array} Media urls
     */
    async getAllMediaUrls() {
        if(!this.deployer || typeof this.deployer.getFolder !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }
        
        let files = await this.deployer.getFolder(this.deployer.getPath('media'), 2)
        
        if(!files) { return []; }

        let urls = {};

        for(let file of files) {
            if(Path.basename(file, Path.extname(file)) === 'thumbnail') { continue; }

            let folder = Path.basename(Path.dirname(file));

            if(urls[folder]) { continue; }
           
            urls[folder] = file;
        }

        return urls;
    }
    
    /**
     * Gets media URL by id
     *
     * @param {String} id
     *
     * @returns {String} Media URL
     */
    async getMediaUrl(id) {
        checkParam(id, 'id', String, true);

        if(!this.deployer || typeof this.deployer.getFolder !== 'function') {
            throw new Error('This connection has no deployer defined');
        }
        
        this.pathComponentCheck('id', id);

        let files = await this.deployer.getFolder(this.deployer.getPath('media', id + '/'), 1);

        if(!files || files.length < 1) { return null; }

        for(let file of files) {
            if(Path.basename(file, Path.extname(file)) === 'thumbnail') { continue; }

            return file;
        }

        return null;
    }
    
    /**
     * Sets a media node by id
     *
     * @param {String} id
     * @param {String} name
     * @param {String} base64
     * @param {Boolean} clear
     *
     * @returns {HashBrown.Entity.Resource.Media} Media node
     */
    async setMedia(id, name, base64, clear = false) {
        checkParam(id, 'id', String, true);
        checkParam(name, 'name', String, true);
        checkParam(base64, 'base64', String, true);
        checkParam(clear, 'clear', Boolean);
        
        this.pathComponentCheck('id', id);
        this.pathComponentCheck('name', name);
        
        if(clear) {
            try {
                await this.removeMedia(id)
            } catch(e) {
                // It doesn't matter if the file was not found, we don't want it there anyway
            }
        }
        
        await this.deployer.setFile(this.deployer.getPath('media', `${id}/${name}`), base64);
    }
    
    /**
     * Removes a media node by id
     *
     * @param {String} id
     */
    async removeMedia(id) {
        checkParam(id, 'id', String);
        
        this.pathComponentCheck('id', id);

        if(!this.deployer || typeof this.deployer.removeFolder !== 'function') {
            throw new Error('This connection has no deployer defined');
        }

        await this.deployer.removeFolder(this.deployer.getPath('media', id));
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {HashBrown.Entity.User} user
     * @param {String} projectId
     * @param {String} environment
     * @param {Object} options
     */
    async save(user, projectId, environment, options = {}) {
        checkParam(user, 'user', HashBrown.Entity.User, true);
        checkParam(projectId, 'projectId', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(options, 'options', Object, true);

        await super.save(user, projectId, environment, options);

        if(options.isMediaProvider) {
            await HashBrown.Entity.Resource.Media.setProvider(projectId, environment, this.id);
        }
    }
}

module.exports = Connection;
