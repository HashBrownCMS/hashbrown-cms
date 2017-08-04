'use strict';

const ContentSchema = require('Common/Models/ContentSchema');
const FieldSchema = require('Common/Models/FieldSchema');

const RequestHelper = require('Client/Helpers/RequestHelper');

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
        
        return RequestHelper.request('get', 'schemas/' + id + '/?withParentFields=true')
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

        if(fieldSchema) {
            let nextSchema = this.getSchemaByIdSync(fieldSchema.parentSchemaId);
            let compiledSchema = new FieldSchema(fieldSchema.getObject());
           
            while(nextSchema) {
                compiledSchema.appendConfig(nextSchema.config);

                nextSchema = this.getSchemaByIdSync(nextSchema.parentSchemaId);
            }

            return compiledSchema;
        }
    }


    /**
     * Gets a Schema by id
     *
     * @param {String} id
     *
     * @return {Promise} Promise
     */
    static getSchemaById(id) {
        return RequestHelper.request('get', 'schemas/' + id)
        .then((schema) => {
            return Promise.resolve(this.getModel(schema));
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

            if(!schema) { console.log(i); }

            if(schema.id == id) {
                if(schema instanceof ContentSchema || schema instanceof FieldSchema) {
                    return schema;
                }

                return this.getModel(schema);
            }
        }
    }
}

module.exports = SchemaHelper;
