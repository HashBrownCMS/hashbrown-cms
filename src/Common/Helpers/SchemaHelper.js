'use strict';

// Models
const FieldSchema = require('../Models/FieldSchema');
const ContentSchema = require('../Models/ContentSchema');

/**
 * The common base for SchemaHelper
 */
module.exports = class SchemaHelper {
    /**
     * Gets all parent fields
     *
     * @param {String} id
     *
     * @returns {Promise(Schema)} schema
     */
    static getSchemaWithParentFields(id) {
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
        switch(properties.type.toLowerCase()) {
            case 'content': default:
                return new ContentSchema(properties);
        
            case 'field':
                return new FieldSchema(properties);
        }
    }
}
