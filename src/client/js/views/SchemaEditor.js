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
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        this.$saveBtn.toggleClass('saving', true);

        $.ajax({
            type: 'post',
            url: this.modelUrl,
            data: this.model,
            success: () => {
                debug.log('Saved model to ' + this.modelUrl, this);
                this.$saveBtn.toggleClass('saving', false);
            
                reloadResource('schemas')
                .then(() => {
                    let navbar = ViewHelper.get('NavbarMain');
                    
                    navbar.reload();
                });
            },
            error: function(err) {
                new MessageModal({
                    model: {
                        title: 'Error',
                        body: err
                    }
                });
            }
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
                _.input({class: 'form-control', type: 'text', value: view.model.name, placholder: 'Write the schema name here'})
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
        
        function onInputChange(id, element) {
            let newLabel = $(element).val();
            let newId = ContentHelper.getSlug(newLabel);

            delete view.model.tabs[id];

            view.model.tabs[newId] = newLabel;
        }

        function onClickRemove(id) {
            delete view.model.tabs[id];

            render();
        }
        
        function onClickAdd() {
            let name = 'New tab';
            let id = 'new-tab';

            view.model.tabs[id] = name;

            render();
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
                                onInputChange(id, $(this));
                            }),
                        _.if(!view.model.locked,
                            _.button({class: 'btn chip-remove'}, 
                                _.span({class: 'fa fa-remove'})
                            ).click(() => {
                                onClickRemove(id);
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
            $element.find('.modal').modal('show');
        }

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

        let $element = _.div({class: 'icon-editor'},
            _.if(!this.model.locked,
                _.button({class: 'btn btn-icon-browse btn-default' + (this.model.locked ? ' disabled' : '')},
                    _.span({class: 'fa fa-' + this.model.icon})
                ).click(onClickBrowse)
            ),
            _.if(this.model.locked,
                _.span({class: 'fa fa-' + this.model.icon})
            ),
            _.div({class: 'modal fade'},
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
            schemas[id] = resources.schemas[id];
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
                break;

            case 'field':
                $element.append(this.renderField('Field editor', this.renderEditorPicker()));
                break;
        }

        return $element;
    }

    render() {
        SchemaHelper.getSchemaWithParentValues(this.model.parentSchemaId)
        .then((parentSchema) => {
            this.parentSchema = parentSchema;

            SchemaHelper.getSchemaWithParentValues(this.model.id)
            .then((compiledSchema) => {
                this.compiledSchema = compiledSchema;
                
                _.append(this.$element,
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
                                    _.span({class: 'text-saving'}, 'Saving ')
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
