'use strict';

module.exports = (_, model, state) => 

_.div({class: `widget widget--number ${model.class || ''} ${model.disabled ? 'disabled' : ''}`},
    _.input({type: model.range ? 'range' : 'number', class: 'widget--number__input', value: model.value, min: model.min, max: model.max, step: model.step, disabled: model.disabled, oninput: (e) => _.onInput(e.target.value), onchange: (e) => _.onChange(e.target.value)}),
    _.if(model.range,
        _.span({class: 'widget--number__indicator'}, !model.value ? '0' : Math.round(model.value * 100) / 100)
    )
)
