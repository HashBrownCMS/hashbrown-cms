'use strict';

module.exports = (_, model, state) =>

_.media({class: 'small', thumbnail: true, disabled: model.isDisabled, value: state.value, onchange: _.onChange})
