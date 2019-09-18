'use strict';

/**
 * The editor for Content Schema
 *
 * @memberof HashBrown.Client.View.Editor
 */
class ContentSchemaEditor extends HashBrown.View.Editor.SchemaEditor {
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
                new HashBrown.View.Widget.Dropdown({
                    options: HashBrown.Service.SchemaService.getAllSchemas('content'),
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
                defaultTabEditor = new HashBrown.View.Widget.Dropdown({
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
                new HashBrown.Entity.View.Widget.List({
                    model: {
                        disabled: true,
                        value: Object.values(this.getParentTabs()) 
                    }
                }).element,
                new HashBrown.Entity.View.Widget.List({
                    model: {
                        value: Object.values(this.model.tabs),
                        placeholder: 'tab',
                        onchange: (newValue) => {
                            let newTabs = {};

                            for(let tab of newValue) {
                                if(!tab) { tab = 'New tab'; }

                                newTabs[tab.toLowerCase().replace(/[^a-zA-Z]/g, '')] = tab;
                            }
                            
                            this.model.tabs = newTabs;

                            defaultTabEditor.options = this.getAllTabs();
                            defaultTabEditor.fetch();

                            this.update();
                        }
                    }
                }).element
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
                            HashBrown.Service.UIService.fieldSortableObject(
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
                            label: fieldValue.label,
                            sortKey: fieldKey,
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
                            new HashBrown.View.Widget.Dropdown({
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
                            new HashBrown.View.Widget.Input({
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
                            'Collapsed',
                            new HashBrown.View.Widget.Input({
                                type: 'checkbox',
                                tooltip: 'Whether or not this field should be collapsed by default',
                                value: fieldValue.config.isCollapsed,
                                onChange: (newValue) => { fieldValue.config.isCollapsed = newValue; }
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
