'use strict';

let Entity = require('./Entity');

/**
 * The base class for all Schema types
 */
class Schema extends Entity {
    structure() {
        this.def(String, 'id');
        this.def(String, 'name');
        this.def(String, 'icon');
        this.def(String, 'parentSchemaId');
    }
}

module.exports = Schema;
