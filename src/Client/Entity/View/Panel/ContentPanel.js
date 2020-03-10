'use strict';

/**
 * A panel for content resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class ContentPanel extends HashBrown.Entity.View.Panel.PanelBase {
    static get category() { return 'content'; };
    
    /**
     * Event: Click new
     */
    async onClickNew(parentId) {
        new HashBrown.Entity.View.Modal.CreateContent({
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

        let modal = new HashBrown.Entity.View.Modal.RemoveContent({
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
     * Event: Click settings
     *
     * @param {String} id
     */
    async onClickPublishingSettings(id) {
        checkParam(id, 'id', String, true);

        let content = await HashBrown.Entity.Resource.Content.get(id);

        new HashBrown.Entity.View.Modal.ContentPublishingSettings({
            model: content
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
            await HashBrown.Service.RequestService.request('post', `content/insert?contentId=${itemId}&parentId=${parentId || ''}&position=${position}`);

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
        options['Settings'] = '---';
        options['Publishing'] = () => this.onClickPublishingSettings(resource.id);

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

        item.name = resource.prop('title', HashBrown.Context.language);

        if(!item.name) {
            item.name = 'Untitled';

            for(let language in resource.properties.title) {
                let languageTitle = resource.properties.title[language];

                if(languageTitle) {
                    item.name += ' - (' + language + ': ' + languageTitle + ')';
                    break;
                }
            }
        }

        item.parentId = resource.parentId;
        item.sort = resource.sort;
        item.isDraggable = true;
        item.isSortable = true;
        item.isDropContainer = true;
        item.changed = resource.updateDate;
        item.created = resource.createDate;

        return item;
    }
}

module.exports = ContentPanel;
