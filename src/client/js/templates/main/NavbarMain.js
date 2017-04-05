module.exports = function() {
    let isAdmin = User.current.isAdmin;
    let hasConnectionsScope = User.current.hasScope(ProjectHelper.currentProject, 'connections');
    let hasSchemasScope = User.current.hasScope(ProjectHelper.currentProject, 'schemas');
    let hasTemplatesScope = User.current.hasScope(ProjectHelper.currentProject, 'templates');
    let hasSettingsScope = User.current.hasScope(ProjectHelper.currentProject, 'settings');
     
    /**
     * Fetches pane information and renders it
     *
     * @param {Object} params
     */
    let renderPane = (params) => {
        // Render pane 
        let $pane = $('.pane-container[data-route="' + params.route + '"] .pane');

        // Pane didn't exist, create it (it will be appended further down)
        if($pane.length < 1) {
            $pane = _.div({class: 'pane'});
        }

        let items = params.items;
        let sortingQueue = [];

        // Render items
        _.each(items, (i, item) => {
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
            let icon = item.icon || params.icon;
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
            let $existingElement = $pane.find('.pane-item-container[data-routing-path="' + routingPath + '"]');
            let $element =  _.div({
                class: 'pane-item-container',
                'data-routing-path': routingPath
            });
            
            // Element exists already, replace
            if($existingElement.length > 0) {
                $existingElement.replaceWith($element);
            
            // Element didn't exist already, create it and append to pane
            } else {
                $pane.append($element);

            }

            // Populate element
            _.append($element.empty(),
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

            // Add sort index to element
            queueItem.$element.attr('data-sort', item.sort || 0); 

            // Use specific hierarchy behaviours
            if(params.hierarchy) {
                params.hierarchy(item, queueItem);
            }

            // Add queue item to sorting queue
            sortingQueue.push(queueItem);
        });

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

        // Sort direct children
        $pane.find('>.pane-item-container').sort((a, b) => {
            return parseInt(a.dataset.sort) > parseInt(b.dataset.sort);
        }).appendTo($pane);
        
        // Sort nested children
        $pane.find('.pane-item-container .children').each((i, children) => {
            let $children = $(children);

            $children.find('>.pane-item-container').sort((a, b) => {
                return parseInt(a.dataset.sort) > parseInt(b.dataset.sort);
            }).appendTo($children);
        });

        // Render pane container
        let $paneContainer = $('.pane-container[data-route="' + params.route + '"]');

        // Pane container didn't already exist, create it
        if($paneContainer.length < 1) {
            // Render pane container
            $paneContainer = _.div({class: 'pane-container', 'data-route': params.route},
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

                $childrenToggle.click((e) => { this.onClickToggleChildren(e); });
            }
        });
        
        if(params.postSort) {
            params.postSort($paneContainer.find('>.pane, .pane-item-container>.children'));
        }
/*
        if(this.$element.find('.tab-panes .pane-container').length < 1) {
            $paneContainer.addClass('active');
            $button.addClass('active');
        }
*/
        return $paneContainer;
    }

    return _.nav({class: 'navbar-main'},
        // Buttons
        _.div({class: 'tab-buttons'},
            _.each(this.tabPanes, (i, pane) => {
                let $icon = pane.icon;

                if(typeof pane.icon === 'string') {
                    $icon = _.span({class: 'fa fa-' + pane.icon});
                }

                return _.button({'data-route': pane.route, title: pane.label},
                    _.div({class: 'pane-icon'}, $icon),
                    _.div({class: 'pane-text'},
                        _.span({class: 'pane-label'}, pane.label)
                    )
                ).click((e) => { this.onClickTab(e); });
            })
        ),

        // Panes
        _.div({class: 'tab-panes'},
            _.each(this.tabPanes, (i, pane) => {
                let queue = [];

                let $pane = _.div({class: 'pane-container', 'data-route': pane.route},
                    // Toolbar
                    _.if(pane.settings.toolbar,
                        pane.settings.toolbar
                    ),

                    // Move buttons
                    _.div({class: 'pane-move-buttons'},
                        _.button({class: 'btn btn-move-to-root'}, 'Move to root'),
                        _.button({class: 'btn btn-new-folder'}, 'New folder')
                    ),

                    // Items
                    _.div({class: 'pane'},
                        _.each(pane.settings.items || pane.settings.getItems(), (i, item) => {
                            let id = item.id || i;
                            let name = this.getItemName(item);
                            let icon = this.getItemIcon(item, pane.settings);
                            let routingPath = this.getItemRoutingPath(item, pane.settings);
                            let isDirectory = this.isItemDirectory(item);
                            let queueItem = {};

                            let $item = _.div(
                                {
                                    class: 'pane-item-container',
                                    'data-routing-path': routingPath,
                                    'data-locked': item.locked,
                                    'data-remote': item.remote,
                                    'data-local': item.local,
                                    'data-is-directory': isDirectory,
                                    'data-sort': item.sort || 0
                                },
                                _.a({
                                    'data-id': id,
                                    'data-name': name,
                                    href: '#' + (routingPath ? pane.route + routingPath : pane.route),
                                    class: 'pane-item'
                                },
                                    _.span({class: 'fa fa-' + icon}),
                                    _.span({class: 'pane-item-label'}, name)
                                ),
                                _.div({class: 'children'}),
                                _.div({class: 'pane-item-insert-below'})
                            );

                            // Attach item context menu
                            if(pane.settings.getItemContextMenu) {
                                $item.find('a').exocontext(pane.settings.getItemContextMenu(item));

                            } else if(pane.settings.itemContextMenu) {
                                $item.find('a').exocontext(pane.settings.itemContextMenu);

                            }
                            
                            // Add element to queue item
                            queueItem.$element = $item;

                            // Use specific hierarchy behaviours
                            if(pane.settings.hierarchy) {
                                pane.settings.hierarchy(item, queueItem);
                            }

                            // Add queue item to sorting queue
                            queue.push(queueItem);

                            return $item;
                        })
                    )
                );

                this.applyHierarchy($pane, pane, queue);
                this.applySorting($pane, pane);

                // Attach pane context menu
                if(pane.settings.paneContextMenu) {
                    $pane.exocontext(pane.settings.paneContextMenu);
                }
                
                return $pane;
            })
        )
    );
};
