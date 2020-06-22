'use strict';

/**
 * A panel for content resources
 *
 * @memberof HashBrown.Client.Entity.View.Panel
 */
class ContentPanel extends HashBrown.Entity.View.Panel.PanelBase {
    /**
     * Fetches the models
     */
    async fetch() {
        this.state.icons = await HashBrown.Service.RequestService.request('get', 'schemas/icons');

        await super.fetch();
    }

    /**
     * Event: Click new
     */
    async onClickNew(parentId) {
        HashBrown.Entity.View.Modal.CreateContent.new({
            model: {
                parentId: parentId
            }
        });
    }
    
    /**
     * Event: Click remove
     *
     * @param {String} id
     */
    async onClickRemove(id) {
        checkParam(id, 'id', String, true);

        let content = await HashBrown.Entity.Resource.Content.get(id);

        let modal = HashBrown.Entity.View.Modal.RemoveContent.new({
            model: {
                contentId: content.id
            }
        });

        modal.on('delete', () => {
            if(this.state.itemMap[id]) {
                this.state.itemMap[id].element.classList.toggle('loading', true);
            }
        });
    }
   
    /**
     * Event: Drop item
     *
     * @param {String} itemId
     * @param {String} parentId
     * @param {Number} position
     */
    async onDropItem(itemId, parentId, position) {
        try {
            await HashBrown.Service.RequestService.request('post', `content/${itemId}/insert?parentId=${parentId || ''}&position=${position}`);

            this.update();

        } catch(e) {
            UI.error(e);

        }
    }
    
    /**
     * Gets available sorting options
     *
     * @return {Object} Options
     */
    getSortingOptions() {
        return {
            'Manual': 'sort:asc',
            'Name': 'name:asc',
            'Changed': 'changed:desc',
            'Created': 'created:desc'
        }
    }
    
    /**
     * Gets the basic options for a resource
     *
     * @param {HashBrown.Entity.Resource.Content} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.Content, true);

        let options = super.getItemBaseOptions(resource);

        options['New child'] = () => this.onClickNew(resource.id);

        return options;
    }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} resource
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.Content, true);
        
        let item = await super.getItem(resource);

        item.icon = this.state.icons[resource.schemaId] || resource.icon;
        item.name = resource.getName();
        item.parentId = resource.parentId;
        item.sort = resource.sort;
        item.isDraggable = true;
        item.isSortable = true;
        item.isDropContainer = true;

        return item;
    }
}

module.exports = ContentPanel;
