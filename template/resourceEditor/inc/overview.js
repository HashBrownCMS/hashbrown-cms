'use strict';

module.exports = (_, model, state) => 

_.div({class: 'resource-editor__overview'},
    _.h1({localized: true, class: 'resource-editor__overview__heading'},
        _.span({class: `resource-editor__overview__heading__icon fa fa-${state.icon}`}),
        state.title
    ),
    _.p({localized: true}, 'Click any item in the panel to view it.'),
    _.p({localized: true}, 'Use the context menu (right click or the ⋮ button) to perform other actions.'),
    _.h2({localized: true}, 'Actions'),
    _.div({class: 'resource-editor__overview__actions'},
        _.each(state.actions, (i, action) => 
            _.button({localized: true, class: 'widget widget--button condensed', onclick: action.handler, title: action.description}, action.name),
        ),
        _.button({localized: true, class: 'widget widget--button condensed hidden-phone', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
    )
)
