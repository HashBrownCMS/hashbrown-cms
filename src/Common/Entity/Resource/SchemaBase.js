'use strict';

/**
 * The base class for all Schema types
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class SchemaBase extends HashBrown.Entity.Resource.ResourceBase {
    static get category() { return 'schemas'; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'name');
        this.def(String, 'type');
        this.def(String, 'parentSchemaId');
        this.def(Boolean, 'isLocked');

        // Sync
        this.def(Object, 'sync');

        this.def(Array, 'hiddenProperties', []);
    }

    /**
     * Gets a URL safe name for this schema
     *
     * @return {String} URL safe name
     */
    getUrlSafeName() {
        return this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    /**
     * Checks whether a property is hidden
     *
     * @param {String} name
     *
     * @returns {Boolean} Is hidden
     */
    isPropertyHidden(name) {
        return this.hiddenProperties.indexOf(name) > -1;
    }
    
    /**
     * Merges two sets of schema data
     *
     * @param {Object} childSchema
     * @param {Object} parentSchema
     *
     * @returns {Schema} Merged Schema
     */
    static merge(childSchema, parentSchema) {
        checkParam(childSchema, 'childSchema', Object, true);
        checkParam(parentSchema, 'parentSchema', Object, true);

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

        // Overwrite common values 
        mergedSchema.id = childSchema.id;
        mergedSchema.name = childSchema.name;
        mergedSchema.parentSchemaId = childSchema.parentSchemaId;
        mergedSchema.icon = childSchema.icon || mergedSchema.icon;

        // Specific values for schema types
        switch(mergedSchema.type) {
            case 'field':
                mergedSchema.editorId = childSchema.editorId || mergedSchema.editorId;
                
                // Merge config
                if(!mergedSchema.config) { mergedSchema.config = {}; }
                if(!childSchema.config) { childSchema.config = {}; }

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

        return mergedSchema;
    }
}

module.exports = SchemaBase;
