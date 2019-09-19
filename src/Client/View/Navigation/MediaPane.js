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
    onClickRenameMedia() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');

        let modal = UI.messageModal(
            'Rename ' + name,
            new HashBrown.Entity.View.Widget.Text({
                model: {
                    value: name,
                    onchange: (newValue) => { name = newValue; }
                }
            }).element,
            async () => {
                await HashBrown.Service.RequestService.request('post', 'media/rename/' + id + '?name=' + name);

                HashBrown.Service.EventService.trigger('resource');  

                let mediaViewer = Crisp.View.get(HashBrown.View.Editor.MediaViewer);

                if(mediaViewer && mediaViewer.model && mediaViewer.model.id === id) {
                    mediaViewer.model = null;

                    mediaViewer.fetch();
                }
            }
        );

        modal.$element.find('input').focus();
    }

    /**
     * Event: Click remove media
     */
    onClickRemoveMedia() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        UI.confirmModal(
            'delete',
            'Delete media',
            'Are you sure you want to delete the media object "' + name + '"?',
            async () => {
                $element.parent().toggleClass('loading', true);

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
    onClickReplaceMedia() {
        let id = $('.context-menu-target').data('id');

        this.onClickUploadMedia(id);
    }

    /**
     * Event: Click upload media
     */
    onClickUploadMedia(replaceId) {
        let folder = $('.context-menu-target').data('media-folder') || '/';

        new HashBrown.View.Modal.MediaUploader({
            onSuccess: (ids) => {
                // We got one id back
                if(typeof ids === 'string') {
                    location.hash = '/media/' + ids;

                // We got several ids back
                } else if(Array.isArray(ids)) {
                    location.hash = '/media/' + ids[0];
                
                }

                // Refresh on replace
                if(replaceId) {
                    let mediaViewer = Crisp.View.get(HashBrown.View.Editor.MediaViewer);

                    if(mediaViewer) {
                        mediaViewer.model = null;

                        mediaViewer.fetch();
                    }
                }
            },
            replaceId: replaceId,
            folder: folder
        });
    }

    /**
     * Hierarchy logic
     */
    hierarchy(item, queueItem) {
        let isSyncEnabled = HashBrown.Context.projectSettings.sync.enabled;

        queueItem.$element.attr('data-media-id', item.id);
        queueItem.$element.attr('data-remote', true);
       
        if(item.folder) {
            queueItem.createDir = true;
            queueItem.parentDirAttr = { 'data-media-folder': item.folder };
            queueItem.parentDirExtraAttr = { 'data-remote': isSyncEnabled };
        }
    }
    
    /**
     * Item context menu
     */
    getItemContextMenu() {
        return {
            'This media': '---',
            'Open in new tab': () => { this.onClickOpenInNewTab(); },
            'Move': () => { this.onClickMoveItem(); },
            'Rename': () => { this.onClickRenameMedia(); },
            'Remove': () => { this.onClickRemoveMedia(); },
            'Replace': () => { this.onClickReplaceMedia(); },
            'Copy id': () => { this.onClickCopyItemId(); },
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
            'Upload new media': () => { this.onClickUploadMedia(); }
        };
    }
}

module.exports = MediaPane;
