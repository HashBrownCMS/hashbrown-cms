'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--connection-editor'},
    state.name === 'error' ? [
        state.message
    
    ] : state.name === 'welcome' ? [
        _.div({class: 'resource-editor__welcome'},
            _.h1('Connections'),
            _.p('Click any item in the panel to edit it.'),
            _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button', onclick: _.onClickNew, title: 'Create a new connection'}, 'New connection'),
                _.button({class: 'widget widget--button', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
            )
        )
    
    ] : [
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body', name: 'body'},
            _.field({label: 'Media provider', decription: 'Use this connection to store media'},
                _.checkbox({value: state.isMediaProvider, onchange: _.onChangeIsMediaProvider})
            ),
            _.field({label: 'Title'},
                _.text({disabled: model.isLocked, value: model.title, onchange: _.onChangeTitle})
            ),
            _.field({label: 'URL'},
                _.text({disabled: model.isLocked, value: model.url, onchange: _.onChangeUrl})
            ),
            _.field({label: 'Processor', description: 'The format to deploy content in'},
                state.processorFields
            ),
            _.field({label: 'Deployer', description: 'How to transfer data to and from the remote server'},
                state.deployerFields
            ),
        ),
        _.div({class: 'resource-editor__footer'},
            _.include(require('./inc/warning')),
            _.div({class: 'resource-editor__footer__actions'},
                _.a({href: `#/${state.category}/${state.id}/json`, class: 'widget widget--button embedded'}, 'Advanced'),
                _.if(!model.isLocked,
                    _.button({class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
                )
            )
        )

    ]
)
