'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--upload-media in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Upload media'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined,
                _.partial('preview',  (_, model, state) =>
                    _.div({name: 'preview', class: 'modal--upload-media__previews'},
                        _.each(state.previews, (i, file) =>
                            _.div({class: 'modal--upload-media__preview'},
                                file.isImage ? 
                                    _.img({src: file.src})
                                : null,
                                file.isVideo ?
                                    _.video({src: file.src, controls: true})
                                : null
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
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickClose}, 'Cancel')
            )
        )
    )
)
