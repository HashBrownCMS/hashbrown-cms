'use strict';

const SchemaEditor = require('Client/Views/Editors/SchemaEditor');

/**
 * The editor for Content Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ContentSchemaEditor extends SchemaEditor {
    /**
     * Renders the Content field properties editor
     *
     * @returns {HTMLElement} Editor element
     */
    renderContentFieldPropertiesEditor() {
        let $editor = _.div({class: 'field-properties-editor'});
        let fieldSchemas = HashBrown.Helpers.SchemaHelper.getAllSchemasSync('field');

        if(!this.model.fields) {
            this.model.fields = {};
        }
        
        if(!this.model.fields.properties) {
            this.model.fields.properties = {};
        }

        // Render editor
        let renderEditor = () => {
            _.append($editor.empty(),
                _.each(this.model.fields.properties, (key, value) => {
                    // Sanity check
                    value.config = value.config || {};

                    let $field = _.div({class: 'field-properties'});

                    let renderField = () => {
                        let tabOptions = [];

                        for(let tabId in this.compiledSchema.tabs) {
                            tabOptions.push({
                                label: this.compiledSchema.tabs[tabId],
                                value: tabId
                            });
                        }

                        _.append($field.empty(), 
                            _.button({class: 'btn btn-remove'},
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                delete this.model.fields.properties[key];

                                renderEditor();
                            }),
                            _.div({class: 'field-container'},
                                _.div({class: 'field-key'}, 'Variable name'),
                                _.div({class: 'field-value'},
                                    _.input({class: 'form-control', type: 'text', value: key, placeholder: 'A variable name, like "newField"', title: 'This is the variable name for the field'})
                                        .change((e) => {
                                            delete this.model.fields.properties[key];

                                            key = e.currentTarget.value;

                                            this.model.fields.properties[key] = value;
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
                                _.div({class: 'field-key'}, 'Tab'),
                                _.div({class: 'field-value'},
                                    UI.inputDropdown(value.tabId, tabOptions, (newTabId) => {
                                        value.tabId = newTabId;
                                    }, true)
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
                    this.model.field.properties.newField = {
                        label: 'New field',
                        schemaId: 'string'
                    };

                    renderEditor();
                })
            );
        };

        renderEditor();

        return $editor;
    }

    /**
     * Event: Change a field key
     *
     * @param {String} oldKey
     * @param {String} newKey
     */
    onChangeFieldKey(oldKey, newKey) {
    }
    
    /**
     * Renders the editor fields
     */
    renderFields() {
        let $element = super.renderFields();

        $element.append(this.renderField('Default tab', this.renderDefaultTabEditor()));
        $element.append(this.renderField('Tabs', this.renderTabsEditor()));
        $element.append(this.renderField('Allowed child Schemas', this.renderAllowedChildSchemasEditor()));
        
        /*if(!this.model.isLocked) {
            $element.append(this.renderField('Fields', this.renderContentFieldPropertiesEditor(), true));
        }*/

        // Render tabs
        let compiledTabs = JSON.parse(JSON.stringify(this.compiledSchema.tabs));
        compiledTabs.meta = 'Meta';
       
        _.append($element,
            _.div({class: 'editor__tabs'},
                _.ul({class: 'editor__tabs__buttons nav nav-tabs'},
                    _.each(compiledTabs, (tabId, tabLabel) => {
                        return _.li({class: (this.compiledSchema.isDefaultTab(tabId) ? 'active': '')},
                            _.a({class: 'editor__tabs__button', 'data-toggle': 'tab', href: '#editor__tabs__' + tabId}, tabLabel)
                        );
                    })
                ),
                _.div({class: 'editor__tabs__panes tab-content'},
                    _.each(compiledTabs, (tabId, tabLabel) => {
                        return _.div({class: 'editor__tabs__pane' + (this.compiledSchema.isDefaultTab(tabId) ? ' active' : '') + ' tab-pane', id: 'editor__tabs__' + tabId},
                            _.each(this.model.fields.properties, (fieldKey, fieldValue) => {
                                if(!fieldValue || (fieldValue.tabId !== tabId && (!fieldValue.tabId && tabId !== 'meta'))) { return; }

                                return _.div({class: 'editor__field'},
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
                                                    }
                                                }).$element
                                            )
                                        ),
                                        _.div({class: 'editor__field'},
                                            _.div({class: 'editor__field__key'}, 'Config'),
                                            _.div({class: 'editor__field__value'},
                                                _.do(() => {
                                                    let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(fieldValue.schemaId);

                                                    if(!schema) { return; }

                                                    let editor = HashBrown.Views.Editors.FieldEditors[schema.editorId];

                                                    if(!editor) { return; }

                                                    fieldValue.config = fieldValue.config || {};

                                                    return editor.renderConfigEditor(fieldValue.config);
                                                })
                                            )
                                        )
                                    )
                                );
                            })
                        );
                    })
                )
            )
        );
    
        return $element;
    }
}

module.exports = ContentSchemaEditor;
