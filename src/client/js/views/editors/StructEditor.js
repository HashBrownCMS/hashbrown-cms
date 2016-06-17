'use strict';

/**
 * A struct editor for editing any arbitrary object value
 */
class StructEditor extends View {
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
    onChange(newValue, key, schemaValue) {
        if(schemaValue.multilingual) {
            // Sanity check to make sure multilingual fields are accomodated for
            if(!this.value[key] || typeof this.value[key] !== 'object') {
                this.value[key] = {};
            }
            
            this.value[key].multilingual = true;
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
            // Loop through each key in the struct
            _.each(this.schema.config.struct, (k, schemaValue) => {
                let value = this.value[k];
                let fieldSchema = resources.schemas[schemaValue.schemaId];
                let fieldEditor = resources.editors[fieldSchema.editorId];

                // Sanity check to make sure multilingual fields are accomodated for
                if(schemaValue.multilingual && (!value || typeof value !== 'object')) {
                    value = {};
                }

                // Init the field editor
                let fieldEditorInstance = new fieldEditor({
                    value: schemaValue.multilingual ? value[window.language] : value,
                    disabled: schemaValue.disabled || false,
                    config: schemaValue.config || {},
                    schema: schemaValue
                });

                // Hook up the change event
                fieldEditorInstance.on('change', (newValue) => {
                    this.onChange(newValue, k, schemaValue);
                });

                // Return the DOM element
                return _.div({class: 'kvp'},
                    _.div({class: 'key'},
                        schemaValue.label
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
