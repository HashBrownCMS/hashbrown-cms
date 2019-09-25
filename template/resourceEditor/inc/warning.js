'use strict';

module.exports = (_, model, state) =>

_.if(state.warning, 
    _.div({class: 'resource-editor__warning'},
        _.span({class: 'resource-editor__warning__icon fa fa-exclamation-circle'}),
        state.warning
    )
)
