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
                // Merge parent with current schema
                // Since the child schema should override any duplicate content,
                // the parent is transformed first, then returned as the resulting schema
                if(schema.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentValues(schema.parentSchemaId).
                    then((parentSchema) => {
                        let mergedSchema = parentSchema.getFields();

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
                        
                        mergedSchema.icon = schema.icon || mergedSchema.icon;
                        
                        switch(mergedSchema.type) {
                            case 'content':
                                if(!mergedSchema.tabs) {
                                    mergedSchema.tabs = {};
                                }

                                // Merge tabs
                                if(schema.tabs) {
                                    for(let k in schema.tabs) {
                                       mergedSchema.tabs[k] = schema.tabs[k];
                                    }
                                }

                                mergedSchema.defaultTabId = schema.defaultTabId || mergedSchema.defaultTabId;
                                break;
                        }
                     
                        resolve(SchemaHelper.getModel(mergedSchema));
                    });
                
                // If no parent was specified, return the current schema
                } else {
                    resolve(SchemaHelper.getModel(schema));
                
                }

            // If id was specified, but no Schema was found, return error
            } else if(id) {
                reject(new Error('No schema with id "' + id + '" available in resources'));
            
            // If no schema was found, return with null
            } else {
                resolve();

            }
        });
    }
}

module.exports = SchemaHelper;
