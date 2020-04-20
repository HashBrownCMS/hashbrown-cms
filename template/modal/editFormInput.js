'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Edit input "${model.key}"`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined,
                _.field({label: 'Name'},
                    _.text({onchange: _.onChangeKey, value: model.key})
                ),
                _.field({label: 'Type'},
                    _.popup({options: ['checkbox', 'hidden', 'number', 'select', 'text'], value: model.definition.type, onchange: _.onChangeType})
                ),
                _.if(model.definition.type === 'text',
                    _.field({label: 'Pattern'},
                        _.text({onchange: _.onChangePattern, value: model.definition.pattern})
                    )
                ),
                _.if(model.definition.type === 'select',
                    _.field({label: 'Options'},
                        _.list({onchange: _.onChangeOptions, value: model.definition.options, sortable: true})
                    )
                ),
                _.field({label: 'Required'},
                    _.checkbox({value: model.definition.required, onchange: _.onChangeIsRequired})
                ),
                _.field({label: 'Unique'},
                    _.checkbox({value: model.definition.checkDuplicates, onchange: _.onChangeCheckDuplicates})
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            )
        )
    )
)
