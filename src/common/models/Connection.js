'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Connection types
 */
class Connection extends Entity {
    constructor(params) {
        super(params);
        
        if(!this.url) {
            this.url = this.getRemoteUrl();
        }
    }

    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'type');
        this.def(String, 'url');
        
        // Sync
        this.def(Boolean, 'locked');
        this.def(Boolean, 'remote');
        this.def(Boolean, 'local');
        
        // Extensible settings
        this.def(Object, 'settings', {});
    }

    /**
     * Creates a new Connection object
     *
     * @return {Connection} connection
     */
    static create() {
        let connection = new Connection({
            id: Entity.createId(),
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
     * @returns {Promise(Array)} media
     */
    setMedia(id, file) {
        return Promise.resolve();
    }
    
    /**
     * Removes media
     *
     * @param {String} id
     *
     * @returns {Promise(Array)} media
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
            return LanguageHelper.getSelectedLanguages(project);
        })
        .then((languages) => {
            function next(i) {
                let language = languages[i];

                return connection.deleteContentProperties(content.id, language)
                .then(() => {
                    i++;

                    if(i < languages.length) {
                        return next(i);
                    
                    } else {
                        debug.log('Unpublished all localised property sets successfully!', connection);
                           
                        return Promise.resolve();
                    
                    }
                });
            }

            return next(0);
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
        
        return ContentHelper.updateContent(project, environment, content)
        .then(() => {
            return LanguageHelper.getSelectedLanguages(project);
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
        
        return ContentHelper.updateContent(project, environment, content)
        .then(() => {
            return LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
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
            return LanguageHelper.getAllLocalizedPropertySets(project, environment, content);
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
        return Promise.callback();
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
        return Promise.callback();
    }
}

module.exports = Connection;
