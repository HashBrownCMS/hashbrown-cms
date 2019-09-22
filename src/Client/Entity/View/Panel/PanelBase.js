'use strict';

/**
 * The base view for all panel types
 *
 * @memberof HashBrown.Client.Entity.View.Panel
 */
class PanelBase extends HashBrown.Entity.View.ViewBase {
    static get icon() { return 'file'; }
    static get category() { return this.name.toLowerCase(); }
    static get itemType() { return null; }

    get icon() { return this.constructor.icon; }
    get category() { return this.constructor.category; }
    get itemType() { return this.constructor.itemType; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/panel/panelBase');
    
        HashBrown.Service.EventService.on('resource', 'panel', () => { this.update(); });

        this.state.sortingOptions = this.getSortingOptions();
        this.state.sortingMethod = Object.values(this.state.sortingOptions || {})[0];
    }

    /**
     * Update
     */
    async update() {
        // Cache scroll position
        let scrollTop = 0;

        if(this.namedElements.items) {
            scrollTop = this.namedElements.items.scrollTop;
        }

        // Cache item states
        let itemStates = {};

        for(let id in this.state.itemMap || {}) {
            itemStates[id] = this.state.itemMap[id].state;
        }

        await super.update();        
       
        // Restore item states
        for(let id in this.state.itemMap || {}) {
            this.state.itemMap[id].state = itemStates[id] || {};
       
            this.state.itemMap[id].render();
        }

        // Restore scroll position
        if(this.namedElements.items) {
            this.namedElements.items.scrollTop = scrollTop;
        }

        // Highlight selected item
        this.highlightItem(getRoute(1));
    }

    /**
     * Fetches the models
     */
    async fetch() {
        let resources = await HashBrown.Service.ResourceService.getAll(this.itemType, this.category);

        this.state.itemMap = {};

        let queue = {};

        // Generate items and place them in the queue and map cache
        for(let resource of resources) {
            queue[resource.id] = new HashBrown.Entity.View.ListItem.PanelItem({model: this.getItem(resource)});
            this.state.itemMap[resource.id] = queue[resource.id];
        }

        // Apply the item hierarchy
        for(let id in queue) {
            let item = queue[id];
            let parent = queue[item.model.parentId];
            
            if(parent) {
                item.model.parent = parent;
                parent.model.children.push(item);
            }
        }
  
        // Add items to the root view and sort them
        this.state.rootItems = [];
        
        for(let id in queue) {
            let item = queue[id];

            if(!item.model.parent) {
                this.state.rootItems.push(item);
            }

            item.model.children.sort((a, b) => this.sortItems(a, b));
        }

        this.state.rootItems.sort((a, b) => this.sortItems(a, b));
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

        let pageY = e.touches ? e.touches[0].pageY : e.pageY;
        let pageX = e.touches ? e.touches[0].pageX : e.pageX;
        
        let contextMenu = new HashBrown.Entity.View.Widget.Popup({
            model: {
                target: this.element,
                options: this.getPanelOptions(),
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
        let resource = await HashBrown.Service.ResourceService.new(this.itemType, this.category);
        
        location.hash = `/${this.category}/${resource.id}`;
    }

    /**
     * Event: Click remove
     */
    onClickRemove(id) {
        UI.confirm(
            'Remove item',
            'Are you sure you want to remove this item?',
            async () => {
                if(this.state.itemMap[id]) {
                    this.state.itemMap[id].element.classList.toggle('loading', true);
                }

                await HashBrown.Service.ResourceService.remove(this.category, id);
                
                if(this.state.itemMap[id]) {
                    this.state.itemMap[id].element.classList.toggle('loading', false);
                }
      
                if(location.hash.indexOf(id) > -1) {
                    location.hash = `/${this.category}/`;
                }
            }
        );
    }
    
    /**
     * Event: Click pull
     */
    async onClickPull(id) {
        await HashBrown.Service.ResourceService.pull(this.category, id);
    }
    
    /**
     * Event: Click push
     */
    async onClickPush(id) {
        await HashBrown.Service.ResourceService.push(this.category, id);
    }

    /**
     * Event: Search
     */
    onSearch(query = '') {
        query = (query || '').toLowerCase();

        for(let id in this.state.itemMap) {
            let item = this.state.itemMap[id];
            let isMatch = !query || item.model.name.toLowerCase().indexOf(query) > -1;

            item.element.classList.toggle('defocused', !isMatch);
        }
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

        let method = this.state.sortingMethod;

        if(!method) { return 0; }

        if(a.model[method] < b.model[method]) { return -1; }
        if(a.model[method] > b.model[method]) { return 1; }
            
        return 0;
    }

    /**
     * Highlights an item by id
     *
     * @param {String} hightlightId
     */
    highlightItem(highlightId) {
        for(let id in this.state.itemMap) {
            let item = this.state.itemMap[id];
           
            item.setHighlight(id === highlightId);
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
        if(!resource.sync) { resource.sync = {}; }
       
        let options = {};

        options['Copy id'] = () => this.onClickCopyId(resource.id);
    
        if(!resource.sync.hasRemote && !resource.isLocked) {
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
        if(!resource.sync) { resource.sync = {}; }

        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled && (!resource.isLocked || resource.sync.isRemote);

        if(!isSyncEnabled) { return {}; }

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
        let options = {};

        let baseOptions = this.getItemBaseOptions(resource);

        if(Object.keys(baseOptions).length > 0) {
            options['This item'] = '---';
        }

        for(let key in baseOptions) {
            options[key] = baseOptions[key];
        }
            
        let syncOptions = this.getItemSyncOptions(resource);

        if(Object.keys(syncOptions).length > 0) {
            options['Sync'] = '---';
        }

        for(let key in syncOptions) {
            options[key] = syncOptions[key];
        }

        let panelOptions = this.getPanelOptions();

        if(Object.keys(panelOptions).length > 0) {
            options['General'] = '---';
        }

        for(let key in panelOptions) {
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
            'Default': 'id',
            'A-Z': 'name'
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
    getItem(resource) {
        return {
            id: resource.id,
            category: this.category,
            isLocked: resource.isLocked,
            options: this.getItemOptions(resource),
            name: resource.id,
            children: [],
            onDrop: (contentId, parentId, position) => { this.onDropItem(contentId, parentId, position); },
        };
    }
}

module.exports = PanelBase;
