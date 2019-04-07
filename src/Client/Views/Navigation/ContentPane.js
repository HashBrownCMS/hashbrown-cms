'use strict';

/**
 * The Content navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class ContentPane extends HashBrown.Views.Navigation.NavbarPane {
    static get route() { return '/content/'; }
    static get label() { return 'Content'; }
    static get icon() { return 'file'; }
    
    /**
     * Event: Change parent
     */
    static async onChangeDirectory(id, parentId) {
        if(parentId == '/') {
            parentId = '';
        }

        // Get the Content model
        let content = await HashBrown.Helpers.ContentHelper.getContentById(id);

        // API call to apply changes to Content parent
        content.parentId = parentId;
         
        await HashBrown.Helpers.ResourceHelper.set('content', id, content);
    }

    /**
     * Event: Change sort index
     */
    static async onChangeSortIndex(id, newIndex, parentId) {
        if(parentId == '/') {
            parentId = '';
        }
        
        // Get the Content model
        let content = await HashBrown.Helpers.ContentHelper.getContentById(id);

        // API call to apply changes to Content parent
        content.sort = newIndex;
        content.parentId = parentId;
         
        await HashBrown.Helpers.ResourceHelper.set('content', id, content);
    }

    /**
     * Event: Click pull content
     */
    static async onClickPullContent() {
        let contentEditor = Crisp.View.get('ContentEditor');
        let pullId = $('.context-menu-target').data('id');

        // API call to pull the Content by id
        await HashBrown.Helpers.ResourceHelper.pull('content', pullId);
        
        location.hash = '/content/' + pullId;
    
        let editor = Crisp.View.get('ContentEditor');

        if(editor && editor.model && editor.model.id == pullId) {
            editor.model = null;
            editor.fetch();
        }
    }
    
    /**
     * Event: Click push content
     */
    static async onClickPushContent() {
		let $element = $('.context-menu-target');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Content by id
        await HashBrown.Helpers.ResourceHelper.push('content', pushId);
    }

    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */
    static async onClickNewContent(parentId, asSibling) {
        try {
            let parentContent = null;
            let parentSchema = null;
            let allowedSchemas = null;

            // Try to get a parent schema if it exists to determine allowed child schemas
            if(parentId) {
                parentContent = await HashBrown.Helpers.ContentHelper.getContentById(parentId);
                parentSchema = await HashBrown.Helpers.SchemaHelper.getSchemaById(parentContent.schemaId);
            
                allowedSchemas = parentSchema.allowedChildSchemas;

                // If allowed child Schemas were found, but none were provided, don't create the Content node
                if(allowedSchemas && allowedSchemas.length < 1) {
                    throw new Error('No child content schemas are allowed under this parent');
                }
            }
            
            let schemaId;
            let sortIndex = await HashBrown.Helpers.ContentHelper.getNewSortIndex(parentId);
          
            // Instatiate a new Content Schema reference editor
            let schemaReference = new HashBrown.Views.Editors.FieldEditors.ContentSchemaReferenceEditor({
                config: {
                    allowedSchemas: allowedSchemas,
                    parentSchema: parentSchema
                }
            });

            schemaReference.on('change', (newValue) => {
                schemaId = newValue;
            });

            schemaReference.pickFirstSchema();

            schemaReference.$element.addClass('widget');

            // Render the confirmation modal
            UI.confirmModal(
                'OK',
                'Create new content',
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'},'Schema'),
                    schemaReference.$element
                ),

                // Event fired when clicking "OK"
                async () => {
                    try {
                        if(!schemaId) { return false; }
                       
                        let query = '?schemaId=' + schemaId + '&sort=' + sortIndex;

                        // Append parent Content id to request URL
                        if(parentId) {
                            apiUrl += '&parentId=' + parentId;
                        }

                        // API call to create new Content node
                        let newContent = await HashBrown.Helpers.ResourceHelper.new(HashBrown.Models.Content, 'content', query)
                        
                        location.hash = '/content/' + newContent.id;

                    } catch(e) {
                        UI.errorModal(e);

                    }
                }
            );
        
        } catch(e) {
            UI.errorModal(e);
        
        }
    }

    /**
     * Event: Click Content settings
     */
    static async onClickContentPublishing() {
        let id = $('.context-menu-target').data('id');

        let content = await HashBrown.Helpers.ContentHelper.getContentById(id);

        let modal = new HashBrown.Views.Modals.PublishingSettingsModal({
            model: content
        });

        modal.on('change', async (newValue) => {
            if(newValue.governedBy) { return; }
           
            // Commit publishing settings to Content model
            content.settings.publishing = newValue;
   
            try {
                // API call to save the Content model
                await HashBrown.Helpers.ResourceHelper.set('content', content.id, content);
                
                // Upon success, reload the UI    
                let contentEditor = Crisp.View.get('ContentEditor');
                
                if(contentEditor && contentEditor.modelId == content.id) {
                    contentEditor.model = content;
                    
                    await contentEditor.fetch();
                }

            } catch(e) {
                UI.errorModal(e);
            
            }
        });
    }

    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */
    static async onClickRemoveContent(shouldUnpublish) {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
    
        let content = await HashBrown.Helpers.ContentHelper.getContentById(id);

        content.settingsSanityCheck('publishing');

        let shouldDeleteChildren = false;
        
        UI.confirmModal(
            'Remove',
            'Remove the content "' + name + '"?',
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Remove child Content too'),
                new HashBrown.Views.Widgets.Input({
                    value: shouldDeleteChildren,
                    type: 'checkbox',
                    onChange: (newValue) => {
                        shouldDeleteChildren = newValue;
                    }
                }).$element
            ),
            async () => {
                $element.parent().toggleClass('loading', true);

                await HashBrown.Helpers.RequestHelper.request('delete', 'content/' + id + '?removeChildren=' + shouldDeleteChildren)
                
                if(shouldUnpublish && content.getSettings('publishing').connectionId) {
                    await HashBrown.Helpers.RequestHelper.request('post', 'content/unpublish', content);
                }

                await HashBrown.Helpers.ResourceHelper.reloadResource('content');
                            
                let contentEditor = Crisp.View.get('ContentEditor');
                   
                // Change the ContentEditor view if it was displaying the deleted content
                if(contentEditor && contentEditor.model && contentEditor.model.id == id) {
                    // The Content was actually deleted
                    if(shouldUnpublish) {
                        location.hash = '/content/';
                    
                    // The Content still has a synced remote
                    } else {
                        contentEditor.model = null;
                        contentEditor.fetch();

                    }
                }
                
                $element.parent().toggleClass('loading', false);
            }
        );
    }

    /**
     * Event: Click rename
     */
    static async onClickRename() {
        let id = $('.context-menu-target').data('id');
        let content = await HashBrown.Helpers.ContentHelper.getContentById(id);

        UI.messageModal(
            'Rename "' + content.getPropertyValue('title', HashBrown.Context.language) + '"', 
            _.div({class: 'widget-group'}, 
                _.label({class: 'widget widget--label'}, 'New name'),
                new HashBrown.Views.Widgets.Input({
                    value: content.getPropertyValue('title', HashBrown.Context.language), 
                    onChange: (newValue) => {
                        content.setPropertyValue('title', newValue, HashBrown.Context.language);
                    }
                })
            ),
            async () => {
                await HashBrown.Helpers.ContentHelper.setContentById(id, content);

                await HashBrown.Helpers.ResourceHelper.reloadResource('content');

                // Update ContentEditor if needed
                let contentEditor = Crisp.View.get('ContentEditor');

                if(!contentEditor || contentEditor.model.id !== id) { return; }

                contentEditor.model = null;
                await contentEditor.fetch();
            }
        );
    }

    /**
     * Gets all items
     *
     * @returns {Promise} Items
     */
    static async getItems() {
        // Build an icon cache
        let icons = {};

        for(let schema of await HashBrown.Helpers.SchemaHelper.getAllSchemas()) {
            if(!schema.icon) {
                schema = await HashBrown.Helpers.SchemaHelper.getSchemaById(schema.id, true);
            }

            icons[schema.id] = schema.icon;
        }

        // Get the items
        let items = await HashBrown.Helpers.ContentHelper.getAllContent();

        // Apply the appropriate icon to each item
        for(let i in items) {
            items[i] = items[i].getObject();

            items[i].icon = icons[items[i].schemaId];
        }

        return items;
    }

    /**
     * Item context menu
     */
    static getItemContextMenu(item) {
        let menu = {};
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;
        
        menu['This content'] = '---';
        
        menu['Open in new tab'] = () => { this.onClickOpenInNewTab(); };
        
        menu['Rename'] = () => { this.onClickRename(); };

        menu['New child content'] = () => {
            this.onClickNewContent($('.context-menu-target').data('id'));
        };
                        
        if(!item.sync.isRemote && !item.isLocked) {
            menu['Move'] = () => { this.onClickMoveItem(); };
        }

        if(!item.sync.hasRemote && !item.isLocked) {
            menu['Remove'] = () => { this.onClickRemoveContent(true); };
        }
        
        menu['Copy id'] = () => { this.onClickCopyItemId(); };
        
        if(!item.sync.isRemote && !item.isLocked) {
            menu['Settings'] = '---';
            menu['Publishing'] = () => { this.onClickContentPublishing(); };
        }
        
        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }
       
        if(isSyncEnabled) {
            menu['Sync'] = '---';
            
            if(!item.sync.isRemote) {
                menu['Push to remote'] = () => { this.onClickPushContent(); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = () => { this.onClickRemoveContent(); };
            }
            
            if(item.sync.isRemote) {
                menu['Pull from remote'] = () => { this.onClickPullContent(); };
            }
        }

        menu['General'] = '---';
        menu['New content'] = () => { this.onClickNewContent(); };  
        menu['Refresh'] = () => { this.onClickRefreshResource('content'); };

        return menu;
    }

    /**
     * Pane context menu
     */
    static getPaneContextMenu() {
        return {
            'Content': '---',
            'New content': () => { this.onClickNewContent(); },
            'Refresh': () => { this.onClickRefreshResource('content'); }
        };
    }

    /**
     * Hierarchy logic
     */
    static hierarchy(item, queueItem) {
        // Set id data attributes
        queueItem.$element.attr('data-content-id', item.id);
        queueItem.parentDirAttr = {'data-content-id': item.parentId };
    }
}

module.exports = ContentPane;
