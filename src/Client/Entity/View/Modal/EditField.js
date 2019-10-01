
'use strict';

/**
 * The modal for editing fields in content or struct schemas
 *
 * @memberof HashBrown.Client.Entity.View.Modal
 */
class EditField extends HashBrown.Entity.View.Modal.ModalBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/modal/editField');
    }
    
    /**
     * Fetches view data
     */
    async fetch() {
        // Build schema options
        this.state.schemaOptions = {};

        for(let schema of await HashBrown.Service.SchemaService.getAllSchemas('field') || []) {
            if(schema.id === 'fieldBase') { continue; }

            this.state.schemaOptions[schema.name] = schema.id;
        }
        
        if(!this.model.definition) { this.model.definition = {}; }
        if(!this.model.definition.schemaId) { this.model.definition.schemaId = 'string'; }

        let view = await HashBrown.Entity.View.Field.FieldBase.createFromFieldDefinition(
            this.model.definition,
            null,
            {
                name: 'config'
            }
        );

        if(view.configTemplate && view.model.schema && view.model.schema.parentSchemaId === 'fieldBase') {
            view.on('change', (newValue) => {
                this.onChangeConfig(newValue);
            });

            view.model.label = null;
            view.model.description = null;

            this.state.extraFields = view;

        } else {
            this.state.extraFields = null;

        }
    }

    /**
     * Event: Change key
     */
    onChangeKey(newValue) {
        this.model.key = newValue;

        this.trigger('changekey', this.model.key);
    }
    
    /**
     * Event: Change tab
     */
    onChangeTab(newValue) {
        this.model.definition.tabId = newValue;

        this.trigger('change', this.model.definition);
    }
    
    /**
     * Event: Change schema id
     */
    onChangeSchemaId(newValue) {
        this.model.definition.schemaId = newValue;

        this.trigger('change', this.model.definition);

        this.update();
    }

    /**
     * Event: Change label
     */
    onChangeLabel(newValue) {
        this.model.definition.label = newValue;

        this.trigger('change', this.model.definition);
    }
    
    /**
     * Event: Change description
     */
    onChangeDescription(newValue) {
        this.model.definition.description = newValue;

        this.trigger('change', this.model.definition);
    }
    
    /**
     * Event: Change is multilingual
     */
    onChangeIsMultilingual(newValue) {
        this.model.definition.multilingual = newValue;

        this.trigger('change', this.model.definition);
    }

    /**
     * Event: Change config
     */
    onChangeConfig(newValue) {
        this.model.definition.config = newValue;

        this.trigger('change', this.model.definition);
    }
}

module.exports = EditField;
