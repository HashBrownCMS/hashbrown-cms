'use strict';

// MongoHelper client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;
let mongoDatabase;

// Models
let Content = require(appRoot + '/src/common/models/Content');
let Connection = require(appRoot + '/src/common/models/Connection');
let Admin = require(appRoot + '/src/server/models/Admin');

class MongoHelper {
    /**
     * Inits the MongoHelper database
     *
     * @param {String} databaseName
     *
     * @return {Promise} promise
     */
    static getDatabase(databaseName) {
        return new Promise((callback) => {
            let connectionString = 'mongodb://localhost/' + databaseName;

            mongoClient.connect(connectionString, (connectErr, db) => {
                if(connectErr) {
                    debug.error(connectErr, this);
                }
                
                if(db) {
                    mongoDatabase = db;
                    callback(mongoDatabase);

                } else {
                    debug.error('Couldn\'t connect to MongoDB using the connection string "' + connectionString + '".', this);
                
                }
            });
        });
    }

    /**
     * Finds a single MongoHelper document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static findOne(databaseName, collectionName, query) {
        return new Promise((callback) => {
            debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this);

            let pattern = {
                _id: 0
            };

            MongoHelper.getDatabase(databaseName).then(function(db) {
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
     * Finds MongoHelper documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static find(databaseName, collectionName, query) {
        return new Promise((callback) => {
            debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this);

            let pattern = {
                _id: 0
            };

            MongoHelper.getDatabase(databaseName).then(function(db) {
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
     * Updates a single MongoHelper document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} doc
     * @param {Object} options
     *
     * @return {Promise} promise
     */
    static updateOne(databaseName, collectionName, query, doc, options) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise((callback) => {
            debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + '...', this);
        
            MongoHelper.getDatabase(databaseName).then(function(db) {
                db.collection(collectionName).updateOne(query, doc, options || {}, function(findErr) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback();
                });
            });
        });
    }
    
    /**
     * Inserts a single MongoHelper document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} doc
     *
     * @return {Promise} promise
     */
    static insertOne(databaseName, collectionName, doc) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise((callback) => {
            debug.log(databaseName + '/' + collectionName + '::insertOne ' + JSON.stringify(doc) + '...', this);
        
            MongoHelper.getDatabase(databaseName).then(function(db) {
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
     * Removes a single MongoHelper document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static removeOne(databaseName, collectionName, query) {
        return new Promise((callback) => {
            debug.log(databaseName + '/' + collectionName + '::removeOne ' + JSON.stringify(query) + '...', this);
        
            MongoHelper.getDatabase(databaseName).then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
                    if(findErr) {
                        throw findErr;
                    }

                    callback();
                });
            });
        });
    }    
}

module.exports = MongoHelper
