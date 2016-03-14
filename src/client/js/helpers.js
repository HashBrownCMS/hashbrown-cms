/**
 * Gets a schema with parent included recursively
 *
 * @param {Number} id
 *
 * @return {Object} schema
 */
window.getSchemaWithParents = function getSchemaWithParents(id) {
    let schema = $.extend(true, {}, resources.schemas[id]);

    if(schema) {
        // Merge parent with current schema
        // Since the child schema should override any duplicate content,
        // the parent is transformed first, then returned as the resulting schema
        if(schema.parentSchemaId) {
            let parentSchema = window.getSchemaWithParents(schema.parentSchemaId);

            for(let k in schema.properties) {
               parentSchema.properties[k] = schema.properties[k];
            }
            
            for(let k in schema.tabs) {
               parentSchema.tabs[k] = schema.tabs[k];
            }

            parentSchema.defaultTabId = schema.defaultTabId;
            parentSchema.icon = schema.icon;

            schema = parentSchema;
        }

    } else {
        console.log('No schema with id "' + id + '" available in resources');
    
    }

    return schema;
}
