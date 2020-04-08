'use strict';

module.exports = (_, model, state) => 

_.div({class: 'deployer-editor'},
    _.field({label: 'Type'},
        _.popup({value:  model.alias, options: state.deployerOptions, onchange: _.onChangeAlias})
    ),
    model.alias ? [
        _.field({label: 'Public URL', description: 'The base URL from which the files will be publicly accessible'},
            _.text({value: model.publicUrl, onchange: _.onChangePublicUrl})
        ),
        _.field({label: 'Path', description: 'The subdirectory to read/write files from/to'},
            _.text({value: model.path, onchange: _.onChangePath})
        ),
        _.include(state.customTemplate)
    ] : null
)
