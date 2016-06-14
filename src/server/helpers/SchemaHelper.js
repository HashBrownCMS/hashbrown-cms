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
        return new Promise(function(callback) {
            if(!SchemaHelper.nativeSchemas) {
                glob(appRoot + '/src/common/schemas/*/*.schema', function(err, paths) {
                    if(err) {
                        throw err;
                    }

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

                                // Add the loaded schema to the output array
                                SchemaHelper.nativeSchemas[schema.id] = schema;

                                // Shift the queue (removes the first element of the array)
                                queue.shift();

                                // If the queue still has items in it, we should continue reading...
                                if(queue.length > 0) {
                                    readNextSchema();

                                // ...if not, we'll return all the loaded schemas
                                } else {
                                    callback(SchemaHelper.nativeSchemas);
                                
                                }
                            });
                        }

                        readNextSchema();

                    } else {
                        callback({});

                    }
                }); 
            } else {
                callback(SchemaHelper.nativeSchemas);

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
        
        return new Promise((callback) => {
            MongoHelper.find(
                ProjectHelper.currentProject,
                collection,
                {}
            ).then((result) => {
                let schemas = {};

                for(let i in result) {
                    let schema = SchemaHelper.getModel(result[i]);

                    schemas[schema.id] = schema;
                }

                callback(schemas);
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
                    let allSchemas = nativeSchemas;
                    
                    for(let id in customSchemas) {
                        allSchemas[id] = customSchemas[id];
                    }

                    callback(allSchemas); 
                });
            });
        });
    }

    /**
     * Gets a schema object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getSchema(id) {
        return new Promise(function(callback) {
            SchemaHelper.getAllSchemas()
            .then((schemas) => {
                for(let schemaId in schemas) {
                    if(schemaId == id) {
                        callback(schemas[schemaId]);
                        return;
                    }
                }

                callback(null);
            });
        });
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
            )
        });
    }
}

module.exports = SchemaHelper;
