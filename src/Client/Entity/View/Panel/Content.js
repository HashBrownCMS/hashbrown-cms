'use strict';

/**
 * A panel for content resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Content extends HashBrown.Entity.View.Panel.PanelBase {
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
     */
    async onClickRemove(id) {
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
     */
    async onClickPublishingSettings(id) {
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
     * @param {HashBrown.Entity.Resource.ResourceBase} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        let options = super.getItemBaseOptions(resource);

        options['New child'] = () => this.onClickNew(resource.id);
        options['Settings'] = '---';
        options['Publishing'] = () => this.onClickPublishingSettings(resource.id);

        return options;
    }
    
    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Content} content
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(content) {
        let item = await super.getItem(content);

        item.name = content.prop('title', HashBrown.Context.language);

        if(!item.name) {
            item.name = 'Untitled';

            for(let language in content.properties.title) {
                let languageTitle = content.properties.title[language];

                if(languageTitle) {
                    item.name += ' - (' + language + ': ' + languageTitle + ')';
                    break;
                }
            }
        }

        item.parentId = content.parentId;
        item.sort = content.sort;
        item.isDraggable = true;
        item.isSortable = true;
        item.isDropContainer = true;
        item.changed = content.updateDate;
        item.created = content.createDate;

        return item;
    }
}

module.exports = Content;
