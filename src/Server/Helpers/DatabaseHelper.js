'use strict';

const FileSystem = require('fs');
const Spawn = require('child_process').spawn;
const QueryString = require('querystring');

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

const Content = require('Server/Models/Content');
const Connection = require('Server/Models/Connection');
const User = require('Server/Models/User');

/**
 * The helper class for database operations
 *
 * @memberof HashBrown.Server.Helpers
 */
class DatabaseHelper {
    /**
     * Gets the connection string
     *
     * @param {String} databaseName
     *
     * @returns {String} Connection string
     */
    static getConnectionString(databaseName) {
        let config = HashBrown.Helpers.ConfigHelper.getSync('database') || {};

        let connectionString = 'mongodb://';
       
        if(config.username) {
            connectionString += config.username;

            if(config.password) {
                connectionString += ':' + config.password;
            }

            connectionString += '@';
        }

        connectionString += config.url || 'localhost';
        
        if(config.port) {
            connectionString += ':' + config.port;
        }
        
        if(databaseName) {
            connectionString += '/' + (config.prefix || '') + databaseName;

        } else {
            connectionString += '/';
        }
        
        if(config.options && Object.keys(config.options).length > 0) {
            connectionString += '?' + QueryString.stringify(config.options);
        }

        return connectionString;
    }

    /**
     * Inits the this database
     *
     * @param {String} databaseName
     *
     * @return {Promise} promise
     */
    static getDatabase(databaseName) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.getConnectionString(databaseName), (err, db) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    if(db) {
                        resolve(db);

                    } else {
                        reject(new Error('Couldn\'t connect to MongoDB using the connection string "' + this.getConnectionString(databaseName) + '".'));
                    
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
            if(!FileSystem.existsSync(archivePath)) {
                reject(new Error('Archive at "' + archivePath + '" could not be found'));
            
            } else {
                args.push('--archive=' + archivePath);
                args.push('--db=' + databaseName);

                let mongorestore = Spawn('mongorestore', args);

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
     * @returns {Promise} Timestamp
     */
    static dump(databaseName) {
        return new Promise((resolve, reject) => {
            let config = HashBrown.Helpers.ConfigHelper.getSync('database') || {};
            let args = [];
            let basePath = appRoot + '/storage';
            let projectPath = basePath + '/' + databaseName + '/';
            let dumpPath = projectPath + 'dump/';

            if(databaseName) {
                args.push('--db');
                args.push((config.prefix || '') + databaseName);
            }

            // Archive
            if(!FileSystem.existsSync(basePath)) {
                FileSystem.mkdirSync(basePath);
            }
            
            if(!FileSystem.existsSync(projectPath)) {
                FileSystem.mkdirSync(projectPath);
            }
            
            if(!FileSystem.existsSync(dumpPath)) {
                FileSystem.mkdirSync(dumpPath);
            }

            let timestamp = Date.now()

            args.push('--archive=' + dumpPath + '/' + timestamp + '.hba');

            let mongodump = Spawn('mongodump', args);

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
                    resolve(timestamp);

                }
            });
        });
    }

    /**
     * Lists all collections in a database
     *
     * @param {String} databaseName
     *
     * @return {Promise} Array of collections
     */
    static listCollections(databaseName) {
        debug.log(databaseName + '::listCollections...', this, 4);

        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.listCollections().toArray((findErr, arr) => {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve(arr);
                    }

                    db.close();
                });
            });
        });
    }

    /**
     * Lists all databases
     *
     * @returns {Promise} Array of databases
     */
    static listDatabases() {
        return new Promise((resolve, reject) => {
            let config = HashBrown.Helpers.ConfigHelper.getSync('database') || {};
            let prefix = config.prefix || '';
            
            debug.log('Listing all databases...', this, 4);

            MongoClient.connect(this.getConnectionString(), (err, db) => {
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
                                    database.name !== 'admin' &&
                                    database.name !== 'local' &&
                                    database.name !== prefix + 'users' &&
                                    database.name !== prefix + 'schedule' &&
                                    database.name.indexOf(prefix) === 0
                                ) {
                                    databases[databases.length] = database.name.replace(prefix, '');
                                }
                            }

                            resolve(databases);
                        });

                    } else {
                        reject(new Error('Couldn\'t connect to MongoDB using the connection string "' + this.getConnectionString() + '".'));
                    
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
     * @returns {Promise} Whether or not database exists
     */
    static databaseExists(databaseName) {
        return this.listDatabases()
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
     * @returns {Promise} Whether or not collection exists
     */
    static collectionExists(databaseName, collectionName) {
        return this.listCollections(databaseName)
        .then((collections) => {

            for(let collection of collections || []) {
                if(collection.name === collectionName) {
                    return Promise.resolve(true);
                }
            }
            
            return Promise.resolve(false);
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
     * @return {Promise} Document
     */
    static findOne(databaseName, collectionName, query, pattern) {
        debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this, 4);

        pattern = pattern || {};
        pattern._id = 0;

        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.collection(collectionName).findOne(query, pattern, (findErr, doc) => {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve(doc);
                    }

                    db.close();
                });
            });
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
     * @return {Promise} Documents
     */
    static find(databaseName, collectionName, query, pattern, sort) {
        debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this, 4);

        pattern = pattern || {};
        pattern._id = 0;

        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.collection(collectionName).find(query, pattern).sort(sort).toArray((findErr, docs) => {
                    if(findErr) {
                        reject(new Error(findErr));

                    } else {
                        resolve(docs);
                    
                    }

                    db.close();
                });
            });
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
        debug.log(databaseName + '/' + collectionName + '::count ' + JSON.stringify(query) + '...', this, 4);

        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.collection(collectionName).count(query, (findErr, result) => {
                    if(findErr) {
                        reject(new Error(findErr));

                    } else {
                        resolve(result);
                    
                    }

                    db.close();
                });
            });
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
     * @return {Promise}
     */
    static mergeOne(databaseName, collectionName, query, doc, options) {
        return this.findOne(databaseName, collectionName, query)
        .then((foundDoc) => {
            foundDoc = foundDoc || {};

            for(let k in doc) {
                foundDoc[k] = doc[k];
            }

            return this.updateOne(databaseName, collectionName, query, foundDoc, options);
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
    
        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.collection(collectionName).updateOne(query, doc, options || {}, (findErr) => {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve();
                    }

                    db.close();
                });
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

        debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 4);
    
        return this.getDatabase(databaseName)
        .then((db) => {
            return new Promise((resolve, reject) => {
                db.collection(collectionName).update(query, { $set: doc }, options || {}, (findErr) => {
                    if(findErr) {
                        reject(new Error(findErr));
                    } else {
                        resolve();
                    }

                    db.close();
                });
            })
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
        
            this.getDatabase(databaseName)
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
        
            this.getDatabase(databaseName)
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
        
            this.getDatabase(databaseName)
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

        return this.getDatabase(databaseName)
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
     * @returns {Promise}
     */
    static dropDatabase(databaseName) {
        debug.log(databaseName + '::dropDatabase...', this, 4);

        return this.getDatabase(databaseName)
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

module.exports = DatabaseHelper
