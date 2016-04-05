'use strict';

class DateEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.$input.val());
    }

    render() {
        var editor = this;

        this.value = parseInt(this.value);

        var date = new Date(this.value);

        this.$element = _.div({class: 'field-editor date-editor'},
            this.disabled ? 
                _.p({}, date)
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

resources.editors['20002'] = DateEditor;
