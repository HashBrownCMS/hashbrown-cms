'use strict';

const Path = require('path');

const ConnectionCommon = require('Common/Models/Connection');

/**
 * The server side Connection class
 *
 * @memberof HashBrown.Server.Models
 */
class Connection extends ConnectionCommon {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(HashBrown.Models.Processor, 'processor');
        this.def(HashBrown.Models.Deployer, 'deployer');
    }

    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = super.paramsCheck(params);

        if(params.processor instanceof HashBrown.Models.Processor === false) {
            let processor = HashBrown.Helpers.ConnectionHelper.getProcessor(params.processor.alias);

            if(processor) {
                params.processor = new processor(params.processor);
            } else {
                params.processor = new HashBrown.Models.Processor(params.processor);
            }
        }
        
        if(params.deployer instanceof HashBrown.Models.Deployer === false) {
            let deployer = HashBrown.Helpers.ConnectionHelper.getDeployer(params.deployer.alias);

            if(deployer) {
                params.deployer = new deployer(params.deployer);
            } else {
                params.deployer = new HashBrown.Models.Deployer(params.deployer);
            }
        }

        return params;
    }
    
    /**
     *  Unpublishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     */
    async unpublishContent(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        
        debug.log('Unpublishing all localised property sets...', this);
        
        await this.removePreview(project, environment, content)
        
        let languages = await HashBrown.Helpers.LanguageHelper.getLanguages(project);

        for(let language of languages) {
            await this.removeContent(content.id, language);
        }

        debug.log('Unpublished all localised property sets successfully!', this);
    }
    
    /**
     * Removes a Content preview
     *
     * @params {Content} content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     */
    async removePreview(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        
        if(!content.hasPreview) { return; }

        content.hasPreview = false;
        
        await HashBrown.Helpers.ContentHelper.updateContent(project, environment, content);

        let languages = await HashBrown.Helpers.LanguageHelper.getLanguages(project);

        for(let language of languages) {
            await this.removeContent(content.id + '_preview', language);
        }
    }

    /**
     * Generates a Content preview
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {String} language
     *
     * @returns {String} Preview URL
     */
    async generatePreview(project, environment, content, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(language, 'language', String);
        
        content.hasPreview = true;
       
        await HashBrown.Helpers.ContentHelper.updateContent(project, environment, content);

        content.setPropertyValue('url', '/preview' + content.getPropertyValue('url', language), language);

        await this.setContent(content.id + '_preview', content, language);

        return this.url + content.getPropertyValue('url', language);
    }

    /**
     * Publishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     */
    async publishContent(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        debug.log('Publishing all localisations of content "' + content.id + '"...', this);

        await this.removePreview(project, environment, content);

        let languages = await HashBrown.Helpers.LanguageHelper.getLanguages(project);
        
        for(let language of languages) { 
            await this.setContent(project, environment, content.id, content, language);
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
        checkParam(content,  'content', HashBrown.Models.Content);
        checkParam(language, 'language', String);
       
        if(!this.processor || typeof this.processor.process !== 'function') {
            throw new Error('This Connection has no processor defined');
        }

        if(!this.deployer || typeof this.deployer.setFile !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

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

        await this.deployer.setFile(this.deployer.getPath('content', language + '/' + id + this.processor.fileExtension), result);
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

        await this.deployer.removeFile(this.deployer.getPath('content', language + '/' + id + this.processor.fileExtension));
    }
    
    /**
     * Gets a list of Media nodes
     *
     * @returns {Array} Media
     */
    async getAllMedia() {
        if(!this.deployer || typeof this.deployer.getFolder !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

        let folders = await this.deployer.getFolder(this.deployer.getPath('media'), 2)
        
        if(!folders) { return []; }

        let allMedia = [];

        for(let folder of folders) {
            let name = folder.name || folder.filename || folder.path;

            if(!name && typeof folder === 'string') {
                name = folder;
            }
                
            name = Path.basename(name);

            let id = folder.path || folder.id;
            
            if(!id && typeof folder === 'string') {
                id = folder;
            }
            
            // Get last bit of the path, if it's a path
            if(id.indexOf(Path.sep) > -1) {
                id = Path.dirname(id).split(Path.sep).pop();
            }
            
            let media = new HashBrown.Models.Media({
                id: id,
                url: this.deployer.getPath('media', id + '/' + name, true),
                name: name
            });

            allMedia.push(media);
        }

        return allMedia;
    }
    
    /**
     * Gets a Media node by id
     *
     * @param {String} id
     *
     * @returns {HashBrown.Models.Media} Media node
     */
    async getMedia(id) {
        checkParam(id, 'id', String);

        if(!this.deployer || typeof this.deployer.getFolder !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

        let files = await this.deployer.getFolder(this.deployer.getPath('media', id + '/'), 1);

        if(!files || files.length < 1) { throw new Error('Media "' + id + '" not found'); }

        let file = Array.isArray(files) ? files[0] : files;

        let name = file.name || file.filename || file.url || file.path;
        
        if(!name && typeof file === 'string') {
            name = file;
        }

        name = Path.basename(name);

        return new HashBrown.Models.Media({
            id: id,
            name: name,
            url: file.url,
            path: file.path || file
        });
    }
    
    /**
     * Renames a Media node by id
     *
     * @param {String} id
     * @param {String} name
     *
     * @returns {HashBrown.Models.Media} Media node
     */
    async renameMedia(id, name) {
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);
        
        let media = await this.getMedia(id);

        await this.deployer.renameFile(media.path, name);

        return media;
    }
    
    /**
     * Sets a Media node by id
     *
     * @param {String} id
     * @param {String} name
     * @param {String} base64
     *
     * @returns {HashBrown.Models.Media} Media node
     */
    async setMedia(id, name, base64) {
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);
        checkParam(base64, 'base64', String);
        
        try {
            await this.removeMedia(id)
        } catch(e) {
            // It doesn't matter if the file was not found, we don't want it there anyway
        }
        
        await this.deployer.setFile(this.deployer.getPath('media', id + '/' + name), base64);
    }
    
    /**
     * Removes a Media node by id
     *
     * @param {String} id
     */
    async removeMedia(id) {
        checkParam(id, 'id', String);

        if(!this.deployer || typeof this.deployer.removeFolder !== 'function') {
            throw new Error('This Connection has no deployer defined');
        }

        await this.deployer.removeFolder(this.deployer.getPath('media', id));
    }
}

module.exports = Connection;
