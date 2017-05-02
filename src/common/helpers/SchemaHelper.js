'use strict';

// Models
let FieldSchema = require('../models/FieldSchema');
let ContentSchema = require('../models/ContentSchema');

/**
 * The common base for SchemaHelper
 */
class SchemaHelper {
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
     * Sanity check for site settings Schema
     *
     * @param {Object} schema
     *
     * @returns {Object} Checked Schema
     */
    static checkSiteSettings(schema) {
        schema = schema || {};

        schema.icon = 'wrench';
        schema.id = 'siteSettings'
        schema.name = 'Site settings';
        schema.parentSchemaId = 'contentBase';
        schema.hiddenProperties = [
            'allowedChildSchemas',
            'parentSchemaId',
            'name',
            'icon'
        ];

        if(schema instanceof ContentSchema === false) {
            schema = new ContentSchema(schema);
        }

        return schema;
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
            case 'content': default:
                return new ContentSchema(properties);
        
            case 'field':
                return new FieldSchema(properties);
        }
    }
}

module.exports = SchemaHelper;
