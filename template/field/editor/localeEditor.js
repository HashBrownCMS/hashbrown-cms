'use strict';

module.exports = (_, model, state) =>

_.popup({disabled: model.isDisabled, options: state.localeOptions, value: state.value, onchange: _.onChange})
