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
            let properties = resources.schemas[id];

            if(properties) {
                // Merge parent with current schema
                // Since the child schema should override any duplicate content,
                // the parent is transformed first, then returned as the resulting schema
                if(properties.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentValues(properties.parentSchemaId).
                    then((parentSchema) => {
                        let parentProperties = parentSchema.getFields();
                        let mergedProperties = parentProperties;

                        for(let k in properties.fields) {
                           mergedProperties.fields[k] = properties.fields[k];
                        }
                        
                        if(!mergedProperties.tabs) {
                            mergedProperties.tabs = {};
                        }

                        if(properties.tabs) {
                            for(let k in properties.tabs) {
                               mergedProperties.tabs[k] = properties.tabs[k];
                            }
                        }

                        mergedProperties.defaultTabId = properties.defaultTabId || mergedProperties.defaultTabId;
                        mergedProperties.icon = properties.icon || mergedProperties.icon;

                        resolve(SchemaHelper.getModel(mergedProperties));
                    });
                
                // If no parent was specified, return the current schema
                } else {
                    resolve(SchemaHelper.getModel(properties));
                
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
