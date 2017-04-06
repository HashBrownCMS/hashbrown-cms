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
     * Renders a field preview template
     *
     * @returns {HTMLElement} Element
     */
    renderPreview() {
        if(!this.schema.previewTemplate) { return null; }

        let $element = _.div({class: 'field-preview'});
        let template = this.schema.previewTemplate;
        let regex = /\${([\s\S]+?)}/g;
        let field = this.value;

        let html = template.replace(regex, (key) => {
            // Remove braces first
            key = key.replace('${ ', '').replace('${', '');
            key = key.replace(' }', '').replace('}', '');

            // Find result
            let result = '';

            try {
                result = eval("'use strict'; " + key);
            } catch(e) {
                // Ignore failed eval, the values are just not set yet
                result = e.message;
            }

            if(result && result._multilingual) {
                result = result[window.language];
            }

            return result || '';
        });

        $element.append(
			_.div({class: 'field-preview-toolbar'},
				_.button({class: 'btn btn-default'}, 'Edit')
			),
			html
		);

        return $element;
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
