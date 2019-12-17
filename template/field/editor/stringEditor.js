'use strict';

module.exports = (_, model, state) =>

_.text({disabled: model.isDisabled, multiline: model.isMultiLine, value: state.value, onchange: _.onChange})
