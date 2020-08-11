'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--json-editor'},
    _.include(require('./inc/header')),
    state.name === 'error' ? [
        _.div({class: 'widget widget--message centered warn'},
            state.message
        )
    
    ] : [
        _.div({name: 'body', class: 'resource-editor__body resource-editor--json-editor__body'}),
        _.div({class: 'resource-editor__footer'},
            _.include(require('./inc/warning')),
            _.div({class: 'resource-editor__footer__actions'},
                _.a({href: `#/${state.library}/${state.id}`, class: 'widget widget--button embedded'}, 'Basic'),
                _.if(!model.isLocked,
                    _.button({class: 'widget widget--button', name: 'save', onclick: _.onClickSave}, 'Save')
                )
            )
        )
    ]
)
