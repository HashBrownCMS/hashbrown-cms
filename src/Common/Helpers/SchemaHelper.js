'use strict';

// Models
const FieldSchema = require('Common/Models/FieldSchema');
const ContentSchema = require('Common/Models/ContentSchema');

/**
 * The common base for SchemaHelper
 *
 * @memberof HashBrown.Common.Helpers
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
     * Gets the appropriate model
     *
     * @param {Object} properties
     *
     * @return {Schema} Schema
     */
    static getModel(properties) {
        if(!properties) { return null; }

        if(properties instanceof ContentSchema || properties instanceof FieldSchema) {
            return properties;
        }

        if(properties.type == 'content') {
            return new ContentSchema(properties);
        }

        return new FieldSchema(properties);
    }
    
    /**
     * Merges two Schemas
     *
     * @param Schema childSchema
     * @param Schema parentSchema
     *
     * @returns {Schema} Merged Schema
     */
    static mergeSchemas(
        childSchema = requiredParam('childSchema'),
        parentSchema = requiredParam('parentSchema')
    ) {
        childSchema = this.getModel(childSchema).getObject();
        parentSchema = this.getModel(parentSchema).getObject();

        let mergedSchema = parentSchema;

        // Recursive merge
        function merge(parentValues, childValues) {
            for(let k in childValues) {
                if(typeof parentValues[k] === 'object' && typeof childValues[k] === 'object') {
                    merge(parentValues[k], childValues[k]);
                
                } else {
                    parentValues[k] = childValues[k];
                
                }
            }
        }

        merge(mergedSchema.fields, childSchema.fields);
       
        // Overwrite native values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentSchemaId = childSchema.parentSchemaId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;
        
        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'content':
                let mergedTabs = {};
                
                if(!mergedSchema.tabs) {
                    mergedSchema.tabs = {};
                }

                if(!childSchema.tabs) {
                    childSchema.tabs = {};
                }
               
                // Merge tabs
                merge(mergedSchema.tabs, childSchema.tabs);

                // Set default tab id
                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return this.getModel(mergedSchema);
    }
}

module.exports = SchemaHelper;
