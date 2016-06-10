'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Content types
 */
class Content extends Entity {
    constructor(params) {
        // Ensure correct type for dates
        function parseDate(input) {
            let result;

            if(typeof input === 'string' && !isNaN(input)) {
                result = new Date(parseInt(input));
            } else {
                result = new Date(input);
            }

            return result;
        }

        params.createDate = parseDate(params.createDate);
        params.updateDate = parseDate(params.updateDate);

        super(params); 
    }
    
    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'parentId');
        this.def(Date, 'createDate');
        this.def(Date, 'updateDate');
        this.def(String, 'schemaId');

        // Extensible properties
        this.def(Object, 'properties', {});

        // Settings
        this.def(Object, 'settings', {
            publishing: {
                connections: []
            }
        }); 
    }

    /**
     * Creates a new Content object
     *
     * @param {Object} properties
     *
     * @returns {Object} content
     */
    static create(properties) {
        let content = new Content({
            id: Entity.createId(),
            createDate: new Date(),
            updateDate: new Date(),
            schemaId: 'contentBase',
            properties: properties
        });

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
                if(content.parentId) {
                    Content.find(content.parentId)
                    .then((parentContent) => {
                        if(parentContent) {
                            parents.push(parentContent);
                            iterate(parentContent);
                        } else {
                            console.log('[Content] Parent content with id "' + content.parentId + '" was not found');

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
                        parentContent.settings &&
                        parentContent.settings[key] &&
                        parentContent.settings[key].applyToChildren
                    ) {
                        let settings = parentContent.settings[key];
                        settings.governedBy = parentContent;

                        callback(settings);
                        return;
                    }
                }

                // No parent nodes with governing settings found, return own settings
                if(!model.settings) {
                    model.settings = {};
                }

                if(!model.settings[key]) {
                    model.settings[key] = {};
                }

                callback(model.settings[key]);
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
        if(!this.properties) {
            this.properties = {};
        }

        if(language && typeof this.properties[key] === 'object') {
            return this.properties[key][language];
        
        } else {
            return this.properties[key];
        
        }
    }

    /**
     * Returns all properties in a given language
     *
     * @param {String} language
     *
     * @returns {Object} properties
     */
    getProperties(language) {
        let properties = {};

        for(let key in this.properties) {
            properties[key] = this.getPropertyValue(key, language);
        }

        return properties;
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
                ContentHelper.getSchema(view.getType(), model.schemaId)
                .then(function(schema) {
                    model.schemaCache = schema;

                    callback(model.schemaCache);
                });
            } else {
                callback(model.schemaCache);
            }
        });
    }
}

module.exports = Content;
