'use strict';

// Views
let MessageModal = require('./MessageModal');

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
     * Event: Click copy page
     */
    onClickCopyPage() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been copied
        view.onClickPastePage = function onClickPastePage() {
            let parentId = $('.context-menu-target-element').data('id');
            
            $.getJSON('/api/pages/' + id, function(copiedPage) {
                delete copiedPage['id'];

                copiedPage.parentId = parentId;
                    
                $.post('/api/pages/new/', copiedPage, function() {
                    reloadResource('pages', function() {
                        view.reload();
                    });

                    view.onClickPastePage = null;
                });
            });
        }
    }

    /**
     * Event: Click cut page
     */
    onClickCutPage() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been cut
        view.onClickPastePage = function onClickPastePage() {
            let parentId = $('.context-menu-target-element').data('id');
            
            $.getJSON('/api/pages/' + id, function(cutPage) {
                cutPage.parentId = parentId;
                    
                $.post('/api/pages/' + id, cutPage, function() {
                    reloadResource('pages', function() {
                        view.reload();
                    });

                    view.onClickPastePage = null;
                });
            });
        }
    }

    /**
     * Event: Click new page
     */
    onClickNewPage() {
        let view = this;

        $.post('/api/pages/new/', function() {
            reloadResource('pages', function() {
                view.reload();
            });
        });
    }

    /**
     * Event: Click remove page
     */
    onClickRemovePage() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            console.log('[NavbarMain] Removed page with id "' + id + '"'); 
        
            reloadResource('pages', function() {
                view.reload();
                
                // Cancel the PageEditor view if it was displaying the deleted page
                if(location.hash == '#/pages/' + id) {
                    location.hash = '/pages/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete page',
                body: 'Are you sure you want to delete the page "' + name + '"?'
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
                        $.ajax({
                            url: '/api/pages/' + id,
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
    }

    /**
     * Event: Click remove media
     */
    onClickRemoveMedia() {
        let view = this;
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
        function onSuccess() {
            console.log('[NavbarMain] Removed media with id "' + id + '"'); 
        
            reloadResource('media', function() {
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
                        $.ajax({
                            url: '/api/media/' + id,
                            type: 'DELETE',
                            success: onSuccess
                        });
                    }
                }
            ]
        });
    }

    /**
     * Event: Click upload media
     */
    onClickUploadMedia() {
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
                console.log('Reading data of file type ' + file.type + '...');
            }
        }
        
        function onClickUpload() {
            $uploadModal.find('form').submit();
        }

        function onSubmit(e) {
            e.preventDefault();

            $uploadModal.find('.spinner-container').toggleClass('hidden', false);
            
            $.ajax({
                url: '/api/media/new',
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function(id) {
                    $uploadModal.find('.spinner-container').toggleClass('hidden', true);

                    let navbar = ViewHelper.get('NavbarMain')
                
                    reloadResource('media', function() {
                        navbar.reload();
                        location.hash = '/media/' + id;

                        $uploadModal.modal('hide');
                    });
                }
            });
        }

        let $uploadModal = _.div({class: 'modal modal-upload-media fade'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, 'Upload a file')
                    ),
                    _.div({class: 'modal-body'}, [
                        _.div({class: 'spinner-container hidden'},
                            _.span({class: 'spinner fa fa-refresh'})
                        ),
                        _.div({class: 'media-preview'})
                    ]),
                    _.div({class: 'modal-footer'}, [
                        _.div({class: 'input-group'}, [
                            _.form({class: 'form-control'},
                                _.input({type: 'file', name: 'media'})
                                    .change(onChangeFile)
                            ).submit(onSubmit),
                            _.div({class: 'input-group-btn'},
                                _.button({class: 'btn btn-success'},
                                    'Upload'
                                ).click(onClickUpload)
                            )
                        ])
                    ])
                ])
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

        let $button = _.button({'data-route': params.route}, [
            $icon,
            _.span(params.label)
        ]).click(function() {
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
            $pane.context(params.paneContextMenu);
        }

        // Items
        $pane.append(
            _.each(items, function(i, item) {
                let id = item.id || i;
                let name = item.title || item.name || id;
                let routingPath = item.shortPath || item.path || id;
                let queueItem = {};
                let icon = item.icon;
                let $icon;

                // Truncate long names
                if(name.length > 18) {
                    name = name.substring(0, 18) + '...';
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
                    'data-routing-path': routingPath,
                    draggable: true
                }, [
                    _.a({
                        'data-id': id,
                        'data-name': name,
                        href: '#' + params.route + routingPath,
                        class: 'pane-item'
                    }, [
                        $icon,
                        _.span(name)
                    ]),
                    _.div({class: 'children'})
                ]);

                // Attach item context menu
                if(params.itemContextMenu) {
                    $element.find('a').context(params.itemContextMenu);
                }
                
                // Add element to queue item
                queueItem.$element = $element;

                // Use specific sorting behaviours
                if(params.sort) {
                    params.sort(item, queueItem);
                }

                // Add queue item to sorting queue
                sortingQueue.push(queueItem);

                return $element;
            })
        );

        // Sort items into hierarchy
        for(let queueItem of sortingQueue) {
            if(queueItem.parentDirAttr) { 
                // Find parent item
                let parentDirAttrKey = Object.keys(queueItem.parentDirAttr)[0];
                let parentDirAttrValue = queueItem.parentDirAttr[parentDirAttrKey];
                let parentDirSelector = '.pane-item-container[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
                let $parentDir = $pane.find(parentDirSelector);
          
                if($parentDir.length > 0) {
                    $parentDir.children('.children').append(queueItem.$element);
                
                // Create parent item
                } else if(queueItem.createDir) {
                    $parentDir = _.div({class: 'pane-item-container'}, [
                        _.a({
                            class: 'pane-item'
                        }, [
                            _.span({class: 'fa fa-folder'}),
                            _.span(parentDirAttrValue)
                        ]),
                        _.div({class: 'children'})
                    ]);
                    
                    $parentDir.attr(parentDirAttrKey, parentDirAttrValue);

                    // TODO: Append to correct parent
                    $pane.append($parentDir); 
                    
                    $parentDir.children('.children').append(queueItem.$element);
                }
            }
        }

        let $paneContainer = _.div({class: 'pane-container', 'data-route': params.route},
            $pane
        );

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
        this.$element.find('.tab-panes .pane-container').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
        });
        
        this.$element.find('.tab-buttons button').each(function(i) {
            $(this).toggleClass('active', $(this).attr('data-route') == tabRoute);
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

        this.$element.find('.pane-item-container').each(function(i) {
            let $item = $(this);

            $item.toggleClass('active', false);
            
            if(
                $item.attr('data-id') == route ||
                $item.attr('data-routing-path') == route
            ) {
                $item.toggleClass('active', true);

                view.showTab($item.parents('.pane-container').attr('data-route'));
            }
        });
    }

    render() {
        let view = this;

        this.$element.html([
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'})
        ]);

        $('.navspace').html(this.$element);
        
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

        this.renderPane({
            label: 'Pages',
            route: '/pages/',
            icon: 'file',
            items: resources.pages,
            itemContextMenu: {
                'This page': '---',
                'Rename': function() { view.onClickRenamePage(); },
                'Copy': function() { view.onClickCopyPage(); },
                'Cut': function() { view.onClickCutPage(); },
                'Paste': function() { view.onClickPastePage(); },
                'Remove': function() { view.onClickRemovePage(); }
            },
            paneContextMenu: {
                'General': '---',
                'Create new': function() { view.onClickNewPage(); }
            },
            sort: function(item, queueItem) {
                queueItem.$element.attr('data-content-id', item.id);
                queueItem.parentDirAttr = {'data-content-id': item.parentId };
            }
        });

        this.renderPane({
            label: 'Sections',
            route: '/sections/',
            icon: 'th',
            items: resources.sections,
            sort: function(item, queueItem) {
                queueItem.$element.attr('data-content-id', item.id);
                queueItem.parentDirAttr = {'data-content-id': item.parentId };
            }

        });
        
        this.renderPane({
            label: 'Media',
            route: '/media/',
            icon: 'file-image-o',
            items: resources.media,
            itemContextMenu: {
                'This media': '---',
                'Remove': function() { view.onClickRemoveMedia(); }
            },
            paneContextMenu: {
                'General': '---',
                'Upload new media': function() { view.onClickUploadMedia(); }
            }
        });
        
        this.renderPane({
            label: 'Schemas',
            route: '/schemas/',
            icon: 'gears',
            items: resources.schemas,
            sort: function(item, queueItem) {
                queueItem.$element.attr('data-schema-id', item.id);
                
                if(item.parentSchemaId) {
                    queueItem.parentDirAttr = {'data-schema-id': item.parentSchemaId };

                } else {
                    let schemaId = parseInt(item.id);

                    // We only want to create parent directories for fields
                    if(schemaId >= 20000) {
                        queueItem.createDir = true;
                        queueItem.parentDirAttr = {'data-schema-type': 'Fields'};
                    }
                }
            }
        });

        this.renderPane({
            label: 'Settings',
            route: '/settings/',
            icon: 'wrench',
            items: [
                {
                    name: 'Something',
                    path: 'something'
                }
            ]
        });
    }
}

module.exports = NavbarMain;
