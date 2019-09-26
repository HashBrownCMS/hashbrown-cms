'use strict';

module.exports = (_, model, state) =>

_.text({disabled: model.isDisabled, value: state.value, onchange: _.onChange})
