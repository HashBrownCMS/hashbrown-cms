'use strict';

const LanguageHelper = require('Client/Helpers/LanguageHelper');

const FieldEditor = require('./FieldEditor');

/**
 * A field editor for specifying one of the selected languages
 *
 * @description Example:
 * <pre>
 * {
 *     "myLanguage": {
 *         "label": "My language",
 *         "tabId": "content",
 *         "schemaId": "language"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class LanguageEditor extends FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Prerender
     */
    prerender() {
        let options = LanguageHelper.getLanguagesSync();

        if(!this.value || options.indexOf(this.value) < 0) {
            this.value = options[0];
        }
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Dropdown({
                value: this.value,
                options: LanguageHelper.getLanguagesSync(),
                tooltip: this.description || '',
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            }).$element
        );
    }
}

module.exports = LanguageEditor;
