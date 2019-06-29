'use strict';

/**
 * The editor view for Content objects
 *
 * @memberof HashBrown.Client.Views.Editors
 */
class ContentEditor extends HashBrown.Views.Editors.Editor {
    constructor(id) {
        super({ modelId: id });

        this.isDirty = false;
    }

    /**
     * Fetches the model
     *
     * @param {String} id
     */
    async fetch() {
        try {
            this.model = await HashBrown.Helpers.ContentHelper.getContentById(this.modelId);
            
            if(!this.model) { throw new Error('Content by id "' + this.modelId + '" was not found'); }
            
            this.schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(this.model.schemaId, true);
            
            if(!this.schema) { throw new Error('Schema by id "' + this.model.schemaId + '" was not found'); }
            
            let publishingSettings = await this.model.getSettings('publishing');
           
            let connectionId = publishingSettings.connectionId

            if(publishingSettings.governedBy) {
                let governingContent = await HashBrown.Helpers.ContentHelper.getContentById(publishingSettings.governedBy);
                let governingPublishingSettings = await governingContent.getSettings('publishing');

                connectionId = governingPublishingSettings.connectionId;
            }

            if(connectionId) {
                this.connection = await HashBrown.Helpers.ConnectionHelper.getConnectionById(connectionId);
            } else {
                this.connection = null;
            }

            await super.fetch();

        } catch(e) {
            UI.errorModal(e);

        }
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
     * Event: Click save
     */
    async onClickSave() {
        try {
            this.$saveBtn.toggleClass('working', true);
            
            await HashBrown.Helpers.ContentHelper.setContentById(this.model.id, this.model);

            let saveAction = this.$element.find('.editor__footer__buttons select').val();

            // Unpublish
            if(this.connection && saveAction === 'unpublish') {
                await HashBrown.Helpers.RequestHelper.request('post', 'content/unpublish', this.model);

            // Publish
            } else if(this.connection && saveAction === 'publish') {
                await HashBrown.Helpers.RequestHelper.request('post', 'content/publish', this.model);

            }
            
            this.isDirty = false;

        } catch(e) {
            UI.errorModal(e);

        } finally {
            this.$saveBtn.toggleClass('working', false);

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

        return HashBrown.Views.Editors.FieldEditors[editorId];
    }

    /**
     * Renders a field
     *
     * @param {String} key
     * @param {Object} fieldDefinition
     * @param {Object} fieldValue
     * @param {HTMLElement} placeholder
     */
    async renderField(key, fieldDefinition, fieldValue, $placeholder) {
        checkParam(key, 'key', String, true);

        // On change function
        let onChange = (newValue) => {
            // If field definition is set to multilingual, assign flag and value onto object...
            if(fieldDefinition.multilingual) {
                fieldValues[key]._multilingual = true;
                fieldValues[key][HashBrown.Context.language] = newValue;

            // ...if not, assign the value directly
            } else {
                fieldValues[key] = newValue;
            }
        };
        
        // Get schema
        let compiledSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(fieldDefinition.schemaId);

        if(!compiledSchema) { throw new Error('FieldSchema ' + fieldDefinition.schemaId + ' not found'); }

        // Get the config
        let config;

        if(!HashBrown.Helpers.ContentHelper.isFieldDefinitionEmpty(fieldDefinition.config)) {
            config = fieldDefinition.config;
        } else if(!HashBrown.Helpers.ContentHelper.isFieldDefinitionEmpty(compiledSchema.config)) {
            config = compiledSchema.config;
        } else {
            config = {};
        }

        // Structs are always collapsed by default
        if(config.isCollapsed === undefined) {
            config.isCollapsed = !!config.struct;
        }
        
        // Instantiate field editor
        let fieldEditor = ContentEditor.getFieldEditor(compiledSchema.editorId);
          
        if(!fieldEditor) { throw new Error('No field editor by id "' + compiledSchema.editorId + '" found in schema "' + fieldDefinition.schemaId +  '"'); }
        
        let fieldEditorInstance = new fieldEditor({
            value: fieldValue,
            disabled: fieldDefinition.disabled || false,
            config: config,
            description: fieldDefinition.description || '',
            schema: compiledSchema,
            multilingual: fieldDefinition.multilingual === true,
            className: 'editor__field__value'
        });

        fieldEditorInstance.on('change', (newValue) => {
            if(this.model.isLocked) { return; }
            
            this.isDirty = true;

            onChange(newValue);
        });

        fieldEditorInstance.on('silentchange', (newValue) => {
            if(this.model.isLocked) { return; }
            
            onChange(newValue);
        });
       
        let $field = this.field(
            {
                label: fieldDefinition.label || key,
                key: key,
                isCollapsible: config.isCollapsed,
                isCollapsed: config.isCollapsed,
                description: fieldDefinition.description,
                actions: fieldEditorInstance.getKeyActions()
            },
            fieldEditorInstance 
        );

        $placeholder.replaceWith($field);
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
    renderTabContent(tabId, fieldDefinitions, fieldValues) {
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
            let $placeholder = _.div({class: 'editor__field loading'});
            
            // Field value sanity check
            fieldValues[key] = HashBrown.Helpers.ContentHelper.fieldSanityCheck(fieldValues[key], fieldDefinition);
            
            // If the field definition is set to multilingual, pass value from object
            let fieldValue = fieldDefinition.multilingual ? fieldValues[key][HashBrown.Context.language] : fieldValues[key];
        
            this.renderField(key, fieldDefinition, fieldValue, $placeholder);

            return $placeholder;
        });
    }

    /**
     * Render this editor
     */
    template() {
        let activeTab = Crisp.Router.params.tab || this.schema.defaultTabId || 'meta';

        return _.div({class: 'editor editor--content' + (this.model.isLocked ? ' locked' : '')},
            // Header
            _.div({class: 'editor__header'}, 
                _.each(this.schema.tabs, (tabId, tabName) => {
                    return _.button({class: 'editor__header__tab' + (tabId === activeTab ? ' active' : '')}, tabName)
                        .click(() => {
                            location.hash = '/content/' + this.model.id + '/' + tabId;

                            this.fetch(this.model.id);
                        });
                }),
                _.button({'data-id': 'meta', class: 'editor__header__tab' + ('meta' === activeTab ? ' active' : '')}, 'Meta')
                    .click(() => {
                        location.hash = '/content/' + this.model.id + '/meta';

                        this.fetch(this.model.id);
                    })
            ),

            // Body
            _.div({class: 'editor__body'},
                // Render content properties
                _.each(this.schema.tabs, (tabId, tabName) => {
                    if(tabId !== activeTab) { return; }

                    return _.div({class: 'editor__body__tab active'},
                        this.renderTabContent(tabId, this.schema.fields.properties, this.model.properties)
                    );
                }),

                // Render meta properties
                _.if(activeTab === 'meta',
                    _.div({class: 'editor__body__tab' + ('meta' === activeTab ? 'active' : ''), 'data-id': 'meta'},
                        this.renderTabContent('meta', this.schema.fields, this.model),
                        this.renderTabContent('meta', this.schema.fields.properties, this.model.properties)
                    )
                )
            ).on('scroll', (e) => {
                this.onScroll(e);
            }),

            // Footer actions
            _.div({class: 'editor__footer'},
                _.div({class: 'editor__footer__message'},
                    _.do(() => {
                        if(!this.connection) {
                            return 'No Connection is assigned for publishing';
                        }
                        
                        if(this.connection && !this.connection.url) {
                            return 'No remote URL is defined in the <a href="#/connections/' + this.connection.id + '">"' + this.connection.title + '"</a> Connection';
                        }
                        
                        if(this.connection && this.connection.url && !this.model.properties.url) {
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
                    _.do(() => {
                        if(!this.connection || !this.model.isPublished || !this.connection.url || !this.model.url) { return; }
                        
                        return _.a({target: '_blank', href: this.connection.getUrl(this.model.url), class: 'widget widget--button condensed embedded'}, 'View');
                    }),

                    _.if(!this.model.isLocked,
                        // Save & publish
                        _.div({class: 'widget widget-group'},
                            this.$saveBtn = _.button({class: 'widget widget--button'},
                                _.span({class: 'widget--button__text-default'}, 'Save'),
                                _.span({class: 'widget--button__text-working'}, 'Saving')
                            ).click(() => { this.onClickSave(); }),
                            _.if(this.connection,
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
            )
        );
    }
}

module.exports = ContentEditor;
