'use strict';

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
         
            return apiCall('post', 'content/' + id, content);
        })

        // Reload all Content models
        .then(() => {
            return reloadResource('content');
        })

        // Reload UI
        .then(() => {
            ViewHelper.get('NavbarMain').reload();
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
         
            return apiCall('post', 'content/' + id, content);
        })

        // Reload all Content models
        .then(() => {
            return reloadResource('content');
        })

        // Reload UI
        .then(() => {
            ViewHelper.get('NavbarMain').reload();
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Click pull content
     */
    static onClickPullContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let contentEditor = ViewHelper.get('ContentEditor');
        let pullId = $('.context-menu-target-element').data('id');

        // API call to pull the Content by id
        apiCall('post', 'content/pull/' + pullId, {})
        
        // Upon success, reload all Content models    
        .then(() => {
            return reloadResource('content');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();

			location.hash = '/content/' + pullId;
		
			let editor = ViewHelper.get('ContentEditor');

			if(editor && editor.model.id == pullId) {
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
        let navbar = ViewHelper.get('NavbarMain');
		let $element = $('.context-menu-target-element');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        // API call to push the Content by id
        apiCall('post', 'content/push/' + pushId)

        // Upon success, reload all Content models
        .then(() => {
            return reloadResource('content');
        })

        // Reload the UI
        .then(() => {
            navbar.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */
    static onClickNewContent(parentId, asSibling) {
        let navbar = ViewHelper.get('NavbarMain');

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
                let schemaReference = new resources.editors.contentSchemaReference({
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
                        apiCall('post', apiUrl)
                        
                        // Upon success, reload resource and UI elements    
                        .then((result) => {
                            newContent = result;

                            return reloadResource('content');
                        })
                        .then(() => {
                            navbar.reload();
                            
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
     * @param {Object} publishing
     */
    static renderContentPublishingModal(content, publishing) {
        // Event on clicking OK
        function onSubmit() {
            if(!publishing.governedBy) {
                publishing.connections = [];
               
                // Loop through each input switch and add the corresponding Connection id to the connections list 
                modal.$element.find('.switch[data-connection-id] input').each(function(i) {
                    if(this.checked) {
                        publishing.connections.push(
                            this.parentElement.dataset.connectionId
                        );
                    }
                });
                
                // Apply to children flag
                publishing.applyToChildren = modal.$element.find('#switch-publishing-apply-to-children input')[0].checked;

                // Commit publishing settings to Content model
                content.settings.publishing = publishing;
        
                // API call to save the Content model
                apiCall('post', 'content/' + content.id, content)
                
                // Upon success, reload the UI    
                .then(() => {
                    NavbarMain.reload();

                    if(Router.params.id == content.id) {
                        let contentEditor = ViewHelper.get('ContentEditor');

                        contentEditor.model = content.getObject();
                        return contentEditor.render();
                    
                    } else {
                        return Promise.resolve();

                    }
                })
                .catch(UI.errorModal);
            }

        }
        
        let modal = new MessageModal({
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
                    return _.div({class: 'settings-publishing'},
                        _.p('(Settings inherited from <a href="#/content/' + publishing.governedBy.id + '">' + publishing.governedBy.prop('title', window.language) + '</a>)')
                    );
                
                } else {
                    return _.div({class: 'settings-publishing'},
                        // Apply to children switch
                        _.div({class: 'input-group'},      
                            _.span('Apply to children'),
                            _.div({class: 'input-group-addon'},
                                UI.inputSwitch(publishing.applyToChildren == true).attr('id', 'switch-publishing-apply-to-children')
                            )
                        ),

                        // Connections list
                        _.each(window.resources.connections, (i, connection) => { 
                            return _.div({class: 'input-group'},      
                                _.span(connection.title),
                                _.div({class: 'input-group-addon'},
                                    UI.inputSwitch(publishing.connections.indexOf(connection.id) > -1).attr('data-connection-id', connection.id)
                                )
                            );
                        })
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
        let id = $('.context-menu-target-element').data('id');
        let navbar = ViewHelper.get('NavbarMain');
        let content;

        // Get Content model
        ContentHelper.getContentById(id)
        .then((result) => {
            content = result;

            if(!content) {
                return Promise.reject(new Error('Couldn\'t find content with id "' + id + '"')); 

            } else {
                // Get settings first
                return content.getSettings('publishing');
            }
        })
        
        // Upon success, render Content settings modal
        .then((publishing) => {
            // Sanity check
            publishing.applyToChildren = publishing.applyToChildren == true || publishing.applyToChildren == 'true';

            this.renderContentPublishingModal(content, publishing);
        });
    }

    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */
    static onClickRemoveContent(shouldUnpublish) {
        let navbar = ViewHelper.get('NavbarMain');
        let $element = $('.context-menu-target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
       
        ContentHelper.getContentById(id)
        .then((content) => {
            content.getSettings('publishing')
            .then((publishing) => {
                function unpublishConnections() {
                    return apiCall('post', 'content/unpublish', content)
                    .then(() => {
                        return onSuccess();
                    });
                }
                
                function onSuccess() {
                    return reloadResource('content')
                    .then(() => {
                        navbar.reload();
                                
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
                        apiCall('delete', 'content/' + id + '?removeChildren=' + $deleteChildrenSwitch.data('checked'))
                        .then(() => {
                            if(shouldUnpublish && publishing.connections && publishing.connections.length > 0) {
                                return unpublishConnections();
                            } else {
                                return onSuccess();
                            }
                        })
                        .catch(errorModal);
                    }
                );
            });
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
                let isSyncEnabled = SettingsHelper.getCachedSettings('sync').enabled;
                let isContentSyncEnabled = isSyncEnabled && SettingsHelper.getCachedSettings('sync').content;
                
                menu['This content'] = '---';
                
                menu['New child content'] = () => {
                    this.onClickNewContent($('.context-menu-target-element').data('id'));
                };
                                
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.remote && !item.locked) {
                    menu['Move'] = () => { this.onClickMoveItem(); };
                }

                if(!item.local && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveContent(true); };
                }
                
                menu['Folder'] = '---';

                menu['New content'] = () => {
                    let targetId = $('.context-menu-target-element').data('id');
                    let parentId = ContentHelper.getContentByIdSync(targetId).parentId;
                    
                    this.onClickNewContent(parentId);
                };

                if(!item.remote && !item.locked) {
                    menu['Settings'] = '---';
                    menu['Publishing'] = () => { this.onClickContentPublishing(); };
                }
                
                if(item.locked && !item.remote) { isContentSyncEnabled = false; }
               
                if(isContentSyncEnabled) {
                    menu['Sync'] = '---';
                    
                    if(!item.remote) {
                        menu['Push to remote'] = () => { this.onClickPushContent(); };
                    }

                    if(item.local) {
                        menu['Remove local copy'] = () => { this.onClickRemoveContent(); };
                    }
                    
                    if(item.remote) {
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
