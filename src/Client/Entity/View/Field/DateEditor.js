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
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
    
    /**
     * Gets whether this field is small
     *
     * @return {Boolean} Is small
     */
    isSmall() {
        return true;
    }
}

module.exports = DateEditor;
