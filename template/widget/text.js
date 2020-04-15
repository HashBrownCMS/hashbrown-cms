'use strict';

module.exports = (_, model, state) => 

model.multiline || model.code ?
    _.textarea({class: `widget widget--text ${model.code ? 'code' : ''} ${model.class || ''} ${model.disabled ? 'disabled' : ''}`, disabled: model.disabled, placeholder: model.placeholder, oninput: (e) => _.onInput(e.target.value), onchange: (e) => _.onChange(e.target.value), title: model.placeholder, onkeydown: model.code ? (e) => _.onKeyDown(e) : null}, model.value)
:
    _.input({type: model.type || 'text', class: `widget widget--text ${model.class || ''} ${model.disabled ? 'disabled' : ''}`, value: model.value, disabled: model.disabled, placeholder: model.placeholder, oninput: (e) => _.onInput(e.target.value), onchange: (e) => _.onChange(e.target.value)})
