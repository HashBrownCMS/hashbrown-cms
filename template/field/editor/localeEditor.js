'use strict';

module.exports = (_, model, state) =>

_.popup({disabled: model.isDisabled, multiple: model.config.isMultiple, options: state.localeOptions, value: state.value, onchange: _.onChange})
