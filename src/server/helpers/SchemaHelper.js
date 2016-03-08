'use strict';

// Promise
let Promise = require('bluebird');

// Libs
let fs = require('fs');

class SchemaHelper {
    /**
     * Gets a list of all schema objects
     *
     * @return {Promise} promise
     */
    static getAllSchemas(type) {
        return new Promise(function(callback) {
            fs.readdir(appRoot + '/schemas/' + type, function(err, names) {
                names = names.filter(function(file) {
                    return file.substr(-7) === '.schema';
                })

                if(err) {
                    throw err;
                }

                let queue = names || [];
                let schemas = {};

                if(queue.length > 0) {
                    function readNextSchema() {
                        let name = queue[0];

                        fs.readFile(appRoot + '/schemas/' + type + '/' + name, function(err, data) {
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
    static getSchema(type, id) {
        return new Promise(function(callback) {
            fs.readFile('./schemas/' + type + '/' + id + '.schema', 'utf8', function(err, data) {
                if(err) {
                    throw err;
                }

                callback(JSON.parse(data));
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
    static setSchema(type, id, schema) {
        return new Promise(function(callback) {
            fs.writeFile('/schemas/' + type + '/' + id + '.schema', JSON.stringify(schema), 'utf8', function(err, data) {
                if(err) {
                    throw err;
                }

                callback();
            }); 
        });
    }
}

module.exports = SchemaHelper;
