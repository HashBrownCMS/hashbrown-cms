'use strict';

const Path = require('path');

const Processor = require('Common/Models/Processor');
const Deployer = require('Common/Models/Deployer');

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

        this.def(Processor, 'processor');
        this.def(Deployer, 'deployer');
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

        if(params.processor instanceof Processor === false) {
            let processor = HashBrown.Helpers.ConnectionHelper.getProcessor(params.processor.alias);

            if(processor) {
                params.processor = new processor(params.processor);
            }
        }
        
        if(params.deployer instanceof Deployer === false) {
            let deployer = HashBrown.Helpers.ConnectionHelper.getDeployer(params.deployer.alias);

            if(deployer) {
                params.deployer = new deployer(params.deployer);
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
     *
     * @returns {Promise} Promise
     */
    unpublishContent(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        
        debug.log('Unpublishing all localised property sets...', this);
        
        return this.removePreview(project, environment, content)
        .then(() => {
            return HashBrown.Helpers.LanguageHelper.getLanguages(project);
        })
        .then((languages) => {
            let next = () => {
                let language = languages.pop();

                // No more languauges to publish for
                if(!language) {
                    debug.log('Unpublished all localised property sets successfully!', this);
                    return Promise.resolve();
                }

                return this.removeContent(content.id, language)
                .then(() => {
                    return next();
                });
            };

            return next();
        });
    }
    
    /**
     * Removes a Content preview
     *
     * @params {Content} content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     *
     * @returns {Promise} Preview URL
     */
    removePreview(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        
        if(!content.hasPreview) { return Promise.resolve(); }

        content.hasPreview = false;
        
        return HashBrown.Helpers.ContentHelper.updateContent(project, environment, content)
        .then(() => {
            return HashBrown.Helpers.LanguageHelper.getLanguages(project);
        })
        .then((languages) => {
            let next = () => {
                let language = languages.pop();

                if(!language) {
                    return Promise.resolve();
                }

                return this.removeContent(content.id + '_preview', language)
                .then(() => {
                    return next();  
                });
            };

            return next();
        });
    }

    /**
     * Generates a Content preview
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     * @param {String} language
     *
     * @returns {Promise} Preview URL
     */
    generatePreview(project, environment, content, language) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);
        checkParam(language, 'language', String);
        
        content.hasPreview = true;
        
        return HashBrown.Helpers.ContentHelper.updateContent(project, environment, content)
        .then(() => {
            return HashBrown.Helpers.LanguageHelper.getLanguages(project);
        })
        .then((sets) => {
            content.url = '/preview' + content.url;

            return this.setContent(content.id + '_preview', content, language)
            .then(() => {
                return Promise.resolve(this.url + content.url);
            });
        });
    }

    /**
     * Publishes content
     *
     * @param {String} project
     * @param {String} environment
     * @param {Content} content
     *
     * @returns {Promise} Promise
     */
    publishContent(project, environment, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        debug.log('Publishing all localisations of content "' + content.id + '"...', this);

        return this.removePreview(project, environment, content)
        .then(() => {
            return HashBrown.Helpers.LanguageHelper.getLanguages(project);
        })
        .then((languages) => {
            let next = () => {
                let language = languages.pop();

                if(!language) {
                    debug.log('Published all localisations successfully!', this);
                    
                    return Promise.resolve();
                }

                return this.setContent(content.id, content, language)
                .then(() => {
                    return next();
                })
            }

            return next(0);
        });
    }
    
    /**
     * Sets a Content node by id
     *
     * @param {String} id
     * @param {Content} content
     * @param {String} language
     *
     * @returns {Promise} Result
     */
    setContent(id, content, language) {
        checkParam(id, 'id', String);
        checkParam(content,  'content', HashBrown.Models.Content);
        checkParam(language, 'language', String);
        
        return this.processor.process(content, language)
        .then((result) => {
            // Convert to string
            if(typeof result !== 'string') {
                try {
                    result = JSON.stringify(result);
                } catch(e) {
                    result = result.toString();
                }
            }

            result = Buffer.from(result, 'utf8').toString('base64');

            return this.deployer.setFile(this.deployer.getPath('content', language + '/' + id + this.processor.fileExtension), result);
        });
    }
    
    /**
     * Removes a Content node by id
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} Result
     */
    removeContent(id, language) {
        checkParam(id, 'id', String);
        checkParam(language, 'language', String);

        return this.deployer.removeFile(this.deployer.getPath('content', language + '/' + id + this.processor.fileExtension));
    }
    
    /**
     * Gets a list of Templates
     *
     * @param {String} type
     *
     * @returns {Promise} Templates
     */
    getAllTemplates(type) {
        checkParam(type, 'type', String);

        return this.deployer.getFolder(this.deployer.getPath('templates/' + type))
        .then((files) => {
            if(!files) { return Promise.resolve([]); }

            let allTemplates = [];

            for(let file of files) {
                let name = file.path || file.name;
                
                if(!name && typeof file === 'string') {
                    name = file;
                }

                name = Path.basename(name);
                
                let template = new HashBrown.Models.Template({
                    name: name,
                    type: type
                });

                allTemplates.push(template);
            }

            return Promise.resolve(allTemplates);
        });
    }
    
    /**
     * Gets a Template by name
     *
     * @param {String} type
     * @param {String} name
     *
     * @returns {Promise} Template
     */
    getTemplate(type, name) {
        checkParam(type, 'type', String);
        checkParam(name, 'name', String);

        return this.deployer.getFile(this.deployer.getPath('templates/' + type, name))
        .then((file) => {
            if(!file) { return Promise.reject(new Error('Template by id "' + id + '" not found')); }

            let name = file.path || file.name;
            
            if(!name && typeof file === 'string') {
                name = file;
            }

            name = Path.basename(name);
            
            let content = file.data || file.content || file.markup;

            // Detect base64 and convert if necessary
            // NOTE: This is a good guess, but not perfect, as it's basically impossible to be sure
            if(typeof content === 'string' && content.indexOf(' ') < 0) {
                let test = content.replace(/\r?\n|\r/g, '');
                let matches = test.match(/[A-Za-z0-9+/=]+/);

                if(matches && matches.length > 0 && matches[0].length === test.length) {
                    content = Buffer.from(content, 'base64').toString('utf8');
                }
            }

            return Promise.resolve(new HashBrown.Models.Template({
                name: file.name,
                type: type,
                markup: content
            }));
        });
    }
    
    /**
     * Sets a Template by name
     *
     * @param {String} type
     * @param {String} name
     * @param {String} content
     *
     * @returns {Promise} Result
     */
    setTemplate(type, name, content) {
        checkParam(type, 'type', String);
        checkParam(name, 'name', String);
        checkParam(content, 'content', String);

        content = Buffer.from(content, 'utf8').toString('base64');
        
        return this.deployer.setFile(this.deployer.getPath('templates/' + type, name), content);
    }
   
    /**
     * Removes a Template by name
     *
     * @param {String} type
     * @param {String} name
     *
     * @returns {Promise} Result
     */
    removeTemplate(type, name) {
        checkParam(type, 'type', String);
        checkParam(name, 'name', String);

        return this.deployer.removeFile(this.deployer.getPath('templates/' + type, name));
    }
    
    /**
     * Gets a list of Media nodes
     *
     * @returns {Promise} Media
     */
    getAllMedia() {
        return this.deployer.getFolder(this.deployer.getPath('media'), 1)
        .then((folders) => {
            if(!folders) { return Promise.resolve([]); }

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
                    url: this.deployer.getPath('media', id + '/' + name),
                    name: name
                });

                allMedia.push(media);
            }

            return Promise.resolve(allMedia);
        });
    }
    
    /**
     * Gets a Media node by id
     *
     * @param {String} id
     *
     * @returns {Promise} Media node
     */
    getMedia(id) {
        checkParam(id, 'id', String);

        return this.deployer.getFolder(this.deployer.getPath('media', id), 1)
        .then((files) => {
            if(!files || files.length < 1) { return Promise.reject(new Error('Media "' + id + '" not found')); }

            let file = Array.isArray(files) ? files[0] : files;

            let name = file.name || file.filename || file.url || file.path;
            
            if(!name && typeof file === 'string') {
                name = file;
            }

            name = Path.basename(name);

            return Promise.resolve(new HashBrown.Models.Media({
                id: id,
                name: name,
                url: file.url,
                path: file.path || file
            }));
        });
    }
    
    /**
     * Sets a Media node by id
     *
     * @param {String} id
     * @param {String} name
     * @param {String} base64
     *
     * @returns {Promise} Media node
     */
    setMedia(id, name, base64) {
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);
        checkParam(base64, 'base64', String);
        
        return this.removeMedia(id)
        .catch((e) => {
            // It doesn't matter if the file was not found, we don't want it there anyway
            return Promise.resolve();
        })
        .then(() => {
            return this.deployer.setFile(this.deployer.getPath('media', id + '/' + name), base64);
        });
    }
    
    /**
     * Removes a Media node by id
     *
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    removeMedia(id) {
        checkParam(id, 'id', String);

        return this.deployer.removeFolder(this.deployer.getPath('media', id));
    }
}

module.exports = Connection;
