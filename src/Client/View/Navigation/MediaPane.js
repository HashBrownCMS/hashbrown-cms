'use strict';

/**
 * The Media navbar pane
 * 
 * @memberof HashBrown.Client.View.Navigation
 */
class MediaPane extends HashBrown.View.Navigation.NavbarPane {
    static get route() { return '/media/'; }
    static get label() { return 'Media'; }
    static get icon() { return 'file-image-o'; }
    static get hasFolders() { return true; }

    /**
     * Gets all items
     */
    async fetch() {
        this.items = await HashBrown.Service.MediaService.getAllMedia();

        super.fetch();
    }
    
    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    async onChangeDirectory(id, newFolder) {
        await HashBrown.Service.RequestService.request(
            'post',
            'media/tree/' + id,
            newFolder ? {
                id: id,
                folder: newFolder
            } : null
        )
        
        HashBrown.Service.EventService.trigger('resource');  

        location.hash = '/media/' + id;
    }

    /**
     * Event: Click rename media
     */
    onClickRenameMedia(target) {
        let id = target.dataset.id;
        let name = target.dataset.name;

        UI.prompt(
            'Rename ' + name,
            'New name',
            'text',
            name,
            async (newName) => {
                await HashBrown.Service.RequestService.request('post', 'media/rename/' + id + '?name=' + newName);

                HashBrown.Service.EventService.trigger('resource', id);  
            }
        );
    }

    /**
     * Event: Click remove media
     */
    onClickRemoveMedia(target) {
        let id = target.dataset.id;
        let name = target.dataset.name;
        
        UI.confirm(
            'Delete media',
            'Are you sure you want to delete the media object "' + name + '"?',
            async () => {
                target.parentElement.classList.toggle('loading', true);

                await HashBrown.Service.ResourceService.remove('media', id);

                // Cancel the MediaViever view if it was displaying the deleted object
                if(location.hash == '#/media/' + id) {
                    location.hash = '/media/';
                }
            }
        );
    }

    /**
     * Event: Click replace media
     */
    onClickReplaceMedia(target) {
        let id = target.dataset.id;

        this.onClickUploadMedia(null, id);
    }

    /**
     * Event: Click upload media
     */
    onClickUploadMedia(target, replaceId) {
        let folder = target && target.dataset.isDirectory ? target.dataset.routingPath || '/' : '/';
        let modal = new HashBrown.Entity.View.Modal.UploadMedia({
            model: {
                replaceId: replaceId,
                folder: folder
            }
        });
            
        modal.on('success', (ids) => {
            if(replaceId) {
                let mediaViewer = Crisp.View.get(HashBrown.View.Editor.MediaViewer);

                if(mediaViewer) {
                    mediaViewer.model = null;

                    mediaViewer.fetch();
                }
            } else if(ids) {
                location.hash = '/media/' + ids[0];

            }
        });
    }

    /**
     * Item context menu
     */
    getItemContextMenu() {
        return {
            'This media': '---',
            'Move': (target) => { this.onClickMoveItem(target); },
            'Rename': (target) => { this.onClickRenameMedia(target); },
            'Remove': (target) => { this.onClickRemoveMedia(target); },
            'Replace': (target) => { this.onClickReplaceMedia(target); },
            'Copy id': (target) => { this.onClickCopyItemId(target); },
            'General': '---',
            'Upload new media': () => { this.onClickUploadMedia(); }
        };
    }

    /**
     * Pane context menu
     */
    getPaneContextMenu() {
        return {
            'Directory': '---',
            'Upload new media': (target) => { this.onClickUploadMedia(target); }
        };
    }
}

module.exports = MediaPane;
