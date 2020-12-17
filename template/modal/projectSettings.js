'use strict';

module.exports = (_, model, state) => 
 
_.div({class: 'modal'},
    _.div({class: 'modal__dialog'},
        _.div({class: 'modal__header'},
            _.h4({class: 'modal__title'}, `Settings for ${model.getName()}`),
            _.button({class: 'modal__close fa fa-close', onclick: _.onClickClose})
        ),
        _.div({class: 'modal__body'},
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label small'}, 'Name'),
                _.input({class: 'widget widget--text', type: 'text', value: model.getName(), onchange: (e) => _.onChangeName(e.target.value)})
            ),
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label small'}, 'Locales'),
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
            _.div({class: 'widget widget--separator'}, 'Sync'),
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label small'}, 'Enabled'),
                _.checkbox({
                    value: model.settings.sync.enabled === true,
                    onchange: _.onToggleSync
                })
            ),
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label small'}, 'API URL'),
                _.input({
                    name: 'url',
                    class: 'widget widget--text',
                    type: 'text',
                    value: model.settings.sync.url || '',
                    placeholder: 'e.g. "https://myserver.com/api/"',
                    onchange: (e) => _.onChangeSyncUrl(e.target.value)
                })
            ),
            _.div({class: 'widget-group'},
                _.label({class: 'widget widget--label small'}, 'Project id'),
                _.input({
                    class: 'widget widget--text',
                    name: 'name',
                    type: 'text',
                    value: model.settings.sync.project || '',
                    onchange: (e) => _.onChangeSyncProject(e.target.value)
                })
            ),
            _.div({class: 'widget-group modal--project-settings__sync-token__input'},
                _.label({class: 'widget widget--label small'}, 'Token'),
                _.input({
                    value: model.settings.sync.token,
                    type: 'text',
                    class: 'widget widget--text',
                    name: 'token',
                    placeholder: 'API token',
                    onchange: (e) => _.onChangeSyncToken(e.target.value)
                }),
                _.button({title: 'Get new token', class: 'widget widget--button default small fa fa-refresh', onclick: _.onClickGetSyncToken})
            ),
            _.div({class: 'widget-group modal--project-settings__sync-token__login', style: 'display: none'},
                _.input({class: 'widget widget--text', name: 'username', type: 'text', placeholder: 'Username'}),
                _.input({class: 'widget widget--text', name: 'password', type: 'password', placeholder: 'Password'}),
                _.button({class: 'widget widget--button default small fa fa-check', onclick: _.onClickRemoteLogin}) 
            )
        ),
        _.div({class: 'modal__footer'},
            _.button({class: 'widget widget--button', onclick: _.onClickSave}, 'Save')
        )
    )
)
