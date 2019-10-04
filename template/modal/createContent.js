'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Create new content'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message,
            
            ] : [
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, 'Schema'),
                    _.popup({options: state.schemaOptions, value: state.schemaId, onchange: _.onSelectSchema})
                )
            
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickCreate}, 'Create')
            
            ]
        )
    )
)
