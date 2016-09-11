'use strict';

/**
 * A picker for referencing Media 
 */
class MediaReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'field-editor media-reference-editor'},
            this.$body = _.button({class: 'thumbnail raised'})
                .click(() => { this.onClickBrowse(); }),
            _.button({class: 'btn btn-remove'},
                _.span({class: 'fa fa-remove'})
            ).click((e) => { e.stopPropagation(); e.preventDefault(); this.onClickRemove(); })
        );

        this.init();
    }

    /**
     * Event: Change value
     */
    onChange() {
        this.trigger('change', this.value);

        this.render();
    }

    /**
     * Event: Click remove
     */
    onClickRemove() {
        this.value = null;

        this.onChange();
    }

    /**
     * Event: Click browse
     */
    onClickBrowse() {
        let editor = this;
        
        /** 
         * Event: Click OK
         */
        function onClickOK() {
            editor.value = $modal.find('.thumbnail.active').attr('data-id');

            editor.onChange();

            $modal.modal('hide');
        }

        /**
         * Event: Search media
         */
        function onSearchMedia() {
            let query = ($(this).val() || '').toLowerCase();

            $modal.find('.thumbnail').each(function(i) {
                let isMatch = (!query || ($(this).attr('data-name') || '').toLowerCase().indexOf(query) > -1);     

                $(this).toggleClass('hidden', !isMatch);
            });       
        }

        // Render the modal
        let $folders = [];

        let $modal = _.div({class: 'modal fade media-modal'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-body'},
                        _.div({class: 'thumbnail-container'},
                            // Append all files
                            _.each(resources.media, function(i, media) {
                                function onClick() {
                                    $modal.find('.thumbnail').toggleClass('active', false);
                                    $(this).toggleClass('active', true);
                                }
                        
                                let $media = _.button(
                                    {
                                        class: 'thumbnail raised',
                                        'data-id': media.id,
                                        'data-name': media.name,
                                        style: 'background-image: url(\'/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id + '\')'
                                    },
                                    _.label(media.name)  
                                ).click(onClick);
                                
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
                        _.input({class: 'form-control', placeholder: 'Search media'})
                            .on('change keyup paste', onSearchMedia),
                        _.button({class: 'btn btn-primary'},
                            'OK'
                        ).click(onClickOK)
                    )
                ])
            )
        );

        // Mark the selected media as active
        $modal.find('.thumbnail[data-id="' + editor.value + '"]').toggleClass('active', true);

        // Make sure the modal is removed when it's cancelled
        $modal.on('hidden.bs.modal', function() {
           $modal.remove(); 
        });

        // Show the modal
        $modal.modal('show');

        return $modal;
    }

    render() {
        if(this.value) {
            let mediaObject = (resources.media || []).filter((m) => {
                return m.id == this.value;
            })[0];

            if(mediaObject) {
                this.$body
                    .attr('style', 'background-image: url(\'/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + this.value + '\')')
                    .html(
                        _.label(mediaObject.name)
                    );
            } else {
                this.$body
                    .removeAttr('style')
                    .empty();
            }
        } else {
            this.$body
                .removeAttr('style')
                .empty();
        }
    }
}

module.exports = MediaReferenceEditor;
