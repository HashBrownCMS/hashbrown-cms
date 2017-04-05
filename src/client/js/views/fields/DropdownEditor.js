'use strict';

/**
 * A simple list picker
 */
class DropdownEditor extends View {
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
            if(!this.config.options || this.config.options.length < 1) {
                this.config.options = [];

                console.log(this, this.config);

                UI.errorModal(new Error('The Schema for "' + this.schema.label + '" has no options defined'));
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
        
            this.$element.html(
                UI.inputDropdown('(none)', dropdownOptions, (newValue) => {
                    this.onChange(newValue);
                }, true)
            );
        }, 1);
    }
}


module.exports = DropdownEditor;
