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

        // Reload UI
        HashBrown.Views.Navigation.NavbarMain.reload();
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

        // Reload UI
        HashBrown.Views.Navigation.NavbarMain.reload();
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
    static onClickNewContent(parentId, asSibling) {
        // Try to get a parent Schema if it exists
        return function getParentSchema() {
            if(parentId) {
                return HashBrown.Helpers.ContentHelper.getContentById(parentId)
                .then((parentContent) => {
                    return HashBrown.Helpers.SchemaHelper.getSchemaById(parentContent.schemaId);
                });
            } else {
                return Promise.resolve();
            }
        }()

        // Parent Schema logic resolved, move on
        .then((parentSchema) => {
            let allowedSchemas = parentSchema ? parentSchema.allowedChildSchemas : null;

            // If allowed child Schemas were found, but none were provided, don't create the Content node
            if(allowedSchemas && allowedSchemas.length < 1) {
                return Promise.reject(new Error('No child content schemas are allowed under this parent'));
            
            // Some child Schemas were provided, or no restrictions were defined
            } else {
                let schemaId;
                let sortIndex = HashBrown.Helpers.ContentHelper.getNewSortIndex(parentId);
              
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
                        if(!schemaId) { return false; }
                       
                        let apiUrl = 'content/new/' + schemaId + '?sort=' + sortIndex;

                        // Append parent Content id to request URL
                        if(parentId) {
                            apiUrl += '&parent=' + parentId;
                        }

                        // API call to create new Content node
                        let newContent = await HashBrown.Helpers.RequestHelper.request('post', apiUrl)
                        
                        // Upon success, reload resource and UI elements    
                        await HashBrown.Helpers.ResourceHelper.reloadResource('content');
                            
                        HashBrown.Views.Navigation.NavbarMain.reload();
                            
                        location.hash = '/content/' + newContent.id;
                    }
                );
            }
        })
        .catch(UI.errorModal);
    }

    /**
     * Render Content publishing modal
     *
     * @param {Content} content
     */
    static renderPublishingModal(content) {
        let modal = new HashBrown.Views.Modals.PublishingSettingsModal({
            model: content
        });

        modal.on('change', (newValue) => {
            if(newValue.governedBy) { return; }
           
            // Commit publishing settings to Content model
            content.settings.publishing = newValue;
    
            // API call to save the Content model
            HashBrown.Helpers.RequestHelper.request('post', 'content/' + content.id, content)
            
            // Upon success, reload the UI    
            .then(() => {
                HashBrown.Views.Navigation.NavbarMain.reload();

                if(Crisp.Router.params.id == content.id) {
                    let contentEditor = Crisp.View.get('ContentEditor');

                    contentEditor.model = content;
                    return contentEditor.fetch();
                
                } else {
                    return Promise.resolve();

                }
            })
            .catch(UI.errorModal);
        });
    }

    /**
     * Event: Click Content settings
     */
    static onClickContentPublishing() {
        let id = $('.context-menu-target').data('id');

        // Get Content model
        let content = HashBrown.Helpers.ContentHelper.getContentByIdSync(id);

        this.renderPublishingModal(content);
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

                HashBrown.Views.Navigation.NavbarMain.reload();
                            
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
    static onClickRename() {
        let id = $('.context-menu-target').data('id');
        let content = HashBrown.Helpers.ContentHelper.getContentByIdSync(id);

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

                HashBrown.Views.Navigation.NavbarMain.reload();

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
        return await HashBrown.Helpers.ContentHelper.getAllContent();
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
