'use strict';

module.exports = (_, model, state) =>
   
_.form({class: `widget widget--search ${model.class || ''}`, onsubmit: _.onSubmit},
    _.span({class: 'widget--search__icon fa fa-search'}),
    _.input({class: 'widget--search__input', name: 'input', value: model.value}),
    _.button({class: 'widget--search__clear fa fa-remove', title: 'Clear search', type: 'button', onclick: _.onClickClear}),
    _.button({class: 'widget--search__submit fa fa-search', title: 'Search', type: 'submit'})
)
