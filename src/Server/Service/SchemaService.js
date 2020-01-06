'use strict';

const FileSystem = require('fs');
const Path = require('path');

/**
 * The helpers class for Schema
 *
 * @memberof HashBrown.Server.Service
 */
class SchemaService extends require('Common/Service/SchemaService') {
    /**
     * Gets a list of native schema objects
     *
     * @returns {Promise} Array of Schema
     */
    static async getNativeSchemas() {
        let path = Path.join(APP_ROOT, 'schema', '*', '*.json');
        let paths = await HashBrown.Service.FileService.list(path);
        
        // Native Schema output
        let nativeSchemas = [];

        for(let schemaPath of paths) {
            let data = await HashBrown.Service.FileService.read(schemaPath);

            let properties = JSON.parse(data);
            let parentDirName = Path.dirname(schemaPath).split('/').pop();
            let id = Path.basename(schemaPath, '.json');

            let schema = null;
            
            switch(parentDirName) {
                case 'content':
                    schema = new HashBrown.Entity.Resource.Schema.ContentSchema(properties);
                    break;
                case 'field':
                    schema = new HashBrown.Entity.Resource.Schema.FieldSchema(properties);
                    break;
            }

            // Generated values, will be overwritten every time
            schema.id = id;
            schema.isLocked = true;

            // Add the loaded schema to the output array
            nativeSchemas.push(schema);
        }

        return nativeSchemas;
    }
    
    /**
     * Gets a list of all custom schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schema
     */
    static async getCustomSchemas(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.schemas';
        let result = [];
       
        let schemas = await HashBrown.Service.DatabaseService.find(project, collection, {})
        
        for(let i in schemas) {
            schemas[i] = this.getEntity(schemas[i]);
        }

        return await HashBrown.Service.SyncService.mergeResource(project, environment, 'schemas', schemas, { customOnly: true });
    }

    /**
     * Gets a list of all schema objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @returns {Promise} Array of Schema
     */
    static async getAllSchemas(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let nativeSchemas = await this.getNativeSchemas();
        let customSchemas = await this.getCustomSchemas(project, environment);
        
        return nativeSchemas.concat(customSchemas);
    }

    /**
     * Gets a native Schema by id
     *
     * @param {String} id
     *
     * @returns {Schema} Schema
     */
    static async getNativeSchema(id) {
        checkParam(id, 'id', String, true);
        
        let path = Path.join(APP_ROOT, 'schema', '*', id + '.json');
        let paths = await HashBrown.Service.FileService.list(path);

        if(paths.length < 1) { throw new Error('Native schema "' + id + '" could not be found'); }

        let schemaPath = paths[0];
        let data = await HashBrown.Service.FileService.read(schemaPath);
        let properties = JSON.parse(data);
        let parentDirName = Path.dirname(schemaPath).split('/').pop();

        // Generated values, will be overwritten every time
        properties.id = id;
        properties.type = parentDirName.toLowerCase();
        properties.isLocked = true;

        return properties;
    }

    /**
     * Gets a Schema by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Boolean} withParentFields
     *
     * @return {Schema} Schema
     */
    static async getSchemaById(project, environment, id, withParentFields = false) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(id, 'id', String, true);
        checkParam(withParentFields, 'withParentFields', Boolean, true);

        let schema = null;
       
        try {
            schema = await this.getNativeSchema(id);
        } catch(e) {
            schema = await HashBrown.Service.DatabaseService.findOne(project, environment + '.schemas', { id: id });
        }
        
        if(!schema) {
            schema = await HashBrown.Service.SyncService.getResourceItem(project, environment, 'schemas', id);
        }

        if(!schema) { throw new Error('Schema "' + id + '" could not be found'); }

        // Get parent fields if specified
        if(withParentFields && schema.parentSchemaId) {
            let childSchema = this.getEntity(schema);
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.getSchemaById(project, environment, childSchema.parentSchemaId);
                
                mergedSchema = this.mergeSchema(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }
            
            return mergedSchema;
        }
            
        return this.getEntity(schema);
    }
   
    /**
     * Removes a Schema object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     */
    static async removeSchemaById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        let collection = environment + '.schemas';
      
        // First get the Schema object
        let thisSchema = await this.getSchemaById(project, environment, id)

        // Then get all custom Schemas
        let customSchemas = await this.getCustomSchemas(project, environment);
        
        // Then check if any custom Schema use this one as a parent
        for(let customSchema of customSchemas) {
            if(customSchema.parentSchemaId != thisSchema.id) { continue; }

            // If it does use this schema as a parent, make it use its grandparent instead
            customSchema.parentSchemaId = thisSchema.parentSchemaId;

            await this.setSchemaById(project, environment, customSchema.id, customSchema);
        }

        // Then remove the requested Schema
        await HashBrown.Service.DatabaseService.removeOne(project, collection, { id: id });
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
    static async duplicateIdCheck(project, environment, oldId, newId) { 
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(oldId, 'oldId', String);
        checkParam(newId, 'newId', String);
        
        // If the id wasn't updated, skip the check
        if(oldId === newId) { return false; }

        try {
            await this.getSchemaById(project, environment, newId);
            return true;
        } catch(e) {
            return false;
        }
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

                if(type && type['@type']) {
                    type = type['@type'];
                }

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
                    if(json['@type'] === 'Image' && key === 'src') {
                        def.schemaId = 'mediaReference';
                    
                    } else if(type === 'int') {
                        def.schemaId = 'number';
                        def.config = {
                            step: 0
                        };
                   
                    } else if(type === 'float') {
                        def.schemaId = 'number';
                        def.config = {
                            step: false
                        };
                    
                    } else if(type === 'bool') {
                        def.schemaId = 'boolean';
                    
                    } else if(type === 'text') {
                        def.schemaId = 'string';
                        def.config = {
                            isMultiLine: true
                        };
                    
                    } else if(type === 'html') {
                        def.schemaId = 'richText';

                    } else {
                        def.schemaId = getId(type);

                    }
                
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

        let uiSchema = new HashBrown.Entity.Resource.Schema.FieldSchema({
            id: getId(json['@type']),
            name: json['@i18n'][language]['@name'],
            parentSchemaId: json['@parent'] ? getId(json['@parent']) : 'struct',
            editorId: 'StructEditor',
            config: {
                label: json['@label'] || '',
                struct: getFields(json, json['@i18n'][language])
            }
        });
      
        try {
            await this.getSchemaById(project, environment, uiSchema.parentSchemaId);
        } catch(e) {
            throw new Error('Schema "' + uiSchema.name + '" depends on "' + json['@parent'] + '", which failed with the following error: ' + e.message);
        }

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
    static async setSchemaById(project, environment, id, schema, create = false) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(schema, 'schemas', HashBrown.Entity.Resource.Schema.SchemaBase);

        let collection = environment + '.schemas';
       
        schema = schema || {};

        // Unset automatic flags
        schema.isLocked = false;

        schema.sync = schema.sync || {};
        schema.sync = {
            isRemote: false,
            hasRemote: false
        };

        if(!create) {
            await this.getSchemaById(project, environment, id);
        }

        let isDuplicate = await this.duplicateIdCheck(project, environment, id, schema.id);
        
        if(isDuplicate) {
            throw new Error('The Schema id "' + schema.id + '" already exists.');
        }   

        await HashBrown.Service.DatabaseService.updateOne(project, collection, { id: id }, schema, { upsert: create });
        
        return this.getEntity(schema);
    }

    /**
     * Creates a new Schema
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} parentSchemaId
     *
     * @returns {HashBrown.Entity.Resource.Schema.SchemaBase} Created Schema
     */
    static async createSchema(project, environment, parentSchemaId) {
        checkParam(project, 'project', String, true);
        checkParam(environment, 'environment', String, true);
        checkParam(parentSchemaId, 'parentSchemaId', String, true);

        let collection = environment + '.schemas';
        let parentSchema = await this.getSchemaById(project, environment, parentSchemaId);
        let newSchema = HashBrown.Entity.Resource.Schema.SchemaBase.create(parentSchema);

        await HashBrown.Service.DatabaseService.insertOne(project, collection, newSchema.getObject());

        return newSchema;
    }
}

module.exports = SchemaService;
