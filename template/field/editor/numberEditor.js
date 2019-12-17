'use strict';

module.exports = (_, model, state) =>

_.number({disabled: model.isDisabled, min: model.config.min, max: model.config.max, step: model.config.step, range: model.config.isSlider, value: state.value, onchange: _.onChange})
