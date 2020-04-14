'use strict';

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class SchemaBase extends HashBrown.Entity.Resource.ResourceBase {
    static get icon() { return 'cogs'; }
    set icon(name) { this.customIcon = name; }
    get icon() { return this.customIcon || super.icon; }

    static get category() { return 'schemas'; }
    
    static get type() { return null; }
    get type() { return this.constructor.type; }
   

    /**
     * Instantiates a resource
     *
     * @param {Object} params
     *
     * @return {HashBrown.Entity.Resource.SchemaBase} Instance
     */
    static new(params = {}) {
        checkParam(params, 'params', Object)

        params = params || {};
        
        if(!params.type) {
            return null;
        }
        
        if(params.type === 'field') {
            return new HashBrown.Entity.Resource.FieldSchema(params);
        } else if(params.type === 'content') {
            return new HashBrown.Entity.Resource.ContentSchema(params);
        }
            
        throw new Error(`Invalid schema type "${params.type}"`);
    }

    /**
     * Constructor
     *
     * @param {Object} params
     */
    constructor(params) {
        params = params || {};

        super(params);

        if(this.constructor === HashBrown.Entity.Resource.SchemaBase) {
            throw new Error('The HashBrown.Entity.Resource.SchemaBase constructor cannot be used directly');
        }
    }
    
    /**
     * Gets the human readable name
     *
     * @return {String} Name
     */
    getName() {
        return this.name || this.id;
    }
    
    /**
     * Gets a copy of every field in this object as a mutable object
     *
     * @returns {Object} object
     */
    getObject() {
        let object = super.getObject();

        object.type = this.type;

        return object;
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'name');
        this.def(String, 'customIcon');
        this.def(String, 'parentId');
        this.def(Object, 'config', {});
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        // Adopt old value names
        if(params.parentSchemaId) {
            params.parentId = params.parentSchemaId;
            delete params.parentSchemaId;
        }

        if(params.icon) {
            params.customIcon = params.icon;
            delete params.icon;
        }

        // Remove type field, as this is indicated by the model
        delete params.type;

        super.adopt(params);
    }

    /**
     * Gets a URL safe name for this schema
     */
    getUrlSafeName() {
        return this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
   
    /**
     * Merges two sets of schema data
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} childSchema
     * @param {HashBrown.Entity.Resource.SchemaBase} parentSchema
     *
     * @returns {HashBrown.Entity.Resource.SchemaBase} Merged Schema
     */
    static merge(childSchema, parentSchema) {
        checkParam(childSchema, 'childSchema', HashBrown.Entity.Resource.SchemaBase, true);
        checkParam(parentSchema, 'parentSchema', HashBrown.Entity.Resource.SchemaBase, true);

        let mergedSchema = parentSchema;

        // Recursive merge
        function merge(parentValues, childValues) {
            for(let k in childValues) {
                if(typeof parentValues[k] === 'object' && typeof childValues[k] === 'object') {
                    merge(parentValues[k], childValues[k]);
                
                } else if(childValues[k]) {
                    parentValues[k] = childValues[k];
                
                }
            }
        }

        // Overwrite common values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentId = childSchema.parentId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;
        mergedSchema.isLocked = childSchema.isLocked || false;

        // Merge config
        if(!mergedSchema.config) { mergedSchema.config = {}; }
        if(!childSchema.config) { childSchema.config = {}; }

        merge(mergedSchema.config, childSchema.config);
        
        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'field':
                mergedSchema.editorId = childSchema.editorId || mergedSchema.editorId;
                break;

            case 'content':
                // Merge tabs
                if(!mergedSchema.tabs) { mergedSchema.tabs = {}; }
                if(!childSchema.tabs) { childSchema.tabs = {}; }
               
                merge(mergedSchema.tabs, childSchema.tabs);

                // Set default tab id
                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return mergedSchema;
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
        if(!definition) { return null; }

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

        if(!definition['@type']) {
            throw new Error(`No @type field for definition ${JSON.stringify(definition)}`);
        }

        switch(definition['@type']) {
            case 'ItemList':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'array',
                    config: {
                        allowedSchemas: definition['@options']
                    }
                };

            case 'Number': 
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'number'
                };

            case 'StructuredValue':
                let struct = {};

                for(let key in definition) {
                    if(key[0] === '@') { continue; }

                    struct[key] = this.getFieldFromUISchema(definition[key], i18n[k]);
                }

                return {
                    label: i18n['@name'] || key,
                    schemaId: 'struct',
                    config: {
                        struct: struct
                    }
                };

            case 'Boolean':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'boolean'
                };

            case 'CreativeWork':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'contentReference'
                };

            case 'AudioObject':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'audio/*' ]
                    }
                };
            
            case 'VideoObject':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'video/*' ]
                    }
                };

            case 'DataDownload':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'application/*' ]
                    }
                };

            case 'ImageObject':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'mediaReference',
                    config: {
                        allowedTypes: [ 'image/*' ]
                    }
                };

            case 'MediaObject':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'mediaReference'
                };

            case 'Text':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'string'
                };

            case 'URL':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'url'
                };

            case 'MultiLineText':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'string',
                    config: {
                        isMultiLine: true
                    }
                };

            case 'RichText':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'richText'
                };

            case 'Enumeration':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'dropdown',
                    config: {
                        options: i18n['@options'] || {}
                    }
                };

            case 'Date':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'date',
                    config: {
                        isDateOnly: true
                    }
                };

            case 'DateTime':
                return {
                    label: i18n['@name'] || key,
                    schemaId: 'date'
                };

            default:
                return {
                    label: i18n['@name'] || key,
                    schemaId: definition['@type']
                };
        }
    }
}

module.exports = SchemaBase;
