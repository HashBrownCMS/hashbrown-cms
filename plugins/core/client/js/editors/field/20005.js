'use strict';

class PeriodEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        var newValue = {
            enabled: this.$toggle[0].checked,
            from: this.$from.val(),
            to: this.$to.val()
        };
        
        this.trigger('change', newValue);
    }

    render() {
        var editor = this;

        editor.value = editor.value || {};
        editor.value.enabled = editor.value.enabled == true || editor.value.enabled == "true";

        var toDate = new Date(editor.value.to);
        var fromDate = new Date(editor.value.from);
        var switchId = 'switch-' + $('.switch').length;

        this.$element = _.div({class: 'field-editor period-editor'},
            _.div({class: 'input-group'}, [      
                this.$from = _.input({class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.from}),
                _.div({class: 'arrow-middle input-group-addon'},
                    _.span({class: 'fa fa-arrow-right'})
                ),
                this.$to = _.input({class: 'form-control' + (editor.value.enabled ? '' : ' disabled'), type: 'text', value: editor.value.to}),
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

        this.$toggle[0].checked = editor.value.enabled;

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
}

resources.editors['20005'] = PeriodEditor;
