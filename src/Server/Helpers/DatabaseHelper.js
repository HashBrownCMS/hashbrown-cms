'use strict';

const FileSystem = require('fs');
const Spawn = require('child_process').spawn;
const QueryString = require('querystring');
const Path = require('path');

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

/**
 * The helper class for database operations
 *
 * @memberof HashBrown.Server.Helpers
 */
class DatabaseHelper {
    /**
     * Gets a database config parameter
     *
     * @param {String} key
     *
     * @return {String} Value
     */
    static getConfig(key) {
        let value = process.env['MONGODB_' + key.toUpperCase()];

        // Config value was found in the environment variables, return it
        if(value) {
            if(key === 'options') {
                try {
                    return JSON.parse(value);

                } catch(e) {
                    debug.log('JSON parse error: ' + e.message, this);

                    return {};
                }
            }

            return value;
        }

        // Get config value from disk
        let config = HashBrown.Helpers.ConfigHelper.getSync('database') || {};

        if(config[key]) { return config[key]; }

        // No value found, return default ones
        switch(key) {
            case 'protocol':
                return 'mongodb';
            
            case 'host':
                return 'localhost';

            case 'port':
                return '27017';

            case 'prefix':
                return 'hb_';

            case 'options':
                return {};
        }

        // Absolutely no results, return an empty string
        return '';
    }

    /**
     * Gets the connection string
     *
     * @param {String} databaseName
     *
     * @returns {String} Connection string
     */
    static getConnectionString(databaseName) {
        let connectionString = this.getConfig('protocol') + '://';
      
        let username = this.getConfig('username');
        let password = this.getConfig('password');
        let host = this.getConfig('host');
        let port = this.getConfig('port');
        let prefix = this.getConfig('prefix');
        let options = this.getConfig('options');

        let hosts = Array.isArray(host) ? host : host.split(',');
        let ports = Array.isArray(port) ? port : port.split(',');

        if(username) {
            connectionString += username;

            if(password) {
                connectionString += ':' + password;
            }

            connectionString += '@';
        }

        hosts.forEach((host, index) => {
            let port = ports[index] || ports[0];
        
            connectionString += `${host}:${port}`;
            
            if(index !== hosts.length - 1) {
                connectionString += ',';
            }
        });

        if(databaseName) {
            connectionString += '/' + prefix + databaseName;

        } else {
            connectionString += '/';
        
        }
        
        if(options && Object.keys(options).length > 0) {
            connectionString += '?' + QueryString.stringify(options);
        }

        return connectionString;
    }

    /**
     * Connects to the database
     *
     * @param {String} databaseName
     *
     * @return {Promise} Client
     */
    static async connect(databaseName) {
        return await MongoClient.connect(this.getConnectionString(databaseName), { useNewUrlParser: true });
    }

    /**
     * Restores a database
     *
     * @param {String} databaseName
     * @param {String} timestamp
     *
     * @returns {Promise} Data string
     */
    static async restore(databaseName, timestamp) {
        let archivePath = Path.join(APP_ROOT, 'storage', databaseName, 'dump', timestamp + '.hba');
       
        try {
            let archiveContent = await HashBrown.Helpers.FileHelper.read(archivePath, 'utf8'); 
            let collections = JSON.parse(archiveContent);

            await this.dropDatabase(databaseName);

            let collectionNames = Object.keys(collections);
           
            let insertCollection = async (index) => {
                if(index >= collectionNames.length) { return; }
            
                let collectionName = collectionNames[index];
                let documents = collections[collectionName];

                let insertDocument = async (index) => {
                    if(index >= documents.length) { return; }
                
                    await this.insertOne(databaseName, collectionName, documents[index])
                    await insertDocument(index + 1);
                };

                await insertDocument(0);
                await insertCollection(index + 1);    
            };

            await insertCollection(0);
        
            debug.log('Database restored successfully', this);

        } catch(e) {
            debug.error(e, this);
        }
    }
   
    /**
     * Dumps a database
     *
     * @param {String} databaseName
     *
     * @returns {Promise} Timestamp
     */
    static async dump(databaseName) {
        checkParam(databaseName, 'databaseName', String);

        let dumpPath = Path.join(APP_ROOT, 'storage', databaseName, 'dump');

        // Archive
        await HashBrown.Helpers.FileHelper.makeDirectory(dumpPath);

        let timestamp = Date.now();
        let archivePath = Path.join(dumpPath, timestamp + '.hba'); 

        debug.log('Dumping database "' + databaseName + '" to ' + archivePath + '.hba...', this);
    
        let collectionNames = await this.listCollections(databaseName);
    
        let getDocuments = async (index) => {
            if(index >= collectionNames.length) { return; }

            let collectionName = collectionNames[index].name;
            let documents = await this.find(databaseName, collectionName, {});
            
            collections[collectionName] = documents;
            
            await getDocuments(index + 1);
        };

        let collections = {};

        await getDocuments(0); 
        
        await HashBrown.Helpers.FileHelper.write(collections, archivePath);
                    
        debug.log('Database dumped successfully', this);

        return timestamp;
    }

    /**
     * Lists all collections in a database
     *
     * @param {String} databaseName
     *
     * @return {Promise} Array of collections
     */
    static async listCollections(databaseName) {
        checkParam(databaseName, 'databaseName', String);

        debug.log(databaseName + '::listCollections...', this, 4);

        let collections = [];
        let client = null;

        try {
            client = await this.connect(databaseName);
            collections = await client.db().listCollections().toArray();
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }

        return collections;
    }

    /**
     * Lists all databases
     *
     * @returns {Promise} Array of databases
     */
    static async listDatabases() {
        debug.log('Listing all databases...', this, 4);

        let result = null;
        let client = null;

        try { 
            client = await this.connect();
            result = await client.db('admin').admin().listDatabases();
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }

        if(!result) { return []; }

        let databases = [];

        for(let i = 0; i < result.databases.length; i++) {
            let database = result.databases[i];

            if(
                !database.empty &&
                database.name !== 'admin' &&
                database.name !== 'local' &&
                database.name !== 'config' &&
                database.name !== this.getConfig('prefix') + 'users' &&
                database.name !== this.getConfig('prefix') + 'schedule' &&
                database.name.indexOf(this.getConfig('prefix')) === 0
            ) {
                databases[databases.length] = database.name.replace(this.getConfig('prefix'), '');
            }
        }

        return databases;
    }

    /**
     * Check if a database exists
     *
     * @param {String} databaseName
     *
     * @returns {Promise} Whether or not database exists
     */
    static async databaseExists(databaseName) {
        let databases = await this.listDatabases();

        return databases.indexOf(databaseName) > -1;
    }
    
    /**
     * Check if a collection exists
     *
     * @param {String} databaseName
     * @param {String} collectionName
     *
     * @returns {Promise} Whether or not collection exists
     */
    static async collectionExists(databaseName, collectionName) {
        let collections = await this.listCollections(databaseName);

        for(let collection of collections || []) {
            if(collection.name === collectionName) {
                return true;
            }
        }
    
        return false;
    }

    /**
     * Finds a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} projection
     *
     * @return {Promise} Document
     */
    static async findOne(databaseName, collectionName, query, projection = {}) {
        debug.log(databaseName + '/' + collectionName + '::findOne ' + JSON.stringify(query) + '...', this, 4);

        projection._id = 0;

        let doc = null;
        let client = null;

        try {
            client = await this.connect(databaseName);
            doc = await client.db().collection(collectionName).findOne(query, projection);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }

        if(doc && doc['_id']) {
            delete doc['_id'];
        }

        return doc;
    }
    
    /**
     * Finds Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} projection
     * @param {Object} sort
     *
     * @return {Promise} Documents
     */
    static async find(databaseName, collectionName, query, projection = {}, sort = null) {
        debug.log(databaseName + '/' + collectionName + '::find ' + JSON.stringify(query) + '...', this, 4);

        projection._id = 0;

        let docs = [];
        let client = null;

        try {
            client = await this.connect(databaseName);
            docs = await client.db().collection(collectionName).find(query, { projection: projection })

            if(sort) { docs = await docs.sort(sort); }

            docs = docs.toArray();

        } catch(e) {
            debug.error(e, this);
        } finally {
            if(client) { client.close(); }
        }

        return docs;
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
    static async count(databaseName, collectionName, query) {
        debug.log(databaseName + '/' + collectionName + '::count ' + JSON.stringify(query) + '...', this, 4);
        
        let client = null;
        let result = 0;

        try {
            client = await this.connect(databaseName);
            result = await client.db().collection(collectionName).count(query);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }

        return result;
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
    static async mergeOne(databaseName, collectionName, query, doc, options) {
        let foundDoc = await this.findOne(databaseName, collectionName, query) || {};

        for(let k in doc) {
            foundDoc[k] = doc[k];
        }

        return this.updateOne(databaseName, collectionName, query, foundDoc, options);
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
    static async updateOne(databaseName, collectionName, query, doc, options) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 4);
   
        let client = null;

        try {
            client = await this.connect(databaseName);
            await client.db().collection(collectionName).updateOne(query, { $set: doc }, options || {});
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
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
    static async update(databaseName, collectionName, query, doc, options) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        debug.log(databaseName + '/' + collectionName + '::updateOne ' + JSON.stringify(query) + ' with options ' + JSON.stringify(options || {}) + '...', this, 4);
        
        let client = null;
       
        try {
            client = await this.connect(databaseName);
            await client.db().collection(collectionName).updateMany(query, { $set: doc }, options || {});
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
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
    static async insertOne(databaseName, collectionName, doc) {
        // Make sure the MongoId isn't included
        delete doc['_id'];

        debug.log(databaseName + '/' + collectionName + '::insertOne ' + JSON.stringify(doc) + '...', this, 4);
        
        let client = null;
       
        try {
            client = await this.connect(databaseName);
            await client.db().collection(collectionName).insertOne(doc);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
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
    static async remove(databaseName, collectionName, query) {
        debug.log(databaseName + '/' + collectionName + '::remove ' + JSON.stringify(query) + '...', this, 4);
        
        let client = null;
       
        try {
            client = await this.connect(databaseName);
            await client.db().collection(collectionName).deleteMany(query, true);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
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
    static async removeOne(databaseName, collectionName, query) {
        debug.log(databaseName + '/' + collectionName + '::removeOne ' + JSON.stringify(query) + '...', this, 4);
       
        let client = null;
        
        try {
            client = await this.connect(databaseName);
            await client.db().collection(collectionName).removeOne(query, true);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
    }    
    
    /**
     * Drops an entire collection
     *
     * @param {String} databaseName
     * @param {String} collectionName
     *
     * @return {Promise} promise
     */
    static async dropCollection(databaseName, collectionName) {
        debug.log(databaseName + '::dropCollection...', this, 4);

        let client = null;
        
        try {
            client = await this.connect(databaseName);
            await client.db().dropCollection(collectionName);
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
    }

    /**
     * Drops an entire database
     *
     * @param {String} databaseName
     *
     * @returns {Promise}
     */
    static async dropDatabase(databaseName) {
        debug.log(databaseName + '::dropDatabase...', this, 4);

        let client = null;
        
        try {
            client = await this.connect(databaseName);
            await client.db().dropDatabase();
        } catch(e) {
            debug.error(e, this);
        } finally {
            client.close();
        }
    }
}

module.exports = DatabaseHelper
