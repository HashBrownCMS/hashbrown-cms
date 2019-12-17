'use strict';

module.exports = (_, model, state) =>

_.field({label: 'Options'},
    _.list({keys: true, name: 'options', value: model.config.options, placeholder: 'option', sortable: true, onchange: _.onChangeConfig})
)
