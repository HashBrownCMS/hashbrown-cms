'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--confirm in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, model.heading),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message
            ] : [
                model.message
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickNo}, 'No'),
                _.button({class: 'widget widget--button', onclick: _.onClickYes}, 'Yes')
            ]
        )
    )
)
