'use strict';

module.exports = (_, model, state) =>

_.ul({class: 'widget widget--list'},
    _.each(model.value, (key, value) =>
        _.li({class: 'widget--list__item widget-group'},
            _.if(model.keys,
                _.text({disabled: model.disabled, value: key, onchange: (newKey) => _.onChangeItemKey(key, newKey)}),
            ),
            _.text({disabled: model.disabled, value: value, onchange: (newValue) => _.onChangeItemValue(key, newValue)}),
            _.if(!model.disabled,
                _.button({class: 'widget widget--button small fa fa-remove', title: `Remove ${model.label || 'item'} "${value}"`, onclick: () =>  _.onClickRemoveItem(key)})
            )
        )
    ),
    _.if(!model.disabled,
        _.button({class: 'widget--list__add widget widget--button dashed embedded expanded low', title: `Add ${model.label || 'item'}`, onclick: _.onClickAddItem},
            _.span({class: 'fa fa-plus'}),
            `Add ${model.placeholder || 'item'}`
        )
    )
)
