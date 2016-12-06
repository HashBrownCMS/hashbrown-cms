'use strict';

let Pane = require('./Pane');

class ContentPane extends Pane {
    /**
     * Event: Click copy content
     */
    static onClickCopyContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been copied
        this.onClickPasteContent = function onClickPasteContent() {
            let parentId = $('.context-menu-target-element').data('id');
           
            apiCall('get', 'content/' + id)
            .then((copiedContent) => {
                delete copiedContent['id'];

                copiedContent.parentId = parentId;
                
                return apiCall('post', 'content/new', copiedContent);
            })
            .then(() => {
                return reloadResource('content');
            })
            .then(() => {
                navbar.reload();
                navbar.onClickPasteContent = null;
            })
            .catch(errorModal);
        }
    }
    
    /**
     * Event: Click pull content
     */
    static onClickPullContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let pullId = $('.context-menu-target-element').data('id');

        apiCall('post', 'content/pull/' + pullId, {})
        .then(() => {
            return reloadResource('content');
        })
        .then(() => {
            navbar.reload();
        }) 
        .catch(errorModal);
    }
    
    /**
     * Event: Click push content
     */
    static onClickPushContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let pushId = $('.context-menu-target-element').data('id');

        apiCall('post', 'content/push/' + pushId)
        .then(() => {
            return reloadResource('content');
        })
        .then(() => {
            navbar.reload();
        }) 
        .catch(errorModal);
    }

    /**
     * Event: Click cut content
     */
    static onClickCutContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let cutId = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been cut
        this.onClickPasteContent = function onClickPasteContent() {
            let parentId = $('.context-menu-target-element').data('id');
           
            ContentHelper.getContentById(cutId)
            .then((cutContent) => {
                cutContent.parentId = parentId;
              
                return apiCall('post', 'content/' + cutId, cutContent);
            })
            .then(() => {
                return reloadResource('content');
            })
            .then(() => {
                navbar.reload();
                navbar.onClickPasteContent = null;

                location.hash = '/content/' + cutId;
            })
            .catch(navbar.onError);
        }
    }

    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */
    static onClickNewContent(parentId) {
        let navbar = ViewHelper.get('NavbarMain');
        let messageModal;

        // Event fired when clicking "OK"
        let onPickedSchema = () => {
            let schemaId = messageModal.$element.find('.content-schema-reference-editor select').val();

            if(schemaId) {
                let apiUrl = 'content/new/' + schemaId;
                
                if(parentId) {
                    apiUrl += '?parent=' + parentId;
                }

                apiCall('post', apiUrl)
                .then((newContent) => {
                    reloadResource('content')
                    .then(() => {
                        navbar.reload();
                        
                        location.hash = '/content/' + newContent.id;
                    });
                })
                .catch(navbar.onError);
           
            } else {
                return false;
        
            }
        };

        // Shows the Schema picker modal
        let showModal = (allowedSchemas) => {
            if(allowedSchemas && allowedSchemas.length < 1) {
                messageModal = new MessageModal({
                    model: {
                        title: 'Can\'t create new content',
                        body: 'No child content schemas are allowed under this parent'
                    }
                });
            
            } else {
                let contentSchemaReferenceEditor = new resources.editors.contentSchemaReference({
                    config: {
                        allowedSchemas: allowedSchemas   
                    }
                });

                messageModal = new MessageModal({
                    model: {
                        title: 'Create new content',
                        body: _.div({},
                            _.p('Please pick a schema'),
                            contentSchemaReferenceEditor.$element
                        )
                    },
                    buttons: [
                        {
                            label: 'Cancel',
                            class: 'btn-default',
                            callback: function() {
                            }
                        },
                        {
                            label: 'OK',
                            class: 'btn-primary',
                            callback: onPickedSchema
                        }
                    ]
                });
            }
        };

        if(parentId) {
            ContentHelper.getContentById(parentId)
            .then((parentContent) => {
                return SchemaHelper.getSchemaById(parentContent.schemaId);
            })
            .then((parentSchema) => {
                showModal(parentSchema.allowedChildSchemas);
            })
            .catch(navbar.onError);

        } else {
            showModal();
        }
    }

    /**
     * Event: Click content settings
     */
    static onClickContentSettings() {
        let id = $('.context-menu-target-element').data('id');
        let navbar = ViewHelper.get('NavbarMain');

        ContentHelper.getContentById(id)
        .then((content) => {
            if(!content) {
                messageModal('Error', 'Couldn\'t find content with id "' + id + '"'); 

            } else {
                // Get settings first
                content.getSettings('publishing')
                .then((publishing) => {
                    // Submit event
                    function onSubmit() {
                        if(!publishing.governedBy) {
                            publishing.connections = [];
                            
                            $('.switch-connection').each(function(i) {
                                if(this.checked) {
                                    publishing.connections.push(
                                        $(this).attr('data-connection-id')
                                    );
                                }
                            });
                            
                            publishing.applyToChildren = $('#switch-publishing-apply-to-children')[0].checked;

                            content.settings.publishing = publishing;
                    
                            // Save model
                            apiCall('post', 'content/' + content.id, content)
                            .then(() => {
                                navbar.reload();

                                if(Router.params.id == content.id) {
                                    let contentEditor = ViewHelper.get('ContentEditor');

                                    contentEditor.model = content.getObject();
                                    return contentEditor.render();
                                
                                } else {
                                    return new Promise((resolve) => {
                                        resolve();
                                    });

                                }
                            })
                            .catch(errorModal);
                        }

                    }
                    
                    // Sanity check
                    publishing.applyToChildren = publishing.applyToChildren == true || publishing.applyToChildren == 'true';

                    // Render modal 
                    let modal = new MessageModal({
                        model: {
                            title: 'Settings for "' + content.prop('title', window.language) + '"'
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
                            return _.div({class: 'settings-publishing'},
                                // Publishing
                                _.h5('Publishing'),
                                function() {
                                    if(publishing.governedBy) {
                                        return _.p('(Settings inherited from <a href="#/content/' + publishing.governedBy.id + '">' + publishing.governedBy.prop('title', window.language) + '</a>)')

                                    } else {
                                        return [
                                            // Heading
                                            _.div({class: 'input-group'},      
                                                _.span('Apply to children'),
                                                _.div({class: 'input-group-addon'},
                                                    _.div({class: 'switch'},
                                                        _.input({
                                                            id: 'switch-publishing-apply-to-children',
                                                            class: 'form-control switch',
                                                            type: 'checkbox',
                                                            checked: publishing.applyToChildren == true
                                                        }),
                                                        _.label({for: 'switch-publishing-apply-to-children'})
                                                    )
                                                )
                                            ),
                                            // Connections
                                            _.each(window.resources.connections, (i, connection) => { 
                                                return _.div({class: 'input-group'},      
                                                    _.span(connection.title),
                                                    _.div({class: 'input-group-addon'},
                                                        _.div({class: 'switch'},
                                                            _.input({
                                                                id: 'switch-connection-' + i,
                                                                'data-connection-id': connection.id,
                                                                class: 'form-control switch switch-connection',
                                                                type: 'checkbox',
                                                                checked: publishing.connections.indexOf(connection.id) > -1
                                                            }),
                                                            _.label({
                                                                for: 'switch-connection-' + i
                                                            })
                                                        )
                                                    )
                                                );
                                            })
                                        ];
                                    }
                                }()
                            );
                        }
                    });
                })
                .catch(errorModal);
            }
        });
    }

    /**
     * Event: Click remove content
     *
     * @param {Boolean} shouldUnpublish
     */
    static onClickRemoveContent(shouldUnpublish) {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
       
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
                    debug.log('Removed content with id "' + id + '"', navbar); 
                
                    return reloadResource('content')
                    .then(() => {
                        navbar.reload();
                        
                        // Cancel the ContentEditor view if it was displaying the deleted content
                        if(location.hash.indexOf('#/content/' + id) > -1) {
                            location.hash = '/content/';
                        }

                        return Promise.resolve();
                    });
                }

                let messageModal = new MessageModal({
                    model: {
                        title: 'Remove content',
                        body: _.div({},
                            _.p('Are you sure you want to remove the content "' + name + '"?'),
                            _.div({class: 'input-group'},      
                                _.span('Remove child content too'),
                                _.div({class: 'input-group-addon'},
                                    _.div({class: 'switch'},
                                        _.input({
                                            id: 'switch-content-delete-children',
                                            class: 'form-control switch',
                                            type: 'checkbox',
                                            checked: true
                                        }),
                                        _.label({for: 'switch-content-delete-children'})
                                    )
                                )
                            )
                        )
                    },
                    buttons: [
                        {
                            label: 'Cancel',
                            class: 'btn-default',
                            callback: function() {
                            }
                        },
                        {
                            label: 'OK',
                            class: 'btn-danger',
                            callback: function() {
                                apiCall('delete', 'content/' + id + '?removeChildren=' + messageModal.$element.find('.switch input')[0].checked)
                                .then(() => {
                                    if(shouldUnpublish && publishing.connections && publishing.connections.length > 0) {
                                        return unpublishConnections();
                                    } else {
                                        return onSuccess();
                                    }
                                })
                                .catch(errorModal);
                            }
                        }
                    ]
                });
            });
        });
    }

    /**
     * Gets render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        let navbar = ViewHelper.get('NavbarMain');
        
        return {
            label: 'Content',
            route: '/content/',
            icon: 'file',
            items: resources.content,

            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                
                menu['This content'] = '---';
                menu['New child content'] = () => { this.onClickNewContent($('.context-menu-target-element').data('id')); };
                menu['Copy'] = () => { this.onClickCopyContent(); };
                menu['Copy id'] = () => { this.onClickCopyItemId(); };
                menu['Paste'] = () => { this.onClickPasteContent(); };

                if(!item.local && !item.remote && !item.locked) {
                    menu['Cut'] = () => { this.onClickCutContent(); };
                    menu['Remove'] = () => { this.onClickRemoveContent(true); };
                }

                if(!item.remote && !item.locked) {
                    menu['Settings'] = () => { this.onClickContentSettings(); };
                }
                
                if(item.local || item.remote) {
                    menu['Sync'] = '---';
                }

                if(item.local) {
                    menu['Push to remote'] = () => { this.onClickPushContent(); };
                    menu['Remove local copy'] = () => { this.onClickRemoveContent(); };
                }
                
                if(item.remote) {
                    menu['Pull from remote'] = () => { this.onClickPullContent(); };
                }

                return menu;
            },

            // Set general context menu items
            paneContextMenu: {
                'General': '---',
                'New content': () => { this.onClickNewContent(); }
            },

            // Sorting logic
            sort: function(item, queueItem) {
                // Set id data attributes
                queueItem.$element.attr('data-content-id', item.id);
                queueItem.parentDirAttr = {'data-content-id': item.parentId };

                // Assign the sort index to the DOM element
                queueItem.$element.attr('data-sort', item.sort);
            },

            // End dragging logic
            onEndDrag: function(dragdropItem, dropContainer) {
                let thisId = dragdropItem.element.dataset.contentId;
                
                // Get Content node first
                ContentHelper.getContentById(thisId)
                .then((thisContent) => {
                    // Then change the sorting value
                    let thisPrevSort = thisContent.sort;
                    let newSortBasedOn = '';
                    let newSort;

                    // Feed back a success message in the console
                    function onSuccess() {
                        debug.log(
                            'Changes to Content "' + thisContent.id + '":' + 
                            '\n- sort from ' + thisPrevSort + ' to ' + thisContent.sort + ' based on ' + newSortBasedOn + 
                            navbar
                        );
                    }

                    // If this element has a previous sibling, base the sorting index on that
                    if($(dragdropItem.element).prev('.pane-item-container').length > 0) {
                        let prevSort = parseInt(dragdropItem.element.previousSibling.dataset.sort);

                        newSort = prevSort + 1;
                        newSortBasedOn = 'previous sibling';
            
                    // If this element has a next sibling, base the sorting index on that
                    } else if($(dragdropItem.element).next('.pane-item-container').length > 0) {
                        let nextSort = parseInt(dragdropItem.element.nextSibling.dataset.sort);

                        newSort = nextSort - 1;
                        newSortBasedOn = 'next sibling';

                    // If it has neither, just assign the lowest possible one
                    } else {
                        newSort = 10000;
                        newSortBasedOn = 'lowest possible index';
                    }

                    if(newSort != thisContent.sort) {
                        thisContent.sort = newSort;

                        // Save model
                        apiCall('post', 'content/' + thisContent.id, thisContent.getObject())
                        .then(onSuccess)
                        .catch(navbar.onError);
                        
                        dragdropItem.element.dataset.sort = thisContent.sort;
                    }
                });
            }
        }
    }
}

module.exports = ContentPane;
