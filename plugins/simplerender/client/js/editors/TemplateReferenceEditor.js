'use strict';

class TemplateReferenceEditor extends View {
    constructor(params) {
        super(params);
        
        this.init();
    }

    /**
     * Event: Change input
     */
    onChange() {
        this.trigger('change', this.$select.val());
    }

    render() {
        var editor = this;
        
        this.$element = _.div({class: 'field-editor template-reference-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(window.resources.templates, function(alias, template) {
                    return _.option({value: alias}, alias);
                })
            ).change(function() { editor.onChange(); })
        );

        this.$select.val(editor.value);
    }
}

resources.editors['20009'] = TemplateReferenceEditor;
