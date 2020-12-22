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
     * Converts fields from uischema.org format
     *
     * @param {Object} input
     *
     * @return {Object} Definition
     */
    static convertFromUISchema(input) {
        checkParam(input, 'input', Object, true);

        let i18n = input['@i18n'] && input['@i18n']['en'] ? input['@i18n']['en'] : {};
        let output = {
            id: input['@type'],
            name: i18n['@name'],
            parentId: input['@parent'] || 'struct'
        };

        for(let key in input['@config'] || {}) {
            output[key] = input['@config'][key];
        }

        let config = {
            label: input['@label'],
            struct: {}
        };
        
        for(let key in input) {
            let definition = this.getFieldFromUISchema(key, input[key], i18n[key]);

            if(!definition) { continue; }

            config.struct[key] = definition; 
        }

        output.config = config;

        return output;
    }

    /**
     * Adopts values into this entity
     *
     * @param {Object} params
     */
    adopt(params = {}) {
        checkParam(params, 'params', Object);

        params = JSON.parse(JSON.stringify(params || {}));
    
        // Backwards compatible editor names
        if(params.editorId && params.editorId.indexOf('Editor') < 0) {
            params.editorId = params.editorId[0].toUpperCase() + params.editorId.substring(1) + 'Editor';
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
