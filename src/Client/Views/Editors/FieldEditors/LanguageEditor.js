'use strict';

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
class LanguageEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
       
        let options = HashBrown.Context.projectSettings.languages;

        if(!this.value || options.indexOf(this.value) < 0) {
            this.value = options[0];
        }

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--language'},
            new HashBrown.Views.Widgets.Dropdown({
                value: this.value,
                options: HashBrown.Context.projectSettings.languages,
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            }).$element
        );
    }
}

module.exports = LanguageEditor;
