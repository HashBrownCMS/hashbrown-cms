'use strict';

module.exports = (_, model, state) =>

_.popup({disabled: model.isDisabled, value: state.value, options: state.schemaOptions, onchange: _.onChange})
