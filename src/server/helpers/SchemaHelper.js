'use strict';

// Models
let Schema = require('../models/Schema');
let FieldSchema = require('../models/FieldSchema');
let ContentSchema = require('../models/ContentSchema');

// Helpers
let SchemaHelperCommon = require('../../common/helpers/SchemaHelper');

// Libs
let fs = require('fs');
let path = require('path');
let glob = require('glob');

class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets a list of native schema objects
     *
     * @returns {Promise} Array of Schemas
     */
    static getNativeSchemas() {
        return new Promise(function(resolve, reject) {
            if(!SchemaHelper.nativeSchemas) {
                glob(appRoot + '/src/common/schemas/*/*.schema', function(err, paths) {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        let queue = paths || [];

                        // Cache native schemas
                        SchemaHelper.nativeSchemas = {};

                        if(queue.length > 0) {
                            function readNextSchema() {
                                let schemaPath = queue[0];

                                fs.readFile(schemaPath, function(err, data) {
                                    if(err) {
                                        throw err;
                                    }

                                    let properties = JSON.parse(data);
                                    let parentDirName = path.dirname(schemaPath).replace(appRoot + '/src/common/schemas/', '');
                                    let id = path.basename(schemaPath, '.schema');

                                    // Generated values, will be overwritten every time
                                    properties.id = id;

                                    let schema;
                                    
                                    switch(parentDirName) {
                                        case 'content':
                                            schema = new ContentSchema(properties);
                                            break;
                                        case 'field':
                                            schema = new FieldSchema(properties);
                                            break;
                                    }

                                    // Make sure the 'locked' flag is true
                                    schema.locked = true;

                                    // Add the loaded schema to the output array
                                    SchemaHelper.nativeSchemas[schema.id] = schema;

                                    // Shift the queue (removes the first element of the array)
                                    queue.shift();

                                    // If the queue still has items in it, we should continue reading...
                                    if(queue.length > 0) {
                                        readNextSchema();

                                    // ...if not, we'll return all the loaded schemas
                                    } else {
                                        resolve(SchemaHelper.nativeSchemas);
                                    
                                    }
                                });
                            }

                            readNextSchema();

                        } else {
                            resolve({});

                        }
                    }
                }); 
            } else {
                resolve(SchemaHelper.nativeSchemas);

            }
        });
    }
    
    /**
     * Gets a list of all custom schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schemas
     */
    static getCustomSchemas(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.schemas';
        let result = [];
       
        return MongoHelper.find(
            project,
            collection,
            {}
        )
        .then((result) => {
            let schemas = {};

            for(let i in result) {
                let schema = SchemaHelper.getModel(result[i]);

                if(schema) {
                    schemas[schema.id] = schema;
                
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Schema data from DB is incorrect format: ' + JSON.stringify(result[i])));
                    });
                }
            }

            return SyncHelper.mergeResource(project, environment, 'schemas', schemas, { customOnly: true });
        })
        .then((schemas) => {
            // Last sanity check for site settings
            schemas.siteSettings = SchemaHelper.checkSiteSettings(schemas.siteSettings || {});

            return Promise.resolve(schemas);
        });
    }

    /**
     * Gets a list of all schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schemas
     */
    static getAllSchemas(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let nativeSchemas;
        let customSchemas;

        return SchemaHelper.getNativeSchemas()
        .then((result) => {
            nativeSchemas = result;

            return SchemaHelper.getCustomSchemas(project, environment);
        })
        .then((result) => {
            customSchemas = result;

            let allSchemas = {};
            
            for(let id in nativeSchemas) {
                allSchemas[id] = nativeSchemas[id];   
            }
            
            for(let id in customSchemas) {
                allSchemas[id] = customSchemas[id];
            }

            return Promise.resolve(allSchemas);
        });
    }

    /**
     * Checks whether a Schema id belongs to a native schema
     *
     * @param {String} id
     *
     * @returns {Boolean} isNative
     */
    static isNativeSchema(id) {
        let fieldPath = appRoot + '/src/common/schemas/field/' + id + '.schema';
        let contentPath = appRoot + '/src/common/schemas/content/' + id + '.schema';
    
        try {
            fs.statSync(fieldPath);
            return true;
        
        } catch(e) {
            try {
                fs.statSync(contentPath);
                return true;

            } catch(e) {
                return false;

            }
        }
    }

    /**
     * Gets a native Schema by id
     *
     * @param {String} id
     *
     * @returns {Promise} Schema
     */
    static getNativeSchema(id) {
        return new Promise((resolve, reject) => {
            glob(appRoot + '/src/common/schemas/*/' + id + '.schema', function(err, paths) {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    let schemaPath = paths[0];

                    fs.readFile(schemaPath, function(err, data) {
                        if(err) {
                            reject(new Error(err));
                        
                        } else {
                            let properties = JSON.parse(data);
                            let parentDirName = path.dirname(schemaPath).replace(appRoot + '/src/common/schemas/', '');
                            let id = path.basename(schemaPath, '.schema');

                            // Generated values, will be overwritten every time
                            properties.id = id;
                            properties.type = parentDirName;
                            properties.locked = true;

                            resolve(properties);
                        }
                    });
                }
            });
        });
    }

    /**
     * Gets the site settings Schema
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} ContentSchema
     */
    static getSiteSettingsSchema(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.schemas';

        // First attempt to find site settings in the database
        return MongoHelper.findOne(
            project,
            collection,
            {
                id: 'siteSettings'
            }
        ).then((schemaData) => {
            // If that fails, try to find it using the synced remote
            if(!schemaData || Object.keys(schemaData).length < 1) {
                return SyncHelper.getResourceItem(project, environment, 'schemas', 'siteSettings');
            }

            // If successful, resolve with Schema data
            return Promise.resolve(schemaData);
        })
        .catch(() => {
            // If site settings were not found on synced instance, never mind
            return Promise.resolve();
        })
        .then((schemaData) => {
            return Promise.resolve(SchemaHelper.checkSiteSettings(schemaData));
        });
    }

    /**
     * Gets a Schema by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     *
     * @return {Promise} Schema
     */
    static getSchemaById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        // Special case for the "siteSettings" id
        if(id === 'siteSettings') {
            return SchemaHelper.getSiteSettingsSchema(project, environment);
        }
        
        let collection = environment + '.schemas';

        if(id) {
            let promise = SchemaHelper.isNativeSchema(id) ?
                SchemaHelper.getNativeSchema(id) :
                MongoHelper.findOne(
                    project,
                    collection,
                    {
                        id: id
                    }
                );
            
            return promise
            .then((schemaData) => {
                if(schemaData && Object.keys(schemaData).length > 0) {
                    return new Promise((resolve, reject) => {
                        let schema = SchemaHelper.getModel(schemaData);
                        resolve(schema);
                    });
                
                } else {
                    return SyncHelper.getResourceItem(project, environment, 'schemas', id);

                }
            });

        } else {
            return new Promise((resolve, reject) => {
                reject(new Error('Schema id is null'));
            });

        }
    }
   
    /**
     * Merges two Schemas
     *
     * @param Schema childSchema
     * @param Schema parentSchema
     *
     * @returns {Schema} Merged Schema
     */
    static mergeSchemas(
        childSchema = requiredParam('childSchema'),
        parentSchema = requiredParam('parentSchema')
    ) {
        let mergedSchema = parentSchema;

        // Recursive merge
        function merge(parentValues, childValues) {
            for(let k in childValues) {
                if(typeof parentValues[k] === 'object' && typeof childValues[k] === 'object') {
                    merge(parentValues[k], childValues[k]);
                
                } else {
                    parentValues[k] = childValues[k];
                
                }
            }
        }

        merge(mergedSchema.fields, childSchema.fields);
       
        // Overwrite native values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentSchemaId = childSchema.parentSchemaId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;
        
        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'content':
                let mergedTabs = {};
                
                if(!mergedSchema.tabs) {
                    mergedSchema.tabs = {};
                }

                if(!childSchema.tabs) {
                    childSchema.tabs = {};
                }
                
                // Merge tabs
                for(let k in mergedSchema.tabs) {
                   mergedTabs[k] = mergedSchema.tabs[k];
                }

                for(let k in childSchema.tabs) {
                   mergedTabs[k] = childSchema.tabs[k];
                }

                mergedSchema.tabs = mergedTabs;

                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return mergedSchema;
    }

    /**
     * Gets all parent fields
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Promise} Schema with all aprent fields
     */
    static getSchemaWithParentFields(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        return new Promise((resolve, reject) => {
            SchemaHelper.getSchemaById(project, environment, id)
            .then((schema) => {
                // If this Schema has a parent, merge fields with it
                if(schema.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentFields(project, environment, schema.parentSchemaId)
                    .then((parentSchema) => {
                        let mergedSchema = SchemaHelper.mergeSchemas(schema, parentSchema);
                        let model = SchemaHelper.getModel(mergedSchema);

                        resolve(model);
                    })
                    .catch(reject);

                // If this Schema doesn't have a parent, return this Schema
                } else {
                    let model = SchemaHelper.getModel(schema);

                    resolve(model);

                }
            })
            .catch(reject);
        });
    }

    
    /**
     * Removes a Schema object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     *
     * @return {Promise} Promise
     */
    static removeSchema(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        let collection = environment + '.schemas';
        let thisSchema;
      
        // First get the Schema object
        return this.getSchemaById(project, environment, id)

        // Then get all custom Schemas
        .then((result) => {
            thisSchema = result;

            return this.getCustomSchemas(project, environment);
        })
        
        // Then check if any custom Schemas use this one as a parent
        .then((customSchemas) => {
            let checkNext = () => {
                // Get next Schema
                let customSchema;
                
                for(let id in customSchemas) {
                    customSchema = customSchemas[id];
                    delete customSchemas[id];
                    break;
                }

                // If there are no more Schemas to check, resolve
                if(!customSchema) { return Promise.resolve(); }

                // If this custom Schema does not use the parent Schema, proceed to next
                if(customSchema.parentSchemaId != thisSchema.id) { return checkNext(); }

                // If it does use this parent, make it use its grandparent instead
                customSchema.parentSchemaId = thisSchema.parentSchemaId;

                return this.setSchema(project, environment, customSchema.id, customSchema)
                .then(() => {
                    return checkNext();  
                });
            };

            return checkNext();
        })

        // Then remove the requested Schema
        .then(() => {
            return MongoHelper.removeOne(
                project,
                collection,
                {
                    id: id
                }
            );
        });
    }
    
    /**
     * Sets a schema object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     * @param {Object} schema
     * @param {Boolean} create
     *
     * @return {Promise} Promise
     */
    static setSchema(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        schema = requiredParam('schema'),
        create = false
    ) {
        let collection = environment + '.schemas';
       
        schema = schema || {};

        // Special case for site settings schema
        if(id === 'siteSettings') {
            schema = SchemaHelper.checkSiteSettings(schema).getObject();
            create = true;
        }

        // Unset automatic flags
        schema.locked = false;
        schema.remote = false;

        return MongoHelper.updateOne(
            project,
            collection,
            {
                id: id
            },
            schema,
            {
                upsert: create // Creates a schema if none existed
            }
        );
    }

    /**
     * Creates a new Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {Schema} parentSchema
     *
     * @returns {Promise} Created Schema
     */
    static createSchema(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        parentSchema
    ) {
        let collection = environment + '.schemas';
        let newSchema = Schema.create(parentSchema);

        return MongoHelper.insertOne(
            project,
            collection,
            newSchema.getObject() 
        ).then(() => {
            return new Promise((resolve) => {
                resolve(newSchema);
            });
        });
    }
}

module.exports = SchemaHelper;
