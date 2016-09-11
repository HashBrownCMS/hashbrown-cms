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
            if(!editor.config.multiple) {
                editor.value = $modal.find('.thumbnail.active').attr('data-id');
            
            } else {
                editor.value = [];

                $modal.find('.thumbnail.active').each(function(i) {
                    editor.value.push($(this).attr('data-id'));
                });
            }

            editor.onChange();

            $modal.modal('hide');
        }

        // Render the modal
        let $modal = _.div({class: 'modal fade media-modal'},
            _.div({class: 'modal-dialog'},
                _.div({class: 'modal-content'}, [
                    _.div({class: 'modal-header'},
                        _.input({class: 'form-control', placeholder: 'Search media'})
                    ),
                    _.div({class: 'modal-body'},
                        _.div({class: 'thumbnail-container'},
                            _.each(resources.media, function(i, media) {
                                function onClick() {
                                    $modal.find('.thumbnail').toggleClass('active', false);
                                    $(this).toggleClass('active', true);
                                }
                                
                                return _.button(
                                    {
                                        class: 'thumbnail raised',
                                        'data-id': media.id,
                                        style: 'background-image: url(\'/media/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + media.id + '\')'
                                    },
                                    _.label(media.name)  
                                ).click(onClick);
                            })
                        )
                    ),
                    _.div({class: 'modal-footer'},
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
