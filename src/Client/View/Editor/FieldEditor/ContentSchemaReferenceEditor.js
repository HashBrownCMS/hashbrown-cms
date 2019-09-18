'use strict';

/**
 * An editor for referencing Content Schema
 *
 * @descripton Example:
 * <pre>
 * {
 *     "myContentSchemaReference": {
 *         "label": "My content schema reference",
 *         "tabId": "content",
 *         "schemaId": "contentSchemaReference",
 *         "config": {
 *             "allowedSchemas": "fromParent" || [ "myCustomSchema" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class ContentSchemaReferenceEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);
       
        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            // Get dropdown options 
            this.options = {};

            let allSchemas = await HashBrown.Service.SchemaService.getAllSchemas();

            for(let schema of allSchemas) {
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
                    this.options[schema.name] = schema.id;
                }
            }

            // Adopt allowed Schema from parent if applicable
            let parentSchema = await this.getParentSchema();

            if(parentSchema && this.config && this.config.allowedSchemas == 'fromParent') {
                this.config.allowedSchemas = parentSchema.allowedChildSchemas; 
            }

            super.fetch();
        
        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Gets the parent Schema
     *
     * @returns {Schema} Parentn Schema
     */
    async getParentSchema() {
        // Return config parent Schema if available
        if(this.config.parentSchema) { return this.config.parentSchema; }

        // Fetch current ContentEditor
        let contentEditor = Crisp.View.get('ContentEditor');

        if(!contentEditor) { return null; }

        // Fetch current Content model
        let thisContent = contentEditor.model;

        if(!thisContent) { return null; }
        
        // Fetch parent Content
        if(!thisContent.parentId) { return null; }
        
        let parentContent = await HashBrown.Service.ContentService.getContentById(thisContent.parentId);

        if(!parentContent) {
            UI.errorModal(new Error('Content by id "' + thisContent.parentId + '" not found'));
            return null;
        }

        // Fetch parent Schema
        let parentSchema = await HashBrown.Service.SchemaService.getSchemaById(parentContent.schemaId);
            
        if(!parentSchema) {
            UI.errorModal(new Error('Schema by id "' + parentContent.schemaId + '" not found'));
            return null;
        }

        // Return parent Schema
        return parentSchema;
    }
    
    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        config.allowedSchemas = config.allowedSchemas || [];
        
        return this.field(
            'Allowed Schema',
            new HashBrown.View.Widget.Dropdown({
                options: HashBrown.Service.SchemaService.getAllSchemas('content'),
                useMultiple: true,
                value: config.allowedSchemas,
                useClearButton: true,
                valueKey: 'id',
                labelKey: 'name',
                iconKey: 'icon',
                onChange: (newValue) => {
                    config.allowedSchemas = newValue;
                }
            })
        );
    }

    /**
     * Picks the first available Schema
     */
    pickFirstSchema() {
        let options = this.contentSchema;

        if(options.length < 1) { return; }

        this.value = options[0].id;

        this.trigger('change', this.value);

        this.fetch();
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--content-schema-reference'}, 
            new HashBrown.Entity.View.Widget.Popup({
                model: {
                    value: this.value,
                    options: this.options,
                    onchange: (newValue) => {
                        this.value = newValue;

                        this.trigger('change', this.value);
                    }
                }
            }).element
        );
    }
}

module.exports = ContentSchemaReferenceEditor;
