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
     *
     * @return {HashBrown.Entity.View.Field.FieldBase} Field
     */
    static async createFromFieldDefinition(definition, value) {
        checkParam(definition, 'definition', Object, true);

        let model = definition;
        
        model.value = value;
        model.schema = await HashBrown.Service.SchemaService.getSchemaById(model.schemaId, true);
        
        let type = HashBrown.Entity.View.Field[model.schema.editorId] || HashBrown.Entity.View.Field.FieldBase;

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

        let model = {
            schema: await HashBrown.Service.SchemaService.getSchemaById(schemaId, true),
            value: value
        };
        
        let type = HashBrown.Entity.View.Field[model.schema.editorId] || HashBrown.Entity.View.Field.FieldBase;

        return new type({
            model: model
        });
    }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        // Templates
        this.template = require('template/field/fieldBase');   
        this.model.innerTemplate = require('template/field/inc/fieldBase');

        // Custom class name
        let className = this.constructor.name;
        className = className[0].toLowerCase() + className.substring(1);
        className = className.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
        className = 'field--' + className;

        this.model.class = (this.model.class ? this.model.class + ' ' : '') + className;
        
        // Multilingual sanity check
        if(this.model.isMultilingual) {
            if(!this.model.value || this.model.value.constructor !== Object) {
                this.model.value = {};
            }

            this.state.value = this.model.value[HashBrown.Context.language];

        } else {
            this.state.value = this.model.value;

        }

        // Update the value label
        this.state.label = this.getValueLabel();
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
        this.state.tools = this.getTools();
    }

    /**
     * Event: Change value
     */
    onChange(newValue) {
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

    /**
     * Gets the placeholder
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'field loading';

        return element;
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
}

module.exports = FieldBase;
