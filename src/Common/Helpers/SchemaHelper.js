'use strict';

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

        // If the properties object is already a recognised model, return it
        if(properties instanceof HashBrown.Models.ContentSchema || properties instanceof HashBrown.Models.FieldSchema) {
            return properties;
        }

        // If the properties object is using an unrecognised model, serialise it
        if(typeof properties.getObject === 'function') {
            properties = properties.getObject();
        }

        if(properties.type === 'content') {
            return new HashBrown.Models.ContentSchema(properties);
        } else if(properties.type === 'field') {
            return new HashBrown.Models.FieldSchema(properties);
        }

        throw new Error('Schema data is incorrectly formatted: ' + JSON.stringify(properties));
    }
    
    /**
     * Merges two Schemas
     *
     * @param Schema childSchema
     * @param Schema parentSchema
     *
     * @returns {Schema} Merged Schema
     */
    static mergeSchemas(childSchema, parentSchema) {
        checkParam(childSchema, 'childSchema', HashBrown.Models.Schema);
        checkParam(parentSchema, 'parentSchema', HashBrown.Models.Schema);

        childSchema = childSchema.getObject();
        parentSchema = parentSchema.getObject();

        let mergedSchema = parentSchema;

        // Recursive merge
        function merge(parentValues, childValues) {
            for(let k in childValues) {
                if(typeof parentValues[k] === 'object' && typeof childValues[k] === 'object') {
                    merge(parentValues[k], childValues[k]);
                
                } else if(childValues[k]) {
                    parentValues[k] = childValues[k];
                
                }
            }
        }

        // Overwrite native values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentSchemaId = childSchema.parentSchemaId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;
        
        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'field':
                mergedSchema.editorId = mergedSchema.editorId || parentSchema.editorId;
                
                // Merge config
                if(!mergedSchema.config) { mergedSchema.config = {}; }
                if(!parentSchema.config) { parentSchema.config = {}; }

                merge(mergedSchema.config, childSchema.config);
                break;

            case 'content':
                // Merge tabs
                if(!mergedSchema.tabs) { mergedSchema.tabs = {}; }
                if(!childSchema.tabs) { childSchema.tabs = {}; }
               
                merge(mergedSchema.tabs, childSchema.tabs);

                // Merge fields
                if(!mergedSchema.fields) { mergedSchema.fields = {}; }
                if(!mergedSchema.fields.properties) { mergedSchema.fields.properties = {}; }
                if(!childSchema.fields) { childSchema.fields = {}; }
                if(!childSchema.fields.properties) { childSchema.fields.properties = {}; }

                merge(mergedSchema.fields, childSchema.fields);
       
                // Set default tab id
                mergedSchema.defaultTabId = childSchema.defaultTabId || mergedSchema.defaultTabId;
                break;
        }

        return this.getModel(mergedSchema);
    }
}

module.exports = SchemaHelper;
