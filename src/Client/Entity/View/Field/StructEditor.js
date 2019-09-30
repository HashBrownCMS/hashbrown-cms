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
            this.state.fields = {};
            
            // Build label options
            this.state.labelOptions = {};

            for(let key in this.model.config.struct || {}) {
                let label = this.model.config.struct[key] ? this.model.config.struct[key].label || key : key;

                this.state.labelOptions[label] = key;
            }
        } else {
            this.state.fields = [];

        }

        if(!this.state.value || typeof this.state.value !== 'object' || Array.isArray(this.state.value)) {
            this.state.value = {};
        }

        if(!this.model.config) { this.model.config = {}; }
        if(!this.model.config.struct) { this.model.config.struct = {}; }

        for(let key in this.model.config.struct) {
            let definition = this.model.config.struct[key];

            // When in the config state, only the label and key is needed
            if(this.state.name === 'config') {
                this.state.fields[key] = definition.label;
            
            // When in the editor state, show all fields as normal
            } else {
                let view = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
                    definition,
                    this.state.value ? this.state.value[key] : null
                );
                
                view.on('change', (newValue) => {
                    if(!this.state.value) { this.state.value = {}; }
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
        if(this.state.name === 'config') { return []; }
        
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
     * Event: Click edit field
     *
     * @param {String} key
     */
    onClickEditField(key) {
        if(!this.model.config.struct) { this.model.config.struct = {}; }
        if(!this.model.config.struct[key]) { this.model.config.struct[key] = { schemaId: 'string' }; }

        let modal = new HashBrown.Entity.View.Modal.EditField({
            model: {
                key: key,
                definition: this.model.config.struct[key]
            }
        });
        
        modal.on('changekey', (newKey) => {
            this.onChangeConfigStructKey(key, newKey);

            key = newKey;
        });

        modal.on('change', (newValue) => {
            this.onChangeConfigStructValue(key, newValue);
        });
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
     * Event: Change config struct
     */
    onChangeConfigStructValue(key, newValue) {
        if(!this.model.config.struct) { this.model.config.struct = {}; }
        if(!this.model.config.struct[key]) { this.model.config.struct[key] = {}; }
        
        this.model.config.struct[key] = newValue;

        this.onChange();
        this.update();
    }

    /**
     * Event: Change field sorting
     */
    onChangeFieldSorting(fields) {
        let newFields = {};

        for(let key in fields) {
            let value = this.model.config.struct[key];

            newFields[key] = value || { label: fields[key] };
        }

        let isNewField = Object.keys(fields).length > Object.keys(this.model.config.struct).length;

        this.model.config.struct = newFields;
        this.onChange();
        
        if(isNewField) {
            this.onClickEditField(Object.keys(fields).pop());
        }
    }
}

module.exports = StructEditor;
