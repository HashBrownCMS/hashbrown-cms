'use strict';

let Pane = require('./Pane');

class MediaPane extends Pane {
    /**
     * Event: On change folder path
     *
     * @param {String} newFolder
     */
    static onChangeFolder(id, newFolder) {
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

            let mediaViewer = ViewHelper.get('MediaViewer');

            location.hash = '/media/' + id;
        })
        .catch(errorModal);
    }

    /**
     * Event: Click move Media
     */
    static onClickMoveMedia() {
        let id = $('.context-menu-target-element').data('id');
        let navbar = ViewHelper.get('NavbarMain');
        let $pane = navbar.$element.find('.pane-container.active');

        $pane.find('.pane-item-container[data-media-id="' + id + '"]').toggleClass('moving-content', true);
        $pane.toggleClass('select-dir', true);

        // TODO: Generalise this logic so it works for all panes
        
        // Reset
        function reset(newPath) {
            let mediaViewer = ViewHelper.get('MediaViewer');

            $pane.find('.pane-item-container[data-media-id="' + id + '"]').toggleClass('moving-content', false);
            $pane.toggleClass('select-dir', false);
            $pane.find('.pane-move-buttons .btn').off('click');
            $pane.find('.pane-item-container .pane-item').off('click');

            if(id == Router.params.id && mediaViewer) {
                mediaViewer.$element.find('.editor-footer input').val(newPath);
            }
        }

        // Cancel
        $(document).on('keyup', (e) => {
            if(e.which == 27) {
                reset();
            }
        });

        // Click existing directory
        $pane.find('.pane-item-container[data-is-directory="true"]').each((i, element) => {
            $(element).children('.pane-item').on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                let newPath = $(element).attr('data-media-folder');

                reset(newPath);

                this.onChangeFolder(id, newPath);
            });
        }); 

        // Click "move to root" button
        $pane.find('.pane-move-buttons .btn-move-to-root').on('click', (e) => {
            let newPath = '/';

            reset(newPath);

            this.onChangeFolder(id, newPath);
        });
        
        // Click "new folder" button
        $pane.find('.pane-move-buttons .btn-new-folder').on('click', () => {
            MediaHelper.getMediaById(id)
            .then((media) => {
                let messageModal = new MessageModal({
                    model: {
                        title: 'Move media',
                        body: _.div({},
                            'Move the media object "' + media.name + '"',
                            _.input({class: 'form-control', value: media.folder, placeholder: 'Type folder path here'})
                        )
                    },
                    buttons: [
                        {
                            label: 'Cancel',
                            class: 'btn-default',
                            callback: () => {
                            }
                        },
                        {
                            label: 'OK',
                            class: 'btn-danger',
                            callback: () => {
                                let newPath = messageModal.$element.find('input.form-control').val();
                                
                                reset(newPath);

                                this.onChangeFolder(media.id, newPath);
                            }
                        }
                    ]
                });
            })
            .catch(errorModal);
        });
    }

    /**
     * Event: Click cut Media
     */
    static onClickCutMedia() {
        let navbar = ViewHelper.get('NavbarMain');
        let cutId = $('.context-menu-target-element').data('id');

        // This function should only exist if an item has been cut
        this.onClickPasteMedia = function onClickPasteMedia() {
            let parentFolder = $('.context-menu-target-element').data('media-folder');
         
            apiCall(
                'post',
                'media/tree/' + cutId,
                parentFolder ? {
                    id: cutId,
                    folder: parentFolder
                } : null
            )
            .then(() => {
                reloadResource('media')
                .then(() => {
                    navbar.reload();

                    location.hash = '/media/' + cutId;
                });

                navbar.onClickPasteMedia = null;
            })
            .catch(navbar.onError);
        }
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
            (id) => {
                location.hash = '/media/' + id;

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

            // Sorting logic
            sort: function(item, queueItem) {
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
                'Cut': () => { this.onClickCutMedia(); },
                'Move': () => { this.onClickMoveMedia(); },
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

module.exports = MediaPane;
