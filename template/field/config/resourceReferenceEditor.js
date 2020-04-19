'use strict';

module.exports = (_, model, state) => [

_.field({label: 'Module'},
    _.popup({disabled: model.isLocked, value: model.config.resource, options: state.moduleOptions, onchange: _.onChangeResourceModule})
),
_.if(state.keyOptions && state.keyOptions.length > 0,
    _.field({label: 'Keys'},
        _.popup({disabled: model.isLocked, mutliple: true, value: model.config.resourceKeys, options: state.keyOptions, onchange: _.onChangeResourceKeys})
    )
)

]
