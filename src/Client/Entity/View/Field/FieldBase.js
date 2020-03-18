'use strict';

/**
 * The base class for field views
 *
 * @memberof HashBrown.Entity.View.Field
 */
class FieldBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Creates a field based on a field definition
     *
     * @param {Object} definition
     * @param {*} value
     * @param {Object} state
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static async createFromFieldDefinition(definition, value = null, state = {}) {
        checkParam(definition, 'definition', Object, true);

        let schema = await HashBrown.Service.SchemaService.getSchemaById(definition.schemaId, true);
        let config = definition.config || {};

        if(schema.parentSchemaId !== 'fieldBase') {
            config = schema.config;
        }

        let model = {
            config: config,
            description: definition.description,
            isDisabled: definition.disabled,
            isMultilingual: definition.multilingual,
            label: definition.label,
            schema: schema,
            value: value
        };
        
        let type = HashBrown.Entity.View.Field[schema.editorId] || HashBrown.Entity.View.Field.FieldBase;

        return new type({
            model: model,
            state: state
        });
    }
    
    /**
     * Creates a field based on a schema
     *
     * @param {HashBrown.Entity.Resource.Schema.FieldSchema} schema
     * @param {*} value
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static createFromSchema(schema, value) {
        let model = {
            schema: schema,
            config: schema.config,
            value: value
        };
        
        let type = HashBrown.Entity.View.Field[schema.editorId] || HashBrown.Entity.View.Field.FieldBase;

        return new type({
            model: model
        });
    }

    /**
     * Creates a field based on schema id
     *
     * @param {String} schemaId
     * @param {*} value
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static async createFromSchemaId(schemaId, value) {
        checkParam(schemaId, 'schemaId', String, true);
        
        let schema = await HashBrown.Service.SchemaService.getSchemaById(schemaId, true);
    
        return this.createFromSchema(schema, value);
    }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        // Template
        this.template = require('template/field/fieldBase');   

        // Custom class name
        let className = this.constructor.name;
        className = className[0].toLowerCase() + className.substring(1);
        className = className.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
        className = 'field--' + className;

        this.state.className = className; 
    }

    /**
     * Update
     */
    async update() {
        // Multilingual sanity check
        if(this.model.isMultilingual) {
            if(!this.model.value || this.model.value.constructor !== Object) {
                let rawValue = this.model.value;

                this.model.value = {};
                this.model.value[HashBrown.Context.language] = rawValue;
                this.model.value['_multilingual'] = true;
            }

            this.state.value = this.model.value[HashBrown.Context.language];

        } else {
            this.state.value = this.model.value;

        }

        await super.update();
    }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Function, 'editorTemplate', require('template/field/editor/fieldBase'));
        this.def(Function, 'configTemplate', null);
    }

    /**
     * Gets tools for this field
     *
     * @return {Array} Tools
     */
    getTools() {
        return [];
    }
   
    /**
     * Pre render
     */
    prerender() {
        // Update tools
        this.state.tools = this.getTools();

        // Update value label
        this.state.label = this.getValueLabel();

        // Expose include templates
        this.state.editorTemplate = this.editorTemplate;
        this.state.configTemplate = this.configTemplate;
    }

    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder(_, model, state) {
        return _.div({class: 'field field--resource-reference-editor loading'},
            _.div({class: 'field__key'},
                _.div({class: 'field__key__label'}, model.label),
                _.div({class: 'field__key__description'}, model.description)
            )
        );
    }

    /**
     * Gets the value label
     *
     * @return {String}
     */
    getValueLabel() {
        if(!this.model || !this.model.schema) { return '...'; }

        return this.model.schema.name;
    }
    
    /**
     * Event: Toggle collapsed/expanded
     */
    onToggleCollapsed() {
        this.state.isCollapsed = !this.state.isCollapsed;

        this.render();
    }
    
    /**
     * Event: Change value
     */
    onChange(newValue) {
        if(this.state.name === 'config') {
            this.trigger('change', this.model.config);

        } else {
            if(this.model.isMultilingual) {
                if(!this.model.value || this.model.value.constructor !== Object) {
                    this.model.value = {};
                }

                this.model.value[HashBrown.Context.language] = newValue;
                this.model.value['_multilingual'] = true;

            } else {
                this.model.value = newValue;

            }

            this.state.value = newValue;

            this.trigger('change', this.model.value);
        }
    }

    /**
     * Event: Change config value
     */
    onChangeConfig(newValue, key) {
        if(!key) { return; }

        this.model.config[key] = newValue;

        this.onChange();
    }
}

module.exports = FieldBase;
