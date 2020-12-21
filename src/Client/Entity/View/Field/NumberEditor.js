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

        this.editorTemplate = require('template/field/editor/numberEditor');
        this.configTemplate = require('template/field/config/numberEditor');
    }
}

module.exports = NumberEditor;
