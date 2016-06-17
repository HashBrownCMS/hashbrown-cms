'use strict';

/**
 * A simple list picker
 */
class DropdownEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }
   
    /**
     * Event: Change value
     */ 
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }

    render() {
        this.$element = _.div({class: 'field-editor dropdown-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.config.options, (i, option) => {
                    return _.option({
                        value: option.value,
                        selected: editor.value == option.value
                    }, option.label);
                })
            ).change(() => { editor.onChange(); })
        );
    }
}


module.exports = DropdownEditor;
