'use strict';

// Models
let FieldSchema = require('../../../common/models/FieldSchema');

// Helpers
let SchemaHelperCommon = require('../../../common/helpers/SchemaHelper');

/**
 * Schema helper
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
        if(id) {
            return apiCall('get', 'schemas/' + id + '/?withParentFields=true')
            .then((schema) => {
                return new Promise((resolve) => {
                    resolve(SchemaHelper.getModel(schema));
                })
            });
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
    }

    /**
     * Gets a FieldSchema with all parent configs
     *
     * @param {String} id
     *
     * @returns {FieldSchema} Compiled FieldSchema
     */
    static getFieldSchemaWithParentConfigs(id) {
        let fieldSchema = resources.schemas[id];

        if(fieldSchema) {
            let nextSchema = resources.schemas[fieldSchema.parentSchemaId];
            let compiledSchema = new FieldSchema(fieldSchema);
           
            while(nextSchema) {
                compiledSchema.appendConfig(nextSchema.config);

                nextSchema = resources.schemas[nextSchema.parentSchemaId];
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
        return new Promise((resolve, reject) => {
            for(let i in resources.schemas) {
                let schema = resources.schemas[i];

                if(schema.id == id) {
                    resolve(schema);
                    return;
                }
            }

            reject(new Error('No Schema by id "' + id + '" was found'));
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
                return schema;
            }
        }
    }
}

module.exports = SchemaHelper;
