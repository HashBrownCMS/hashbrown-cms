'use strict';

module.exports = (_, model, state) =>

_.ul({class: 'widget widget--list'},
    _.each(model.value, (key, value) =>
        _.li({class: 'widget--list__item widget-group'},
            _.if(model.keys,
                _.input({type: 'text', class: 'widget widget--input text', value: key, onchange: (e) => _.onChangeItemKey(key, e.target.value)}),
            ),
            _.input({type: 'text', class: 'widget widget--input text', value: value, onchange: (e) => _.onChangeItemValue(key, e.target.value)}),
            _.button({class: 'widget widget--button small fa fa-remove', title: `Remove ${model.label || 'item'} "${value}"`, onclick: () =>  _.onClickRemoveItem(key)})
        )
    ),
    _.button({class: 'widget--list__add widget widget--button dashed embedded expanded low', title: `Add ${model.label || 'item'}`, onclick: _.onClickAddItem},
        _.span({class: 'fa fa-plus'}),
        `Add ${model.label || 'item'}`
    )
)
