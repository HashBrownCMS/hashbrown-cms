'use strict';

class SchemaReferenceEditor extends View {
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
        
        this.$element = _.div({class: 'field-editor schema-reference-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(window.resources.schemas, function(id, schema) {
                    if(editor.config) {
                        var id = parseInt(schema.id);

                        if(editor.config.min && id < editor.config.min) {
                            return;
                        }
                        
                        if(editor.config.max && id > editor.config.max) {
                            return;
                        }
                    }

                    return _.option({value: schema.id}, schema.name);
                })
            ).change(function() { editor.onChange(); })
        );

        this.$select.val(editor.value);
    }
}

resources.editors.schemaReference = SchemaReferenceEditor;
