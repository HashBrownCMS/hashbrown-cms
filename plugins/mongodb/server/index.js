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
let SettingsHelper = require(appRoot + '/src/common/helpers/SettingsHelper');
let AdminHelper = require(appRoot + '/src/server/helpers/AdminHelper');

// Models
let Content = require(appRoot + '/src/common/models/Content');
let Connection = require(appRoot + '/src/common/models/Connection');
let Admin = require(appRoot + '/src/server/models/Admin');

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
     * @param {Object} options
     *
     * @return {Promise} promise
     */
    static updateOne(collectionName, query, doc, options) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        return new Promise(function(callback) {
            console.log('[MongoDB] Updating document with query ' + JSON.stringify(query) + ' in collection "' + collectionName + '"...');
        
            MongoDB.getDatabase().then(function(db) {
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
     * @return {Promise(Connection[])} promise
     */
    static getAllConnections() {
        return new Promise((callback) => {
            MongoDB.find(
                'connections',
                {}
            ).then((array) => {
                let connections = [];

                for(let data of array) {
                    let connection = ConnectionHelper.initConnection(data);

                    connections.push(connection);
                }

                callback(connections);
            });
        });
    }
    
    /**
     * Gets a connection by id
     *
     * @param {string} id
     *
     * @return {Promise(Connection)} promise
     */
    static getConnectionById(id) {
        return new Promise((callback) => {
            MongoDB.findOne(
                'connections',
                {
                    id: id
                }
            ).then((data) => {
                if(data) {
                    let connection = ConnectionHelper.initConnection(data);

                    callback(connection);
                } else {
                    throw '[MongoDB] Found no connection with id "' + id + '"';

                }
            });
        });
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
     * @return {Promise} promise
     */
    static createConnection() {
        let connection = Connection.create();

        return MongoDB.insertOne(
            'connections',
            connection.getFields()
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
     * @return {Promise} promise
     */
    static createContent() {
        let content = Content.create();

        return MongoDB.insertOne(
            'content',
            content.getFields()
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
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(section) {
        return MongoDB.findOne(
            'settings',
            { section: section }
        );
    }
    
    /**
     * Sets all settings
     *
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings) {
        return MongoDB.updateOne(
            'settings',
            { section: section },
            settings,
            {
                upsert: true
            }
        );
    }

    /**
     * Finds an Admin by username
     *  
     * @param {String} username
     *
     * @returns {Promise(Admin)} promise
     */
    static findAdmin(username) {
        return new Promise((callback) => {
            MongoDB.findOne(
                'admins',
                {
                    username: username
                }
            ).then((admin) => {
                callback(new Admin(admin));
            });       
        });
    }
    
    /**
     * Finds a token
     *  
     * @param {String} token
     *
     * @returns {Promise(Boolean)} promise
     */
    static findToken(token) {
        return new Promise((callback) => {
            MongoDB.find(
                'admins',
                {}
            ).then((admins) => {
                for(let a of admins) {
                    let admin = new Admin(a);
                    
                    let valid = admin.validateToken(token);

                    if(valid) {
                        callback(true);
                        return;
                    }
                }

                callback(false);
            });       
        });
    }
    
    /**
     * Creates an Admin
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static createAdmin(username, password) {
        let admin = Admin.create(username, password);

        return new Promise((callback) => {
            MongoDB.insertOne(
                'admins',
                admin.getFields()
            ).then(() => {
                callback();
            });
        });
    }

    /**
     * Updates an Admin
     *
     * @param {String} username
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    static updateAdmin(username, properties) {
        return new Promise((callback) => {
            MongoDB.updateOne(
                'admins',
                {
                    username: username
                },
                properties
            ).then(() => {
                callback();
            });
        });
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

        // Override AdminHelper methods
        AdminHelper.findAdmin = MongoDB.findAdmin;
        AdminHelper.findToken = MongoDB.findToken;
        AdminHelper.createAdmin = MongoDB.createAdmin;
        AdminHelper.updateAdmin = MongoDB.updateAdmin;
    }
}

module.exports = MongoDB
