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

        this.template = require('template/field/mediaReferenceEditor');
    }
}

module.exports = MediaReferenceEditor;
