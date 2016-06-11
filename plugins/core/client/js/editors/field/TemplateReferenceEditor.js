'use strict';

class TemplateReferenceEditor extends View {
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

        this.$element = _.div({class: 'field-editor template-reference-editor'});

        $.getJSON('/api/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/templates?token=' + localStorage.getItem('token'), function(templates) {
            editor.$select = _.select({class: 'form-control'},
                _.each(templates, function(i, template) {
                    return _.option({
                        value: template,
                        selected: editor.value == template
                    }, template);
                })
            ).change(function() { editor.onChange(); })

            editor.$element.html(editor.$select);
        });
    }
}

resources.editors.templateReference = TemplateReferenceEditor;
