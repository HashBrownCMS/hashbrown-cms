'use strict';

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');
const MediaUploader = require('Client/Views/Modals/MediaUploader');
const ProjectHelper = require('Client/Helpers/ProjectHelper');
const MediaHelper = require('Client/Helpers/MediaHelper');
const RequestHelper = require('Client/Helpers/RequestHelper');

/**
 * The Media navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class MediaPane extends NavbarPane {
    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    static onChangeDirectory(id, newFolder) {
        RequestHelper.request(
            'post',
            'media/tree/' + id,
            newFolder ? {
                id: id,
                folder: newFolder
            } : null
        )
        .then(() => {
            return RequestHelper.reloadResource('media');
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
        let $element = $('.context-menu-target'); 
        let id = $element.data('id');
        let name = $element.data('name');
        
        UI.confirmModal(
            'delete',
            'Delete media',
            'Are you sure you want to delete the media object "' + name + '"?',
            () => {
                $element.parent().toggleClass('loading', true);

                RequestHelper.request('delete', 'media/' + id)
                .then(() => {
                    return RequestHelper.reloadResource('media');
                })
                .then(() => {
                    NavbarMain.reload();

                    // Cancel the MediaViever view if it was displaying the deleted object
                    if(location.hash == '#/media/' + id) {
                        location.hash = '/media/';
                    }
                })
                .catch(UI.errorModal);
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

        new MediaUploader({
            onSuccess: (ids) => {
                // We got one id back
                if(typeof ids === 'string') {
                    location.hash = '/media/' + ids;

                // We got several ids back
                } else {
                    location.hash = '/media/' + ids[0];
                
                }

                // Refresh on replace
                if(replaceId) {
                    let src = $('.editor--media__preview').attr('src');
                    
                    $('.editor--media__preview').attr('src', src + '?date=' + Date.now());
                }
            },
            replaceId: replaceId,
            folder: folder
        });
    }
    
    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/media/', 'Media', 'file-image-o', {
            getItems: () => { return resources.media; },

            // Hierarchy logic
            hierarchy: (item, queueItem) => {
                let isSyncEnabled = HashBrown.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;

                queueItem.$element.attr('data-media-id', item.id);
                queueItem.$element.attr('data-remote', true);
               
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
                'Upload new media': () => { this.onClickUploadMedia(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'Upload new media': () => { this.onClickUploadMedia(); },
                'Refresh': () => { this.onClickRefreshResource('media'); }
            }
        });
    }
}

// Settings
MediaPane.canCreateDirectory = true;

module.exports = MediaPane;
