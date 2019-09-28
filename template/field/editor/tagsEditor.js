'use strict';

module.exports = (_, model, state) =>

_.list({disabled: model.isDisabled, value: state.value, sortable: true, placeholder: 'tag', onchange: _.onChange})
