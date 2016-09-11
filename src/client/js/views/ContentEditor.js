'use strict';

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
                view.renderButtons();
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
        this.renderButtons();
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
     * @param {Object} fieldValue The field value to inject into the field editor
     * @param {Object} fieldDefinition The field definition
     * @param {Function} onChange The change event
     * @param {Object} config The field config
     *
     * @return {Object} element
     */
    renderField(fieldValue, fieldDefinition, onChange, config) {
        let fieldSchema = resources.schemas[fieldDefinition.schemaId];

        if(fieldSchema) {
            let fieldEditor = resources.editors[fieldSchema.editorId];
            
            if(fieldEditor) {
                let fieldEditorInstance = new fieldEditor({
                    value: fieldValue,
                    disabled: fieldDefinition.disabled || false,
                    config: config || {},
                    schema: fieldSchema,
                    multilingual: fieldDefinition.multilingual
                });

                fieldEditorInstance.on('change', onChange);

                return fieldEditorInstance.$element;

            } else {
                debug.log('No editor by id "' + fieldSchema.editorId + '" found', this);
            
            }
        
        } else {
            debug.log('No field schema found for schema id "' + fieldDefinition.schemaId + '"', this);

        }
    }

    /**
     * Renders fields
     *
     * @param {String} tabId The tab for which to render the fields
     * @param {Object} fieldDefinitions The set of field definitions to render
     * @param {Object} fieldValues The set of field values to inject into the field editor
     *
     * @returns {Array} A list of HTMLElements to render
     */
    renderFields(tabId, fieldDefinitions, fieldValues) {
        let view = this;
        let tabFieldDefinitions = {};

        // Map out field definitions to render
        // This is necessary because we're only rendering the fields for the specified tab
        for(let key in fieldDefinitions) {
            let fieldDefinition = fieldDefinitions[key];

            let noTabAssigned = !fieldDefinition.tabId;
            let isMetaTab = tabId == 'meta';
            let thisTabAssigned = fieldDefinition.tabId == tabId;

            // Don't include "properties" field, if this is the meta tab
            if(isMetaTab && key == 'properties') {
                continue;
            }

            if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                tabFieldDefinitions[key] = fieldDefinition;
            }
        }

        // Render all fields
        return _.each(tabFieldDefinitions, (key, fieldDefinition) => {
            // Fetch field schema
            let fieldSchema = resources.schemas[fieldDefinition.schemaId];

            // Field value sanity check
            fieldValues[key] = ContentHelper.fieldSanityCheck(fieldValues[key], fieldDefinition);

            // Render the field container
            return _.div({class: 'field-container', 'data-key': key},
                // Render the label and icon
                _.div({class: 'field-key'},
                    _.span({class: 'field-key-icon fa fa-' + fieldSchema.icon}),
                    _.span({class: 'field-key-label'}, fieldDefinition.label || key)
                ),

                // Render the field editor
                _.div({class: 'field-value'},
                    view.renderField(
                        // If the field definition is set to multilingual, pass value from object
                        fieldDefinition.multilingual ? fieldValues[key][window.language] : fieldValues[key],

                        // Pass the field definition
                        fieldDefinition,

                        // On change function
                        function(newValue) {
                            // If field definition is set to multilingual, assign flag and value onto object...
                            if(fieldDefinition.multilingual) {
                                fieldValues[key]._multilingual = true;
                                fieldValues[key][window.language] = newValue;

                            // ...if not, assign the value directly
                            } else {
                                fieldValues[key] = newValue;
                            }
                        },

                        // Pass the field definition config, and use the field's schema config as fallback
                        fieldDefinition.config || fieldSchema.config
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
     *
     * @return {Object} element
     */
    renderEditor(content, schema) {
        let view = this;

        // Check for active tab
        function isTabActive(tabId) {
            let targetTab = Router.params.tab || schema.defaultTabId || 'meta';

            return tabId == targetTab;
        }

        // Render editor
        return _.div({class: 'object'},
            _.ul({class: 'nav editor-header nav-tabs'}, 
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
            _.div({class: 'tab-content editor-body'},
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
            ),
            _.div({class: 'editor-footer'})
        );
    }

    /**
     * Renders the action buttons
     */
    renderButtons() {
        _.append($('.editor-footer').empty(), 
            _.div({class: 'btn-group'},
                // JSON editor
                _.button({class: 'btn btn-embedded'},
                    'Advanced'
                ).click(() => { this.onClickAdvanced(); }),

                // Delete
                _.button({class: 'btn btn-danger btn-raised'},
                    'Delete'
                ).click(() => { this.onClickDelete(this.publishingSettings); }),

                // Unpublish
                _.if(this.publishingSettings.connections && this.publishingSettings.connections.length > 0 && !this.model.unpublished,
                    this.$unpublishBtn = _.button({class: 'btn btn-primary btn-raised btn-save'},
                        _.span({class: 'text-default'}, 'Unthis.publish'),
                        _.span({class: 'text-working'}, 'Unthis.publishing')
                    ).click(() => { this.onClickUnthis.publish(this.publishing); })
                ),

                // Save & this.publish
                this.$saveBtn = _.button({class: 'btn btn-success btn-raised btn-save'},
                    _.span({class: 'text-default'}, 'Save' + (this.publishingSettings.connections && this.publishingSettings.connections.length > 0 ? ' & this.publish' : '')),
                    _.span({class: 'text-working'}, 'Saving')
                ).click(() => { this.onClickSave(this.publishingSettings); })
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

        SchemaHelper.getSchemaWithParentFields(this.model.schemaId)
        .then((schema) => {
            contentSchema = schema;
            
            return this.model.getSettings('publishing');
        })
        .then((settings) => {
            this.publishingSettings = settings;

            this.$element.html(
                // Render editor
                this.renderEditor(this.model, contentSchema)
            );
           
            this.renderButtons();

            this.onFieldEditorsReady();
        })
        .catch((e) => {
            errorModal(e);
        });
    }
}

module.exports = ContentEditor;
