'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Content types
 */
class Content extends Entity {
    constructor(params) {
        params = params || {};

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
        this.def(Boolean, 'locked');
        this.def(Boolean, 'local');
        this.def(Boolean, 'remote');
        this.def(String, 'id');
        this.def(String, 'parentId');
        this.def(String, 'createdBy');
        this.def(String, 'updatedBy');
        this.def(Date, 'createDate');
        this.def(Date, 'updateDate');
        this.def(Date, 'publishOn');
        this.def(Date, 'unpublishOn');
        this.def(String, 'schemaId');
        this.def(Boolean, 'isPublished');
        this.def(Boolean, 'hasPreview');
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
     * Adopts a list of tasks, turning them into un/publish dates
     *
     * @param {Array} tasks
     */
    adoptTasks(tasks) {
        if(tasks) {
            for(let i in tasks) {
                switch(tasks[i].type) {
                    case 'publish':
                        this.publishOn = tasks[i].date;
                        break;

                    case 'unpublish':
                        this.unpublishOn = tasks[i].date;
                        break;
                }
            }
        }
    }

    /**
     * Gets parent Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Parent
     */
    getParent(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        if(this.parentId) {
            return ContentHelper.getContentById(project, environment, this.parentId)
            .then((parentContent) => {
                return Promise.resolve(parentContent);
            })
            .catch((e) => {
                return Promise.resolve(null);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * Gets all parents
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} parents
     */
    getParents(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let parents = [];

        let getNextParent = (content) => {
            return content.getParent(project, environment)
            .then((parentContent) => {
                if(parentContent) {
                    parents.push(parentContent);

                    return getNextParent(parentContent);
                
                } else {
                    return Promise.resolve(parents);
                
                }
            });
        }

        return getNextParent(this);
    }

    /**
     * Gets settings
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} key
     *
     * @returns {Promise} settings
     */
    getSettings(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        key = requiredParam('key')
    ) {
        // Loop through all parent content to find a governing setting
        return this.getParents(project, environment)
        .then((parents) => {
            for(let parentContent of parents) {
                if(
                    parentContent.settings &&
                    parentContent.settings[key] &&
                    parentContent.settings[key].applyToChildren
                ) {
                    let settings = parentContent.settings[key];

                    // Make clone as to avoid interference with inherent values
                    settings = JSON.parse(JSON.stringify(settings));

                    settings.governedBy = parentContent;

                    return Promise.resolve(settings);
                }
            }

            // No parent nodes with governing settings found, return own settings
            if(!this.settings) {
                this.settings = {};
            }

            if(!this.settings[key]) {
                this.settings[key] = {};
            }

            // Special cases
            switch(key) {
                case 'publishing':
                    this.settings.publishing.connections = this.settings.publishing.connections || [];
                    break;
            }

            return Promise.resolve(this.settings[key]);
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
