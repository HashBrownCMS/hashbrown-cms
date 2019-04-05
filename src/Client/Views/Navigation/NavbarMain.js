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

        this.fetch();
        
        $('.page--environment__space--nav').html(this.$element);
    }
  
    /**
     * Fetches content
     */
    async fetch() {
        for(let pane of this.getPanes()) {
            if(typeof pane.getItems !== 'function') { continue; }

            pane.items = await pane.getItems();
        }

        super.fetch();
    }

    /**
     * Gets all panes
     *
     * @return {Array} Panes
     */
    getPanes() {
        let panes = [];
        
        for(let name in HashBrown.Views.Navigation) {
            let pane = HashBrown.Views.Navigation[name];
            
            if(pane.prototype instanceof HashBrown.Views.Navigation.NavbarPane) {
                panes.push(pane);
            }
        }

        return panes;
    }

    /**
     * Event: Change filter
     *
     * @param {HTMLElement} $pane
     * @param {NavbarPane} pane
     * @param {String} search
     */
    onChangeFilter($pane, pane, search) {
        search = search.toLowerCase();

        $pane.find('.navbar-main__pane__item').each((i, item) => {
            let label = item.querySelector('.navbar-main__pane__item__label').innerText.toLowerCase();

            item.classList.toggle('filter-not-matched', label.indexOf(search) < 0);
        });
    }

    /**
     * Event: Change sorting
     *
     * @param {HTMLElement} $pane
     * @param {NavbarPane} pane
     * @param {String} sortingMethod
     */
    onChangeSorting($pane, pane, sortingMethod) {
        this.applySorting($pane, pane, sortingMethod);
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
        e.preventDefault();
        
        location.hash = e.currentTarget.dataset.route;
        
        $('.navbar-main__pane__item.active').toggleClass('active', false);
        $('.page--environment__space--nav').toggleClass('expanded', true);
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
        this.$element.toggleClass('hide-tabs', !isActive);
    }

    /**
     * Shows a tab
     *
     * @param {String} tabName
     */
    showTab(tabRoute) {
        this.ready(() => {
            for(let element of Array.from(this.element.querySelectorAll('.navbar-main__pane, .navbar-main__tab'))) {
                element.classList.toggle('active', element.dataset.route === tabRoute);
            }
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
            scroll: $('.navbar-main__pane.active .navbar-main__pane__items').scrollTop() || 0
        };
        
        this.$element.find('.navbar-main__tab').each((i, element) => {
            let key = element.dataset.route;

            if(!key) { return; }

            this.state.buttons[key] = element.className;
        });
        
        this.$element.find('.navbar-main__pane').each((i, element) => {
            let key = element.dataset.route;

            this.state.panes[key] = element.className;
        });

        this.$element.find('.navbar-main__pane__item').each((i, element) => {
            let key = element.dataset.routingPath || element.dataset.mediaFolder;

            this.state.items[key] = element.className.replace('loading', '');
        });
    }

    /**
     * Restores the navbar state
     */
    restore() {
        if(!this.state) { return; }

        // Restore tab buttons
        this.$element.find('.navbar-main__tab').each((i, element) => {
            let key = element.dataset.route;

            if(key && this.state.buttons[key]) {
                element.className = this.state.buttons[key];
            }
        });
        
        // Restore pane containers
        this.$element.find('.navbar-main__pane').each((i, element) => {
            let key = element.dataset.route;

            if(key && this.state.panes[key]) {
                element.className = this.state.panes[key];
            }
        });

        // Restore pane items
        this.$element.find('.navbar-main__pane__item').each((i, element) => {
            let key = element.dataset.routingPath || element.dataset.mediaFolder;

            if(key && this.state.items[key]) {
                element.className = this.state.items[key];
            }
        });

        // Restore scroll position
        $('.navbar-main__pane.active .navbar-main__pane__items').scrollTop(this.state.scroll || 0);

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
    
    /**
     * Static version of the reload method
     */
    static reload() {
        Crisp.View.get('NavbarMain').reload();
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
        // TODO: Find an async solution for this
        //if(item.schemaId) {
        //    let schema = HashBrown.Helpers.SchemaHelper.getSchemaByIdSync(item.schemaId);

        //    if(schema) {
        //        return schema.icon;
        //    }
        //}

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

        this.$element.find('.navbar-main__pane.active .navbar-main__pane__item').each((i, element) => {
            let $item = $(element);
            let id = ($item.children('a').attr('data-id') || '').toLowerCase();
            let routingPath = ($item.attr('data-routing-path') || '').toLowerCase();

            $item.toggleClass('active', false);
            
            if(
                id == route.toLowerCase() ||
                routingPath == route.toLowerCase()
            ) {
                $item.toggleClass('active', true);
                $item.parents('.navbar-main__pane__item').toggleClass('open', true);
            }
        });
    }

    /**
     * Clears all content within the navbar
     */
    clear() {
        this.$element.find('.navbar-main__tabs').empty();
        this.$element.find('.navbar-main__panes').empty();
    }

    /**
     * Applies item sorting
     *
     * @param {HTMLElement} $pane
     * @param {Object} pane
     * @param {String} sortingMethod
     */
    applySorting($pane, pane, sortingMethod) {
        let performSort = (a, b) => {
            switch(sortingMethod) {
                case 'alphaAsc':
                    return a.querySelector('.navbar-main__pane__item__label').innerText > b.querySelector('.navbar-main__pane__item__label').innerText ? 1 : -1;
                
                case 'alphaDesc':
                    return a.querySelector('.navbar-main__pane__item__label').innerText < b.querySelector('.navbar-main__pane__item__label').innerText ? 1 : -1;
                
                case 'dateAsc':
                    return new Date(a.dataset.updateDate) > new Date(b.dataset.updateDate) ? 1 : -1;
                
                case 'dateDesc':
                    return new Date(a.dataset.updateDate) < new Date(b.dataset.updateDate) ? 1 : -1;

                default:
                    return parseInt(a.dataset.sort) > parseInt(b.dataset.sort) ? 1 : -1;
            }
        };

        // Sort direct and nested children
        $pane.find('.navbar-main__pane__items, .navbar-main__pane__item .navbar-main__pane__item__children').each((i, container) => {
            let $nestedChildren = $(container).find('>.navbar-main__pane__item');
            $nestedChildren.sort(performSort);
            $nestedChildren.appendTo($(container));
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
            let parentDirSelector = '.navbar-main__pane__item[' + parentDirAttrKey + '="' + parentDirAttrValue + '"]';
            let $parentDir = $pane.find(parentDirSelector);

            // If parent element already exists, just append the queue item element
            if(parentDirAttrKey && parentDirAttrValue && $parentDir.length > 0) {
                $parentDir.children('.navbar-main__pane__item__children').append(queueItem.$element);
            
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
                        $dir = _.div({class: 'navbar-main__pane__item', 'data-is-directory': true},
                            _.a({
                                class: 'navbar-main__pane__item__content'
                            },
                                _.span({class: 'navbar-main__pane__item__icon fa fa-folder'}),
                                _.span({class: 'navbar-main__pane__item__label'}, dirName),
                                
                                // Toggle button
                                _.button({class: 'navbar-main__pane__item__toggle-children'})
                                    .click((e) => { this.onClickToggleChildren(e); })
                            ),
                            _.div({class: 'navbar-main__pane__item__children'})
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
                            $prevDir.children('.navbar-main__pane__item__children').prepend($dir);

                        // If no previous dir was found, append directly to pane
                        } else {
                            $pane.children('.navbar-main__pane__items').prepend($dir); 
                        }
                        
                        // Attach item context menu
                        if(pane.settings.getDirContextMenu) {
                            UI.context($dir[0], pane.settings.getDirContextMenu());
                        }
                    }
                   
                    // Only append the queue item to the final parent element
                    if(i >= dirNames.length - 1) {
                        $parentDir = $dir;
                    } 
                }

                $parentDir.children('.navbar-main__pane__item__children').append(queueItem.$element);
            }

            // Add expand/collapse buttons
            if($parentDir.children('.navbar-main__pane__item__content').children('.navbar-main__pane__item__toggle-children').length < 1) {
                $parentDir.children('.navbar-main__pane__item__content').append(
                    _.button({class: 'navbar-main__pane__item__toggle-children'})
                        .click((e) => { this.onClickToggleChildren(e); })
                );
            }
        }
    }
}

module.exports = NavbarMain;
