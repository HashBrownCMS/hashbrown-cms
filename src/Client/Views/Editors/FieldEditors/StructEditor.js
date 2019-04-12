'use strict';

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
 *             "label": "myString",
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
class StructEditor extends HashBrown.Views.Editors.FieldEditors.FieldEditor {
    constructor(params) {
        super(params);

        // A sanity check to make sure we're working with an object
        if(!this.value || typeof this.value !== 'object') {
            this.value = {};
        }
        
        this.fetch();
    }

    /**
     * Fetches the model
     */
    async fetch() {
        try {
            this.fieldSchemas = {};
            
            for(let key in this.getStruct()) {
                let fieldSchemaId = this.getStruct()[key].schemaId;

                if(!fieldSchemaId || this.fieldSchemas[fieldSchemaId]) { continue; }
                
                this.fieldSchemas[fieldSchemaId] = await HashBrown.Helpers.SchemaHelper.getSchemaById(fieldSchemaId, true);            
            }

            super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
    }
    
    /**
     * Gets the struct
     *
     * @return {Object} Struct
     */
    getStruct() {
        return this.config.struct || this.schema.config.struct || {};
    }

    /**
     * Event: Change value
     *
     * @param {Object} newValue
     * @param {String} key
     * @param {Object} fieldDefinition
     * @param {Boolean} isSilent
     */
    onChange(newValue, key, fieldDefinition, isSilent) {
        if(fieldDefinition.multilingual) {
            // Sanity check to make sure multilingual fields are accomodated for
            if(!this.value[key] || typeof this.value[key] !== 'object') {
                this.value[key] = {};
            }
            
            this.value[key]._multilingual = true;
            this.value[key][HashBrown.Context.language] = newValue;

        } else {
            this.value[key] = newValue;
        }

        this.trigger(isSilent ? 'silentchange' : 'change', this.value);
    }

    /**
     * Renders the config editor
     *
     * @param {Object} config
     * @param {String} fieldSchemaId
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config, fieldSchemaId) {
        config.struct = config.struct || {};

        let $element = _.div({class: 'editor--schema__struct'});

        let renderEditor = async () => {
            let compiledFieldSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(fieldSchemaId, true);
            let fieldSchemas = {};
        
            for(let key in config.struct) {
                let fieldSchemaId = config.struct[key].schemaId;

                if(fieldSchemas[fieldSchemaId]) { continue; }

                fieldSchemas[fieldSchemaId] = await HashBrown.Helpers.SchemaHelper.getSchemaById(fieldSchemaId);
            }

            // Get the parent struct fields
            let parentStruct = {};

            if(compiledFieldSchema && compiledFieldSchema.config && compiledFieldSchema.config.struct) {
                for(let key in compiledFieldSchema.config.struct) {
                    // We only want parent struct values
                    if(config.struct[key]) { continue; }

                    parentStruct[key]  = compiledFieldSchema.config.struct[key];
                }
            }
           
            // Compile the label options
            let labelOptions = {};
            
            for(let key in parentStruct) {
                if(!parentStruct[key]) { continue; }

                labelOptions[key] = parentStruct[key].label;
            }

            for(let key in config.struct) {
                if(!config.struct[key]) { continue; }

                labelOptions[key] = config.struct[key].label;
            }

            // Render everything
            _.append($element.empty(),
                // Render the label picker
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, 'Label'),
                        _.div({class: 'editor__field__key__description'}, 'The value of the field picked here will represent this struct when collapsed')
                    ),
                    _.div({class: 'editor__field__value'},
                        new HashBrown.Views.Widgets.Dropdown({
                            options: labelOptions,
                            value: config.label,
                            onChange: (newLabel) => {
                                config.label = newLabel;
                            }
                        })
                    )
                ),

                // Render the parent struct
                _.if(Object.keys(parentStruct).length > 0,
                    _.div({class: 'editor__field'},
                        _.div({class: 'editor__field__key'},
                            _.div({class: 'editor__field__key__label'}, 'Parent struct'),
                            _.div({class: 'editor__field__key__description'}, 'Properties that are inherited and can be changed if you add them to this struct')
                        ),
                        _.div({class: 'editor__field__value cluster'},
                            _.each(parentStruct, (fieldKey, fieldValue) => {
                                return _.button({class: 'widget widget--button condensed', title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'}, _.span({class: 'fa fa-plus'}), fieldValue.label || fieldKey)
                                    .click(() => {
                                        let newProperties = {};

                                        newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

                                        for(let key in config.struct) {
                                            newProperties[key] = config.struct[key];
                                        }

                                        config.struct = newProperties;

                                        renderEditor();
                                    });
                            })
                        )
                    )
                ),

                // Render this struct
                _.div({class: 'editor__field'},
                    _.div({class: 'editor__field__key'},
                        'Struct',
                        _.div({class: 'editor__field__key__actions'},
                            _.button({class: 'editor__field__key__action editor__field__key__action--sort'})
                                .click((e) => {
                                    HashBrown.Helpers.UIHelper.fieldSortableObject(
                                        config.struct,
                                        $(e.currentTarget).parents('.editor__field')[0],
                                        (newStruct) => {
                                            config.struct = newStruct;
                                        }
                                    );
                                })
                        )
                    ),
                    _.div({class: 'editor__field__value'},
                        _.each(config.struct, (fieldKey, fieldValue) => {
                            // Sanity check
                            fieldValue.config = fieldValue.config || {};
                            fieldValue.schemaId = fieldValue.schemaId || 'array';

                            let $field = _.div({class: 'editor__field collapsible collapsed'});

                            let renderField = () => {
                                _.append($field.empty(),
                                    _.div({class: 'editor__field__key'},
                                        _.div({class: 'editor__field__key__label'}, fieldKey)
                                            .click((e) => {
                                                e.currentTarget.parentElement.parentElement.classList.toggle('collapsed');  
                                            }),
                                        _.div({class: 'editor__field__key__actions'},
                                            _.button({class: 'widget widget--button small embedded fa fa-remove', title: 'Remove field'})
                                                .click(() => {
                                                    delete config.struct[fieldKey];

                                                    renderEditor();
                                                })
                                        )
                                    ),
                                    _.div({class: 'editor__field__value'},
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Key'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Input({
                                                    type: 'text',
                                                    placeholder: 'A variable name, e.g. "myField"',
                                                    tooltip: 'The field variable name',
                                                    value: fieldKey,
                                                    onChange: (newKey) => {
                                                        if(!newKey) { return; }

                                                        let newStruct = {};

                                                        // Insert the changed key into the correct place in the struct
                                                        for(let key in config.struct) {
                                                            if(key === fieldKey) {
                                                                newStruct[newKey] = config.struct[fieldKey];
                                                            
                                                            } else {
                                                                newStruct[key] = config.struct[key];

                                                            }
                                                        }

                                                        // Change internal reference to new key
                                                        fieldKey = newKey;

                                                        // Reassign the struct object
                                                        config.struct = newStruct;
                                                    
                                                        // Update the sort key
                                                        $field.find('.editor__field__key__label').html(fieldKey);
                                                    }
                                                })
                                            )
                                        ),
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Label'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Input({
                                                    type: 'text',
                                                    placeholder: 'A label, e.g. "My field"',
                                                    tooltip: 'The field label',
                                                    value: fieldValue.label,
                                                    onChange: (newValue) => { fieldValue.label = newValue; }
                                                }).$element
                                            )
                                        ),
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Description'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Input({
                                                    type: 'text',
                                                    placeholder: 'A description',
                                                    tooltip: 'The field description',
                                                    value: fieldValue.description,
                                                    onChange: (newValue) => { fieldValue.description = newValue; }
                                                }).$element
                                            )
                                        ),
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Multilingual'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Input({
                                                    type: 'checkbox',
                                                    tooltip: 'Whether or not this field should support multiple languages',
                                                    value: fieldValue.multilingual || false,
                                                    onChange: (newValue) => { fieldValue.multilingual = newValue; }
                                                }).$element
                                            )
                                        ),
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Schema'),
                                            _.div({class: 'editor__field__value'},
                                                new HashBrown.Views.Widgets.Dropdown({
                                                    useTypeAhead: true,
                                                    options: HashBrown.Helpers.SchemaHelper.getAllSchemas('field'),
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
                                            let schema = fieldSchemas[fieldValue.schemaId];

                                            if(!schema || schema.parentSchemaId !== 'fieldBase') { return; }

                                            let editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

                                            if(!editor) { return; }
                                        
                                            fieldValue.config = fieldValue.config || {};

                                            return editor.renderConfigEditor(fieldValue.config, schema.id);
                                        })
                                    )
                                )
                            };

                            renderField();

                            return $field;
                        }),
                        _.button({class: 'editor__field__add widget widget--button round right fa fa-plus', title: 'Add a struct property'},
                            ).click(() => {
                                if(config.struct.newField) { return; }
                            
                                config.struct.newField = {
                                    label: 'New field',
                                    schemaId: 'string'
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
    template() {
        return _.div({class: 'field-editor field-editor--struct'},
            // Loop through each key in the struct
            _.each(this.getStruct(), (fieldName, fieldDefinition) => {
                let value = this.value[fieldName];

                if(!fieldDefinition || !fieldDefinition.schemaId) { throw new Error('Schema id not set for key "' + fieldName + '"'); }

                let fieldSchema = this.fieldSchemas[fieldDefinition.schemaId];

                if(!fieldSchema) { throw new Error('FieldSchema "' + fieldDefinition.schemaId + '" could not be found for key "' + fieldName + '"'); }

                let fieldEditor = HashBrown.Views.Editors.ContentEditor.getFieldEditor(fieldSchema.editorId);
                
                if(!fieldEditor) { throw new Error('FieldEditor ' + fieldSchema.editorId + ' could not be found for FieldSchema ' + fieldSchema.id); }

                // Sanity check
                value = HashBrown.Helpers.ContentHelper.fieldSanityCheck(value, fieldDefinition);
                this.value[fieldName] = value;

                // Get the config
                let config;

                if(!HashBrown.Helpers.ContentHelper.isFieldDefinitionEmpty(fieldDefinition.config)) {
                    config = fieldDefinition.config;
                } else if(!HashBrown.Helpers.ContentHelper.isFieldDefinitionEmpty(fieldSchema.config)) {
                    config = fieldSchema.config;
                } else {
                    config = {};
                }
                
                // Init the field editor
                let fieldEditorInstance = new fieldEditor({
                    value: fieldDefinition.multilingual ? value[HashBrown.Context.language] : value,
                    disabled: fieldDefinition.disabled || false,
                    config: config,
                    schema: fieldSchema,
                    className: 'editor__field__value'
                });

                // Hook up the change event
                fieldEditorInstance.on('change', (newValue) => {
                    this.onChange(newValue, fieldName, fieldDefinition);
                });
                
                fieldEditorInstance.on('silentchange', (newValue) => {
                    this.onChange(newValue, fieldName, fieldDefinition, true);
                });

                // Return the DOM element
                return _.div({class: 'editor__field' + (config.struct ? ' collapsible collapsed' : '')},
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, fieldDefinition.label)
                            .click((e) => {
                                if(!config.struct) { return; }

                                e.currentTarget.parentElement.parentElement.classList.toggle('collapsed');
                            }),
                        _.if(fieldDefinition.description,
                            _.div({class: 'editor__field__key__description'}, fieldDefinition.description)
                        ),
                        fieldEditorInstance.renderKeyActions()
                    ),
                    fieldEditorInstance.$element
                );
            })    
        );
    }    
}

module.exports = StructEditor;
