'use strict';

const Schema = require('Server/Models/Schema');
const FieldSchema = require('Server/Models/FieldSchema');
const ContentSchema = require('Server/Models/ContentSchema');

const SchemaHelperCommon = require('Common/Helpers/SchemaHelper');
const MongoHelper = require('Server/Helpers/MongoHelper');
const SyncHelper = require('Server/Helpers/SyncHelper');

const FileSystem = require('fs');
const Path = require('path');
const Glob = require('glob');

/**
 * The helpers class for Schemas
 *
 * @memberof HashBrown.Server.Helpers
 */
class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets a list of native schema objects
     *
     * @returns {Promise} Array of Schemas
     */
    static getNativeSchemas() {
        return new Promise((resolve, reject) => {
            if(!this.nativeSchemas) {
                Glob(appRoot + '/src/Common/Schemas/*/*.schema', function(err, paths) {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        let queue = paths || [];

                        // Native Schemas output
                        let nativeSchemas = {};

                        if(queue.length > 0) {
                            let readNextSchema = () => {
                                let schemaPath = queue[0];

                                FileSystem.readFile(schemaPath, (err, data) => {
                                    if(err) {
                                        throw err;
                                    }

                                    let properties = JSON.parse(data);
                                    let parentDirName = Path.dirname(schemaPath).split('/').pop();
                                    let id = Path.basename(schemaPath, '.schema');

                                    // Generated values, will be overwritten every time
                                    properties.id = id;

                                    let schema;
                                    
                                    switch(parentDirName) {
                                        case 'Content':
                                            schema = new ContentSchema(properties);
                                            break;
                                        case 'Field':
                                            schema = new FieldSchema(properties);
                                            break;
                                    }

                                    // Make sure the 'locked' flag is true
                                    schema.locked = true;

                                    // Add the loaded schema to the output array
                                    nativeSchemas[schema.id] = schema;

                                    // Shift the queue (removes the first element of the array)
                                    queue.shift();

                                    // If the queue still has items in it, we should continue reading...
                                    if(queue.length > 0) {
                                        readNextSchema();

                                    // ...if not, we'll return all the loaded schemas
                                    } else {
                                        resolve(nativeSchemas);
                                    
                                    }
                                });
                            }

                            readNextSchema();

                        } else {
                            resolve({});

                        }
                    }
                }); 
            } else {
                resolve(this.nativeSchemas);

            }
        });
    }
    
    /**
     * Gets a list of all custom schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schemas
     */
    static getCustomSchemas(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let collection = environment + '.schemas';
        let result = [];
       
        return MongoHelper.find(
            project,
            collection,
            {}
        )
        .then((result) => {
            let schemas = {};

            for(let i in result) {
                let schema = this.getModel(result[i]);

                if(schema) {
                    schemas[schema.id] = schema;
                
                } else {
                    return new Promise((resolve, reject) => {
                        reject(new Error('Schema data from DB is incorrect format: ' + JSON.stringify(result[i])));
                    });
                }
            }

            return SyncHelper.mergeResource(project, environment, 'schemas', schemas, { customOnly: true });
        });
    }

    /**
     * Gets a list of all schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schemas
     */
    static getAllSchemas(
        project = requiredParam('project'),
        environment = requiredParam('environment')
    ) {
        let nativeSchemas;
        let customSchemas;

        return this.getNativeSchemas()
        .then((result) => {
            nativeSchemas = result;

            return this.getCustomSchemas(project, environment);
        })
        .then((result) => {
            customSchemas = result;

            let allSchemas = {};
            
            for(let id in nativeSchemas) {
                allSchemas[id] = nativeSchemas[id];   
            }
            
            for(let id in customSchemas) {
                allSchemas[id] = customSchemas[id];
            }

            return Promise.resolve(allSchemas);
        });
    }

    /**
     * Checks whether a Schema id belongs to a native schema
     *
     * @param {String} id
     *
     * @returns {Boolean} isNative
     */
    static isNativeSchema(id) {
        let fieldPath = appRoot + '/src/Common/Schemas/Field/' + id + '.schema';
        let contentPath = appRoot + '/src/Common/Schemas/Content/' + id + '.schema';
    
        try {
            FileSystem.statSync(fieldPath);
            return true;
        
        } catch(e) {
            try {
                FileSystem.statSync(contentPath);
                return true;

            } catch(e) {
                return false;

            }
        }
    }

    /**
     * Gets a native Schema by id
     *
     * @param {String} id
     *
     * @returns {Promise} Schema
     */
    static getNativeSchema(id) {
        return new Promise((resolve, reject) => {
            Glob(appRoot + '/src/Common/Schemas/*/' + id + '.schema', function(err, paths) {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    let schemaPath = paths[0];

                    FileSystem.readFile(schemaPath, (err, data) => {
                        if(err) {
                            reject(new Error(err));
                        
                        } else {
                            let properties = JSON.parse(data);
                            let parentDirName = Path.dirname(schemaPath).split('/').pop();
                            let id = Path.basename(schemaPath, '.schema');

                            // Generated values, will be overwritten every time
                            properties.id = id;
                            properties.type = parentDirName.toLowerCase();
                            properties.locked = true;

                            resolve(properties);
                        }
                    });
                }
            });
        });
    }

    /**
     * Gets a Schema by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     *
     * @return {Promise} Schema
     */
    static getSchemaById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        let collection = environment + '.schemas';

        if(!id) {
            return Promise.reject(new Error('Schema id is null'));
        }

        let promise = this.isNativeSchema(id) ?
            this.getNativeSchema(id) :
            MongoHelper.findOne(
                project,
                collection
                ,
                {
                    id: id
                }
            );
        
        return promise
        .then((schemaData) => {
            if(schemaData && Object.keys(schemaData).length > 0) {
                return Promise.resolve(this.getModel(schemaData));
            
            } else {
                return SyncHelper.getResourceItem(project, environment, 'schemas', id);

            }
        });
    }
   
    /**
     * Gets all parent fields
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @returns {Promise} Schema with all aprent fields
     */
    static getSchemaWithParentFields(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        // Get the Schema by id
        return this.getSchemaById(project, environment, id)

        // Return object along with any parent objects
        .then((schema) => {
            if(!schema) {
                return Promise.reject(new Error('Schema by id "' + id + '" could not be found'));
            }

            // If this Schema has a parent, merge fields with it
            if(schema.parentSchemaId) {
                return this.getSchemaWithParentFields(project, environment, schema.parentSchemaId)
                .then((parentSchema) => {
                    let mergedSchema = this.mergeSchemas(schema, parentSchema);

                    return Promise.resolve(mergedSchema);
                });
            }

            // If this Schema doesn't have a parent, return this Schema
            let model = this.getModel(schema);
            
            return Promise.resolve(model);
        });
    }

    
    /**
     * Removes a Schema object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     *
     * @return {Promise} Promise
     */
    static removeSchemaById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id')
    ) {
        let collection = environment + '.schemas';
        let thisSchema;
      
        // First get the Schema object
        return this.getSchemaById(project, environment, id)

        // Then get all custom Schemas
        .then((result) => {
            thisSchema = result;

            return this.getCustomSchemas(project, environment);
        })
        
        // Then check if any custom Schemas use this one as a parent
        .then((customSchemas) => {
            let checkNext = () => {
                // Get next Schema
                let customSchema;
                
                for(let id in customSchemas) {
                    customSchema = customSchemas[id];
                    delete customSchemas[id];
                    break;
                }

                // If there are no more Schemas to check, resolve
                if(!customSchema) { return Promise.resolve(); }

                // If this custom Schema does not use the parent Schema, proceed to next
                if(customSchema.parentSchemaId != thisSchema.id) { return checkNext(); }

                // If it does use this parent, make it use its grandparent instead
                customSchema.parentSchemaId = thisSchema.parentSchemaId;

                return this.setSchemaById(project, environment, customSchema.id, customSchema)
                .then(() => {
                    return checkNext();  
                });
            };

            return checkNext();
        })

        // Then remove the requested Schema
        .then(() => {
            return MongoHelper.removeOne(
                project,
                collection,
                {
                    id: id
                }
            );
        });
    }
    
    /**
     * Sets a schema object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     * @param {Object} schema
     * @param {Boolean} create
     *
     * @return {Promise} Resulting Schema
     */
    static setSchemaById(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        id = requiredParam('id'),
        schema = requiredParam('schema'),
        create = false
    ) {
        let collection = environment + '.schemas';
       
        schema = schema || {};

        // Unset automatic flags
        schema.locked = false;
        schema.remote = false;

        return MongoHelper.updateOne(
            project,
            collection,
            {
                id: id
            },
            schema,
            {
                upsert: create // Creates a schema if none existed
            }
        ).then(() => {
            return Promise.resolve(this.getModel(schema));
        });
    }

    /**
     * Creates a new Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {Schema} parentSchema
     *
     * @returns {Promise} Created Schema
     */
    static createSchema(
        project = requiredParam('project'),
        environment = requiredParam('environment'),
        parentSchema = requiredParam('parentSchema')
    ) {
        let collection = environment + '.schemas';
        let newSchema = Schema.create(parentSchema);

        return MongoHelper.insertOne(
            project,
            collection,
            newSchema.getObject() 
        ).then(() => {
            return Promise.resolve(newSchema);
        });
    }
}

module.exports = SchemaHelper;
