'use strict';

/**
 * A simple list picker
 *
 * @description Example:
 * <pre>
 * {
 *     "myDropdown": {
 *         "label": "My dropdown",
 *         "tabId": "content",
 *         "schemaId": "dropdown",
 *         "config": {
 *             "options": [
 *                 {
 *                     "label": "Option #1",
 *                     "value": "option-1"
 *                 },
 *                 {
 *                     "label": "Option #2",
 *                     "value": "option-2"
 *                 }
 *             ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class DropdownEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        if(!this.config.options) {
            this.config.options = [];
        }
        
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
        config.options = config.options || [];

        return this.field(
            'Options',
            new HashBrown.View.Widget.Chips({
                value: config.options,
                valueKey: 'value',
                labelKey: 'label',
                placeholder: 'New option',
                onChange: (newValue) => {
                    config.options = newValue;
                }
            })
        );
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--dropdown'},
            _.do(() => {
                if(!this.config || !this.config.options || this.config.options.length < 1) {
                    return _.span({class: 'editor__field__value__warning'}, 'No options configured');
                }
                
                return new HashBrown.View.Widget.Dropdown({
                    value: this.value,
                    useClearButton: true,
                    options: this.config.options,
                    valueKey: 'value',
                    labelKey: 'label',
                    onChange: (newValue) => {
                        this.value = newValue;

                        this.trigger('change', this.value);
                    }
                });
            })
        );
    }
}

module.exports = DropdownEditor;
