'use strict';

module.exports = (_, model, state) =>

_.popup({disabled: model.isDisabled, value: state.value, options: model.config.options, onchange: _.onChange})
