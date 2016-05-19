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
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');
let SettingsHelper = require(appRoot + '/src/server/helpers/SettingsHelper');

// Models
let Content = require(appRoot + '/src/server/models/Content');
let Connection = require(appRoot + '/src/server/models/Connection');

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
     * Gets all connections
     *
     * @return {Promise} promise
     */
    static getAllConnections() {
        return MongoDB.find(
            'connections',
            {}
        );
    }
    
    /**
     * Gets a connection by id
     *
     * @param {string} id
     *
     * @return {Promise} promise
     */
    static getConnectionById(id) {
        return MongoDB.findOne(
            'connections',
            {
                id: id
            }
        );
    }
    
    /**
     * Removes a connection by id
     *
     * @param {string} id
     *
     * @return {Promise} promise
     */
    static removeConnectionById(id) {
        return MongoDB.removeOne(
            'connections',
            {
                id: id
            }
        );
    }
    
    /**
     * Sets a connection setting by id
     *
     * @param {string} id
     * @param {Object} newSettings
     *
     * @return {Promise} promise
     */
    static setConnectionSettingById(id, newSettings) {
        return new Promise(function(callback) {
            // First find the connection
            MongoDB.findOne(
                'connections',
                {
                    id: id
                }
            )
            .then(function(oldConnection) {
                let newConnection = oldConnection;

                // Make sure the settings object exists
                if(!newConnection.settings) {
                    newConnection.settings = {};
                }

                // Adopt values at top level
                for(let k in newSettings) {
                    newConnection.settings[k] = newSettings[k];
                }

                // Update the Mongo document
                MongoDB.updateOne(
                    'connections',
                    {
                        id: id
                    },
                    newConnection
                )
                .then(callback);
            });
        });
    }

    /**
     * Sets a connection by id
     *
     * @param {string} id
     * @param {Object} content
     *
     * @return {Promise} promise
     */
    static setConnectionById(id, content) {
        return MongoDB.updateOne(
            'connections',
            {
                id: id
            },
            content
        );
    }
    
    /**
     * Creates a new connection
     *
     * @param {Object} data
     *
     * @return {Promise} promise
     */
    static createConnection(data) {
        let connection = Connection.create(data);

        return MongoDB.insertOne(
            'connections',
            connection.data
        );
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
     * Creates a new content object
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
     * Removes a content object
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
     * Gets all settings
     *
     * @return {Promise} promise
     */
    static getSettings() {
        return MongoDB.find(
            'settings',
            {}
        );
    }
    
    /**
     * Sets all settings
     *
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(settings) {
        return MongoDB.update(
            'settings',
            {},
            settings
        );
    }

    /**
     * Initialises this plugin
     */
    static init(app) {
        console.log('[MongoDB] Initialising MongoDB plugin');

        // Override ConnectionHelper methods
        ConnectionHelper.createConnection = MongoDB.createConnection;
        ConnectionHelper.getConnectionById = MongoDB.getConnectionById;
        ConnectionHelper.getAllConnections = MongoDB.getAllConnections;
        ConnectionHelper.setConnectionById = MongoDB.setConnectionById;
        ConnectionHelper.setConnectionSettingById = MongoDB.setConnectionSettingById;
        ConnectionHelper.removeConnectionById = MongoDB.removeConnectionById;

        // Override ContentHelper methods
        ContentHelper.createContent = MongoDB.createContent;
        ContentHelper.removeContentById = MongoDB.removeContentById;
        ContentHelper.getAllContents = MongoDB.getAllContents;
        ContentHelper.getContentById = MongoDB.getContentById;
        ContentHelper.setContentById = MongoDB.setContentById;

        // Override SettingsHelper methods
        SettingsHelper.getSettings = MongoDB.getSettings;
        SettingsHelper.setSettings = MongoDB.setSettings;
    }
}

module.exports = MongoDB
