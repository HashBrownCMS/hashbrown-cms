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
        return new Promise((callback) => {
            let properties = resources.schemas[id];

            if(properties) {
                // Merge parent with current schema
                // Since the child schema should override any duplicate content,
                // the parent is transformed first, then returned as the resulting schema
                if(properties.parentSchemaId) {
                    SchemaHelper.getSchemaWithParentValues(properties.parentSchemaId).
                    then((parentSchema) => {
                        let parentProperties = parentSchema.getFields();

                        for(let k in properties.fields) {
                           parentProperties.fields[k] = properties.fields[k];
                        }
                        
                        if(!parentProperties.tabs) {
                            parentProperties.tabs = {};
                        }

                        if(properties.tabs) {
                            for(let k in properties.tabs) {
                               parentProperties.tabs[k] = properties.tabs[k];
                            }
                        }

                        parentProperties.defaultTabId = properties.defaultTabId;
                        parentProperties.icon = properties.icon;

                        properties = parentProperties;

                        callback(SchemaHelper.getModel(properties));
                    });
                
                // If no parent was specified, return the current schema
                } else {
                    callback(SchemaHelper.getModel(properties));
                
                }

            } else {
                throw 'No schema with id "' + id + '" available in resources';
            
            }
        });
    }
}

module.exports = SchemaHelper;
