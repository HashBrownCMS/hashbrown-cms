'use strict';

/**
 * The editor for schema resources
 */
class SchemaEditor extends HashBrown.Entity.View.ResourceEditor.ResourceEditorBase {
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
        await super.fetch();

        if(!this.model) { return; }

        this.state.compiledSchema = await HashBrown.Entity.Resource.SchemaBase.get(this.model.id, { withParentFields: true });

        let allContentSchemas = await HashBrown.Entity.Resource.ContentSchema.list();

        this.state.childSchemaOptions = {};

        for(let schema of allContentSchemas) {
            if(schema.id === 'contentBase' || schema.id === 'page') { continue; }

            this.state.childSchemaOptions[schema.name] = schema.id;
        }
        
        this.state.parentSchemaOptions = {};

        let parentSchemas = await this.model.constructor.list();

        for(let schema of parentSchemas) {
            if(schema.id === this.model.id) { continue; }
            
            this.state.parentSchemaOptions[schema.name] = schema.id;
        }   
    }

    /**
     * Pre render
     */
    prerender() {
        if(this.state.name) { return; }

        if(this.model instanceof HashBrown.Entity.Resource.ContentSchema) {
            this.state.tab = this.state.tab || 'content';
            this.state.properties = {};
            this.state.parentTabs = {};
            this.state.tabOptions = {};

            // Build parent tabs and tab options
            for(let tabId in this.state.compiledSchema.tabs) {
                this.state.tabOptions[this.state.compiledSchema.tabs[tabId]] = tabId;

                if(this.model.tabs[tabId]) { continue; }

                this.state.parentTabs[tabId] = this.state.compiledSchema.tabs[tabId];
            }
            
            for(let tabId in this.model.tabs) {
                this.state.tabOptions[this.model.tabs[tabId]] = tabId;
            }

            if(!this.model.config) { return; }

            for(let key in this.model.config) {
                let definition = this.model.config[key];

                if(!definition.tabId) { definition.tabId = 'content'; }

                if(definition.tabId !== this.state.tab) { continue; }

                this.state.properties[key] = definition.label;
            }
        
        } else if(this.model instanceof HashBrown.Entity.Resource.FieldSchema) {
            this.state.fieldConfigEditor = null;
            
            let fieldType = HashBrown.Entity.View.Field[this.state.compiledSchema.editorId];
           
            if(fieldType) {
                this.state.fieldConfigEditor = new fieldType({
                    model: this.model,
                    state: {
                        name: 'config',
                        hideKey: true,
                        hideTools: true
                    }
                });

                this.state.fieldConfigEditor.on('change', (newValue) => {
                    this.model.config = newValue;

                    this.onChange();
                });
            }
        }
    }

    /**
     * Event: Change name
     */
    onChangeName(name) {
        this.model.name = name;

        this.onChange();
    }
    
    /**
     * Event: Click change icon
     */
    onClickChangeIcon() {
        let modal = HashBrown.Entity.View.Modal.PickIcon.new();

        modal.on('change', (newIcon) => {
            this.model.icon = newIcon;

            this.onChange();
            this.render();
        });
    }
    
    /**
     * Event: Click edit field
     *
     * @param {String} key
     */
    onClickEditField(key) {
        if(!this.model.config) { this.model.config = {}; }
        if(!this.model.config[key]) { this.model.config[key] = { tabId: this.state.tab, schemaId: 'string' }; }

        let modal = HashBrown.Entity.View.Modal.EditField.new({
            model: {
                tabOptions: this.state.tabOptions,
                key: key,
                definition: this.model.config[key]
            }
        });
        
        modal.on('changekey', (newKey) => {
            this.onChangeFieldKey(key, newKey);

            key = newKey;

            this.render();
        });

        modal.on('change', (newValue) => {
            this.onChangeFieldDefinition(key, newValue);
            
            this.render();
        });
    }
    
    /**
     * Event: Click start tour
     */
    async onClickStartTour() {
        if(location.hash.indexOf('schemas/') < 0) {
            location.hash = '/schemas/';
        }
       
        await new Promise((resolve) => { setTimeout(() => { resolve(); }, 500); });
            
        await UI.highlight('.navigation--resource-browser__tab[href="#/schemas/"]', 'This the schemas section, where you will define how content is structured.', 'right', 'next');

        await UI.highlight('.panel', 'Here you will find all of your schemas. They are divided into 2 major categories, "field" and "content". Content schemas define which fields are available to content authors, and field schemas define how they are presented.', 'right', 'next');
        
        await UI.highlight('.resource-editor', 'This is the schema editor, where you can edit schemas.', 'left', 'next');
    }

    /**
     * Event: Change field key
     */
    onChangeFieldKey(oldKey, newKey) {
        let keys = Object.keys(this.model.config);

        let newFields = {};

        for(let key of keys) {
            let value = this.model.config[key];

            if(key === oldKey) { key = newKey; }

            newFields[key] = value;
        }

        this.model.config = newFields;

        this.onChange();
    }

    /**
     * Event: Change field definition
     */
    onChangeFieldDefinition(key, newValue) {
        if(!this.model.config) { this.model.config = {}; }
        if(!this.model.config[key]) { this.model.config[key] = { schemaId: 'string' }; }
       
        this.model.config[key] = newValue;

        this.onChange();
    }

    /**
     * Event: Change field sorting
     */
    onChangeFieldSorting(fields) {
        let newFields = {};

        // Add fields from list widget
        for(let key in fields) {
            let definition = this.model.config[key];

            newFields[key] = definition || { tabId: this.state.tab, label: fields[key] };
        }
        
        // Add back remaining fields not in the current view
        for(let key in this.model.config) {
            let definition = this.model.config[key];

            if(definition.tabId === this.state.tab) { continue; }

            newFields[key] = definition;
        }
        
        let isNewField = Object.keys(fields).length > Object.keys(this.state.properties).length;

        this.model.config = newFields;
        
        if(isNewField) {
            this.onClickEditField(Object.keys(fields).pop());
        }
        
        this.onChange();
    }

    /**
     * Event: Change allowed at root
     */
    onChangeAllowedAtRoot(newValue) {
        this.model.allowedAtRoot = newValue;
        
        this.onChange();
    }

    /**
     * Event: Change allowed child schemas
     */
    onChangeAllowedChildSchemas(newValue) {
        this.model.allowedChildSchemas = newValue;
        
        this.onChange();
    }
    
    /**
     * Event: Change parent schema id
     */
    onChangeParentId(newValue) {
        this.model.parentId = newValue;

        this.onChange();
    }

    /**
     * Event: Change default tab id
     */
    onChangeDefaultTabId(newValue) {
        this.model.defaultTabId = newValue;
        
        this.onChange();
    }

    /**
     * Event: Change tabs
     */
    onChangeTabs(tabs) {
        this.model.tabs = tabs;

        this.render();

        this.onChange();
    }

    /**
     * Event: Switch tab
     */
    onSwitchTab(tab) {
        this.state.tab = tab;

        this.render();
    }
}

module.exports = SchemaEditor;
