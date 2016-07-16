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
     * @returns {Promise(Schema[])} schemas
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
     * @returns {Promise(Schema[])} schemas
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
     * @returns {Promise(Schema[])} schemas
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
     * Gets a Schema by id
     *
     * @param {Number} id
     *
     * @return {Promise(Schema)} schema
     */
    static getSchema(id) {
        let collection = ProjectHelper.currentEnvironment + '.schemas';

        return new Promise(function(resolve, reject) {
            if(id) {
                MongoHelper.findOne(
                    ProjectHelper.currentProject,
                    collection,
                    {
                        id: id
                    }
                )
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
     * Removes a schema object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
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
     * @return {Promise} promise
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
     * @returns {Promise(Schema}) schema
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
