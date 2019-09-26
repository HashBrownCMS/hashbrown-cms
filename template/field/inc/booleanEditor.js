'use strict';

module.exports = (_, model, state) =>

_.checkbox({disabled: model.isDisabled, value: state.value, onchange: _.onChange})
