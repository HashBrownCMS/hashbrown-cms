resources.editors['20003'] = function(params) {
    var editor = this;

    this.$element = _.div({class: 'field-editor url-editor input-group'}, [
        this.$input = _.input({class: 'form-control', value: params.value})
            .bind('change propertychange paste keyup', function() { this.onChange(); }),
        _.div({class: 'input-group-btn'},
            _.button({class: 'btn btn-primary'},
                'Regenerate '
            ).click(function() { editor.regenerate(); })
        )
    ]);

    this.regenerate = function regenerate() {
        this.$input.val('/new-url/');

        params.onChange(this.$input.val());
    };

    this.onChange = function onChange() {
        params.onChange(this.$input.val());
    };
};
