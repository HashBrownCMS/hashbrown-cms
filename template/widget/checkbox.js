'use strict';

module.exports = (_, model, state) => 

_.label({localized: model.localized, class: `widget widget--checkbox ${model.placeholder ? 'placeholder' : ''} ${model.class || ''} ${model.disabled ? 'disabled' : ''}`, title: model.tooltip},
    model.placeholder ? [
        _.span({localized: model.localized, class: 'widget--checkbox__placeholder'}, model.placeholder),
    ] : null,
    _.input({disabled: model.disabled, class: 'widget--checkbox__input', name: model.name, type: 'checkbox', checked: model.value === true, onchange: (e) => _.onChange(e.target.checked)}),
    _.div({class: 'widget--checkbox__indicator'})
)
