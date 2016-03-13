resources.editors['20000'] = function(params) {
    var editor = this;

    this.$element = _.div({class: 'field-editor string-editor'},
        this.$input = _.input({class: 'form-control', value: params.value})
            .bind('change propertychange paste keyup', function() { editor.onChange(); })
    );

    this.onChange = function onChange() {
        params.onChange(this.$input.val());
    };
};
