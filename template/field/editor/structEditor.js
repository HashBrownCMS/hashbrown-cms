'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field--struct-editor__fields'},
    _.each(state.fields, (key, field) =>
        field.element
    )
)
