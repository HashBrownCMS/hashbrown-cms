'use strict';

/**
 * A panel for form resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Forms extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'wpforms'; }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    getItem(resource) {
        let item = super.getItem(resource);

        item.name = resource.title;

        return item;
    }
}

module.exports = Forms;
