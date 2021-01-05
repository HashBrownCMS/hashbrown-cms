'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog fields'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Add environment'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message,
            
            ] : [
                _.field({localized: true, separator: false, label: 'Environment name'},
                    _.input({class: 'widget widget--text', type: 'text', value: state.environmentName, onchange: (e) => _.onInputName(e.target.value)})
                ),
                _.field({localized: true, separator: false, label: 'Copy from'},
                    _.popup({options: model.environments, clearable: true, onchange: _.onChangeCopyFromEnvironment})
                )

            ]
        ),
        _.div({localized: true, class: 'modal__footer'},
            state.name === 'error'? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickAdd}, 'Add')
            
            ]
        )
    )
)
