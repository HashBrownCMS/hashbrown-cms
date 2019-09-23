'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal model--folders in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, model.heading || 'Pick folder'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === 'adding',
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, state.addToPath),
                    _.text({name: 'adding', value: 'New folder'}),
                    _.button({class: 'widget widget--button small fa fa-check', onclick: _.onClickConfirmAdd})
                )
            ),

            _.if(state.name === undefined,
                _.recurse([ state.root ], 'children', (i, folder, children) =>
                    _.div({class: 'modal--folders__folder'},
                        _.div({class: 'modal--folders__folder__inner'},
                            _.button({class: 'modal--folders__folder__name', onclick: (e) => _.onPick(folder.path)},
                                _.span({class: 'modal--folders__folder__icon fa fa-folder'}),
                                folder.name
                            ),
                            _.if(model.canAdd,
                                _.button({class: 'modal--folders__folder__add fa fa-plus', title: `Add folder inside "${folder.name}"`, onclick: () => _.onClickAdd(folder.path)})
                            )
                        ),
                        _.div({class: 'modal--folders__folder__children'},
                            children
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
