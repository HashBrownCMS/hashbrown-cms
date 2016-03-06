'use strict';

let glob = require('glob');

// Promise
let Promise = require('bluebird');

// MongoDB client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let mongoDatabase;

// Libs
let fs = require('fs');

// Config
let config = require('../../../config.json');

class ContentHelper {
    /**
     * Inits the MongoDB database
     *
     * @return {Promise} promise
     */
    static getDatabase() {
        return new Promise(function(callback) {
            if(!mongoDatabase) {
                mongoClient.connect(config.mongodb.connectionString, function(connectErr, db) {
                    if(connectErr) {
                        throw connectErr;
                    }
                    
                    if(db) {
                        mongoDatabase = db;
                        callback(mongoDatabase);

                    } else {
                        throw 'Couldn\'t connect to MongoDB. Please check the /config.json file and ensure that the credentials provided are correct.';
                    
                    }
                });
                    
            } else {
                callback(mongoDatabase);
            
            }
        });
    }

    /**
     * Finds a single MongoDB document
     *
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static mongoFindOne(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Finding document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

            ContentHelper.getDatabase().then(function(db) {
                db.collection(collectionName).findOne(query, function(findErr, doc) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback(doc);
                });
            });
        });
    }
    
    /**
     * Finds MongoDB documents
     *
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static mongoFind(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Finding documents with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

            ContentHelper.getDatabase().then(function(db) {
                db.collection(collectionName).find(query).toArray(function(findErr, docs) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback(docs);
                });
            });
        });
    }
    
    /**
     * Updates a single MongoDB document
     *
     * @param {Object} query
     * @param {Object} doc
     *
     * @return {Promise} promise
     */
    static mongoUpdateOne(collectionName, query, doc) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise(function(callback) {
            console.log('[MongoDB] Updating document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');
        
            ContentHelper.getDatabase().then(function(db) {
                db.collection(collectionName).updateOne(query, doc, function(findErr) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback();
                });
            });
        });
    }
    
    /**
     * Gets all Page objects
     *
     * @return {Promise} promise
     */
    static getAllPages() {
        return ContentHelper.mongoFind(
            'pages',
            {}
        );
    }

    /**
     * Gets a Page object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getPageById(id) {
        return ContentHelper.mongoFindOne(
            'pages',
            {
                _id: new mongodb.ObjectId(id)
            }
        );
    }
    
    /**
     * Sets a Page object by id
     *
     * @param {Number} id
     * @param {Object} page
     *
     * @return {Bool} Success
     */
    static setPageById(id, page) {
        return ContentHelper.mongoUpdateOne(
            'pages',
            {
                _id: new mongodb.ObjectId(id)
            },
            page
        );
    }

    /**
     * Gets a list of all Schema objects
     *
     * @return {Promise} promise
     */
    static getAllSchemas() {
        return new Promise(function(callback) {
            glob('/schemas/*/*.schema', function(err, names) {
                if(err) {
                    throw err;
                }

                let queue = names || [];
                let schemas = [];

                if(queue.length > 0) {
                    function readNextSchema() {
                        let name = queue[0];

                        fs.readFile(name, function(err, data) {
                            if(err) {
                                throw err;
                            }

                            // Add the loaded schema to the output array
                            schemas[schemas.length] = JSON.parse(data);

                            // Shift the queue (removes the first element of the array)
                            queue.shift();

                            // If the queue still has items in it, we should continue reading...
                            if(queue.length > 0) {
                                readSchema();

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
     * Gets a Schema object by id
     *
     * @param {String} category
     * @param {Number} id
     *
     * @ return {Promise} promise
     */
    static getSchema(category, id) {
        return new Promise(function(callback) {
            fs.readFile('/schemas/' + category + '/' + id + '.schema', 'utf8', function(err, data) {
                if(err) {
                    throw err;
                }

                callback(JSON.parse(data));
            }); 
        });
    }
    
    /**
     * Sets a Schema object by id
     *
     * @param {String} category
     * @param {Number} id
     * @param {Object} schema
     *
     * @ return {Promise} promise
     */
    static setSchema(category, id, schema) {
        return new Promise(function(callback) {
            fs.writeFile('/schemas/' + category + '/' + id + '.schema', JSON.stringify(schema), 'utf8', function(err, data) {
                if(err) {
                    throw err;
                }

                callback();
            }); 
        });
    }
}

module.exports = ContentHelper;
