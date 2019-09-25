'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field'},
    _.if(state.name === 'error',
        state.message
    ),

    _.if(state.name === undefined,
        _.div({class: 'field__key'},
            _.div({class: 'field__key__label', title: model.key}, model.label),
            _.div({class: 'field__key__description'}, model.description)
        ),
        _.div({class: 'field__value'},
            `(no field${model.schema.editorId ? ` "${model.schema.editorId}"` : ''} available for the "${model.schema.id}" schema)`
        )
    )
)
