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

        let $element = _.div({class: 'editor--schema__struct'});

        let fieldSchemas = HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field');
            
        let renderEditor = () => {
            _.append($element.empty(),
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'}, 'Struct fields'),
                    _.div({class: 'editor__field__value'},
                        _.each(config.struct, (fieldKey, fieldValue) => {
                            // Sanity check
                            fieldValue.config = fieldValue.config || {};

                            let $field = _.div({class: 'editor__field'});

                            let renderField = () => {
                                _.append($field.empty(),
                                    _.div({class: 'editor__field__key'},
                                        new HashBrown.Views.Widgets.Input({
                                            type: 'text',
                                            placeholder: 'A variable name, e.g. "myField"',
                                            tooltip: 'The field variable name',
                                            value: fieldKey,
                                            onChange: (newKey) => {
                                                delete config.struct[fieldKey];

                                                fieldKey = newKey;

                                                config.struct[fieldKey] = fieldValue;
                                            }
                                        }).$element,
                                        new HashBrown.Views.Widgets.Input({
                                            type: 'text',
                                            placeholder: 'A label, e.g. "My field"',
                                            tooltip: 'The field label',
                                            value: fieldValue.label,
                                            onChange: (newValue) => { fieldValue.label = newValue; }
                                        }).$element
                                    ),
                                    _.div({class: 'editor__field__value'},
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Schema'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Dropdown({
                                                    useTypeAhead: true,
                                                    options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field'),
                                                    value: fieldValue.schemaId,
                                                    labelKey: 'name',
                                                    valueKey: 'id',
                                                    onChange: (newValue) => {
                                                        fieldValue.schemaId = newValue;

                                                        renderField();
                                                    }
                                                }).$element
                                            )
                                        ),
                                        _.do(() => {
                                            let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(fieldValue.schemaId);

                                            if(!schema) { return; }

                                            let editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

                                            if(!editor) { return; }

                                            return editor.renderConfigEditor(fieldValue.config);
                                        })
                                    ),
                                    _.button({class: 'editor__field__remove fa fa-remove', title: 'Remove field'})
                                        .click(() => {
                                            delete config.struct[fieldKey];

                                            renderEditor();
                                        })
                                )
                            };

                            renderField();

                            return $field;
                        }),
                        _.button({class: 'widget widget--button round right fa fa-plus'},
                            ).click(() => {
                                if(config.struct.newField) { return; }
                            
                                config.struct.newField = {
                                    label: 'New field',
                                    schemaId: 'array'
                                };

                                renderEditor();
                            })
                    )
                )
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
