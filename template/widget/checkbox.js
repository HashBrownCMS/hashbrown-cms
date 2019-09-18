'use strict';

module.exports = (_, model, state) => 

_.label({class: 'widget widget--checkbox'},
    _.input({class: 'widget--checkbox__input', name: model.name, type: 'checkbox', checked: model.value === true, onchange: (e) => _.onChange(e.target.checked)}),
    _.div({class: 'widget--checkbox__indicator'})
)
