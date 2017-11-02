'use strict';

const Resource = require('./Resource');

/**
 * The base class for all Connection types
 *
 * @memberof HashBrown.Common.Models
 */
class Connection extends Resource {
    constructor(params) {
        super(Connection.paramsCheck(params));
    }

    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'url');
        this.def(Boolean, 'isLocked');
        
        // Sync
        this.def(Object, 'sync');
        
        // Extensible settings
        this.def(Object, 'settings', {
            deployment: {},
            processing: {}
        });
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
            params.settings = this.getPresetSettings(params.type.toLowerCase().replace(/ /g, '-'), params.settings, params.settings);

            delete params.type;
        }

        // Settings
        if(!params.settings) { params.settings = {}; }
        if(!params.settings.processing) { params.settings.processing = {}; }
        if(!params.settings.deployment) { params.settings.deployment = {}; }

        return super.paramsCheck(params);
    }

    /**
     * Gets preset settings
     *
     * @param {String} preset
     * @param {Object} processingSettings
     * @param {Object} deploymentSettings
     */
    static getPresetSettings(preset, processingSettings, deploymentSettings) {
        processingSettings = processingSettings || {};
        deploymentSettings = deploymentSettings || {};

        let settings;

        switch(preset) {
            case 'github-pages':
                settings = {
                    processing: {
                        type: 'jekyll'
                    },
                    deployment: {
                        type: 'github',
                        partialTemplatesFolder: '/_includes/partials/',
                        pageTemplatesFolder: '/_layouts/',
                        token: deploymentSettings.token || '',
                        org: deploymentSettings.org || '',
                        repo: deploymentSettings.repo || '',
                        branch: deploymentSettings.branch || '',
                        isLocal: deploymentSettings.isLocal || false,
                        localPath: deploymentSettings.localPath || ''
                    }
                };
                break;

            case 'hashbrown-driver':
                settings = {
                    processing: {
                        type: 'json',
                        mode: 'segmented'
                    },
                    deployment: {
                        type: 'hashbrown-driver',
                        token: deploymentSettings.token || ''
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
        let connection = new Connection({
            id: Connection.createId(),
            title: 'New connection',
            settings: {}
        });
        
        return connection;
    }

    /**
     * Gets templates
     *
     * @returns {Promise} Array of Templates
     */
    getTemplates() {
        return Promise.resolve([]);
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
     * Gets whether this connection is serving local content
     *
     * @returns {Boolean} Is local
     */
    isLocal() {
        return false;
    }

    /**
     * Gets the media path
     *
     * @returns {String} path
     */
    getMediaPath() {
        return '';
    }

    /**
     * Gets all Media objects
     *
     * @returns {Promise(Array)} media
     */
    getAllMedia() {
        return Promise.resolve([]);
    }
    
    /**
     * Gets a Media object
     *
     * @param {String} id
     *
     * @returns {Promise(Media)} media
     */
    getMedia(id) {
        return Promise.resolve(null);
    }
    
    /**
     * Sets media
     *
     * @param {String} id
     * @param {Object} file
     *
     * @returns {Promise} Array of Media
     */
    setMedia(id, file) {
        return Promise.resolve();
    }
    
    /**
     * Sets template by id
     *
     * @param {String} type
     * @param {String} id
     * @param {Template} newTemplate
     *
     * @returns {Promise}
     */
    setTemplateById(type, id, newTemplate) {
        return Promise.resolve();
    }
    
    /**
     * Removes media
     *
     * @param {String} id
     *
     * @returns {Promise} Array of Media items
     */
    removeMedia(id) {
        return Promise.resolve();
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
        let connection = this;

        debug.log('Unpublishing all localised property sets...', this);
        
        return connection.removePreview(project, environment, content)
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

                return connection.deleteContentProperties(content.id, language)
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

                return this.deleteContentProperties(content.id + '_preview', language)
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
            return HashBrown.Helpers.LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
        })
        .then((sets) => {
            let properties = sets[language];

            let url = '/preview/' + content.id;
            
            properties.url = url;

            return this.postContentProperties(properties, content.id + '_preview', language, content.getMeta())
            .then(() => {
                return Promise.resolve(this.url + url);
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
        let connection = this;

        debug.log('Publishing all localised property sets...', this);

        return connection.removePreview(project, environment, content)
        .then(() => {
            return HashBrown.Helpers.LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
        })
        .then((sets) => {
            let languages = Object.keys(sets);
            
            function next(i) {
                let language = languages[i];
                let properties = sets[language];

                return connection.postContentProperties(properties, content.id, language, content.getMeta())
                .then(() => {
                    i++;

                    if(i < languages.length) {
                        return next(i);
                    
                    } else {
                        debug.log('Published all localised property sets successfully!', connection);
                            
                        return Promise.resolve();
                    
                    }
                })
            }

            return next(0);
        });
    }
    
    /**
     * Deletes content properties from the remote target
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} promise
     */
    deleteContentProperties(id, language) {
        return Promise.resolve();
    }

    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties, id, language) {
        return Promise.resolve();
    }
}

module.exports = Connection;
