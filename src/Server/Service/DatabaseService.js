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
 * @memberof HashBrown.Server.Service
 */
class DatabaseService {
    /**
     * Gets a database config parameter
     *
     * @param {String} key
     *
     * @return {String} Value
     */
    static getConfig(key) {
        checkParam(key, 'key', String, true);

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
        let config = HashBrown.Service.ConfigService.getSync('database') || {};

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
     * @returns {String} Connection string
     */
    static getConnectionString() {
        let connectionString = this.getConfig('protocol') + '://';
      
        let username = this.getConfig('username');
        let password = this.getConfig('password');
        let host = this.getConfig('host');
        let port = this.getConfig('port');
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

        connectionString += '/';
        
        if(options && Object.keys(options).length > 0) {
            connectionString += '?' + QueryString.stringify(options);
        }

        return connectionString;
    }

    /**
     * Initialises the database client
     */
    static async init() {
        if(this.client) { return; }
        
        this.client = await MongoClient.connect(
            this.getConnectionString(),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        
        HashBrown.Service.EventService.on('stop', 'dbclient', () => {
            if(this.client) {
                this.client.close();
                this.client = null;
            }
        });
    }

    /**
     * Connects to the database
     *
     * @param {String} databaseName
     *
     * @return {MongoClient} Client
     */
    static async connect(databaseName) {
        checkParam(databaseName, 'databaseName', String, true);

        if(!this.client) {
            await this.init();
        }

        if(
            databaseName === 'admin' ||
            databaseName === 'config' ||
            databaseName === 'local'
        ) {   
            return this.client.db(databaseName);
        }
        
        let prefix = this.getConfig('prefix');
            
        return this.client.db(prefix + databaseName);
    }

    /**
     * Restores a database
     *
     * @param {String} databaseName
     * @param {String} timestamp
     */
    static async restore(databaseName, timestamp) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(timestamp, 'timestamp', String, true);

        let archivePath = Path.join(APP_ROOT, 'storage', databaseName, 'dump', timestamp + '.hba');
       
        let archiveContent = await HashBrown.Service.FileService.read(archivePath, 'utf8'); 
        let collections = JSON.parse(archiveContent);

        await this.dropDatabase(databaseName);

        for(let collectionName of Object.keys(collections)) {
            for(let doc of collections[collectionName]) {
                await this.insertOne(databaseName, collectionName, doc)
            }
        }
    }
   
    /**
     * Dumps a database
     *
     * @param {String} databaseName
     *
     * @returns {String} Timestamp
     */
    static async dump(databaseName) {
        checkParam(databaseName, 'databaseName', String, true);

        let dumpPath = Path.join(APP_ROOT, 'storage', databaseName, 'dump');

        // Archive
        await HashBrown.Service.FileService.makeDirectory(dumpPath);

        let timestamp = Date.now();
        let archivePath = Path.join(dumpPath, timestamp + '.hba'); 

        let collections = {};
        
        for(let collection of await this.listCollections(databaseName)) {
            collections[collection.name] = await this.find(databaseName, collection.name, {});
        }
    
        await HashBrown.Service.FileService.write(collections, archivePath);

        return timestamp.toString();
    }

    /**
     * Lists all collections in a database
     *
     * @param {String} databaseName
     *
     * @return {Array} Array of collections
     */
    static async listCollections(databaseName) {
        checkParam(databaseName, 'databaseName', String, true);
        
        let db = await this.connect(databaseName);
        let collections = await db.listCollections().toArray();

        return collections;
    }

    /**
     * Lists all databases
     *
     * @param {Boolean} includeSystem
     *
     * @returns {Array} Database names
     */
    static async listDatabases(includeSystem = false) {
        if(!this.client) {
            await this.init();
        }
        
        let db = await this.connect('admin');
        let result = await db.admin().listDatabases();

        if(!result) { return []; }

        let prefix = this.getConfig('prefix');
        let databases = [];

        for(let i = 0; i < result.databases.length; i++) {
            let database = result.databases[i];

            if(
                !database.empty &&
                (database.name !== prefix + 'system' && !includeSystem) &&
                database.name.indexOf(prefix) === 0
            ) {
                let name = database.name.replace(prefix, '');

                if(!name) { continue; }

                databases.push(name);
            }
        }

        return databases;
    }

    /**
     * Check if a database exists
     *
     * @param {String} databaseName
     *
     * @returns {Boolean} Whether or not database exists
     */
    static async databaseExists(databaseName) {
        checkParam(databaseName, 'databaseName', String, true);
        
        let databases = await this.listDatabases();

        return databases.indexOf(databaseName) > -1;
    }
    
    /**
     * Check if a collection exists
     *
     * @param {String} databaseName
     * @param {String} collectionName
     *
     * @returns {Boolean} Whether or not collection exists
     */
    static async collectionExists(databaseName, collectionName) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        
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
     * @return {Object} Document
     */
    static async findOne(databaseName, collectionName, query, projection = {}) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(projection, 'projection', Object, true);

        // If _id was specified as the only projection parameter, return all fields
        if(projection._id) {
            if(Object.keys(projection).length === 1) {
                projection = {};
            }

        // If _id was not specified, exclude it in the projection
        } else {
            projection._id = 0;
        
        }

        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }

        let db = await this.connect(databaseName);
        let doc = await db.collection(collectionName).findOne(query, projection);

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
     * @return {Array} Documents
     */
    static async find(databaseName, collectionName, query = {}, projection = {}, sort = null) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(projection, 'projection', Object, true);
        checkParam(sort, 'sort', Object);

        // If _id was specified as the only projection parameter, return all fields
        if(projection._id) {
            if(Object.keys(projection).length === 1) {
                projection = {};
            }

        // If _id was not specified, exclude it in the projection
        } else {
            projection._id = 0;
        
        }
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }

        let db = await this.connect(databaseName);
        let docs = await db.collection(collectionName).find(query, { projection: projection })

        if(sort) {
            docs = await docs.sort(sort);
        }

        docs = await docs.toArray();

        return docs;
    }
    
    /**
     * Counts Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     *
     * @return {Number} Number of matching documents
     */
    static async count(databaseName, collectionName, query) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        let db = await this.connect(databaseName);
        let result = await db.collection(collectionName).countDocuments(query);

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
     */
    static async mergeOne(databaseName, collectionName, query, doc, options = {}) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(doc, 'doc', Object, true);
        checkParam(options, 'options', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
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
     */
    static async updateOne(databaseName, collectionName, query, doc, options = {}) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(doc, 'doc', Object, true);
        checkParam(options, 'options', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        // Make sure the MongoId isn't included
        delete doc['_id'];

        let db = await this.connect(databaseName);

        await db.collection(collectionName).updateOne(query, { $set: doc }, options || {});
    }
    
    /**
     * Replaces a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} doc
     * @param {Object} options
     */
    static async replaceOne(databaseName, collectionName, query, doc, options = {}) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(doc, 'doc', Object, true);
        checkParam(options, 'options', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        // Make sure the MongoId isn't included
        delete doc['_id'];

        let db = await this.connect(databaseName);

        await db.collection(collectionName).replaceOne(query, doc, options || {});
    }
    
    /**
     * Updates Mongo documents
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     * @param {Object} doc
     * @param {Object} options
     */
    static async update(databaseName, collectionName, query, doc, options) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        checkParam(doc, 'doc', Object, true);
        checkParam(options, 'options', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        // Make sure the MongoId isn't included
        delete doc['_id'];

        let db = await this.connect(databaseName);
        
        await db.collection(collectionName).updateMany(query, { $set: doc }, options || {});
    }
    
    /**
     * Inserts a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} doc
     */
    static async insertOne(databaseName, collectionName, doc) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(doc, 'doc', Object, true);
        
        // Make sure the MongoId isn't included
        delete doc['_id'];

        let db = await this.connect(databaseName);
    
        await db.collection(collectionName).insertOne(doc);
    }
    
    /**
     * Removes a Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     */
    static async remove(databaseName, collectionName, query) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        let db = await this.connect(databaseName);
        
        await db.collection(collectionName).deleteMany(query, true);
    }    
    
    /**
     * Removes a single Mongo document
     *
     * @param {String} databaseName
     * @param {String} collectionName
     * @param {Object} query
     */
    static async removeOne(databaseName, collectionName, query) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);
        checkParam(query, 'query', Object, true);
        
        // Wrap query _id in ObjectID model
        if(query._id) {
            query._id = new MongoDB.ObjectID(query._id);
        }
        
        let db = await this.connect(databaseName);
    
        await db.collection(collectionName).removeOne(query, true);
    }    
    
    /**
     * Drops an entire collection
     *
     * @param {String} databaseName
     * @param {String} collectionName
     */
    static async dropCollection(databaseName, collectionName) {
        checkParam(databaseName, 'databaseName', String, true);
        checkParam(collectionName, 'collectionName', String, true);

        let exists = await this.collectionExists(databaseName, collectionName);

        if(!exists) { return; }
        
        let db = await this.connect(databaseName);

        await db.dropCollection(collectionName);
    }

    /**
     * Drops an entire database
     *
     * @param {String} databaseName
     */
    static async dropDatabase(databaseName) {
        checkParam(databaseName, 'databaseName', String, true);
        
        let db = await this.connect(databaseName);
        
        await db.dropDatabase();
    }
}

module.exports = DatabaseService
