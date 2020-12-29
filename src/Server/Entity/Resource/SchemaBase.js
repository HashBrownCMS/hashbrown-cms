'use strict';

const Path = require('path');

/**
 * The base class for schemas
 *
 * @memberof HashBrown.Server.Entity.Resource
 */
class SchemaBase extends require('Common/Entity/Resource/SchemaBase') {
    /**
     * Creates a new instance of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} data
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Resource.ResourceBase} Instance
     */
    static async create(context, data = {}, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(data, 'data', Object, true);
        checkParam(data.parentId, 'data.parentId', String, true);
        checkParam(options, 'options', Object, true);

        let parent = await this.get(context, data.parentId, { withParentFields: true });

        if(!parent) {
            throw new Error(`Parent schema ${data.parentId} could not be found`);
        }

        data.defaultTabId = parent.defaultTabId;
        data.customIcon = parent.icon;
        data.type = parent.type;

        return await super.create(context, data, options);
    }
    
    /**
     * Gets a schema by id
     *
     * @param {HashBrown.Entity.Context} context
     * @param {String} id
     * @param {Object} options
     *
     * @return {HashBrown.Entity.Schema.SchemaBase} Schema
     */
    static async get(context, id, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(id, 'id', String);
        checkParam(options, 'options', Object);

        if(!id) { return null; }

        let resource = null;

        // First attempt fetch from disk
        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', '*', id + '.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', '*', id + '.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);
            let schemaPath = corePaths[0] || pluginPaths[0];
       
            if(schemaPath) {
                let stats = await HashBrown.Service.FileService.stat(schemaPath);
                let data = await HashBrown.Service.FileService.read(schemaPath);
                data = JSON.parse(data);

                let parentDirName = Path.dirname(schemaPath).split('/').pop();
                
                // Convert from uischema.org
                if(data['@type']) {
                    if(parentDirName === 'content') {
                        data = HashBrown.Entity.Resource.ContentSchema.convertFromUISchema(data, context.user.locale);
                    } else if(parentDirName === 'field') {
                        data = HashBrown.Entity.Resource.FieldSchema.convertFromUISchema(data, context.user.locale);
                    }
                }

                data.id = id;
                data.type = parentDirName.toLowerCase();
                data.isLocked = true;
                data.updatedOn = stats.mtime;

                data.context = context;

                resource = this.new(data);
            }
        }

        // Then attempt normal fetch
        if(!resource) {
            resource = await super.get(context, id, options);
        }
       
        if(!resource) { return null; }

        // Get parent fields, if specified
        if(options.withParentFields && resource.parentId) {
            let parent = await this.get(context, resource.parentId, options);
           
            if(parent) {
                resource = this.merge(resource, parent);
            }
        }
     
        resource.context = context;

        return resource;
    }
    
    /**
     * Gets a list of instances of this entity type
     *
     * @param {HashBrown.Entity.Context} context
     * @param {Object} options
     *
     * @return {Array} Instances
     */
    static async list(context, options = {}) {
        checkParam(context, 'context', HashBrown.Entity.Context, true);
        checkParam(options, 'options', Object, true);
  
        let list = [];

        if(this.type && !options.type) {
            options.type = this.type;
        }

        // Read from disk
        if(!options.customOnly) {
            let corePath = Path.join(APP_ROOT, 'schema', options.type || '*', '*.json');
            let corePaths = await HashBrown.Service.FileService.list(corePath);
            
            let pluginPath = Path.join(APP_ROOT, 'plugins', '*', 'schema', options.type || '*', '*.json');
            let pluginPaths = await HashBrown.Service.FileService.list(pluginPath);

            for(let schemaPath of corePaths.concat(pluginPaths)) {
                let stats = await HashBrown.Service.FileService.stat(schemaPath);
                let data = await HashBrown.Service.FileService.read(schemaPath);

                data = JSON.parse(data);
                
                let parentDirName = Path.basename(Path.dirname(schemaPath));

                // Convert from uischema.org
                if(data['@type']) {
                    if(parentDirName === 'content') {
                        data = HashBrown.Entity.Resource.ContentSchema.convertFromUISchema(data, context.user.locale);
                    } else if(parentDirName === 'field') {
                        data = HashBrown.Entity.Resource.FieldSchema.convertFromUISchema(data, context.user.locale);
                    }
                }
                
                data.id = Path.basename(schemaPath, '.json');
                data.type = data.type || options.type || parentDirName;
                data.isLocked = true;
                data.updatedOn = stats.mtime;

                if(!data.parentId && data.id !== data.type + 'Base') {
                    data.parentId = data.type + 'Base';
                }

                data.context = context;
                
                let resource = this.new(data);
                
                if(!resource) { continue; }

                list.push(resource);
            }
        }

        // Read custom schemas (and make sure they're unique)
        let allSchemas = {};
        let custom = await super.list(context, options);

        for(let schema of list.concat(custom)) {
            allSchemas[schema.id] = schema;
        }

        list = Object.values(allSchemas);

        // Post process
        for(let i = list.length - 1; i >= 0 ; i--) {
            // Remove all schema without a "type" value
            if(!list[i].type) {
                list.splice(i, 1);
                continue;
            }

            // Get parent fields, if specified
            if(options.withParentFields && list[i].parentId) {
                let parent = await this.get(context, list[i].parentId, options);
               
                if(parent) {
                    list[i] = this.merge(list[i], parent);
                }
            }
        }

        return list;
    }
    
    /**
     * Saves the current state of this entity
     *
     * @param {Object} options
     */
    async save(options = {}) {
        checkParam(options, 'options', Object, true);

        await super.save(options);

        // Save children to modify their update date (this will work recursively)
        for(let child of await this.getChildren()) {
            await child.save();
        }
    }
   
    /**
     * Converts fields from uischema.org format
     *
     * @param {Object} params
     *
     * @return {Object} Definition
     */
    static convertFromUISchema(params) {
        return params;
    }

    /**
     * Translates a type name frmom uischema.org format
     *
     * @param {String} name
     *
     * @return {String} Name
     */
    static translateTypeFromUISchema(name) {
        return {
            'ItemList': 'array',
            'Number': 'number',
            'StructuredValue': 'struct',
            'Boolean': 'boolean',
            'CreativeWork': 'contentReference',
            'AudioObject': 'mediaReference',
            'MediaObject': 'mediaReference',
            'VideoObject': 'mediaReference',
            'ImageObject': 'mediaReference',
            'DataDownload': 'mediaReference',
            'Text': 'string',
            'URL': 'url',
            'MultiLineText': 'string',
            'RichText': 'richText',
            'Enumeration': 'dropdown',
            'Date': 'date',
            'DateTime': 'date'
        }[name] || name;
    }

    /**
     * Transforms a uischema.org definition to the HashBrown standard
     *
     * @param {String} key
     * @param {*} definition
     * @param {Object} i18n
     *
     * @return {Object} Definition
     */
    static getFieldFromUISchema(key, definition, i18n) {
        // First a sanity check
        if(
            !key || key[0] === '@' ||
            !definition || (
                definition.constructor !== Object &&
                definition.constructor !== Array &&
                definition.constructor !== String
            )
        ) { return null; }

        if(!i18n) {
            i18n = {};
        }

        if(definition.constructor === String) {
            definition = {
                '@type': definition
            };
        
        } else if(definition.constructor === Array) {
            definition = {
                '@type': 'ItemList',
                '@options': definition
            };
        
        } else if(definition.constructor === Object && !definition['@type']) {
            definition['@type'] = 'StructuredValue';
        
        }

        if(!definition['@type']) { return null; }

        let isLocalized = definition['@config'] && definition['@config']['isLocalized'] === true;

        switch(definition['@type']) {
            case 'ItemList':
                let allowedSchemas = [];

                for(let schemaId of definition['@options'] || []) {
                    allowedSchemas.push(this.translateTypeFromUISchema(schemaId));
                }

                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'array',
                    config: {
                        allowedSchemas: allowedSchemas,
                        minItems: definition['@min'] || 0,
                        maxItems: definition['@max'] || 0
                    }
                };

            case 'Number': 
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'number',
                };

            case 'StructuredValue':
                let struct = {};

                for(let key in definition) {
                    let def = this.getFieldFromUISchema(key, definition[key], i18n[key]);

                    if(!def) { continue; }

                    struct[key] = def;
                }

                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'struct',
                    config: {
                        struct: struct
                    }
                };

            case 'Boolean':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'boolean'
                };

            case 'CreativeWork':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'contentReference'
                };

            case 'AudioObject':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'audio/*' ]
                    }
                };
            
            case 'VideoObject':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'video/*' ]
                    }
                };

            case 'DataDownload':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'application/*' ]
                    }
                };

            case 'ImageObject':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'image/*' ]
                    }
                };

            case 'MediaObject':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'mediaReference'
                };

            case 'Text':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'string'
                };

            case 'URL':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'url'
                };

            case 'MultiLineText':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'string',
                    config: {
                        isMultiLine: true
                    }
                };

            case 'RichText':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'richText'
                };

            case 'Enumeration':
                let options = {};

                if(Array.isArray(definition['@options'])) {
                    for(let i = 0; i < definition['@options'].length; i++) {
                        let key = definition['@options'][i];
                        let label = i18n['@options'] && i18n['@options'][i] ? i18n['@options'][i] : key;

                        options[label] = key;
                    }
                }

                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'dropdown',
                    config: {
                        options: options
                    }
                };

            case 'Date':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'date',
                    config: {
                        isDateOnly: true
                    }
                };

            case 'DateTime':
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: 'date'
                };

            default:
                return {
                    label: i18n['@name'] || key,
                    isLocalized: isLocalized,
                    schemaId: definition['@type']
                };
        }
    }
}

module.exports = SchemaBase;
