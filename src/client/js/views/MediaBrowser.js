'use strict';

class MediaBrowser extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'modal fade media-browser'});

        this.init();
        
        // Make sure the modal is removed when it's cancelled
        this.$element.on('hidden.bs.modal', () => {
           this.$element.remove(); 
        });

        // Show the modal
        this.$element.modal('show');
    }

    /**
     * Open the upload modal
     *
     * @param {Function} onSuccess
     * @param {Function} onCancel
     * @param {String} replaceId
     */
    static uploadModal(onSuccess, onCancel, replaceId) {
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

                if(isImage) {
                    let reader = new FileReader();
                    
                    uploadModal.$element.find('.spinner-container').toggleClass('hidden', false);

                    reader.onload = function(e) {
                        uploadModal.$element.find('.media-preview').html(
                            _.img({src: e.target.result})
                        );


                        uploadModal.$element.find('.spinner-container').toggleClass('hidden', true);
                    }
                    
                    reader.readAsDataURL(file);
                }
                        
                if(isVideo) {
                    uploadModal.$element.find('.media-preview').html(
                        _.video({src: window.URL.createObjectURL(file), controls: 'controls'})
                    );
                }

                debug.log('Previewing data of file type ' + file.type + '...', navbar);
            }
        }
        
        function onClickUpload() {
            uploadModal.$element.find('form').submit();

            return false;
        }

        function onSubmit(e) {
            e.preventDefault();

            uploadModal.$element.find('.spinner-container').toggleClass('hidden', false);
            
            let apiPath = 'media/' + (replaceId ? replaceId : 'new');

            $.ajax({
                url: apiUrl(apiPath),
                type: 'POST',
                data: new FormData(this),
                processData: false,
                contentType: false,
                success: (id) => {
                    reloadResource('media')
                    .then(() => {
                        uploadModal.$element.find('.spinner-container').toggleClass('hidden', true);

                        navbar.reload();

                        if(onSuccess) {
                            onSuccess(id);
                        }
                        
                        uploadModal.hide();
                    });
                },
                error: errorModal
            });
        }

        let uploadModal = new MessageModal({
            model: {
                class: 'modal-upload-media',
                title: 'Upload a file',
                body: [
                    _.div({class: 'spinner-container hidden'},
                        _.span({class: 'spinner fa fa-refresh'})
                    ),
                    _.div({class: 'media-preview'}),
                    _.form({class: 'form-control'},
                        _.input({type: 'file', name: 'media'})
                            .change(onChangeFile)
                    ).submit(onSubmit)
                ]
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: onCancel
                },
                {
                    label: 'Upload',
                    class: 'btn-primary',
                    callback: onClickUpload
                }
            ]
        });

        uploadModal.on('close', () => {
            if(onCancel) {
                onCancel();
            } 
        });
    }

    /**
     * Event: Search media
     */
    onSearchMedia() {
        let query = (this.$element.find('.input-search-media').val() || '').toLowerCase();

        this.$element.find('.thumbnail').each(function(i) {
            let isMatch = (!query || ($(this).attr('data-name') || '').toLowerCase().indexOf(query) > -1);     

            $(this).toggleClass('hidden', !isMatch);
        });       
    }

    /** 
     * Event: Click OK
     */
    onClickOK() {
        this.value = this.$element.find('.thumbnail.active').attr('data-id');

        if(this.value) {
            this.trigger('select', this.value);
        }

        this.$element.modal('hide');
    }
    
    /** 
     * Event: Click cancel
     */
    onClickCancel() {
        this.$element.modal('hide');
    }

    render() {
        // Render the modal
        let $folders = [];

        _.append(this.$element.empty(),
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'},
                    _.div({class: 'modal-header'},
                        _.div({class: 'input-group'}, 
                            _.input({class: 'form-control input-search-media', placeholder: 'Search media'})
                                .on('change keyup paste', () => {
                                    this.onSearchMedia();
                                }),
                            _.div({class: 'input-group-btn'},
                                _.button({class: 'btn btn-primary'},
                                    'Upload media'
                                ).click(() => {
                                    this.$element.toggleClass('disabled', true);

                                    MediaBrowser.uploadModal(
                                        (id) => {
                                            this.$element.toggleClass('disabled', false);

                                            this.value = id;

                                            this.render();
                                        },
                                        () => {
                                            this.$element.toggleClass('disabled', false);
                                        }
                                    );
                                })
                            )
                        )
                    ),
                    _.div({class: 'modal-body'},
                        _.div({class: 'thumbnail-container'},
                            // Append all files
                            _.each(resources.media, (i, media) => {
                                media = new Media(media);

                                let $media = _.button(
                                    {
                                        class: 'thumbnail raised',
                                        'data-id': media.id,
                                        'data-name': media.name,
                                    },
                                    _.if(media.isVideo(),
                                        _.video({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                                    ),
                                    _.if(media.isImage(),
                                        _.img({src: '/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id})
                                    ),
                                    _.label(media.name)  
                                ).click(() => {
                                    this.$element.find('.thumbnail').toggleClass('active', false);
                                    $media.toggleClass('active', true);
                                });
                                
                                if(media.folder) {
                                    let $folder = $folders[media.folder];

                                    if(!$folder) {
                                        $folder = _.div({class: 'folder', 'data-path': media.folder},
                                            _.div({class: 'folder-heading'},
                                                _.h4({},
                                                    _.span({class: 'fa fa-folder'}),
                                                    media.folder
                                                )
                                            ),
                                            _.div({class: 'folder-items'})
                                        );

                                        $folders[media.folder] = $folder;
                                    }

                                    // Wait 1 CPU cycle before appending to folders
                                    setTimeout(() =>{ 
                                        $folder.find('.folder-items').append($media);
                                    }, 1);
                                }

                                return $media;
                            }),

                            // Append all folders
                            _.each(Object.keys($folders).sort(), (i, path) => {
                                return $folders[path];
                            })
                        )
                    ),
                    _.div({class: 'modal-footer'},
                        _.button({class: 'btn btn-default'},
                            'Cancel'
                        ).click(() => {
                            this.onClickCancel();
                        }),
                        _.button({class: 'btn btn-primary'},
                            'OK'
                        ).click(() => {
                            this.onClickOK();
                        })
                    )
                )
            )
        );

        // Mark the selected media as active
        this.$element.find('.thumbnail[data-id="' + this.value + '"]').toggleClass('active', true);
    }
}

module.exports = MediaBrowser;
