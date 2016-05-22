'use strict';

let crypto = require('crypto');

let Promise = require('bluebird');
let ContentHelper = require('../../server/helpers/ContentHelper');
let Validator = require('jsonschema').Validator;

/**
 * The base class for all Content types
 */
class Content {
    constructor(properties) {
        this.properties = properties;
    
        this.sanityCheck();
    }

    /**
     * Performs a sanity check on the model data
     */
    sanityCheck() {
        if(!this.properties.settings) {
            this.properties.settings = {};
        }
        
        if(!this.properties.settings.publishing) {
            this.properties.settings.publishing = {};
        }
        
        if(!this.properties.settings.publishing.connections) {        
            this.properties.settings.publishing.connections = [];
        }
    }

    /**
     * Creates a new Content object
     *
     * @param {Object} data
     *
     * @returns {Object} content
     */
    static create(data, language) {
        let content = new Content(data || {});
        
        content.properties.id = crypto.randomBytes(20).toString('hex');
        content.properties.createDate = Date.now();
        content.properties.updateDate = Date.now();
        content.properties.schemaId = content.properties.schemaId || 'contentBase';

        content.properties.title = 'New content';

        return content;
    }

    /**
     * Finds a Content object
     *
     * @param {String} id
     *
     * @returns {Content} content
     */
    static find(id) {
        return new Promise((callback) => {
            // We're in client mode
            if(window && window.resources && window.resources.content) {
                for(let node of window.resources.content) {
                    if(node.id == id) {
                        callback(new Content(node));
                        return;
                    }
                }
            
            // We're in server mode
            } else {
                ContentHelper.getContentById(id)
                .then((node) => {
                    callback(new Content(node));
                });
                return;

            }
                
            // No node found
            callback(null);
        });
    }

    /**
     * Gets all parents
     *
     * @returns {Promise} parents
     */
    getParents() {
        return new Promise((callback) => {
            let parents = [];

            function iterate(content) {
                if(content.properties.parentId) {
                    Content.find(content.properties.parentId)
                    .then((parentContent) => {
                        if(parentContent) {
                            parents.push(parentContent);
                            iterate(parentContent);
                        } else {
                            console.log('[Content] Parent content with id "' + content.properties.parentId + '" was not found');

                            callback(parents);
                        }
                    });

                } else {
                    callback(parents);
                }
            }

            iterate(this);
        });
    }

    /**
     * Gets a settings
     *
     * @param {String} key
     *
     * @returns {Promise} settings
     */
    getSettings(key) {
        let model = this;
        
        return new Promise((callback) => {
            // Loop through all parent content to find a governing setting
            model.getParents()
            .then((parents) => {
                for(let parentContent of parents) {
                    if(
                        parentContent.properties.settings &&
                        parentContent.properties.settings[key] &&
                        parentContent.properties.settings[key].applyToChildren
                    ) {
                        let settings = parentContent.properties.settings[key];
                        settings.governedBy = parentContent;

                        callback(settings);
                        return;
                    }
                }

                // No parent nodes with governing settings found, return own settings
                if(!model.properties.settings) {
                    model.properties.settings = {};
                }

                if(!model.properties.settings[key]) {
                    model.properties.settings[key] = {};
                }

                callback(model.properties.settings[key]);
            });
        });
    }

    /**
     * Shorthand to get property value
     *
     * @param {String} key
     * @param {String} language
     *
     * @returns {Object} value
     */
    prop(key, language) {
        return this.getPropertyValue(key, language);
    }

    /**
     * Gets a property value
     *
     * @param {String} key
     * @param {String} language
     *
     * @returns {Object} value
     */
    getPropertyValue(key, language) {
        if(language) {
            return this.properties[key] ? this.properties[key][language] : null;
        } else {
            return this.properties[key];
        }
    }

    /**
     * Gets the content type
     *
     * @returns {String} type
     */
    getType() {
        return this.constructor.name;
    }

    /**
     * Gets the schema information
     *
     * @returns {Promise} promise
     */
    getSchema() {
        let model = this;

        return new Promise(function(callback) {
            if(!view.schemaCache) {
                ContentHelper.getSchema(view.getType(), model.properties.schemaId)
                .then(function(schema) {
                    model.schemaCache = schema;

                    callback(model.schemaCache);
                });
            } else {
                callback(model.schemaCache);
            }
        });
    }

    /**
     * Gets the published state
     *
     * @returns {Boolean} state
     */
    isPublished() {
        let unpublishDateIsNull = this.properties.unpublishDate == null || typeof this.properties.unpublishDate == 'undefined';
        let unpublishDateHasPassed = this.properties.unpublishDate < Date.now()

        // Get the state
        return unpublishDateIsNull || unpublishDateHasPassed;
    }

    /**
     * Validates the model based on the schema
     *
     * @returns {Promise} promise
     */
    validateModel() {
        return new Promise(function(callback) {
            this.getSchema()
            .then(function(schema) {
                let validator = new Validator();

                let result = validator.validate(this.properties, schema);

                console.log(result);
            });
        });
    }    
}

module.exports = Content;
