'use strict';

const SchemaHelperCommon = require('Common/Helpers/SchemaHelper');

/**
 * The client side Schema helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets a Schema with all parent fields
     *
     * @param {String} id
     *
     * @returns {Promise} Schema with parent fields
     */
    static getSchemaWithParentFields(id) {
        if(!id) {
            return Promise.resolve(null);
        }
        
        return HashBrown.Helpers.RequestHelper.request('get', 'schemas/' + id + '/?withParentFields=true')
        .then((schema) => {
            return Promise.resolve(SchemaHelper.getModel(schema));
        });
    }
    
    /**
     * Gets a FieldSchema with all parent configs
     *
     * @param {String} id
     *
     * @returns {FieldSchema} Compiled FieldSchema
     */
    static getFieldSchemaWithParentConfigs(id) {
        let fieldSchema = this.getSchemaByIdSync(id);

        if(!fieldSchema) { return null; }

        let nextSchema = this.getSchemaByIdSync(fieldSchema.parentSchemaId);
        let compiledSchema = new HashBrown.Models.FieldSchema(fieldSchema.getObject());
       
        while(nextSchema) {
            compiledSchema.appendConfig(nextSchema.config);

            nextSchema = this.getSchemaByIdSync(nextSchema.parentSchemaId);
        }

        return compiledSchema;
    }

    /**
     * Gets a Schema by id
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static getSchemaById(id) {
        return HashBrown.Helpers.RequestHelper.request('get', 'schemas/' + id)
        .then((schema) => {
            return Promise.resolve(this.getModel(schema));
        });
    }
   
    /**
     * Gets all Schemas by type (sync)
     *
     * @param {String} type
     *
     * @returns {Array} All Schemas
     */
    static getAllSchemasSync(type) {
        if(!type) { return resources.schemas; }

        return resources.schemas.filter((schema) => {
            if(schema.id == type + 'Base') { return false; }

            return schema.type === type;
        });
    }
    
    /**
     * Gets all Schemas
     *
     * @returns {Array} All Schemas
     */
    static getAllSchemas() {
        return HashBrown.Helpers.ResourceHelper.get(null, 'schemas')
        .then((result) => {
            let schemas = [];

            for(let schema of result) {
                if(!schema.parentId) { continue; }

                if(schema.type === 'content') {
                    schema = new HashBrown.Models.ContentSchema(schema);
                } else if(schema.type === 'field') {
                    schema = new HashBrown.Models.FieldSchema(schema);
                }

                schemas.push(schema);
            }

            return Promise.resolve(schemas);
        });
    }

    /**
     * Gets a Schema by id (sync)
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static getSchemaByIdSync(id) {
        for(let i in resources.schemas) {
            let schema = resources.schemas[i];

            if(schema.id == id) {
                if(schema instanceof HashBrown.Models.ContentSchema || schema instanceof HashBrown.Models.FieldSchema) {
                    return schema;
                }

                return this.getModel(schema);
            }
        }
    }
}

module.exports = SchemaHelper;
