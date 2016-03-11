resources.editors['20004'] = function(params) {
    var editor = this;

    this.onChange = function onChange() {
        params.onChange(this.$select.val());
    };

    this.$element = _.div({class: 'field-editor schema-editor'},
        this.$select = _.select({class: 'form-control'},
            _.each(window.resources.schemas, function(id, schema) {
                return _.option({value: schema.id}, schema.name);
            })
        ).change(function() { editor.onChange(); })
    );

    this.$select.val(params.value);
}
