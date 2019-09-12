'use strict';

const CACHE_EXPIRATION_TIME = 1000 * 60;

let cachedSchemas = {};

/**
 * The client side Schema helper
 *
 * @memberof HashBrown.Client.Service
 */
class SchemaService extends require('Common/Service/SchemaService') {
    /**
     * Adds a schema to the cache
     *
     * @param {Schema} schema
     */
    static setCached(id, schema) {
        checkParam(id, 'id', String, true);
        checkParam(schema, 'schemas', HashBrown.Entity.Resource.Schema.SchemaBase);
        
        if(schema) {
            cachedSchemas[id] = {
                expires: Date.now() + CACHE_EXPIRATION_TIME,
                data: schema
            };

        } else {
            delete cachedSchemas[id];
        
        }
    }

    /**
     * Gets a schema from the cache
     *
     * @param {String} id
     *
     * @return {Schema} Schema
     */
    static getCached(id) {
        checkParam(id, 'id', String, true);
        
        if(!cachedSchemas[id]) { return null; }
        
        if(Date.now() > cachedSchemas[id].expires) {
            this.setCached(id, null);
            return null;
        }

        let schema = cachedSchemas[id].data;
        let copy = this.getEntity(schema.getObject());

        return copy;
    }
    
    /**
     * Pulls a schema by id
     *
     * @param {String} id
     */
    static async pullSchemaById(id) {
        checkParam(id, 'id', String, true);
        
        this.setCached(id, null);
        
        await HashBrown.Service.ResourceService.pull('schemas', id);
    }
    
    /**
     * Pushes a schema by id
     *
     * @param {String} id
     */
    static async pushSchemaById(id) {
        checkParam(id, 'id', String, true);
        
        await HashBrown.Service.ResourceService.push('schemas', id);
    }

    /**
     * Sets a schema by id
     *
     * @param {String} id
     * @param {HashBrown.Entity.Resource.Schema.SchemaBase} schema
     */
    static async setSchemaById(id, schema) {
        checkParam(id, 'id', String, true);
        checkParam(schema, 'schemas', HashBrown.Entity.Resource.Schema.SchemaBase);
        
        this.setCached(id, schema);
        
        await HashBrown.Service.ResourceService.set('schemas', id, schema);
    }

    /**
     * Removes a schema by id
     */
    static async removeSchemaById(id) {
        checkParam(id, 'id', String, true);

        this.setCached(id, null);
        
        await HashBrown.Service.ResourceService.remove('schemas', id);
    }

    /**
     * Gets a Schema by id
     *
     * @param {String} id
     * @param {Boolean} withParentFields
     *
     * @return {Schema} Schema
     */
    static async getSchemaById(id, withParentFields = false) {
        checkParam(id, 'id', String, true);
        checkParam(withParentFields, 'withParentFields', Boolean);

        let schema = this.getCached(id);

        if(!schema) {
            schema = await HashBrown.Service.ResourceService.get(null, 'schemas', id);
            schema = this.getEntity(schema);
            this.setCached(id, schema);
        }
        
        // Get parent fields if specified
        if(withParentFields && schema.parentSchemaId) {
            let childSchema = this.getEntity(schema);
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.getSchemaById(childSchema.parentSchemaId);
            
                mergedSchema = this.mergeSchema(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }

            return mergedSchema;
        }
        
        return schema;
    }
    
    /**
     * Gets all schemas
     *
     * @param {String} type
     *
     * @returns {Array} Schemas
     */
    static async getAllSchemas(type = null) {
        let results = await HashBrown.Service.ResourceService.getAll(null, 'schemas');

        let schemas = [];

        for(let schema of results) {
            if(type && schema.type !== type) { continue; }

            if(schema.type === 'content') {
                schema = new HashBrown.Entity.Resource.Schema.ContentSchema(schema);
            } else if(schema.type === 'field') {
                schema = new HashBrown.Entity.Resource.Schema.FieldSchema(schema);
            }

            this.setCached(schema.id, schema); 

            schemas.push(schema);
        }

        return schemas;
    }
}

module.exports = SchemaService;
