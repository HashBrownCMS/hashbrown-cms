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
 * @memberof HashBrown.Client.View.Editor.FieldEditor
 */
class StructEditor extends HashBrown.View.Editor.FieldEditor.FieldEditor {
    constructor(params) {
        super(params);

        // A sanity check to make sure we're working with an object
        if(!this.value || typeof this.value !== 'object') {
            this.value = {};
        }
        
        this.fetch();
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
     * Gets the field label
     *
     * @return {String} Label
     */
    getFieldLabel() {
        if(this.config && this.config.label && this.value && this.value[this.config.label]) {
            if(this.value[this.config.label]._multilingual) {
                return this.value[this.config.label][HashBrown.Context.language];
            }

            return this.value[this.config.label];
        }

        return super.getFieldLabel();
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

        // Cache the struct state before editing
        let originalStruct = JSON.parse(JSON.stringify(config.struct));

        let compiledFieldSchema = this.getSchema(fieldSchemaId);
        
        // Get the parent struct fields
        let parentStruct = {};

        if(compiledFieldSchema && compiledFieldSchema.config && compiledFieldSchema.config.struct) {
            for(let key in compiledFieldSchema.config.struct) {
                // We only want parent struct values
                if(originalStruct[key]) { continue; }

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
        return [    
            // Render the label picker
            this.field(
                { label: 'Label', description: 'The value of the field picked here will represent this struct when collapsed' },
                new HashBrown.View.Widget.Dropdown({
                    options: labelOptions,
                    value: config.label,
                    onChange: (newLabel) => {
                        config.label = newLabel;
                    }
                })
            ),

            // Render the parent struct
            _.if(Object.keys(parentStruct).length > 0,
                this.field(
                    { label: 'Parent struct', description: 'Properties that are inherited and can be changed if you add them to this struct', isCluster: true },
                    _.each(parentStruct, (fieldKey, fieldValue) => {
                        return _.button({class: 'widget widget--button condensed', title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'}, _.span({class: 'fa fa-plus'}), fieldValue.label || fieldKey)
                            .click(() => {
                                let newProperties = {};

                                newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

                                for(let key in config.struct) {
                                    newProperties[key] = config.struct[key];
                                }

                                config.struct = newProperties;

                                this.update();
                            });
                    })
                )
            ),

            // Render this struct
            this.field(
                {
                    label: 'Fields',
                    actions: {
                        sort: () => { 
                            HashBrown.Service.UIService.fieldSortableObject(
                                config.struct,
                                this.getField('Fields'),
                                (newStruct) => {
                                    config.struct = newStruct;
                                }
                            );
                        }
                    }
                },
                _.each(config.struct, (fieldKey, fieldValue) => {
                    // Sanity check
                    fieldValue.config = fieldValue.config || {};
                    fieldValue.schemaId = fieldValue.schemaId || 'array';
                    
                    return this.field(
                        {
                            label: fieldValue.label,
                            sortKey: fieldKey,
                            isCollapsible: true,
                            isCollapsed: true,
                            actions: {
                                remove: () => {
                                    delete config.struct[fieldKey];

                                    this.update();
                                }
                            }
                        },
                        this.field(
                            'Key',
                            new HashBrown.View.Widget.Input({
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
                                }
                            })
                        ),
                        this.field(
                            'Label',
                            new HashBrown.View.Widget.Input({
                                type: 'text',
                                placeholder: 'A label, e.g. "My field"',
                                tooltip: 'The field label',
                                value: fieldValue.label,
                                onChange: (newValue) => {
                                    this.changeFieldLabel(fieldValue.label, newValue);

                                    fieldValue.label = newValue;
                                }
                            })
                        ),
                        this.field(
                            'Description',
                            new HashBrown.View.Widget.Input({
                                type: 'text',
                                placeholder: 'A description',
                                tooltip: 'The field description',
                                value: fieldValue.description,
                                onChange: (newValue) => { fieldValue.description = newValue; }
                            })
                        ),
                        this.field(
                            'Multilingual',
                            new HashBrown.View.Widget.Input({
                                type: 'checkbox',
                                tooltip: 'Whether or not this field should support multiple languages',
                                value: fieldValue.multilingual || false,
                                onChange: (newValue) => { fieldValue.multilingual = newValue; }
                            })
                        ),
                        this.field(
                            'Schema',
                            new HashBrown.View.Widget.Dropdown({
                                useTypeAhead: true,
                                options: HashBrown.Service.SchemaService.getAllSchemas('field'),
                                value: fieldValue.schemaId,
                                labelKey: 'name',
                                valueKey: 'id',
                                onChange: (newValue) => {
                                    fieldValue.schemaId = newValue;

                                    this.update();
                                }
                            })
                        ),
                        this.renderConfigEditor(fieldValue.schemaId, fieldValue.config, true)
                    );
                }),
                _.button({class: 'editor__field__add widget widget--button round fa fa-plus', title: 'Add a struct property'})
                    .click(() => {
                        if(config.struct.newField) { return; }
                    
                        config.struct.newField = {
                            label: 'New field',
                            schemaId: 'string'
                        };

                        this.update();
                    })
            )
        ];
    }

    /**
     * Renders a field editor
     *
     * @param {HTMLElement} placeholder
     * @param {String} fieldName
     * @param {Object} fieldDefinition
     */
    async renderField($placeholder, fieldName, fieldDefinition) {
        this.value = this.value || {};

        let value = this.value[fieldName];

        if(!fieldDefinition || !fieldDefinition.schemaId) { throw new Error('Schema id not set for key "' + fieldName + '"'); }

        let fieldSchema = await HashBrown.Service.SchemaService.getSchemaById(fieldDefinition.schemaId);

        if(!fieldSchema) { throw new Error('FieldSchema "' + fieldDefinition.schemaId + '" could not be found for key "' + fieldName + '"'); }

        let fieldEditor = HashBrown.View.Editor.ContentEditor.getFieldEditor(fieldSchema.editorId);
        
        if(!fieldEditor) { throw new Error('FieldEditor ' + fieldSchema.editorId + ' could not be found for FieldSchema ' + fieldSchema.id); }

        // Sanity check
        value = HashBrown.Service.ContentService.fieldSanityCheck(value, fieldDefinition);
        this.value[fieldName] = value;

        // Get the config
        let config;

        if(!HashBrown.Service.ContentService.isFieldDefinitionEmpty(fieldDefinition.config)) {
            config = fieldDefinition.config;
        } else if(!HashBrown.Service.ContentService.isFieldDefinitionEmpty(fieldSchema.config)) {
            config = fieldSchema.config;
        } else {
            config = {};
        }
        
        // Structs are always collapsed by default
        if(config.isCollapsed === undefined) {
            config.isCollapsed = !!config.struct;
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
        let $field = this.field(
            {
                label: fieldDefinition.label,
                description: fieldDefinition.description,
                isCollapsible: config.isCollapsed,
                isCollapsed: config.isCollapsed,
                actions: fieldEditorInstance.getKeyActions()
            },
            fieldEditorInstance
        );

        $placeholder.replaceWith($field);
    }

    /**
     * Renders this editor
     */
    template() {
        return _.div({class: 'field-editor field-editor--struct'},
            _.each(this.getStruct(), (fieldName, fieldDefinition) => {
                let $placeholder = _.div({class: 'editor__field loading'});
                
                this.renderField($placeholder, fieldName, fieldDefinition);

                return $placeholder;
            })    
        );
    }    
}

module.exports = StructEditor;
