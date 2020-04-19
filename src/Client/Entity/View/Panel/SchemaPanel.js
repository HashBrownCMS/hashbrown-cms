'use strict';

/**
 * A panel for schema resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class SchemaPanel extends HashBrown.Entity.View.Panel.PanelBase {
    /**
     * Event: Click new
     */
    async onClickNew(parentId) {
        let newSchema = await HashBrown.Entity.Resource.SchemaBase.create({ parentId: parentId });

        location.hash = '/schemas/' + newSchema.id;
    }

    /**
     * Gets the basic options for a resource
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.SchemaBase, true);

        let options = super.getItemBaseOptions(resource);

        options['New child'] = () => this.onClickNew(resource.id);

        return options;
    }
    
    /**
     * Gets the context menu options for this panel
     *
     * @return {Object} Options
     */
    getPanelOptions() {
        return {};
    }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.SchemaBase} resource
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.SchemaBase, true);
        
        let item = await super.getItem(resource);

        item.name = resource.name;
        item.parentId = resource.parentId;
    
        return item;
    }
}

module.exports = SchemaPanel;
