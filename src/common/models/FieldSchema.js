'use strict';

let Schema = require('./Schema');

/**
 * Schema for content fields
 */
class FieldSchema extends Schema {
    structure() {
        super.structure();

        this.def(String, 'editorId');
        this.def(Object, 'config');

        this.name = 'New field schema';        
        this.type = 'field';
    }
}

module.exports = FieldSchema;
