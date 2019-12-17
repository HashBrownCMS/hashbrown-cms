'use strict';

/**
 * A panel for form resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Forms extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'wpforms'; }
    static get itemType() { return HashBrown.Entity.Resource.Form; }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        let item = await super.getItem(resource);

        item.name = resource.title;
        item.icon = 'wpforms';

        return item;
    }
}

module.exports = Forms;
