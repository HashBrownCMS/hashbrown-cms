'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Schema types
 */
class Schema extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(String, 'editorId');
        this.def(String, 'schemaType');
        this.def(String, 'parentSchemaId');
        this.def(String, 'defaultTabId');
        this.def(Object, 'tabs', {});
        this.def(Object, 'fields', {});
    }
}

module.exports = Schema;
