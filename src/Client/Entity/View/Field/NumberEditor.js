'use strict';

/**
 * A simple number field
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class NumberEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/field/numberEditor');
    }
}

module.exports = NumberEditor;
