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
        navbar.onClickPasteContent = function onClickPasteContent() {
            let parentId = $('.context-menu-target-element').data('id');
           
            apiCall('get', 'content/' + id)
            .then((copiedContent) => {
                delete copiedContent['id'];

                copiedContent.parentId = parentId;
                
                apiCall('post', 'content/new', copiedContent)
                .then(() => {
                    reloadResource('content')
                    .then(function() {
                        navbar.reload();
                    });

                    navbar.onClickPasteContent = null;
                })
                .catch(navbar.onError);
            })
            .catch(navbar.onError);
        }
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
               
                apiCall('post', 'content/' + cutId, cutContent)
                .then(() => {
                    reloadResource('content')
                    .then(() => {
                        navbar.reload();

                        location.hash = '/content/' + cutId;
                    });

                    navbar.onClickPasteContent = null;
                })
                .catch(navbar.onError);
            }); 
        }
    }

    /**
     * Event: Click new content
     *
     * @param {String} parentId
     */
    static onClickNewContent(parentId) {
        let navbar = ViewHelper.get('NavbarMain');
        let apiUrl = 'content/new';
        
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
                    // Success event
                    function onSuccess() {
                        navbar.reload();

                        if(Router.params.id == content.id) {
                            ViewHelper.get('ContentEditor').model = content.getObject();
                            ViewHelper.get('ContentEditor').render();
                        }
                    }
                    
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
                            .then(onSuccess)
                            .catch(navbar.onError);
                        }
                    }

                    // Render modal 
                    let modal = messageModal('Settings for "' + content.prop('title', window.language) + '"', [
                        // Publishing
                        _.h5('Publishing'),
                        function() {
                            if(publishing.governedBy) {
                                return _.p('(Settings inherited from <a href="#/content/' + publishing.governedBy.id + '">' + publishing.governedBy.prop('title', window.language) + '</a>)')
                            } else {
                                publishing.applyToChildren = publishing.applyToChildren == true || publishing.applyToChildren == 'true';

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
                    ], onSubmit);
                });
            }
        });
    }

    /**
     * Event: Click remove content
     */
    static onClickRemoveContent() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
       
        ContentHelper.getContentById(id)
        .then((content) => {
            content.getSettings('publishing')
            .then((publishing) => {
                function unpublishConnections() {
                    apiCall('post', 'content/unpublish', content)
                    .then(onSuccess)
                    .catch(navbar.onError);
                }
                
                function onSuccess() {
                    debug.log('Removed content with id "' + id + '"', navbar); 
                
                    reloadResource('content')
                    .then(function() {
                        navbar.reload();
                        
                        // Cancel the ContentEditor view if it was displaying the deleted content
                        if(location.hash.indexOf('#/content/' + id) > -1) {
                            location.hash = '/content/';
                        }
                    });
                }

                new MessageModal({
                    model: {
                        title: 'Delete content',
                        body: 'Are you sure you want to delete the content "' + name + '"?'
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
                                apiCall('delete', 'content/' + id)
                                .then(() => {
                                    if(publishing.connections && publishing.connections.length > 0) {
                                        unpublishConnections();
                                    } else {
                                        onSuccess();
                                    }
                                })
                                .catch(navbar.onError);
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

            // Set item context menu
            itemContextMenu: {
                'This content': '---',
                'Create new': () => { this.onClickNewContent($('.context-menu-target-element').data('id')); },
                'Copy': () => { this.onClickCopyContent(); },
                'Copy id': () => { this.onClickCopyItemId(); },
                'Cut': () => { this.onClickCutContent(); },
                'Paste': () => { this.onClickPasteContent(); },
                'Remove': () => { this.onClickRemoveContent(); },
                'Settings': () => { this.onClickContentSettings(); },
            },

            // Set general context menu items
            paneContextMenu: {
                'General': '---',
                'Create new': () => { this.onClickNewContent(); }
            },

            // Sorting logic
            sort: function(item, queueItem) {
                // Set id data attributes
                queueItem.$element.attr('data-content-id', item.id);
                queueItem.parentDirAttr = {'data-content-id': item.parentId };

                // Assign the sort index to the DOM element
                queueItem.$element.attr('data-sort', item.sort);
            },

            // After sorting logic
            postSort: function($parentElements) {
                // Sort elements
                /*$parentElements.each((i, parentElement) => {
                    $(parentElement).children().sort((a, b) => {
                        let aSort = a.getAttribute('data-sort');
                        let bSort = b.getAttribute('data-sort');

                        if(aSort > bSort) {
                            return 1;
                        } else if(aSort < bSort) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                });*/
            },

            // End dragging logic
            onEndDrag: function(dragdropItem, dropContainer) {
                let thisId = dragdropItem.element.dataset.contentId;
                
                // Get Content node first
                ContentHelper.getContentById(thisId)
                .then((thisContent) => {
                    console.log(dropContainer);

                    // Check if this element was dropped onto an unsorted container, assigning a new parent
                    if(dropContainer && dropContainer.dataset.dragdropUnsorted) {
                        console.log(dropContainer.dataset.contentId);

                    // If not, just change sorting value
                    } else {
                        let thisPrevSort = thisContent.sort;
                        let newSortBasedOn = '';
                        let newSort;

                        function onSuccess() {
                            debug.log('Changed sorting index of Content "' + thisContent.id + '" from ' + thisPrevSort + ' to ' + thisContent.sort + ' based on ' + newSortBasedOn, navbar);
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
                    }
                });
            }
        }
    }
}

module.exports = ContentPane;
