'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--publication-editor'},
    _.include(require('./inc/header')),
    _.div({class: 'resource-editor__body', name: 'body'},
        state.name === 'error' ? [
            _.div({class: 'widget widget--message centered warn'},
                state.message
            )
        
        ] : state.tab === 'overview' ? [
            _.div({class: 'resource-editor__welcome'},
                _.h1({class: 'resource-editor__welcome__heading'},
                    state.title,
                    _.span({class: `resource-editor__welcome__heading__icon fa fa-${state.icon}`})
                ),
                _.p('Click any item in the panel to edit it.'),
                _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
                _.h2('Actions'),
                _.div({class: 'resource-editor__welcome__actions'},
                    _.button({class: 'widget widget--button condensed', onclick: _.onClickNew, title: 'Create a new publication'}, 'New publication'),
                    _.button({class: 'widget widget--button condensed hidden-phone', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
                )
            )
    
        ] : [
            _.field({label: 'Id'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({label: 'GET URL', description: 'Where to query this publication from'},
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, state.getUrl),
                    _.button({title: 'Copy URL', class: 'widget widget--button small fa fa-copy', onclick: _.onClickCopyGetUrl}),
                    _.button({title: 'Go to URL', class: 'widget widget--button small fa fa-external-link', onclick: _.onClickGoToGetUrl})
                )
            ),
            _.field({label: 'Processing', description: 'The format to expose content in', labelTag: 'h2'},
                state.processorEditor,
            ),
            _.field({label: 'File handling', description: 'Where to deploy published content', labelTag: 'h2'},
                state.deployerEditor
            ),
            _.field({label: 'Limits', labelTag: 'h2'},
                _.field({label: 'Root contents', description: 'Limit the exposed content'},
                    _.popup({autocomplete: true, disabled: model.isLocked, multiple: true, clearable: true, value: model.rootContents, options: state.contentOptions, onchange: _.onChangeRootContents})
                ),
                model.rootContents && model.rootContents.length > 0 ? [
                    _.field({label: 'Include root', description: 'Include the root items in this publication'},
                        _.checkbox({disabled: model.isLocked, value: model.includeRoot, onchange: _.onChangeIncludeRoot})
                    )
                ] : null,
                _.field({label: 'Allowed schemas', description: 'Limit the the type of exposed content'},
                    _.popup({autocomplete: true, disabled: model.isLocked, multiple: true, value: model.allowedSchemas, options: state.schemaOptions, onchange: _.onChangeAllowedSchemas})
                )
            )
        ]
    ),
    _.include(require('./inc/footer'))
)
