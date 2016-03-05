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
     * Finds a single MongoDb document
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
     * Gets a Page object by id
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static getPageById(id) {
        return ContentHelper.mongoFindOne('pages', {
            _id: new mongodb.ObjectId(id)
        });
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
        return true;
    }
}

module.exports = ContentHelper;
