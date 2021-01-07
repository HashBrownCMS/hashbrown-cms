'use strict';

module.exports = (_, model, state) =>

_.div({class: 'list-item--project'},
    _.div({class: 'list-item--project__body'},
        HashBrown.Client.context.user.isAdmin ? [
            _.popup({
                icon: 'ellipsis-v',
                role: 'item-menu',
                tooltip: 'Options',
                localized: true,
                options: {
                    'Settings': _.onClickSettings,
                    'Backups': _.onClickBackups,
                    'Delete': _.onClickRemove
                }
            })
        ] : null,
        _.div({class: 'list-item--project__info'},
            _.h3({class: 'list-item--project__info__name'}, model.getName()),
            _.p(
                _.span({localized: true, class: 'list-item--project__info__icon fa fa-user', title: 'Users'}),
                model.users.length,
                _.span({localized: true, class: 'list-item--project__info__icon fa fa-flag', title: 'Locales'}),
                model.settings.locales.length,
                model.settings && model.settings.sync && model.settings.sync.enabled ? _.span({localized: true, class: 'list-item--project__info__icon fa fa-external-link', title: 'Synced'}) : null
            )
        ),
        _.div({class: 'list-item--project__environments'},
            _.each(model.environments, (i, environment) =>
                _.div({class: 'list-item--project__environment'},
                    _.a({href: `${HashBrown.Client.context.config.system.rootUrl}/${model.id}/${environment}/#/content/`, class: 'widget widget--button expanded'}, environment),
                    HashBrown.Client.context.user.isAdmin && model.environments.length > 1 ? [
                        _.popup({
                            icon: 'ellipsis-v',
                            role: 'item-menu',
                            tooltip: 'Settings',
                            localized: true,
                            color: 'primary',
                            options: {
                                'Migrate': () => _.onClickMigrateEnvironment(environment),
                                'Delete': () => _.onClickRemoveEnvironment(environment)
                            }
                        })
                    ] : null
                )
            ),
            HashBrown.Client.context.user.isAdmin && HashBrown.Client.context.config.system.canAddEnvironments !== false ? [
                _.button({localized: true, onclick: _.onClickAddEnvironment, disabled: model.settings.sync.enabled === true, title: 'Add environment', class: 'widget widget--button dashed embedded expanded'},
                    _.span({class: 'fa fa-plus'}),
                    'Add environment'
                )
            ] : null
        )
    )
)
