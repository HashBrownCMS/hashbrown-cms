'use strict';

/**
 * The editor view for Content objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ContentEditor extends Crisp.View {
    constructor(params) {
        super(params);

        this.dirty = false;

        this.fetch();
    }

    /**
     * Event: Scroll
     */
    onScroll(e) {
        let followingField;

        // Look for field labels that are close to the top of the viewport and make them follow
        this.$element.find('.editor__body__tab.active > .editor__field > .editor__field__key').each((i, field) => {
            field.classList.remove('following');
           
            let rect = field.getBoundingClientRect();
            let actions = field.querySelector('.editor__field__key__actions');
            let actionRect;

            if(actions) { 
                actionRect = actions.getBoundingClientRect();
            }

            if(
                rect.top <= 40 &&
                actionRect && rect.bottom >= (actionRect.height + 60) &&
                (!followingField || followingField.getBoundingClientRect().top < rect.top)
            ) {
                followingField = field;
            }
        });

        if(followingField) {
            followingField.classList.add('following');
        }
       
        // Cache the last scroll position
        this.lastScrollPos = this.$element.find('.editor__body')[0].scrollTop; 
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
        let saveAction = this.$element.find('.editor__footer__buttons select').val();
        let postSaveUrl;

        let setContent = () => {
            // Use publishing API
            if(this.model.getSettings('publishing').connectionId) {
                // Unpublish
                if(saveAction === 'unpublish') {
                    return HashBrown.Helpers.RequestHelper.request('post', 'content/unpublish', this.model);

                // Publish
                } else if(saveAction === 'publish') {
                    return HashBrown.Helpers.RequestHelper.request('post', 'content/publish', this.model);
                
                // Preview
                } else if(saveAction === 'preview') {
                    return HashBrown.Helpers.RequestHelper.request('post', 'content/preview', this.model);

                }
            }

            // Just save normally
            return HashBrown.Helpers.RequestHelper.request('post', 'content/' + this.model.id, this.model);
        }

        this.$saveBtn.toggleClass('working', true);

        // Save content to database
        setContent()
        .then((url) => {
            postSaveUrl = url;
            
            return HashBrown.Helpers.RequestHelper.reloadResource('content');
        })
        .then(() => {
            this.$saveBtn.toggleClass('working', false);
            
            this.reload();
            
            HashBrown.Views.Navigation.NavbarMain.reload();

            this.dirty = false;

            if(saveAction === 'preview') {
                UI.iframeModal(
                    'Preview',
                    postSaveUrl
                );
            }
        })
        .catch((e) => {
            this.$saveBtn.toggleClass('working', false);
            UI.errorModal(e);
        });
    }

    /**
     * Reload this view
     */
    reload() {
        this.lastScrollPos = this.$element.find('.editor__body')[0].scrollTop; 

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
     *
     * @param {Number} delay
     */
    restoreScrollPos(delay) {
        let newScrollPos = this.lastScrollPos || 0;

        setTimeout(() => {
            this.$element.find('.editor__body')[0].scrollTop = newScrollPos;
        }, delay || 0);
    }

    /**
     * Static version of the restore scroll position method
     *
     * @param {Number} delay
     */
    static restoreScrollPos(delay) {
        let editor = Crisp.View.get('ContentEditor');

        if(editor) {
            editor.restoreScrollPos(delay);
        }
    }

    /**
     * Gets a field editor for a Schema
     *
     * @param {string} editorId
     *
     * @returns {View} Field editor
     */
    static getFieldEditor(editorId) {
        if(!editorId) { return; }

        // Backwards compatible check
        editorId = editorId.charAt(0).toUpperCase() + editorId.slice(1);
        
        if(editorId.indexOf('Editor') < 0) {
            editorId += 'Editor';
        }

        return HashBrown.Views.Editors.FieldEditors[editorId];
    }

    /**
     * Renders a field view
     *
     * @param {Object} fieldValue The field value to inject into the field editor
     * @param {FieldSchema} fieldDefinition The field definition
     * @param {Function} onChange The change event
     * @param {HTMLElement} keyActions The key content container
     *
     * @return {Object} element
     */
    renderField(fieldValue, fieldDefinition, onChange, $keyActions) {
        let compiledSchema = HashBrown.Helpers.SchemaHelper.getFieldSchemaWithParentConfigs(fieldDefinition.schemaId);

        if(!compiledSchema) {
            return debug.log('No FieldSchema found for Schema id "' + fieldDefinition.schemaId + '"', this);
        }

        let fieldEditor = ContentEditor.getFieldEditor(compiledSchema.editorId);
          
        if(!fieldEditor) {
            return debug.log('No field editor by id "' + fieldSchema.editorId + '" found', this);
        }

        // Get the config
        let config;

        // If the field has a config, check recursively if it's empty
        // If it isn't, use this config
        if(fieldDefinition.config) {
            let isEmpty = true;
            let checkRecursive = (object) => {
                if(!object) { return; }

                // We consider a config not empty, if it has a value that is not an object
                // Remember, null is of type 'object' too
                if(typeof object !== 'object') { return isEmpty = false; }

                for(let k in object) {
                    checkRecursive(object[k]);
                }
            };

            checkRecursive(fieldDefinition.config);

            if(!isEmpty) {
                config = fieldDefinition.config;
            }
        }

        // If no config was found, and the Schema has one, use it
        if(!config && compiledSchema.config) {
            config = compiledSchema.config;
        }

        // If still no config was found, assign a placeholder
        if(!config) {
            config = {};
        }

        // Instantiate the field editor
        let fieldEditorInstance = new fieldEditor({
            value: fieldValue,
            disabled: fieldDefinition.disabled || false,
            config: config,
            description: fieldDefinition.description || '',
            schema: compiledSchema.getObject(),
            multilingual: fieldDefinition.multilingual === true,
            $keyActions: $keyActions
        });

        fieldEditorInstance.on('change', (newValue) => {
            if(this.model.isLocked) { return; }
            
            this.dirty = true;

            onChange(newValue);
        });

        fieldEditorInstance.on('silentchange', (newValue) => {
            if(this.model.isLocked) { return; }
            
            onChange(newValue);
        });

        return _.div({class: 'editor__field__value'},
            fieldEditorInstance.$element
        );
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
        let tabFieldDefinitions = {};

        // Map out field definitions to render
        // This is necessary because we're only rendering the fields for the specified tab
        for(let key in fieldDefinitions) {
            let fieldDefinition = fieldDefinitions[key];

            let noTabAssigned = !this.schema.tabs[fieldDefinition.tabId];
            let isMetaTab = tabId === 'meta';
            let thisTabAssigned = fieldDefinition.tabId === tabId;

            // Don't include "properties" field, if this is the meta tab
            if(isMetaTab && key === 'properties') {
                continue;
            }

            if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                tabFieldDefinitions[key] = fieldDefinition;
            }
        }

        // Render all fields
        return _.each(tabFieldDefinitions, (key, fieldDefinition) => {
            // Field value sanity check
            fieldValues[key] = HashBrown.Helpers.ContentHelper.fieldSanityCheck(fieldValues[key], fieldDefinition);

            // Render the field actions container
            let $keyActions;

            return _.div({class: 'editor__field', 'data-key': key},
                // Render the label and icon
                _.div({class: 'editor__field__key', title: fieldDefinition.description || ''},
                    _.div({class: 'editor__field__key__label'}, fieldDefinition.label || key),
                    _.if(fieldDefinition.description,
                        _.div({class: 'editor__field__key__description'}, fieldDefinition.description)
                    ),
                    $keyActions = _.div({class: 'editor__field__key__actions'})
                ),

                // Render the field editor
                this.renderField(
                    // If the field definition is set to multilingual, pass value from object
                    fieldDefinition.multilingual ? fieldValues[key][window.language] : fieldValues[key],

                    // Pass the field definition
                    fieldDefinition,

                    // On change function
                    (newValue) => {
                        // If field definition is set to multilingual, assign flag and value onto object...
                        if(fieldDefinition.multilingual) {
                            fieldValues[key]._multilingual = true;
                            fieldValues[key][window.language] = newValue;

                        // ...if not, assign the value directly
                        } else {
                            fieldValues[key] = newValue;
                        }
                    },

                    // Pass the key actions container, so the field editor can populate it
                    $keyActions
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
    }

    /**
     * Renders the editor
     *
     * @param {Content} content
     * @param {ContentSchema} schema
     *
     * @return {Object} element
     */
    renderEditor(content, schema) {
        let activeTab = Crisp.Router.params.tab || schema.defaultTabId || 'meta';

        // Render editor
        return [
            _.div({class: 'editor__header'}, 
                _.each(schema.tabs, (tabId, tabName) => {
                    return _.button({class: 'editor__header__tab' + (tabId === activeTab ? ' active' : '')}, tabName)
                        .click(() => {
                            location.hash = '/content/' + Crisp.Router.params.id + '/' + tabId;

                            this.fetch();
                        });
                }),
                _.button({'data-id': 'meta', class: 'editor__header__tab' + ('meta' === activeTab ? ' active' : '')}, 'Meta')
                    .click(() => {
                        location.hash = '/content/' + Crisp.Router.params.id + '/meta';

                        this.fetch();
                    })
            ),
            _.div({class: 'editor__body'},
                // Render content properties
                _.each(schema.tabs, (tabId, tabName) => {
                    if(tabId !== activeTab) { return; }

                    return _.div({class: 'editor__body__tab active'},
                        this.renderFields(tabId, schema.fields.properties, content.properties)
                    );
                }),

                // Render meta properties
                _.if(activeTab === 'meta',
                    _.div({class: 'editor__body__tab' + ('meta' === activeTab ? 'active' : ''), 'data-id': 'meta'},
                        this.renderFields('meta', schema.fields, content),
                        this.renderFields('meta', schema.fields.properties, content.properties)
                    )
                )
            ).on('scroll', (e) => {
                this.onScroll(e);
            }),
            _.div({class: 'editor__footer'})
        ];
    }

    /**
     * Renders the action buttons
     */
    renderButtons() {
        let remoteUrl;
        let connectionId = this.model.getSettings('publishing').connectionId;
        let connection;

        // Construct the remote URL, if a Connection is set up for publishing
        let contentUrl = this.model.properties.url;

        if(connectionId) {
            connection = HashBrown.Helpers.ConnectionHelper.getConnectionByIdSync(connectionId);
                
            if(connection && connection.url && contentUrl) {
                // Language versioning
                if(contentUrl instanceof Object) {
                    contentUrl = contentUrl[window.language];
                }

                // Construct remote URL
                if(contentUrl && contentUrl !== '//') {
                    remoteUrl = connection.url + contentUrl;
                    remoteUrl = remoteUrl.replace(/\/\//g, '/').replace(':/', '://');

                } else {
                    contentUrl = null;
                
                }
            }
        }
            
        _.append($('.editor__footer').empty(),
            _.div({class: 'editor__footer__message'},
                _.do(() => {
                    if(!connection) {
                        return 'No Connection is assigned for publishing'   ;
                    }
                    
                    if(connection && !connection.url) {
                        return 'No remote URL is defined in the <a href="#/connections/' + connection.id + '">"' + connection.title + '"</a> Connection';
                    }
                    
                    if(connection && connection.url && !contentUrl) {
                        return 'Content without a URL may not be visible after publishing';
                    }
                })
            ),

            _.div({class: 'editor__footer__buttons'},
                // JSON editor
                _.button({class: 'widget widget--button condensed embedded'},
                    'Advanced'
                ).click(() => { this.onClickAdvanced(); }),

                // View remote
                _.if(this.model.isPublished && remoteUrl,
                    _.a({target: '_blank', href: remoteUrl, class: 'widget widget--button condensed embedded'}, 'View')
                ),

                _.if(!this.model.isLocked,
                    // Save & publish
                    _.div({class: 'widget widget-group'},
                        this.$saveBtn = _.button({class: 'widget widget--button'},
                            _.span({class: 'widget--button__text-default'}, 'Save'),
                            _.span({class: 'widget--button__text-working'}, 'Saving')
                        ).click(() => { this.onClickSave(); }),
                        _.if(connection,
                            _.span({class: 'widget widget--button widget-group__separator'}, '&'),
                            _.select({class: 'widget widget--select'},
                                _.option({value: 'publish'}, 'Publish'),
                                _.option({value: 'preview'}, 'Preview'),
                                _.if(this.model.isPublished, 
                                    _.option({value: 'unpublish'}, 'Unpublish')
                                ),
                                _.option({value: ''}, '(No action)')
                            ).val('publish')
                        )
                    )
                )
            )
        );
    }

    /**
     * Pre render
     */
    prerender() {
        // Make sure the model data is using the Content model
        if(this.model instanceof HashBrown.Models.Content === false) {
            this.model = new HashBrown.Models.Content(this.model);
        }
    }

    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'editor editor--content' + (this.model.isLocked ? ' locked' : '')});
    }

    /**
     * Post render
     */
    postrender() {
        // Fetch information
        let contentSchema;

        return HashBrown.Helpers.SchemaHelper.getSchemaWithParentFields(this.model.schemaId)
        .then((schema) => {
            contentSchema = schema;

            this.schema = contentSchema;

            this.$element.html(
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
