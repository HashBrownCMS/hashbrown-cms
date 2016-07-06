'use strict';

/**
 * A simple boolean editor
 */
class BooleanEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.value = this.$input[0].checked;

        this.trigger('change', this.value);
    }
    
    render() {
        let switchId = 'switch-field-boolean-' + ViewHelper.getAll('BooleanEditor').length;

        // Sanity check
        if(typeof this.value === 'undefined') {
            this.value = false;
        
        } else if(typeof this.value === 'string') {
            this.value = this.value == 'true';

        } else if(typeof this.value !== 'boolean') {
            this.value = false

        }

        this.$element = _.div({class: 'field-editor switch-editor'},
            _.div({class: 'switch'},
                this.$input = _.input({id: switchId, class: 'form-control switch', type: 'checkbox', checked: this.value})
                    .change(() => { this.onChange(); }),
                _.label({for: switchId})
            )
        );

        // Just to make sure the model has the right type of value
        setTimeout(() => {
            this.trigger('change', this.value);
        }, 20);
    }
}

module.exports = BooleanEditor;
