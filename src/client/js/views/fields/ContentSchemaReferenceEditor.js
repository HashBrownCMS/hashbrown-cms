'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * An editor for referencing content schemas
 */
class ContentSchemaReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);
       
        this.$element = _.div({class: 'field-editor content-schema-reference-editor'});
       
        // Adopt allowed Schemas from parent if applicable
        let parentSchema = this.getParentSchema();

        if(parentSchema && this.config && this.config.allowedSchemas == 'fromParent') {
            this.config.allowedSchemas = parentSchema.allowedChildSchemas;                            
        }

        this.init();
    }

    /**
     * Gets the parent Schema
     *
     * @returns {Schema} Parentn Schema
     */
    getParentSchema() {
        // Return config parent Schema if available
        if(this.config.parentSchema) { return this.config.parentSchema; }

        // Fetch current ContentEditor
        let contentEditor = ViewHelper.get('ContentEditor');

        if(!contentEditor) { return null; }

        // Fetch current Content model
        let thisContent = contentEditor.model;

        if(!thisContent) { return null; }
        
        // Fetch parent Content
        if(!thisContent.parentId) { return null; }
        
        let parentContent = resources.content.filter((c) => { return c.id == thisContent.parentId; })[0];

        if(!parentContent) {
            UI.errorModal(new Error('Content by id "' + thisContent.parentId + '" not found'));
            return null;
        }

        // Fetch parent Schema
        let parentSchema = resources.schemas[parentContent.schemaId];
            
        if(!parentSchema) {
            UI.errorModal(new Error('Schema by id "' + parentContent.schemaId + '" not found'));
            return null;
        }

        // Return parent Schema
        return parentSchema;
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
        _.append(this.$element.empty(),
            // Render preview
            this.renderPreview(),

            UI.inputDropdownTypeAhead('(none)', this.getDropdownOptions(), (newValue) => {
                this.onChange(newValue);
            }, false)
        );
    }
}

module.exports = ContentSchemaReferenceEditor;
