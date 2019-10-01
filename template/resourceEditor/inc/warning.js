'use strict';

module.exports = (_, model, state) =>

_.partial('warning', (_, model, state) =>
    _.details({class: 'resource-editor__footer__warning'},
        _.if(state.warning, 
            _.p({class: 'resource-editor__footer__warning__message'}, state.warning),
            _.summary({class: 'resource-editor__footer__warning__icon fa fa-exclamation-circle'})
        )
    )
)
