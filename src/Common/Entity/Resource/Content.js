'use strict';

/**
 * The base class for all Content types
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class Content extends HashBrown.Entity.Resource.ResourceBase {
    get icon() { return this.schema ? this.schema.icon : super.icon; }

    /**
     * Gets the human readable name
     *
     * @return {String} 
     */
    getName() {
        return this.id;
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        // Fundamental fields
        this.def(String, 'parentId');
        this.def(String, 'schemaId');
        this.def(Number, 'sort', -1);
        
        // Publishing
        this.def(Date, 'publishOn');
        this.def(Date, 'unpublishOn');
        this.def(Boolean, 'isPublished');

        // Extensible properties
        this.def(Object, 'properties', {});
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

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

        super.adopt(params);
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
     * Gets all meta fields
     *
     * @returns {Object} Meta
     */
    getMeta() {
        return {
            id: this.id,
            parentId: this.parentId,
            schemaId: this.schemaId,
            createdOn: this.createdOn,
            updatedOn: this.updatedOn,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            sort: this.sort
        };
    }

    /**
     * Shorthand to get property value
     *
     * @param {String} key
     * @param {String} locale
     *
     * @returns {Object} value
     */
    prop(key, locale) {
        return this.getPropertyValue(key, locale);
    }

    /**
     * Gets a property value
     *
     * @param {String} key
     * @param {String} locale
     *
     * @returns {*} value
     */
    getPropertyValue(key, locale) {
        checkParam(key, 'key', String, true);
        checkParam(locale, 'locale', String);
        
        if(!this.properties) {
            this.properties = {};
        }

        if(locale && typeof this.properties[key] === 'object') {
            return this.properties[key][locale];
        
        } else {
            return this.properties[key];
        
        }
    }
    
    /**
     * Sets a property value
     *
     * @param {String} key
     * @param {String|Number|Object} value
     * @param {String} locale
     */
    setPropertyValue(key, value, locale) {
        if(!this.properties) {
            this.properties = {};
        }

        if(locale && typeof this.properties[key] === 'object') {
            this.properties[key][locale] = value;
        
        } else {
            this.properties[key] = value;
        
        }
    }

    /**
     * Returns all properties in a given locale
     *
     * @param {String} locale
     *
     * @returns {Object} properties
     */
    getLocalizedProperties(locale) {
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
                    // If localized flag is set, assign value directly
                    if(value._localized) {
                        if(typeof value[locale] === 'undefined') {
                            value[locale] = null;
                        }

                        target[key] = value[locale];

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
