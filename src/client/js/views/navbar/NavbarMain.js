'use strict';

// Views
let MessageModal = require('../MessageModal');

// Models
let Content = require('../../../../common/models/Content');

// Panes
let CMSPane = require('./CMSPane');
let ConnectionPane = require('./ConnectionPane');
let ContentPane = require('./ContentPane');
let FormsPane = require('./FormsPane');
let MediaPane = require('./MediaPane');
let SchemaPane = require('./SchemaPane');
let SettingsPane = require('./SettingsPane');
let TemplatePane = require('./TemplatePane');

/**
 * The main navbar
 */
class NavbarMain extends View {
    constructor(params) {
        super(params);

        this.connectionPane = ConnectionPane;
        this.contentPane = ContentPane;
        this.formsPane = FormsPane;
        this.mediaPane = MediaPane;
        this.schemaPane = SchemaPane;

        this.$element = _.nav({class: 'navbar-main'},
            _.div({class: 'tab-buttons'}),
            _.div({class: 'tab-panes'})
        );
        
        $('.navspace').html(this.$element);

        this.fetch();
    }
    
    /**
     * Event: Error was returned
     */
    onError(err) {
        UI.errorModal(err);
    }
    
    /**
     * Event: Click copy item id
     */
    onClickCopyItemId() {
        let id = $('.context-menu-target-element').data('id');

        copyToClipboard(id);
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
            _.div({class: 'pane-icon'},
                $icon
            ),
            _.div({class: 'pane-text'},
                _.span({class: 'pane-label'}, params.label),
                params.sublabel ? _.span({class: 'pane-sublabel'}, params.sublabel) : ''
            )
        ).click(function() {
            let $currentTab = view.$element.find('.pane-container.active');

            if(params.route == $currentTab.attr('data-route')) {
                location.hash = params.route;
            
            } else {
                view.showTab(params.route);
            
            }
        });
        
        let $pane = _.div({class: 'pane'});

        let items = params.items;
        let sortingQueue = [];

        // Items
        $pane.append(
            _.each(items, function(i, item) {
                let id = item.id || i;
                let isDirectory = false;

                // Get item name
                let name = '';

                // This is a Content node
                if(item.properties && item.createDate) {
                    // All Content nodes are "directories" in that they can be parents of one another
                    isDirectory = true;

                    // Use title directly if available
                    if(typeof item.properties.title === 'string') {
                        name = item.properties.title;

                    } else if(item.properties.title && typeof item.properties.title === 'object') {
                        // Use the current language title
                        if(item.properties.title[window.language]) {
                            name = item.properties.title[window.language];

                        // If no title was found, searh in other languages
                        } else {
                            name = '(Untitled)';

                            for(let language in item.properties.title) {
                                let languageTitle = item.properties.title[language];

                                if(languageTitle) {
                                    name += ' - (' + language + ': ' + languageTitle + ')';
                                    break;
                                }
                            }
                        }
                    }

                    // If name still wasn't found, use the id
                    if(!name) {
                        name = item.id;
                    }
                
                } else if(item.title && typeof item.title === 'string') {
                    name = item.title;

                } else if(item.name && typeof item.name === 'string') {
                    name = item.name;

                } else {
                    name = id;

                }

                let routingPath = item.shortPath || item.path || item.id || null;
                let queueItem = {};
                let icon = item.icon;
                let $icon;

                // Implement custom routing paths
                if(typeof params.itemPath === 'function') {
                    routingPath = params.itemPath(item);
                }

                // Truncate long names
                if(name.length > 30) {
                    name = name.substring(0, 30) + '...';
                }

                // If this item has a Schema id, fetch the appropriate icon
                if(item.schemaId) {
                    let schema = resources.schemas[item.schemaId];

                    if(schema) {
                        icon = schema.icon;
                    }
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
                        href: '#' + (routingPath ? params.route + routingPath : params.route),
                        class: 'pane-item'
                    },
                        $icon,
                        _.span({class: 'pane-item-label'}, name)
                    ),
                    _.div({class: 'children'}),
                    _.div({class: 'pane-item-insert-below'})
                );

                // Set sync attributes
                if(typeof item.locked !== 'undefined') {
                    $element.attr('data-locked', item.locked);
                }
                
                if(typeof item.remote !== 'undefined') {
                    $element.attr('data-remote', item.remote);
                }
                
                if(typeof item.local !== 'undefined') {
                    $element.attr('data-local', item.local);
                }
                
                if(isDirectory) {
                    $element.attr('data-is-directory', true);
                }

                // Attach item context menu
                if(params.getItemContextMenu) {
                    $element.find('a').exocontext(params.getItemContextMenu(item));

                } else if(params.itemContextMenu) {
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
                if(!item.locked && typeof params.onEndDrag === 'function') {
                    $element.exodragdrop({
                        lockX: true,
                        onEndDrag: params.onEndDrag
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
                            $dir = _.div({class: 'pane-item-container', 'data-is-directory': true},
                                _.a({
                                    class: 'pane-item'
                                },
                                    _.span({class: 'fa fa-folder'}),
                                    _.span({class: 'pane-item-label'}, dirName)
                                ),
                                _.div({class: 'children'})
                            );
                            
                            $dir.attr(parentDirAttrKey, finalDirName);

                            // Extra parent dir attributes
                            if(queueItem.parentDirExtraAttr) {
                                for(let k in queueItem.parentDirExtraAttr) {
                                    let v = queueItem.parentDirExtraAttr[k];

                                    $dir.attr(k, v);
                                }
                            }
                   
                            // Append to previous dir 
                            let $prevDir = $pane.find('[' + parentDirAttrKey + '="' + prevFinalDirName + '"]');
                            
                            if($prevDir.length > 0) {
                                $prevDir.children('.children').prepend($dir);

                            // If no previous dir was found, append directly to pane
                            } else {
                                $pane.prepend($dir); 
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
            _.if(params.toolbar,
                params.toolbar
            ),
            _.div({class: 'pane-move-buttons'},
                _.button({class: 'btn btn-move-to-root'}, 'Move to root'),
                _.button({class: 'btn btn-new-folder'}, 'New folder')
            ),
            $pane
        );

        // Attach pane context menu
        if(params.paneContextMenu) {
            $paneContainer.exocontext(params.paneContextMenu);
        }
        
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
    
    static reload() {
        let view = ViewHelper.get('NavbarMain').reload();
    }

    /**
     * Highlights an item
     */
    highlightItem(route) {
        let view = this;

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
    }

    clear() {
        this.$element.find('.tab-buttons').empty();
        this.$element.find('.tab-panes').empty();
    }

    render() {
        let view = this;

        this.clear();

        let isAdmin = User.current.isAdmin;
        let hasConnectionsScope = User.current.hasScope(ProjectHelper.currentProject, 'connections');
        let hasSchemasScope = User.current.hasScope(ProjectHelper.currentProject, 'schemas');
        let hasTemplatesScope = User.current.hasScope(ProjectHelper.currentProject, 'templates');
        let hasSettingsScope = User.current.hasScope(ProjectHelper.currentProject, 'settings');
        
        // Render the "cms" pane
        this.renderPane(CMSPane.getRenderSettings());

        // Render the "content" pane
        this.renderPane(ContentPane.getRenderSettings());
        
        // Render the "media" pane
        this.renderPane(MediaPane.getRenderSettings());
        
        // Render the "forms" pane
        this.renderPane(FormsPane.getRenderSettings());
        
        // Render the "templates" pane
        if(isAdmin || hasTemplatesScope) {
            this.renderPane(TemplatePane.getRenderSettings());
        }
        
        // Render the "connections" pane
        if(isAdmin || hasConnectionsScope) {
            this.renderPane(ConnectionPane.getRenderSettings());
        }
        
        // Render the "schemas" pane
        if(isAdmin || hasSchemasScope) {
            this.renderPane(SchemaPane.getRenderSettings());
        }
        
        // Render the "settings" pane
        if(isAdmin || hasSettingsScope) {
            this.renderPane(SettingsPane.getRenderSettings());
        }
    }
}

module.exports = NavbarMain;
