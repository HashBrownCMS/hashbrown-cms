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
            UI.error(e);

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
    async onClickPullContent(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.pull('content', id);
    }
    
    /**
     * Event: Click push content
     */
    async onClickPushContent(target) {
        let id = target.dataset.id;

        await HashBrown.Service.ResourceService.push('content', id);
    }

    /**
     * Event: Click new content
     */
    async onClickNewContent(target) {
        new HashBrown.Entity.View.Modal.CreateContent({
            model: {
                parentId: target ? target.dataset.id : null
            }
        });
    }

    /**
     * Event: Click Content settings
     */
    async onClickContentPublishing(target) {
        let id = target.dataset.id;

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
                UI.error(e);
            
            }
        });
    }

    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */
    async onClickRemoveContent(target, shouldUnpublish) {
        let id = target.dataset.id;
  
        new HashBrown.Entity.View.Modal.RemoveContent({
            model: {
                contentId: id,
                unpublish: shouldUnpublish
            }
        });
    }

    /**
     * Event: Click rename
     */
    async onClickRename(target) {
        let id = target.dataset.id;
        let content = await HashBrown.Service.ContentService.getContentById(id);

        UI.notify(
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
        
        if(item.isLocked && !item.sync.isRemote) { isSyncEnabled = false; }
        
        menu['This content'] = '---';
        
        menu['Rename'] = (target) => { this.onClickRename(target); };
        menu['New child content'] = (target) => { this.onClickNewContent(target); };
                        
        if(!item.sync.isRemote && !item.isLocked) {
            menu['Move'] = (target) => { this.onClickMoveItem(target); };
        }

        if(!item.sync.hasRemote && !item.isLocked) {
            menu['Remove'] = (target) => { this.onClickRemoveContent(target, true); };
        }
        
        menu['Copy id'] = (target) => { this.onClickCopyItemId(target); };
        
        if(!item.sync.isRemote && !item.isLocked) {
            menu['Settings'] = '---';
            menu['Publishing'] = (target) => { this.onClickContentPublishing(target); };
        }
        
        if(isSyncEnabled) {
            menu['Sync'] = '---';
            
            if(!item.sync.isRemote) {
                menu['Push to remote'] = (target) => { this.onClickPushContent(target); };
            }

            if(item.sync.hasRemote) {
                menu['Remove local copy'] = (target) => { this.onClickRemoveContent(target); };
            }
            
            if(item.sync.isRemote) {
                menu['Pull from remote'] = (target) => { this.onClickPullContent(target); };
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
}

module.exports = ContentPane;
