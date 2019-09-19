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
            allTabs[parentTabs[tabId]] = tabId;
        }
        
        for(let tabId in this.model.tabs) {
            allTabs[this.model.tabs[tabId]] = tabId;
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
            this.currentTab = Object.values(this.getAllTabs())[0] || 'meta';
        }
        
    }

    /**
     * Renders the editor fields
     */
    renderBody() {
        let $element = super.renderBody();

        _.append($element,
            this.field(
                'Allowed child Schemas',
                new HashBrown.Entity.View.Widget.Popup({
                    model: {
                        options: (async () => {
                            let options = {};
                            let schemas = await HashBrown.Service.SchemaService.getAllSchemas('content');

                            for(let schema of schemas) {
                                options[schema.name] = schema.id;
                            }

                            return options;
                        })(),
                        value: this.model.allowedChildSchemas,
                        multiple: true,
                        clearable: true,
                        autocomplete: true,
                        onchange: (newValue) => {
                            this.model.allowedChildSchemas = newValue;
                        }
                    }
                }).element
            ),
            this.field(
                'Default tab',
                new HashBrown.Entity.View.Widget.Popup({
                    model: {
                        options: this.getAllTabs(),
                        clearable: true,
                        value: this.model.defaultTabId,
                        onchange: (newValue) => {
                            this.model.defaultTabId = newValue;
                        }
                    }
                }).element
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

                            this.update();
                        }
                    }
                }).element
            ),

            // Tabs
            _.div({class: 'editor--schema__tabs'},
                _.each(this.getAllTabs(), (name, id) => {
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

                    let isValidTab = Object.values(this.getAllTabs()).indexOf(fieldValue.tabId) > -1;

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
                            new HashBrown.Entity.View.Widget.Popup({
                                model: {
                                    clearable: true,
                                    options: this.getAllTabs(),
                                    value: fieldValue.tabId,
                                    onchange: (newValue) => {
                                        fieldValue.tabId = newValue;

                                        this.update();
                                    }
                                }
                            }).element
                        ),
                        this.field(
                            'Key',
                            new HashBrown.Entity.View.Widget.Text({
                                model: {
                                    placeholder: 'A variable name, e.g. "myField"',
                                    tooltip: 'The field variable name',
                                    value: fieldKey,
                                    onchange: (newKey) => {
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
                                }
                            }).element
                        ),
                        this.field(
                            'Label',
                            new HashBrown.Entity.View.Widget.Text({
                                model: {
                                    placeholder: 'A label, e.g. "My field"',
                                    tooltip: 'The field label',
                                    value: fieldValue.label,
                                    onchange: (newValue) => { 
                                        this.changeFieldLabel(fieldValue.label, newValue);
                                        
                                        fieldValue.label = newValue;
                                    }
                                }
                            }).element
                        ),
                        this.field(
                            'Description',
                            new HashBrown.Entity.View.Widget.Text({
                                model: {
                                    placeholder: 'A description',
                                    tooltip: 'The field description',
                                    value: fieldValue.description,
                                    onchange: (newValue) => { fieldValue.description = newValue; }
                                }
                            }).element
                        ),
                        this.field(
                            'Multilingual',
                            new HashBrown.Entity.View.Widget.Checkbox({
                                model: {
                                    tooltip: 'Whether or not this field should support multiple languages',
                                    value: fieldValue.multilingual || false,
                                    onchange: (newValue) => { fieldValue.multilingual = newValue; }
                                }
                            }).element
                        ),
                        this.field(
                            'Collapsed',
                            new HashBrown.Entity.View.Widget.Checkbox({
                                model: {
                                    tooltip: 'Whether or not this field should be collapsed by default',
                                    value: fieldValue.config.isCollapsed,
                                    onchange: (newValue) => { fieldValue.config.isCollapsed = newValue; }
                                }
                            }).element
                        ),
                        this.field(
                            'Schema',
                            new HashBrown.Entity.View.Widget.Popup({
                                model: {
                                    autocomplete: true,
                                    options: (async () => {
                                        let options = {};
                                        let schemas = await HashBrown.Service.SchemaService.getAllSchemas('field');

                                        for(let schema of schemas) {
                                            options[schema.name] = schema.id;
                                        }

                                        return options;
                                    })(),
                                    value: fieldValue.schemaId,
                                    onchange: (newValue) => {
                                        fieldValue.schemaId = newValue;

                                        this.update();
                                    }
                                }
                            }).element
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
