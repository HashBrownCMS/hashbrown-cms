module.exports = function() {
    let currentUser = HashBrown.Models.User.current;
    let currentProject = HashBrown.Helpers.ProjectHelper.currentProject;

    let hasConnectionsScope = currentUser.hasScope(currentProject, 'connections');
    let hasSchemasScope = currentUser.hasScope(currentProject, 'schemas');
    let hasSettingsScope = currentUser.hasScope(currentProject, 'settings');
     
    return _.nav({class: 'navbar-main'},
        // Buttons
        _.div({class: 'navbar-main__tabs'},
            _.a({href: '/', class: 'navbar-main__tab'},
                _.img({src: '/svg/logo_white.svg', class: 'navbar-main__tab__icon'}),
                _.div({class: 'navbar-main__tab__label'}, 'Dashboard')
            ),            
            _.each(this.tabPanes, (i, pane) => {
                return _.button({class: 'navbar-main__tab', 'data-route': pane.route, title: pane.label},
                    _.div({class: 'navbar-main__tab__icon fa fa-' + pane.icon}),
                    _.div({class: 'navbar-main__tab__label'}, pane.label)
                ).on('click', (e) => { this.onClickTab(e); });
            })
        ),

        // Panes
        _.div({class: 'navbar-main__panes'},
            _.each(this.tabPanes, (i, pane) => {
                let queue = [];

                let sortingOptions = {
                    default: 'Default',
                    alphaAsc: 'A → Z',
                    alphaDesc: 'Z → A'
                };

                if(pane.label === 'Content') {
                    sortingOptions.dateAsc = 'Old → new';
                    sortingOptions.dateDesc = 'New → old';
                }

                let $pane = _.div({class: 'navbar-main__pane', 'data-route': pane.route},
                    // Filter/sort bar
                    _.div({class: 'navbar-main__pane__filter-sort-bar'},
                        _.div({class: 'widget-group'},
                            new HashBrown.Views.Widgets.Input({
                                placeholder: 'Filter',
                                onChange: (newValue) => { this.onChangeFilter($pane, pane, newValue); },
                                type: 'text'
                            }),
                            new HashBrown.Views.Widgets.Dropdown({
                                placeholder: 'Sort',
                                options: sortingOptions,
                                onChange: (newValue) => { this.onChangeSorting($pane, pane, newValue); }
                            })
                        )
                    ),

                    // Move buttons
                    _.div({class: 'navbar-main__pane__move-buttons widget-group'},
                        _.button({class: 'widget widget--button low expanded navbar-main__pane__move-button navbar-main__pane__move-button--root-dir'}, 'Move to root'),
                        _.button({class: 'widget widget--button low expanded navbar-main__pane__move-button navbar-main__pane__move-button--new-dir'}, 'New folder')
                    ),

                    // Items
                    _.div({class: 'navbar-main__pane__items'},
                        _.each(pane.settings.items || pane.settings.getItems(), (i, item) => {
                            let id = item.id || i;
                            let name = this.getItemName(item);
                            let icon = this.getItemIcon(item, pane.settings);
                            let routingPath = this.getItemRoutingPath(item, pane.settings);
                            let isDirectory = this.isItemDirectory(item);
                            let queueItem = {};
                            let hasRemote = item.sync ? item.sync.hasRemote : false;
                            let isRemote = item.sync ? item.sync.isRemote : false;

                            let $item = _.div(
                                {
                                    class: 'navbar-main__pane__item',
                                    'data-routing-path': routingPath,
                                    'data-locked': item.isLocked,
                                    'data-remote': isRemote,
                                    'data-local': hasRemote,
                                    'data-is-directory': isDirectory,
                                    'data-sort': item.sort || 0,
                                    'data-update-date': item.updateDate || item.createDate
                                },
                                _.a({
                                    'data-id': id,
                                    'data-name': name,
                                    href: '#' + (routingPath ? pane.route + routingPath : pane.route),
                                    class: 'navbar-main__pane__item__content'
                                },
                                    _.div({class: 'navbar-main__pane__item__icon fa fa-' + icon}),
                                    _.div({class: 'navbar-main__pane__item__label'}, name)
                                ),
                                _.div({class: 'navbar-main__pane__item__children'}),
                                _.div({class: 'navbar-main__pane__item__insert-below'})
                            );

                            // Attach item context menu
                            if(pane.settings.getItemContextMenu) {
                                UI.context($item.find('a')[0], pane.settings.getItemContextMenu(item));

                            } else if(pane.settings.itemContextMenu) {
                                UI.context($item.find('a')[0], pane.settings.itemContextMenu);

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
                    UI.context($pane[0], pane.settings.paneContextMenu);
                }
                
                return $pane;
            })
        ),

        // Toggle button (mobile only)
        _.button({class: 'navbar-main__toggle'})
            .click((e) => {
                $('.page--environment__space--nav').toggleClass('expanded');
            })
    );
};
