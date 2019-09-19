'use strict';

/**
 * The Content navbar pane
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class ContentPane extends HashBrown.View.Navigation.NavbarPane {
    static get route() { return '/content/'; }
    static get label() { return 'Content'; }
    static get icon() { return 'file'; }

    /**
     * Gets all items
     */
    async fetch() {
        // Build an icon cache
        let icons = {};

        for(let schema of await HashBrown.Service.SchemaService.getAllSchemas()) {
            if(!schema.icon) {
                schema = await HashBrown.Service.SchemaService.getSchemaById(schema.id, true);
            }

            icons[schema.id] = schema.icon;
        }

        // Get the items
        this.items = await HashBrown.Service.ContentService.getAllContent();

        // Apply the appropriate icon to each item
        for(let i in this.items) {
            this.items[i] = this.items[i].getObject();

            this.items[i].icon = icons[this.items[i].schemaId];
        }

        super.fetch();
    }
    
    /**
     * Event: Change parent
     */
    async onChangeDirectory(id, parentId) {
        if(parentId == '/') {
            parentId = '';
        }

        // Get the Content model
        let content = await HashBrown.Service.ContentService.getContentById(id);

        // API call to apply changes to Content parent
        content.parentId = parentId;
        content.sort = -1;
         
        try {
            await HashBrown.Service.ResourceService.set('content', id, content);

        } catch(e) {
            UI.errorModal(e);

        }
    }

    /**
     * Event: Change sort index
     */
    async onChangeSortIndex(contentId, otherId, parentId) {
        if(parentId == '/') { parentId = ''; }
        
        // API call to apply changes to Content parent
        await HashBrown.Service.ResourceService.query('post', 'content', 'insert', '?contentId=' + contentId + '&otherId=' + otherId + (parentId ? '&parentId=' + parentId : ''));
    }

    /**
     * Event: Click pull content
     */
    async onClickPullContent() {
        let id = $('.context-menu-target').data('id');

        await HashBrown.Service.ResourceService.pull('content', id);
    }
    
    /**
     * Event: Click push content
     */
    async onClickPushContent() {
        let id = $('.context-menu-target').data('id');

        await HashBrown.Service.ResourceService.push('content', id);
    }

    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */
    async onClickNewContent(parentId, asSibling) {
        try {
            let parentContent = null;
            let parentSchema = null;
            let allowedSchemas = null;

            // Try to get a parent schema if it exists to determine allowed child schemas
            if(parentId) {
                parentContent = await HashBrown.Service.ContentService.getContentById(parentId);
                parentSchema = await HashBrown.Service.SchemaService.getSchemaById(parentContent.schemaId);
            
                allowedSchemas = parentSchema.allowedChildSchemas;

                // If allowed child Schema were found, but none were provided, don't create the Content node
                if(allowedSchemas && allowedSchemas.length < 1) {
                    throw new Error('No child content schemas are allowed under this parent');
                }
            }
            
            let schemaId;
          
            // Instatiate a new Content Schema reference editor
            let schemaReference = new HashBrown.View.Editor.FieldEditor.ContentSchemaReferenceEditor({
                config: {
                    allowedSchemas: allowedSchemas,
                    parentSchema: parentSchema
                }
            });

            schemaReference.on('change', (newValue) => {
                schemaId = newValue;
            });

            schemaReference.pickFirstSchema();

            // Make the editor behave like a widget, since it's inside a widget group
            schemaReference.ready(() => {
                schemaReference.$element.addClass('widget');
            });

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
                       
                        let query = '?schemaId=' + schemaId;

                        // Append parent Content id to request URL
                        if(parentId) {
                            query += '&parentId=' + parentId;
                        }

                        // API call to create new Content node
                        let newContent = await HashBrown.Service.ResourceService.new(HashBrown.Entity.Resource.Content, 'content', query)
                        
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
    async onClickContentPublishing() {
        let id = $('.context-menu-target').data('id');

        let content = await HashBrown.Service.ContentService.getContentById(id);

        let modal = new HashBrown.Entity.View.Modal.ContentPublishingSettings({
            model: content
        });

        modal.on('change', async (newValue) => {
            if(newValue.governedBy) { return; }
           
            // Commit publishing settings to Content model
            content.settings.publishing = newValue;
   
            try {
                // API call to save the Content model
                await HashBrown.Service.ResourceService.set('content', content.id, content);
                
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
    async onClickRemoveContent(shouldUnpublish) {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
    
        let content = await HashBrown.Service.ContentService.getContentById(id);

        content.settingsSanityCheck('publishing');

        let shouldDeleteChildren = false;
        
        UI.confirmModal(
            'Remove',
            'Remove the content "' + name + '"?',
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label'}, 'Remove child Content too'),
                new HashBrown.Entity.View.Widget.Checkbox({
                    model: {
                        value: shouldDeleteChildren,
                        onchange: (newValue) => {
                            shouldDeleteChildren = newValue;
                        }
                    }
                }).element
            ),
            async () => {
                $element.parent().toggleClass('loading', true);

                await HashBrown.Service.RequestService.request('delete', 'content/' + id + '?removeChildren=' + shouldDeleteChildren)
                
                if(shouldUnpublish && content.getSettings('publishing').connectionId) {
                    await HashBrown.Service.RequestService.request('post', 'content/unpublish', content);
                }

                HashBrown.Service.EventService.trigger('resource');  
                            
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
    async onClickRename() {
        let id = $('.context-menu-target').data('id');
        let content = await HashBrown.Service.ContentService.getContentById(id);

        UI.messageModal(
            'Rename "' + content.getPropertyValue('title', HashBrown.Context.language) + '"', 
            _.div({class: 'widget-group'}, 
                _.label({class: 'widget widget--label'}, 'New name'),
                new HashBrown.Entity.View.Widget.Text({
                    model: {
                        value: content.getPropertyValue('title', HashBrown.Context.language), 
                        onchange: (newValue) => {
                            content.setPropertyValue('title', newValue, HashBrown.Context.language);
                        }
                    }
                }).element
            ),
            async () => {
                await HashBrown.Service.ContentService.setContentById(id, content);

                HashBrown.Service.EventService.trigger('resource');  

                // Update ContentEditor if needed
                let contentEditor = Crisp.View.get('ContentEditor');

                if(!contentEditor || contentEditor.model.id !== id) { return; }

                contentEditor.model = null;
                await contentEditor.fetch();
            }
        );
    }

    /**
     * Item context menu
     */
    getItemContextMenu(item) {
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

        return menu;
    }

    /**
     * Pane context menu
     */
    getPaneContextMenu() {
        return {
            'Content': '---',
            'New content': () => { this.onClickNewContent(); }
        };
    }

    /**
     * Hierarchy logic
     */
    hierarchy(item, queueItem) {
        // Set id data attributes
        queueItem.$element.attr('data-content-id', item.id);
        queueItem.parentDirAttr = {'data-content-id': item.parentId };
    }
}

module.exports = ContentPane;
