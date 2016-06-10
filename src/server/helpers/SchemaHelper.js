'use strict';

// Helpers
let ProjectHelper = require('./ProjectHelper');
let MongoHelper = require('./MongoHelper');

// Libs
let fs = require('fs');
let path = require('path');
let glob = require('glob');

class SchemaHelper {
    /**
     * Gets a list of native schema objects
     *
     * @returns {Promise(Schema[])} schemas
     */
    static getNativeSchemas() {
        return new Promise(function(callback) {
            glob(appRoot + '/schemas/*/*.schema', function(err, paths) {
                if(err) {
                    throw err;
                }

                let queue = paths || [];
                let schemas = {};

                if(queue.length > 0) {
                    function readNextSchema() {
                        let schemaPath = queue[0];

                        fs.readFile(schemaPath, function(err, data) {
                            if(err) {
                                throw err;
                            }

                            let schema = JSON.parse(data);
                            let parentDirName = path.dirname(schemaPath).replace(appRoot + '/schemas/', '');
                            let id = path.basename(schemaPath, '.schema');

                            // Generated values, will be overwritten every time
                            schema.id = id;
                            schema.schemaType = parentDirName;

                            // Add the loaded schema to the output array
                            schemas[id] = schema;

                            // Shift the queue (removes the first element of the array)
                            queue.shift();

                            // If the queue still has items in it, we should continue reading...
                            if(queue.length > 0) {
                                readNextSchema();

                            // ...if not, we'll return all the loaded schemas
                            } else {
                                callback(schemas);
                            
                            }
                        });
                    }

                    readNextSchema();

                } else {
                    callback([]);

                }
            }); 
        });
    }
    
    /**
     * Gets a list of all custom schema objects
     *
     * @returns {Promise(Schema[])} schemas
     */
    static getCustomSchemas() {
        let collection = ProjectHelper.currentEnvironment + '.schemas';
        
        return MongoHelper.find(
            ProjectHelper.currentProject,
            collection,
            {}
        );
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
            schema
        );
    }
}

module.exports = SchemaHelper;
