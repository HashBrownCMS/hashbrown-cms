'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Library'},
    _.popup({disabled: model.isLocked, value: model.config.resource, options: state.libraryOptions, onchange: _.onChangeResourceLibrary})
),
state.keyOptions && state.keyOptions.length > 0 ? [
    _.field({label: 'Keys'},
        _.popup({disabled: model.isLocked, mutliple: true, value: model.config.resourceKeys, options: state.keyOptions, onchange: _.onChangeResourceKeys})
    )
] : null

]
