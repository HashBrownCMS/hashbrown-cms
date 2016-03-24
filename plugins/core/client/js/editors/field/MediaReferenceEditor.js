'use strict';

class MediaReferenceEditor extends View {
    constructor(params) {
        super(params);

        this.init();
    }

    onChange() {
        this.trigger('change', this.value);
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
                    _.div({class: 'modal-header'}, [
                        _.button({class: 'close', 'data-dismiss': 'modal'},
                            _.span({class: 'fa fa-close'})
                        ),
                        _.h4('Pick a media object')
                    ]),
                    _.div({class: 'modal-body'},
                        _.div({class: 'row'},
                            _.each(resources.media, function(i, media) {
                                function onClick() {
                                    if(!editor.config.multiple) {
                                        $modal.find('.thumbnail').toggleClass('active', false);
                                        $(this).toggleClass('active', true);
                                    } else {
                                        $(this).toggleClass('active');
                                    }
                                }
                                
                                return _.div({class: 'col-md-3'},  
                                    _.button({class: 'list-group-item thumbnail', 'data-id': media.id}, [
                                        _.img({class: 'img-responsive', src: '/media/' + media.id}),
                                        _.label(media.name)  
                                    ]).click(onClick)
                                );
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
            $images = _.img({class: 'img-responsive', src: '/media/' + editor.value});
        } else {
            $images = _.each(editor.value, function(i, val) {
                return _.img({class: 'img-responsive', src: '/media/' + val});
            });
        }

        this.$element = _.div({class: 'field-editor media-reference-editor'}, [
            _.div({class: 'thumbnail'},
                $images
            ),
            this.$button = _.button({class: 'btn btn-primary'},
                'Browse'
            ).click(function() { editor.onClickBrowse(); })
        ]);
    }
}

resources.editors['20007'] = MediaReferenceEditor;
