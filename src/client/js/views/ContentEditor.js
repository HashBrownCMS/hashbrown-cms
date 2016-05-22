'use strict';

// Views
let MessageModal = require('./MessageModal');

class ContentEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'editor content-editor'});

        this.fetch();
    }

    /**
     * Event: Click advanced. Routes to the JSON editor
     */
    onClickAdvanced() {
        location.hash = '/content/json/' + this.model.id;
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
                console.log('[ContentEditor] Saved model to ' + view.modelUrl);
                view.$saveBtn.toggleClass('saving', false);
            
                reloadResource('content')
                .then(function() {
                    let navbar = ViewHelper.get('NavbarMain');

                    view.reload();
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
     * Event: Click toggle publish
     */
    onClickTogglePublish() {

    }

    /**
     * Event: On click remove
     */
    onClickDelete() {
        let view = this;

        function onSuccess() {
            console.log('[ContentEditor] Removed content with id "' + view.model.id + '"'); 
        
            reloadResource('content')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the ContentEditor view
                location.hash = '/content/';
            });
        }

        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to delete the content "' + view.model.title + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        $.ajax({
                            url: '/api/content/' + view.model.id,
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
    }

    /**
     * Event: On change language
     */
    onChangeLanguage(e) {
        e.preventDefault();

        localStorage.setItem('language', $(this).text());

        location.reload();
    }

    /**
     * Reload this view
     */
    reload() {
        this.model = null;
        
        this.fetch();
    }

    /**
     * Binds event to fire when field editors are ready
     * Or fires them if no callback was passed
     *
     * @param {Function} callback
     */
    onFieldEditorsReady(callback) {
        if(!this.fieldEditorReadyCallbacks) {
            this.fieldEditorReadyCallbacks = [];
        }

        if(callback) {
            this.fieldEditorReadyCallbacks.push(callback);

        } else {
            for(let registeredCallback of this.fieldEditorReadyCallbacks) {
                registeredCallback();
            }

            this.fieldEditorReadyCallbacks = [];
        }
    }

    /**
     * Renders a field view
     *
     * @param {Object} fieldValue
     * @param {Object} schemaValue
     * @param {Function} onChange
     *
     * @return {Object} element
     */
    renderFieldView(fieldValue, schemaValue, onChange, config) {
        let fieldSchema = resources.schemas[schemaValue.schemaId];

        if(fieldSchema) {
            let fieldEditor = resources.editors[fieldSchema.editorId];
            
            if(fieldEditor) {
                let fieldEditorInstance = new fieldEditor({
                    value: fieldValue,
                    disabled: schemaValue.disabled || false,
                    config: config || {}                });

                fieldEditorInstance.on('change', onChange);

                return fieldEditorInstance.$element;

            } else {
                console.log('[ContentEditor] No editor by id "' + fieldSchema.editorId + '" found');
            
            }
        
        } else {
            console.log('[ContentEditor] No field schema found for schema id "' + schemaValue.schemaId + '"');

        }
    }

    /**
     * Renders a Content object
     *
     * @param {Object} contentProperties
     * @param {Object} schema
     *
     * @return {Object} element
     */
    renderContentObject(contentProperties, schema) {
        let view = this;

        return _.div({class: 'object'},
            _.div({class: 'language-picker dropdown'},
                _.button({class: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown'},
                    window.language
                ),
                _.ul({class: 'dropdown-menu'},
                    _.each(
                        ['en','da'].filter((language) => {
                            return language != window.language;
                        }), (i, language) => {
                        return _.li({value: language},
                            _.a({href: '#'},
                                language
                            ).click(view.onChangeLanguage)
                        );
                    })
                )
            ).change(this.onChangeLanguage),
            _.ul({class: 'nav nav-tabs'}, 
                _.each(schema.tabs, function(id, tab) {
                    return _.li({class: id == schema.defaultTabId ? 'active' : ''}, 
                        _.a({'data-toggle': 'tab', href: '#tab-' + id},
                            tab
                        )
                    );
                })
            ),
            _.div({class: 'tab-content'},
                _.each(schema.tabs, function(id, tab) {
                    let schemaProperties = {};
                   
                    for(let alias in schema.properties) {
                        let property = schema.properties[alias];

                        let noTabAssigned = !property.tabId;
                        let isMetaTab = tab == 'Meta';
                        let thisTabAssigned = property.tabId == id;

                        if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                            schemaProperties[alias] = property;
                        }
                    }

                    return _.div({id: 'tab-' + id, class: 'tab-pane' + (id == schema.defaultTabId ? ' active' : '')}, 
                        _.each(schemaProperties, function(key, value) {
                            if(value.multilingual && typeof contentProperties[key] !== 'object') {
                                contentProperties[key] = {};
                            }

                            return _.div({class: 'field-container'},
                                _.div({class: 'field-icon'},
                                    _.span({class: 'fa fa-' + value.icon})
                                ),
                                _.div({class: 'field-key'},
                                    value.label || key
                                ),
                                _.div({class: 'field-value'},
                                    view.renderFieldView(
                                        value.multilingual ? contentProperties[key][window.language] : contentProperties[key],
                                        schema.properties[key],
                                        function(newValue) {
                                            if(value.multilingual) {
                                                contentProperties[key][window.language] = newValue;

                                            } else {
                                                contentProperties[key] = newValue;
                                            }
                                        },
                                        value.config,
                                        value.multilingual
                                    )
                                )
                            );
                        })
                    );
                })
            )
        );
    }

    render() {
        let view = this;

        let contentSchema = getSchemaWithParents(this.model.schemaId);

        if(contentSchema) {
            this.$element.html([
                this.renderContentObject(this.model, contentSchema).append(
                    _.div({class: 'panel panel-default panel-buttons'}, 
                        _.div({class: 'btn-group'},
                            _.button({class: 'btn btn-embedded'},
                                'Advanced'
                            ).click(function() { view.onClickAdvanced(); }),
                            _.button({class: 'btn btn-danger btn-raised'},
                                'Delete'
                            ).click(function() { view.onClickDelete(); }),
                            view.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                                _.span({class: 'text-default'}, 'Save '),
                                _.span({class: 'text-saving'}, 'Saving ')
                            ).click(function() { view.onClickSave(); })
                        )
                    )
                )
            ]);

            this.onFieldEditorsReady();
        }
    }
}

module.exports = ContentEditor;
