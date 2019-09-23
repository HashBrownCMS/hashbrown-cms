'use strict';

/**
 * A panel for media resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class Media extends HashBrown.Entity.View.Panel.PanelBase {
    static get icon() { return 'file-image-o'; }
    static get itemType() { return HashBrown.Entity.Resource.Media; }
   
    /**
     * Event: Click new
     */
    onClickNew(folder) {
        let modal = new HashBrown.Entity.View.Modal.UploadMedia({
            model: {
                folder: folder
            }
        });
            
        modal.on('success', (ids) => {
            if(ids) {
                location.hash = '/media/' + ids[0];
            }
        });
    }
    
    /**
     * Event: Click replace
     */
    onClickReplace(replaceId) {
        let modal = new HashBrown.Entity.View.Modal.UploadMedia({
            model: {
                replaceId: replaceId
            }
        });
            
        modal.on('success', (ids) => {
            if(location.hash.indexOf(replaceId) > -1) {
                window.dispatchEvent(new HashChangeEvent("hashchange"));

                location.hash = '/media/' + replaceId;
            }
        });
    }

    /**
     * Event: Click move
     */
    onClickMove(media) {
        let folders = [];

        for(let id in this.state.itemMap) {
            let item = this.state.itemMap[id];

            if(item.model.icon !== 'folder') { continue; }

            folders.push(item.model.id);
        }

        let modal = new HashBrown.Entity.View.Modal.Folders({
            model: {
                folders: folders,
                canAdd: true,
                heading: `Move ${media.name} to...`
            }
        });

        modal.on('picked', async (path) => {
            await HashBrown.Service.RequestService.request('post', 'media/tree/' + media.id, { id: media.id, folder: path });
            
            HashBrown.Service.EventService.trigger('resource');  
        });
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

        item.name = resource.name;
        item.parentId = resource.folder;   
        item.icon = 'file-o';
        item.isRemote = true;

        if(resource.isVideo()) {
            item.icon = 'file-video-o';
        }
        
        if(resource.isImage()) {
            item.icon = 'file-image-o';
        }

        return item;
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

        options['Move'] = () => this.onClickMove(resource);
        options['Replace'] = () => this.onClickReplace(resource.id);

        return options;
    }

    /**
     * Creates a folder
     *
     * @param {String} path
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Parent
     */
    getParentItem(path) {
        if(!path) { return null; } 

        if(this.state.itemMap[path]) { return this.state.itemMap[path]; }

        let parts = path.split('/').filter((x) => !!x);
        let folderName = parts.pop();

        if(!folderName) { return null; }
        
        let parentFolderPath = '/' + parts.join('/') + '/';

        return new HashBrown.Entity.View.ListItem.PanelItem({
            model: {
                name: folderName,
                id: path,
                isDisabled: true,
                icon: 'folder',
                hasSortingPriority: true,
                parentId: parentFolderPath,
                children: []
            }
        });
    }
}

module.exports = Media;
