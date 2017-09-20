'use strict';

const FieldEditor = require('./FieldEditor');
const SchemaHelper = require('Client/Helpers/SchemaHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const ContentEditor = require('Client/Views/Editors/ContentEditor');

/**
 * A struct editor for editing any arbitrary object value
 *
 * @description Example:
 * <pre>
 * {
 *     "myStruct": {
 *         "label": "My struct",
 *         "tabId": "content",
 *         "schemaId": "struct",
 *         "config": {
 *             "struct": {
 *                 "myString": {
 *                     "label": "My string",
 *                     "schemaId": "string"
 *                 },
 *                 "myArray": {
 *                     "label": "My array",
 *                     "schemaId": "array",
 *                     "config": {
 *                         "allowedSchemas": [ "string", "mediaReference", "myCustomSchema" ]
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
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

    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        config.struct = config.struct || {};

        let $element = _.div();

        let fieldSchemas = HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field');
            
        let renderEditor = () => {
            _.append($element.empty(),
                _.each(config.struct, (key, value) => {
                    // Sanity check
                    value.config = value.config || {};

                    let $field = _.div({class: 'field-properties'});

                    let renderField = () => {
                        _.append($field.empty(),
                            _.button({class: 'btn btn-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                delete config.struct[key];

                                renderEditor();
                            }),
                            _.div({class: 'field-container'},
                                _.div({class: 'field-key'}, 'Variable name'),
                                _.div({class: 'field-value'},
                                    _.input({class: 'form-control', type: 'text', value: key, placeholder: 'A variable name, like "newField"', title: 'This is the variable name for the field'})
                                        .change((e) => {
                                            delete config.struct[key];

                                            key = e.currentTarget.value;

                                            config.struct[key] = value;
                                        })
                                )
                            ),
                            _.div({class: 'field-container'},
                                _.div({class: 'field-key'}, 'Label'),
                                _.div({class: 'field-value'},
                                    _.input({class: 'form-control', type: 'text', value: value.label, placeholder: 'A label, like "New field"',  title: 'This is the label that will be visible in the Content editor'})
                                        .change((e) => {
                                            value.label = e.currentTarget.value;  
                                        })
                                )
                            ),
                            _.div({class: 'field-container'},
                                _.div({class: 'field-key'}, 'Schema'),
                                _.div({class: 'field-value'},
                                    UI.inputDropdown(value.schemaId, fieldSchemas, (newSchemaId) => {
                                        value.schemaId = newSchemaId;

                                        renderField();
                                    })
                                )
                            ),
                            _.do(() => {
                                let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(value.schemaId);

                                if(!schema) { return; }

                                let editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

                                if(!editor) { return; }

                                return editor.renderConfigEditor(value.config);
                            })
                        )
                    };

                    renderField();

                    return $field;
                }),
                _.button({class: 'btn btn-primary btn-raised btn-add-item btn-round'},
                    _.span({class: 'fa fa-plus'})
                ).click(() => {
                    config.struct.newField = {
                        label: 'New field',
                        schemaId: 'string'
                    };

                    renderEditor();
                })
            );
        };

        renderEditor();

        return $element;
    }

    /**
     * Renders this editor
     */
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

                let fieldEditor = ContentEditor.getFieldEditor(fieldSchema.editorId);

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
                        keySchema.label,
                        fieldEditorInstance.$keyContent
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
