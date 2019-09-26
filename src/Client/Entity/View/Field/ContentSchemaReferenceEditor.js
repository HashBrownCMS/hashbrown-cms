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

        this.template = require('template/field/contentSchemaReferenceEditor');
    }

    /**
     * Fetches view data
     */
    async fetch() {
        await super.fetch();

        let allSchemas = await HashBrown.Service.SchemaService.getAllSchemas('content');

        this.state.schemaOptions = {};

        for(let schema of allSchemas) {
            if(this.model.config.allowedSchemas && this.model.config.allowedSchemas.indexOf(schema.id) < 0) { continue; }

            this.state.schemaOptions[schema.name] = schema.id;
        }
    }   
}

module.exports = ContentSchemaReferenceEditor;
