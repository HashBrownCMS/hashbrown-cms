'use strict';

module.exports = (_, model, state) =>

_.div({class: 'navigaton navigation--session'},
    _.if(state.languageOptions.length > 1,
        _.popup({
            tooltip: 'Language',
            color: 'secondary',
            role: 'navigation-menu',
            icon: 'flag',
            label: (value) => value ? value.toUpperCase() : '',
            value: HashBrown.Context.language,
            options: state.languageOptions,
            onchange: _.onChangeLanguage
        })
    ),
    _.popup({
        tooltip: 'Logged in as "' + (HashBrown.Context.user.fullName || HashBrown.Context.user.username) + '"',
        color: 'secondary',
        role: 'navigation-menu',
        icon: 'user',
        options: {
            'User settings': _.onClickUserSettings,
            'Log out': _.onClickLogOut
        }
    }),
    _.if(!state.isDashboard,
        _.popup({
            tooltip: 'Get help',
            color: 'secondary',
            role: 'navigation-menu',
            icon: 'question-circle',
            options: {
                'Content': _.onClickContentHelp,  
                'Media': _.onClickMediaHelp,  
                'Forms': _.onClickFormsHelp,  
                'Connections': _.onClickConnectionsHelp,  
                'Schemas': _.onClickSchemasHelp,  
            }
        })
    )
)
