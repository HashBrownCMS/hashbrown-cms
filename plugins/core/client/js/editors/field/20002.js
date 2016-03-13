resources.editors['20002'] = function(params) {
    var editor = this;

    var date = new Date(params.value);

    this.onChange = function onChange() {
        params.onChange(this.$input.val());
    };

    this.$element = _.div({class: 'field-editor date-editor'},
        params.disabled ? 
            _.p({}, date)
        :
            this.$input = _.input({class: 'form-control', type: 'text', value: params.value})
    );

    if(this.$input) {
        this.$input.datepicker();

        this.$input.on('changeDate', function() {
            editor.onChange();
        })
    }
}
