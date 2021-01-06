'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog fields'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Create new project'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message

            ] : [
                _.field({localized: true, separator: false, label: 'Project name'},
                    _.input({class: 'widget widget--text', placeholder: 'example.com', onchange: (e) => _.onInputName(e.target.value)})
                ),
                _.field({localized: true, separator: false, label: 'Project id', description: 'This is optional, and cannot be changed later'},
                    _.input({class: 'widget widget--text', placeholder: 'example_com', onchange: (e) => _.onInputId(e.target.value)})
                )
            
            ]

        ),
        _.div({localized: true, class: 'modal__footer'},
            state.name === 'error'? [
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickCreate}, 'OK')
            
            ]
        )
    )
)
