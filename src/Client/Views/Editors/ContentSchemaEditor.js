'use strict';

/**
 * The editor for Content Schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ContentSchemaEditor extends HashBrown.Views.Editors.SchemaEditor {
    /**
     * Gets parent tabs
     *
     * @returns {Object} Parent tabs
     */
    getParentTabs() {
        if(!this.parentSchema) {
            return {};
        }

        return this.parentSchema.tabs;
    }

    /**
     * Gets all tabs
     *
     * @returns {Object} All tabs
     */
    getAllTabs() {
        let allTabs = {};
        let parentTabs = this.getParentTabs();

        for(let tabId in parentTabs) {
            allTabs[tabId] = parentTabs[tabId];
        }
        
        for(let tabId in this.model.tabs) {
            allTabs[tabId] = this.model.tabs[tabId];
        }

        return allTabs;
    }
    
    /**
     * Gets parent properties
     *
     * @param {String} tabId
     *
     * @returns {Object} Parent properties
     */
    getParentProperties(tabId) {
        let parentProperties = {};
        
        if(!this.parentSchema) { return parentProperties; }

        for(let key in this.parentSchema.fields.properties) {
            // If a tab is specified, we only want properties in this tab
            if(tabId && this.parentSchema.fields.properties[key].tabId !== tabId) { continue; }

            parentProperties[key] = this.parentSchema.fields.properties[key];
        }

        return parentProperties;
    }

    /**
     * Renders the editor fields
     */
    renderFields() {
        let $element = super.renderFields();

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
        
        // Default tab
        let defaultTabEditor = new HashBrown.Views.Widgets.Dropdown({
            options: this.getAllTabs(),
            useClearButton: true,
            value: this.model.defaultTabId,
            onChange: (newValue) => {
                this.model.defaultTabId = newValue;
            }
        });

        if(!this.model.defaultTabId && this.parentSchema) {
            this.model.defaultTabId = this.parentSchema.defaultTabId;
        }
        
        $element.append(this.renderField('Default tab', defaultTabEditor.$element));
        
        // Tabs
        $element.append(this.renderField('Tabs', new HashBrown.Views.Widgets.Chips({
            disabledValue: Object.values(this.getParentTabs()),
            value: Object.values(this.model.tabs),
            placeholder: 'New tab',
            onChange: (newValue) => {
                let newTabs = {};

                for(let tab of newValue) {
                    newTabs[tab.toLowerCase().replace(/[^a-zA-Z]/g, '')] = tab;
                }
                
                this.model.tabs = newTabs;

                defaultTabEditor.options = this.getAllTabs();
                defaultTabEditor.fetch();

                renderFieldProperties();
            }
        }).$element));
       
        // Field properties
        let $tabs = _.div({class: 'editor--schema__tabs'});
        let $fieldProperties = _.div({class: 'editor__field'});
        let $parentFieldProperties = _.div({class: 'editor__field editor--schema__parent-field-properties'});
        
        $element.append($tabs);
        $element.append($parentFieldProperties);
        $element.append($fieldProperties);

        let renderFieldProperties = () => {
            // Render tabs
            if(!this.currentTab) {
                this.currentTab = Object.keys(this.getAllTabs())[0] || 'meta';
            }
       
            _.append($tabs.empty(),
                _.each(this.getAllTabs(), (id, name) => {
                    return _.button({class: 'editor--schema__tab' + (this.currentTab === id ? ' active' : '')}, name)
                        .click(() => {
                            this.currentTab = id;
                    
                            renderFieldProperties();
                        });
                }),
                _.button({class: 'editor--schema__tab' + (this.currentTab === 'meta' ? ' active' : '')}, 'meta')
                    .click(() => {
                        this.currentTab = 'meta';
                    
                        renderFieldProperties();
                    })
            );

            // Render parent Schema's field properties
            _.append($parentFieldProperties.empty(),
                _.if(Object.keys(this.getParentProperties(this.currentTab)).length > 0,
                    _.div({class: 'editor__field__key'},
                        _.div({class: 'editor__field__key__label'}, 'Parent properties'),
                        _.div({class: 'editor__field__key__description'}, 'Properties that are inherited and can be changed if you add them to this Schema')
                    ),
                    _.div({class: 'editor__field__value'},
                        _.each(this.getParentProperties(this.currentTab), (fieldKey, fieldValue) => {
                            if(this.model.fields.properties[fieldKey]) { return; }

                            return _.button({class: 'widget widget--button condensed', title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'}, _.span({class: 'fa fa-plus'}), fieldValue.label || fieldKey)
                                .click(() => {
                                    let newProperties = {};

                                    newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

                                    for(let key in this.model.fields.properties) {
                                        newProperties[key] = this.model.fields.properties[key];
                                    }

                                    this.model.fields.properties = newProperties;

                                    renderFieldProperties();
                                });
                        })
                    )
                )
            );

            // Render this Schema's fields
            _.append($fieldProperties.empty(),
                _.div({class: 'editor__field__key'},
                    _.div({class: 'editor__field__key__label'}, 'Properties'),
                    _.div({class: 'editor__field__key__description'}, 'This Schema\'s own properties'),
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
                _.div({class: 'editor__field__value'},
                    _.each(this.model.fields.properties, (fieldKey, fieldValue) => {
                        if(!fieldValue) { return; }

                        let isValidTab = !!this.getAllTabs()[fieldValue.tabId];

                        if(isValidTab && fieldValue.tabId !== this.currentTab) { return; }
                        if(!isValidTab && this.currentTab !== 'meta') { return; }

                        let $field = _.div({class: 'editor__field raised'});

                        // Sanity check
                        fieldValue.config = fieldValue.config || {};
                        fieldValue.schemaId = fieldValue.schemaId || 'array';

                        let renderField = () => {
                            _.append($field.empty(),
                                _.div({class: 'editor__field__sort-key'},
                                    fieldKey
                                ),
                                _.div({class: 'editor__field__value'},
                                    _.div({class: 'editor__field'},
                                        _.div({class: 'editor__field__key'}, 'Tab'),
                                        _.div({class: 'editor__field__value'},
                                            new HashBrown.Views.Widgets.Dropdown({
                                                useClearButton: true,
                                                options: this.getAllTabs(),
                                                value: fieldValue.tabId,
                                                onChange: (newValue) => {
                                                    fieldValue.tabId = newValue;

                                                    renderFieldProperties();
                                                }
                                            }).$element
                                        )
                                    ),
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

                                                    let newProperties = {};

                                                    // Insert the changed key into the correct place in the object
                                                    for(let key in this.model.fields.properties) {
                                                        if(key === fieldKey) {
                                                            newProperties[newKey] = this.model.fields.properties[fieldKey];
                                                        
                                                        } else {
                                                            newProperties[key] = this.model.fields.properties[key];

                                                        }
                                                    }

                                                    // Change internal reference to new key
                                                    fieldKey = newKey;

                                                    // Reassign the properties object
                                                    this.model.fields.properties = newProperties;

                                                    // Update the sort key
                                                    $field.find('.editor__field__sort-key').html(fieldKey);
                                                }
                                            }).$element
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
                                schemaId: 'array',
                                tabId: this.currentTab

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
