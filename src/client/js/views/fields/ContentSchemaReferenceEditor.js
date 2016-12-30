'use strict';

/**
 * An editor for referencing content schemas
 */
class ContentSchemaReferenceEditor extends View {
    constructor(params) {
        super(params);
       
        this.$element = _.div({class: 'field-editor content-schema-reference-editor'});
        
        // Fetch current Content model
        let thisContent = resources.content.filter((c) => { return c.id == Router.params.id; })[0];

        if(!thisContent) {
            UI.errorModal(new Error('Content by id "' + Router.params.id + '" not found'));
            return;
        }
        
        // If no allowed Schemas are referred to by parent, proceed as normal
        if(!thisContent.parentId || !this.config || !this.config.allowedSchemas == 'fromParent') {
            this.init();
            return;
        }

        // Fetch parent Content
        let parentContent = resources.content.filter((c) => { return c.id == thisContent.parentId; })[0];

        if(!parentContent) {
            UI.errorModal(new Error('Content by id "' + thisContent.parentId + '" not found'));
            return;
        }

        // Fetch parent Schema
        let parentSchema = resources.schemas[parentContent.schemaId];
            
        if(!parentSchema) {
            UI.errorModal(new Error('Schema by id "' + parentContent.schematId + '" not found'));
            return;
        }

        // Adopt allowed Schemas from parent
        this.config.allowedSchemas = parentSchema.allowedChildSchemas;                            
        this.init();
    }

    /**
     * Event: Change input
     *
     * @param {String} newValue
     */
    onChange(newValue) {
        this.value = newValue;
        this.trigger('change', this.value);

        // Only re-render if the ContentEditor is the parent
        if(this.$element.parents('.content-editor').length > 0) {
            let contentEditor = ViewHelper.get('ContentEditor');

            contentEditor.render();
        }
    }

    /**
     * Gets schema types
     *
     * @returns {Array} List of options
     */
    getDropdownOptions() {
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
                contentSchemas[contentSchemas.length] = {
                    label: schema.name,
                    value: schema.id,
                    selected: schema.id == this.value
                };
            }
        }

        return contentSchemas;
    }

    render() {
        this.$element.html(
            UI.inputDropdownTypeAhead('(none)', this.getDropdownOptions(), (newValue) => {
                this.onChange(newValue);
            }, true)
        );
    }
}

module.exports = ContentSchemaReferenceEditor;
