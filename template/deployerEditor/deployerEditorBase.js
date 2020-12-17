'use strict';

module.exports = (_, model, state) => 

_.div({class: 'deployer-editor'},
    _.field({label: 'Type'},
        _.popup({clearable: true, value: model ? model.alias : null, options: state.deployerOptions, onchange: _.onChangeAlias})
    ),
    model && model.alias ? [
        _.field({label: 'Path', description: 'The path to read/write files from/to'},
            _.text({value: model.path, onchange: _.onChangePath})
        ),
        _.include(state.customTemplate)
    ] : null
)
