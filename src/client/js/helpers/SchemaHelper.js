'use strict';

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
}

module.exports = SchemaHelper;
