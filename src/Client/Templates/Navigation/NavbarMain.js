module.exports = function() {
    let currentUser = HashBrown.Common.Models.User.current;
    let hasConnectionsScope = currentUser.hasScope(ProjectHelper.currentProject, 'connections');
    let hasSchemasScope = currentUser.hasScope(ProjectHelper.currentProject, 'schemas');
    let hasTemplatesScope = currentUser.hasScope(ProjectHelper.currentProject, 'templates');
    let hasSettingsScope = currentUser.hasScope(ProjectHelper.currentProject, 'settings');
     
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
                                $item.find('a').crcontext(pane.settings.getItemContextMenu(item));

                            } else if(pane.settings.itemContextMenu) {
                                $item.find('a').crcontext(pane.settings.itemContextMenu);

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
                    $pane.crcontext(pane.settings.paneContextMenu);
                }
                
                return $pane;
            })
        )
    );
};
