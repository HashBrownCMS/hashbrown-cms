'use strict';

/**
 * A field for referencing other content
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class ContentReferenceEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/contentReferenceEditor');
        this.configTemplate = require('template/field/config/contentReferenceEditor');
    }

    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value) {
            let resource = await HashBrown.Entity.Resource.Content.get(this.state.value);

            if(resource) {
                return resource.getName();
            }
        }

        return await super.getValueLabel();
    }
    
    /**
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schema of await HashBrown.Entity.Resource.ContentSchema.list() || []) {
                this.state.schemaOptions[schema.name] = schema.id;
            }

        } else {
            let allContent = await HashBrown.Entity.Resource.Content.list();

            this.state.contentOptions = {};

            for(let content of allContent) {
                if(this.model.config.allowedSchemas && this.model.config.allowedSchemas.indexOf(content.schemaId) < 0) { continue; }

                this.state.contentOptions[content.prop('title', HashBrown.Client.locale) || content.id] = content.id;
            }
        }
    }   
}

module.exports = ContentReferenceEditor;
