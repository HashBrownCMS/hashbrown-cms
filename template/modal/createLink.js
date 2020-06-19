'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Create link'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message,

            ] : [
                model.useText !== false ? [
                    _.div({class: 'widget-group'},
                        _.div({class: 'widget widget--label'}, 'Text'),
                        _.text({name: 'input', value: model.text, onchange: _.onChangeText})
                    )
                ] : null,
                _.div({class: 'widget-group'},
                    _.div({class: 'widget widget--label'}, 'URL'),
                    _.text({name: 'input', value: model.url, onchange: _.onChangeUrl}),
                    model.useNewTab !== false ? [
                        _.checkbox({placeholder: 'New tab', value: model.newTab, onchange: _.onChangeNewTab})
                    ] : null
                )
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            
            ]
        )
    )
)
