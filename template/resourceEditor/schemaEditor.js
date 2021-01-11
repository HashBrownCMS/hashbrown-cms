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
            _.include(require('./inc/overview'))
    
        ] : [
            _.field({localized: true, label: 'Id', description: 'Only edit this field if you know what you\'re doing'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({localized: true, label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({localized: true, label: 'Icon'},
                _.button({disabled: model.isLocked, class: `widget widget--button small fa fa-${model.icon || ''}`, onclick: _.onClickChangeIcon})
            ),
            _.field({localized: true, label: 'Parent'},
                _.popup({disabled: model.isLocked, value: model.parentId, autocomplete: true, options: state.parentSchemaOptions, onchange: _.onChangeParentId})
            ),
            model instanceof HashBrown.Entity.Resource.ContentSchema ? [
                _.field({localized: true, label: 'Allowed at root'},
                    _.checkbox({disabled: model.isLocked, value: model.allowedAtRoot, onchange: _.onChangeAllowedAtRoot})
                ),
                _.field({localized: true, label: 'Allowed children'},
                    _.popup({disabled: model.isLocked, multiple: true, value: model.allowedChildSchemas, options: state.childSchemaOptions, onchange: _.onChangeAllowedChildSchemas})
                ),
                _.field({localized: true, label: 'Tabs'},
                    _.list({disabled: true, placeholder: 'tab', value: state.parentTabs}),
                    _.list({disabled: model.isLocked, placeholder: 'tab', value: model.tabs, onchange: _.onChangeTabs})
                ),
                _.field({localized: true, label: 'Default tab'},
                    _.popup({disabled: model.isLocked, value: model.defaultTabId, options: state.tabOptions, onchange: _.onChangeDefaultTabId})
                ),
                _.field({localized: true, label: 'Fields'},
                    _.div({class: 'widget-group'},
                        _.label({localized: true, class: 'widget widget--label'}, 'Tab'),
                        _.popup({disabled: model.isLocked, value: state.tab, options: state.tabOptions, onchange: _.onSwitchTab})
                    ),
                    _.div({class: 'widget widget--separator'}),
                    _.list({disabled: model.isLocked, readonly: true, value: state.properties, sortable: true, placeholder: 'field', onchange: _.onChangeFieldSorting, onclick: _.onClickEditField, onadd: _.onClickAddField})
                )

            ] : model instanceof HashBrown.Entity.Resource.FieldSchema ? [
                state.fieldConfigEditor

            ] : null
        ]
    ),
    _.include(require('./inc/footer'))
)
