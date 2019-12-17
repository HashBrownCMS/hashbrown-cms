'use strict';

/**
 * A list item in a panel
 *
 * @memberof HashBrown.Entity.View.ListItem
 */
class PanelItem extends HashBrown.Entity.View.ListItem.ListItemBase {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.template = require('template/listItem/panelItem');
    }

    /**
     * Event: Drag start
     */
    onDragStart(e) {
        e.dataTransfer.setData('source', this.model.id);
    
        this.clearDragOverDatasets();
    }
    
    /**
     * Event: Drag end
     */
    onDragEnd(e) {
        this.clearDragOverDatasets();
    }

    /**
     * Event: Drag over
     */
    onDragOver(e) {
        e.preventDefault();     
    
        this.clearDragOverDatasets();

        if(!this.model.isDropContainer && !this.model.isSortable) { return; }
        if(e.dataTransfer.getData('source') === this.model.id) { return; }

        let bounds = this.namedElements.inner.getBoundingClientRect();
        let margin = bounds.height / 3;
        let delta = e.pageY - bounds.top;

        if(delta < 0 || delta > bounds.height) {
            delete this.element.dataset.dragOver;
            return;
        }

        if(this.model.isDropContainer) {
            this.element.dataset.dragOver = 'self';
        }

        if(this.model.isSortable) {
            if(delta < margin) {
                this.element.dataset.dragOver = 'above';
            } else if(delta > bounds.height - margin) {
                this.element.dataset.dragOver = 'below';
            }
        }
    }
    
    /**
     * Event: Drag leave
     */
    onDragLeave(e) {
        e.preventDefault();     
       
        this.clearDragOverDatasets();
    }
    
    /**
     * Event: Drop
     */
    onDrop(e) {
        e.preventDefault();     
    
        if(!this.model.isDropContainer) { return; }

        let position = this.element.dataset.dragOver;
        let itemId = e.dataTransfer.getData('source');

        if(!itemId || itemId === this.model.id) { return; }
        
        // Drop onto item
        if(position === 'self') {
            this.trigger('drop', itemId, this.model.id, 0);
        
        // Sort above/below item
        } else {
            let index = Array.from(this.element.parentElement.children).indexOf(this.element);

            if(position === 'below') {
                index++;
            }

            this.trigger('drop', itemId, this.model.parentId, index);
        }
        
        this.clearDragOverDatasets();
    }

    /**
     * Event: Click expand
     */
    onClickExpand() {
        this.setExpanded(!this.state.isExpanded);
    }

    /**
     * Event: Click context
     *
     * @param {InputEvent} e
     */
    onClickContext(e) {
        e.preventDefault();

        if(!this.model.options || this.model.options.length < 1) { return; }

        let pageY = e.touches ? e.touches[0].pageY : e.pageY;
        let pageX = e.touches ? e.touches[0].pageX : e.pageX;
        
        let contextMenu = new HashBrown.Entity.View.Widget.Popup({
            model: {
                target: this.element,
                options: this.model.options,
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
     * Expands this view
     *
     * @param {Boolean} isExpanded
     */
    setExpanded(isExpanded) {
        this.state.isExpanded = isExpanded;

        this.render();
    }
    
    /**
     * Highlights this item
     */
    setHighlight(isActive) {
        this.state.isActive = isActive;

        this.render();

        if(isActive) {
            this.expandAncestors();
        }
    }

    /**
     * Expands ancestors
     */
    expandAncestors() {
        if(!this.model.parent) { return; }

        this.model.parent.setExpanded(true);
        this.model.parent.expandAncestors();
    }

    /**
     * Clears all "dragOver" datasets
     */
    clearDragOverDatasets() {
        for(let item of Array.from(document.querySelectorAll('*[data-drag-over]'))) {
            delete item.dataset.dragOver;
        }
    }
    
    /**
     * Gets the placeholder element
     *
     * @return {HTMLElement} Placeholder
     */
    getPlaceholder() {
        let element = document.createElement('div');
        element.className = 'list-item--panel-item loading';
        
        let inner = document.createElement('div');
        inner.className = 'list-item--panel-item__inner';
        

        return element;
    }
}

module.exports = PanelItem;
