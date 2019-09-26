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

        this.model.innerTemplate = require('template/field/inc/numberEditor');
    }
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
}

module.exports = NumberEditor;
