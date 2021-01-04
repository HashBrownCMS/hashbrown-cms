'use strict';

module.exports = (_, model, state) => 

_.div({class: 'deployer-editor'},
    _.field({label: 'Type'},
        _.popup({clearable: true, value: model ? model.alias : null, options: state.deployerOptions, onchange: _.onChangeAlias})
    ),
    model && model.alias ? [
        _.include(state.customTemplate)
    ] : null
)
