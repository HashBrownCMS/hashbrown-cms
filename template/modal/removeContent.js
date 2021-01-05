'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, `Remove "${state.title}"`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message,
            
            ] : [
                _.div({class: 'widget-group'},
                    _.label({localized: true, class: 'widget widget--label'}, 'Remove child content'),
                    _.checkbox({ value: false, onchange: _.onChangeDeleteChildren})
                )
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickDelete}, 'Remove')
            
            ]
        )
    )
)
