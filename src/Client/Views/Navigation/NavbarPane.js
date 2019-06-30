'use strict';

/**
 * A navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class NavbarPane extends Crisp.View {
    static get route() { return ''; }
    static get label() { return ''; }
    static get scope() { return ''; }
    static get icon() { return ''; }
    static get hasFolders() { return true; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        for(let pane of Crisp.View.getAll(HashBrown.Views.Navigation.NavbarPane)) {
            if(pane === this) { continue; }

            pane.remove();
        }
        
        this.items = [];
        this.fetch();
    }

    /**
     * Event: Click copy item id
     */
    onClickCopyItemId() {
        let id = $('.context-menu-target').data('id');

        copyToClipboard(id);
    }
    
    /**
     * Event: Click open in new tab
     */
    onClickOpenInNewTab() {
        let href = $('.context-menu-target').attr('href');

        window.open(location.protocol + '//' + location.host + '/' + HashBrown.Context.projectId + '/' + HashBrown.Context.environment + '/' + href);
    }

    /**
     * Event: Change directory
     *
     * @param {String} id
     * @param {String} newParent
     */
    onChangeDirectory(id, newParent) {}
    
    /**
     * Event: Change sort index
     *
     * @param {String} id
     * @param {Number} newIndex
     * @param {String} newParent
     */
    onChangeSortIndex(id, newIndex, newParent) {}

    /**
     * Event: Click move item
     */
    onClickMoveItem() {
        let id = $('.context-menu-target').data('id');
        let navbar = Crisp.View.get('NavbarMain');

        this.$element.find('.navbar-main__pane__item a[data-id="' + id + '"]').parent().toggleClass('moving-item', true);
        this.$element.toggleClass('select-dir', true);
        
        // Reset
        let reset = (newPath) => {
            this.$element.find('.navbar-main__pane__item[data-id="' + id + '"]').toggleClass('moving-item', false);
            this.$element.toggleClass('select-dir', false);
            this.$element.find('.navbar-main__pane__move-button').off('click');
            this.$element.find('.navbar-main__pane__item__content').off('click');
            this.$element.find('.moving-item').toggleClass('moving-item', false);
        }
        
        // Cancel by escape key
        $(document).on('keyup', (e) => {
            if(e.which == 27) {
                reset();
            }
        });

        // Click existing directory
        this.$element.find('.navbar-main__pane__item[data-is-directory="true"]:not(.moving-item)').each((i, element) => {
            $(element).children('.navbar-main__pane__item__content').on('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                let newPath = $(element).attr('data-routing-path');

                reset(newPath);

                await this.onChangeDirectory(id, newPath);
            });
        }); 

        // Click below item
        this.$element.find('.navbar-main__pane__item__insert-below').click(async (e) => {
            e.preventDefault();
            e.stopPropagation();

            let parentId = $(e.target).parent().parents('.navbar-main__pane__item').attr('data-routing-path');
            let otherId = $(e.target).parent().attr('data-routing-path');

            // Reset the move state
            reset();

            // Trigger sort change event
            try {
                await this.onChangeSortIndex(id, otherId, parentId);

            } catch(e) {
                UI.errorModal(e);

            }
        });

        // Click "move to root" button
        this.$element.find('.navbar-main__pane__move-button--root-dir').on('click', (e) => {
            let newPath = '/';

            reset(newPath);

            this.onChangeDirectory(id, newPath);
        });
        
        this.$element.find('.navbar-main__pane__move-button--new-dir').toggle(this.constructor.hasFolders === true);

        if(this.constructor.hasFolders) {
            this.$element.find('.navbar-main__pane__move-button--new-dir').on('click', async () => {
                try {
                    let item = await HashBrown.Helpers.MediaHelper.getMediaById(id);

                    let messageModal = new HashBrown.Views.Modals.Modal({
                        title: 'Move item',
                        body: _.div({class: 'widget-group'},
                            _.input({class: 'widget widget--input text', value: (item.folder || item.parentId || ''), placeholder: '/path/to/media/'}),
                            _.div({class: 'widget widget--label'}, (item.name || item.title || item.id))
                        ),
                        actions: [
                            {
                                label: 'OK',
                                onClick: () => {
                                    let newPath = messageModal.$element.find('.widget--input').val();
                                    
                                    reset(newPath);

                                    this.onChangeDirectory(item.id, newPath);
                                }
                            }
                        ]
                    });

                } catch(e) {
                    UI.errorModal(e);

                }
            });
        }
    }

    /**
     * Event: Change filter
     *
     * @param {String} search
     */
    onChangeFilter(search) {
        search = search.toLowerCase();

        this.$element.find('.navbar-main__pane__item').each((i, item) => {
            let label = item.querySelector('.navbar-main__pane__item__label').innerText.toLowerCase();

            item.classList.toggle('filter-not-matched', label.indexOf(search) < 0);
        });
    }
    
    /**
     * Event: Change sorting
     *
     * @param {String} sortingMethod
     */
    onChangeSorting(sortingMethod) {
        this.applySorting(sortingMethod);
    }

    /**
     * Gets the icons of an item
     *
     * @param {Object} item
     *
     * @return {String} Icon name
     */
    getItemIcon(item) {
        return item.icon || 'file';
    }
    
    /**
     * Gets the root items
     *
     * @return {Array} Items
     */
    getRootItems() {
        return this.items.filter((item) => {
            return !item.parentId && !item.parentSchemaId;
        });
    }

    /**
     * Gets the children of an item
     *
     * @param {Object} item
     *
     * @return {Array} Items
     */
    getItemChildren(parentItem) {
        return this.items.filter((item) => {
            return item.parentId === parentItem.id || item.parentSchemaId === parentItem.id;
        });
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
     *
     * @returns {String} Routing path
     */
    getItemRoutingPath(item) {
        return item.shortPath || item.path || item.id || null;
    }

    /**
     * Reloads this view
     */
    async reload() {
        this.saveState();

        await this.fetch();
    }

    /**
     * Highlights an item
     *
     * @param {String} itemId
     */
    highlightItem(itemId) {
        this.ready(() => {
            this.$element.find('.navbar-main__pane__item').each((i, element) => {
                let $item = $(element);
                let id = ($item.children('a').attr('data-id') || '');

                $item.toggleClass('active', false);
                
                if(id === itemId) {
                    $item.toggleClass('active', true);
                    $item.parents('.navbar-main__pane__item').toggleClass('open', true);
                }
            });
        });
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
                if(item.properties.title[HashBrown.Context.language]) {
                    name = item.properties.title[HashBrown.Context.language];

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
     * Applies item sorting
     *
     * @param {String} sortingMethod
     */
    applySorting(sortingMethod) {
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
        this.$element.find('.navbar-main__pane__items, .navbar-main__pane__item .navbar-main__pane__item__children').each((i, container) => {
            let $nestedChildren = $(container).find('>.navbar-main__pane__item');
            $nestedChildren.sort(performSort);
            $nestedChildren.appendTo($(container));
        });
    }
    
    /**
     * Event: Click copy item id
     */
    onClickCopyItemId() {
        let id = $('.context-menu-target').data('id');

        copyToClipboard(id);
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
     * Applies folder structure
     */
    applyFolders() {
        for(let item of this.items) {
            if(!item.folder) { continue; }

            let $directory = null;
            let dirNames = item.folder.split('/').filter((dir) => { return dir != ''; });
            let finalDirName = '/';

            // Create a folder for each directory name in the path
            for(let i in dirNames) {
                let dirName = dirNames[i];

                let prevFinalDirName = finalDirName;
                finalDirName += dirName + '/';

                // Look for an existing directory element
                $directory = this.$element.find('[data-routing-path="' + finalDirName + '"]');

                // Create it if not found
                if($directory.length < 1) {
                    let contextButton;

                    $directory = _.div({class: 'navbar-main__pane__item', 'data-is-directory': true},
                        _.a({
                            class: 'navbar-main__pane__item__content'
                        },
                            _.span({class: 'navbar-main__pane__item__icon fa fa-folder'}),
                            _.span({class: 'navbar-main__pane__item__label'}, dirName),
                            
                            // Toggle button
                            _.button({class: 'navbar-main__pane__item__toggle-children'})
                                .click((e) => { this.onClickToggleChildren(e); }),
                            contextButton = _.button({class: 'navbar-main__pane__item__context fa fa-ellipsis-v'})
                        ),
                        _.div({class: 'navbar-main__pane__item__children'})
                    );
                    
                    $directory.attr('data-routing-path', finalDirName);

                    // Append to previous dir 
                    let $prevDir = this.$element.find('[data-routing-path="' + prevFinalDirName + '"]');
                    
                    if($prevDir.length > 0) {
                        $prevDir.children('.navbar-main__pane__item__children').prepend($directory);

                    // If no previous dir was found, append directly to pane
                    } else {
                        this.$element.children('.navbar-main__pane__items').prepend($directory); 
                    }
                    
                    // Attach pane context menu
                    if(this.getPaneContextMenu) {
                        UI.context($directory[0], this.getPaneContextMenu(), contextButton[0]);
                    }
                }
            }

            if($directory) {
                let $item = this.$element.find('[data-routing-path="' + item.id + '"]');
                        
                $directory.children('.navbar-main__pane__item__children').append($item);
            }
        }
    }

    /**
     * Gets the sorting options for this pane
     *
     * @return {Object} Options
     */
    getSortingOptions() {
        let sortingOptions = {
            default: 'Default',
            alphaAsc: 'A → Z',
            alphaDesc: 'Z → A'
        };

        if(this.constructor.route === '/content/') {
            sortingOptions.dateAsc = 'Old → new';
            sortingOptions.dateDesc = 'New → old';
        }

        return sortingOptions;
    }

    /**
     * Saves the current state
     */
    saveState() {
        this._savedState = {
            items: {},
            scroll: this.$element.find('.navbar-main__pane__items').scrollTop() || 0
        };
        
        this.$element.find('.navbar-main__pane__item').each((i, element) => {
            let key = element.dataset.routingPath;

            this._savedState.items[key] = element.className.replace('loading', '');
        });
    }

    /**
     * Restores the previously saved state
     */
    restoreState() {
        if(!this._savedState) { return; }
        
        // Restore pane items
        this.$element.find('.navbar-main__pane__item').each((i, element) => {
            let key = element.dataset.routingPath;

            if(key && this._savedState.items[key]) {
                element.className = this._savedState.items[key];
            }
        });

        // Restore scroll position
        this.$element.find('.navbar-main__pane__items').scrollTop(this._savedState.scroll || 0);

        this._savedState = null;
    }

    /**
     * Renders an item
     *
     * @param {Object} item
     *
     * @return {HTMLElement} Item
     */
    renderItem(item) {
        let name = this.getItemName(item);
        let icon = this.getItemIcon(item);
        let routingPath = this.getItemRoutingPath(item);
        let isDirectory = this.isItemDirectory(item);
        let queueItem = {};
        let hasRemote = item.sync ? item.sync.hasRemote : false;
        let isRemote = item.sync ? item.sync.isRemote : false;

        if(this.constructor.route === '/media/') {
            isRemote = true;
        }

        let contextButton = null;

        let itemChildren = this.getItemChildren(item);

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
                'data-id': item.id,
                'data-name': name,
                href: '#' + (routingPath ? this.constructor.route + routingPath : this.constructor.route),
                class: 'navbar-main__pane__item__content'
            },
                _.div({class: 'navbar-main__pane__item__icon fa fa-' + icon}),
                _.div({class: 'navbar-main__pane__item__label'}, name),
                _.if(itemChildren.length > 0,
                    _.button({class: 'navbar-main__pane__item__toggle-children'})
                        .click((e) => { this.onClickToggleChildren(e); })
                ),
                contextButton = _.button({class: 'navbar-main__pane__item__context fa fa-ellipsis-v'})
            ),
            _.div({class: 'navbar-main__pane__item__children'},
                _.each(itemChildren, (i, item) => {
                    return this.renderItem(item);
                })
            ),
            _.div({class: 'navbar-main__pane__item__insert-below'})
        );

        // Attach item context menu
        if(this.getItemContextMenu) {
            UI.context($item.find('a')[0], this.getItemContextMenu(item), contextButton[0]);

        } else if(this.itemContextMenu) {
            UI.context($item.find('a')[0], this.itemContextMenu, contextButton[0]);

        }
        
        return $item;
    }

    /**
     * Template
     */
    template() {
        return _.div({class: 'navbar-main__pane', 'data-route': this.constructor.route},
            // Filter/sort bar
            _.div({class: 'navbar-main__pane__filter-sort-bar'},
                _.div({class: 'widget-group'},
                    new HashBrown.Views.Widgets.Input({
                        placeholder: 'Filter',
                        onChange: (newValue) => { this.onChangeFilter(newValue); },
                        type: 'text'
                    }),
                    new HashBrown.Views.Widgets.Dropdown({
                        placeholder: 'Sort',
                        options: this.getSortingOptions(),
                        onChange: (newValue) => { this.onChangeSorting(newValue); }
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
                _.each(this.getRootItems(), (i, item) => {
                    return this.renderItem(item);
                })
            )
        );
    }

    /**
     * Post render
     */
    postrender() {
        this.applyFolders();
        this.applySorting();
        this.restoreState();

        // Attach pane context menu
        if(this.getPaneContextMenu) {
            UI.context(this.element, this.getPaneContextMenu());
        }
    }
}

module.exports = NavbarPane;
