'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Create new user'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({localized: true, class: 'modal__body'},
            state.name === 'error' ? [
                state.message,
            
            ] : state.name === 'success' ? [
                'Successfully created user'
            
            ] : [ 
                _.div({class: 'widget-group'},
                    _.label({localized: true, class: 'widget widget--label small'}, 'Username'),
                    _.input({class: 'widget widget--text', min: 2, type: 'text', onchange: (e) => _.onInputUsername(e.target.value), value: model.username})
                ),
                _.div({class: 'widget-group'},
                    _.label({localized: true, class: 'widget widget--label small'}, 'Full name'),
                    _.input({class: 'widget widget--text', type: 'text', onchange: (e) => _.onInputFullName(e.target.value), value: model.fullName})
                ),
                _.div({class: 'widget-group'},
                    _.label({localized: true, class: 'widget widget--label small'}, 'Email'),
                    _.input({class: 'widget widget--text', type: 'email', onchange: (e) => _.onInputEmail(e.target.value), value: model.email})
                ),
                _.div({class: 'widget-group'},
                    _.label({localized: true, class: 'widget widget--label small'}, 'Password'),
                    _.input({class: 'widget widget--text', min: 6, type: 'text', onchange: (e) => _.onInputPassword(e.target.value), value: model.password})
                )
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [ 
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            
            ] : state.name === 'success' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickClose}, 'Done'),
                model.email ? _.button({localized: true, class: 'widget widget--button', onclick: _.onClickEmail}, 'Send email') : null
            
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickCreate}, 'Create')
            
            ]
        )
    )
)
