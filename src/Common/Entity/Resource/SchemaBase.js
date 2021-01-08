'use strict';

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class SchemaBase extends HashBrown.Entity.Resource.ResourceBase {
    set icon(name) { this.customIcon = name; }
    get icon() { return this.customIcon || super.icon; }

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
            if(!params.parentId) {
                params.parentId = params.parentSchemaId;
            }

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
     * Gets all children of this schema
     *
     * @return {Array} Children
     */
    async getChildren() {
        return await this.constructor.list(this.context, { parentId: this.id, customOnly: true });
    }

    /**
     * Merges two sets of schema data
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} parentSchema
     */
    merge(parentSchema) {
        checkParam(parentSchema, 'parentSchema', HashBrown.Entity.Resource.SchemaBase, true);

        parentSchema = parentSchema.clone();

        // Use most recent updated date for cache invalidation purposes
        if(parentSchema.updatedOn > this.updatedOn) {
            this.updatedOn = parentSchema.updatedOn;
        }

        // Merge config
        if(!this.config) { this.config = {}; }
        if(!parentSchema.config) { parentSchema.config = {}; }

        function merge(parentValues, childValues) {
            for(let k in parentValues) {
                if(parentValues[k] && parentValues[k].constructor === Object) {
                    if(!childValues[k] || childValues[k].constructor !== Object) {
                        childValues[k] = {};
                    }

                    merge(parentValues[k], childValues[k]);
                
                } else if(!childValues[k]) {
                    childValues[k] = parentValues[k];
                
                }
            }
        }

        // Make sure parent fields come first
        let thisConfig = this.config;

        this.config = {};

        merge(parentSchema.config, this.config);    
        merge(thisConfig, this.config);    
    }
}

module.exports = SchemaBase;
