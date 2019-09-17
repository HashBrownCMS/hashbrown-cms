'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Create new user'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === 'success',
                `Successfully created user ${model.username}`
            ),
            
            _.if(state.name === undefined,
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, 'Username'),
                    _.input({min: 2, type: 'text', onchange: _.onInputUsername, value: model.username})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, 'Full name'),
                    _.input({type: 'text', onchange: _.onInputFullName, value: model.fullName})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, 'Email'),
                    _.input({type: 'email', onchange: _.onInputEmail, value: model.email})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label'}, 'Password'),
                    _.input({min: 6, type: 'text', onchange: _.onInputPassword, value: model.password})
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ),
            
            _.if(state.name === 'success', 
                _.button({class: 'widget widget--button', onclick: _.onClickClose}, 'Done'),
                _.if(model.email,
                    _.button({class: 'widget widget--button', onclick: _.onClickEmail}, 'Send email')
                )
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickCreate}, 'Create')
            )
        )
    )
)
