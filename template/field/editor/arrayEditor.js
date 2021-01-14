'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field--array-editor__items'},
    state.name === 'sorting' ? [
        _.list({readonly: true, sortonly: true, sortable: true, value: state.fields, onchange: _.onChangeItemSorting}) 
    
    ] : [
        _.each(state.fields, (i, field) =>
            _.div({class: 'field--array-editor__item'},
                field.view,
                _.div({class: 'field--array-editor__item__tools'},
                    !model.isDisabled && Object.keys(state.schemaOptions).length > 1 ? [
                        _.popup({class: 'field--array-editor__item__tool', autocomplete: true, tooltip: _.t('Change schema'), icon: 'cogs', options: state.schemaOptions, value: field.view && field.view.model.schema ? field.view.model.schema.id : null, onchange: (schemaId) => _.onChangeItemSchema(i, schemaId)})

                    ] : null,

                    !model.isDisabled && state.canRemoveItems ? [
                        _.button({localized: true, class: 'field--array-editor__item__tool widget widget--button small default fa fa-remove', title: 'Remove item', onclick: () => _.onClickRemoveItem(i)})
                    
                    ] : null
                )
            )
        ),

        !model.isDisabled && state.canAddItems && Object.keys(state.schemaOptions).length > 0 ? [
            Object.keys(state.schemaOptions).length > 1 ? [
                _.popup({class: 'field--array-editor__add', horizontal: 'left', autocomplete: true, options: state.schemaOptions, icon: 'plus', label: _.t('Add item'), onchange: _.onClickAddItem})
            
            ] : [
                _.button({localized: true, class: 'widget widget--button default field--array-editor__add', onclick: _.onClickAddImpliedItem},
                    _.span({class: 'fa fa-plus'}),
                    'Add item'
                )

            ]
        
        ] : null
    
    ]
)
