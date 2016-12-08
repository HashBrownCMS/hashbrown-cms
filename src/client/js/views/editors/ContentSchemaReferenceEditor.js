'use strict';

/**
 * An editor for referencing content schemas
 */
class ContentSchemaReferenceEditor extends View {
    constructor(params) {
        super(params);
       
        this.$element = _.div({class: 'field-editor content-schema-reference-editor'});
        
        // Fetch allowed Schemas from parent if needed 
        if(this.config && this.config.allowedSchemas == 'fromParent') {
            let thisContent = resources.content.filter((c) => { return c.id == Router.params.id; })[0];

            if(!thisContent) {
                UI.errorModal(new Error('Content by id "' + Router.params.id + '" not found'));

            } else if(thisContent.parentId) {
                let parentContent = resources.content.filter((c) => { return c.id == thisContent.parentId; })[0];

                if(!parentContent) {
                    UI.errorModal(new Error('Content by id "' + thisContent.parentId + '" not found'));

                } else {
                    let parentSchema = resources.schemas[parentContent.schemaId];
                        
                    if(!parentSchema) {
                        UI.errorModal(new Error('Schema by id "' + parentContent.schematId + '" not found'));

                    } else {
                        this.config.allowedSchemas = parentSchema.allowedChildSchemas;                            
                        this.init();
                    }
                }

            } else {
                this.init();
            
            }

        } else {
            this.init();
        
        }
    }

    /**
     * Event: Change input
     */
    onChange() {
        this.value = this.$select.val();
        this.trigger('change', this.value);

        // Only re-render if the ContentEditor is the parent
        if(this.$element.parents('.content-editor').length > 0) {
            let contentEditor = ViewHelper.get('ContentEditor');

            contentEditor.render();
        }
    }

    /**
     * Gets schema types
     */
    getContentSchemas() {
        let contentSchemas = [];

        for(let id in window.resources.schemas) {
            let schema = window.resources.schemas[id];
            let isNative = schema.id == 'page' || schema.id == 'contentBase';

            if(
                schema.type == 'content' &&
                !isNative &&
                (
                    !this.config ||
                    !this.config.allowedSchemas ||
                    !Array.isArray(this.config.allowedSchemas) ||
                    this.config.allowedSchemas.indexOf(schema.id) > -1
                )
            ) {
                contentSchemas[contentSchemas.length] = schema;
            }
        }

        return contentSchemas;
    }

    render() {
        this.$element.html(
            this.$select = _.select({class: 'form-control'},
                _.each(this.getContentSchemas(), (i, schema) => {
                    let selected = !this.value ? i == 0 : schema.id == this.value;

                    return _.option({value: schema.id, selected: selected}, schema.name);
                })
            ).change(() => { this.onChange(); })
        );
    }
}

module.exports = ContentSchemaReferenceEditor;
