// Icons
let icons = require('../icons.json').icons;

/**
 * The editor for schemas
 *
 * @class View SchemaEditor
 * @param {Object} params
 */
class SchemaEditor extends View {
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
     * Event: On click remove
     */
    onClickDelete() {
        let view = this;

        function onSuccess() {
            debug.log('Removed Schema with id "' + view.model.id + '"', view); 
        
            reloadResource('schemas')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the SchemaEditor view
                location.hash = '/schemas/';
            });
        }

        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err.message
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete schema',
                body: 'Are you sure you want to delete the schema "' + view.model.name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: () => {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'schemas/' + view.model.id)
                        .then(onSuccess)
                        .catch(onError);
                    }
                }
            ]
        });
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('working', true);

        apiCall('post', 'schemas/' + this.model.id, this.model)
        .then(() => {
            debug.log('Saved model to', this);
            this.$saveBtn.toggleClass('working', false);
        
            reloadResource('schemas')
            .then(() => {
                let navbar = ViewHelper.get('NavbarMain');
                
                navbar.reload();
            });
        })
        .catch((err) => {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        });
    }

    /**
     * Renders the editor picker
     *
     * @return {Object} element
     */
    renderEditorPicker() {
        let view = this;

        function onChange() {
            view.model.editorId = $(this).val();
        }

        let $select;

        let editorName = '(none)';
        
        if(resources.editors[this.model.editorId]) {
            editorName = resources.editors[this.model.editorId].name;
        }

        let $element = _.div({class: 'editor-picker'},
            _.if(!this.model.locked,
                $select = _.select({class: 'form-control'},
                    _.each(resources.editors, function(id, view) {
                        return _.option({value: id}, view.name);
                    })
                ).change(onChange)
            ),
            _.if(this.model.locked,
                _.p({class: 'read-only'},
                    editorName
                )
            )
        );

        if(!this.model.locked && this.model.editorId) {
            $select.val(view.model.editorId);
        }

        return $element;
    }

    /**
     * Renders the name editor
     *
     * @return {Object} element
     */
    renderNameEditor() {
        let view = this;

        function onInputChange() {
            view.model.name = $(this).val();
        }

        let $element = _.div({class: 'name-editor'},
            _.if(!this.model.locked,
                _.input({class: 'form-control', type: 'text', value: view.model.name, placeholder: 'Write the schema name here'})
                    .on('change', onInputChange)
            ),
            _.if(this.model.locked,
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
        let view = this;
        
        function onInputChange($input) {
            let $chip = $input.parents('.chip');
            let oldId = $chip.attr('data-id');
            let newLabel = $input.val();
            let newId = ContentHelper.getSlug(newLabel);
            let $defaultTabSelect = view.$element.find('.default-tab-editor select');

            // Assign new id to data attribute
            $chip.attr('data-id', newId);

            // Remove old id from model
            delete view.model.tabs[oldId];

            // Add new id and label to model
            view.model.tabs[newId] = newLabel;

            // Remove old tab from select element
            $defaultTabSelect.children().each((i, option) => {
                if($(option).attr('value') == oldId) {
                    $(option).remove();
                }
            });

            // Append the new tab to the select element
            $defaultTabSelect.append(
                _.option({value: newId}, newLabel)
            );

            // If the default tab id was the old id, update the select element
            if(view.model.defaultTabId == oldId) {
                view.model.defaultTabId = newId;

                $defaultTabSelect.val(newId);
            }
        }

        function onClickRemove($btn) {
            let $chip = $btn.parents('.chip');
            let id = $chip.attr('data-id');
            let $defaultTabSelect = view.$element.find('.default-tab-editor select');

            // Remove the id from the tabs list
            delete view.model.tabs[id];

            // Remove the chip element
            $chip.remove();
            
            // Remove the tab from select element
            $defaultTabSelect.children().each((i, option) => {
                if($(option).attr('value') == id) {
                    $(option).remove();
                }
            });
            
            // If default tab id was this tab, revert to 'meta'
            if(view.model.defaultTabId == id) {
                view.model.defaultTabId = 'meta';

                $defaultTabSelect.val('meta');
            }
        }
        
        function onClickAdd() {
            let name = 'New tab';
            let id = 'new-tab';
            let $defaultTabSelect = view.$element.find('.default-tab-editor select');

            // Add new tab to model
            view.model.tabs[id] = name;

            // Redraw the tab editor
            render();

            // Add new tab to default tab select element
            $defaultTabSelect.append(
                _.option({value: id}, name)
            );
        }

        function render() {
            let parentTabs = {};
            
            if(view.parentSchema) {
                parentTabs = view.parentSchema.tabs;
            }

            let $tabs = _.div({class: 'chip-group'});

            $element.html($tabs);
            
            $tabs.append(
                _.each(parentTabs, function(id, label) {
                    return _.div({class: 'tab chip'},
                        _.p({class: 'chip-label'},
                            label + ' (inherited)'
                        )
                    );
                })
            );

            $tabs.append(
                _.each(view.model.tabs, (id, label) => {
                    return _.div({class: 'tab chip', 'data-id': id},
                        _.input({type: 'text', class: 'chip-label' + (view.model.locked ? ' disabled' : ''), value: label})
                            .change(function(e) {
                                onInputChange($(this));
                            }),
                        _.if(!view.model.locked,
                            _.button({class: 'btn chip-remove'}, 
                                _.span({class: 'fa fa-remove'})
                            ).click(function(e) {
                                onClickRemove($(this));
                            })
                        )
                    );
                })
            );

            if(!view.model.locked) {
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
        let view = this;

        function onClickBrowse() {
            function onSearch() {
                let query = $element.find('.icon-search input').val().toLowerCase();

                if(query.length > 2 || query.length == 0) {
                    view.$element.find('.btn-icon').each(function(i) {
                        let $btn = $(this);
                        let name = $btn.children('.icon-name').html();

                        $btn.toggle(name.indexOf(query) > -1);
                    });
                }
            }

            let $modal = _.div({class: 'modal modal-icon-picker fade'},
                _.div({class: 'modal-dialog'},
                    _.div({class: 'modal-content'},
                        _.div({class: 'modal-body'},
                            _.div({class: 'icon-search'},
                                _.input({type: 'text', class: 'form-control', placeholder: 'Search for icons'})
                                    .on('change', function(e) {
                                        onSearch();
                                    })
                            ),
                            _.each(icons, function(i, icon) {
                                function onClickButton() {
                                    view.model.icon = icon;

                                    $element.find('.btn-icon-browse .fa').attr('class', 'fa fa-' + icon);

                                    $element.find('.modal').modal('hide');
                                }
                                
                                return _.button({class: 'btn btn-default btn-icon'},
                                    _.span({class: 'fa fa-' + icon}),
                                    _.span({class: 'icon-name'}, icon)
                                ).click(onClickButton);
                            })
                        )
                    )
                )
            );
            
            $modal.on('hidden.bs.modal', function() {
                $modal.remove();
            });

            $('body').append($modal);

            $modal.modal('show');
        }

        let $element = _.div({class: 'icon-editor'},
            _.if(!this.model.locked,
                _.button({class: 'btn btn-icon-browse btn-default' + (this.model.locked ? ' disabled' : '')},
                    _.span({class: 'fa fa-' + this.model.icon})
                ).click(onClickBrowse)
            ),
            _.if(this.model.locked,
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
        let view = this;

        function onChange() {
            view.model.parentSchemaId = $element.find('select').val();
        }

        function onClear() {
            view.model.parentSchemaId = null;
           
            $element.find('select').val(null);
        }

        let schemas = {};

        // TODO: Filter out irrelevant schemas and self
        for(let id in resources.schemas) {
            if(resources.schemas[id].type == view.model.type) {
                schemas[id] = resources.schemas[id];
            }
        }

        let parentName = '(none)';

        if(schemas[this.model.parentSchemaId]) {
            parentName = schemas[this.model.parentSchemaId].name;
        }

        let $element = _.div({class: 'parent-editor input-group'},
            _.if(!this.model.locked,
                _.select({class: 'form-control'}, 
                    _.each(schemas, function(id, schema) {
                        return _.option({value: id}, schema.name);
                    })
                ).val(this.model.parentSchemaId).change(onChange),
                _.if(!this.model.locked,
                    _.div({class: 'input-group-btn'},
                        _.button({class: 'btn btn-primary'},
                            'Clear'
                        ).click(onClear)
                    )
                )
            ),
            _.if(this.model.locked,
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
        let view = this;
        
        function onChange() {
            view.model.defaultTabId = $element.find('select').val();
        }

        let tabs = {
            meta: 'Meta'
        };
        
        for(let k in view.compiledSchema.tabs) {
            tabs[k] = view.compiledSchema.tabs[k];
        }

        let $element = _.div({class: 'default-tab-editor'},
            _.if(!this.model.locked,
                _.select({class: 'form-control'}, 
                    _.each(tabs, function(id, label) {
                        return _.option({value: id}, label);
                    })
                ).val(this.model.defaultTabId).change(onChange)
            ),
            _.if(this.model.locked,
                _.p({class: 'read-only'},
                    tabs[this.model.defaultTabId]
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
        let view = this;

        function onChange() {
            view.model.allowedChildSchemas = [];
            
            $element.find('.schemas .schema select').each(function() {
                 view.model.allowedChildSchemas.push($(this).val());
            });

            render();
        }

        function onClickAdd() {
            view.model.allowedChildSchemas.push('page');

            render();
        }

        function onClear() {
            view.model.parentSchemaId = null;
           
            $element.find('select').val(null);
        }

        function render() {
            _.append($element.empty(),
                _.div({class: 'schemas chip-group'},
                    _.each(view.model.allowedChildSchemas, (i, schemaId) => {
                        try {
                            let $schema = _.div({class: 'chip schema'},
                                _.select({class: 'chip-label'},
                                    _.each(resources.schemas, (id, schema) => {
                                        if(schema.type == 'content' && (id == schemaId || view.model.allowedChildSchemas.indexOf(schema.id) < 0)) {
                                            return _.option({value: id, selected: id == schemaId}, schema.name);
                                        }
                                    })
                                ).change(onChange),
                                _.button({class: 'btn chip-remove'},
                                    _.span({class: 'fa fa-remove'})
                                ).click(() => {
                                    $schema.remove();        

                                    onChange();
                                })
                            );
                            
                            return $schema;

                        } catch(e) {
                            errorModal(e);
                        }
                    }),
                    _.button({class: 'btn chip-add'},
                        _.span({class: 'fa fa-plus'})
                    ).click(onClickAdd)
                )
            );
        }

        let $element = _.div({class: 'allowed-child-schemas-editor'});

        render();

        return $element;
    }

    /**
     * Renders a single field
     *
     * @return {Object} element
     */
    renderField(label, $content) {
        return _.div({class: 'field-container'},
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

        let $element = _.div({class: 'schema'});
        
        // Content type
        $element.empty();

        $element.append(this.renderField('Name', this.renderNameEditor())); 
        $element.append(this.renderField('Icon', this.renderIconEditor()));   
        $element.append(this.renderField('Parent', this.renderParentEditor()));

        switch(this.model.type) {
            case 'content':
                $element.append(this.renderField('Default tab', this.renderDefaultTabEditor()));
                $element.append(this.renderField('Tabs', this.renderTabsEditor()));
                $element.append(this.renderField('Allowed child Schemas', this.renderAllowedChildSchemasEditor()));
                break;

            case 'field':
                $element.append(this.renderField('Field editor', this.renderEditorPicker()));
                break;
        }

        return $element;
    }

    render() {
        SchemaHelper.getSchemaWithParentFields(this.model.parentSchemaId)
        .then((parentSchema) => {
            this.parentSchema = parentSchema;

            SchemaHelper.getSchemaWithParentFields(this.model.id)
            .then((compiledSchema) => {
                this.compiledSchema = compiledSchema;
                
                _.append(this.$element.empty(),
                    this.renderFields(),
                    _.div({class: 'panel panel-default panel-buttons'}, 
                        _.div({class: 'btn-group'},
                            _.button({class: 'btn btn-embedded'},
                                'Advanced'
                            ).click(() => { this.onClickAdvanced(); }),
                            _.if(!this.model.locked,
                                _.button({class: 'btn btn-danger btn-raised'},
                                    'Delete'
                                ).click(() => { this.onClickDelete(); }),
                                this.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                                    _.span({class: 'text-default'}, 'Save '),
                                    _.span({class: 'text-working'}, 'Saving ')
                                ).click(() => { this.onClickSave(); })
                            )
                        )
                    )
                );
            });
        });
    }
}

module.exports = SchemaEditor;
