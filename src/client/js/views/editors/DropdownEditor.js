'use strict';

/**
 * A simple list picker
 */
class DropdownEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
   
    /**
     * Event: Change value
     */ 
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }

    render() {
        // Value sanity check, should not be null
        if(!this.value || typeof this.value === 'undefined') {
            if(this.config.options.length > 0) {
                this.value = this.config.options[0].value;
               
                // Wait until next CPU cycle to trigger change
                setTimeout(() => { 
                    this.trigger('change', this.value);
                }, 1);
            }
        }
        
        this.$element = _.div({class: 'field-editor dropdown-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.config.options, (i, option) => {
                    return _.option({
                        value: option.value,
                        selected: this.value == option.value
                    }, option.label);
                })
            ).change(() => { this.onChange(); })
        );

        this.$select.val(this.value);
    }
}


module.exports = DropdownEditor;
