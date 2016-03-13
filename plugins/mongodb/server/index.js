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

            MongoDB.getDatabase().then(function(db) {
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
    static find(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Finding documents with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

            MongoDB.getDatabase().then(function(db) {
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
     * Gets all Section objects
     *
     * @return {Promise} promise
     */
    static getAllSections() {
        return MongoDB.find(
            'sections',
            {}
        );
    }
    
    /**
     * Gets all Page objects
     *
     * @return {Promise} promise
     */
    static getAllPages() {
        return MongoDB.find(
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
        return MongoDB.findOne(
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
     * @return {Promise} promise
     */
    static setPageById(id, page) {
        page.updateDate = Date.now();

        return MongoDB.updateOne(
            'pages',
            {
                _id: new mongodb.ObjectId(id)
            },
            page
        );
    }

    /**
     * Initialises this plugin
     */
    static init() {
        console.log('[MongoDB] Initialising MongoDB plugin');

        // Override ContentHelper methods
        ContentHelper.getAllPages = MongoDB.getAllPages;
        ContentHelper.getPageById = MongoDB.getPageById;
        ContentHelper.setPageById = MongoDB.setPageById;
        ContentHelper.getAllSections = MongoDB.getAllSections;
    }
}

module.exports = MongoDB
