'use strict';

module.exports = (_, model, state) => 

_.label({class: 'widget widget--switch'},
    _.input({class: 'widget--switch__input', name: state.name, type: 'checkbox', checked: model === true, onchange: (e) => _.onChange(e.target.checked)}),
    _.div({class: 'widget--switch__indicator'})
)
