'use strict';

let Schema = require('./Schema');

/**
 * Schema for content fields
 */
class FieldSchema extends Schema {
    structure() {
        super.structure();

        this.def(String, 'editorId');
        
        this.type = 'field';
    }
}

module.exports = FieldSchema;
