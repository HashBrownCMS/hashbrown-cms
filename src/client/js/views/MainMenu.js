'use strict';

class MainMenu extends View {
    constructor(params) {
        super(params);

        // Find current user
        for(let user of resources.users) {
            if(user.isCurrent) {
                this.user = user;
            }
        }

        this.fetch();
    }

    render() {
        this.$element = _.div({class: 'main-menu'},
            _.div({class: 'main-menu-spacer'}),
            _.div({class: 'main-menu-item'},
                _.a({href: '/', class: 'main-menu-dashboard'},
                    _.span({class: 'fa fa-dashboard'}),
                    _.label('dashboard')
                )
            ),
            _.div({class: 'main-menu-item main-menu-user dropdown'},
                _.button({class: 'dropdown-toggle', 'data-toggle': 'dropdown'},
                    _.span({class: 'fa fa-user'}),
                    _.label(this.user.username)
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

        $('.menuspace').html(this.$element);

    }
}

module.exports = MainMenu;
