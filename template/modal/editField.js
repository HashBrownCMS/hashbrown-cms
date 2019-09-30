'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Edit field "${model.definition.label || model.key}"`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.field({label: 'Schema'},
                _.popup({options: state.schemaOptions, value: model.definition.schemaId, onchange: _.onChangeSchemaId})
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
            _.field({label: 'Multilingual'},
                _.checkbox({value: model.definition.multilingual, onchange: _.onChangeIsMultilingual})
            ),
            state.extraFields
        ),
        _.div({class: 'modal__footer'},
            _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
        )
    )
)
