'use strict';

// Models
let FieldSchema = require('../models/FieldSchema');
let ContentSchema = require('../models/ContentSchema');

/**
 * The common base for SchemaHelper
 */
class SchemaHelper {
    /**
     * Gets all parent values
     *
     * @param {String} id
     *
     * @returns {Promise(Schema)} schema
     */
    static getSchemaWithParentValues(id) {
        return new Promise((callback) => {
            callback();
        });
    }

    /**
     * Gets the appropriate model
     *
     * @param {Object} properties
     *
     * @return {Schema} schema
     */
    static getModel(properties) {
        switch(properties.type) {
            case 'content':
                return new ContentSchema(properties);
        
            case 'field':
                return new FieldSchema(properties);
        }
    }
}

module.exports = SchemaHelper;
