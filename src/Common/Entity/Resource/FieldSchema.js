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
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = params || {};
    
        // Backwards compatible editor names
        if(params.editorId && params.editorId.indexOf('Editor') < 0) {
            params.editorId = params.editorId[0].toUpperCase() + params.editorId.substring(1) + 'Editor';
        }
        
        // Adopt uischema.org fields
        if(params['@type']) {
            let i18n = params['@i18n'] && params['@i18n']['en'] ? params['@i18n']['en'] : {};

            params.id = params['@type'];
            params.name = i18n['@name'];
            params.parentId = params['@parent'] || 'struct';

            for(let key in params['@config'] || {}) {
                params[key] = params['@config'][key];
            }

            let config = {
                label: params['@label'],
                struct: {}
            };
            
            for(let key in params) {
                if(key[0] === '@') { continue; }

                config.struct[key] = this.constructor.getFieldFromUISchema(key, params[key], i18n[key]);
            }

            params.config = config;
        }

        super.adopt(params);
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
