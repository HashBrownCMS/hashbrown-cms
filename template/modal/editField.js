'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog field-size'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Edit field'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message,

            ] : [
                model.tabOptions ? [
                    _.field({localized: true, label: 'Tab'},
                        _.popup({options: model.tabOptions, value: model.definition.tabId, onchange: _.onChangeTab})
                    ),
                ] : null,
                _.field({localized: true, label: 'Schema'},
                    _.popup({options: state.schemaOptions, autocomplete: true, value: model.definition.schemaId, onchange: _.onChangeSchemaId})
                ),
                _.field({localized: true, label: 'Key'},
                    _.text({value: model.key, onchange: _.onChangeKey})
                ),
                _.field({localized: true, label: 'Label'},
                    _.text({value: model.definition.label, onchange: _.onChangeLabel})
                ),
                _.field({localized: true, label: 'Description'},
                    _.text({value: model.definition.description, onchange: _.onChangeDescription})
                ),
                _.field({localized: true, label: 'Localised'},
                    _.checkbox({value: model.definition.isLocalized, onchange: _.onChangeIsLocalized})
                ),
                state.extraFields
            ]
        ),
        _.div({class: 'modal__footer'},
            _.button({localized: true, class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
        )
    )
)
