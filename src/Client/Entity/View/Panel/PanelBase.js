'use strict';

/**
 * The base view for all panel types
 *
 * @memberof HashBrown.Client.Entity.View.Panel
 */
class PanelBase extends HashBrown.Entity.View.ViewBase {
    static get itemType() { return HashBrown.Service.LibraryService.getClass(this.library, HashBrown.Entity.Resource.ResourceBase); }
    static get title() { return HashBrown.Service.LibraryService.getName(this.library); }

    get title() { return this.constructor.title; }
    get itemType() { return this.constructor.itemType; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/panel/panelBase');
    
        this.state.sortingOptions = this.getSortingOptions();
        this.state.sortingMethod = Object.values(this.state.sortingOptions || {})[0];
        this.state.itemMap = {};
    }

    /**
     * Fetches the models
     */
    async fetch() {
        let resources = this.itemType ? await this.itemType.list() : [];
        
        this.state.scrollTop = this.namedElements.items ? this.namedElements.items.scrollTop : 0;

        // Generate items and place them in the map cache
        let itemMap = {};

        for(let resource of resources) {
            let model = await this.getItem(resource);
            let item = HashBrown.Entity.View.ListItem.PanelItem.new({
                model: model,
                state: this.state.itemMap[model.id] ? this.state.itemMap[model.id].state : {}
            });

            // Check if item name matches the search filter
            if(this.state.searchQuery && resource.getName().toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) < 0) { continue; }

            item.on('drop', (itemId, parentId, position) => {
                this.onDropItem(itemId, parentId, position);
            });

            itemMap[item.model.id] = item;
        }

        this.state.itemMap = itemMap;

        this.state.hasPanelContext = Object.keys(this.getPanelOptions()).length > 0;
    }

    /**
     * Pre render
     */
    prerender() {
        // Process items
        let queue = Object.values(this.state.itemMap);

        // Apply the item hierarchy
        for(let item of queue) {
            let parent = this.getParentItem(item.model.parentId);
            
            if(parent) {
                item.model.parent = parent;
                parent.model.children.push(item);

                if(queue.indexOf(parent) < 0) {
                    queue.push(parent);
                }

                this.state.itemMap[parent.model.id] = parent;
            }
        }
  
        // Add items to the root
        this.state.rootItems = [];
        
        for(let item of queue) {
            if(this.state.searchQuery) {
                item.state.isExpanded = true;
            }

            if(!item.model.parent) {
                this.state.rootItems.push(item);
            }

            // Sort children
            item.model.children.sort((a, b) => this.sortItems(a, b));
        }

        // Sort root items
        this.state.rootItems.sort((a, b) => this.sortItems(a, b));
    }

    /**
     * Post render
     */
    postrender() {
        // Highlight selected item
        this.highlightItem();
        
        // Restore scroll position
        if(this.namedElements.items) {
            requestAnimationFrame(() => {
                this.namedElements.items.scrollTop = this.state.scrollTop;
            });
        }
    }

    /**
     * Event: Drop item
     *
     * @param {String} itemId
     * @param {String} parentId
     * @param {Number} position
     */
    async onDropItem(itemId, parentId, position) {}
    
    /**
     * Event: Drop item onto the panel area
     *
     * @param {InputEvent} e
     */
    async onDropItemOntoPanel(e) {
        e.preventDefault();

        let itemId = e.dataTransfer.getData('source');

        await this.onDropItem(itemId, null, this.state.rootItems.length);
    }

    /**
     * Event: Drag item over the panel area
     *
     * @param {InputEvent} e
     */
    onDragOverPanel(e) {
        e.preventDefault();
        
        for(let item of Array.from(document.querySelectorAll('*[data-drag-over]'))) {
            delete item.dataset.dragOver;
        }
       
        this.element.dataset.dragOver = 'self';
    }

    /**
     * Event: Click context menu
     */
    onClickContext(e) {
        e.preventDefault();

        let options = this.getPanelOptions();

        if(!options || Object.keys(options).length < 1) { return; }

        let pageY = e.touches ? e.touches[0].pageY : e.pageY;
        let pageX = e.touches ? e.touches[0].pageX : e.pageX;
        
        let contextMenu = HashBrown.Entity.View.Widget.Popup.new({
            model: {
                target: this.element,
                options: options,
                role: 'context-menu',
                offset: {
                    x: pageX,
                    y: pageY
                }
            }
        });

        document.body.appendChild(contextMenu.element);
    }

    /**
     * Event: Change sorting method
     */
    onChangeSortingMethod(newMethod) {
        this.state.sortingMethod = newMethod;

        this.update();
    }

    /**
     * Event: Click copy item id
     */
    onClickCopyId(id) {
        copyToClipboard(id);
    }
    
    /**
     * Event: Click new
     */
    async onClickNew() {
        if(!this.itemType) { return; }

        let resource = await this.itemType.create();
        
        location.hash = `/${this.library}/${resource.id}`;
    }

    /**
     * Event: Click remove
     */
    onClickRemove(id) {
        if(!this.itemType) { return; }

        let modal = UI.confirm(
            'Remove item',
            'Are you sure you want to remove this item?',
            async () => {
                if(this.state.itemMap[id]) {
                    this.state.itemMap[id].element.classList.toggle('loading', true);
                }

                try {
                    let resource = await this.itemType.get(id);

                    await resource.remove();
                
                } catch(e) {
                    modal.setErrorState(e);

                }
                
                if(this.state.itemMap[id]) {
                    this.state.itemMap[id].element.classList.toggle('loading', false);
                }
            }
        );
    }
    
    /**
     * Event: Click pull
     */
    async onClickPull(id) {
        if(!this.itemType) { return; }

        let resource = await this.itemType.get(id);
        
        await resource.pull();
    }
    
    /**
     * Event: Click push
     */
    async onClickPush(id) {
        if(!this.itemType) { return; }

        let resource = await this.itemType.get(id);
        
        await resource.push();
    }

    /**
     * Event: Click search
     */
    onClickSearch(query) {
        this.state.searchQuery = query;
    
        this.update(false);
    }
    
    /**
     * Event: Click clear search
     */
    onClickClearSearch() {
        this.state.searchQuery = '';
    
        this.update(false);
    }

    /**
     * Sorts items based on the given sorting method
     *
     * @param {HashBrown.Entity.View.ListItem.PanelItem} a
     * @param {HashBrown.Entity.View.ListItem.PanelItem} b
     */
    sortItems(a, b) {
        if(!a || !a.model) { return -1; }
        if(!b || !b.model) { return 1; }

        if(a.model.hasSortingPriority && !b.model.hasSortingPriority) { return -1; }
        if(b.model.hasSortingPriority && !a.model.hasSortingPriority) { return 1; }

        let method = this.state.sortingMethod.split(':');

        if(!method[0]) { return 0; }

        let key = method[0];
        let delta = method[1] === 'asc' ? -1 : 1;

        let aValue = a.model[key];
        let bValue = b.model[key];

        if(typeof aValue === 'string') { aValue = aValue.toLowerCase(); }
        if(typeof bValue === 'string') { bValue = bValue.toLowerCase(); }

        if(aValue < bValue) { return delta; }
        if(aValue > bValue) { return -delta; }
            
        return 0;
    }

    /**
     * Highlights the current item
     */
    highlightItem() {
        for(let id in this.state.itemMap) {
            let item = this.state.itemMap[id];
           
            item.setHighlight(id === this.state.id);
        }
    }

    /**
     * Gets the basic options for a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase, true);
        
        let options = {};

        options['Copy id'] = () => this.onClickCopyId(resource.id);
    
        if(!resource.sync || (!resource.sync.hasRemote && !resource.isLocked)) {
            options['Remove'] = () => this.onClickRemove(resource.id);
        }
        
        return options;
    }

    /**
     * Gets the sync options for a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {Object} Options
     */
    getItemSyncOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase, true);

        if(!resource.isSyncEnabled()) { return {}; }

        let options = {};

        if(resource.sync.isRemote) {
            options['Pull from remote'] = () => this.onClickPull(resource.id);
        } else {
            options['Push to remote'] = () => this.onClickPush(resource.id);
        }

        if(resource.sync.hasRemote) {
            options['Remove local copy'] = () => this.onClickRemove(resource.id);
        }

        return options;
    }

    /**
     * Gets the context menu options for a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {Object} Options
     */
    getItemOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase, true);
        
        let options = {};

        let baseOptions = this.getItemBaseOptions(resource);

        if(Object.keys(baseOptions).length > 0) {
            options['This item'] = '---';
        }

        for(let key in baseOptions) {
            if(options[key]) { continue; }
            
            options[key] = baseOptions[key];
        }
            
        let syncOptions = this.getItemSyncOptions(resource);

        if(Object.keys(syncOptions).length > 0) {
            options['Sync'] = '---';
        }

        for(let key in syncOptions) {
            if(options[key]) { continue; }
            
            options[key] = syncOptions[key];
        }
            
        let panelOptions = this.getPanelOptions();

        if(Object.keys(panelOptions).length > 0) {
            options['General'] = '---';
        }

        for(let key in panelOptions) {
            if(options[key]) { continue; }

            options[key] = panelOptions[key];
        }

        return options;
    }

    /**
     * Gets available sorting options
     *
     * @return {Object} Options
     */
    getSortingOptions() {
        return {
            'Name': 'name:asc'
        }
    }

    /**
     * Gets the context menu options for this panel
     *
     * @return {Object} Options
     */
    getPanelOptions() {
        return {
            'New': () => this.onClickNew()
        }
    }

    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.ResourceBase, true);
        
        return {
            id: resource.id,
            library: this.library,
            isRemote: resource.sync && resource.sync.isRemote === true,
            isLocked: resource.isLocked || false,
            options: this.getItemOptions(resource),
            changed: resource.updatedOn,
            created: resource.createdOn,
            icon: resource.icon,
            name: resource.getName(),
            children: []
        };
    }

    /**
     * Creates an abstract parent item, such as a folder
     *
     * @param {String} parentId
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Parent
     */
    getParentItem(parentId) {
        return this.state.itemMap[parentId];
    }
    
    /**
     * Gets the placeholder element
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder(_, model, state) {
        return _.div({class: 'panel loading'});
    }
}

module.exports = PanelBase;
