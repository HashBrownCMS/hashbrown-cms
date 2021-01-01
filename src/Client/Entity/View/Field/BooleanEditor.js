'use strict';

/**
 * A simple boolean field
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class BooleanEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/booleanEditor');
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        return this.state.value === true;
    }
}

module.exports = BooleanEditor;
