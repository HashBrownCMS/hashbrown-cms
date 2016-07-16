'use strict';

// MongoHelper client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;

// Models
let Content = require('../models/Content');
let Connection = require('../../common/models/Connection');
let User = require('../models/User');

class MongoHelper {
    /**
     * Inits the MongoHelper database
     *
     * @param {String} databaseName
     *
     * @return {Promise} promise
     */
    static getDatabase(databaseName) {
        return new Promise((resolve, reject) => {
            let connectionString = 'mongodb://localhost/' + databaseName;

            mongoClient.connect(connectionString, (err, db) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    if(db) {
                        resolve(db);

                    } else {
                        reject(new Error('Couldn\'t connect to MongoDB using the connection string "' + connectionString + '".'));
                    
                    }
                }
            });
        });
    }

    /**
     * Lists all databases
     *
     * @returns {Promise(Array)} databases
     */
    static listDatabases() {
        return new Promise((resolve, reject) => {
            debug.log('Listing all databases...', this);

            let connectionString = 'mongodb://localhost/';
            
            mongoClient.connect(connectionString, (err, db) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    if(db) {
                        db.admin().listDatabases()
                        .then((result) => {
                            let databases = [];

                            for(let i = 0; i < result.databases.length; i++) {
                                let database = result.databases[i];

                                if(!database.empty && database.name != 'local' && database.name != 'users') {
                                    databases[databases.length] = database.name;
                                }
                            }

                            resolve(databases);
                        });

                    } else {
                        reject(new Error('Couldn\'t connect to MongoDB using the connection string "' + connectionString + '".'));
                    
                    }
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
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this);

            let pattern = {
                _id: 0
            };

            MongoHelper.getDatabase(databaseName).then(function(db) {
                db.collection(collectionName).findOne(query, pattern, function(findErr, doc) {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve(doc);
                    }
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
     * @param {Object} sort
     *
     * @return {Promise} promise
     */
    static find(databaseName, collectionName, query, sort) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this);

            let pattern = {
                _id: 0
            };

            MongoHelper.getDatabase(databaseName).then(function(db) {
                db.collection(collectionName).find(query, pattern).sort(sort).toArray(function(findErr, docs) {
                    if(findErr) {
                        reject(new Error(findErr));

                    } else {
                        resolve(docs);
                    
                    }
                });
            })
            .catch(reject);
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

        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this);
        
            MongoHelper.getDatabase(databaseName).then(function(db) {
                db.collection(collectionName).updateOne(query, doc, options || {}, function(findErr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    
                    } else {
                        resolve();

                    }
                });
            })
            .catch(reject);
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
