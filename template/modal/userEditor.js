'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, 'Settings'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message

            ] : [
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Username'),
                    _.input({class: 'widget widget--text', type: 'text', value: model.username, onchange: (e) => _.onChangeUsername(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Full name'),
                    _.input({class: 'widget widget--text', type: 'text', value: model.fullName, onchange: (e) => _.onChangeFullName(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Email'),
                    _.input({class: 'widget widget--text', type: 'email', value: model.email, onchange: (e) =>  _.onChangeEmail(e.target.value)})
                ),
                _.div({class: 'widget-group'},
                    _.label({class: 'widget widget--label small'}, 'Password'),
                    _.input({class: 'widget widget--text', type: 'password', placeholder: '●●●●●●●●', min: 3, onchange: (e) => _.onChangePassword(e.target.value)})
                ),

                // Only show theme picker to the current user
                HashBrown.Client.context.user.id === model.id ? [
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label small'}, 'Theme'),
                        _.popup({options: HashBrown.Client.themes, value: model.theme || 'default', onchange: _.onChangeTheme})
                    )
                ] : null,
                
                // Only show locale picker to the current user
                HashBrown.Client.context.user.id === model.id ? [
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label small'}, 'Locale'),
                        _.popup({autocomplete: true, options: HashBrown.Service.LocaleService.getUILocaleOptions(true), value: model.locale || 'en', onchange: _.onChangeLocale})
                    )
                ] : null,

                // Only show "is admin" switch to other admins
                HashBrown.Client.context.user.isAdmin && model.id !== HashBrown.Client.context.user.id ? [
                    _.div({class: 'widget-group'},
                        _.label({class: 'widget widget--label small'}, 'Administrator'),
                        _.checkbox({value: model.isAdmin, onchange: _.onChangeAdmin})
                    )
                ] : null,

                // Only show scope editors to admins for users who are not admins
                HashBrown.Client.context.user.isAdmin && !model.isAdmin ? [
                    _.div({class: 'widget widget--separator'}, 'Projects'),
                    _.each(state.projects, (i, project) => 
                        _.div({class: 'widget-group'},
                            _.checkbox({value: model.hasScope(project.id), onchange: (isEnabled) => _.onChangeProjectScope(project.id, isEnabled)}),
                            _.div({class: 'widget widget--label', localized: false}, project.getName()),
                            _.popup({
                                value: model.getScopes(project.id),
                                multiple: true,
                                clearable: true,
                                placeholder: '(no scopes)',
                                options: {
                                    'Publications': 'publications',
                                    'Schemas': 'schemas'
                                },
                                onchange: (scopes) => _.onChangeResourceScope(project.id, scopes)
                            })
                        )
                    )
                ] : null
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ] : [
                _.button({class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
            ]
        )
    )
)
