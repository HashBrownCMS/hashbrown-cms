'use strict';

module.exports = (_, model, state) =>

_.datetime({value: state.value, disabled: model.isDisabled, onchange: _.onChange})
