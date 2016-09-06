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
        this.def(String, 'createdBy');
        this.def(String, 'updatedBy');
        this.def(Date, 'createDate');
        this.def(Date, 'updateDate');
        this.def(String, 'schemaId');
        this.def(Boolean, 'unpublished');
        this.def(Number, 'sort', -1);

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
     * @param {String} schemaId
     * @param {Object} properties
     *
     * @returns {Content} New Content object
     */
    static create(schemaId, properties) {
        if(typeof schemaId !== 'string') {
            debug.error('Schema ID was not provided', this);
            return;
        }

        let defaultProperties = {
            title: 'New content'
        };

        let content = new Content({
            id: Entity.createId(),
            createDate: new Date(),
            updateDate: new Date(),
            schemaId: schemaId,
            properties: properties || defaultProperties
        });

        return content;
    }

    /**
     * Gets all parents
     *
     * @returns {Promise} parents
     */
    getParents() {
        return new Promise((resolve, reject) => {
            let parents = [];

            function iterate(content) {
                if(content.parentId) {
                    ContentHelper.getContentById(content.parentId)
                    .then((parentContent) => {
                        if(parentContent) {
                            parents.push(parentContent);
                            iterate(parentContent);
                        
                        } else {
                            reject(new Error('Parent content with id "' + content.parentId + '" was not found'));
                        
                        }
                    })
                    .catch(reject);

                } else {
                    resolve(parents);
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
        
        return new Promise((resolve, reject) => {
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

                        resolve(settings);
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

                // Special cases
                switch(key) {
                    case 'publishing':
                        model.settings.publishing.connections = model.settings.publishing.connections || [];
                        break;
                }

                resolve(model.settings[key]);
            })
            .catch((e) => {
                // Parent id was specified, but node did not exist
                // This error is not fatal, but should be reported
                debug.warning(e.message, this);
                
                // Return own settings
                if(!model.settings) {
                    model.settings = {};
                }

                if(!model.settings[key]) {
                    model.settings[key] = {};
                }

                resolve(model.settings);
            });
        });
    }

    /**
     * Gets all meta fields
     *
     * @returns {Object} meta
     */
    getMeta() {
        return {
            parentId: this.parentId,
            createDate: this.createDate,
            updateDate: this.updateDate,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy
        };
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
    getLocalizedProperties(language) {
        let properties = {};

        function flattenRecursively(source, target) {
            // Loop through all keys
            for(let key in source) {
                let value = source[key];

                // If the value is an object type, examine it further
                if(value && typeof value === 'object') {
                    // If multilingual flag is set, assign value directly
                    if(value._multilingual) {
                        if(typeof value[language] === 'undefined') {
                            value[language] = null;
                        }

                        target[key] = value[language];

                    // If not, recurse into the object
                    } else {
                        // If this value was created with the ArrayEditor, filter out schema
                        // bindings by assigning the "items" value to the value variable
                        if(
                            value instanceof Object &&
                            value.items && Array.isArray(value.items) &&
                            value.schemaBindings && Array.isArray(value.schemaBindings)
                        ) {
                            value = value.items;
                        }

                        // Prepare target data type for either Object or Array
                        if(Array.isArray(value)) {
                            target[key] = [];
                        } else {
                            target[key] = {};
                        }

                        flattenRecursively(value, target[key]);

                    }
                
                // If not, just return the localised value
                } else {
                    target[key] = value;

                }
            }
        }

        flattenRecursively(this.properties, properties);

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
     * @returns {Promise(Schema)} promise
     */
    getSchema() {
        return new Promise((callback) => {
            callback(null);
        });
    }
}

module.exports = Content;
