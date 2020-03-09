'use strict';

/**
 * The base class for all Content types
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Content extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'content'; }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        // Fundamental fields
        this.def(String, 'parentId');
        this.def(String, 'schemaId');
        this.def(HashBrown.Entity.Resource.Schema, 'schema');
        this.def(Number, 'sort', -1);
        
        // Publishing
        this.def(Date, 'publishOn');
        this.def(Date, 'unpublishOn');
        this.def(Boolean, 'isPublished');

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

        if(params.createDate) {
            params.createdOn = params.createDate;
            delete params.createDate;
        }
        
        if(params.updateDate) {
            params.updatedOn = params.updatedDate;
            delete params.updateDate;
        }

        params.createdOn = parseDate(params.createdOn);
        params.updatedOn = parseDate(params.updatedOn);

        return params;
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
     * @returns {HashBrown.Entity.Resource.Content} Parent
     */
    async getParent() {
        throw new Error('Method "getParent" must be overridden');
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
            createdOn: this.createDate,
            updatedOn: this.updateDate,
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
     * @returns {*} value
     */
    getPropertyValue(key, language) {
        checkParam(key, 'key', String, true);
        checkParam(language, 'language', String);
        
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
}

module.exports = Content;
