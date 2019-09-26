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

        this.model.innerTemplate = require('template/field/inc/stringEditor');
    }
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    getValueLabel() {
        if(!this.state.value) { return super.getValueLabel(); }

        return this.state.value;
    }
}

module.exports = StringEditor;
