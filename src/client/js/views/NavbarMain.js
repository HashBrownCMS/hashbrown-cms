'use strict';

// Views
let MessageModal = require('./MessageModal');

// Models
let Content = require('../../../common/models/Content');

/**
 * The main navbar
 */
class NavbarMain extends View {
    constructor(params) {
        super(params);

        this.$element = _.nav({class: 'navbar-main'});

        this.fetch();
    }
    
    /**
     * Event: Error was returned
     */
    onError(err) {
        new MessageModal({
            model: {
                title: 'Error',
                body: err
            }
        });
    }
    
    /**
     * Event: Click copy content
     */
    onClickCopyContent() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been copied
        view.onClickPasteContent = function onClickPasteContent() {
            let parentId = $('.context-menu-target-element').data('id');
           
            apiCall('get', 'content/' + id)
            .then((copiedContent) => {
                delete copiedContent['id'];

                copiedContent.parentId = parentId;
                
                apiCall('post', 'content/new', copiedContent)
                .then(() => {
                    reloadResource('content')
                    .then(function() {
                        view.reload();
                    });

                    view.onClickPasteContent = null;
                })
                .catch(this.onError);
            })
            .catch(this.onError);
        }
    }

    /**
     * Event: Click cut content
     */
    onClickCutContent() {
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
                        this.reload();

                        location.hash = '/content/' + cutId;
                    });

                    this.onClickPasteContent = null;
                })
                .catch(this.onError);
            }); 
        }
    }

    /**
     * Event: Click new content
     */
    onClickNewContent() {
        apiCall('post', 'content/new')
        .then((newContent) => {
            reloadResource('content')
            .then(() => {
                this.reload();
                
                location.hash = '/content/' + newContent.id;
            });
        })
        .catch(this.onError);
    }

    /**
     * Event: Click content settings
     */
    onClickContentSettings() {
        let id = $('.context-menu-target-element').data('id');
        let view = this;

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
                        view.reload();

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
                            .catch(this.onError);
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
    onClickRemoveContent() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
       
        ContentHelper.getContentById(id)
        .then((content) => {
            content.getSettings('publishing')
            .then((publishing) => {
                function unpublishConnections() {
                    apiCall('post', 'content/unpublish', content)
                    .then(onSuccess)
                    .catch(this.onError);
                }
                
                function onSuccess() {
                    debug.log('Removed content with id "' + id + '"', view); 
                
                    reloadResource('content')
                    .then(function() {
                        view.reload();
                        
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
                                .catch(this.onError);
                            }
                        }
                    ]
                });
            });
        });
    }

    /**
     * Event: Click new connection
     */
    onClickNewConnection() {
        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        }
        
        apiCall('post', 'connections/new')
        .then((newConnection) => {
            reloadResource('connections')
            .then(() => {
                this.reload();

                location.hash = '/connections/' + newConnection.id;
            });
        })
        .catch(this.onError);
    }

    /**
     * Event: On click remove connection
     */
    onClickRemoveConnection() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        }
        
        function onSuccess() {
            debug.log('Removed connection with alias "' + id + '"', view); 
        
            reloadResource('connections')
            .then(function() {
                view.reload();
                
                // Cancel the ConnectionEditor view if it was displaying the deleted connection
                if(location.hash == '#/connections/' + id) {
                    location.hash = '/connections/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete content',
                body: 'Are you sure you want to remove the connection "' + name + '"?'
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
                        apiCall('delete', 'connections/' + id)
                        .then(onSuccess)
                        .catch(this.onError);
                    }
                }
            ]
        });
    }

    /**
     * Event: Click new schema
     */
    onClickNewSchema() {
        let parentId = $('.context-menu-target-element').data('id');
        let parentSchema = window.resources.schemas[parentId];

        function onError(err) {
            new MessageModal({
                model: {
                    title: 'Error',
                    body: err
                }
            });
        }
        
        apiCall('post', 'schemas/new', parentSchema)
        .then((newSchema) => {
            reloadResource('schemas')
            .then(() => {
                this.reload();

                location.hash = '/schemas/' + newSchema.id;
            });
        })
        .catch(this.onError);
    }
    
    /**
     * Event: Click copy item id
     */
    onClickCopyItemId() {
        let id = $('.context-menu-target-element').data('id');

        copyToClipboard(id);
    }

    /**
     * Event: Click remove schema
     */
    onClickRemoveSchema() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let schema = window.resources.schemas[id];
        
        function onSuccess() {
            debug.log('Removed schema with id "' + id + '"', view); 
        
            reloadResource('schemas')
            .then(function() {
                view.reload();
                
                // Cancel the SchemaEditor view if it was displaying the deleted content
                if(location.hash == '#/schemas/' + id) {
                    location.hash = '/schemas/';
                }
            });
        }

        if(!schema.locked) {
            new MessageModal({
                model: {
                    title: 'Delete schema',
                    body: 'Are you sure you want to delete the schema "' + schema.name + '"?'
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
                            apiCall('delete', 'schemas/' + id)
                            .then(onSuccess)
                            .catch(this.onError);
                        }
                    }
                ]
            });
        } else {
            new MessageModal({
                model: {
                    title: 'Delete schema',
                    body: 'The schema "' + schema.name + '" is locked and cannot be removed'
                },
                buttons: [
                    {
                        label: 'OK',
                        class: 'btn-default',
                        callback: function() {
                        }
                    }
                ]
            });
        }
    }


    /**
     * Event: Click toggle fullscreen
     */
    onClickToggleFullscreen() {
        $('.cms-container').toggleClass('fullscreen');
    }

    /**
     * Event: Click new Media directory
     */
    onClickNewMediaDirectory() {
        let parentFolder = $('.context-menu-target-element').data('media-folder');
       
        // TODO: Find some temporary rendering method for new directories 
    }

    /**
     * Event: Click cut Media
     */
    onClickCutMedia() {
        let cutId = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been cut
        this.onClickPasteMedia = function onClickPasteMedia() {
            let parentFolder = $('.context-menu-target-element').data('media-folder');
         
            apiCall(
                'post',
                'media/tree/' + cutId,
                parentFolder ? {
                    id: cutId,
                    folder: parentFolder
                } : null
            )
            .then(() => {
                reloadResource('media')
                .then(() => {
                    this.reload();

                    location.hash = '/media/' + cutId;
                });

                this.onClickPasteMedia = null;
            })
            .catch(this.onError);
        }
    }

    /**
     * Event: Click remove media
     */
    onClickRemoveMedia() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            debug.log('Removed media with id "' + id + '"', view); 
        
            reloadResource('media')
            .then(function() {
                view.reload();
                
                // Cancel the MediaViever view if it was displaying the deleted object
                if(location.hash == '#/media/' + id) {
                    location.hash = '/media/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete media',
                body: 'Are you sure you want to delete the media object "' + name + '"?'
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
                        apiCall('delete', 'media/' + id)
                        .then(onSuccess)
                        .catch(this.onError);
                    }
                }
            ]
        });
    }

    /**
     * Event: Click replace media
     */
    onClickReplaceMedia() {
        let id = $('.context-menu-target-element').data('id');

        this.onClickUploadMedia(id);
    }

    /**
     * Event: Click upload media
     */
    onClickUploadMedia(replaceId) {
        let view = this;

        function onChangeFile() {
            let input = $(this);
            let numFiles = this.files ? this.files.length : 1;
            
            if(numFiles > 0) {
                let file = this.files[0];

                let isImage =
                    file.type == 'image/png' ||
                    file.type == 'image/jpeg' ||
                    file.type == 'image/gif';

                let isVideo =
                    file.type == 'video/mpeg' ||
                    file.type == 'video/mp4' ||
                    file.type == 'video/quicktime' ||
                    file.type == 'video/x-matroska';

                let reader = new FileReader();

                reader.onload = function(e) {
                    if(isImage) {
                        $uploadModal.find('.media-preview').html(
                            _.img({src: e.target.result })
                        );
                    }

                    if(isVideo) {
                        $uploadModal.find('.media-preview').html(
                            _.video({src: e.target.result })
                        );
                    }

                    $uploadModal.find('.spinner-container').toggleClass('hidden', true);
                }
                        
                $uploadModal.find('.spinner-container').toggleClass('hidden', false);

                reader.readAsDataURL(file);
                debug.log('Reading data of file type ' + file.type + '...', view);
            }
        }
        
        function onClickUpload() {
            $uploadModal.find('form').submit();
        }

        function onSubmit(e) {
            e.preventDefault();

            $uploadModal.find('.spinner-container').toggleClass('hidden', false);
            
            let apiPath = 'media/' + (replaceId ? replaceId : 'new');

            $.ajax({
                url: apiUrl(apiPath),
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function(id) {
                    $uploadModal.find('.spinner-container').toggleClass('hidden', true);

                    let navbar = ViewHelper.get('NavbarMain')
                
                    reloadResource('media')
                    .then(function() {
                        navbar.reload();
                        location.hash = '/media/' + id;

                        $uploadModal.modal('hide');
                    });
                }
            });
        }

        let $uploadModal = _.div({class: 'modal modal-upload-media fade'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, 'Upload a file')
                    ),
                    _.div({class: 'modal-body'},
                        _.div({class: 'spinner-container hidden'},
                            _.span({class: 'spinner fa fa-refresh'})
                        ),
                        _.div({class: 'media-preview'})
                    ),
                    _.div({class: 'modal-footer'},
                        _.div({class: 'input-group'},
                            _.form({class: 'form-control'},
                                _.input({type: 'file', name: 'media'})
                                    .change(onChangeFile)
                            ).submit(onSubmit),
                            _.div({class: 'input-group-btn'},
                                _.button({class: 'btn btn-success'},
                                    'Upload'
                                ).click(onClickUpload)
                            )
                        )
                    )
                )
            )
        );

        $uploadModal.on('hidden.bs.modal', function() {
            $uploadModal.remove();
        });

        $('body').append($uploadModal);

        $uploadModal.modal('show');
    }

    /**
     * Fetches pane information and renders it
     *
     * @param {Object} params
     */
    renderPane(params) {
        let view = this;
        let $icon = params.$icon;
       
        if(!$icon) {        
            $icon = _.span({class: 'fa fa-' + params.icon});
        }

        let $button = _.button({'data-route': params.route},
            $icon,
            _.span({class: 'pane-label'}, params.label),
            params.sublabel ? _.span({class: 'pane-sublabel'}, params.sublabel) : ''
        ).click(function() {
            let $currentTab = view.$element.find('.pane-container.active');

            if(params.route == $currentTab.attr('data-route')) {
                location.hash = params.route;
            
            } else {
                view.showTab(params.route);
            
            }
        });
        
        let $pane = _.div({class: 'pane'},
            _.div({class: 'pane-content'})
        );

        let items = params.items;
        let sortingQueue = [];

        // Attach item context menu
        if(params.paneContextMenu) {
            $pane.exocontext(params.paneContextMenu);
        }

        // Items
        $pane.append(
            _.each(items, function(i, item) {
                let id = item.id || i;

                // Get item name
                let name = '';

                if(item.properties && item.properties.title) {
                    if(typeof item.properties.title === 'string') {
                        name = item.properties.title;
                    } else if(typeof item.properties.title === 'object' && item.properties.title[window.language]) {
                        name = item.properties.title[window.language];
                    } else {
                        name = '(error)';
                    }
                
                } else if(typeof item.title === 'string') {
                    name = item.title;

                } else if(typeof item.name === 'string') {
                    name = item.name;

                } else {
                    name = id;

                }

                let routingPath = item.shortPath || item.path || id;
                let queueItem = {};
                let icon = item.icon;
                let $icon;

                // Truncate long names
                if(name.length > 30) {
                    name = name.substring(0, 30) + '...';
                }

                // If this item has a schema id, fetch the appropriate icon
                if(item.schemaId) {
                    icon = resources.schemas[item.schemaId].icon;
                }

                if(icon) {
                    $icon = _.span({class: 'fa fa-' + icon});
                }

                // Item element
                let $element = _.div({
                    class: 'pane-item-container',
                    'data-routing-path': routingPath
                },
                    _.a({
                        'data-id': id,
                        'data-name': name,
                        href: '#' + params.route + routingPath,
                        class: 'pane-item'
                    },
                        $icon,
                        _.span(name)
                    ),
                    _.div({class: 'children'})
                );

                // Attach item context menu
                if(params.itemContextMenu) {
                    $element.find('a').exocontext(params.itemContextMenu);
                }
                
                // Add element to queue item
                queueItem.$element = $element;

                // Use specific sorting behaviours
                if(params.sort) {
                    params.sort(item, queueItem);
                }

                // Add queue item to sorting queue
                sortingQueue.push(queueItem);

                // Add drag/drop event
                $element.exodragdrop({
                    lockX: true,
                    onEndDrag: params.onEndDrag
                });

                return $element;
            })
        );

        // Place items into hierarchy
        for(let queueItem of sortingQueue) {
            if(queueItem.parentDirAttr) { 
                // Find parent item
                let parentDirAttrKey = Object.keys(queueItem.parentDirAttr)[0];
                let parentDirAttrValue = queueItem.parentDirAttr[parentDirAttrKey];
                let parentDirSelector = '.pane-item-container[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
                let $parentDir = $pane.find(parentDirSelector);
          
                // If parent element already exists, just append the queue item element
                if($parentDir.length > 0) {
                    $parentDir.children('.children').append(queueItem.$element);
                
                // If not, create parent elements if specified
                } else if(queueItem.createDir) {
                    let dirNames = parentDirAttrValue.split('/').filter((item) => { return item != ''; });
                    let finalDirName = '/';

                    for(let i in dirNames) {
                        let dirName = dirNames[i];

                        let prevFinalDirName = finalDirName;
                        finalDirName += dirName + '/';

                        let $dir = $pane.find('[' + parentDirAttrKey + '="' + finalDirName + '"]');

                        if($dir.length < 1) {
                            $dir = _.div({class: 'pane-item-container'},
                                _.a({
                                    class: 'pane-item'
                                },
                                    _.span({class: 'fa fa-folder'}),
                                    _.span(dirName)
                                ),
                                _.div({class: 'children'})
                            );
                            
                            $dir.attr(parentDirAttrKey, finalDirName);
                   
                            // Append to previous dir 
                            let $prevDir = $pane.find('[' + parentDirAttrKey + '="' + prevFinalDirName + '"]');
                            
                            if($prevDir.length > 0) {
                                $prevDir.children('.children').append($dir);

                            // If no previous dir was found, append directly to pane
                            } else {
                                $pane.append($dir); 
                            }
                        }
                       
                        // Attach item context menu
                        if(params.dirContextMenu) {
                            $dir.exocontext(params.dirContextMenu);
                        }
                        
                        // Only append the queue item to the final parent element
                        if(i >= dirNames.length - 1) {
                            $parentDir = $dir;
                        } 
                    }

                    $parentDir.children('.children').append(queueItem.$element);
                }

            }
        }

        let $paneContainer = _.div({class: 'pane-container', 'data-route': params.route},
            $pane
        );

        // Add expand/collapse buttons to items if needed
        $paneContainer.find('.pane-item-container').each((i, element) => {
            let $paneItemContainer = $(element);
            let $paneItem = $paneItemContainer.children('.pane-item');;
            let $children = $paneItemContainer.children('.children');
            
            if($children.children().length > 0) {
                let $childrenToggle = _.button({class: 'btn-children-toggle'},
                    _.span({class:'fa fa-caret-down'}),
                    _.span({class:'fa fa-caret-right'})
                );

                $paneItem.append($childrenToggle);

                function onClickChildrenToggle(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $paneItemContainer.toggleClass('open');
                }

                $childrenToggle.click(onClickChildrenToggle);
            }
        });
        
        if(params.postSort) {
            params.postSort($paneContainer.find('>.pane, .pane-item-container>.children'));
        }

        if(this.$element.find('.tab-panes .pane-container').length < 1) {
            $paneContainer.addClass('active');
            $button.addClass('active');
        }

        this.$element.find('.tab-panes').append($paneContainer);
        this.$element.find('.tab-buttons').append($button);
    }
    
    /**
     * Shows a tab
     *
     * @param {String} tabName
     */
    showTab(tabRoute) {
        onReady('navbar', () => {
            this.$element.find('.tab-panes .pane-container').each(function(i) {
                $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
            });
            
            this.$element.find('.tab-buttons button').each(function(i) {
                $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
            });
        });
    }

    /**
     * Reloads this view
     */
    reload() {
        let $currentTab = this.$element.find('.pane-container.active');
        let $currentItem = this.$element.find('.pane-container.active .pane-item-container.active');

        this.fetch();

        if($currentTab.length > 0) {
            let currentTabName = $currentTab.attr('data-route');

            if($currentItem.length > 0) {
                let currentRoute = $currentItem.attr('data-id') || $currentItem.attr('data-routing-path');
            
                this.highlightItem(currentRoute);
            
            } else {
                this.showTab(currentTabName);

            }
        }
    }
    
    /**
     * Highlights an item
     */
    highlightItem(route) {
        let view = this;

        onReady('navbar', () => {
            this.$element.find('.pane-item-container').each(function(i) {
                let $item = $(this);
                let id  = ($item.children('a').attr('data-id') || '').toLowerCase();
                let routingPath = ($item.attr('data-routing-path') || '').toLowerCase();

                $item.toggleClass('active', false);
                
                if(
                    id == route.toLowerCase() ||
                    routingPath == route.toLowerCase()
                ) {
                    $item.toggleClass('active', true);

                    $item.parents('.pane-item-container').toggleClass('open', true);

                    view.showTab($item.parents('.pane-container').attr('data-route'));
                }
            });
        });
    }

    render() {
        let view = this;

        // ----------
        // Render main content
        // ----------
        this.$element.html([
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'}),
            _.div({class: 'fullscreen-toggle'},
                _.button({class: 'btn'},
                    _.span({class: 'fa fa-chevron-right'}),
                    _.span({class: 'fa fa-chevron-left'})
                ).click(this.onClickToggleFullscreen)
            )
        ]);

        // Get user scopes
        $.ajax({
            type: 'GET',
            url: '/api/user/scopes?token=' + localStorage.getItem('token'),
            success: (allScopes) => {
                let scopes = allScopes[ProjectHelper.currentProject] || [];

                // ----------
                // Render the "about" pane
                // ----------
                this.renderPane({
                    label: 'Endomon CMS',
                    route: '/',
                    $icon: _.span({class: 'about-logo'}, 'E'),
                    items: [
                        {
                            name: 'About',
                            path: 'about'
                        }
                    ]
                });

                // ----------
                // Render the "content" pane
                // This is the only pane that offers manual sorting, so it has more logic than other panes
                // ----------
                this.renderPane({
                    label: 'Content',
                    route: '/content/',
                    icon: 'file',
                    items: resources.content,

                    // Set item context menu
                    itemContextMenu: {
                        'This content': '---',
                        'Rename': function() { view.onClickRenameContent(); },
                        'Copy': function() { view.onClickCopyContent(); },
                        'Cut': function() { view.onClickCutContent(); },
                        'Paste': function() { view.onClickPasteContent(); },
                        'Copy id': function() { view.onClickCopyItemId(); },
                        'Remove': function() { view.onClickRemoveContent(); },
                        'Settings': function() { view.onClickContentSettings(); },
                    },

                    // Set general context menu items
                    paneContextMenu: {
                        'General': '---',
                        'Create new': function() { view.onClickNewContent(); }
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
                });

                // ----------
                // Render the "media" pane
                // ----------
                this.renderPane({
                    label: 'Media',
                    route: '/media/',
                    icon: 'file-image-o',
                    items: resources.media,

                    // Sorting logic
                    sort: function(item, queueItem) {
                        queueItem.$element.attr('data-media-id', item.id);
                       
                        if(item.folder) {
                            queueItem.createDir = true;
                            queueItem.parentDirAttr = {'data-media-folder': item.folder };
                        }
                    },
                    
                    // Item context menu
                    itemContextMenu: {
                        'This media': '---',
                        'Copy id': function() { view.onClickCopyItemId(); },
                        'Cut': function() { view.onClickCutMedia(); },
                        'Remove': function() { view.onClickRemoveMedia(); },
                        'Replace': function() { view.onClickReplaceMedia(); }
                    },

                    // Dir context menu
                    dirContextMenu: {
                        'Directory': '---',
                        'Paste': function() { view.onClickPasteMedia(); },
                        'New folder': function() { view.onClickNewMediaDirectory(); },
                        'Upload new media': function() { view.onClickUploadMedia(); },
                        'Remove': function() { view.onClickRemoveMediaDirectory(); }
                    },

                    // General context menu
                    paneContextMenu: {
                        'General': '---',
                        'Paste': function() { view.onClickPasteMedia(); },
                        'New folder': function() { view.onClickNewMediaDirectory(); },
                        'Upload new media': function() { view.onClickUploadMedia(); }
                    }
                });
                
                // ----------
                // Render the "connections" pane
                // ----------
                if(scopes.indexOf('connections') > -1) {
                    this.renderPane({
                        label: 'Connections',
                        route: '/connections/',
                        icon: 'exchange',
                        items: resources.connections,

                        // Item context menu
                        itemContextMenu: {
                            'This connection': '---',
                            'Copy id': function() { view.onClickCopyItemId(); },
                            'Remove': function() { view.onClickRemoveConnection(); }
                        },

                        // General context menu
                        paneContextMenu: {
                            'General': '---',
                            'New connection': function() { view.onClickNewConnection(); }
                        }
                    });
                }
                
                // ----------
                // Render the "schemas" pane
                // ----------
                if(scopes.indexOf('schemas') > -1) {
                    this.renderPane({
                        label: 'Schemas',
                        route: '/schemas/',
                        icon: 'gears',
                        items: resources.schemas,

                        // Item context menu
                        itemContextMenu: {
                            'This schema': '---',
                            'New child schema': function() { view.onClickNewSchema(); },
                            'Copy id': function() { view.onClickCopyItemId(); },
                            'Remove': function() { view.onClickRemoveSchema(); }
                        },

                        // Sorting logic
                        sort: function(item, queueItem) {
                            queueItem.$element.attr('data-schema-id', item.id);
                           
                            if(item.parentSchemaId) {
                                queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

                            } else {
                                queueItem.parentDirAttr = {'data-schema-type': item.type};
                            }
                        }
                    });
                }

                // ----------
                // Render the "settings" pane
                // ----------
                if(scopes.indexOf('settings') > -1) {
                    this.renderPane({
                        label: 'Settings',
                        route: '/settings/',
                        icon: 'wrench',
                        items: [
                            {
                                name: 'Languages',
                                path: 'languages'
                            }
                        ]
                    });
                }
                
                // ----------
                // Render the "settings" pane
                // ----------
                if(scopes.indexOf('users') > -1) {
                    this.renderPane({
                        label: 'Users',
                        route: '/users/',
                        icon: 'user',
                        items: []
                    });
                }

                triggerReady('navbar');
            },
            error: () => {

            }
        });

        // Insert into DOM
        $('.navspace').html(this.$element);
    }
}

module.exports = NavbarMain;
