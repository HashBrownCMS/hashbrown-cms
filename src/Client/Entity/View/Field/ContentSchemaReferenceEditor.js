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
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
        if(this.state.value) {
            let resource = await HashBrown.Entity.Resource.ContentSchema.get(this.state.value);

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
       
            if(!Array.isArray(allowedSchemas)) { allowedSchemas = []; }

            for(let schema of allSchemas) {
                if(allowedSchemas.indexOf(schema.id) < 0) { continue; }

                this.state.schemaOptions[schema.name] = schema.id;
            }
        }
    }   
}

module.exports = ContentSchemaReferenceEditor;
