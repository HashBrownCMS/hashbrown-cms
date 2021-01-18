'use strict';

/**
 * A panel for media resources
 *
 * @memberof HashBrown.Client.Entity.View.Panel
 */
class MediaPanel extends HashBrown.Entity.View.Panel.PanelBase {
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
                location.hash = '/media/' + resources[0].id;
            }
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
        
        modal.on('success', () => {
            HashBrown.Service.EventService.trigger('resource');
        });
    }

    /**
     * Event Click rename folder
     *
     * @param {String} path
     */
    onClickRenameFolder(path) {
        let parts = path.split('/').filter(Boolean);

        let modal = HashBrown.Entity.View.Modal.Rename.new({
            model: {
                value: parts.pop()
            }
        });

        modal.on('submit', async (name) => {
            parts.push(name);

            let newPath = '/' + parts.join('/');

            await HashBrown.Service.RequestService.request('post', 'media/renameFolder', { from: path, to: newPath });
            
            HashBrown.Service.EventService.trigger('resource');
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
                heading: 'Move to...'
            }
        });

        modal.on('picked', async (path) => {
            await HashBrown.Service.RequestService.request('post', 'media/' + media.id, { folder: path });
            
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
            await HashBrown.Service.RequestService.request('post', 'media/' + itemId, { folder: parentId });

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
     * Gets available sorting options
     *
     * @return {Object} Options
     */
    getSortingOptions() {
        return {
            'Name': 'name:asc',
            'Changed': 'changed:desc',
            'Created': 'created:desc'
        }
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

        options['Move'] = () => this.onClickMove(resource);
        options['Replace'] = () => this.onClickReplace(resource.id);

        return options;
    }
    
    /**
     * Gets the context menu options for this panel
     *
     * @return {Object} Options
     */
    getPanelOptions() {
        return {
            'Upload': () => this.onClickNew()
        }
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

        let parts = path.split('/').filter(Boolean);
        
        path = '/' + parts.join('/');
        
        if(this.state.itemMap[path]) { return this.state.itemMap[path]; }

        let folderName = parts.pop();

        if(!folderName) { return null; }
        
        let parentFolderPath = '/' + parts.join('/');

        let item = HashBrown.Entity.View.ListItem.PanelItem.new({
            model: {
                name: folderName,
                id: path,
                options: {
                    'This folder': '---',
                    'Upload': () => this.onClickNew(path),
                    'Rename': () => this.onClickRenameFolder(path)
                },
                isDisabled: true,
                isDropContainer: true,
                icon: 'folder',
                hasSortingPriority: true,
                parentId: parentFolderPath,
                children: []
            },
            state: this.getSavedItemState(path)
        });
       
        item.on('drop', (itemId, parentId, position) => {
            this.onDropItem(itemId, parentId, position);
        });

        return item;
    }
}

module.exports = MediaPanel;
