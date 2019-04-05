'use strict';

/**
 * The Media navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class MediaPane extends HashBrown.Views.Navigation.NavbarPane {
    static get route() { return '/media/'; }
    static get label() { return 'Media'; }
    static get icon() { return 'file-image-o'; }
    
    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    static async onChangeDirectory(id, newFolder) {
        await HashBrown.Helpers.RequestHelper.request(
            'post',
            'media/tree/' + id,
            newFolder ? {
                id: id,
                folder: newFolder
            } : null
        )
        
        await HashBrown.Helpers.ResourceHelper.reloadResource('media');

        location.hash = '/media/' + id;
    }

    /**
     * Event: Click rename media
     */
    static onClickRenameMedia() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');

        let modal = UI.messageModal(
            'Rename ' + name,
            new HashBrown.Views.Widgets.Input({
                type: 'text',
                value: name,
                onChange: (newValue) => { name = newValue; }
            }),
            async () => {
                await HashBrown.Helpers.RequestHelper.request('post', 'media/rename/' + id + '?name=' + name);

                await HashBrown.Helpers.ResourceHelper.reloadResource('media');

                let mediaViewer = Crisp.View.get(HashBrown.Views.Editors.MediaViewer);

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
    static onClickRemoveMedia() {
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        UI.confirmModal(
            'delete',
            'Delete media',
            'Are you sure you want to delete the media object "' + name + '"?',
            async () => {
                $element.parent().toggleClass('loading', true);

                await HashBrown.Helpers.ResourceHelper.remove('media', id);

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
    static onClickReplaceMedia() {
        let id = $('.context-menu-target').data('id');

        this.onClickUploadMedia(id);
    }

    /**
     * Event: Click upload media
     */
    static onClickUploadMedia(replaceId) {
        let folder = $('.context-menu-target').data('media-folder') || '/';

        new HashBrown.Views.Modals.MediaUploader({
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
                    let mediaViewer = Crisp.View.get(HashBrown.Views.Editors.MediaViewer);

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
     * Gets all items
     *
     * @returns {Promise} items
     */
    static getItems() {
        return HashBrown.Helpers.MediaHelper.getAllMedia();
    }

    /**
     * Hierarchy logic
     */
    static hierarchy(item, queueItem) {
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
            'Upload new media': () => { this.onClickUploadMedia(); },
            'Refresh': () => { this.onClickRefreshResource('media'); }
        };
    }

    /**
     * Dir context menu
     */
    static getDirContextMenu() {
        return {
            'Directory': '---',
            'Upload new media': () => { this.onClickUploadMedia(); },
            'General': '---',
            'Refresh': () => { this.onClickRefreshResource('media'); }
        };
    }

    /**
     * General context menu
     */
    static getPaneContextMenu() {
        return {
            'Media': '---',
            'Upload new media': () => { this.onClickUploadMedia(); },
            'Refresh': () => { this.onClickRefreshResource('media'); }
        };
    }
}

// Settings
MediaPane.canCreateDirectory = true;

module.exports = MediaPane;
