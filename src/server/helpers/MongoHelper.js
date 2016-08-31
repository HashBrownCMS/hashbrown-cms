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
     * Lists all collections in a database
     *
     * @param {String} databaseName
     *
     * @return {Promise} promise
     */
    static listCollections(databaseName) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '::listCollections...', this, 3);

            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.listCollections().toArray(function(findErr, arr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve(arr);
                    }

                    db.close();
                });
            })
            .catch(reject);
        });
    }

    /**
     * Lists all databases
     *
     * @returns {Promise(Array)} databases
     */
    static listDatabases() {
        return new Promise((resolve, reject) => {
            debug.log('Listing all databases...', this, 3);

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

                                if(
                                    !database.empty &&
                                    database.name != 'local' &&
                                    database.name != 'users' &&
                                    database.name != 'admin' &&
                                    database.name != 'undefined' && 
                                    database.name != 'false'
                                ) {
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
     * Finds a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} pattern
     *
     * @return {Promise} promise
     */
    static findOne(databaseName, collectionName, query, pattern) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this, 3);

            pattern = pattern || {};
            pattern._id = 0;

            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).findOne(query, pattern, function(findErr, doc) {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve(doc);
                    }

                    db.close();
                });
            })
            .catch(reject);
        });
    }
    
    /**
     * Finds Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} pattern
     * @param {Object} sort
     *
     * @return {Promise} promise
     */
    static find(databaseName, collectionName, query, pattern, sort) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this, 3);

            pattern = pattern || {};
            pattern._id = 0;

            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).find(query, pattern).sort(sort).toArray(function(findErr, docs) {
                    if(findErr) {
                        reject(new Error(findErr));

                    } else {
                        resolve(docs);
                    
                    }

                    db.close();
                });
            })
            .catch(reject);
        });
    }
    
    /**
     * Merges a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} doc
     * @param {Object} options
     *
     * @return {Promise} promise
     */
    static mergeOne(databaseName, collectionName, query, doc, options) {
        return new Promise((resolve, reject) => {
            this.findOne(databaseName, collectionName, query)
            .then((foundDoc) => {
                for(let k in doc) {
                    foundDoc[k] = doc[k];
                }

                this.updateOne(databaseName, collectionName, query, foundDoc, options)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        });
    }
    
    /**
     * Updates a single Mongo document
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
        return new Promise((resolve, reject) => {
            // Make sure the MongoId isn't included
            delete doc['_id'];

            debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 3);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).updateOne(query, doc, options || {}, function(findErr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    
                    } else {
                        resolve();

                    }

                    db.close();
                });
            })
            .catch(reject);
        });
    }
    
    /**
     * Updates Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} doc
     * @param {Object} options
     *
     * @return {Promise} promise
     */
    static update(databaseName, collectionName, query, doc, options) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 3);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).update(query, { $set: doc }, options || {}, function(findErr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    
                    } else {
                        resolve();

                    }

                    db.close();
                });
            })
            .catch(reject);
        });
    }
    
    /**
     * Inserts a single Mongo document
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

        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::insertOne ' + JSON.stringify(doc) + '...', this, 3);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).insertOne(doc, function(insertErr) {
                    if(insertErr) {
                        reject(new Error(insertErr));
                    }

                    resolve(doc);

                    db.close();
                });
            })
            .catch(reject);
        });
    }
    
    /**
     * Removes a Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static remove(databaseName, collectionName, query) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::remove ' + JSON.stringify(query) + '...', this, 3);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    }

                    resolve();

                    db.close();
                });
            })
            .catch(reject);
        });
    }    
    
    /**
     * Removes a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} promise
     */
    static removeOne(databaseName, collectionName, query) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::removeOne ' + JSON.stringify(query) + '...', this, 3);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
                    if(findErr) {
                        reject(new Error(findErr));
                    }

                    resolve();

                    db.close();
                });
            })
            .catch(reject);
        });
    }    
}

module.exports = MongoHelper
