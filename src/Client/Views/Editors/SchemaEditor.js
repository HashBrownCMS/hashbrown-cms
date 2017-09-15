// Icons
let icons = require('../../icons.json').icons;

const Schema = require('Common/Models/Schema');
const SchemaHelper = require('Client/Helpers/SchemaHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const JSONEditor = require('Client/Views/Editors/JSONEditor');

/**
 * The editor for schemas
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class SchemaEditor extends Crisp.View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'editor schema-editor'});

        this.fetch();
    }
    
    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = location.hash.replace('/schemas/', '/schemas/json/');
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        if(this.jsonEditor && this.jsonEditor.isValid == false) {
            return;
        }

        this.$saveBtn.toggleClass('working', true);

        RequestHelper.request('post', 'schemas/' + this.model.id, this.model)
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
        
            return RequestHelper.reloadResource('schemas');
        })
        .then(() => {
            Crisp.View.get('NavbarMain').reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Renders the editor picker
     *
     * @return {Object} element
     */
    renderEditorPicker() {
        if(this.model.isPropertyHidden('editorId')) { return; }  

        let editorOptions = [];

        for(let i in HashBrown.Views.Editors.FieldEditors) {
            let editor = HashBrown.Views.Editors.FieldEditors[i];

            editorOptions[editorOptions.length] = {
                value: editor.name,
                label: editor.name
            };
        }

        // The editorId is actually a name more than an id
        let editorName = this.model.editorId || '(none)';
        
        // Backwards compatible check
        editorName = editorName.charAt(0).toUpperCase() + editorName.slice(1);
        
        let $element = _.div({class: 'editor-picker'},
            _.if(!this.model.isLocked,
                UI.inputDropdownTypeAhead(editorName, editorOptions, (newValue) => {
                    this.model.editorId = newValue;
                })
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    editorName
                )
            )
        );

        return $element;
    }

    /**
     * Renders the name editor
     *
     * @return {Object} element
     */
    renderNameEditor() {
        if(this.model.isPropertyHidden('name')) { return; }  
        
        let view = this;

        function onInputChange() {
            view.model.name = $(this).val();
        }

        let $element = _.div({class: 'name-editor'},
            _.if(!this.model.isLocked,
                _.input({class: 'form-control', type: 'text', value: view.model.name, placeholder: 'Input the schema name here'})
                    .on('change', onInputChange)
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    view.model.name
                )
            )
        );

        return $element;
    }

    /**
     * Renders the tabs editor
     *  
     * @return {Object} element
     */
    renderTabsEditor() {
        if(this.model.isPropertyHidden('tabs')) { return; }  
        
        let view = this;
        
        function onInputChange($input) {
            let $chip = $input.parents('.chip');
            let oldId = $chip.attr('data-id');
            let newLabel = $input.val();
            let newId = ContentHelper.getSlug(newLabel);
            let $defaultTab = view.$element.find('.default-tab-editor .dropdown');

            // Assign new id to data attribute
            $chip.attr('data-id', newId);

            // Remove old id from model
            delete view.model.tabs[oldId];

            // Add new id and label to model
            view.model.tabs[newId] = newLabel;

            // Remove old tab from select element
            $defaultTab.trigger('changeOption', [ oldId, { id: newId, label: newLabel } ]);

            // If the default tab id was the old id, update the select element
            if(view.model.defaultTabId == oldId) {
                view.model.defaultTabId = newId;

                $defaultTab.trigger('setValue', newId);
            }
        }

        function onClickRemove($btn) {
            let $chip = $btn.parents('.chip');
            let id = $chip.attr('data-id');
            let $defaultTab = view.$element.find('.default-tab-editor .dropdown');

            // Remove the id from the tabs list
            delete view.model.tabs[id];

            // Remove the chip element
            $chip.remove();
            
            // Remove the tab from select element
            $defaultTab.trigger('removeOption', id);
            
            // If default tab id was this tab, revert to 'meta'
            if(view.model.defaultTabId == id) {
                view.model.defaultTabId = 'meta';

                $defaultTab.trigger('setValue', 'meta');
            }
        }
        
        function onClickAdd() {
            let name = 'New tab';
            let id = 'new-tab';
            let $defaultTab = view.$element.find('.default-tab-editor .dropdown');

            // Add new tab to model
            view.model.tabs[id] = name;

            // Redraw the tab editor
            render();

            // Add new tab to default tab select element
            $defaultTab.trigger('addOption', { value: id, label: name});
        }

        function render() {
            // Prepend parent tabs if applicable
            if(view.model.parentSchemaId) {
                SchemaHelper.getSchemaWithParentFields(view.model.parentSchemaId)
                .then((parentSchema) => {
                    let parentTabs = parentSchema.tabs;
                    
                    $tabs.prepend(
                        _.each(parentTabs, function(id, label) {
                            return _.div({class: 'tab chip'},
                                _.p({class: 'chip-label'},
                                    label + ' (inherited)'
                                )
                            );
                        })
                    );
                })
                .catch(UI.errorModal);
            }

            let $tabs = _.div({class: 'chip-group'});

            $element.html($tabs);
            
            $tabs.append(
                _.each(view.model.tabs, (id, label) => {
                    return _.div({class: 'tab chip', 'data-id': id},
                        _.input({type: 'text', class: 'chip-label' + (view.model.isLocked ? ' disabled' : ''), value: label})
                            .change(function(e) {
                                onInputChange($(this));
                            }),
                        _.if(!view.model.isLocked,
                            _.button({class: 'btn chip-remove'}, 
                                _.span({class: 'fa fa-remove'})
                            ).click(function(e) {
                                onClickRemove($(this));
                            })
                        )
                    );
                })
            );

            if(!view.model.isLocked) {
                $tabs.append(
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(onClickAdd)
                );
            }
        }

        let $element = _.div({class: 'tabs-editor'});

        render();

        return $element;
    }

    /**
     * Renders the icon editor
     *  
     * @return {Object} element
     */
    renderIconEditor() {
        if(this.model.isPropertyHidden('icon')) { return; }  
        
        let view = this;

        function onClickBrowse() {
            function onSearch() {
                let query = modal.$element.find('.icon-search input').val().toLowerCase();

                if(query.length > 2 || query.length == 0) {
                    modal.$element.find('.btn-icon').each(function(i) {
                        let $btn = $(this);
                        let name = $btn.children('.icon-name').html();

                        $btn.toggle(name.indexOf(query) > -1);
                    });
                }
            }

            let modal = new HashBrown.Views.Modals.MessageModal({
                model: {
                    class: 'modal-icon-picker',
                    title: 'Pick an icon',
                    body: [   
                        _.div({class: 'icon-search'},
                            _.input({type: 'text', class: 'form-control', placeholder: 'Search for icons'})
                                .on('change', function(e) {
                                    onSearch();
                                })
                        ),
                        _.each(icons, function(i, icon) {
                            function onClickButton() {
                                view.model.icon = icon;

                                view.$element.find('.btn-icon-browse .fa').attr('class', 'fa fa-' + icon);

                                modal.hide();
                            }
                            
                            return _.button({class: 'btn btn-icon'},
                                _.span({class: 'fa fa-' + icon}),
                                _.span({class: 'icon-name'}, icon)
                            ).click(onClickButton);
                        })
                    ]
                }
            });
        }

        let $element = _.div({class: 'icon-editor'},
            _.if(!this.model.isLocked,
                _.button({class: 'btn btn-icon-browse btn-default' + (this.model.isLocked ? ' disabled' : '')},
                    _.span({class: 'fa fa-' + this.model.icon})
                ).click(onClickBrowse)
            ),
            _.if(this.model.isLocked,
                _.span({class: 'fa fa-' + this.model.icon})
            )
        );
        
        return $element;
    }

    /**
     * Renders the parent editor
     *  
     * @return {Object} element
     */
    renderParentEditor() {
        if(this.model.isPropertyHidden('parentSchemaId')) { return; }  
        
        let schemaOptions = [];

        // Filter out irrelevant schemas, self and children of self
        let excludedParents = {};
        excludedParents[this.model.id] = true;

        for(let i in resources.schemas) {
            let schema = resources.schemas[i];

            // Check if this Schema has a parent in the excluded list
            // If so, add this id to the excluded list
            // This is to prevent making a Schema a child of its own children
            if(excludedParents[schema.parentSchemaId] == true) {
                excludedParents[schema.id] = true;
                continue;
            }

            // If this Schema is not of the same type as the model, or has the same id, exclude it
            if(
                schema.type != this.model.type ||
                schema.id == this.model.id
            ) {
                continue;
            }

            schemaOptions[schemaOptions.length] = {
                label: schema.name,
                value: schema.id
            };
        }

        // Assign fallback schema name
        let parentName = '(none)';

        if(schemaOptions[this.model.parentSchemaId]) {
            parentName = schemaOptions[this.model.parentSchemaId].name;
        }

        // Render element
        let $element = _.div({class: 'parent-editor input-group'},
            _.if(!this.model.isLocked,
                UI.inputDropdownTypeAhead(this.model.parentSchemaId, schemaOptions, (newValue) => {
                    if(!newValue) {
                        newValue = this.model.type == 'field' ? 'fieldBase' : 'contentBase'; 
                    }

                    this.model.parentSchemaId = newValue;

                    return newValue;
                }, true)
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    parentName
                )
            )
        );
        
        return $element;
    }

    /**
     * Renders the default tab editor
     *  
     * @return {Object} element
     */
    renderDefaultTabEditor() {
        if(this.model.isPropertyHidden('defaultTabId')) { return; }  
        
        let tabOptions = [
            { value: 'meta', label: 'Meta' }
        ];

        // Sanity check
        this.model.defaultTabId = this.model.defaultTabId || this.compiledSchema.defaultTabId || 'meta';

        for(let value in this.compiledSchema.tabs) {
            tabOptions[tabOptions.length] = { value: value, label: this.compiledSchema.tabs[value] };
        }

        let $element = _.div({class: 'default-tab-editor'},
            _.if(!this.model.isLocked,
                UI.inputDropdown(this.model.defaultTabId, tabOptions, (newValue) => {
                    this.model.defaultTabId = newValue;
                })
            ),
            _.if(this.model.isLocked,
                _.p({class: 'read-only'},
                    this.compiledSchema.tabs[this.model.defaultTabId] || '(none)'
                )
            )
        );
        
        return $element;
    }

    /**
     * Renders the allowed child Schemas editor (ContentSchema only)
     *
     * @return {HTMLElement} Element
     */
    renderAllowedChildSchemasEditor() {
        if(this.model.isPropertyHidden('allowedChildSchemas')) { return; }  
       
        let view = this;

        function onChange() {
            view.model.allowedChildSchemas = [];
            
            $element.find('.schemas .schema .dropdown .dropdown-toggle').each(function() {
                 view.model.allowedChildSchemas.push($(this).attr('data-id'));
            });

            render();
        }

        function onClickAdd() {
            let newSchemaId = '';

            for(let i in resources.schemas) {
                let schema = resources.schemas[i];
                
                if(
                    schema.type == 'content' &&
                    view.model.allowedChildSchemas.indexOf(schema.id) < 0 &&
                    schema.id != 'contentBase' &&
                    schema.id != 'page'
                ) {
                    newSchemaId = schema.id;
                    break;
                }
            }

            if(newSchemaId) {
                view.model.allowedChildSchemas.push(newSchemaId);

                render();
            }
        }

        function render() {
            _.append($element.empty(),
                _.div({class: 'schemas chip-group'},
                    _.each(view.model.allowedChildSchemas, (i, schemaId) => {
                        try {
                            let $schema = _.div({class: 'chip schema'},
                                _.div({class: 'chip-label dropdown'},
                                    _.button({class: 'dropdown-toggle', 'data-id': schemaId, 'data-toggle': 'dropdown'},
                                        SchemaHelper.getSchemaByIdSync(schemaId).name
                                    ),
                                    _.if(!view.model.isLocked,
                                        _.ul({class: 'dropdown-menu'},
                                            _.each(resources.schemas, (i, schema) => {
                                                if(
                                                    schema.type == 'content' &&
                                                    (schema.id == schemaId || view.model.allowedChildSchemas.indexOf(schema.id) < 0) &&
                                                    schema.id != 'contentBase' &&
                                                    schema.id != 'page'
                                                ) {
                                                    return _.li(
                                                        _.a({href: '#', 'data-id': schema.id},
                                                            schema.name
                                                        ).click(function(e) {
                                                            e.preventDefault();
                                                                
                                                            let $btn = $(this).parents('.dropdown').children('.dropdown-toggle');
                                                            
                                                            $btn.text($(this).text());
                                                            $btn.attr('data-id', $(this).attr('data-id'));

                                                            onChange();
                                                        })
                                                    );
                                                }
                                            })
                                        )
                                    )
                                ).change(onChange),
                                _.if(!view.model.isLocked,
                                    _.button({class: 'btn chip-remove'},
                                        _.span({class: 'fa fa-remove'})
                                    ).click(() => {
                                        $schema.remove();        

                                        onChange();
                                    })
                                )
                            );
                            
                            return $schema;

                        } catch(e) {
                            UI.errorModal(e);
                        }
                    }),
                    _.if(!view.model.isLocked,
                        _.button({class: 'btn chip-add'},
                            _.span({class: 'fa fa-plus'})
                        ).click(onClickAdd)
                    )
                )
            );
        }

        let $element = _.div({class: 'allowed-child-schemas-editor'});

        render();

        return $element;
    }

    /**
     * Renders the field properties editor
     *
     * @returns {HTMLElement} Editor element
     */
    renderFieldPropertiesEditor() {
        if(this.model.type == 'content') {
            if(!this.model.fields) {
                this.model.fields = {};
            }
            
            if(!this.model.fields.properties) {
                this.model.fields.properties = {};
            }
        
            this.jsonEditor = new JSONEditor({
                model: this.model.fields.properties,
                embedded: true
            });

            this.jsonEditor.on('change', (newValue) => {
                this.model.fields.properties = newValue;
            });
        
        } else if(this.model.type == 'field') {
            if(!this.model.config) {
                this.model.config = {};
            }
            
            this.jsonEditor = new JSONEditor({
                model: this.model.config,
                embedded: true
            });

            this.jsonEditor.on('change', (newValue) => {
                this.model.config = newValue;
            });
        }

        let $element = _.div({class: 'field-properties-editor'},
            this.jsonEditor.$element
        );

        return $element;
    }

	/**
	 * Render template editor
	 *
	 * @returns {HTMLElement} Element
	 */
	renderTemplateEditor() {
        let $element = _.div({class: 'field-properties-editor'});

		setTimeout(() => {
			this.templateEditor = CodeMirror($element[0], {
				value: this.model.previewTemplate || '',
                mode: {
                    name: 'xml'
                },
                lineWrapping: true,
                lineNumbers: true,
                tabSize: 4,
                indentUnit: 4,
                indentWithTabs: true
			});

			this.templateEditor.on('change', () => {
				this.model.previewTemplate = this.templateEditor.getDoc().getValue();
			});
		}, 1);

		return $element;
	}

    /**
     * Renders a single field
     *
     * @param {String} label
     * @param {HTMLElement} content
     * @param {Boolean} isVertical
     *
     * @return {HTMLElement} Editor element
     */
    renderField(label, $content, isVertical) {
        if(!$content) { return; }

        return _.div({class: 'field-container ' + (isVertical ? 'vertical' : '')},
            _.div({class: 'field-key'},
                label
            ),
            _.div({class: 'field-value'},
                $content
            )
        );
    }

    /**
     * Renders all fields
     *
     * @return {Object} element
     */
    renderFields() {
        let id = parseInt(this.model.id);

        let $element = _.div({class: 'schema editor-body'});
        
        $element.empty();

        $element.append(this.renderField('Name', this.renderNameEditor())); 
        $element.append(this.renderField('Icon', this.renderIconEditor()));   
        $element.append(this.renderField('Parent', this.renderParentEditor()));
        
        switch(this.model.type) {
            case 'content':
                $element.append(this.renderField('Default tab', this.renderDefaultTabEditor()));
                $element.append(this.renderField('Tabs', this.renderTabsEditor()));
                $element.append(this.renderField('Allowed child Schemas', this.renderAllowedChildSchemasEditor()));
                
                if(!this.model.isLocked) {
                    $element.append(this.renderField('Fields', this.renderFieldPropertiesEditor(), true));
                }
                
                break;

            case 'field':
                $element.append(this.renderField('Field editor', this.renderEditorPicker()));
                
                if(!this.model.isLocked) {
                    $element.append(this.renderField('Config', this.renderFieldPropertiesEditor(), true));
                    $element.append(this.renderField('Preview template', this.renderTemplateEditor(), true));
                }
       
                break;
        }


        return $element;
    }

    render() {
        if(this.model instanceof Schema === false) {
            this.model = SchemaHelper.getModel(this.model);
        }

        this.$element.toggleClass('locked', this.model.isLocked);

        SchemaHelper.getSchemaWithParentFields(this.model.id)
        .then((compiledSchema) => {
            this.compiledSchema = compiledSchema;
           
            _.append(this.$element.empty(),
                _.div({class: 'editor-header'},
                    _.span({class: 'fa fa-' + this.compiledSchema.icon}),
                    _.h4(this.model.name)
                ),
                this.renderFields(),
                _.div({class: 'editor-footer panel panel-default panel-buttons'}, 
                    _.div({class: 'btn-group'},
                        _.button({class: 'btn btn-embedded'},
                            'Advanced'
                        ).click(() => { this.onClickAdvanced(); }),
                        _.if(!this.model.isLocked,
                            this.$saveBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                                _.span({class: 'text-default'}, 'Save '),
                                _.span({class: 'text-working'}, 'Saving ')
                            ).click(() => { this.onClickSave(); })
                        )
                    )
                )
            );
        });
    }
}

module.exports = SchemaEditor;
