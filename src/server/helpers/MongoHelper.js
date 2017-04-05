'use strict';

// Libs
let fs = require('fs');
let spawn = require('child_process').spawn;

// MongoHelper client
let mongodb = require('mongodb');
let mongoClient = mongodb.MongoClient;

// Models
let Content = require('../models/Content');
let Connection = require('../../common/models/Connection');
let User = require('../models/User');

/**
 * The helper class for MongoDB operations
 */
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
     * Restores a database
     *
     * @param {String} databaseName
     * @param {String} timestamp
     *
     * @returns {Promise} Data string
     */
    static restore(databaseName, timestamp) {
        return new Promise((resolve, reject) => {
            let args = [];
            let basePath = appRoot + '/storage';
            let projectPath = basePath + '/' + databaseName + '/dump';
            let archivePath = projectPath + '/' + timestamp + '.hba';

            // Drop existing
            args.push('--drop');

            // Archive
            if(!fs.existsSync(archivePath)) {
                reject(new Error('Archive at "' + archivePath + '" could not be found'));
            
            } else {
                args.push('--archive=' + archivePath);
                args.push('--db=' + databaseName);

                let mongorestore = spawn('mongorestore', args);

                mongorestore.stdout.on('data', (data) => {
                    debug.log(data.toString(), this);
                });

                mongorestore.stderr.on('data', (data) => {
                    debug.log(data.toString(), this);
                });
                
                mongorestore.on('exit', (code) => {
                    if(code != 0) {
                        reject(new Error('mongorestore exited with status code ' + code));
                    
                    } else {
                        resolve();

                    }
                });
            }
        });
    }
   
    /**
     * Dumps a database
     *
     * @param {String} databaseName
     *
     * @returns {Promise} Data string
     */
    static dump(databaseName) {
        return new Promise((resolve, reject) => {
            let args = [];
            let basePath = appRoot + '/storage';
            let projectPath = basePath + '/' + databaseName + '/';
            let dumpPath = projectPath + 'dump/';

            if(databaseName) {
                args.push('--db');
                args.push(databaseName);
            }

            // Archive
            if(!fs.existsSync(basePath)) {
                fs.mkdirSync(basePath);
            }
            
            if(!fs.existsSync(projectPath)) {
                fs.mkdirSync(projectPath);
            }
            
            if(!fs.existsSync(dumpPath)) {
                fs.mkdirSync(dumpPath);
            }

            args.push('--archive=' + dumpPath + '/' + Date.now() + '.hba');

            let mongodump = spawn('mongodump', args);

            mongodump.stdout.on('data', (data) => {
                debug.log(data.toString(), this);
            });

            mongodump.stderr.on('data', (data) => {
                debug.log(data.toString(), this);
            });
            
            mongodump.on('exit', (code) => {
                if(code != 0) {
                    reject(new Error('mongodump exited with status code ' + code));
                
                } else {
                    resolve();

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
            debug.log(databaseName + '::listCollections...', this, 4);

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
            debug.log('Listing all databases...', this, 4);

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
                                    database.name != 'schedule' &&
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
     * Check if a database exists
     *
     * @param {String} databaseName
     *
     * returns {Promise} Promise
     */
    static databaseExists(databaseName) {
        return MongoHelper.listDatabases()
        .then((databases) => {
            return Promise.resolve(databases.indexOf(databaseName) > -1);
        });
    }
    
    /**
     * Check if a collection exists
     *
     * @param {String} databaseName
     * @param {String} collectionName
     *
     * returns {Promise} Promise
     */
    static collectionExists(databaseName, collectionName) {
        return MongoHelper.listCollections(databaseName)
        .then((collections) => {
            return Promise.resolve(collections.indexOf(collectionName) > -1);
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
            debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this, 4);

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
            debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this, 4);

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
     * Counts Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Promise} Number of matching documents
     */
    static count(databaseName, collectionName, query) {
        return new Promise((resolve, reject) => {
            debug.log(databaseName + '/' + collectionName + '::count ' + JSON.stringify(query) + '...', this, 4);

            MongoHelper.getDatabase(databaseName)
            .then((db) => {
                db.collection(collectionName).count(query, (findErr, result) => {
                    if(findErr) {
                        reject(new Error(findErr));

                    } else {
                        resolve(result);
                    
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
                foundDoc = foundDoc || {};

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
        // Make sure the MongoId isn't included
        delete doc['_id'];

        debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 4);
    
        return MongoHelper.getDatabase(databaseName)
        .then(function(db) {
            db.collection(collectionName).updateOne(query, doc, options || {}, function(findErr) {
                db.close();
                
                if(findErr) {
                    return Promise.reject(new Error(findErr));
                
                } else {
                    return Promise.resolve();

                }
            });
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
            debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 4);
        
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
            debug.log(databaseName + '/' + collectionName + '::insertOne ' + JSON.stringify(doc) + '...', this, 4);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).insertOne(doc, function(insertErr) {
                    if(insertErr) {
                        reject(new Error(insertErr));
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
            debug.log(databaseName + '/' + collectionName + '::remove ' + JSON.stringify(query) + '...', this, 4);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
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
            debug.log(databaseName + '/' + collectionName + '::removeOne ' + JSON.stringify(query) + '...', this, 4);
        
            MongoHelper.getDatabase(databaseName)
            .then(function(db) {
                db.collection(collectionName).remove(query, true, function(findErr) {
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
     * Drops an entire collection
     *
     * @param {String} databaseName
     * @param {String} collectionName
     *
     * @return {Promise} promise
     */
    static dropCollection(databaseName, collectionName) {
        debug.log(databaseName + '::dropCollection...', this, 4);

        return MongoHelper.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.dropCollection(collectionName, (err) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        resolve();
                    }

                    db.close();
                });
            });
        });
    }

    /**
     * Drops an entire database
     *
     * @param {String} databaseName
     *
     * @return {Promise} promise
     */
    static dropDatabase(databaseName) {
        debug.log(databaseName + '::dropDatabase...', this, 4);

        return MongoHelper.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.dropDatabase((err) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        resolve();
                    }

                    db.close();
                });
            });
        });
    }
}

module.exports = MongoHelper
