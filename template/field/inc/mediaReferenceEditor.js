'use strict';

module.exports = (_, model, state) =>

_.media({disabled: model.isDisabled, value: state.value, onchange: _.onChange})
