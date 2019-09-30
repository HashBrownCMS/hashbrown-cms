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
        if(this.state.id) {
            this.model = await HashBrown.Service.SchemaService.getSchemaById(this.state.id);
        }    
    }

    /**
     * Pre render
     */
    prerender() {
        this.state.title = this.model.name;
        this.state.icon = this.model.icon;
        this.state.fieldConfigEditor = null;
        this.state.properties = null;
        
        if(this.model instanceof HashBrown.Entity.Resource.Schema.ContentSchema) {
            this.state.properties = {};

            if(!this.model.fields) { this.model.fields = {}; }
            if(!this.model.fields.properties) { this.model.fields.properties = {}; }
        
            for(let key in this.model.fields.properties) {
                let definition = this.model.fields.properties[key];

                this.state.properties[key] = definition.label;
            } 
        
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
     * Event: Change id
     */
    onChangeId(id) {
        this.model.id = id;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Change name
     */
    onChangeName(name) {
        this.model.name = name;

        this.trigger('change', this.model);
    }
    
    /**
     * Event: Click change icon
     */
    onClickChangeIcon() {
        let modal = new HashBrown.Entity.View.Modal.PickIcon();

        modal.on('change', (newIcon) => {
            this.model.icon = newIcon;

            this.trigger('change', this.model);
            this.refresh();
            this.render();
        });
    }
    
    /**
     * Event: Click edit field
     *
     * @param {String} key
     */
    onClickEditField(key) {
        if(!this.model.fields) { this.model.fields = {}; }
        if(!this.model.fields.properties) { this.model.fields.properties = {}; }
        if(!this.model.fields.properties[key]) { this.model.fields.properties[key] = { schemaId: 'string' }; }

        let modal = new HashBrown.Entity.View.Modal.EditField({
            model: {
                key: key,
                definition: this.model.fields.properties[key]
            }
        });
        
        modal.on('changekey', (newKey) => {
            this.onChangeFieldKey(key, newKey);

            key = newKey;
        });

        modal.on('change', (newValue) => {
            this.onChangeFieldDefinition(key, newValue);
        });
    }

    /**
     * Event: Change field key
     */
    onChangeFieldKey(oldKey, newKey) {
        let keys = Object.keys(this.model.fields.properties);

        let newFields = {};

        for(let key of keys) {
            let value = this.model.fields.properties[key];

            if(key === oldKey) { key = newKey; }

            newFields[key] = value;
        }

        this.model.fields.properties = newFields;

        this.trigger('change', this.model);
    }

    /**
     * Event: Change field definition
     */
    onChangeFieldDefinition(key, newValue) {
        if(!this.model.fields) { this.model.fields = {}; }
        if(!this.model.fields.properties) { this.model.fields.properties = {}; }
        if(!this.model.fields.properties[key]) { this.model.fields.properties[key] = { schemaId: 'string' }; }
       
        this.model.fields.properties[key] = newValue;

        this.trigger('change', this.model);
    }

    /**
     * Event: Change field sorting
     */
    onChangeFieldSorting(fields) {
        let newFields = {};

        for(let key in fields) {
            let value = this.model.fields.properties[key];

            newFields[key] = value || { label: fields[key] };
        }

        let isNewField = Object.keys(fields).length > Object.keys(this.model.fields.properties).length;

        this.model.fields.properties = newFields;
        
        if(isNewField) {
            this.onClickEditField(Object.keys(fields).pop());
        }
        
        this.trigger('change', this.model);
    }
    
    /**
     * Event: Click save
     */
    async onClickSave() {
        await HashBrown.Service.SchemaService.setSchemaById(this.model.id, this.model);

        UI.notifySmall(`"${this.state.title}" saved successfully`, null, 3);
    }
}

module.exports = SchemaEditor;
