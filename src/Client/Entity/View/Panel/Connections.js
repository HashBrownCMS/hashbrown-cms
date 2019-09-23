'use strict';

/**
 * A panel for connection resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Connections extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'exchange'; }
    static get itemType() { return HashBrown.Entity.Resource.Connection; }
    
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

        return item;
    }
}

module.exports = Connections;
