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
     *
     * @param {String} newLanguage
     */
    onChangeLanguage(newLanguage) {
        localStorage.setItem('language', newLanguage);

        window.language = newLanguage;

        reloadResource('content')
        .then(() => {
            NavbarMain.reload();

            let contentEditor = ViewHelper.get('ContentEditor');

            if(contentEditor) {
                contentEditor.model = null;
                contentEditor.fetch();
            }

            this.fetch();
        });
    }
    
    /**
     * Event: Click question
     */
    onClickQuestion() {
        let path = location.hash.replace('#', '').split('/') ;

        if(!path || path.length < 1) { return; }

        let level1 = path[1];
        let level2 = path[2];

        switch(level1) {
            default:
                UI.messageModal('The help modal', [
                    _.p('To get help for any particular screen, click the <span class="fa fa-question-circle"></span> button to bring up this modal.'),
                    _.p('There\'s nothing worth explaining on this screen, though.')
                ]);
                break;

            case 'content':
                UI.messageModal('Content', [ 
                    _.p('This section contains all of your authored work. The content is a hierarchical tree of nodes that can contain text and media, in simple or complex structures.')
                ]);
                break;

            case 'media':
                UI.messageModal('Media', [
                    _.p('This is a gallery of your statically hosted files, such as images, videos and PDFs.'),
                    _.if(User.current.hasScope('settings'),
                        _.p('The contents of this gallery depends on which Connection has been set up as the Media provider in the <a href="#/settings/providers/">providers settings</a>')
                    )
                ]);
                break;

            case 'forms':
                UI.messageModal('Forms', 'If you need an input form on your website, you can create the model for it here and see a list of the user submitted input.');
                break;

            case 'templates':
                UI.messageModal('Templates', [
                    _.p('This section contains rendering Templates for your authored Content.'),
                    _.if(User.current.hasScope('settings'),
                        _.p('Templates are served through the Connection assigned as the Template provider in the <a href="#/settings/providers/">providers settings</a>.')
                    )
                ]);
                break;

            case 'connections':
                UI.messageModal('Connections', [
                    _.p('Connections are endpoints and resources for your content. Connections can be set up to publish your Content and Media to remote servers.'),
                    _.p('Through the <a href="#/settings/providers/">providers settings</a>, they can also be set up to provide statically hosted media and serve rendering templates.')
                ]);
                break;

            case 'schemas':
                UI.messageModal('Schemas', 'This is a library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and property fields.');
                break;

            case 'users':
                UI.messageModal('Users', 'Here you can add and remove users, edit personal information and scopes and change passwords');
                break;

            case 'settings':
                switch(level2) {
                    case 'sync':
                        UI.messageModal('Sync settings', 'Syncing lets you connect this HashBrown instance to another. When syncing is active, you can pull or push Content, Schemas, Forms and Connections between the local and the remote instance.');
                        break;
                    case 'providers':
                        UI.messageModal('Providers settings', [
                            _.p('Providers are <a href="#/connections/">Connections</a> set up to serve static <a href="#/media/">Media</a> and <a href="#/template/">Templates</a>.'),
                            _.p('For example, when a <a href="#/connections/">Connection</a> is assigned as the <a href="#/media/">Media</a> provider, the images and other content in the <a href="#/media/">Media gallery</a> are pulled from that connection.'),
                            _.p('Similarly, if a <a href="#/connections/">Connection</a> is assigned as the <a href="#/templates/">Template</a> provider, the available <a href="#/templates/">Templates</a> will be pulled from that <a href="#/connections/">Connection</a>.')
                        ]);
                        break;
                    default:
                        UI.messageModal('Settings', 'Here you can edit environment-specific settings');
                        break;
                }

                break;
        }
    }

    render() {
        // Find current user
        for(let user of resources.users) {
            if(user.isCurrent) {
                this.user = user;
            }
        }

        // Render menu
        this.languages = LanguageHelper.selectedLanguages || [];

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
                                _.button(
                                    language
                                ).click(() => { this.onChangeLanguage(language); })
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
                            .click((e) => { e.preventDefault(); new UserEditor({ hidePermissions: true, model: User.current }); })
                    ),
                    _.li(
                        _.form({class: 'dropdown-item', action: '/api/user/logout', method: 'POST'},
                            _.input({type: 'submit', value: 'Log out'})
                        )
                    )
                )
            ),

            // Help
            _.div({class: 'main-menu-item'},
                _.button({title: 'Help', class: 'main-menu-help'},
                    _.span({class: 'fa fa-question-circle'})
                ).click(() => { this.onClickQuestion(); })
            )
        );
    }
}

module.exports = MainMenu;
