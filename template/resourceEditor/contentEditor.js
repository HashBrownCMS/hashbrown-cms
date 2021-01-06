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
            _.div({class: 'resource-editor__welcome'},
                _.h1({localized: true, class: 'resource-editor__welcome__heading'},
                    state.title,
                    _.span({class: `resource-editor__welcome__heading__icon fa fa-${state.icon}`})
                ),
                _.p({localized: true}, 'Click any item in the panel to edit it.'),
                _.p({localized: true}, 'Use the context menu (right click or the ⋮ button) to perform other actions.'),
                _.h2({localized: true}, 'Actions'),
                _.div({class: 'resource-editor__welcome__actions'},
                    _.button({localized: true, class: 'widget widget--button condensed', onclick: _.onClickNew, title: 'Create new content'}, 'New content'),
                    _.button({localized: true, class: 'widget widget--button condensed', title: 'Republish all content', name: 'republish', onclick: _.onClickRepublishAllContent }, 'Republish'),
                    _.button({localized: true, class: 'widget widget--button condensed hidden-phone', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
                )
            )
        
        ] : [
            _.each(state.fields, (key, field) =>
                field.element
            )
        ]
    ),
    _.include(require('./inc/footer'))
)
