'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--confirm in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, model.heading),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message
            ] : [
                model.message
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickNo}, 'No'),
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickYes}, 'Yes')
            ]
        )
    )
)
