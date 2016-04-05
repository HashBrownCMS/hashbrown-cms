'use strict';

class DropdownEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
    
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }

    render() {
        let editor = this;

        this.$element = _.div({class: 'field-editor dropdown-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.config.options, function(i, option) {
                    return _.option({
                        value: option.value,
                        selected: editor.value == option.value
                    }, option.label);
                })
            ).change(function() { editor.onChange(); })
        );
    }
}


resources.editors['20008'] = DropdownEditor;
