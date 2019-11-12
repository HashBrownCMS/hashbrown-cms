'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--schema-editor'},
    state.name === 'error' ? [
        _.div({class: 'widget widget--message centered warn'},
            state.message
        )

    ] : state.name === 'welcome' ? [
        _.div({class: 'resource-editor__welcome'},
            _.h1('Schemas'),
            _.p('Click any item in the panel to edit it.'),
            _.p('Use the context menu (right click or the ', _.span({class: 'fa fa-ellipsis-v'}), ' button) to perform other actions.'),
            _.div({class: 'widget-group'},
                _.button({class: 'widget widget--button', onclick: _.onClickImport, title: 'Import schemas'}, 'Import'),
                _.button({class: 'widget widget--button', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
            )
        )
    
    ] : [
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body', name: 'body'},
            _.field({label: 'Id'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({label: 'Icon'},
                _.button({disabled: model.isLocked, class: `widget widget--button small fa fa-${state.icon || ''}`, onclick: _.onClickChangeIcon})
            ),
            _.field({label: 'Parent'},
                _.popup({disabled: model.isLocked, value: model.parentSchemaId, options: state.parentSchemaOptions, onchange: _.onChangeParentSchemaId})
            ),
            model instanceof HashBrown.Entity.Resource.Schema.ContentSchema ? [
                _.field({label: 'Allowed at root'},
                    _.checkbox({disabled: model.isLocked, value: model.allowedAtRoot, onchange: _.onChangeAllowedAtRoot})
                ),
                _.field({label: 'Allowed children'},
                    _.popup({disabled: model.isLocked, multiple: true, value: model.allowedChildSchemas, options: state.childSchemaOptions, onchange: _.onChangeAllowedChildSchemas})
                ),
                _.field({label: 'Tabs'},
                    _.list({disabled: true, placeholder: 'tab', value: state.parentTabs}),
                    _.list({disabled: model.isLocked, placeholder: 'tab', value: model.tabs, onchange: _.onChangeTabs})
                ),
                _.field({label: 'Default tab'},
                    _.popup({disabled: model.isLocked, value: model.defaultTabId, options: state.tabOptions, onchange: _.onChangeDefaultTabId})
                ),
                _.field({label: 'Fields'},
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label'}, 'Tab'),
                        _.popup({value: state.tab, options: state.tabOptions, onchange: _.onSwitchTab})
                    ),
                    _.div({class: 'widget widget--separator'}),
                    _.list({disabled: model.isLocked, readonly: true, value: state.properties, sortable: true, placeholder: 'field', onchange: _.onChangeFieldSorting, onclick: _.onClickEditField})
                )
            ] : null,
            model instanceof HashBrown.Entity.Resource.Schema.FieldSchema ? [
                state.fieldConfigEditor
            ] : null
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
