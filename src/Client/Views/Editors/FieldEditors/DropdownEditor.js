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

        let $element = _.div({class: 'field-container'});

        let render = () => {
            _.append($element.empty(),
                _.div({class: 'field-key'}, 'Options'),
                _.div({class: 'field-value'},
                    _.each(config.options, (i, option) => {
                        return _.div({class: 'field-container'},
                            _.div({class: 'field-key'},
                                _.input({class: 'form-control', type: 'text', value: option.label})
                                    .change((e) => {
                                        option.label = e.currentTarget.value;
                                    })
                            ),
                            _.div({class: 'field-value'},
                                _.input({class: 'form-control', type: 'text', value: option.value})
                                    .change((e) => {
                                        option.value = e.currentTarget.value;
                                    })
                            )
                        );
                    }),
                    _.button({class: 'btn btn-round btn-primary raised'},
                        _.span({class: 'fa fa-plus'})
                    ).click(() => {
                        config.options.push({
                            label: 'Option label',
                            value: 'optionValue'
                        });

                        render();
                    })
                )
            );
        };

        render();

        return $element;
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
                // Render preview
                this.renderPreview(),

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
