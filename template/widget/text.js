'use strict';

module.exports = (_, model, state) => 

model.multiline ?
    _.textarea({class: `widget widget--text ${model.class || ''}`, disabled: model.disabled, placeholder: model.placeholder, oninput: (e) => _.onInput(e.target.value), onchange: (e) => _.onChange(e.target.value), title: model.placeholder}, model.value)
:
    _.input({type: 'text', class: `widget widget--text ${model.class || ''}`, value: model.value, disabled: model.disabled, placeholder: model.placeholder, oninput: (e) => _.onInput(e.target.value), onchange: (e) => _.onChange(e.target.value)})
