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
     * @param {Boolean} withParentFields
     *
     * @return {Promise} Schema
     */
    static async getSchemaById(project, environment, id, withParentFields = false) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(id, 'id', String, true);
        checkParam(withParentFields, 'withParentFields', Boolean, true);

        let schema = null;
        
        if(this.isNativeSchema(id)) {
            schema = await this.getNativeSchema(id);
        } else {
            let collection = environment + '.schemas';

            schema = await HashBrown.Helpers.DatabaseHelper.findOne(project, collection, { id: id });
        }
        
        // Get parent fields if specified
        if(withParentFields && schema.parentSchemaId) {
            let childSchema = this.getModel(schema);
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.getSchemaById(project, environment, childSchema.parentSchemaId);
                
                mergedSchema = this.mergeSchemas(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }

            return mergedSchema;
        }
        
        return this.getModel(schema);
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
     * Imports a uischema.org schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {Object} json
     * @param {String} language
     */
    static async importSchema(project, environment, json, language = 'en') {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(json, 'json', Object);
       
        let getId = (type) => {
            return type[0].toLowerCase() + type.substring(1);
        }

        let getFields = (json, i18n) => {
            let fields = {};
           
            for(let key in json) {
                if(key[0] === '@') { continue; }

                let info = i18n[key] || {};
                let type = json[key];

                if(!type) { throw new Error('Type for key "' + key + '" was null'); }

                let def = {
                    label: info['@name'] || '(no name)',
                    description: info['@description'] || '(no description)'
                };

                if(Array.isArray(type)) {
                    let allowedSchemas = [];

                    for(let t of type) {
                        allowedSchemas.push(getId(t));
                    }

                    def.schemaId = 'array';
                    def.config = {
                        allowedSchemas: allowedSchemas 
                    };

                } else if(typeof type === 'string') {
                    // Special cases
                    if(json['@type'] === 'Image') {
                        type = 'mediaReference';
                    }

                    def.schemaId = getId(type);
                
                } else if(typeof type === 'object') {
                    def.schemaId = 'struct';
                    def.config = {
                        struct: getFields(type, i18n[key] || {})
                    };
                
                }

                fields[key] = def;
            }

            return fields;
        }

        let uiSchema = new HashBrown.Models.FieldSchema({
            id: getId(json['@type']),
            name: json['@i18n'][language]['@name'],
            parentSchemaId: json['@parent'] ? getId(json['@parent']) : 'struct',
            editorId: 'StructEditor',
            config: {
                struct: getFields(json, json['@i18n'][language])
            }
        });
        
        await this.setSchemaById(project, environment, uiSchema.id, uiSchema, true);
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
     * @param {String} parentSchemaId
     *
     * @returns {HashBrown.Models.Schema} Created Schema
     */
    static async createSchema(project, environment, parentSchemaId) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(parentSchemaId, 'parentSchemaId', String, true);

        let collection = environment + '.schemas';
        let parentSchema = await this.getSchemaById(project, environment, parentSchemaId);
        let newSchema = HashBrown.Models.Schema.create(parentSchema);

        await HashBrown.Helpers.DatabaseHelper.insertOne(project, collection, newSchema.getObject());

        return newSchema;
    }
}

module.exports = SchemaHelper;
