'use strict';

/**
 * The base class for field views
 *
 * @memberof HashBrown.Client.Entity.View.Field
 */
class FieldBase extends HashBrown.Entity.View.ViewBase {
    /**
     * Creates a field based on a field definition
     *
     * @param {Object} definition
     * @param {*} value
     * @param {Object} state
     * @param {Boolean} isDisabled
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static async createFromFieldDefinition(definition, value = null, state = {}, isDisabled = false) {
        checkParam(definition, 'definition', Object, true);
        checkParam(definition.schemaId, 'definition.schemaId', String, true);

        let schema = await HashBrown.Entity.Resource.FieldSchema.get(definition.schemaId, { withParentFields: true });

        if(!schema) {
            debug.error(new Error(`Schema "${definition.schemaId}" could not be found`), this);
            return null;
        }

        let config = definition.config || {};

        if(schema.parentId !== 'fieldBase') {
            for(let key in schema.config) {
                if(config[key] !== undefined) { continue; }
                
                config[key] = schema.config[key];
            }
        }

        let model = {
            config: config,
            description: definition.description,
            isDisabled: definition.disabled || state.isDisabled || isDisabled,
            isLocalized: definition.isLocalized || false,
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
     * @param {HashBrown.Entity.Resource.FieldSchema} schema
     * @param {*} value
     * @param {Boolean} isDisabled
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static createFromSchema(schema, value, isDisabled = false) {
        checkParam(schema, 'schema', HashBrown.Entity.Resource.SchemaBase, true);

        let model = {
            schema: schema,
            config: schema.config,
            value: value,
            isDisabled: isDisabled
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
     * @param {Boolean} isDisabled
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static async createFromSchemaId(schemaId, value, isDisabled = false) {
        checkParam(schemaId, 'schemaId', String, true);
        
        let schema = await HashBrown.Entity.Resource.FieldSchema.get(schemaId, { withParentFields: true });
    
        if(!schema) { return null; }
        
        return this.createFromSchema(schema, value, isDisabled);
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
        // Localised sanity check
        if(this.model.isLocalized) {
            if(!this.model.value || this.model.value.constructor !== Object) {
                let rawValue = this.model.value;

                this.model.value = {};
                this.model.value[HashBrown.Client.locale] = rawValue;
            }

            this.state.value = this.model.value[HashBrown.Client.locale];

        } else {
            this.state.value = this.model.value;

        }
        
        // Update tools
        this.state.tools = await this.getTools();

        // Update value label and icon
        this.state.label = await this.getValueLabel();
        this.state.icon = await this.getValueIcon();

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
     * @return {Object} Tools
     */
    async getTools() {
        if(this.model.tools) {
            return this.model.tools;
        }

        return {};
    }
     
    /**
     * Pre render
     */
    prerender() {
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
                _.div({class: 'field__key__label', localized: false}, model.label),
                _.div({class: 'field__key__description', localized: false}, model.description)
            )
        );
    }

    /**
     * Checks if this field is in the config state
     *
     * @return {Boolean} Is config
     */
    isConfig() {
        return this.state.name === 'config';
    }

    /**
     * Gets the value icon
     *
     * @return {String}
     */
    async getValueIcon() {
        if(!this.model || !this.model.schema) { return ''; }

        return this.model.schema.icon;
    }

    /**
     * Gets the value label
     *
     * @return {String}
     */
    async getValueLabel() {
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
     * Event: Click fullscreen
     */
    onClickFullscreen() {
        this.state.isFullscreen = !this.state.isFullscreen;
        
        this.update();
    }
    
    /**
     * Event: Change value
     */
    onChange(newValue) {
        if(this.isConfig()) {
            this.trigger('change', this.model.config);

        } else {
            if(this.model.isLocalized) {
                if(!this.model.value || this.model.value.constructor !== Object) {
                    this.model.value = {};
                }

                this.model.value[HashBrown.Client.locale] = newValue;

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
