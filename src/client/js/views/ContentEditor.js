'strict';

class ContentEditor extends View {
    constructor(params) {
        super(params);

        this.dirty = false;

        this.$element = _.div({class: 'editor content-editor'});

        this.fetch();
    }

    /**
     * Event: Scroll
     */
    onScroll(e) {
        let $follow;

        // Look for field labels that are close to the top of the viewport and make them follow
        this.$element.find('.field-container').each((i, field) => {
            let $field = $(field);
            $field.removeClass('following');

            let top = $field.position().top;

            if(top < 60) {
                // The closest field to the viewport top with an outer height above 100 should follow
                if(top != 0 && $field.outerHeight() > 100) {
                    $follow = $field;    

                // If a smaller field is closer, cacnel following
                } else {
                    $follow = null;

                }
            }
        });

        if($follow) {
            $follow.addClass('following');
        }
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
        let saveAction = this.$element.find('.editor-footer .select-publishing').val();
        let postSaveUrl;

        let setContent = () => {
            // Use publishing API
            if(publishing.connections && publishing.connections.length > 0) {
                // Unpublish
                if(saveAction === 'unpublish') {
                    return apiCall('post', 'content/unpublish', this.model);

                // Publish
                } else if(saveAction === 'publish') {
                    return apiCall('post', 'content/publish', this.model);
                
                // Preview
                } else if(saveAction === 'preview') {
                    return apiCall('post', 'content/preview', this.model);

                }

            // Just save normally
            } else {
                return apiCall('post', 'content/' + this.model.id, this.model);
            }
        }

        this.$saveBtn.toggleClass('working', true);

        // Save content to database
        setContent()
        .then((url) => {
            postSaveUrl = url;
            
            return reloadResource('content');
        })
        .then(() => {
            this.$saveBtn.toggleClass('saving', false);
            
            this.reload();
            
            NavbarMain.reload();

            this.dirty = false;

            if(saveAction === 'preview') {
                UI.iframeModal(
                    'Preview',
                    postSaveUrl
                );
            }
        })
        .catch(errorModal);
    }

    /**
     * Reload this view
     */
    reload() {
        this.lastScrollPos = this.$element.find('.editor-body')[0].scrollTop; 

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

        this.restoreScrollPos();
    }

    /**
     * Restores the scroll position
     */
    restoreScrollPos() {
        if(this.lastScrollPos) {
            this.$element.find('.editor-body')[0].scrollTop = this.lastScrollPos;
        }
    }

    static restoreScrollPos() {
        let editor = ViewHelper.get('ContentEditor');

        if(editor) {
            editor.restoreScrollPos();
        }
    }

    /**
     * Renders a field view
     *
     * @param {Object} fieldValue The field value to inject into the field editor
     * @param {FieldSchema} fieldDefinition The field definition
     * @param {Function} onChange The change event
     * @param {Object} config The field config
     * @param {HTMLElement} keyContent The key content container
     *
     * @return {Object} element
     */
    renderField(fieldValue, fieldDefinition, onChange, config, $keyContent) {
        let compiledSchema = SchemaHelper.getFieldSchemaWithParentConfigs(fieldDefinition.schemaId);

        if(compiledSchema) {
            let fieldEditor = resources.editors[compiledSchema.editorId];
            
            if(fieldEditor) {
                let fieldEditorInstance = new fieldEditor({
                    value: fieldValue,
                    disabled: fieldDefinition.disabled || false,
                    config: config || {},
                    schema: compiledSchema.getObject(),
                    multilingual: fieldDefinition.multilingual
                });

                fieldEditorInstance.on('change', (newValue) => {
                    if(!this.model.locked) {
                        this.dirty = true;
                    }

                    onChange(newValue);
                });

                fieldEditorInstance.on('silentchange', (newValue) => {
                    onChange(newValue);
                });

                if(fieldEditorInstance.$keyContent) {
                    $keyContent.append(fieldEditorInstance.$keyContent);
                }

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

            if(!fieldSchema) {
                debug.log('FieldSchema "' + fieldDefinition.schemaId + '" for key "' + key + '" not found', this);
                return null;
            }

            // Field value sanity check
            fieldValues[key] = ContentHelper.fieldSanityCheck(fieldValues[key], fieldDefinition);

            // Render the field container
            let $keyContent;

            return _.div({class: 'field-container', 'data-key': key},
                // Render the label and icon
                _.div({class: 'field-key'},
                    $keyContent = _.div({class: 'field-key-content'},
                        _.span({class: 'field-key-icon fa fa-' + fieldSchema.icon}),
                        _.span({class: 'field-key-label'}, fieldDefinition.label || key)
                    )
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
                        fieldDefinition.config || fieldSchema.config,

                        // Pass the key content container, so the field editor can populate it
                        $keyContent
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
            this.$body = _.div({class: 'tab-content editor-body'},
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
            ).on('scroll', (e) => {
                this.onScroll(e);
            }),
            _.div({class: 'editor-footer'})
        );
    }

    /**
     * Renders the action buttons
     */
    renderButtons() {
        let url = this.model.properties.url;

        if(url instanceof Object) {
            url = url[window.language];
        }

        _.append($('.editor-footer').empty(), 
            _.div({class: 'btn-group'},
                // JSON editor
                _.button({class: 'btn btn-embedded'},
                    'Advanced'
                ).click(() => { this.onClickAdvanced(); }),

                // View remote
                _.if(this.model.properties && this.model.properties.url && this.publishingSettings.connections[0],
                    _.if(this.model.isPublished,
                        _.a({target: '_blank', href: ConnectionHelper.getConnectionByIdSync(this.publishingSettings.connections[0]).url + url, class: 'btn btn-primary'}, 'View')
                    )
                ),
                _.if(!this.model.locked,
                    // Save & publish
                    _.div({class: 'btn-group-save-publish raised'},
                        this.$saveBtn = _.button({class: 'btn btn-save btn-primary'},
                            _.span({class: 'text-default'}, 'Save'),
                            _.span({class: 'text-working'}, 'Saving')
                        ).click(() => { this.onClickSave(this.publishingSettings); }),
                        _.if(this.publishingSettings.connections && this.publishingSettings.connections.length > 0,
                            _.span('&'),
                            _.select({class: 'form-control select-publishing'},
                                _.option({value: 'publish'}, 'Publish'),
                                _.option({value: 'preview'}, 'Preview'),
                                _.option({value: 'unpublish'}, 'Unpublish')
                            ).val('publish')
                        )
                    )
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
        
        this.$element.toggleClass('locked', this.model.locked);

        // Fetch information
        let contentSchema;
        let publishingSettings;

        return SchemaHelper.getSchemaWithParentFields(this.model.schemaId)
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
            UI.errorModal(e, () => { location.hash = '/content/json/' + this.model.id; });
        });
    }
}

module.exports = ContentEditor;
