'use strict';

/**
 * Schema for content fields
 *
 * @memberof HashBrown.Common.Entity.Resource.Schema
 */
class FieldSchema extends HashBrown.Entity.Resource.Schema.SchemaBase {
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'editorId');
        this.def(Object, 'config', {});

        this.name = 'New field schema';        
    }
    
    /**
     * Gets the type as a string
     *
     * @return {String} Type
     */
    get type() {
        return 'field';
    }


    /**
     * Checks the format of the params
     *
     * @params {Object} params
     *
     * @returns {Object} Params
     */
    static paramsCheck(params) {
        params = super.paramsCheck(params);

        // Backwards compatible editor names
        if(params.editorId && params.editorId.indexOf('Editor') < 0) {
            params.editorId = params.editorId[0].toUpperCase() + params.editorId.substring(1) + 'Editor';
        }

        return params;
    }

    /**
     * Appends properties to this config
     *
     * @param {Object} config
     */
    appendConfig(config) {
        function recurse(source, target) {
            for(let k in source) {
                // If key doesn't exist, append immediately
                if(!target[k]) {
                    target[k] = source[k];
                
                } else if(
                    (target[k] instanceof Object && source[k] instanceof Object) ||
                    (target[k] instanceof Array && source[k] instanceof Array)
                ) {
                    recurse(source[k], target[k]);
                }
            }
        }

        recurse(config, this.config);
    }
}

module.exports = FieldSchema;
