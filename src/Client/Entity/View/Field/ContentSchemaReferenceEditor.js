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

        this.model.innerTemplate = require('template/field/inc/contentSchemaReferenceEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        let allSchemas = await HashBrown.Service.SchemaService.getAllSchemas('content');

        this.state.schemaOptions = {};

        let allowedSchemas = this.model.config.allowedSchemas || [];

        let thisContentId = HashBrown.Service.NavigationService.getRoute(1);
        let thisContent = await HashBrown.Service.ContentService.getContentById(thisContentId);
        
        if(allowedSchemas === 'fromParent' && thisContent.parentId) {
            let parentContent = await HashBrown.Service.ContentService.getContentById(thisContent.parentId);
        
            allowedSchemas = parentContent.allowedChildSchemas || [];
        }

        if(!Array.isArray(allowedSchemas)) { allowedSchemas = []; }

        for(let schema of allSchemas) {
            if((!thisContent.parentId && schema.allowedAtRoot) || allowedSchemas.indexOf(schema.id) >= 0) {
                this.state.schemaOptions[schema.name] = schema.id;
            }
        }
    }   
    
    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
}

module.exports = ContentSchemaReferenceEditor;
