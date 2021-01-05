'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Delete project'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message

            ] : [
                _.div({class: 'widget-group'},
                    _.p({localized: true, class: 'widget widget--label'}, 'Type the project name to confirm'),
                    _.text({placeholder: model.getName(), oninput: _.onInputName})
                )
            
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
           
            ] : [
                _.button({localized: true, class: 'widget widget--button warn disabled', onclick: _.onClickDelete}, 'Delete')
            
            ]
        )
    )
)
