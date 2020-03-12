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
        super();

        params = params || {};

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
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};

        if(params.parentSchemaId) {
            params.parentId = params.parentSchemaId;
            delete params.parentSchemaId;
        }

        if(params.icon) {
            params.customIcon = params.icon;
            delete params.icon;
        }

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

        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'field':
                mergedSchema.editorId = childSchema.editorId || mergedSchema.editorId;
                
                // Merge config
                if(!mergedSchema.config) { mergedSchema.config = {}; }
                if(!childSchema.config) { childSchema.config = {}; }

                merge(mergedSchema.config, childSchema.config);
                break;

            case 'content':
                // Merge tabs
                if(!mergedSchema.tabs) { mergedSchema.tabs = {}; }
                if(!childSchema.tabs) { childSchema.tabs = {}; }
               
                merge(mergedSchema.tabs, childSchema.tabs);

                // Merge fields
                if(!mergedSchema.fields) { mergedSchema.fields = {}; }
                if(!mergedSchema.fields.properties) { mergedSchema.fields.properties = {}; }
                if(!childSchema.fields) { childSchema.fields = {}; }
                if(!childSchema.fields.properties) { childSchema.fields.properties = {}; }

                merge(mergedSchema.fields, childSchema.fields);
       
                // Set default tab id
                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return mergedSchema;
    }
}

module.exports = SchemaBase;
