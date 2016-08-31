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
     * Event: Click unpublish. Removes remove content and sets "unpublished" flag
     *
     * @param {Object} publishing
     */
    onClickUnpublish(publishing) {
        let view = this;

        function unpublishConnections() {
            apiCall('post', 'content/unpublish', view.model)
            .then(onSuccess)
            .catch(onError);
        }
        
        function onSuccess() {
            debug.log('Unpublished content with id "' + view.model.id + '"', this); 
        
            reloadResource('content')
            .then(function() {
                view.render();
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

        view.$unpublishBtn.toggleClass('working', true);

        // Set unpublished flag
        view.model.unpublished = true;

        // Save content to database
        apiCall('post', 'content/' + view.model.id, view.model)
        .then(unpublishConnections)
        .catch(onError);
    }
    
    /**
     * Event: Click save. Posts the model to the modelUrl
     *
     * @param {Object} publishing
     */
    onClickSave(publishing) {
        this.model.unpublished = false;

        let publishConnections = () => {
            if(publishing.connections && publishing.connections.length > 0) {
                return apiCall('post', 'content/publish', this.model);
            } else {
                return new Promise((resolve) => { resolve(); });
            }
        }

        let reloadView = () => {
            this.$saveBtn.toggleClass('saving', false);
            
            this.reload();
            ViewHelper.get('NavbarMain').reload();
        }

        this.$saveBtn.toggleClass('working', true);

        // Save content to database
        apiCall('post', 'content/' + this.model.id, this.model)
        .then(() => { return publishConnections(); })
        .then(() => { return reloadResource('content'); })
        .then(reloadView)
        .catch(errorModal);
    }

    /**
     * Event: Click toggle publish
     */
    onClickTogglePublish() {

    }

    /**
     * Event: On click remove
     *
     * @param {Object} publishing
     */
    onClickDelete(publishing) {
        let view = this;

        function unpublishConnections() {
            apiCall('post', 'content/unpublish', view.model)
            .then(onSuccess)
            .catch(onError);
        }
        
        function onSuccess() {
            debug.log('Removed content with id "' + view.model.id + '"', this); 
        
            reloadResource('content')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the ContentEditor view
                location.hash = '/content/';
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

        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to delete the content "' + view.model.prop('title', window.language) + '"?'
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
                        apiCall('delete', 'content/' + view.model.id)
                        .then(() => {
                            if(publishing.connections && publishing.connections.length > 0) {
                                unpublishConnections();
                            
                            } else {
                                onSuccess();
                            }
                        })
                        .catch(onError);
                    }
                }
            ]
        });
    }

    /**
     * Reload this view
     */
    reload() {
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
    renderField(fieldValue, schemaValue, onChange, config) {
        let fieldSchema = resources.schemas[schemaValue.schemaId];

        if(fieldSchema) {
            let fieldEditor = resources.editors[fieldSchema.editorId];
            
            if(fieldEditor) {
                let fieldEditorInstance = new fieldEditor({
                    value: fieldValue,
                    disabled: schemaValue.disabled || false,
                    config: config || {},
                    schema: fieldSchema,
                    multilingual: schemaValue.multilingual
                });

                fieldEditorInstance.on('change', onChange);

                return fieldEditorInstance.$element;

            } else {
                debug.log('No editor by id "' + fieldSchema.editorId + '" found', this);
            
            }
        
        } else {
            debug.log('No field schema found for schema id "' + schemaValue.schemaId + '"', this);

        }
    }

    /**
     * Renders fields
     */
    renderFields(tabId, schema, fields) {
        let view = this;
        let schemaFields = {};

        // Map out fields to render
        for(let alias in schema) {
            let field = schema[alias];

            let noTabAssigned = !field.tabId;
            let isMetaTab = tabId == 'meta';
            let thisTabAssigned = field.tabId == tabId;

            // Don't include "properties" field, if this is the meta tab
            if(isMetaTab && alias == 'properties') {
                continue;
            }

            if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                schemaFields[alias] = field;
            }
        }

        return _.each(schemaFields, (key, schemaValue) => {
            let fieldSchema = resources.schemas[schemaValue.schemaId];

            // Sanity check
            fields[key] = ContentHelper.fieldSanityCheck(fields[key], schemaValue);

            return _.div({class: 'field-container', 'data-key': key},
                _.div({class: 'field-key'},
                    _.span({class: 'field-key-icon fa fa-' + fieldSchema.icon}),
                    _.span({class: 'field-key-label'}, schemaValue.label || key)
                ),
                _.div({class: 'field-value'},
                    view.renderField(
                        schemaValue.multilingual ? fields[key][window.language] : fields[key],
                        schema[key],
                        function(newValue) {
                            if(schemaValue.multilingual) {
                                fields[key]._multilingual = true;
                                fields[key][window.language] = newValue;

                            } else {
                                fields[key] = newValue;
                            }
                        },
                        schemaValue.config
                    )
                )
            );
        });
    }

    /**
     * Event: Click tab
     *
     * @param {String} tab
     */
    onClickTab(tab) {
        location.hash = '/content/' + Router.params.id + '/' + tab;
    }

    /**
     * Renders the editor
     *
     * @param {Content} content
     * @param {Object} schema
     * @param {Array} languages
     *
     * @return {Object} element
     */
    renderEditor(content, schema, languages) {
        let view = this;

        // Check for active tab
        function isTabActive(tabId) {
            let targetTab = Router.params.tab || schema.defaultTabId || 'meta';

            return tabId == targetTab;
        }

        // Render editor
        return _.div({class: 'object'},
            new LanguagePicker({ model: languages }).$element,
            _.ul({class: 'nav nav-tabs'}, 
                _.each(schema.tabs, (tabId, tab) => {
                    return _.li({class: isTabActive(tabId) ? 'active' : ''}, 
                        _.a({'data-toggle': 'tab', href: '#tab-' + tabId},
                            tab
                        ).click(() => { this.onClickTab(tabId); })
                    );
                }),
                _.li({class: isTabActive('meta') ? 'active' : ''}, 
                    _.a({'data-toggle': 'tab', href: '#tab-meta'},
                        'meta'
                    ).click(() => { this.onClickTab('meta'); })
                )
            ),
            _.div({class: 'tab-content'},
                // Render content properties
                _.each(schema.tabs, (tabId, tab) => {
                    return _.div({id: 'tab-' + tabId, class: 'tab-pane' + (isTabActive(tabId) ? ' active' : '')},
                        this.renderFields(tabId, schema.fields.properties, content.properties)
                    );
                }),

                // Render meta properties
                _.div({id: 'tab-meta', class: 'tab-pane' + (isTabActive('meta') ? ' active' : '')},
                    this.renderFields('meta', schema.fields, content),
                    this.renderFields('meta', schema.fields.properties, content.properties)
                )
            )
        );
    }

    render() {
        // Make sure the model data is using the Content model
        if(!this.model.properties) {
            this.model.properties = {};
        }

        this.model = new Content(this.model);
        
        // Fetch information
        let contentSchema;
        let publishingSettings;
        let selectedLanguages;

        LanguageHelper.getSelectedLanguages()
        .then((languages) => {
            selectedLanguages = languages;

            return SchemaHelper.getSchemaWithParentFields(this.model.schemaId);
        })
        .then((schema) => {
            contentSchema = schema;
            
            return this.model.getSettings('publishing');
        })
        .then((settings) => {
            publishingSettings = settings;

            this.$element.html(
                // Render editor
                this.renderEditor(this.model, contentSchema, selectedLanguages)

                // Render buttons 
                .append(
                    _.div({class: 'panel panel-default panel-buttons'}, 
                        _.div({class: 'btn-group'},

                            // JSON editor
                            _.button({class: 'btn btn-embedded'},
                                'Advanced'
                            ).click(() => { this.onClickAdvanced(); }),

                            // Delete
                            _.button({class: 'btn btn-danger btn-raised'},
                                'Delete'
                            ).click(() => { this.onClickDelete(publishingSettings); }),

                            // Unpublish
                            _.if(publishingSettings.connections && publishingSettings.connections.length > 0 && !this.model.unpublished,
                                this.$unpublishBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                                    _.span({class: 'text-default'}, 'Unpublish'),
                                    _.span({class: 'text-working'}, 'Unpublishing')
                                ).click(() => { this.onClickUnpublish(publishing); })
                            ),

                            // Save & publish
                            this.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                                _.span({class: 'text-default'}, 'Save' + (publishingSettings.connections && publishingSettings.connections.length > 0 ? ' & publish' : '')),
                                _.span({class: 'text-working'}, 'Saving')
                            ).click(() => { this.onClickSave(publishingSettings); })
                        )
                    )
                )
            );
            
            this.onFieldEditorsReady();
        })
        .catch((e) => {
            errorModal(e);
        });
    }
}

module.exports = ContentEditor;
