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
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class StringEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
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
            new HashBrown.Entity.View.Widget.Checkbox({
                model: {
                    tooltip: 'Whether or not this string uses line breaks',
                    value: config.isMultiLine || false,
                    onchange: (newValue) => { config.isMultiLine = newValue; }
                }
            }).element
        );
    }
    
    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--string'},
            new HashBrown.Entity.View.Widget.Text({
                model: {
                    multiline: this.config.isMultiLine,
                    value: this.value,
                    onchange: (newValue) => {
                        this.value = newValue;

                        this.trigger('change', this.value);
                    }
                }
            }).element
        );
    }
}

module.exports = StringEditor;
