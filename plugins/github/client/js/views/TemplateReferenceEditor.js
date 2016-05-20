'use strict';

/**
 * A template reference editor
 */
class TemplateReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    /**
     * Event: Change
     */
    onChange() {
        this.value = this.$select.val();

        this.trigger('change', this.value);
    }
    
    render() {
        let editor = this;

        this.$element = _.div({class: 'field-editor template-reference-editor'});

        $.getJSON('/api/github/templates/', function(response) {
            editor.$select = _.select({class: 'form-control'},
                _.each(response.templates, function(i, template) {
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
