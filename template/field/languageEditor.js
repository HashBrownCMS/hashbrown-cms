'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field field--language-editor'},
    _.if(state.name === 'error',
        state.message
    ),

    _.if(state.name === undefined,
        _.div({class: 'field__key'},
            _.div({class: 'field__key__label', title: model.key}, model.label),
            _.div({class: 'field__key__description'}, model.description)
        ),
        _.div({class: 'field__value'},
            _.popup({disabled: model.isDisabled, options: state.languageOptions, value: state.value, onchange: _.onChange})
        )
    )
)
