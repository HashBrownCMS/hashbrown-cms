'use strict';

/**
 * A panel for schema resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Schemas extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'cogs'; }
    static get itemType() { return HashBrown.Entity.Resource.Schema.SchemaBase; }
   
    /**
     * Event: Click new
     */
    async onClickNew(parentId) {
        let newSchema = await HashBrown.Service.ResourceService.new(null, 'schemas', '?parentSchemaId=' + parentId);

        location.hash = '/schemas/' + newSchema.id;
    }

    /**
     * Gets the basic options for a resource
     *
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        let options = super.getItemBaseOptions(resource);

        options['New child'] = () => this.onClickNew(resource.id);

        return options;
    }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        let item = await super.getItem(resource);

        let compiledSchema = await HashBrown.Service.SchemaService.getSchemaById(resource.id, true);

        item.name = resource.name;
        item.parentId = resource.parentSchemaId;
        item.icon = compiledSchema.icon;
    
        return item;
    }
}

module.exports = Schemas;
