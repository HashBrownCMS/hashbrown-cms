'use strict';

/**
 * The main navbar
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class NavbarMain extends Crisp.View {
    constructor(params) {
        super(params);

        this.template = require('Client/Templates/Navigation/NavbarMain');
        this.tabPanes = [];

        HashBrown.Views.Navigation.ContentPane.init();
        HashBrown.Views.Navigation.MediaPane.init();
        HashBrown.Views.Navigation.FormsPane.init();
        HashBrown.Views.Navigation.TemplatePane.init();
        HashBrown.Views.Navigation.ConnectionPane.init();
        HashBrown.Views.Navigation.SchemaPane.init();

        this.fetch();
        
        $('.page--environment__space--nav').html(this.$element);
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
        let id = $('.context-menu-target').data('id');

        copyToClipboard(id);
    }

    /**
     * Event: Click tab
     */
    onClickTab(e) {
        let route = e.currentTarget.dataset.route;
        let $currentTab = this.$element.find('.pane-container.active');

        if(route == $currentTab.attr('data-route')) {
            location.hash = route;
        
        } else {
            this.showTab(route);
        
        }
    }

    /**
     * Event: Toggle children
     */
    onClickToggleChildren(e) {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.parentElement.parentElement.classList.toggle('open');
    }

    /**
     * Toggles the tab buttons
     *
     * @param {Boolean} isActive
     */
    toggleTabButtons(isActive) {
        this.$element.toggleClass('hide-tab-buttons', !isActive);
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
	 * Saves the navbar state
	 */
	save() {
		this.state = {
			buttons: {},
			panes: {},
			items: {},
            scroll: $('.pane-container.active .pane').scrollTop() || 0
		};
		
		this.$element.find('.tab-buttons button').each((i, element) => {
			let $button = $(element);
			let key = $button.data('route');

			this.state.buttons[key] = $button[0].className;
		});
		
		this.$element.find('.pane-container').each((i, element) => {
			let $pane = $(element);
			let key = $pane.data('route');

			this.state.panes[key] = $pane[0].className;
		});

		this.$element.find('.pane-item-container').each((i, element) => {
			let $item = $(element);
			let key = $item.data('routing-path');

			this.state.items[key] = $item[0].className.replace('loading', '');
		});
	}

	/**
	 * Restores the navbar state
	 */
	restore() {
		if(!this.state) { return; }

        // Restore tab buttons
		this.$element.find('.tab-buttons button').each((i, element) => {
			let $button = $(element);
			let key = $button.data('route');

			if(this.state.buttons[key]) {
				$button[0].className = this.state.buttons[key];
			}
		});
		
        // Restore pane containers
		this.$element.find('.pane-container').each((i, element) => {
			let $pane = $(element);
			let key = $pane.data('route');

			if(this.state.panes[key]) {
				$pane[0].className = this.state.panes[key];
			}
		});

        // Restore pane items
		this.$element.find('.pane-item-container').each((i, element) => {
			let $item = $(element);
			let key = $item.data('routing-path');

			if(this.state.items[key]) {
				$item[0].className = this.state.items[key];
			}
		});

        $('.pane-container.active .pane').scrollTop(this.state.scroll || 0);

		this.state = null;
	}

    /**
     * Reloads this view
     */
    reload() {
		this.save();
        
		this.fetch();

		this.restore();
    }
    
    static reload() {
        Crisp.View.get('NavbarMain').reload();
    }

    /**
     * Adds a tab pane
     *
     * @param {String} route
     * @param {Object} settings
     */
    static addTabPane(route, label, icon, settings) {
        Crisp.View.get('NavbarMain').tabPanes.push({
            label: label,
            route: route,
            icon: icon,
            settings: settings
        });
    }

    /**
     * Gets the icons of an item
     *
     * @param {Object} item
     * @param {Object} settings
     *
     * @returns {String} Icon name
     */
    getItemIcon(item, settings) {
        // If this item has a Schema id, fetch the appropriate icon
        if(item.schemaId) {
            let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);

            if(schema) {
                return schema.icon;
            }
        }

        return item.icon || settings.icon || 'file';
    }

    /**
     * Gets whether the item is a directory
     *
     * @param {Object} item
     *
     * @return {Boolean} Is directory
     */
    isItemDirectory(item) {
        if(item.properties && item.createDate) {
            return true;
        }

        return false;
    }

    /**
     * Gets the routing path for an item
     *
     * @param {Object} item
     * @param {Object} settings
     *
     * @returns {String} Routing path
     */
    getItemRoutingPath(item, settings) {
        if(typeof settings.itemPath === 'function') {
            return settings.itemPath(item);
        }

        return item.shortPath || item.path || item.id || null;
    }

    /**
     * Gets the name of an item
     *
     * @param {Object} item
     *
     * @returns {String} Item name
     */
    getItemName(item) {
        let name = '';

        // This is a Content node
        if(item.properties && item.createDate) {
            // Use title directly if available
            if(typeof item.properties.title === 'string') {
                name = item.properties.title;

            } else if(item.properties.title && typeof item.properties.title === 'object') {
                // Use the current language title
                if(item.properties.title[window.language]) {
                    name = item.properties.title[window.language];

                // If no title was found, search in other languages
                } else {
                    name = 'Untitled';

                    for(let language in item.properties.title) {
                        let languageTitle = item.properties.title[language];

                        if(languageTitle) {
                            name += ' - (' + language + ': ' + languageTitle + ')';
                            break;
                        }
                    }
                }
            }

            if(!name || name === 'Untitled') {
                name = 'Untitled (id: ' + item.id.substring(0, 6) + '...)';
            }
        
        } else if(item.title && typeof item.title === 'string') {
            name = item.title;

        } else if(item.name && typeof item.name === 'string') {
            name = item.name;

        } else {
            name = item.id;

        }

        return name;
    }

    /**
     * Highlights an item
     */
    highlightItem(tab, route) {
        this.showTab(tab);

        this.$element.find('.pane-container.active .pane-item-container').each((i, element) => {
            let $item = $(element);
            let id = ($item.children('a').attr('data-id') || '').toLowerCase();
            let routingPath = ($item.attr('data-routing-path') || '').toLowerCase();

            $item.toggleClass('active', false);
            
            if(
                id == route.toLowerCase() ||
                routingPath == route.toLowerCase()
            ) {
                $item.toggleClass('active', true);
                $item.parents('.pane-item-container').toggleClass('open', true);
            }
        });
    }

    /**
     * Clears all content within the navbar
     */
    clear() {
        this.$element.find('.tab-buttons').empty();
        this.$element.find('.tab-panes').empty();
    }

    /**
     * Applies item sorting
     *
     * @param {HTMLElement} $pane
     * @param {Object} pane
     */
    applySorting($pane, pane) {
        $pane = $pane.children('.pane');

        // Sort direct children
        $pane.find('>.pane-item-container').sort((a, b) => {
            return parseInt(a.dataset.sort) > parseInt(b.dataset.sort) ? 1 : -1;
        }).appendTo($pane);
        
        // Sort nested children
        $pane.find('.pane-item-container .children').each((i, children) => {
            let $children = $(children);

            $children.find('>.pane-item-container').sort((a, b) => {
                return parseInt(a.dataset.sort) > parseInt(b.dataset.sort) ? 1 : -1;
            }).appendTo($children);
        });
    }

    /**
     * Applies item hierarchy
     *
     * @param {HTMLElement} $pane
     * @param {Object} pane
     * @param {Array} queue
     */
    applyHierarchy($pane, pane, queue) {
        for(let queueItem of queue) {
            if(!queueItem.parentDirAttr) { continue; } 

            // Find parent item
            let parentDirAttrKey = Object.keys(queueItem.parentDirAttr)[0];
            let parentDirAttrValue = queueItem.parentDirAttr[parentDirAttrKey];
            let parentDirSelector = '.pane-item-container[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
            let $parentDir = $pane.find(parentDirSelector);

            // If parent element already exists, just append the queue item element
            if(parentDirAttrKey && parentDirAttrValue && $parentDir.length > 0) {
                $parentDir.children('.children').append(queueItem.$element);
            
            // If not, create parent elements if specified
            } else if(queueItem.createDir) {
                let dirNames = parentDirAttrValue.split('/').filter((item) => { return item != ''; });
                let finalDirName = '/';

                // Create a folder for each directory name in the path
                for(let i in dirNames) {
                    let dirName = dirNames[i];

                    let prevFinalDirName = finalDirName;
                    finalDirName += dirName + '/';

                    // Look for an existing directory element
                    let $dir = $pane.find('[' + parentDirAttrKey + '="' + finalDirName + '"]');

                    // Create it if not found
                    if($dir.length < 1) {
                        $dir = _.div({class: 'pane-item-container', 'data-is-directory': true},
                            _.a({
                                class: 'pane-item'
                            },
                                _.span({class: 'fa fa-folder'}),
                                _.span({class: 'pane-item-label'}, dirName),
                                
                                // Toggle button
                                _.button({class: 'btn-children-toggle'},
                                    _.span({class:'fa fa-caret-down'}),
                                    _.span({class:'fa fa-caret-right'})
                                ).click((e) => { this.onClickToggleChildren(e); })
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
                            $pane.children('.pane').prepend($dir); 
                        }
                        
                        // Attach item context menu
                        if(pane.settings.dirContextMenu) {
                            UI.context($dir[0], pane.settings.dirContextMenu);
                        }
                    }
                   
                    // Only append the queue item to the final parent element
                    if(i >= dirNames.length - 1) {
                        $parentDir = $dir;
                    } 
                }

                $parentDir.children('.children').append(queueItem.$element);
            }

            // Add expand/collapse buttons
            if($parentDir.children('.pane-item').children('.btn-children-toggle').length < 1) {
                $parentDir.children('.pane-item').append(
                    _.button({class: 'btn-children-toggle'},
                        _.span({class:'fa fa-caret-down'}),
                        _.span({class:'fa fa-caret-right'})
                    ).click((e) => { this.onClickToggleChildren(e); })
                );
            }
        }
    }
}

module.exports = NavbarMain;
