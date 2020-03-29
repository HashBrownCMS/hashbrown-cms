'use strict';

module.exports = (_, model, state) => 

_.div({class: 'deployer-editor'},
    _.field({label: 'Type'},
        _.popup({value:  model.alias, options: state.deployerOptions, onchange: _.onChangeAlias})
    ),
    _.field({label: 'File extension'},
        _.text({value: model.fileExtension, onchange: _.onChangeFileExtension})
    ),
    _.field({label: 'Content path'},
        _.text({value: model.paths ? model.paths.content : null, onchange: _.onChangeContentPath})
    ),
    _.field({label: 'Media path'},
        _.text({value: model.paths ? model.paths.media : null, onchange: _.onChangeMediaPath})
    ),
    _.include(state.customTemplate)
)
