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
     */
    static onClickNewContent() {
        apiCall('post', 'content/new')
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
        return {
            label: 'Content',
            route: '/content/',
            icon: 'file',
            items: resources.content,

            // Set item context menu
            itemContextMenu: {
                'This content': '---',
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

               /* function onSuccess() {

                }

                function onError(err) {
                    new MessageModal({
                        model: {
                            title: 'Error',
                            body: err
                        }
                    });
                }

                // Get the Content node and check if it has a sort index
                let thisContent = resources.content.filter((content) => {
                    return content.id = item.id;
                })[0];

                // ...if it doesn't, assign one based on the DOM
                if(thisContent.sort < 0) {
                    thisContent.sort = queueItem.$element.parent().index() * 10000;
                    
                    // Save the Content model with the new sort index
                    $.ajax({
                        type: 'post',
                        url: apiUrl('content/' + thisContent.id),
                        data: thisContent.getObject(),
                        success: onSuccess,
                        error: onError
                    });
                }
                
                // Assign the sort index to the DOM element
                queueItem.$element.attr('data-sort', thisContent.sort);*/
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
            onEndDrag: function(dragdropItem) {
                let thisId = dragdropItem.element.dataset.contentId;
                
                function onSuccess() {

                }

                function onError(err) {
                    new MessageModal({
                        model: {
                            title: 'Error',
                            body: err
                        }
                    });
                }

                // Get Content node and set new sorting value
                ContentHelper.getContentById(thisId)
                .then((thisContent) => {
                    // If this element has a previous sibling, base the sorting index on that
                    if(dragdropItem.element.previousSibling) {
                        let prevId = dragdropItem.element.previousSibling.dataset.contentId;

                        ContentHelper.getContentById(prevId)
                        .then((prevContent) => {
                            thisContent.sort = prevContent.sort + 1;

                            // Save model
                            apiCall('post', 'content/' + thisContent.id, thisContent.getObject())
                            .then(onSuccess)
                            .catch(onError);
                        });

                    // If this element has a next sibling, base the sorting index on that
                    } else if (dragdropItem.element.nextSibling) {
                        let nextId = dragdropItem.element.nextiousSibling.dataset.contentId;

                        ContentHelper.getContentById(nextId)
                        .then((nextContent) => {
                            thisContent.sort = nextContent.sort - 1;

                            // Save model
                            apiCall('post', 'content/' + thisContent.id, thisContent.getObject())
                            .then(onSuccess)
                            .catch(onError);
                        });


                    // If it has neither, just assign the lowest possible one
                    } else {
                        thisContent.sort = 10000;
                       
                        // Save model
                        apiCall('post', 'content/' + thisContent.id, thisContent.getObject())
                        .then(onSuccess)
                        .catch(onError);
                    }
                });
            }
        }
    }
}

module.exports = ContentPane;
