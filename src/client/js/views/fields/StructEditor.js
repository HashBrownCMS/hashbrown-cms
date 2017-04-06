'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A struct editor for editing any arbitrary object value
 */
class StructEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'struct-editor field-editor'});

        this.fetch();
    }

    /**
     * Event: Change value
     *
     * @param {Object} newValue
     * @param {String} key
     * @param {Object} keySchema
     */
    onChange(newValue, key, keySchema) {
        if(keySchema.multilingual) {
            // Sanity check to make sure multilingual fields are accomodated for
            if(!this.value[key] || typeof this.value[key] !== 'object') {
                this.value[key] = {};
            }
            
            this.value[key]._multilingual = true;
            this.value[key][window.language] = newValue;

        } else {
            this.value[key] = newValue;
        }

        this.trigger('change', this.value);
    }

    render() {
        // A sanity check to make sure we're working with an object
        if(!this.value || typeof this.value !== 'object') {
            this.value = {};
        }
    
        // Render editor
        _.append(this.$element.empty(),
            // Render preview
            this.renderPreview(),

            // Loop through each key in the struct
            _.each(this.config.struct, (k, keySchema) => {
                let value = this.value[k];

                if(!keySchema.schemaId) {
                    UI.errorModal(new Error('Schema id not set for key "' + k + '"'));
                }

                let fieldSchema = SchemaHelper.getFieldSchemaWithParentConfigs(keySchema.schemaId);

                if(!fieldSchema) {
                    UI.errorModal(new Error('Field schema "' + keySchema.schemaId + '" could not be found for key " + k + "'));
                }

                let fieldEditor = resources.editors[fieldSchema.editorId];

                // Sanity check
                value = ContentHelper.fieldSanityCheck(value, keySchema);
                this.value[k] = value;

                // Init the field editor
                let fieldEditorInstance = new fieldEditor({
                    value: keySchema.multilingual ? value[window.language] : value,
                    disabled: keySchema.disabled || false,
                    config: keySchema.config || fieldSchema.config || {},
                    schema: keySchema
                });

                // Hook up the change event
                fieldEditorInstance.on('change', (newValue) => {
                    this.onChange(newValue, k, keySchema);
                });

                // Return the DOM element
                return _.div({class: 'kvp'},
                    _.div({class: 'key'},
                        keySchema.label
                    ),
                    _.div({class: 'value'},
                        fieldEditorInstance.$element
                    )
                );
            })    
        )
    }    
}

module.exports = StructEditor;
