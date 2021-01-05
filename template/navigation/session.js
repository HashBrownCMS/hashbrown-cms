'use strict';

module.exports = (_, model, state) =>

_.div({class: 'navigaton navigation--session'},
    Object.keys(state.localeOptions).length > 1 ? [
        _.popup({
            tooltip: _.t('Locale'),
            color: 'secondary',
            role: 'navigation-menu',
            icon: 'flag',
            label: (value) => value,
            value: HashBrown.Client.locale,
            options: state.localeOptions,
            onchange: _.onChangeLocale
        })
    ] : null,
    _.popup({
        tooltip: HashBrown.Client.context.user.fullName || HashBrown.Client.context.user.username,
        color: 'secondary',
        role: 'navigation-menu',
        localized: true, 
        icon: 'user',
        options: {
            'User settings': _.onClickUserSettings,
            'Log out': _.onClickLogOut
        }
    })
)
