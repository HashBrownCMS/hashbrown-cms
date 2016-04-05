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
        location.hash = '/schemas/json/' + this.model.id;
    }

    /**
     * Event: Click save. Posts the model to the modelUrl
     */
    onClickSave() {
        let view = this;

        view.$saveBtn.toggleClass('saving', true);

        $.ajax({
            type: 'post',
            url: view.modelUrl,
            data: view.model,
            success: function() {
                console.log('[SchemaEditor] Saved model to ' + view.modelUrl);
                view.$saveBtn.toggleClass('saving', false);
            
                reloadResource('schemas')
                .then(function() {
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
     * Renders the tabs editor
     *  
     * @return {Object} element
     */
    renderTabsEditor() {
        let view = this;
        
        function onInputChange() {
            let $group = $(this).parents('.input-group');
            let id = $group.attr('data-id');

            view.model.tabs[id] = $(this).val();
        }

        function onClickRemove() {
            let $group = $(this).parents('.input-group');
            let id = $group.attr('data-id');
            
            delete view.model.tabs[id];

            render();
        }
        
        function onClickAdd() {
            let currentId = 90000;
            let newId = -1;

            while(newId == -1) {
                // If the id already exists, increment                
                if(view.compiledSchema.tabs[currentId.toString()]) {
                    currentId++;
                } else {
                    newId = currentId;
                }
            }

            view.model.tabs[newId] = 'New tab';

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
                _.each(view.model.tabs, function(id, label) {
                    return _.div({class: 'tab chip', 'data-id': id}, [
                        _.input({type: 'text', class: 'chip-label', value: label})
                            .bind('keyup change propertychange paste', onInputChange),
                        _.button({class: 'btn chip-remove'}, 
                            _.span({class: 'fa fa-remove'})
                        ).click(onClickRemove)
                    ]);
                })
            );

            $tabs.append(
                _.button({class: 'btn chip-add'},
                    _.span({class: 'fa fa-plus'})
                ).click(onClickAdd)
            );
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

        function onClickSearch() {
            let query = $element.find('.modal input').val();

            console.log(query);
        }

        let $element = _.div({class: 'icon-editor'}, [
            _.button({class: 'btn btn-default'},
                _.span({class: 'fa fa-' + this.model.icon})
            ).click(onClickBrowse),
            _.div({class: 'modal fade'},
                _.div({class: 'modal-dialog'},
                    _.div({class: 'modal-content'},
                        _.div({class: 'modal-body'}, [
                            _.div({class: 'input-group'}, [
                                _.input({type: 'text', class: 'form-control'}),
                                _.div({class: 'input-group-btn'},
                                    _.button({class: 'btn btn-primary'},
                                        'Search'
                                    ).click(onClickSearch)
                                )
                            ]),
                            _.each(icons, function(i, icon) {
                                function onClickSelect() {
                                    view.model.icon = icon;

                                    $element.find('.btn-icon-browse .fa').attr('class', 'fa fa-' + icon);
                                }
                                
                                return _.button({class: 'btn btn-default'},
                                    _.span({class: 'fa fa-' + icon})
                                ).click(onClickSelect);
                            })
                        ])
                    )
                )
            )
        ]);
        
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

        let $element = _.div({class: 'parent-editor input-group'}, [
            _.select({class: 'form-control'}, 
                _.each(schemas, function(id, schema) {
                    return _.option({value: id}, schema.name);
                })
            ).val(this.model.parentSchemaId).change(onChange),
            _.div({class: 'input-group-btn'},
                _.button({class: 'btn btn-primary'},
                    'Clear'
                ).click(onClear)
            )
        ]);
        
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

        let $element = _.div({class: 'default-tab-editor'},
            _.select({class: 'form-control'}, 
                _.each(this.compiledSchema.tabs, function(id, label) {
                    return _.option({value: id}, label);
                })
            ).val(this.model.defaultTabId).change(onChange)
        );
        
        return $element;
    }

    /**
     * Renders a single field
     *
     * @return {Object} element
     */
    renderField(label, $content) {
        return _.div({class: 'field-container'}, [
            _.div({class: 'field-key'},
                label
            ),
            _.div({class: 'field-value'},
                $content
            )
        ]);
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
        if(this.model.id < 20000) {
            $element.html([
                this.renderField('Icon', this.renderIconEditor()),    
                this.renderField('Parent', this.renderParentEditor()),    
                this.renderField('Default tab', this.renderDefaultTabEditor()),    
                this.renderField('Tabs', this.renderTabsEditor())
            ]);
        }

        return $element;
    }

    render() {
        let view = this;

        this.parentSchema = getSchemaWithParents(this.model.parentSchemaId);
        this.compiledSchema = getSchemaWithParents(this.model.id);

        if(this.model.locked) {
            this.$element.html(
                _.div({class: 'schema'},
                    _.p('This schema is locked')
                )        
            );
        } else {
            this.$element.html([
                this.renderFields(),
                _.div({class: 'panel panel-default panel-buttons'}, 
                    _.div({class: 'btn-group'}, [
                        _.button({class: 'btn btn-embedded'},
                            'Advanced'
                        ).click(function() { view.onClickAdvanced(); }),
                        _.button({class: 'btn btn-danger btn-raised'},
                            'Delete'
                        ).click(function() { view.onClickDelete(); }),
                        view.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'}, [
                            _.span({class: 'text-default'}, 'Save '),
                            _.span({class: 'text-saving'}, 'Saving '),
                        ]).click(function() { view.onClickSave(); })
                    ])
                )
            ]);
        }
    }
}

module.exports = SchemaEditor;
