'use strict';

/**
 * A panel for media resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Media extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'file-image-o'; }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    getItem(resource) {
        let item = super.getItem(resource);

        item.name = resource.name;

        return item;
    }
}

module.exports = Media;
