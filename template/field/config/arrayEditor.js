'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Min. items'},
    _.number({disabled: model.isLocked, name: 'minItems', value: model.config.minItems || 0, onchange: _.onChangeConfig})
),
_.field({label: 'Max. items'},
    _.number({disabled: model.isLocked, name: 'maxItems', value: model.config.maxItems || 0, onchange: _.onChangeConfig})
),
_.field({label: 'Allowed schemas'},
    _.popup({disabled: model.isLocked, autocomplete: true, name: 'allowedSchemas', value: model.config.allowedSchemas, options: state.schemaOptions, multiple: true, onchange: _.onChangeConfig})
)

]
