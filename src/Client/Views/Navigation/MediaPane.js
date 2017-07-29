'use strict';

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');
const MediaBrowser = require('Client/Views/Modals/MediaBrowser');
const MediaHelper = require('Client/Helpers/MediaHelper');

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
            NavbarMain.reload();

            location.hash = '/media/' + id;
        })
        .catch(UI.errorModal);
    }

    /**
     * Event: Click remove media
     */
    static onClickRemoveMedia() {
        let $element = $('.cr-context-menu__target-element'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        function onSuccess() {
            reloadResource('media')
            .then(function() {
                NavbarMain.reload();
                
                // Cancel the MediaViever view if it was displaying the deleted object
                if(location.hash == '#/media/' + id) {
                    location.hash = '/media/';
                }
            });
        }

        new HashBrown.Client.Views.Modals.MessageModal({
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
                        .catch(UI.errorModal);
                    }
                }
            ]
        });
    }

    /**
     * Event: Click replace media
     */
    static onClickReplaceMedia() {
        let id = $('.cr-context-menu__target-element').data('id');

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
                let isSyncEnabled = HashBrown.Client.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;

                queueItem.$element.attr('data-media-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = { 'data-media-folder': item.folder };
                    queueItem.parentDirExtraAttr = { 'data-remote': isSyncEnabled };
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
                'Upload new media': () => { this.onClickUploadMedia(); },
                'Remove': () => { this.onClickRemoveMediaDirectory(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'Upload new media': () => { this.onClickUploadMedia(); }
            }
        });
    }
}

// Settings
MediaPane.canCreateDirectory = true;

module.exports = MediaPane;
