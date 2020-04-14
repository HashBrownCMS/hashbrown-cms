'use strict';

/**
 * A language picker
 *
 * @memberof {HashBrown.Client.Entity.View.Field}
 */
class LanguageEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/languageEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.languageOptions = this.context.project.settings.languages;
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

module.exports = LanguageEditor;
