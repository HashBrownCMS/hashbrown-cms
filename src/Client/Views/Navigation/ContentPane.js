'use strict';

const ProjectHelper = require('Client/Helpers/ProjectHelper');
const ContentHelper = require('Client/Helpers/ContentHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');
const SchemaHelper = require('Client/Helpers/SchemaHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Content navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class ContentPane extends NavbarPane {
    /**
     * Event: Change parent
     */
    static onChangeDirectory(id, parentId) {
        if(parentId == '/') {
            parentId = '';
        }

        // Get the Content model
        ContentHelper.getContentById(id)

        // API call to apply changes to Content parent
        .then((content) => {
            content.parentId = parentId;
         
            return RequestHelper.request('post', 'content/' + id, content);
        })

        // Reload all Content models
        .then(() => {
            return RequestHelper.reloadResource('content');
        })

        // Reload UI
        .then(() => {
            NavbarMain.reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Change sort index
     */
    static onChangeSortIndex(id, newIndex, parentId) {
        if(parentId == '/') {
            parentId = '';
        }
        
        // Get the Content model
        ContentHelper.getContentById(id)

        // API call to apply changes to Content parent
        .then((content) => {
            content.sort = newIndex;
            content.parentId = parentId;
         
            return RequestHelper.request('post', 'content/' + id, content);
        })

        // Reload all Content models
        .then(() => {
            return RequestHelper.reloadResource('content');
        })

        // Reload UI
        .then(() => {
            NavbarMain.reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Click pull content
     */
    static onClickPullContent() {
        let contentEditor = ViewHelper.get('ContentEditor');
        let pullId = $('.cr-context-menu__target-element').data('id');

        // API call to pull the Content by id
        RequestHelper.request('post', 'content/pull/' + pullId, {})
        
        // Upon success, reload all Content models    
        .then(() => {
            return RequestHelper.reloadResource('content');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();

			location.hash = '/content/' + pullId;
		
			let editor = ViewHelper.get('ContentEditor');

			if(editor && editor.model && editor.model.id == pullId) {
                editor.model = null;
				editor.fetch();
			}
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push content
     */
    static onClickPushContent() {
		let $element = $('.cr-context-menu__target-element');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Content by id
        RequestHelper.request('post', 'content/push/' + pushId)

        // Upon success, reload all Content models
        .then(() => {
            return RequestHelper.reloadResource('content');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
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
                return ContentHelper.getContentById(parentId)
                .then((parentContent) => {
                    return SchemaHelper.getSchemaById(parentContent.schemaId);
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
                let sortIndex = ContentHelper.getNewSortIndex(parentId);
              
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

                // Render the confirmation modal
                UI.confirmModal(
                    'OK',
                    'Create new content',
                    _.div({},
                        _.p('Please pick a schema'),
                        schemaReference.$element
                    ),

                    // Event fired when clicking "OK"
                    () => {
                        if(!schemaId) { return false; }
                       
                        let apiUrl = 'content/new/' + schemaId + '?sort=' + sortIndex;

                        let newContent;

                        // Append parent Content id to request URL
                        if(parentId) {
                            apiUrl += '&parent=' + parentId;
                        }

                        // API call to create new Content node
                        RequestHelper.request('post', apiUrl)
                        
                        // Upon success, reload resource and UI elements    
                        .then((result) => {
                            newContent = result;

                            return RequestHelper.reloadResource('content');
                        })
                        .then(() => {
                            NavbarMain.reload();
                            
                            location.hash = '/content/' + newContent.id;
                        })
                        .catch(UI.errorModal);
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
        let publishing = content.getSettings('publishing');
        publishing = JSON.parse(JSON.stringify(publishing));

        // Event on clicking OK
        function onSubmit() {
            if(publishing.governedBy) { return; }
           
            // Commit publishing settings to Content model
            content.settings.publishing = publishing;
    
            // API call to save the Content model
            RequestHelper.request('post', 'content/' + content.id, content)
            
            // Upon success, reload the UI    
            .then(() => {
                NavbarMain.reload();

                if(Router.params.id == content.id) {
                    let contentEditor = ViewHelper.get('ContentEditor');

                    contentEditor.model = content;
                    return contentEditor.render();
                
                } else {
                    return Promise.resolve();

                }
            })
            .catch(UI.errorModal);
        }
        
        let modal = new HashBrown.Views.Modals.MessageModal({
            model: {
                title: 'Publishing settings for "' + content.prop('title', window.language) + '"'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default'
                },
                {
                    label: 'OK',
                    class: 'btn-primary',
                    callback: () => {
                        onSubmit();
                    }
                }
            ],
            renderBody: () => {
                if(publishing.governedBy) {
                    let governor = ContentHelper.getContentByIdSync(publishing.governedBy);

                    return _.div({class: 'settings-publishing'},
                        _.p('(Settings inherited from <a href="#/content/' + governor.id + '">' + governor.prop('title', window.language) + '</a>)')
                    );
                
                } else {
                    return _.div({class: 'settings-publishing'},
                        // Apply to children switch
                        _.div({class: 'input-group'},      
                            _.span('Apply to children'),
                            _.div({class: 'input-group-addon'},
                                UI.inputSwitch(publishing.applyToChildren === true, (newValue) => {
                                    publishing.applyToChildren = newValue;   
                                })
                            )
                        ),

                        // Connection picker
                        _.div({class: 'input-group'},      
                            _.span('Connection'),
                            _.div({class: 'input-group-addon'},
                                UI.inputDropdown(publishing.connectionId, resources.connections, (newValue) => {
                                    publishing.connectionId = newValue;
                                })
                            )
                        )
                    );
                }
            }
        });

        modal.$element.toggleClass('settings-modal content-settings-modal');
    }

    /**
     * Event: Click Content settings
     */
    static onClickContentPublishing() {
        let id = $('.cr-context-menu__target-element').data('id');

        // Get Content model
        let content = ContentHelper.getContentByIdSync(id);

        this.renderPublishingModal(content);
    }

    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */
    static onClickRemoveContent(shouldUnpublish) {
        let $element = $('.cr-context-menu__target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
    
        ContentHelper.getContentById(id)
        .then((content) => {
            content.settingsSanityCheck('publishing');

            function unpublishConnection() {
                return RequestHelper.request('post', 'content/unpublish', content)
                .then(() => {
                    return onSuccess();
                });
            }
            
            function onSuccess() {
                return RequestHelper.reloadResource('content')
                .then(() => {
                    NavbarMain.reload();
                            
                    let contentEditor = ViewHelper.get('ContentEditor');
                   
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

                    return Promise.resolve();
                });
            }

            let $deleteChildrenSwitch;
            UI.confirmModal(
                'Remove',
                'Remove the content "' + name + '"?',
                _.div({class: 'input-group'},      
                    _.span('Remove child content too'),
                    _.div({class: 'input-group-addon'},
                        $deleteChildrenSwitch = UI.inputSwitch(true)
                    )
                ),
                () => {
                    $element.parent().toggleClass('loading', true);

                    RequestHelper.request('delete', 'content/' + id + '?removeChildren=' + $deleteChildrenSwitch.data('checked'))
                    .then(() => {
                        if(shouldUnpublish && content.getSettings('publishing').connectionId) {
                            return unpublishConnection();
                        } else {
                            return onSuccess();
                        }
                    })
                    .catch((e) => {
                        $element.parent().toggleClass('loading', false);
                        UI.errorModal(e);
                    });
                }
            );
        });
    }

    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/content/', 'Content', 'file', {
            getItems: () => { return resources.content; },

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This content'] = '---';
                
                menu['New child content'] = () => {
                    this.onClickNewContent($('.cr-context-menu__target-element').data('id'));
                };
                                
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.sync.isRemote && !item.isLocked) {
                    menu['Move'] = () => { this.onClickMoveItem(); };
                }

                if(!item.sync.hasRemote && !item.isLocked) {
                    menu['Remove'] = () => { this.onClickRemoveContent(true); };
                }
                
                menu['Folder'] = '---';

                menu['New content'] = () => {
                    let targetId = $('.cr-context-menu__target-element').data('id');
                    let parentId = ContentHelper.getContentByIdSync(targetId).parentId;
                    
                    this.onClickNewContent(parentId);
                };

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

                return menu;
            },

            // Set general context menu items
            paneContextMenu: {
                'General': '---',
                'New content': () => { this.onClickNewContent(); }
            },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                // Set id data attributes
                queueItem.$element.attr('data-content-id', item.id);
                queueItem.parentDirAttr = {'data-content-id': item.parentId };
            }
        });
    }
}

module.exports = ContentPane;
