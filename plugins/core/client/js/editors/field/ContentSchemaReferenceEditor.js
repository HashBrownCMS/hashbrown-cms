'use strict';

class ContentSchemaReferenceEditor extends View {
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

    /**
     * Gets schema types
     */
    getContentSchemas() {
        let contentSchemas = [];

        for(let id in window.resources.schemas) {
            let schema = window.resources.schemas[id];

            if(schema.type == 'content') {
                contentSchemas[contentSchemas.length] = schema;
            }
        }

        return contentSchemas;
    }

    render() {
        this.$element = _.div({class: 'field-editor content-schema-reference-editor'},
            this.$select = _.select({class: 'form-control'},
                _.each(this.getContentSchemas(), (i, schema) => {
                    return _.option({value: schema.id}, schema.name);
                })
            ).change(() => { this.onChange(); })
        );

        this.$select.val(this.value);
    }
}

resources.editors.contentSchemaReference = ContentSchemaReferenceEditor;
