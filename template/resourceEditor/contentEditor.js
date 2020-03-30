'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--content-editor'},
    state.name === 'error' ? [
        _.div({class: 'widget widget--message centered warn'},
            state.message
        )
    
    ] : state.name === 'welcome' ? [
        _.div({class: 'resource-editor__welcome'},
            _.h1('Content'),
            _.p('Click any item in the panel to edit it.'),
            _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button', onclick: _.onClickNew, title: 'Create new content'}, 'New content'),
                _.button({class: 'widget widget--button', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
            )
        )

    ] : [
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body', name: 'body'},
            _.each(state.fields, (key, field) =>
                field.element
            )
        ),
        _.div({class: 'resource-editor__footer'},
            _.include(require('./inc/warning')),
            _.div({class: 'resource-editor__footer__actions'},
                _.a({href: `#/${state.category}/${state.id}/json`, class: 'widget widget--button embedded'}, 'Advanced'),
                _.if(!model.isLocked,
                    _.div({class: 'widget-group'},
                        _.button({class: 'widget widget--button', name: 'save', onclick: _.onClickSave}, 'Save'),
                        _.checkbox({value: model.isPublished, class: 'large', name: 'published', placeholder: 'Published'})
                    )
                )
            )
        )
    
    ]
)
