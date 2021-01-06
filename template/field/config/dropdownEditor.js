'use strict';

module.exports = (_, model, state) =>

_.field({label: 'Options'},
    _.list({disabled: model.isLocked, keys: true, name: 'options', value: model.config.options, placeholder: 'option', sortable: true, onchange: _.onChangeConfig})
)
