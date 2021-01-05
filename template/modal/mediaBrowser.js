'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--media-browser in'},
    _.div({class: 'modal__dialog modal--media-browser__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Pick media'),
            _.search({class: 'widget-group modal--media-browser__search', value: state.searchQuery, onsearch: _.onClickSearch, onclear: _.onClickClearSearch}),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body modal--media-browser__body'},
            state.name === 'error' ? [
                state.message,
 
            ] : [
                _.folders({class: 'modal--media-browser__folders', options: state.folders, value: state.folder, onclick: _.onClickFolder}),

            ],

            state.name === undefined || state.name === 'searching' ? [
                _.div({localized: true, class: 'modal--media-browser__items', name: 'items'},
                    state.items.length < 1 && state.name === 'searching' ? [
                        `No results matching "${state.searchQuery}"`
                    ] : null,

                    _.each(state.items, (i, item) =>
                        _.button({class: 'modal--media-browser__item', 'data-folder': item.folder, title: item.name, onclick: (e) => _.onClickItem(item.id)},
                            _.media({disabled: true, value: item, thumbnail: true})
                        )
                    )
                )
            ] : null
        ),
        _.div({localized: true, class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickUpload}, 'Upload')
            
            ]
        )
    )
)
