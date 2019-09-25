'use strict';

/**
 * A simple string field
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class StringEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/field/stringEditor');
    }
}

module.exports = StringEditor;
