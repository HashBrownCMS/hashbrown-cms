'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in', role: model.role},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, model.heading),
            !model.isBlocking ? [
                _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
            ] : null
        ),

        state.prependedHtml || model.message ? [
            _.ul({class: 'modal__body'},
                _.html(state.prependedHtml),
                _.li({class: 'modal__body__message'}, _.html(model.message))
            )
        ] : null,

        !model.isBlocking ? [
            _.div({class: 'modal__footer'},
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            )
        ] : null
    )
)
