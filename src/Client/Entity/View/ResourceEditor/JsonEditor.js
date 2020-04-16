'use strict';

/**
 * The advanced resource editor
 */
class JsonEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return HashBrown.Service.NavigationService.getRoute(0); }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/jsonEditor.js');
    }
    
    /**
     * Override this check
     */
    editedCheck() {}

    /**
     * Fetches the view data
     */
    async fetch() {
        await super.fetch();

        this.state.schemas = await HashBrown.Entity.Resource.SchemaBase.list();
    }

    /**
     * Gets a schema synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.SchemaBase} Schema
     */
    getSchema(id) {
        for(let schema of this.state.schemas || []) {
            if(schema.id === id) { return schema; }
        }

        return null;
    }
    
    /**
     * Debugs JSON
     */
    debug(obj) {
        if(typeof obj === 'string') {
            obj = JSON.parse(obj);
        }

        for(let k in obj) {
            let v = obj[k];

            switch(k) {
                case 'schemaId': case 'parentId':
                    if(!v || typeof v !== 'string') { break; }
                    if(this.getSchema(v)) { break; }

                    throw new Error('Schema "' + v + '" not found');
               
                case 'allowedSchemas': case 'allowedChildSchemas':
                    if(!Array.isArray(v)) { break; }

                    let invalidSchemas = [];
                   
                    for(let schemaId of v) {
                        if(this.getSchema(schemaId)) { continue; }

                        invalidSchemas.push(schemaId);
                    }

                    if(invalidSchemas.length === 1) {
                        throw new Error('Schema ' + invalidSchemas[0] + ' not found');
 
                    } else if(invalidSchemas.length > 1) {
                        throw new Error('Schemas ' + invalidSchemas.join(', ') + ' not found');
                    
                    }

                    break;
            }

            if(v && v.constructor === Object) {
                this.debug(v);
            }
        }
    }

    /**
     * Event: Change JSON
     */
    onChangeJson(newValue) {
        this.state.warning = null;
        this.namedElements.save.removeAttribute('disabled');
        
        try {
            this.debug(newValue);
            this.model = this.itemType.new(JSON.parse(newValue));
            this.trigger('change', this.model);
        
        } catch(e) {
            this.state.warning = e.message;
            this.namedElements.save.setAttribute('disabled', true);
        
            debug.error(e, this, true);

        }
        
        this.renderPartial('warning');
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        this.state.warning = null;
       
        try {
            let value = this.namedElements.body.model.value;

            this.debug(this.model);

        } catch(e) {
            this.state.warning = e.message;

            debug.error(e, this, true);
            
            this.renderPartial('warning');

            return;
        }
            
        await super.onClickSave();    
    }
}

module.exports = JsonEditor;
