'use strict';

/**
 * A field for referencing content schemas
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class ContentSchemaReferenceEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/contentSchemaReferenceEditor');
        this.configTemplate = require('template/field/config/contentSchemaReferenceEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        let allSchemas = await HashBrown.Entity.Resource.ContentSchema.list() || [];

        if(this.state.name === 'config') {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schema of allSchemas) {
                this.state.schemaOptions[schema.name] = schema.id;
            }

        } else {
            this.state.schemaOptions = {};

            let allowedSchemas = this.model.config.allowedSchemas || [];

            let thisContentId = HashBrown.Service.NavigationService.getRoute(1);
            let thisContent = await HashBrown.Entity.Resource.Content.get(thisContentId);
            
            if(allowedSchemas === 'fromParent' && thisContent.parentId) {
                let parentContent = await HashBrown.Entity.Resource.Content.get(thisContent.parentId);
            
                allowedSchemas = parentContent.allowedChildSchemas || [];
            }

            if(!Array.isArray(allowedSchemas)) { allowedSchemas = []; }

            for(let schema of allSchemas) {
                if((!thisContent.parentId && schema.allowedAtRoot) || allowedSchemas.indexOf(schema.id) >= 0) {
                    this.state.schemaOptions[schema.name] = schema.id;
                }
            }
        }
    }   
}

module.exports = ContentSchemaReferenceEditor;
