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
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.localeOptions = this.context.project.settings.locales;
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

module.exports = LocaleEditor;
