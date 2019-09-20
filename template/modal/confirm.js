'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal modal--confirm in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, model.heading)
        ),
        _.div({class: 'modal__body'},
            model.message
        ),
        _.div({class: 'modal__footer'},
            _.button({class: 'widget widget--button', onclick: _.onClickNo}, 'No'),
            _.button({class: 'widget widget--button', onclick: _.onClickYes}, 'Yes')
        )
    )
)
