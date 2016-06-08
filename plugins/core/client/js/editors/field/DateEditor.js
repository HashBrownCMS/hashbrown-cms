'use strict';

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

    onChange() {
        this.trigger('change', new Date(this.$input.val()));
    }

    render() {
        var editor = this;

        this.$element = _.div({class: 'field-editor date-editor'},
            this.disabled ? 
                _.p({}, this.value)
            :
                this.$input = _.input({class: 'form-control', type: 'text', value: this.value})
        );

        if(this.$input) {
            this.$input.datepicker();

            this.$input.on('changeDate', function() {
                editor.onChange();
            })
        }
    }
}

resources.editors.date = DateEditor;
