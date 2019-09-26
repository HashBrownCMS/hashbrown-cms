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

        this.template = require('template/field/languageEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        this.state.languageOptions = [ 'en' ];
        
        if(HashBrown.Context.projectSettings) {
            this.state.languageOptions = HashBrown.Context.projectSettings.languages || [ 'en' ];
        }
    }
}

module.exports = LanguageEditor;
