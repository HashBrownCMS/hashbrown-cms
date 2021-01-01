'use strict';

/**
 * A locale picker
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class LocaleEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/localeEditor');
    }
    
    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value) {
            return this.state.value;
        }

        return await super.getValueLabel();
    }
    

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.localeOptions = this.context.project.settings.locales;
    }
}

module.exports = LocaleEditor;
