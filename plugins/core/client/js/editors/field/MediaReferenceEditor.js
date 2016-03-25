'use strict';

class MediaReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.$element = _.div({class: 'field-editor media-reference-editor'}, [
            this.$body = _.div({class: 'thumbnail-container'}),
            this.$footer = _.div()
        ]);

        this.init();
    }

    onChange() {
        this.trigger('change', this.value);

        this.render();
    }

    onClickBrowse() {
        let editor = this;
        
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
                                    if(!editor.config.multiple) {
                                        $modal.find('.thumbnail').toggleClass('active', false);
                                        $(this).toggleClass('active', true);
                                    } else {
                                        $(this).toggleClass('active');
                                    }
                                }
                                
                                return _.button({
                                    class: 'thumbnail thumbnail-sm',
                                    'data-id': media.id,
                                    style: 'background-image: url(\'/media/' + media.id + '\')'
                                }, [
                                    _.label(media.name)  
                                ]).click(onClick);
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

        if(!editor.config.multiple) {
            $modal.find('.thumbnail[data-id="' + editor.value + '"]').toggleClass('active', true);

        } else {
            editor.value = editor.value || [];
            
            $modal.find('.thumbnail').each(function(i) {
                $(this).toggleClass('active', editor.value.indexOf($(this).attr('data-id')) > -1);
            });
        }

        $modal.on('hidden.bs.modal', function() {
           $modal.remove(); 
        });

        $modal.modal('show');

        return $modal;
    }

    render() {
        let editor = this;

        let $images;

        if(!editor.config.multiple) {
            $images = _.div({
                class: 'thumbnail thumbnail-sm',
                style: 'background-image: url(\'/media/' + editor.value + '\')'
            });
        } else {
            $images = _.each(editor.value, function(i, val) {
                return _.div({
                    class: 'thumbnail thumbnail-sm',
                    style: 'background-image: url(\'/media/' + val + '\')'
                });
            });
        }

        this.$body.html(
            $images
        );

        this.$footer.html(
            this.$button = _.button({class: 'btn btn-primary'},
                'Browse'
            ).click(function() { editor.onClickBrowse(); })
        );
    }
}

resources.editors['20007'] = MediaReferenceEditor;
