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
     * Pre render
     */
    prerender() {
        if(!this.model.defaultTabId && this.parentSchema) {
            this.model.defaultTabId = this.parentSchema.defaultTabId;
        }
        
        if(!this.currentTab) {
            this.currentTab = Object.keys(this.getAllTabs())[0] || 'meta';
        }
        
    }

    /**
     * Renders the editor fields
     */
    renderBody() {
        let $element = super.renderBody();
        let defaultTabEditor;

        _.append($element,
            this.field(
                'Allowed child Schemas',
                new HashBrown.Views.Widgets.Dropdown({
                    options: HashBrown.Helpers.SchemaHelper.getAllSchemas('content'),
                    value: this.model.allowedChildSchemas,
                    labelKey: 'name',
                    valueKey: 'id',
                    useMultiple: true,
                    useClearButton: true,
                    useTypeAhead: true,
                    onChange: (newValue) => {
                        this.model.allowedChildSchemas = newValue;
                    }
                })
            ),
            this.field(
                'Default tab',
                defaultTabEditor = new HashBrown.Views.Widgets.Dropdown({
                    options: this.getAllTabs(),
                    useClearButton: true,
                    value: this.model.defaultTabId,
                    onChange: (newValue) => {
                        this.model.defaultTabId = newValue;
                    }
                })
            ),
            this.field(
                'Tabs',
                new HashBrown.Views.Widgets.Chips({
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

                        this.update();
                    }
                })
            ),

            // Tabs
            _.div({class: 'editor--schema__tabs'},
                _.each(this.getAllTabs(), (id, name) => {
                    return _.button({class: 'editor--schema__tab' + (this.currentTab === id ? ' active' : '')}, name)
                        .click(() => {
                            this.currentTab = id;
                   
                            this.update();
                        });
                }),
                _.button({class: 'editor--schema__tab' + (this.currentTab === 'meta' ? ' active' : '')}, 'meta')
                    .click(() => {
                        this.currentTab = 'meta';
                   
                        this.update();
                    })
            ),
            
            // Parent properties
            _.if(Object.keys(this.getParentProperties(this.currentTab)).length > 0,
                this.field(
                    { 
                        label: 'Parent properties',
                        description: 'Properties that are inherited and can be changed if you add them to this Schema',
                        isCluster: true
                    },
                    _.each(this.getParentProperties(this.currentTab), (fieldKey, fieldValue) => {
                        if(this.model.fields.properties[fieldKey]) { return; }

                        return _.button({class: 'widget widget--button condensed', title: 'Change the "' + (fieldValue.label || fieldKey) + '" property for this Schema'},
                            _.span({class: 'fa fa-plus'}),
                            fieldValue.label || fieldKey
                        ).click(() => {
                            let newProperties = {};

                            newProperties[fieldKey] = JSON.parse(JSON.stringify(fieldValue));

                            for(let key in this.model.fields.properties) {
                                newProperties[key] = this.model.fields.properties[key];
                            }

                            this.model.fields.properties = newProperties;

                            this.update();
                        });
                    })
                )
            ),

            // Properties
            this.field(
                {
                    label: 'Properties',
                    description: 'This schema\'s own properties',
                    actions: {
                        'sort': (e) => {
                            HashBrown.Helpers.UIHelper.fieldSortableObject(
                                this.model.fields.properties,
                                this.getField('Properties'),
                                (newProperties) => {
                                    this.model.fields.properties = newProperties;
                                }
                            );
                        }
                    }
                },
                _.each(this.model.fields.properties, (fieldKey, fieldValue) => {
                    if(!fieldValue) { return; }

                    let isValidTab = !!this.getAllTabs()[fieldValue.tabId];

                    if(isValidTab && fieldValue.tabId !== this.currentTab) { return; }
                    if(!isValidTab && this.currentTab !== 'meta') { return; }

                    // Sanity check
                    fieldValue.config = fieldValue.config || {};
                    fieldValue.schemaId = fieldValue.schemaId || 'array';

                    return this.field(
                        {
                            label: fieldKey,
                            isCollapsible: true,
                            isCollapsed: true,
                            actions: {
                                remove: (e) => {
                                    delete this.model.fields.properties[fieldKey];

                                    this.update();
                                }
                            }
                        },
                        this.field(
                            'Tab',
                            new HashBrown.Views.Widgets.Dropdown({
                                useClearButton: true,
                                options: this.getAllTabs(),
                                value: fieldValue.tabId,
                                onChange: (newValue) => {
                                    fieldValue.tabId = newValue;

                                    this.update();
                                }
                            })
                        ),
                        this.field(
                            'Key',
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

                                    // Update the sort key
                                    this.changeFieldLabel(fieldKey, newKey);

                                    // Change internal reference to new key
                                    fieldKey = newKey;

                                    // Reassign the properties object
                                    this.model.fields.properties = newProperties;
                                }
                            })
                        ),
                        this.field(
                            'Label',
                            new HashBrown.Views.Widgets.Input({
                                type: 'text',
                                placeholder: 'A label, e.g. "My field"',
                                tooltip: 'The field label',
                                value: fieldValue.label,
                                onChange: (newValue) => { fieldValue.label = newValue; }
                            })
                        ),
                        this.field(
                            'Description',
                            new HashBrown.Views.Widgets.Input({
                                type: 'text',
                                placeholder: 'A description',
                                tooltip: 'The field description',
                                value: fieldValue.description,
                                onChange: (newValue) => { fieldValue.description = newValue; }
                            })
                        ),
                        this.field(
                            'Multilingual',
                            new HashBrown.Views.Widgets.Input({
                                type: 'checkbox',
                                tooltip: 'Whether or not this field should support multiple languages',
                                value: fieldValue.multilingual || false,
                                onChange: (newValue) => { fieldValue.multilingual = newValue; }
                            })
                        ),
                        this.field(
                            'Schema',
                            new HashBrown.Views.Widgets.Dropdown({
                                useTypeAhead: true,
                                options: HashBrown.Helpers.SchemaHelper.getAllSchemas('field'),
                                value: fieldValue.schemaId,
                                labelKey: 'name',
                                valueKey: 'id',
                                onChange: (newValue) => {
                                    fieldValue.schemaId = newValue;

                                    this.update();
                                }
                            })
                        ),
                        this.renderConfigEditor(fieldValue.schemaId, fieldValue.config)
                    );
                }),
                _.button({title: 'Add a Content property', class: 'editor__field__add widget widget--button round fa fa-plus'})
                    .click(() => {
                        if(this.model.fields.properties.newField) { return; }

                        this.model.fields.properties.newField = {
                            label: 'New field',
                            schemaId: 'array',
                            tabId: this.currentTab

                        };

                        this.update();
                    })
            )
        );

        return $element;
    }
}

module.exports = ContentSchemaEditor;
