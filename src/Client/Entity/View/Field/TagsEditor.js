'use strict';

/**
 * A list of comma-separated strings
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class TagsEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/tagsEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.value = (this.state.value || '').split(',').filter(Boolean);
    }

    /**
     * Event: Changed value
     */
    onChange(newValue) {
        newValue = newValue.join(',');

        super.onChange(newValue);
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value && this.state.value.length > 0) {
            if(Array.isArray(this.state.value)) {
                return this.state.value.join(', ');
            }

            return this.state.value;
        }

        return await super.getValueLabel();
    }
}

module.exports = TagsEditor;
