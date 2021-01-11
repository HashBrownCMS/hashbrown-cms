'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--content-editor'},
    _.include(require('./inc/header')),
    _.div({class: 'resource-editor__body', name: 'body'},
        state.name === 'error' ? [
            _.div({class: 'widget widget--message centered warn'},
                state.message
            )
        
        ] : state.tab === 'overview' ? [
            _.include(require('./inc/overview')),
        
        ] : [
            _.each(state.fields, (key, field) =>
                field.element
            )
        ]
    ),
    _.include(require('./inc/footer'))
)
