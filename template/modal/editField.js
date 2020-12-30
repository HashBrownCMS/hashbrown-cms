'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog field-size'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Edit field'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined,
                _.if(model.tabOptions,
                    _.field({label: 'Tab'},
                        _.popup({options: model.tabOptions, value: model.definition.tabId, onchange: _.onChangeTab})
                    ),
                ),
                _.field({label: 'Schema'},
                    _.popup({options: state.schemaOptions, autocomplete: true, value: model.definition.schemaId, onchange: _.onChangeSchemaId})
                ),
                _.field({label: 'Key'},
                    _.text({value: model.key, onchange: _.onChangeKey})
                ),
                _.field({label: 'Label'},
                    _.text({value: model.definition.label, onchange: _.onChangeLabel})
                ),
                _.field({label: 'Description'},
                    _.text({value: model.definition.description, onchange: _.onChangeDescription})
                ),
                _.field({label: 'Localised'},
                    _.checkbox({value: model.definition.isLocalized, onchange: _.onChangeIsLocalized})
                ),
                state.extraFields
            )
        ),
        _.div({class: 'modal__footer'},
            _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
        )
    )
)
