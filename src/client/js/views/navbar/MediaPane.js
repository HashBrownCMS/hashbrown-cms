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
        ).then(() => {
            reloadResource('media')
            .then(() => {
                ViewHelper.get('NavbarMain').reload();
            })
            .catch(errorModal);
        })
        .catch(errorModal);
    }

    /**
     * Event: Click move Media
     */
    static onClickMoveMedia() {
        let id = $('.context-menu-target-element').data('id');
        
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
                            
                            this.onChangeFolder(media.id, newPath);
                        }
                    }
                ]
            });
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
            debug.log('Removed media with id "' + id + '"', view); 
        
            reloadResource('media')
            .then(function() {
                view.reload();
                
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
        let navbar = ViewHelper.get('NavbarMain');

        function onChangeFile() {
            let input = $(this);
            let numFiles = this.files ? this.files.length : 1;
            
            if(numFiles > 0) {
                let file = this.files[0];

                let isImage =
                    file.type == 'image/png' ||
                    file.type == 'image/jpeg' ||
                    file.type == 'image/gif';

                let isVideo =
                    file.type == 'video/mpeg' ||
                    file.type == 'video/mp4' ||
                    file.type == 'video/quicktime' ||
                    file.type == 'video/x-matroska';

                let reader = new FileReader();

                reader.onload = function(e) {
                    if(isImage) {
                        $uploadModal.find('.media-preview').html(
                            _.img({src: e.target.result })
                        );
                    }

                    if(isVideo) {
                        $uploadModal.find('.media-preview').html(
                            _.video({src: e.target.result })
                        );
                    }

                    $uploadModal.find('.spinner-container').toggleClass('hidden', true);
                }
                        
                $uploadModal.find('.spinner-container').toggleClass('hidden', false);

                reader.readAsDataURL(file);
                debug.log('Reading data of file type ' + file.type + '...', navbar);
            }
        }
        
        function onClickUpload() {
            $uploadModal.find('form').submit();
        }

        function onSubmit(e) {
            e.preventDefault();

            $uploadModal.find('.spinner-container').toggleClass('hidden', false);
            
            let apiPath = 'media/' + (replaceId ? replaceId : 'new');

            $.ajax({
                url: apiUrl(apiPath),
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: function(id) {
                    $uploadModal.find('.spinner-container').toggleClass('hidden', true);

                    reloadResource('media')
                    .then(function() {
                        navbar.reload();
                        location.hash = '/media/' + id;

                        $uploadModal.modal('hide');
                    });
                }
            });
        }

        let $uploadModal = _.div({class: 'modal modal-upload-media fade'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.h4({class: 'modal-title'}, 'Upload a file')
                    ),
                    _.div({class: 'modal-body'},
                        _.div({class: 'spinner-container hidden'},
                            _.span({class: 'spinner fa fa-refresh'})
                        ),
                        _.div({class: 'media-preview'})
                    ),
                    _.div({class: 'modal-footer'},
                        _.div({class: 'input-group'},
                            _.form({class: 'form-control'},
                                _.input({type: 'file', name: 'media'})
                                    .change(onChangeFile)
                            ).submit(onSubmit),
                            _.div({class: 'input-group-btn'},
                                _.button({class: 'btn btn-primary'},
                                    'Upload'
                                ).click(onClickUpload)
                            )
                        )
                    )
                )
            )
        );

        $uploadModal.on('hidden.bs.modal', function() {
            $uploadModal.remove();
        });

        $('body').append($uploadModal);

        $uploadModal.modal('show');
    }
    
    /**
     * Renders the toolbar
     *
     * @returns {HTMLElement} Toolbar
     */
    static renderToolbar() {
        let $toolbar = _.div({class: 'pane-toolbar'},
            _.div({},
                _.label('Library'),
                _.button({class: 'btn btn-primary'}, 'Upload media')
                    .click(() => { this.onClickUploadMedia(); })
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
                    queueItem.parentDirAttr = {'data-media-folder': item.folder };
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
