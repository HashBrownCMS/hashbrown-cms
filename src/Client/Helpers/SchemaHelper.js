'use strict';

const SchemaHelperCommon = require('Common/Helpers/SchemaHelper');

/**
 * The client side Schema helper
 *
 * @memberof HashBrown.Client.Helpers
 */
class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets a FieldSchema with all parent configs
     *
     * @param {String} id
     *
     * @returns {FieldSchema} Compiled FieldSchema
     */
    static async getFieldSchemaWithParentConfigs(id) {
        let fieldSchema = await this.getSchemaById(id);

        if(!fieldSchema) { return null; }

        let nextSchema = await this.getSchemaById(fieldSchema.parentSchemaId);
        
        let compiledSchema = new HashBrown.Models.FieldSchema(fieldSchema.getObject());
        
        while(nextSchema) {
            compiledSchema.appendConfig(nextSchema.config);

            if(nextSchema.parentSchemaId) {
                nextSchema = await this.getSchemaById(nextSchema.parentSchemaId);
            } else {
                nextSchema = null;
            }
        }

        return compiledSchema;
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
        checkParam(id, 'id', String);

        let schema = await HashBrown.Helpers.ResourceHelper.get(null, 'schemas', id);
       
        // Get parent fields if specified
        if(withParentFields && schema.parentSchemaId) {
            let childSchema = this.getModel(schema);
            let mergedSchema = childSchema;

            while(childSchema.parentSchemaId) {
                let parentSchema = await this.getSchemaById(childSchema.parentSchemaId);
                
                mergedSchema = this.mergeSchemas(mergedSchema, parentSchema);

                childSchema = parentSchema;
            }

            return mergedSchema;
        }
        
        return this.getModel(schema);
    }
    
    /**
     * Gets all Schemas
     *
     * @param {String} type
     *
     * @returns {Array} All Schemas
     */
    static async getAllSchemas(type = null) {
        let results = await HashBrown.Helpers.ResourceHelper.getAll(null, 'schemas');

        let schemas = [];

        for(let schema of results) {
            if(type && schema.type !== type) { continue; }

            if(schema.type === 'content') {
                schema = new HashBrown.Models.ContentSchema(schema);
            } else if(schema.type === 'field') {
                schema = new HashBrown.Models.FieldSchema(schema);
            }

            schemas.push(schema);
        }

        return schemas;
    }
}

module.exports = SchemaHelper;
