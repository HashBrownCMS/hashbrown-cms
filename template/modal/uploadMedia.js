'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--upload-media in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Upload media'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message,

            ] : [
                _.partial('preview',  (_, model, state) =>
                    _.div({name: 'preview', class: 'modal--upload-media__previews', name: 'previews'},
                        _.each(state.previews, (i, file) =>
                            _.div({class: 'modal--upload-media__preview'},
                                _.div({class: 'modal--upload-media__preview__display'},
                                    file.isImage ? [
                                        _.img({class: 'modal--upload-media__preview__source', src: file.src})

                                    ] : file.isVideo ? [
                                        _.video({class: 'modal--upload-media__preview__source', src: file.src})

                                    ] : [
                                        _.span({class: 'modal--upload-media__preview__source fa fa-file'})

                                    ]
                                ),
                                _.p({class: 'modal--upload-media__preview__name'}, file.name)
                            )
                        )
                    )
                ),
                _.file({
                    name: 'media',
                    multiple: !model.replaceId,
                    onchange: _.onChangeFile,
                    onsubmit: _.onSubmit
                })
            ]
        ),
        state.name === 'error' ? [
            _.div({class: 'modal__footer'},
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            )
        ] : null
    )
)
