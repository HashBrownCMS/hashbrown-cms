'use strict';

// Helpers
let SchemaHelperCommon = require('../../../common/helpers/SchemaHelper');

class SchemaHelper extends SchemaHelperCommon {
    /**
     * Gets all parent values
     *
     * @param {String} id
     *
     * @returns {Promise(Schema)} schema
     */
    static getSchemaWithParentValues(id) {
        return new Promise((resolve, reject) => {
            let schema = resources.schemas[id];

            if(schema) {
                // Create a clone of this Schema to avoid confusion
                schema = SchemaHelper.getModel(schema).getFields();

                // If this Schema has a parent, merge values with it
                if(schema.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentValues(schema.parentSchemaId)
                    .then((parentSchema) => {
                        let mergedSchema = parentSchema.getObject();

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

                        merge(mergedSchema.fields, schema.fields);
                       
                        // Overwrite native values 
                        mergedSchema.id = schema.id;
                        mergedSchema.name = schema.name;
                        mergedSchema.parentSchemaId = schema.parentSchemaId;
                        mergedSchema.icon = schema.icon || mergedSchema.icon;
                        
                        // Specific values for schema types
                        switch(mergedSchema.type) {
                            case 'content':
                                let mergedTabs = {};
                                
                                if(!mergedSchema.tabs) {
                                    mergedSchema.tabs = {};
                                }

                                if(!schema.tabs) {
                                    schema.tabs = {};
                                }
                                
                                // Merge tabs
                                for(let k in mergedSchema.tabs) {
                                   mergedTabs[k] = mergedSchema.tabs[k];
                                }

                                for(let k in schema.tabs) {
                                   mergedTabs[k] = schema.tabs[k];
                                }

                                mergedSchema.tabs = mergedTabs;

                                mergedSchema.defaultTabId = schema.defaultTabId || mergedSchema.defaultTabId;
                                break;
                        }
                    
                        let model = SchemaHelper.getModel(mergedSchema);

                        resolve(model);
                    });

                // If this Schema doesn't have a parent, return this Schema
                } else {
                    let model = SchemaHelper.getModel(schema);

                    resolve(model);

                }

            // If id was specified, but no Schema was found, return error
            } else if(id) {
                reject(new Error('No schema with id "' + id + '" available in resources'));
            
            // If no schema was found, return with null
            } else {
                debug.log('Returning null schema since no id was specified', this);
                resolve();

            }

        });
    }
}

module.exports = SchemaHelper;
