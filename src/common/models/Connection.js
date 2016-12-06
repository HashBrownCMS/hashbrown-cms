'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Connection types
 */
class Connection extends Entity {
    constructor(params) {
        params.provideTemplates = params.provideTemplates == 'true' || params.provideTemplates == true || false;

        super(params);
        
        if(!this.url) {
            this.url = this.getRemoteUrl();
        }
    }

    structure() {
        // Fundamental fields
        this.def(Boolean, 'locked');
        this.def(Boolean, 'remote');
        this.def(Boolean, 'local');
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'type');
        this.def(String, 'url');
        this.def(Boolean, 'provideTemplates');
        this.def(Boolean, 'provideMedia');
        
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
     * @returns {Promise(Array)} templates
     */
    getTemplates() {
        return Promise.resolve([]);
    }

    /**
     * Gets section templates
     *
     * @returns {Promise(Array)} sectionTemplates
     */
    getSectionTemplates() {
        return Promise.resolve([]);
    }

    /**
     * Gets the remote URL
     *
     * @returns {String} URL
     */
    getRemoteUrl() {
        return this.url;
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
     * @param {String} id
     */
    unpublishContent(id) {
        let connection = this;

        debug.log('Unpublishing all localised property sets...', this);

        return LanguageHelper.getSelectedLanguages()
        .then((languages) => {
            function next(i) {
                let language = languages[i];

                return connection.deleteContentProperties(id, language)
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
     * Publishes content
     *
     * @param {Content} content
     *
     * @returns {Promise} promise
     */
    publishContent(content) {
        let connection = this;

        debug.log('Publishing all localised property sets...', this);

        return LanguageHelper.getAllLocalizedPropertySets(content)
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
