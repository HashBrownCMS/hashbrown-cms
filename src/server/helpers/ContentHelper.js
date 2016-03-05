'use strict';

// MongoDB client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let mongoDatabase;

// Config
let config = require('../../../config.json');

class ContentHelper {
    /**
     * Inits the MongoDB database
     */
    static initMongo() {
        return new Promise(function(callback) {
            if(!mongoDatabase) {
                MongoClient.connect(env.connectionString, function(connectErr, db) {
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
                    mongoDatabase.collection(collectionName).findOne({id: id}, function(findErr, doc) {
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
