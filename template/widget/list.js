'use strict';

module.exports = (_, model, state) =>

_.ul({class: `widget widget--list ${model.disabled ? 'disabled' : ''}`},
    _.each(model.value, (key, value) =>
        _.li({class: 'widget--list__item widget-group', draggable: model.sortable, ondragstart: model.sortable ? _.onDragStart : null, ondragend: model.sortable ? _.onDragEnd : null, ondragover: model.sortable ? _.onDragOver : null},
            model.sortable && !model.disabled ? [
                _.span({class: 'widget--list__handle fa fa-bars'})
            ] : null,

            model.readonly ? [
                model.onclick && !model.disabled ? [
                    _.button({class: 'widget--list__item__edit', onclick: () => model.onclick(key, value)},
                        value ? value.label || value : ''
                    )
                
                ] : [
                    _.label({class: 'widget--list__item__label'},
                        value && value.icon ? _.span({class: `widget--list__item__label__icon fa fa-${value.icon}`}) : null,
                        value ? value.label || value : ''
                    )
                
                ]
            
            ] : [
                model.keys ? [
                    _.text({disabled: model.disabled, tooltip: 'Name', value: key, onchange: (newKey) => _.onChangeItemKey(key, newKey)})
                
                ] : null,
                
                _.text({disabled: model.disabled, tooltip: 'Value', value: value ? value.label || value : '', onchange: (newValue) => _.onChangeItemValue(key, newValue)}),
            ],

            !model.disabled && !model.sortonly ? [
                _.button({localized: true, class: 'widget widget--button default small fa fa-remove', title: `Remove ${model.placeholder || 'item'}`, onclick: () =>  _.onClickRemoveItem(key)})
            
            ] : null
        )
    ),

    !model.disabled && !model.sortonly ? [
        _.button({localized: true, class: 'widget--list__add widget widget--button default expanded low', title: `Add ${model.placeholder || 'item'}`, onclick: _.onClickAddItem},
            _.span({class: 'fa fa-plus'}),
            `Add ${model.placeholder || 'item'}`
        )
    
    ] : null
)
