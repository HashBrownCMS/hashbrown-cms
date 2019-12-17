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

        this.state.schemas = await HashBrown.Service.SchemaService.getAllSchemas();
        this.state.connections = await HashBrown.Service.ConnectionService.getAllConnections();
    }

    /**
     * Gets a schema synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Schema.SchemaBase} Schema
     */
    getSchema(id) {
        for(let schema of this.state.schemas || []) {
            if(schema.id === id) { return schema; }
        }

        return null;
    }
    
    /**
     * Gets a connection synchronously
     *
     * @param {String} id
     *
     * @return {HashBrown.Entity.Resource.Connection} Connection
     */
    getConnection(id) {
        for(let connection of this.state.connections || []) {
            if(connection.id === id) { return connection; }
        }

        return null;
    }

    /**
     * Pre render
     */
    prerender() {
        this.state.title = this.model.id;
        this.state.icon = 'code';
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
                case 'schemaId': case 'parentSchemaId':
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
                    
                case 'connectionId':
                    if(!v || typeof v !== 'string') { break; }
                    if(this.getConnection(v)) { break; }

                    throw new Error('Connection "' + v + '" not found');
                   
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
            this.model = JSON.parse(newValue);
            this.trigger('change', this.model);
        
        } catch(e) {
            this.state.warning = e.message;
            this.namedElements.save.setAttribute('disabled', true);
        
        }
        
        this.renderPartial('warning');
    }

    /**
     * Event: Click save
     */
    async onClickSave() {
        this.state.warning = null;
        this.namedElements.save.removeAttribute('disabled');
        
        try {
            let value = this.namedElements.body.model.value;
            this.debug(this.mode);

            await super.onClickSave();
            
        } catch(e) {
            this.state.warning = e.message;
            this.namedElements.save.setAttribute('disabled', true);

        }
        
        this.renderPartial('warning');
    }
}

module.exports = JsonEditor;
