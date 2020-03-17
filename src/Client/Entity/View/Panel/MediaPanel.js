'use strict';

/**
 * A panel for media resources
 *
 * @memberof HashBrown.Entity.View.Panel
 */
class MediaPanel extends HashBrown.Entity.View.Panel.PanelBase {
    static get category() { return 'media'; }
   
    /**
     * Event: Click new
     */
    onClickNew(folder) {
        let modal = HashBrown.Entity.View.Modal.UploadMedia.new({
            model: {
                folder: folder
            }
        });
            
        modal.on('success', (resources) => {
            if(resources && resources[0] && resources[0].id) {
                location.hash = '/media/' + ids[0];
            }
        });
    }
    
    /**
     * Event: Click rename
     */
    onClickRename(media) {
        let modal = HashBrown.Entity.View.Modal.Rename.new({
            model: {
                value: media.name
            }
        });
            
        modal.on('submit', async (newName) => {
            await HashBrown.Service.RequestService.request('post', 'media/rename/' + media.id + '?name=' + newName);

            HashBrown.Service.EventService.trigger('resource', media.id); 
        });
    }
    
    /**
     * Event: Click replace
     */
    onClickReplace(replaceId) {
        let modal = HashBrown.Entity.View.Modal.UploadMedia.new({
            model: {
                replaceId: replaceId
            }
        });
        
        modal.on('success', (ids) => {
            HashBrown.Service.NavigationService.poke();
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

        let modal = HashBrown.Entity.View.Modal.Folders.new({
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
     * Event: Drop media into folder
     *
     * @param {String} itemId
     * @param {String} parentId
     * @param {Number} position
     */
    async onDropItem(itemId, parentId, position) {
        try {
            await HashBrown.Service.RequestService.request('post', 'media/tree/' + itemId, { id: itemId, folder: parentId });

            this.update();

        } catch(e) {
            UI.error(e);

        }
    }

    /**
     * Gets a panel item from a resource
     *
     * @param {HashBrown.Entity.Resource.Media} resource
     *
     * @return {HashBrown.Entity.View.ListItem.PanelItem} Item
     */
    async getItem(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.Media, true);
        
        let item = await super.getItem(resource);

        item.parentId = resource.folder;   
        item.isRemote = true;
        item.isDraggable = true;

        return item;
    }
   

    /**
     * Gets the basic options for a resource
     *
     * @param {HashBrown.Entity.Resource.Media} resource
     *
     * @return {Object} Options
     */
    getItemBaseOptions(resource) {
        checkParam(resource, 'resource', HashBrown.Entity.Resource.Media, true);
        
        let options = super.getItemBaseOptions(resource);

        options['Rename'] = () => this.onClickRename(resource);
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
        
        let parentFolderPath = '/';

        if(parts.length > 0) {
            parentFolderPath += parts.join('/') + '/';
        }

        let item = HashBrown.Entity.View.ListItem.PanelItem.new({
            model: {
                name: folderName,
                id: path,
                isDisabled: true,
                isDropContainer: true,
                icon: 'folder',
                hasSortingPriority: true,
                parentId: parentFolderPath,
                children: []
            }
        });
        
        item.on('drop', (itemId, parentId, position) => {
            this.onDropItem(itemId, parentId, position);
        });

        return item;
    }
}

module.exports = MediaPanel;
