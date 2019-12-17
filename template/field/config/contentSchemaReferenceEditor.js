'use strict';

module.exports = (_, model, state) =>

_.field({label: 'Allowed schemas'},
    _.popup({disabled: model.isLocked, autocomplete: true, name: 'allowedSchemas', value: model.config.allowedSchemas, options: state.schemaOptions, multiple: true, onchange: _.onChangeConfig})
)
