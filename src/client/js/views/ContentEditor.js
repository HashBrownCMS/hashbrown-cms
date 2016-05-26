'use strict';

// Views
let MessageModal = require('./MessageModal');

// Helpers
let LanguageHelper = require('../../../common/helpers/LanguageHelper');

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
     *
     * @param {Object} publishing
     */
    onClickSave(publishing) {
        let view = this;

        function publishConnections() {
            let queueIndex = 0;
            
            function next() {
                let connectionId = publishing.connections[queueIndex];
                let connection = resources.connections.filter((c) => {
                    return c.id == connectionId;
                })[0];

                queueIndex++;
                
                $.ajax({
                    type: 'post',
                    url: '/api/' + connection.type + '/publish/',
                    data: {
                        settings: connection.settings,
                        content: view.model
                    },
                    success:
                        queueIndex < publishing.connections.length - 1 ?
                        next :
                        onSuccess,
                    error: onError
                });
            }
            
            next();
        }

        function onSuccess() {
            console.log('[ContentEditor] Saved model to ' + view.modelUrl);
            view.$saveBtn.toggleClass('saving', false);
        
            reloadResource('content')
            .then(function() {
                let navbar = ViewHelper.get('NavbarMain');

                view.reload();
                navbar.reload();
            });
        }

        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        }

        view.$saveBtn.toggleClass('saving', true);

        // Save content to database
        $.ajax({
            type: 'post',
            url: view.modelUrl,
            data: view.model,
            success:
                publishing.connections.length > 0 ?
                publishConnections :
                onSuccess,
            error: onError
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

        let $languageOptions = _.ul({class: 'dropdown-menu'});
        let $languagePicker = _.div({class: 'language-picker dropdown'},
            _.button({class: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown'},
                window.language
            ),
            $languageOptions
        );

        LanguageHelper.getLanguages()
        .then((languages) => {
            $languageOptions.html(
                _.each(
                    languages.filter((language) => {
                        return language != window.language;
                    }), (i, language) => {
                    return _.li({value: language},
                        _.a({href: '#'},
                            language
                        ).click(view.onChangeLanguage)
                    );
                })
            );
        });

        return _.div({class: 'object'},
            $languagePicker,
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
            let content = new Content(this.model);

            content.getSettings('publishing')
            .then((publishing) => {
                view.$element.html([
                    view.renderContentObject(view.model, contentSchema).append(
                        _.div({class: 'panel panel-default panel-buttons'}, 
                            _.div({class: 'btn-group'},
                                _.button({class: 'btn btn-embedded'},
                                    'Advanced'
                                ).click(function() { view.onClickAdvanced(); }),
                                _.button({class: 'btn btn-danger btn-raised'},
                                    'Delete'
                                ).click(function() { view.onClickDelete(); }),
                                view.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                                    _.span({class: 'text-default'}, 'Save' + (publishing.connections.length > 0 ? ' & publish' : '')),
                                    _.span({class: 'text-saving'}, 'Saving')
                                ).click(function() { view.onClickSave(publishing); })
                            )
                        )
                    )
                ]);
            });

            this.onFieldEditorsReady();
        }
    }
}

module.exports = ContentEditor;
