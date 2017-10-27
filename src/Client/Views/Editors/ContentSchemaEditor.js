'use strict';

const SchemaEditor = require('Client/Views/Editors/SchemaEditor');

/**
 * The editor for Content Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ContentSchemaEditor extends SchemaEditor {
    /**
     * Renders the editor fields
     */
    renderFields() {
        let $element = super.renderFields();

        // Default tab
        $element.append(this.renderField('Default tab', new HashBrown.Views.Widgets.Dropdown({
            options: this.compiledSchema.tabs,
            value: this.model.defaultTabId,
            useClearButton: true,
            onChange: (newValue) => {
                this.model.defaultTabId = newValue;
            }
        }).$element));
        
        // Tabs
        $element.append(this.renderField('Tabs', new HashBrown.Views.Widgets.Chips({
            disabledValue: Object.values(this.compiledSchema.tabs),
            value: Object.values(this.model.tabs),
            placeholder: 'New tab',
            onChange: (newValue) => {
                this.model.tabs = {};

                for(let tab of newValue) {
                    this.model.tabs[tab.toLowerCase().replace(/[^a-zA-Z]/g, '')] = tab;
                }
            }
        }).$element));
        
        // Allowed child Schemas
        $element.append(this.renderField('Allowed child Schemas', new HashBrown.Views.Widgets.Dropdown({
            options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('content'),
            value: this.model.allowedChildSchemas,
            labelKey: 'name',
            valueKey: 'id',
            useMultiple: true,
            useClearButton: true,
            useTypeAhead: true,
            onChange: (newValue) => {
                this.model.allowedChildSchemas = newValue;
            }
        }).$element));
        
        // Field properties
        let $fieldProperties = _.div({class: 'editor__field'});
        
        $element.append($fieldProperties);

        let renderFieldProperties = () => {
            _.append($fieldProperties.empty(),
                _.div({class: 'editor__field__key'},
                    'Properties',
                    _.div({class: 'editor__field__key__actions'},
                        _.button({class: 'editor__field__key__action editor__field__key__action--sort'})
                            .click((e) => {
                                HashBrown.Helpers.UIHelper.fieldSortableObject(
                                    this.model.fields.properties,
                                    $(e.currentTarget).parents('.editor__field')[0],
                                    (newProperties) => {
                                        this.model.fields.properties = newProperties;
                                    }
                                );
                            })
                    )
                ),
                _.div({class: 'editor__field__value segmented'},
                    _.each(this.model.fields.properties, (fieldKey, fieldValue) => {
                        if(!fieldValue) { return; }

                        let $field = _.div({class: 'editor__field'});

                        // Sanity check
                        fieldValue.config = fieldValue.config || {};
                        fieldValue.schemaId = fieldValue.schemaId || 'array';

                        let renderField = () => {
                            _.append($field.empty(),
                                _.div({class: 'editor__field__sort-key'},
                                    fieldKey
                                ),
                                _.div({class: 'editor__field__key'},
                                    new HashBrown.Views.Widgets.Input({
                                        type: 'text',
                                        placeholder: 'A variable name, e.g. "myField"',
                                        tooltip: 'The field variable name',
                                        value: fieldKey,
                                        onChange: (newKey) => {
                                            delete this.model.fields.properties[fieldKey];

                                            fieldKey = newKey;

                                            this.model.fields.properties[fieldKey] = fieldValue;

                                            $field.find('.editor__field__sort-key').html(fieldKey);
                                        }
                                    }).$element,
                                    new HashBrown.Views.Widgets.Input({
                                        type: 'text',
                                        placeholder: 'A label, e.g. "My field"',
                                        tooltip: 'The field label',
                                        value: fieldValue.label,
                                        onChange: (newValue) => { fieldValue.label = newValue; }
                                    }).$element,
                                    new HashBrown.Views.Widgets.Input({
                                        type: 'checkbox',
                                        placeholder: 'Multilingual',
                                        tooltip: 'Whether or not this field should support multiple languages',
                                        value: fieldValue.multilingual || false,
                                        onChange: (newValue) => { fieldValue.multilingual = newValue; }
                                    }).$element
                                ),
                                _.div({class: 'editor__field__value'},
                                    _.div({class: 'editor__field'},
                                        _.div({class: 'editor__field__key'}, 'Tab'),
                                        _.div({class: 'editor__field__value'},
                                            new HashBrown.Views.Widgets.Dropdown({
                                                useClearButton: true,
                                                options: this.compiledSchema.tabs,
                                                value: fieldValue.tabId,
                                                onChange: (newValue) => {
                                                    fieldValue.tabId = newValue;
                                                }
                                            }).$element
                                        )
                                    ),
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

                                        fieldValue.config = fieldValue.config || {};

                                        return editor.renderConfigEditor(fieldValue.config);
                                    })
                                ),
                                _.div({class: 'editor__field__actions'},
                                    _.button({class: 'editor__field__action editor__field__action--remove', title: 'Remove field'})
                                        .click(() => {
                                            delete this.model.fields.properties[fieldKey];

                                            renderFieldProperties();
                                        })
                                )
                            );
                        };

                        renderField();

                        return $field;
                    }),
                    _.button({title: 'Add a Content property', class: 'editor__field__add widget widget--button round fa fa-plus'})
                        .click(() => {
                            if(this.model.fields.properties.newField) { return; }

                            this.model.fields.properties.newField = {
                                label: 'New field',
                                schemaId: 'array'
                            };

                            renderFieldProperties();
                        })
                )
            );
        };

        renderFieldProperties();

        return $element;
    }
}

module.exports = ContentSchemaEditor;
