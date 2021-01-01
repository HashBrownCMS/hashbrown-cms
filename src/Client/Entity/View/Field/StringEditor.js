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

        this.editorTemplate = require('template/field/editor/stringEditor');
        this.configTemplate = require('template/field/config/stringEditor');
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(!this.state.value) { return await super.getValueLabel(); }

        return this.state.value;
    }
}

module.exports = StringEditor;
