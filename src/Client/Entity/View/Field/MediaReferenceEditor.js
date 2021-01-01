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
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value) {
            let resource = await HashBrown.Entity.Resource.Media.get(this.state.value);

            if(resource) {
                return resource.getName();
            }
        }

        return await super.getValueLabel();
    }
}

module.exports = MediaReferenceEditor;
