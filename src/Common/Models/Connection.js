'use strict';

const Path = require('path');

const Processor = require('./Processor');
const Deployer = require('./Deployer');
const Resource = require('./Resource');

/**
 * The base class for all Connection types
 *
 * @memberof HashBrown.Common.Models
 */
class Connection extends Resource {
    /**
     * Constructor
     */
    constructor(params) {
        super(Connection.paramsCheck(params));
    }

    /**
     * Structure
     */
    structure() {
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'url');
        this.def(Boolean, 'useLocal');
        this.def(Boolean, 'isLocked');

        this.def(Processor, 'processor');
        this.def(Deployer, 'deployer');
        
        // Sync
        this.def(Object, 'sync');
    }

    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        // Backwards compatibility: Convert from old structure
        if(params.type) {
            params = this.getPresetSettings(params.type.toLowerCase().replace(/ /g, '-'), params.settings);
        }

        // Paths
        if(!params.paths) { params.paths = {}; }
        if(!params.paths.templates) { params.paths.templates = {}; }
        
        // Processor
        if(!params.processor) { params.processor = {}; )
        
        if(params.processor instanceof Processor === false) {
            params.processor = HashBrown.Helpers.ConnectionHelper.getProcessor(params.processor.type); 
        }

        // Deployer
        if(!params.deployer) { params.deployer = {}; )
        
        if(params.deployer instanceof Deployer === false) {
            params.deployer = HashBrown.Helpers.ConnectionHelper.getDeployer(params.deployer.type); 
        }

        return super.paramsCheck(params);
    }

    /**
     * Gets preset settings
     *
     * @param {String} preset
     * @param {Object} oldSettings
     */
    static getPresetSettings(preset, oldSettings) {
        oldSettings = oldSettings || {};

        let settings;

        switch(preset) {
            case 'github-pages':
                settings = {
                    useLocal: oldSettings.isLocal || false,
                    url: oldSettings.url || '',
                    processor: {
                        type: 'Jekyll'
                    },
                    deployer: {
                        type: 'GitHub',
                        token: oldSettings.token || '',
                        org: oldSettings.org || '',
                        repo: oldSettings.repo || '',
                        branch: oldSettings.branch || '',
                    },
                    paths: {
                        templates: {
                            partial: '/_includes/partials/',
                            page: '/_layouts/'
                        },
                        content: '/content/',
                        media: '/media/'
                    }
                };
                break;

            case 'hashbrown-driver':
                settings = {
                    url: oldSettings.url || '',
                    processor: {
                        type: 'json'
                    },
                    deployer: {
                        type: 'api',
                        token: oldSettings.token || ''
                    },
                    paths: {
                        templates: {
                            partial: '/hashbrown/api/templates/partial/',
                            page: '/hashbrown/api/templates/page/'
                        },
                        content: '/hashbrown/api/content/',
                        media: '/hashbrown/api/media/'
                    }
                };
                break;
        }

        return settings;
    }

    /**
     * Creates a new Connection object
     *
     * @return {Connection} connection
     */
    static create() {
        return new Connection({
            id: Connection.createId(),
            title: 'New connection'
        });
    }

    /**
     * Gets the remote URL
     *
     * @param {Boolean} withSlash
     *
     * @returns {String} URL
     */
    getRemoteUrl(withSlash = false) {
        let url = this.url;

        if(!withSlash && url[url.length - 1] == '/') {
            url = url.substring(0, url.length - 1);

        } else if(withSlash && url[url.length - 1] != '/') {
            url += '/';
        
        }

        return url;
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
    unpublishContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content')
    ) {
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
                    debug.log('Unpublished all localised property sets successfully!', connection);
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
    removePreview(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content')
    ) {
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
    generatePreview(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content'),
        language = requiredParam('language')
    ) {
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
    publishContent(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        content = requiredParam('content')
    ) {
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
     * @param {String} language
     * @param {Content} content
     *
     * @returns {Promise} Result
     */
    setContent(id, language, content) {
        return this.processor.process(content, language)
        .then((result) => {
            // Convert to base64
            if(result.lastIndexOf('=') === result.length - 1) {
                result = new Buffer(result, 'base64').toString();
            }

            return this.deployer.setFile(this.deployer.getPath('content') + language + '/' + id, result);
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
        return this.deployer.removeFile(this.deployer.getPath('content') + language + '/' + id, result);
    }
    
    /**
     * Gets a list of Templates
     *
     * @param {String} type
     *
     * @returns {Promise} Templates
     */
    getAllTemplates(type) {
        return this.deployer.getFolder(this.deployer.getPath('templates/' + type))
        .then((files) => {
            if(!files) { return Promise.resolve([]); }

            let allTemplates = [];

            for(let file of files) {
                let name = Path.basename(file.path || file);
                
                let template = new HashBrown.Models.Template({
                    name: name,
                    type: type,
                    remotePath: this.paths.templates[type] + name,
                    isRemote: this.useLocal !== true
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
        return this.deployer.getFile(this.deployer.getPath('templates/' + type) + name)
        .then((file) => {
            if(!file) { return Promise.reject(new Error('Template "' + name + '" not found')); }

            let name = Path.basename(file.path || file);
            
            return Promise.resolve(new HashBrown.Models.Template({
                name: name,
                type: type,
                url: (this.useLocal ? this.localRoot : this.remoteRoot) + this.paths.templates[type] + name
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
        return this.deployer.setFile(this.deployer.getPath('templates/' + type) + name, content);
    }
   
    /**
     * Removes a Template by name
     *
     * @param {String} name
     *
     * @returns {Promise} Result
     */
    removeTemplate(id) {
        return this.deployer.removeFile(this.deployer.getPath('templates/' + type) + name, content);
    }
    
    /**
     * Gets a list of Media nodes
     *
     * @returns {Promise} Media
     */
    getAllMedia() {
        return this.deployer.getFolder(this.deployer.getPath('media'))
        .then((folders) => {
            if(!folders) { return Promise.resolve([]); }

            let allMedia = [];

            for(let folder of folders) {
                let name = Path.basename(folder.path || folder);
                
                let media = new HashBrown.Models.Media({
                    id: name
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
        return this.deployer.getFolder(this.deployer.getPath('media') + id)
        .then((files) => {
            if(!files || files.length < 1) { return Promise.reject(new Error('Media "' + id + '" not found')); }

            let file = files[0];
            let name = Path.basename(file.path || file);
            
            return Promise.resolve(new HashBrown.Models.Media({
                id: id,
                name: name
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
        return this.deployer.setFile(this.deployer.getPath('media') + name, content);
    }
    
    /**
     * Removes a Media node by id
     *
     * @param {String} id
     *
     * @returns {Promise} Result
     */
    removeMedia(id) {
        return this.deployer.removeFolder(this.deployer.getPath('media') + id, content);
    }
}

module.exports = Connection;
