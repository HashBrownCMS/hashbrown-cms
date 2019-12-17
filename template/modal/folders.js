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

            _.if(state.name === undefined,
                _.folders({options: model.folders, onadd: _.onPick, onclick: _.onPick, add: true})
            )
        ),
        _.if(state.name === 'error', 
            _.div({class: 'modal__footer'},
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            )
        )
    )
)
