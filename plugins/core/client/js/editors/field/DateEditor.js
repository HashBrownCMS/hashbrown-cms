'use strict';

/**
 * An editor for date values
 */
class DateEditor extends View {
    constructor(params) {
        super(params);

        // Ensure correct type
        if(typeof params.value === 'string' && !isNaN(params.value)) {
            params.value = new Date(parseInt(params.value));
        } else {
            params.value = new Date(params.value);
        }

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange() {
        this.value = new Date(this.$input.val());

        this.trigger('change', this.value);
    }

    render() {
        this.$element = _.div({class: 'field-editor date-editor'},
            this.disabled ? 
                _.p({}, this.value)
            :
                this.$input = _.input({class: 'form-control', type: 'text', value: this.value})
        );

        if(this.$input) {
            this.$input.datepicker();

            this.$input.on('changeDate', () => {
                editor.onChange();
            })
        }
    }
}

module.exports = DateEditor;
