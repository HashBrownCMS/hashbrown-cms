'use strict';

/**
 * The modal for creating new content
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class CreateContent extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/createContent');
    }

    /**
     * Fetches the view data
     */
    async fetch() {
        this.state.schemaOptions = {};
        
        // Build schema options based on parent content
        if(this.model.parentId) {
            let parentContent = await HashBrown.Entity.Resource.Content.get(this.model.parentId);
            let parentSchema = await HashBrown.Entity.Resource.ContentSchema.get(parentContent.schemaId);
        
            if(!parentSchema.allowedChildSchemas || parentSchema.allowedChildSchemas.length < 1) {
                throw new Error('No child content schemas are allowed under this parent');
            }
            
            for(let id of parentSchema.allowedChildSchemas) {
                let schema = await HashBrown.Entity.Resource.ContentSchema.get(id);

                this.state.schemaOptions[schema.name] = schema.id;
            }
        
        // Build schema options with all content schemas allowed at the root
        } else {
            let schemas = await HashBrown.Entity.Resource.ContentSchema.list();
            
            for(let schema of schemas) {
                if(!schema.allowedAtRoot) { continue; }

                this.state.schemaOptions[schema.name] = schema.id;
            }
        
        }

        this.state.schemaId = Object.values(this.state.schemaOptions)[0];
    }

    /**
     * Event: Selected schema
     *
     * @param {String} schemaId
     */
    async onSelectSchema(schemaId) {
        this.state.schemaId = schemaId;
    }

    /**
     * Event: Click create
     */
    async onClickCreate() {
        if(!this.state.schemaId) { return; }
            
        try {
            let newContent = await HashBrown.Entity.Resource.Content.create({
                schemaId: this.state.schemaId,
                parentId: this.model.parentId
            });

            location.hash = '/content/' + newContent.id;

            this.close();

        } catch(e) {
            this.setErrorState(e);

        }
    }
}

module.exports = CreateContent;
