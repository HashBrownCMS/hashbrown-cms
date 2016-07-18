'use strict';

// Views
let MessageModal = require('../MessageModal');

// Models
let Content = require('../../../../common/models/Content');

// Panes
let ConnectionPane = require('./ConnectionPane');
let ContentPane = require('./ContentPane');
let FormsPane = require('./FormsPane');
let MediaPane = require('./MediaPane');
let SchemaPane = require('./SchemaPane');

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
     * Event: Click copy item id
     */
    onClickCopyItemId() {
        let id = $('.context-menu-target-element').data('id');

        copyToClipboard(id);
    }


    /**
     * Event: Click toggle fullscreen
     */
    onClickToggleFullscreen() {
        $('.cms-container').toggleClass('fullscreen');
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
                if(typeof params.onEndDrag === 'function') {
                    $element.exodragdrop({
                        lockX: true,
                        onEndDrag: params.onEndDrag,
                        dropContainerSelector: '.pane-container.active, .pane-container.active .pane-item-container .children' 
                    });
                }

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
                let id = ($item.children('a').attr('data-id') || '').toLowerCase();
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

        resetReady('navbar');

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
                    label: 'HashBrown',
                    route: '/',
                    $icon: _.img({src: '/svg/logo.svg', class: 'about-logo'}),
                    items: [
                        {
                            name: 'Readme',
                            path: 'readme'
                        },
                        {
                            name: 'License',
                            path: 'license'
                        }
                    ]
                });

                // Render the "content" pane
                this.renderPane(ContentPane.getRenderSettings());
                
                // Render the "media" pane
                this.renderPane(MediaPane.getRenderSettings());
                
                // Render the "forms" pane
                this.renderPane(FormsPane.getRenderSettings());
                
                // Render the "connections" pane
                if(scopes.indexOf('connections') > -1) {
                    this.renderPane(ConnectionPane.getRenderSettings());
                }
                
                // Render the "schemas" pane
                if(scopes.indexOf('schemas') > -1) {
                    this.renderPane(SchemaPane.getRenderSettings());
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
                // Render the "users" pane
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

                $('.cms-container').removeClass('faded');
            },
            error: () => {

            }
        });

        // Insert into DOM
        $('.navspace').html(this.$element);
    }
}

module.exports = NavbarMain;
