'use strict';

module.exports = (_, model, state) =>

_.div({class: 'field--array-editor__items'},
    _.if(state.name === 'sorting',
        _.list({readonly: true, sortable: true, value: state.fields, onchange: _.onChangeItemSorting}) 
    ),

    _.if(state.name === undefined,
        _.each(state.fields, (i, field) =>
            _.div({class: `field--array-editor__item ${state.canRemoveItems ? 'extra-padding' : ''}`},
                _.if(Object.keys(state.schemaOptions).length > 1,
                    _.div({class: 'widget-group field--array-editor__item__schema'},
                        _.label({class: 'widget widget--label'}, 'Schema'),
                        _.popup({options: state.schemaOptions, value: field.view.model.schema ? field.view.model.schema.id : null, onchange: (schemaId) => _.onChangeItemSchema(i, schemaId)})
                    )
                ),
                field.view,
                _.if(state.canRemoveItems,
                    _.button({class: 'field--array-editor__item__remove widget widget--button small default fa fa-remove', title: 'Remove item', onclick: () => _.onClickRemoveItem(i)})
                )
            )
        ),
        _.if(state.canAddItems && Object.keys(state.schemaOptions).length > 0,
            _.popup({class: 'field--array-editor__add', options: state.schemaOptions, icon: 'plus', label: 'Add item', onchange: _.onClickAddItem})
        )
    )
)
