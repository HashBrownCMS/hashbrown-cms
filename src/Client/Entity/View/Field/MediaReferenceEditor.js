'use strict';

/**
 * A reference to a media item
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class MediaReferenceEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/mediaReferenceEditor');
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

module.exports = MediaReferenceEditor;
