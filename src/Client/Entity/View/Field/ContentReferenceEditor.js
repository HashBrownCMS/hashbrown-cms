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
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schema of await HashBrown.Service.SchemaService.getAllSchemas('content') || []) {
                this.state.schemaOptions[schema.name] = schema.id;
            }

        } else {
            let allContent = await HashBrown.Service.ContentService.getAllContent();

            this.state.contentOptions = {};

            for(let content of allContent) {
                if(this.model.config.allowedSchemas && this.model.config.allowedSchemas.indexOf(content.schemaId) < 0) { continue; }

                this.state.contentOptions[content.prop('title', HashBrown.Context.language) || content.id] = content.id;
            }
        }
    }   
}

module.exports = ContentReferenceEditor;
