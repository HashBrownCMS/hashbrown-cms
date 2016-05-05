'use strict';

// MongoDB client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let mongoDatabase;

// Promise
let Promise = require('bluebird');

// Config
let config = require('./config.json');

// Helpers
let ContentHelper = require(appRoot + '/src/server/helpers/ContentHelper');

// Models
let Content = require(appRoot + '/src/server/models/Content');

class MongoDB {
    /**
     * Inits the MongoDB database
     *
     * @return {Promise} promise
     */
    static getDatabase() {
        return new Promise(function(callback) {
            if(!mongoDatabase) {
                mongoClient.connect(config.connectionString, function(connectErr, db) {
                    if(connectErr) {
                        throw connectErr;
                    }
                    
                    if(db) {
                        mongoDatabase = db;
                        callback(mongoDatabase);

                    } else {
                        throw 'Couldn\'t connect to MongoDB. Please check the /plugins/mongodb/config.json file and ensure that the credentials provided are correct.';
                    
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
    static findOne(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Finding document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

            let pattern = {
                _id: 0
            };

            MongoDB.getDatabase().then(function(db) {
                db.collection(collectionName).findOne(query, pattern, function(findErr, doc) {
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
    static find(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Finding documents with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

            let pattern = {
                _id: 0
            };

            MongoDB.getDatabase().then(function(db) {
                db.collection(collectionName).find(query, pattern).toArray(function(findErr, docs) {
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
    static updateOne(collectionName, query, doc) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise(function(callback) {
            console.log('[MongoDB] Updating document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');
        
            MongoDB.getDatabase().then(function(db) {
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
     * Inserts a single MongoDB document
     *
     * @param {Object} doc
     *
     * @return {Promise} promise
     */
    static insertOne(collectionName, doc) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise(function(callback) {
            console.log('[MongoDB] Inserting new document into collection "' + collectionName + '"...');
        
            MongoDB.getDatabase().then(function(db) {
                db.collection(collectionName).insertOne(doc, function(insertErr) {
                    if(insertErr) {
                        throw insertErr;
                    }

                    callback(doc);
                });
            });
        });
    }
    
    /**
     * Removes a single MongoDB document
     *
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static removeOne(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Removing document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');
        
            MongoDB.getDatabase().then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback();
                });
            });
        });
    }

    /**
     * Gets all Content objects
     *
     * @return {Promise} promise
     */
    static getAllContents() {
        return MongoDB.find(
            'content',
            {}
        );
    }

    /**
     * Gets a Content object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getContentById(id) {
        return MongoDB.findOne(
            'content',
            {
                id: id
            }
        );
    }
    
    /**
     * Sets a Content object by id
     *
     * @param {Number} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setContentById(id, content) {
        content.updateDate = Date.now();

        return MongoDB.updateOne(
            'content',
            {
                id: id
            },
            content
        );
    }

    /**
     * Creates a new content
     *
     * @param {Object} date
     *
     * @return {Promise} promise
     */
    static createContent(data) {
        let content = Content.create(data);

        return MongoDB.insertOne(
            'content',
            content.data
        );
    }
    
    /**
     * Removes a content
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        return MongoDB.removeOne(
            'content',
            {
                id: id
            }
        );
    }
    
    /**
     * Initialises this plugin
     */
    static init(app) {
        console.log('[MongoDB] Initialising MongoDB plugin');

        // Override ContentHelper methods
        // TODO: Restructure this to use event handlers instead
        ContentHelper.createContent = MongoDB.createContent;
        ContentHelper.removeContentById = MongoDB.removeContentById;
        ContentHelper.getAllContents = MongoDB.getAllContents;
        ContentHelper.getContentById = MongoDB.getContentById;
        ContentHelper.setContentById = MongoDB.setContentById;
    }
}

module.exports = MongoDB
