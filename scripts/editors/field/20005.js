resources.editors['20005'] = function(params) {
    var editor = this;

    params.value = params.value || {};

    var toDate = new Date(params.value.to);
    var fromDate = new Date(params.value.from);

    this.onChange = function onChange() {
        params.onChange({
            to: this.$to.val(),
            from: this.$from.val()
        });
    };

    this.$element = _.div({class: 'field-editor period-editor flex-horizontal input-group'}, [
        this.$from = _.input({class: 'form-control', type: 'text', value: params.value.from}),
        _.div({class: 'arrow-middle'},
            _.span({class: 'fa fa-arrow-right'})
        ),
        this.$to = _.input({class: 'form-control', type: 'text', value: params.value.to})
    ]);

    this.$from.datepicker();
    this.$to.datepicker();

    this.$from.on('changeDate', function() {
        editor.onChange();
    })
    
    this.$to.on('changeDate', function() {
        editor.onChange();
    })
}
