'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--publication-editor'},
    state.name === 'error' ? [
        _.div({class: 'widget widget--message centered warn'},
            state.message
        )
    
    ] : state.name === 'welcome' ? [
        _.div({class: 'resource-editor__welcome'},
            _.h1('Publications'),
            _.p('Click any item in the panel to edit it.'),
            _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button', onclick: _.onClickNew, title: 'Create a new publication'}, 'New publication'),
                _.button({class: 'widget widget--button', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
            )
        )
    
    ] : [
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body', name: 'body'},
            _.field({label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({label: 'GET URL'},
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, state.getUrl),
                    _.button({class: 'widget widget--button small fa fa-copy', onclick: _.onClickCopyGetUrl})
                )
            ),
            _.field({label: 'Processor', description: 'The format to expose content in'},
                _.popup({value: model.processorAlias, options: state.processorOptions, onchange: _.onChangeProcessor})
            ),
            _.field({label: 'Root content', description: 'The root content item to expose'},
                _.popup({disabled: model.isLocked, clearable: true, value: model.rootContent, options: state.contentOptions, onchange: _.onChangeRootContent})
            ),
            _.field({label: 'Allowed schemas'},
                _.popup({disabled: model.isLocked, multiple: true, value: model.allowedSchemas, options: state.schemaOptions, onchange: _.onChangeAllowedSchemas})
            )
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
