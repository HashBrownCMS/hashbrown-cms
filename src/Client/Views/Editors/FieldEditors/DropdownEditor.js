'use strict';

const FieldEditor = require('./FieldEditor');

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
class DropdownEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'field-editor dropdown-editor'});
        
        this.init();
    }
   
    /**
     * Event: Change value
     */ 
    onChange(newValue) {
        this.value = newValue;

        this.trigger('change', this.value);
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
    render() {
        // Wait until next CPU cycle to trigger an eventual change if needed
        setTimeout(() => {         
            // Value sanity check, should not be null
            if(!this.config.options) {
                this.config.options = [];
            }

            // Generate dropdown options
            let dropdownOptions = [];
            
            for(let option of this.config.options || []) {
                dropdownOptions[dropdownOptions.length] = {
                    label: option.label,
                    value: option.value,
                    selected: option.value == this.value
                };
            }
        
            _.append(this.$element.empty(),
                _.if(this.config.options.length > 0,
                    UI.inputDropdown('(none)', dropdownOptions, (newValue) => {
                        this.onChange(newValue);
                    }, true)
                ),
                _.if(this.config.options.length < 1,
                    _.span({class: 'field-warning'}, 'No options configured')
                )

            );
        }, 1);
    }
}

module.exports = DropdownEditor;
