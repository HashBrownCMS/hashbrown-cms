'use strict';

/**
 * The editor view for Content objects
 *
 * @memberof HashBrown.Client.View.Editor
 */
class ContentEditor extends HashBrown.View.Editor.ResourceEditor {
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
            this.model = await HashBrown.Service.ContentService.getContentById(this.modelId);
            
            if(!this.model) { throw new Error('Content by id "' + this.modelId + '" was not found'); }

            this.schema = await HashBrown.Service.SchemaService.getSchemaById(this.model.schemaId, true);

            if(!this.schema) { throw new Error('Schema by id "' + this.model.schemaId + '" was not found'); }

            let publishingSettings = await this.model.getSettings('publishing');
           
            let connectionId = publishingSettings.connectionId

            if(publishingSettings.governedBy) {
                let governingContent = await HashBrown.Service.ContentService.getContentById(publishingSettings.governedBy);
                let governingPublishingSettings = await governingContent.getSettings('publishing');

                connectionId = governingPublishingSettings.connectionId;
            }

            if(connectionId) {
                this.connection = await HashBrown.Service.ConnectionService.getConnectionById(connectionId);
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
            
            await HashBrown.Service.ContentService.setContentById(this.model.id, this.model);

            let isPublished = this.element.querySelector('.editor__footer__buttons input[name="published"]').checked;

            // Unpublish
            if(this.connection && !isPublished) {
                await HashBrown.Service.RequestService.request('post', 'content/unpublish', this.model);

            // Publish
            } else if(this.connection && isPublished) {
                await HashBrown.Service.RequestService.request('post', 'content/publish', this.model);

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

        return HashBrown.View.Editor.FieldEditor[editorId];
    }

    /**
     * Renders a field
     *
     * @param {String} key
     * @param {Object} value
     * @param {Object} definition
     * @param {HTMLElement} placeholder
     */
    async renderField(key, value, definition, $placeholder) {
        checkParam(key, 'key', String, true);

        // On change function
        let onChange = (newValue) => {
            // If field definition is set to multilingual, assign flag and value onto object...
            if(definition.multilingual) {
                value = value || {};

                value._multilingual = true;
                value[HashBrown.Context.language] = newValue;

            // ...if not, assign the value directly
            } else {
                value = newValue;
            }

            this.model.properties[key] = value;
        };
        
        // Get schema
        let schema = await HashBrown.Service.SchemaService.getSchemaById(definition.schemaId, true);

        if(!schema) { throw new Error('FieldSchema ' + definition.schemaId + ' not found'); }

        // Get the config
        let config;

        if(!HashBrown.Service.ContentService.isFieldDefinitionEmpty(definition.config)) {
            config = definition.config;
        } else if(!HashBrown.Service.ContentService.isFieldDefinitionEmpty(schema.config)) {
            config = schema.config;
        } else {
            config = {};
        }

        // Structs are always collapsed by default
        if(config.isCollapsed === undefined) {
            config.isCollapsed = !!config.struct;
        }
        
        // Instantiate field editor
        let fieldEditor = ContentEditor.getFieldEditor(schema.editorId);
          
        if(!fieldEditor) { throw new Error('No field editor by id "' + schema.editorId + '" found in schema "' + definition.schemaId +  '"'); }
        
        let fieldEditorInstance = new fieldEditor({
            value: definition.multilingual ? value[HashBrown.Context.language] : value,
            disabled: definition.disabled || false,
            config: config,
            description: definition.description || '',
            schema: schema,
            multilingual: definition.multilingual === true,
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
                label: definition.label || key,
                key: key,
                isCollapsible: config.isCollapsed,
                isCollapsed: config.isCollapsed,
                description: definition.description,
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
     * @param {Object} values The set of field values to inject into the field editor
     * @param {Object} definitions The set of field definitions to render
     *
     * @returns {Array} A list of HTMLElements to render
     */
    renderTabContent(tabId, values, definitions) {
        let tabDefinitions = {};

        // Map out field definitions to render
        // This is necessary because we're only rendering the fields for the specified tab
        for(let key in definitions) {
            let definition = definitions[key];

            let noTabAssigned = !this.schema.tabs[definition.tabId];
            let isMetaTab = tabId === 'meta';
            let thisTabAssigned = definition.tabId === tabId;

            // Don't include "properties" field, if this is the meta tab
            if(isMetaTab && key === 'properties') {
                continue;
            }

            if((noTabAssigned && isMetaTab) || thisTabAssigned) {
                tabDefinitions[key] = definition;
            }
        }

        // Render all fields
        return _.each(tabDefinitions, (key, definition) => {
            let $placeholder = _.div({class: 'editor__field loading'});
            
            // Field value sanity check
            values[key] = HashBrown.Service.ContentService.fieldSanityCheck(values[key], definition);
            
            this.renderField(key, values[key], definition, $placeholder);

            return $placeholder;
        });
    }

    /**
     * Gets the currently active tab
     *
     * @return {String} Tab
     */
    getActiveTab() {
        return Crisp.Router.params.tab || this.schema.defaultTabId || 'meta';
    }

    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'editor editor--content' + (this.model.isLocked ? ' locked' : '')},
            // Header
            _.div({class: 'editor__header'}, 
                _.each(this.schema.tabs, (tabId, tabName) => {
                    return _.button({class: 'editor__header__tab' + (tabId === this.getActiveTab() ? ' active' : '')}, tabName)
                        .click(() => {
                            location.hash = '/content/' + this.model.id + '/' + tabId;

                            this.fetch(this.model.id);
                        });
                }),
                _.button({'data-id': 'meta', class: 'editor__header__tab' + ('meta' === this.getActiveTab() ? ' active' : '')}, 'Meta')
                    .click(() => {
                        location.hash = '/content/' + this.model.id + '/meta';

                        this.fetch(this.model.id);
                    })
            ),

            // Body
            _.div({class: 'editor__body'},
                // Render content properties
                _.each(this.schema.tabs, (tabId, tabName) => {
                    if(tabId !== this.getActiveTab()) { return; }

                    return _.div({class: 'editor__body__tab active'},
                        this.renderTabContent(tabId, this.model.properties, this.schema.fields.properties)
                    );
                }),

                // Render meta properties
                _.if(this.getActiveTab() === 'meta',
                    _.div({class: 'editor__body__tab ' + ('meta' === this.getActiveTab() ? 'active' : ''), 'data-id': 'meta'},
                        this.renderTabContent('meta', this.model, this.schema.fields),
                        this.renderTabContent('meta', this.model.properties, this.schema.fields.properties)
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
                                _.label({class: 'widget widget--checkbox large label'},
                                    _.span({class: 'widget--checkbox__label'}, 'Published'),
                                    _.input({class: 'widget--checkbox__input', name: 'published', type: 'checkbox', checked: this.model.isPublished}),
                                    _.div({class: 'widget--checkbox__indicator'})
                                )
                            )
                        )
                    )
                )
            )
        );
    }
}

module.exports = ContentEditor;
