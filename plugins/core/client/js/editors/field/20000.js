/**
 * A simple string editor
 */
resources.editors['20000'] = function(params) {
    var editor = this;

    // Main element
    this.$element = _.div({class: 'field-editor string-editor'},
        this.$input = _.input({class: 'form-control', value: params.value})
            .bind('change propertychange paste keyup', function() { editor.onChange(); })
    );

    // Change event
    this.onChange = function onChange() {
        params.onChange(this.$input.val());
    };
};
