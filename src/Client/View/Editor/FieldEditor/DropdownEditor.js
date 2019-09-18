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
            new HashBrown.Entity.View.Widget.List({
                model: {
                    keys: true,
                    value: config.options,
                    placeholder: 'option',
                    onchange: (newValue) => {
                        config.options = newValue;
                    }
                }
            }).element
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
                
                return new HashBrown.Entity.View.Widget.Popup({
                    model: {
                        value: this.value,
                        clearable: true,
                        options: this.config.options,
                        onchange: (newValue) => {
                            this.value = newValue;

                            this.trigger('change', this.value);
                        }
                    }
                }).element;
            })
        );
    }
}

module.exports = DropdownEditor;
