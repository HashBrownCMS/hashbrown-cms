'use strict';

module.exports = (_, model) =>

_.div({class: 'list-item--project'},
    _.div({class: 'list-item--project__body'},
        _.if(HashBrown.Context.user.isAdmin,
            _.popup({
                icon: 'ellipsis-v',
                role: 'item-menu',
                tooltip: `Options for ${model.settings.info.name || model.id}`,
                options: {
                    'Settings': _.onClickSettings,
                    'Backups': _.onClickBackups,
                    'Migrate resources': _.onClickMigrate,
                    'Delete': _.onClickRemove
                }
            })
        ),
        _.div({class: 'list-item--project__info'},
            _.h3({class: 'list-item--project__info__name'}, model.settings.info.name || model.id),
            _.p(model.users.length + ' user' + (model.users.length != 1 ? 's' : '')),
            _.p(model.settings.languages.length + ' language' + (model.settings.languages.length != 1 ? 's' : '') + ' (' + model.settings.languages.join(', ') + ')')
        ),
        _.div({class: 'list-item--project__environments'},
            _.each(model.environments, (i, environment) =>
                _.div({class: 'list-item--project__environment'},
                    _.a({title: `Enter "${environment}" environment`, href: '/' + model.id + '/' + environment, class: 'widget widget--button expanded'}, 
                        environment
                    ),
                    _.if(HashBrown.Context.user.isAdmin && model.environments.length > 1,
                        _.popup({
                            icon: 'ellipsis-v',
                            role: 'item-menu',
                            tooltip: `Options for "${environment}" environment`,
                            color: 'primary',
                            options: {
                                'Delete': () => _.onClickRemoveEnvironment(environment)
                            }
                        })
                    )
                )
            ),
            _.if(HashBrown.Context.user.isAdmin,
                _.button({onclick: _.onClickAddEnvironment, title: 'Add environment', class: 'widget widget--button dashed embedded expanded'},
                    _.span({class: 'fa fa-plus'}),
                    'Add environment'
                )
            )
        )
    )
)
