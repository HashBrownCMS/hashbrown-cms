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
            ContentHelper.getContentById(Router.params.id)
            .then((thisContent) => {
                if(thisContent.parentId) {
                    ContentHelper.getContentById(thisContent.parentId)
                    .then((parentContent) => {
                        SchemaHelper.getSchemaById(parentContent.schemaId)
                        .then((parentSchema) => {
                            this.config.allowedSchemas = parentSchema.allowedChildSchemas;                            
                            this.init();
                        })
                        .catch(errorModal);
                    })
                    .catch(errorModal);

                } else {
                    this.init();
                
                }
            })
            .catch(errorModal);

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
                    return _.option({value: schema.id}, schema.name);
                })
            ).change(() => { this.onChange(); })
        );

        this.$select.val(this.value);
    }
}

module.exports = ContentSchemaReferenceEditor;
