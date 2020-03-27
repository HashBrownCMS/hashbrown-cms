'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Delete ${model.getName()}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message

            ] : [
                _.div({class: 'widget-group'},
                    _.p({class: 'widget widget--label'}, 'Type the project name to confirm'),
                    _.text({placeholder: model.getName(), oninput: _.onInputName})
                )
            
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
           
            ] : [
                _.button({class: 'widget widget--button warn disabled', onclick: _.onClickDelete}, 'Delete')
            
            ]
        )
    )
)
