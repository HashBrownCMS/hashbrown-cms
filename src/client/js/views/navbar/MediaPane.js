'use strict';

let Pane = require('./Pane');

class MediaPane extends Pane {
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
        })
        .catch(errorModal);
    }

    /**
     * Event: Click remove media
     */
    static onClickRemoveMedia() {
        let navbar = ViewHelper.get('NavbarMain');
        let id = $('.context-menu-target-element').data('id');
        let name = $('.context-menu-target-element').data('name');
        
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
                location.hash = '/media/' + ids[0];

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
     * Event: Click browse media
     */
    static onClickBrowseMedia() {
        new MediaBrowser();
    }

    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} Toolbar
     */
    static renderToolbar() {
        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div(
                _.button({class: 'btn btn-primary'}, 'Upload media')
                    .click(() => { this.onClickUploadMedia(); })
            ),
            _.div(
                _.button({class: 'btn btn-primary'}, 'Browse')
                    .click(() => { this.onClickBrowseMedia(); })
            )
        );

        return $toolbar;
    }

    /**
     * Gets the render settings
     *
     * @returns {Object} settings
     */
    static getRenderSettings() {
        let isSyncEnabled = SettingsHelper.getCachedSettings('sync').enabled;
        let isMediaSyncEnabled = isSyncEnabled && SettingsHelper.getCachedSettings('sync')['media/tree'];

        return {
            label: 'Media',
            route: '/media/',
            icon: 'file-image-o',
            items: resources.media,
            toolbar: this.renderToolbar(),

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
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
                'Directory': '---',
                'Upload new media': () => { this.onClickUploadMedia(); }
            },

            // Dir context menu
            dirContextMenu: {
                'Directory': '---',
                'Paste': () => { this.onClickPasteMedia(); },
                'New folder': () => { this.onClickNewMediaDirectory(); },
                'Upload new media': () => { this.onClickUploadMedia(); },
                'Remove': () => { this.onClickRemoveMediaDirectory(); }
            },

            // General context menu
            paneContextMenu: {
                'General': '---',
                'Paste': () => { this.onClickPasteMedia(); },
                'New folder': () => { this.onClickNewMediaDirectory(); },
                'Upload new media': () => { this.onClickUploadMedia(); }
            }
        };
    }
}

// Settings
MediaPane.canCreateDirectory = true;

module.exports = MediaPane;
