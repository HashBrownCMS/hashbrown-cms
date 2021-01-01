'use strict';

/**
 * A date/time field
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class DateEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/dateEditor');
    }
}

module.exports = DateEditor;
