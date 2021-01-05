'use strict';

module.exports = (_, model, state) => 
 
_.div({class: 'modal'},
    _.div({class: 'modal__dialog fields'},
        _.div({class: 'modal__header'},
            _.h4({localized: true, class: 'modal__title'}, 'Settings'),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.field({localized: true, separator: false, label: 'Name'},
                _.input({class: 'widget widget--text', type: 'text', value: model.getName(), onchange: (e) => _.onChangeName(e.target.value)})
            ),
            _.field({localized: true, separator: false, label: 'Locales'},
                _.popup({
                    value: model.settings.locales,
                    autocomplete: true,
                    clearable: true,
                    multiple: true,
                    min: 1,
                    options: HashBrown.Service.LocaleService.getLocaleOptions(true),
                    onchange: _.onChangeLocales
                })
            ),
            _.field({localized: true, separator: false, size: 2, label: 'Sync'},
                _.field({localized: true, separator: false, label: 'Enabled'},
                    _.checkbox({
                        value: model.settings.sync.enabled === true,
                        onchange: _.onToggleSync
                    })
                ),
                _.field({localized: true, separator: false, label: 'API URL'},
                    _.input({
                        name: 'url',
                        class: 'widget widget--text',
                        type: 'text',
                        value: model.settings.sync.url || '',
                        placeholder: 'https://myserver.com',
                        onchange: (e) => _.onChangeSyncUrl(e.target.value)
                    })
                ),
                _.field({localized: true, separator: false, label: 'Project id'},
                    _.input({
                        class: 'widget widget--text',
                        name: 'name',
                        type: 'text',
                        value: model.settings.sync.project || '',
                        onchange: (e) => _.onChangeSyncProject(e.target.value)
                    })
                ),
                _.field({localized: true, divider: false, label: 'Token'},
                    _.div({class: 'widget-group modal--project-settings__sync-token__input'},
                        _.input({
                            value: model.settings.sync.token,
                            type: 'text',
                            class: 'widget widget--text',
                            name: 'token',
                            placeholder: 'API token',
                            onchange: (e) => _.onChangeSyncToken(e.target.value)
                        }),
                        _.button({localized: true, title: 'Get new token', class: 'widget widget--button default small fa fa-refresh', onclick: _.onClickGetSyncToken})
                    ),
                    _.div({class: 'widget-group modal--project-settings__sync-token__login', style: 'display: none'},
                        _.input({localized: true, class: 'widget widget--text', name: 'username', type: 'text', placeholder: 'Username'}),
                        _.input({localized: true, class: 'widget widget--text', name: 'password', type: 'password', placeholder: 'Password'}),
                        _.button({class: 'widget widget--button default small fa fa-check', onclick: _.onClickRemoteLogin}) 
                    )
                )
            )
        ),
        _.div({class: 'modal__footer'},
            _.button({localized: true, class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
        )
    )
)
