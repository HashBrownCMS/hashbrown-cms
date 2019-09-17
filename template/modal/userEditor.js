'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Settings for ${model.fullName || model.username || model.id}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.if(state.name === 'error', 
                state.message,
            ),

            _.if(state.name === undefined, 
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Username'),
                    _.input({class: 'widget widget--input text', type: 'text', value: model.username, onchange: (e) => _.onChangeUsername(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Full name'),
                    _.input({class: 'widget widget--input text', type: 'text', value: model.fullName, onchange: (e) => _.onChangeFullName(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Email'),
                    _.input({class: 'widget widget--input text', type: 'email', value: model.email, onchange: (e) =>  _.onChangeEmail(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Password'),
                    _.input({class: 'widget widget--input text', type: 'password', min: 3, onchange: (e) => _.onChangePassword(e.target.value)})
                ),
                _.if(HashBrown.Context.user.id !== model.id,
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label small'}, 'Administrator'),
                        _.switch({value: model.isAdmin, onchange: _.onChangeAdmin})
                    )
                ),
                _.if(HashBrown.Context.user.id !== model.id && !model.isAdmin,
                    _.div({class: 'widget widget--separator'}, 'Projects'),
                    _.each(state.projects, (i, project) => 
                        _.div({class: 'widget-group'},
                            _.switch({value: model.hasScope(project.id), onchange: (isEnabled) => _.onChangeProjectScope(project.id, isEnabled)}),
                            _.div({class: 'widget widget--label'}, project.settings.info.name),
                            _.popup({
                                value: model.getScopes(project.id),
                                multiple: true,
                                placeholder: '(no scopes)',
                                options: [
                                    'connections',
                                    'schemas'
                                ],
                                onchange: (scopes) => _.onChangeResourceScope(project.id, scopes)
                            })
                        )
                    )
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.if(state.name === 'error', 
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ),
            
            _.if(state.name === undefined, 
                _.button({class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
            )
        )
    )
)
