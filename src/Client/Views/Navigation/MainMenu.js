'use strict';

/**
 * The main menu
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class MainMenu extends Crisp.View {
    constructor(params) {
        super(params);
        
        this.fetch();
        
        $('.page--environment__space--menu').html(this.$element);
    }
    
    /**
     * Event: On change language
     *
     * @param {String} newLanguage
     */
    onChangeLanguage(newLanguage) {
        localStorage.setItem('language', newLanguage);

        window.language = newLanguage;

        HashBrown.Helpers.RequestHelper.reloadResource('content')
        .then(() => {
            HashBrown.Views.Navigation.NavbarMain.reload();

            let contentEditor = Crisp.View.get('ContentEditor');

            if(contentEditor) {
                contentEditor.model = null;
                contentEditor.fetch();
            }

            this.fetch();
        });
    }
    
    /**
     * Event: Click question
     *
     * @param {String} topic
     */
    onClickQuestion(topic) {
        switch(topic) {
            case 'content':
                let modal = UI.messageModal('Content', [ 
                    _.p('This section contains all of your authored work. The content is a hierarchical tree of nodes that can contain text and media, in simple or complex structures.')
                ]);
                break;

            case 'media':
                UI.messageModal('Media', [
                    _.p('This is a gallery of your statically hosted files, such as images, videos and PDFs.'),
                    _.p('The contents of this gallery depends on which <a href="#/connections">Connection</a> has been set up as the Media provider')
                ]);
                break;

            case 'forms':
                UI.messageModal('Forms', 'If you need an input form on your website, you can create the model for it here and see a list of the user submitted input.');
                break;

            case 'connections':
                UI.messageModal('Connections', [
                    _.p('Connections are endpoints and resources for your content. Connections can be set up to publish your Content and Media to remote servers.'),
                    _.p('They can also be set up to provide statically hosted media.')
                ]);
                break;

            case 'schemas':
                UI.messageModal('Schemas', 'This is a library of content structures. Here you define how your editable content looks and behaves. You can define schemas for both content nodes and property fields.');
                break;
        }
    }

    /**
     * Pre render
     */
    prerender() {
        this.languages = HashBrown.Helpers.LanguageHelper.getLanguagesSync() || [];
    }

    /**
     * Post render
     */
    postrender() {
        this.languageDropdown.notify(window.language);
    }

    /**
     * Renders this menu
     */
    template() {
        return _.div({class: 'main-menu widget-group'},
            // Language picker
            _.if(Array.isArray(this.languages) && this.languages.length > 1,
                this.languageDropdown = new HashBrown.Views.Widgets.Dropdown({
                    tooltip: 'Language',
                    icon: 'flag',
                    value: window.language,
                    options: this.languages,
                    onChange: (newValue) => {
                        this.onChangeLanguage(newValue);
                    }
                })
            ),

            // User dropdown
            this.userDropdown = new HashBrown.Views.Widgets.Dropdown({
                tooltip: 'Logged in as "' + (HashBrown.Models.User.current.fullName || HashBrown.Models.User.current.username) + '"',
                icon: 'user',
                reverseKeys: true,
                options: {
                    'User settings': () => { new HashBrown.Views.Editors.UserEditor({ hidePermissions: true, model: HashBrown.Models.User.current }); },
                    'Log out': () => {
                        HashBrown.Helpers.RequestHelper.customRequest('post', '/api/user/logout')
                        .then(() => {
                            location = '/';
                        });
                    }
                }
            }),

            // Help
            this.helpDropdown = new HashBrown.Views.Widgets.Dropdown({
                tooltip: 'Get help',
                icon: 'question-circle',
                reverseKeys: true,
                options: {
                    'Connections': () => { this.onClickQuestion('connections'); },
                    'Content': () => { this.onClickQuestion('content'); },
                    'Forms': () => { this.onClickQuestion('forms'); },
                    'Media': () => { this.onClickQuestion('media'); },
                    'Schemas': () => { this.onClickQuestion('schemas'); }
                }
            })
        );
    }
}

module.exports = MainMenu;
