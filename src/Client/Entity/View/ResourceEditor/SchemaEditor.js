'use strict';

/**
 * The editor for schema resources
 */
class SchemaEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
    static get category() { return 'schemas'; }
    static get itemType() { return HashBrown.Entity.Resource.Schema.SchemaBase; }
    
    /**
     * Constructor
     */
    constructor(params) {
        super(params);
        
        this.template = require('template/resourceEditor/schemaEditor.js');
    }

    /**
     * Fetches the model
     */
    async fetch() {
        this.state.category = HashBrown.Service.NavigationService.getRoute(0);
        this.state.id = HashBrown.Service.NavigationService.getRoute(1);

        if(!this.state.id) {
            this.state.name = 'welcome';
                    
        } else {
            this.state.name = undefined;
            
            this.model = await HashBrown.Service.SchemaService.getSchemaById(this.state.id);
        
        }
        
        this.state.title = this.model.name;
        this.state.icon = this.model.icon;
        this.state.fieldConfigEditor = null;
            
        if(this.model instanceof HashBrown.Entity.Resource.Schema.ContentSchema) {
        
        } else if(this.model instanceof HashBrown.Entity.Resource.Schema.FieldSchema) {
            let fieldType = HashBrown.Entity.View.Field[this.model.editorId];
           
            if(fieldType) {
                this.state.fieldConfigEditor = new fieldType({
                    model: this.model,
                    state: { name: 'config' }
                });

                this.state.fieldConfigEditor.on('change', (newValue) => {
                    this.model.config = newValue;

                    this.trigger('change', this.model);
                });
            }
        }
    }

    /**
     * Event: Click change icon
     */
    onClickChangeIcon() {
        let modal = new HashBrown.Entity.View.Modal.PickIcon();

        modal.on('change', (newIcon) => {
            this.model.icon = newIcon;

            this.render();
        });
    }
}

module.exports = SchemaEditor;
