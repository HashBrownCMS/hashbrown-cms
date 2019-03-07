'use strict';

/**
 * The base class for all Content types
 *
 * @memberof HashBrown.Common.Models
 */
class Content extends HashBrown.Models.Resource {
    structure() {
        // Fundamental fields
        this.def(String, 'id');
        this.def(String, 'parentId');
        this.def(String, 'createdBy');
        this.def(String, 'updatedBy');
        this.def(Date, 'createDate');
        this.def(Date, 'updateDate');
        this.def(String, 'schemaId');
        this.def(Number, 'sort', -1);
        this.def(Boolean, 'isLocked');
        
        // Publishing
        this.def(Date, 'publishOn');
        this.def(Date, 'unpublishOn');
        this.def(Boolean, 'isPublished');
        this.def(Boolean, 'hasPreview');

        // Sync
        this.def(Object, 'sync');

        // Extensible properties
        this.def(Object, 'properties', {});

        // Settings
        this.def(Object, 'settings', {
            publishing: {
                connectionId: ''
            }
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
        params = super.paramsCheck(params);

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

        return params;
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
            throw new Error('Schema ID was not provided');
        }

        let defaultProperties = {
            title: 'New content'
        };

        let content = new Content({
            id: Content.createId(),
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
        if(!tasks) { return; }
        
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

    /**
     * Gets parent Content
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Parent
     */
    getParent(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        if(!this.parentId) {
            return Promise.resolve(null);
        }
        
        return HashBrown.Helpers.ContentHelper.getContentById(project, environment, this.parentId)
        .then((parentContent) => {
            return Promise.resolve(parentContent);
        })
        .catch((e) => {
            return Promise.resolve(null);
        });
    }

    /**
     * Gets all parents
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} parents
     */
    getParents(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

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
     * Settings sanity check
     *
     * @param {String} key
     */
    settingsSanityCheck(key) {
        this.settings = this.settings || {};

        if(key) {
            this.settings[key] = this.settings[key] || {};
        }

        this.settings.publishing = this.settings.publishing || {};

        if(Array.isArray(this.settings.publishing.connections)) {
            this.settings.publishing.connectionId = this.settings.publishing.connections[0];
            delete this.settings.publishing.connections;
        }
    }

    /**
     * Gets settings
     *
     * @param {String} key
     *
     * @returns {Promise} Settings
     */
    getSettings(key) {
        return Promise.resolve({});
    }

    /**
     * Gets all meta fields
     *
     * @returns {Object} Meta
     */
    getMeta() {
        return {
            id: this.id,
            parentId: this.parentId,
            schemaId: this.schemaId,
            createDate: this.createDate,
            updateDate: this.updateDate,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            sort: this.sort
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
     * Sets a property value
     *
     * @param {String} key
     * @param {String|Number|Object} value
     * @param {String} language
     */
    setPropertyValue(key, value, language) {
        if(!this.properties) {
            this.properties = {};
        }

        if(language && typeof this.properties[key] === 'object') {
            this.properties[key][language] = value;
        
        } else {
            this.properties[key] = value;
        
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
        // Create references
        // NOTE: We're cloning the "properties" value to avoid destroying the structure
        let localizedProperties = {};
        let allProperties = JSON.parse(JSON.stringify(this.properties));

        // Flatten properties recursively
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

        flattenRecursively(allProperties, localizedProperties);

        return localizedProperties;
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
     * @returns {Promise} Schema
     */
    getSchema() {
        return Promise.resolve();
    }
}

module.exports = Content;
