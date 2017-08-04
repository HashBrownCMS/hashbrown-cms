'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Content types
 *
 * @memberof HashBrown.Common.Models
 */
class Content extends Entity {
    constructor(params) {
        super(Content.paramsCheck(params)); 
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
                connections: []
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
        params = params || {};

        // Convert from old "unpublished" state
        if(typeof params.unpublished !== 'undefined') {
            params.isPublished = !params.unpublished;
            delete params.published;
        }

        // Convert from old sync variables
        params.sync = params.sync || {};

        if(typeof params.local !== 'undefined') {
            params.sync.isLocal = params.local;
            delete params.local;
        }

        if(typeof params.remote !== 'undefined') {
            params.sync.isRemote = params.remote;
            delete params.remote;
        }

        // Convert from old "locked" state
        if(typeof params.locked !== 'undefined') {
            params.isLocked = params.locked;
            delete params.locked;
        }

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
            return HashBrown.Helpers.ContentHelper.getContentById(project, environment, this.parentId)
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
        this.settingsSanityCheck(key);

        // Loop through all parent content to find a governing setting
        return this.getParents(project, environment)
        .then((parents) => {
            for(let parentContent of parents) {
                if(parentContent.settingsApplyToChildren(key)) {
                    let settings = parentContent.settings[key];

                    // Make clone as to avoid interference with inherent values
                    settings = JSON.parse(JSON.stringify(settings));
                    settings.governedBy = parentContent.id;

                    return Promise.resolve(settings);
                }
            }

            // No parent nodes with governing settings found, return own settings
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
                        // If this value was created with the ArrayEditor, filter out Schema ids
                        // by assigning the "value" of each item directly to the array
                        if(Array.isArray(value)) {
                            for(let i in value) {
                                if(!value[i].value) { continue; }

                                value[i] = value[i].value;
                            }
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
     * @returns {Promise(Schema)} promise
     */
    getSchema() {
        return new Promise((callback) => {
            callback(null);
        });
    }
}

module.exports = Content;
