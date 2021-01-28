'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog fields'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Migrate environment'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message,
            
            ] : [
                _.field({localized: true, separator: false, label: 'Destination', description: 'Migrate all resources to this environment'},
                    _.popup({value: state.to, options: state.toOptions, onchange: _.onChangeTo})
                )

            ]
        ),
        _.div({localized: true, class: 'modal__footer'},
            state.name === 'error'? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickMigrate}, 'Migrate')
            
            ]
        )
    )
)
