'use strict';

/**
 * A field for managing structures of other fields
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class StructEditor extends HashBrown.Entity.View.Field.FieldBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.editorTemplate = require('template/field/editor/structEditor');
        this.configTemplate = require('template/field/config/structEditor');

        this.state.isCollapsed = this.state.name !== 'config';
    }

    /**
     * Fetches view data
     */
    async fetch() {
        if(this.state.name === 'config') {
            // Build schema options
            this.state.schemaOptions = {};

            for(let schema of await HashBrown.Service.SchemaService.getAllSchemas('field') || []) {
                this.state.schemaOptions[schema.name] = schema.id;
            }

            // Build label options
            this.state.labelOptions = {};

            for(let key in this.model.config.struct || {}) {
                let label = this.model.config.struct[key] ? this.model.config.struct[key].label || key : key;

                this.state.labelOptions[label] = key;
            }
        }
        
        this.state.fields = [];

        if(!this.state.value || typeof this.state.value !== 'object' || Array.isArray(this.state.value)) {
            this.state.value = {};
        }

        if(!this.model.config) { this.model.config = {}; }
        if(!this.model.config.struct) { this.model.config.struct = {}; }

        for(let key in this.model.config.struct) {
            let definition = this.model.config.struct[key];

            if(this.state.name === 'config') {
                let view = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
                    definition,
                    null,
                    {
                        name: 'config'
                    }
                );

                view.on('change', (newValue) => {
                    this.onChangeConfigStructValue(key, 'config', newValue);
                });

                this.state.fields.push({
                    label: definition.label,
                    key: key,
                    definition: definition,
                    config: view.configTemplate(view.scope(), view.model, view.state)
                });
            
            } else {
                let view = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
                    definition,
                    this.state.value ? this.state.value[key] : null
                );
                
                view.on('change', (newValue) => {
                    this.state.value[key] = newValue;

                    this.trigger('change', this.state.value);
                });
            
                this.state.fields.push(view);
            }
        }
    }
    
    /**
     * Gets the value label
     *
     * @return {String} Value label
     */
    getValueLabel() {
        if(!this.model.config || !this.state.value || !this.state.value[this.model.config.label]) { return super.getValueLabel(); }
    
        return this.state.value[this.model.config.label];
    }

    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        if(this.state.name === 'config') {
            if(!this.state.isEditing) {
                return [
                    {
                        icon: 'pencil',
                        tooltip: 'Edit fields',
                        handler: () => this.onClickEditFields()
                    }
                ];
            
            } else {
                return [
                    {
                        icon: 'check',
                        tooltip: 'Done editing fields',
                        handler: () => this.onClickDoneEditingFields()
                    }
                ];
            
            }
        }

        return [
            {
                icon: this.state.isCollapsed ? 'caret-right' : 'caret-down',
                tooltip: this.state.isCollapsed ? 'Expand this field' : 'Collapse this field',
                handler: () => this.onToggleCollapsed()
            }
        ];
    }
    
    /**
     * Event: Toggle collapsed/expanded
     */
    onToggleCollapsed() {
        this.state.isCollapsed = !this.state.isCollapsed;

        this.render();
    }

    /**
     * Event: Change config key
     */
    onChangeConfigStructKey(oldKey, newKey) {
        let keys = Object.keys(this.model.config.struct);

        let newFields = {};

        for(let key of keys) {
            let value = this.model.config.struct[key];

            if(key === oldKey) { key = newKey; }

            newFields[key] = value;
        }

        this.model.config.struct = newFields;

        this.onChange();
        this.update();
    }

    /**
     * Event: Change config value
     */
    onChangeConfigStructValue(key, subKey, newValue) {
        if(!this.model.config.struct) { this.model.config.struct = {}; }
        if(!this.model.config.struct[key]) { this.model.config.struct[key] = {}; }
       
        this.model.config.struct[key][subKey] = newValue;

        this.onChange();
        
        if(subKey === 'schemaId' || subKey === 'label') {
            this.update();
        }
    }

    /**
     * Event: Click sort fields
     */
    onClickDoneEditingFields() {
        this.state.isEditing = false;

        this.update();
    }
    
    /**
     * Event: Click edit fields
     */
    onClickEditFields() {
        this.state.isEditing = true;

        this.update();
    }

    /**
     * Event: Change field sorting
     */
    onChangeFieldSorting(fields) {
        let newFields = {};

        for(let field of fields) {
            let key = field.key;
            let value = this.model.config.struct[key];

            newFields[key] = value;
        }

        this.model.config.struct = newFields;

        this.onChange();
    }
}

module.exports = StructEditor;
