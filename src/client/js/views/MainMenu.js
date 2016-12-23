'use strict';

class MainMenu extends View {
    constructor(params) {
        super(params);
        
        this.$element = _.div({class: 'main-menu'})

        $('.menuspace').html(this.$element);

        this.fetch();
    }
    
    /**
     * Event: On change language
     */
    onChangeLanguage(e) {
        e.preventDefault();

        localStorage.setItem('language', $(this).text());

        location.reload();
    }

    render() {
        // Find current user
        for(let user of resources.users) {
            if(user.isCurrent) {
                this.user = user;
            }
        }

        // Get selected languages
        LanguageHelper.getSelectedLanguages(ProjectHelper.currentProject)
        .then((languages) => {
            this.languages = languages;

            // Render menu
            _.append(this.$element.empty(),
                // Language picker
                _.if(Array.isArray(this.languages) && this.languages.length > 1,
                    _.div({class: 'main-menu-item dropdown main-menu-language'},
                        _.button({title: 'Language', class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                            _.span({class: 'fa fa-flag'})    
                        ),
                        _.ul({class: 'dropdown-menu'},
                            _.each(this.languages, (i, language) => {
                                return _.li({value: language, class: language == window.language ? 'active': ''},
                                    _.a({href: '#'},
                                        language
                                    ).click(this.onChangeLanguage)
                                );
                            })
                        )
                    )
                ),

                // Dashboard link
                _.div({class: 'main-menu-item'},
                    _.a({title: 'Dashboard', href: '/', class: 'main-menu-dashboard'},
                        _.span({class: 'fa fa-home'})
                    )
                ),

                // User dropdown
                _.div({class: 'main-menu-item main-menu-user dropdown'},
                    _.button({title: 'User', class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                        _.span({class: 'fa fa-user'})
                    ),
                    _.ul({class: 'dropdown-menu'},
                        _.li(
                            _.a({class: 'dropdown-item', href: '#/users/' + this.user.id}, 'User settings')
                        ),
                        _.li(
                            _.a({class: 'dropdown-item', href: '#'}, 'Log out')
                                .click((e) => { e.preventDefault(); logout(); })
                        )
                    )
                )        
            );
        });

    }
}

module.exports = MainMenu;
