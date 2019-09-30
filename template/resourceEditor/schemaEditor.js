'use strict';

module.exports = (_, model, state) =>

_.div({class: `resource-editor resource-editor--content-editor ${model.isLocked ? 'locked' : ''}`},
    _.if(state.name === 'error',
        state.message
    ),

    _.if(state.name === 'welcome',
        _.div({class: 'resource-editor__welcome'},
            _.h1('Schemas'),
            _.p('Click any item in the panel to edit it.'),
            _.p('Use the context menu (right click or the <span class="fa fa-ellipsis-v"></span> button) to perform other actions.'),
            _.button({class: 'widget widget--button', onclick: _.onClickImportSchemas, title: 'Import schemas'}, 'Import')
        )
    ),

    _.if(state.name === undefined,
        _.include(require('./inc/header')),
        _.div({class: 'resource-editor__body', name: 'body'},
            _.field({label: 'Id'},
                _.text({disabled: model.isLocked, value: model.id, onchange: _.onChangeId})
            ),
            _.field({label: 'Name'},
                _.text({disabled: model.isLocked, value: model.name, onchange: _.onChangeName})
            ),
            _.field({label: 'Icon'},
                _.button({disabled: model.isLocked, class: `widget widget--button small fa fa-${model.icon || ''}`, onclick: _.onClickChangeIcon})
            ),
            model instanceof HashBrown.Entity.Resource.Schema.ContentSchema ?
                _.field({label: 'Fields'},
                    _.list({disabled: model.isLocked, readonly: true, value: state.properties, sortable: true, placeholder: 'field', onchange: _.onChangeFieldSorting, onclick: _.onClickEditField})
                )
            : null,
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
    )
)
