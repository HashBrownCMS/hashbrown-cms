'use strict';

/**
 * An editor for referencing content schemas
 */
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

        ViewHelper.get('ContentEditor').render();
    }

    /**
     * Gets schema types
     */
    getContentSchemas() {
        let contentSchemas = [];

        for(let id in window.resources.schemas) {
            let schema = window.resources.schemas[id];
            let isNative = schema.id == 'page' || schema.id == 'contentBase';
        

            if(schema.type == 'content' && !isNative) {
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

module.exports = ContentSchemaReferenceEditor;
