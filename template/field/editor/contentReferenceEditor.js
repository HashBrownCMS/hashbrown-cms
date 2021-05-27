'use strict';

module.exports = (_, model, state) =>

_.popup({disabled: model.isDisabled, clearable: true, value: state.value, options: state.contentOptions, onchange: _.onChange})
