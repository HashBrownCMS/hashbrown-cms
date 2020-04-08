'use stict';

module.exports = (_, model, state) =>

_.div({class: 'processor-editor'},
    _.field({label: 'Type'},
        _.popup({clearable: true, value: model ? model.alias : null, options: state.processorOptions, onchange: _.onChangeAlias})
    ),
    model && model.alias ? [
        _.include(state.customTemplate)
    ] : null
)
