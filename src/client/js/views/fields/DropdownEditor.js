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
            if(!this.value || typeof this.value === 'undefined') {
                if(this.config.options.length > 0) {
                    this.value = this.config.options[0].value;
                   
                    this.trigger('change', this.value);
                }
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
                }, false, false)
            );
        }, 1);
    }
}


module.exports = DropdownEditor;
