'use strict';

// Promise
let Promise = require('bluebird');

// MongoDB client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let mongoDatabase;

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
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static mongoFindOne(collectionName, query) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Looking up document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');

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
     * Updates a MongoDB document
     *
     * @param {Object} query
     * @param {Object} doc
     *
     * @return {Promise} promise
     */
    static mongoUpdate(collectionName, query, doc) {
        return new Promise(function(callback) {
            console.log('[MongoDB] Updating document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');
        
            ContentHelper.getDatabase().then(function(db) {
                db.collection(collectionName).update(query, function(findErr) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback();
                });
            });
        });
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
        return ContentHelper.mongoUpdate(
            'pages',
            {
                _id: new mongodb.ObjectId(id)
            },
            page
        );
    }
}

module.exports = ContentHelper;
