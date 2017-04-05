'use strict';

class MediaPane extends NavbarPane {
    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    static onChangeDirectory(id, newFolder) {
        apiCall(
            'post',
            'media/tree/' + id,
            newFolder ? {
                id: id,
                folder: newFolder
            } : null
        )
        .then(() => {
            return reloadResource('media');
        })
        .then(() => {
            ViewHelper.get('NavbarMain').reload();

            location.hash = '/media/' + id;
        })
        .catch(errorModal);
    }

    /**
     * Event: Click remove media
     */
    static onClickRemoveMedia() {
        let navbar = ViewHelper.get('NavbarMain');
        let $element = $('.context-menu-target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        function onSuccess() {
            reloadResource('media')
            .then(function() {
                ViewHelper.get('NavbarMain').reload();
                
                // Cancel the MediaViever view if it was displaying the deleted object
                if(location.hash == '#/media/' + id) {
                    location.hash = '/media/';
                }
            });
        }

        new MessageModal({
            model: {
                title: 'Delete media',
                body: 'Are you sure you want to delete the media object "' + name + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: function() {
                    }
                },
                {
                    label: 'OK',
                    class: 'btn-danger',
                    callback: function() {
                        apiCall('delete', 'media/' + id)
                        .then(onSuccess)
                        .catch(navbar.onError);
                    }
                }
            ]
        });
    }

    /**
     * Event: Click replace media
     */
    static onClickReplaceMedia() {
        let id = $('.context-menu-target-element').data('id');

        this.onClickUploadMedia(id);
    }

    /**
     * Event: Click upload media
     */
    static onClickUploadMedia(replaceId) {
        MediaBrowser.uploadModal(
            (ids) => {
                // We got one id back
                if(typeof ids === 'string') {
                    location.hash = '/media/' + ids;

                // We got several ids back
                } else {
                    location.hash = '/media/' + ids[0];
                
                }

                // Refresh on replace
                if(replaceId) {
                    let src = $('.media-preview img').attr('src');
                    
                    $('.media-preview img').attr('src', src + '?date=' + Date.now());
                }
            },
            () => {},
            replaceId
        );
    }
    
    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/media/', 'Media', 'file-image-o', {
            getItems: () => { return resources.media; },

            // Hierarchy logic
            hierarchy: (item, queueItem) => {
                let isSyncEnabled = SettingsHelper.getCachedSettings('sync').enabled;
                let isMediaSyncEnabled = isSyncEnabled && SettingsHelper.getCachedSettings('sync')['media/tree'];

                queueItem.$element.attr('data-media-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = { 'data-media-folder': item.folder };
                    queueItem.parentDirExtraAttr = { 'data-remote': isMediaSyncEnabled };
                }
            },
            
            // Item context menu
            itemContextMenu: {
                'This media': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Move': () => { this.onClickMoveItem(); },
                'Remove': () => { this.onClickRemoveMedia(); },
                'Replace': () => { this.onClickReplaceMedia(); },
                'Folder': '---',
                'Upload new media': () => { this.onClickUploadMedia(); }
            },

            // Dir context menu
            dirContextMenu: {
                'Directory': '---',
                'New folder': () => { this.onClickNewMediaDirectory(); },
                'Upload new media': () => { this.onClickUploadMedia(); },
                'Remove': () => { this.onClickRemoveMediaDirectory(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'New folder': () => { this.onClickNewMediaDirectory(); },
                'Upload new media': () => { this.onClickUploadMedia(); }
            }
        });
    }
}

// Settings
MediaPane.canCreateDirectory = true;

module.exports = MediaPane;
