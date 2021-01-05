'use strict';

module.exports = (_, model, state) =>

_.div({class: 'modal in'},
    _.div({class: 'modal__dialog fields'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Settings'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            state.name === 'error' ? [
                state.message

            ] : [
                _.field({localized: true, separator: false, label: 'Username'},
                    _.input({class: 'widget widget--text', type: 'text', value: model.username, onchange: (e) => _.onChangeUsername(e.target.value)})
                ),
                _.field({localized: true, separator: false, label: 'Full name'},
                    _.input({class: 'widget widget--text', type: 'text', value: model.fullName, onchange: (e) => _.onChangeFullName(e.target.value)})
                ),
                _.field({localized: true, separator: false, label: 'Email'},
                    _.input({class: 'widget widget--text', type: 'email', value: model.email, onchange: (e) =>  _.onChangeEmail(e.target.value)})
                ),
                _.field({localized: true, separator: false, label: 'Password'},
                    _.input({class: 'widget widget--text', type: 'password', placeholder: '●●●●●●●●', min: 3, onchange: (e) => _.onChangePassword(e.target.value)})
                ),

                // Only show theme picker to the current user
                HashBrown.Client.context.user.id === model.id ? [
                    _.field({localized: true, separator: false, label: 'Theme'},
                        _.popup({options: HashBrown.Client.themes, value: model.theme || 'default', onchange: _.onChangeTheme})
                    )
                ] : null,
                
                // Only show locale picker to the current user
                HashBrown.Client.context.user.id === model.id ? [
                    _.field({localized: true, separator: false, label: 'Locale'},
                        _.popup({autocomplete: true, options: state.localeOptions, value: model.locale || 'en', onchange: _.onChangeLocale})
                    )
                ] : null,

                // Only show "is admin" switch to other admins
                HashBrown.Client.context.user.isAdmin && model.id !== HashBrown.Client.context.user.id ? [
                    _.field({localized: true, separator: false, label: 'Administrator'},
                        _.checkbox({value: model.isAdmin, onchange: _.onChangeAdmin})
                    )
                ] : null,

                // Only show scope editors to admins for users who are not admins
                HashBrown.Client.context.user.isAdmin && !model.isAdmin ? [
                    _.field({localized: true, separator: false, label: 'Projects', size: 2},
                        _.each(state.projects, (i, project) => 
                            _.div({class: 'widget-group'},
                                _.checkbox({value: model.hasScope(project.id), onchange: (isEnabled) => _.onChangeProjectScope(project.id, isEnabled)}),
                                _.div({class: 'widget widget--label'}, project.getName()),
                                _.popup({
                                    value: model.getScopes(project.id),
                                    multiple: true,
                                    clearable: true,
                                    localized: true,
                                    placeholder: '(no scopes)',
                                    options: {
                                        'Publications': 'publications',
                                        'Schemas': 'schemas'
                                    },
                                    onchange: (scopes) => _.onChangeResourceScope(project.id, scopes)
                                })
                            )
                        )
                    )
                ] : null
            ]
        ),
        _.div({class: 'modal__footer'},
            state.name === 'error' ? [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickReset}, 'OK')
            ] : [
                _.button({localized: true, class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
            ]
        )
    )
)
