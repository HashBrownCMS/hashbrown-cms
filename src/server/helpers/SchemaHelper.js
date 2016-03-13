'use strict';

// Promise
let Promise = require('bluebird');

// Libs
let fs = require('fs');
let path = require('path');
let glob = require('glob');

class SchemaHelper {
    /**
     * Gets a list of all schema objects
     *
     * @return {Promise} promise
     */
    static getAllSchemas() {
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

                            // Add the loaded schema to the output array
                            schemas[schema.id] = schema;

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
     * Gets a schema object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getSchema(id) {
        return new Promise(function(callback) {
            glob(appRoot + '/schemas/*/' + id + '.schema', function(err, paths) {
                if(err) {
                    throw err;
                }
                
                if(paths.length == 0) {
                    throw 'No schemas by id "' + id + '" found';

                } else if (paths.length == 1) {
                    let schemaPath = paths[0];

                    fs.readFile(schemaPath, 'utf8', function(err, data) {
                        if(err) {
                            throw err;
                        }

                        let schema = JSON.parse(data);
                        let parentDirName = path.dirname(schemaPath).replace(appRoot + '/schemas/', '');

                        schema.schemaType = parentDirName;

                        callback(schema);
                    }); 

                } else {
                    throw 'More than one schema found with id "' + id + '": ' + paths.json(', ');

                }
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
        return new Promise(function(callback) {
            glob(appRoot + '/schemas/*/' + id + '.schema', function(err, paths) {
                if(err) {
                    throw err;
                }
                
                if(paths.length == 0) {
                    throw 'No schemas by id "' + id + '" found';

                } else if (paths.length == 1) {
                    fs.writeFile(paths[0], JSON.stringify(schema), 'utf8', function(err, data) {
                        if(err) {
                            throw err;
                        }

                        callback();
                    }); 

                } else {
                    throw 'More than one schema found with id "' + id + '": ' + paths.json(', ');

                }
            });
        });
    }
}

module.exports = SchemaHelper;
