'use strict';

/**
 * Schema for content fields
 *
 * @memberof HashBrown.Common.Entity.Resource
 */
class FieldSchema extends HashBrown.Entity.Resource.SchemaBase {
    static get type() { return 'field'; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'editorId');

        this.name = 'New field schema';        
    }
    
    /**
     * Instantiates a resource
     *
     * @param {Object} params
     *
     * @return {HashBrown.Entity.Resource.FieldSchema} Instance
     */
    static new(params = {}) {
        checkParam(params, 'params', Object)

        params = params || {};

        return new this(params);
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
        
    /**
     * Merges two sets of schema data
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} parentSchema
     */
    merge(parentSchema) {
        super.merge(parentSchema);

        this.editorId = this.editorId || parentSchema.editorId;
    }
}

module.exports = FieldSchema;
