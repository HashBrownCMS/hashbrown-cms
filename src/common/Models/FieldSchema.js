'use strict';

let Schema = require('./Schema');

/**
 * Schema for content fields
 */
class FieldSchema extends Schema {
    structure() {
        super.structure();

        this.def(String, 'editorId');
        this.def(String, 'previewTemplate', '');
        this.def(Object, 'config', {});

        this.name = 'New field schema';        
        this.type = 'field';
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
