'use strict';

/**
 * A panel for schema resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Schemas extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'cogs'; }
    
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
        item.parentId = resource.parentSchemaId;

        return item;
    }
}

module.exports = Schemas;
