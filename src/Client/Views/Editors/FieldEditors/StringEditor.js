'use strict';

/**
 * A simple string editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myString": {
 *         "label": "My string",
 *         "tabId": "content",
 *         "schemaId": "string",
 *         "config": {
 *             "isMultiLine": false
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class StringEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        return this.field(
            'Is multi-line',
            new HashBrown.Views.Widgets.Input({
                type: 'checkbox',
                tooltip: 'Whether or not this string uses line breaks',
                value: config.isMultiLine || false,
                onChange: (newValue) => { config.isMultiLine = newValue; }
            })
        );
    }
    
    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--string'},
            new HashBrown.Views.Widgets.Input({
                type: this.config.isMultiLine ? 'textarea' : 'text',
                value: this.value,
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            })
        );
    }
}

module.exports = StringEditor;
