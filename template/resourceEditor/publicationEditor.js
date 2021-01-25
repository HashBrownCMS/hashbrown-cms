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
            _.include(require('./inc/overview'))
    
        ] : [
            _.field({localized: true, label: 'Id', description: 'Only edit this field if you know what you\'re doing'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({localized: true, label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({localized: true, label: 'GET URL', description: 'Query this publication from the URL below, filtering via query strings, e.g. "?url=/my/page"'},
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, state.getUrl),
                    _.button({title: 'Copy URL', class: 'widget widget--button small fa fa-copy', onclick: _.onClickCopyGetUrl}),
                    _.button({title: 'Go to URL', class: 'widget widget--button small fa fa-external-link', onclick: _.onClickGoToGetUrl})
                ),
                _.h4('Extra query options:'),
                _.ul({class: 'widget widget--list'}, 
                    _.li({class: 'widget-group widget--list__item'},
                        _.label({class: 'widget widget--label small embedded'}, 'locale'),
                        _.label({class: 'widget widget--label embedded'}, model.context.project.settings.locales.join('/')),
                    ),
                    _.li({class: 'widget-group widget--list__item'},
                        _.label({class: 'widget widget--label small embedded'}, 'nocache'),
                        _.label({class: 'widget widget--label embedded'}, 'true/false'),
                    )
                )
            ),
            _.field({localized: true, label: 'Processing', description: 'The format to expose content in', size: 2},
                state.processorEditor,
            ),
            _.field({localized: true, label: 'File handling', description: 'Where to deploy published content', size: 2},
                state.deployerEditor
            ),
            _.field({localized: true, label: 'Limits', size: 2},
                _.field({localized: true, label: 'Root contents', description: 'Limit the exposed content'},
                    _.popup({autocomplete: true, disabled: model.isLocked, multiple: true, clearable: true, value: model.rootContents, options: state.contentOptions, onchange: _.onChangeRootContents})
                ),
                model.rootContents && model.rootContents.length > 0 ? [
                    _.field({localized: true, label: 'Include root', description: 'Include the root items in this publication'},
                        _.checkbox({disabled: model.isLocked, value: model.includeRoot, onchange: _.onChangeIncludeRoot})
                    )
                ] : null,
                _.field({localized: true, label: 'Allowed schemas', description: 'Limit the the type of exposed content'},
                    _.popup({autocomplete: true, disabled: model.isLocked, multiple: true, value: model.allowedSchemas, options: state.schemaOptions, onchange: _.onChangeAllowedSchemas})
                )
            )
        ]
    ),
    _.include(require('./inc/footer'))
)
