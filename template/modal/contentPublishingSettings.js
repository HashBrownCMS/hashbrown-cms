'use strict';

module.exports = (_, model, state) => 

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Publishing settings for ${state.modelTitle}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined,
                _.div({class: 'widget-group'},      
                    _.label({class: 'widget widget--label'}, 'Apply to children'),
                    _.checkbox({
                        value: state.value.applyToChildren === true,
                        onchange: _.onToggleApplyToChildren
                    })
                ),
                _.div({class: 'widget-group'},      
                    _.label({class: 'widget widget--label'}, 'Connection'),
                    _.popup({
                        options: state.connections,
                        value: state.value.connectionId,
                        clearable: true,
                        onchange: _.onChangeConnection
                    })
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickClose}, 'OK')
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickOK}, 'OK')
            )
        )
    )
)
