'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--media-editor'},
    state.name === 'error' ? [
        _.div({class: 'widget widget--message centered warn'},
            state.message
        )
    
    ] : state.name === 'welcome' ? [
        _.div({class: 'resource-editor__welcome'},
            _.h1('Media'),
            _.p('Click any item in the panel to view it.'),
            _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button', onclick: _.onClickNew, title: 'Upload new media'}, 'Upload media'),
                _.button({class: 'widget widget--button', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
            )
        )

    ] : [
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body centered', name: 'body'},
            _.media({value: model.id, readonly: true})
        )
    
    ]
)
