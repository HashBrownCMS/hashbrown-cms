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
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class DropdownEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
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

        return _.div({class: 'editor__field'},
            _.div({class: 'editor__field__key'}, 'Options'),
            _.div({class: 'editor__field__value'},
                new HashBrown.Views.Widgets.Chips({
                    value: config.options,
                    valueKey: 'value',
                    labelKey: 'label',
                    placeholder: 'New option',
                    onChange: (newValue) => {
                        config.options = newValue;
                    }
                }).$element
            )
        );
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--dropdown'},
            _.if(this.config.options.length < 1,
                _.span({class: 'editor__field__value__warning'}, 'No options configured')
            ),
            _.if(this.config.options.length > 0,
                new HashBrown.Views.Widgets.Dropdown({
                    value: this.value,
                    useClearButton: true,
                    options: this.config.options,
                    valueKey: 'value',
                    labelKey: 'label',
                    onChange: (newValue) => {
                        this.value = newValue;

                        this.trigger('change', this.value);
                    }
                }).$element
            )
        );
    }
}

module.exports = DropdownEditor;
