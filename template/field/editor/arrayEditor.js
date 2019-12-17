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
                    Object.keys(state.schemaOptions).length > 1 ? [
                        _.popup({class: 'field--array-editor__item__tool', autocomplete: true, tooltip: 'Change schema', icon: 'cogs', options: state.schemaOptions, value: field.view.model.schema ? field.view.model.schema.id : null, onchange: (schemaId) => _.onChangeItemSchema(i, schemaId)})
                    
                    ] : null,

                    state.canRemoveItems ? [
                        _.button({class: 'field--array-editor__item__tool widget widget--button small default fa fa-remove', title: 'Remove item', onclick: () => _.onClickRemoveItem(i)})
                    
                    ] : null
                )
            )
        ),

        state.canAddItems && Object.keys(state.schemaOptions).length > 0 ? [
            _.popup({class: 'field--array-editor__add', autocomplete: true, options: state.schemaOptions, icon: 'plus', label: 'Add item', onchange: _.onClickAddItem})
        
        ] : null
    
    ]
)
