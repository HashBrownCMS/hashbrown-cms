'use strict';

const SchemaHelperCommon = require('Common/Helpers/SchemaHelper');

const FileSystem = require('fs');
const Path = require('path');

// TODO: Make this a GIT submodule
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
            Glob(APP_ROOT + '/src/Common/Schemas/*/*.json', function(err, paths) {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    let queue = paths || [];

                    // Native Schemas output
                    let nativeSchemas = [];

                    if(queue.length > 0) {
                        let readNextSchema = () => {
                            let schemaPath = queue[0];

                            FileSystem.readFile(schemaPath, (err, data) => {
                                if(err) {
                                    throw err;
                                }

                                let properties = JSON.parse(data);
                                let parentDirName = Path.dirname(schemaPath).split('/').pop();
                                let id = Path.basename(schemaPath, '.json');

                                // Generated values, will be overwritten every time
                                properties.id = id;

                                let schema;
                                
                                switch(parentDirName) {
                                    case 'Content':
                                        schema = new HashBrown.Models.ContentSchema(properties);
                                        break;
                                    case 'Field':
                                        schema = new HashBrown.Models.FieldSchema(properties);
                                        break;
                                }

                                // Make sure the 'locked' flag is true
                                schema.isLocked = true;

                                // Add the loaded schema to the output array
                                nativeSchemas.push(schema);

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
                        resolve([]);

                    }
                }
            }); 
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
    static getCustomSchemas(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.schemas';
        let result = [];
       
        return HashBrown.Helpers.DatabaseHelper.find(
            project,
            collection,
            {}
        )
        .then((schemas) => {
            for(let i in schemas) {
                schemas[i] = this.getModel(schemas[i]);
            }

            return HashBrown.Helpers.SyncHelper.mergeResource(project, environment, 'schemas', schemas, { customOnly: true });
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
    static getAllSchemas(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return this.getNativeSchemas()
        .then((nativeSchemas) => {
            return this.getCustomSchemas(project, environment)
            .then((customSchemas) => {
                return Promise.resolve(nativeSchemas.concat(customSchemas));
            });
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
        let fieldPath = APP_ROOT + '/src/Common/Schemas/Field/' + id + '.json';
        let contentPath = APP_ROOT + '/src/Common/Schemas/Content/' + id + '.json';
    
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
            Glob(APP_ROOT + '/src/Common/Schemas/*/' + id + '.json', function(err, paths) {
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
                            let id = Path.basename(schemaPath, '.json');

                            // Generated values, will be overwritten every time
                            properties.id = id;
                            properties.type = parentDirName.toLowerCase();
                            properties.isLocked = true;

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
     * @param {String} id
     *
     * @return {Promise} Schema
     */
    static getSchemaById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.schemas';

        if(!id) {
            return Promise.reject(new Error('Schema id is null'));
        }

        let promise = this.isNativeSchema(id) ?
            this.getNativeSchema(id) :
            HashBrown.Helpers.DatabaseHelper.findOne(
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
                return Promise.resolve(schemaData);
            
            } else {
                return HashBrown.Helpers.SyncHelper.getResourceItem(project, environment, 'schemas', id);

            }
        })
        .then((schemaData) => {
            return Promise.resolve(this.getModel(schemaData));  
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
    static getSchemaWithParentFields(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

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
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static removeSchemaById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

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
            return HashBrown.Helpers.DatabaseHelper.removeOne(
                project,
                collection,
                {
                    id: id
                }
            );
        });
    }
    
    /**
     * Checks if a Schema is being updated with an id that already exists
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} oldId
     * @param {String} newId
     *
     * @return {Promise} Check result
     */
    static duplicateIdCheck(project, environment, oldId, newId) { 
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(oldId, 'oldId', String);
        checkParam(newId, 'newId', String);
        
        // If the id wasn't updated, skip the check{
        if(oldId === newId) {
            return Promise.resolve(false);
        }

        return this.getSchemaById(project, environment, newId)
        .then((existingSchema) => {
            return Promise.resolve(!!existingSchema);
        });
    }

    /**
     * Sets a Schema by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {Number} id
     * @param {Schema} schema
     * @param {Boolean} create
     *
     * @return {Promise} Resulting Schema
     */
    static setSchemaById(project, environment, id, schema, create = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(schema, 'schema', HashBrown.Models.Schema);

        let collection = environment + '.schemas';
       
        schema = schema || {};

        // Unset automatic flags
        schema.isLocked = false;

        schema.sync = schema.sync || {};
        schema.sync = {
            isRemote: false,
            hasRemote: false
        };

        return this.duplicateIdCheck(project, environment, id, schema.id)
        .then((isDuplicate) => {
            if(isDuplicate) {
                return Promise.reject(new Error('The Schema id "' + schema.id + '" already exists.'));
            }   

            return HashBrown.Helpers.DatabaseHelper.updateOne(
                project,
                collection,
                {
                    id: id
                },
                schema,
                {
                    upsert: create // Creates a schema if none existed
                }
            );
        }).then(() => {
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
    static createSchema(project, environment, parentSchema) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(parentSchema, 'parentSchema', HashBrown.Models.Schema);

        let collection = environment + '.schemas';
        let newSchema = HashBrown.Models.Schema.create(parentSchema);

        return HashBrown.Helpers.DatabaseHelper.insertOne(
            project,
            collection,
            newSchema.getObject() 
        ).then(() => {
            return Promise.resolve(newSchema);
        });
    }
}

module.exports = SchemaHelper;
