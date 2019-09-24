'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--media-browser in'},
    _.div({class: 'modal__dialog modal--media-browser__dialog'},
        _.div({class: 'modal__header'},
            _.text({class: 'modal--media-browser__search', placeholder: 'Search...', oninput: _.onSearch}),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body modal--media-browser__body'},
            _.if(state.name === 'error', 
                state.message,
            ),
   
            _.if(state.name === undefined,
                _.folders({class: 'modal--media-browser__folders', options: state.folders, value: state.folder, onclick: _.onClickFolder}),
                _.div({class: 'modal--media-browser__items', name: 'items'},
                    _.each(state.items, (i, item) =>
                        _.button({class: 'modal--media-browser__item', 'data-folder': item.folder, title: item.name, onclick: (e) => _.onClickItem(item.id)},
                            item.isImage() ?
                                _.img({class: 'modal--media-browser__item__image', alt: item.name, src: `/media/${HashBrown.Context.projectId}/${HashBrown.Context.environment}/${item.id}?width=800&t=${Date.now()}`})
                            : null,
                            item.isVideo() ?
                                _.video({class: 'modal--media-browser__item__video'},
                                    _.source({src: `/media/${HashBrown.Context.projectId}/${HashBrown.Context.environment}/${item.id}`})
                                )
                            : null,
                            !item.isImage() && !item.isVideo() ?
                                _.span({class: 'fa fa-file modal--media-browser__item__file'})
                            : null,
                            _.label({class: 'modal--media-browser__item__name'}, item.name)
                        )
                    )
                )
            )
        ),
        _.if(state.name === 'error', 
            _.div({class: 'modal__footer'},
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            )
        )
    )
)
