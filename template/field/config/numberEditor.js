'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Step'},
    _.number({disabled: model.isLocked, step: 'any', name: 'step', value: model.config.step || 0, onchange: _.onChangeConfig})
),
_.field({label: 'Min. value'},
    _.number({disabled: model.isLocked, name: 'minValue', value: model.config.minValue || 0, onchange: _.onChangeConfig})
),
_.field({label: 'Max. value'},
    _.number({disabled: model.isLocked, name: 'maxValue', value: model.config.maxValue || 0, onchange: _.onChangeConfig})
),
_.field({label: 'Display as slider'},
    _.checkbox({disabled: model.isLocked, name: 'isSlider', value: model.config.isSlider, onchange: _.onChangeConfig})
)

]
