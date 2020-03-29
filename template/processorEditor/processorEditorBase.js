'use stict';

module.exports = (_, model, state) =>

_.div({class: 'processor-editor'},
    _.field({label: 'Type'},
        _.popup({value: model.alias, options: state.processorOptions, onchange: _.onChangeAlias})
    ),
    _.include(state.customTemplate)
)
