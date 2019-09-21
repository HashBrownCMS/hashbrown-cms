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
}

module.exports = PanelItem;
