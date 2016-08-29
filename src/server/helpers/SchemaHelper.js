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
     * @returns {Promise} Array of Schemas
     */
    static getCustomSchemas() {
        let collection = ProjectHelper.currentEnvironment + '.schemas';
        
        return new Promise((resolve, reject) => {
            MongoHelper.find(
                ProjectHelper.currentProject,
                collection,
                {}
            ).then((result) => {
                let schemas = {};

                for(let i in result) {
                    let schema = SchemaHelper.getModel(result[i]);

                    if(schema) {
                        schemas[schema.id] = schema;
                    
                    } else {
                        reject(new Error('Schema data from DB is incorrect format: ' + JSON.stringify(result[i])));
                        return;
                    }
                }

                resolve(schemas);
            });
        });
    }

    /**
     * Gets a list of all schema objects
     *
     * @returns {Promise} Array of Schemas
     */
    static getAllSchemas() {
        return new Promise((callback) => {
            SchemaHelper.getNativeSchemas()
            .then((nativeSchemas) => {
                SchemaHelper.getCustomSchemas()
                .then((customSchemas) => {
                    let allSchemas = {};
                    
                    for(let id in nativeSchemas) {
                        allSchemas[id] = nativeSchemas[id];   
                    }
                    
                    for(let id in customSchemas) {
                        allSchemas[id] = customSchemas[id];
                    }

                    callback(allSchemas); 
                });
            });
        });
    }

    /**
     * Checks whether a Schema id belongs to a ntive schema
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

                            resolve(properties);
                        }
                    });
                }
            });
        });
    }

    /**
     * Gets a Schema by id
     *
     * @param {Number} id
     *
     * @return {Promise} Schema
     */
    static getSchemaById(id) {
        let collection = ProjectHelper.currentEnvironment + '.schemas';

        return new Promise(function(resolve, reject) {
            if(id) {
                let promise = SchemaHelper.isNativeSchema(id) ?
                    SchemaHelper.getNativeSchema(id) :
                    MongoHelper.findOne(
                        ProjectHelper.currentProject,
                        collection,
                        {
                            id: id
                        }
                    );
                
                promise
                .then((schemaData) => {
                    if(schemaData && Object.keys(schemaData).length > 0) {
                        let schema = SchemaHelper.getModel(schemaData);
                        resolve(schema);
                    } else {
                        reject(new Error('Schema with id "' + id + '" does not exist'));
                    }
                })
                .catch(reject);

            } else {
                reject(new Error('Schema id is null'));

            }
        });
    }
   
    /**
     * Merges two Schemas
     *
     * @param Schema childSchema
     * @param Schema parentSchema
     *
     * @returns {Schema} Merged Schema
     */
    static mergeSchemas(childSchema, parentSchema) {
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
     * @param {String} id
     *
     * @returns {Promise} Schema with all aprent fields
     */
    static getSchemaWithParentFields(id) {
        return new Promise((resolve, reject) => {
            SchemaHelper.getSchemaById(id)
            .then((schema) => {
                // If this Schema has a parent, merge fields with it
                if(schema.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentFields(schema.parentSchemaId)
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
     * Removes a schema object by id
     *
     * @param {Number} id
     *
     * @return {Promise} Promise
     */
    static removeSchema(id) {
        let collection = ProjectHelper.currentEnvironment + '.schemas';
       
        return MongoHelper.removeOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            }
        );
    }
    
    /**
     * Sets a schema object by id
     *
     * @param {Number} id
     * @param {Object} schema
     *
     * @return {Promise} Promise
     */
    static setSchema(id, schema) {
        let collection = ProjectHelper.currentEnvironment + '.schemas';
       
        return MongoHelper.updateOne(
            ProjectHelper.currentProject,
            collection,
            {
                id: id
            },
            schema,
            {
                upsert: true
            }
        );
    }

    /**
     * Creates a new Schema
     *
     * @param {Schema} parentSchema
     *
     * @returns {Promise} Created Schema
     */
    static createSchema(parentSchema) {
        let collection = ProjectHelper.currentEnvironment + '.schemas';
        let newSchema = Schema.create(parentSchema);

        return new Promise((resolve) => {
            MongoHelper.insertOne(
                ProjectHelper.currentProject,
                collection,
                newSchema.getFields() 
            ).then(() => {
                resolve(newSchema);
            });
        });
    }
}

module.exports = SchemaHelper;
