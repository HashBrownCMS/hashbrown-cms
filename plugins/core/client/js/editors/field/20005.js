resources.editors['20005'] = function(params) {
    var editor = this;

    params.value = params.value || {};
    params.value.enabled = params.value.enabled == true || params.value.enabled == "true";

    var toDate = new Date(params.value.to);
    var fromDate = new Date(params.value.from);
    var switchId = 'switch-' + $('.switch').length;

    this.onChange = function onChange() {
        var newValue = {
            enabled: this.$toggle[0].checked,
            from: this.$from.val(),
            to: this.$to.val()
        };
        
        params.onChange(newValue);

        console.log(newValue);
    };

    this.$element = _.div({class: 'field-editor period-editor'},
        _.div({class: 'input-group'}, [      
            this.$from = _.input({class: 'form-control' + (params.value.enabled ? '' : ' disabled'), type: 'text', value: params.value.from}),
            _.div({class: 'arrow-middle input-group-addon'},
                _.span({class: 'fa fa-arrow-right'})
            ),
            this.$to = _.input({class: 'form-control' + (params.value.enabled ? '' : ' disabled'), type: 'text', value: params.value.to}),
            _.div({class: 'input-group-addon'},
                _.div({class: 'switch'}, [
                    this.$toggle = _.input({id: switchId, class: 'form-control switch', type: 'checkbox'}),
                    _.label({for: switchId})
                ])
            )
        ])
    );

    this.$from.datepicker();
    this.$to.datepicker();

    this.$toggle[0].checked = params.value.enabled;

    this.$from.on('changeDate', function() {
        editor.onChange();
    })
    
    this.$to.on('changeDate', function() {
        editor.onChange();
    })

    this.$toggle.on('change', function() {
        editor.$from.toggleClass('disabled', !this.checked);
        editor.$to.toggleClass('disabled', !this.checked);
        
        editor.onChange();
    });
}
