'use strict';

/**
 * An editor for referring to other Content
 *
 * @description Example:
 * <pre>
 * {
 *     "myContentReference": {
 *         "label": "My content reference",
 *         "tabId": "content",
 *         "schemaId": "contentReference",
 *         "config": {
 *            "allowedSchemas": [ "page", "myCustomSchema" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class ContentReferenceEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Change value
     */
    onChange(newValue) {
        this.value = newValue;

        this.trigger('change', this.value);
    }

    /**
     * Gets a list of allowed Content options
     *
     * @returns {Array} List of options
     */
    async getDropdownOptions() {
        let allContent = await HashBrown.Service.ContentService.getAllContent();
        let allowedContent = {};
        let areRulesDefined = this.config && Array.isArray(this.config.allowedSchemas) && this.config.allowedSchemas.length > 0;

        for(let content of allContent) {
            if(areRulesDefined) {
                let isContentAllowed = this.config.allowedSchemas.indexOf(content.schemaId) > -1;
                
                if(!isContentAllowed) { continue; }
            }

            let title = content.prop('title', HashBrown.Context.language) || content.id;

            allowedContent[title] = content.id;
        }

        return allowedContent;
    }
    
    /**
     * Gets the field label
     *
     * @return {String} Label
     */
    getFieldLabel() {
        if(this.model && this.model.prop('title', HashBrown.Context.language)) {
            return this.model.prop('title', HashBrown.Context.language); 
        }

        return super.getFieldLabel();
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
            new HashBrown.Entity.View.Widget.Popup({
                model: {
                    options: (async () => {
                        let options = {};
                        let schemas = await HashBrown.Service.SchemaService.getAllSchemas('content');

                        for(let schema of schemas) {
                            options[schema.name] = schema.id;
                        }

                        return options;
                    })(),
                    multiple: true,
                    value: config.allowedSchemas,
                    clearable: true,
                    onchange: (newValue) => {
                        config.allowedSchemas = newValue;
                    }
                }
            }).element
        );
    }

    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--content-reference'},
            new HashBrown.Entity.View.Widget.Popup({
                model: {
                    value: this.value,
                    options: this.getDropdownOptions(),
                    autocomplete: true,
                    clearable: true,
                    onchange: (newValue) => {
                        this.value = newValue;

                        this.trigger('change', this.value);
                    }
                }
            }).element
        );
    }
}

module.exports = ContentReferenceEditor;
