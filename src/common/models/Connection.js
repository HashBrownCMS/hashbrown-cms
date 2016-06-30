'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Connection types
 */
class Connection extends Entity {
    constructor(params) {
        params.provideTemplates = params.provideTemplates == 'true' || params.provideTemplates == true || false;

        super(params);
    }

    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'title');
        this.def(String, 'type');
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
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    /**
     * Gets section templates
     *
     * @returns {Promise(Array)} sectionTemplates
     */
    getSectionTemplates() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    /**
     * Gets all Media objects
     *
     * @returns {Promise(Array)} media
     */
    getAllMedia() {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }
    
    /**
     * Gets a Media object
     *
     * @param {String} id
     *
     * @returns {Promise(Media)} media
     */
    getMedia(id) {
        return new Promise((resolve, reject) => {
            resolve(null);
        });
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
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Removes media
     *
     * @param {String} id
     *
     * @returns {Promise(Array)} media
     */
    removeMedia(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     *  Unpublishes content
     *
     * @param {String} id
     */
    unpublishContent(id) {
        let connection = this;

        return new Promise((callback) => {
            debug.log('Unpublishing all localised property sets...', this);

            LanguageHelper.getSelectedLanguages()
            .then((languages) => {
                function next(i) {
                    let language = languages[i];

                    connection.deleteContentProperties(id, language)
                    .then(() => {
                        i++;

                        if(i < languages.length) {
                            next(i);
                        
                        } else {
                            debug.log('Unpublished all localised property sets successfully!', connection);
                                
                            callback();
                        
                        }
                    });
                }

                next(0);
            });
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

        return new Promise((callback) => {
            debug.log('Publishing all localised property sets...', this);

            LanguageHelper.getAllLocalizedPropertySets(content)
            .then((sets) => {
                let languages = Object.keys(sets);
                
                function next(i) {
                    let language = languages[i];
                    let properties = sets[language];

                    connection.postContentProperties(properties, content.id, language, content.getMeta())
                    .then(() => {
                        i++;

                        if(i < languages.length) {
                            next(i);
                        
                        } else {
                            debug.log('Published all localised property sets successfully!', connection);
                                
                            callback();
                        
                        }
                    });
                }

                next(0);
            });
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
        return new Promise((callback) => {
            callback();
        });
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
        return new Promise((callback) => {
            callback();
        });
    }
}

module.exports = Connection;
