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

        this.template = require('template/field/contentReferenceEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        let allContent = await HashBrown.Service.ContentService.getAllContent();

        this.state.contentOptions = {};

        for(let content of allContent) {
            if(this.model.config.allowedSchemas && this.model.config.allowedSchemas.indexOf(content.schemaId) < 0) { continue; }

            this.state.contentOptions[content.prop('title', HashBrown.Context.language) || content.id] = content.id;
        }
    }   
}

module.exports = ContentReferenceEditor;
