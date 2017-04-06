'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple list picker
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
