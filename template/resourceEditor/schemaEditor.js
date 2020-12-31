'use strict';

module.exports = (_, model, state) =>

_.div({class: 'resource-editor resource-editor--schema-editor'},
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
                _.h2({class: 'hidden-phone'}, 'Actions'),
                _.div({class: 'resource-editor__welcome__actions hidden-phone'},
                    _.button({class: 'widget widget--button condensed', onclick: _.onClickStartTour, title: 'Start a tour of the UI'}, 'Quick tour')
                )
            )
    
        ] : [
            _.field({label: 'Id', description: 'Only edit this field if you know what you\'re doing'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({label: 'Icon'},
                _.button({disabled: model.isLocked, class: `widget widget--button small fa fa-${model.icon || ''}`, onclick: _.onClickChangeIcon})
            ),
            _.field({label: 'Parent'},
                _.popup({disabled: model.isLocked, value: model.parentId, autocomplete: true, options: state.parentSchemaOptions, onchange: _.onChangeParentId})
            ),
            model instanceof HashBrown.Entity.Resource.ContentSchema ? [
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

            ] : model instanceof HashBrown.Entity.Resource.FieldSchema ? [
                state.fieldConfigEditor

            ] : null
        ]
    ),
    _.include(require('./inc/footer'))
)
