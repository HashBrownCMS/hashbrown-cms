'use strict';

const User = require('Common/Models/User');
const UserEditor = require('Client/Views/Editors/UserEditor');
const RequestHelper = require('Client/Helpers/RequestHelper');

/**
 * The main menu
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class MainMenu extends Crisp.View {
    constructor(params) {
        super(params);
        
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

        RequestHelper.reloadResource('content')
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
        $('.page--environment__space--menu').html(this.$element);
    }

    /**
     * Renders this menu
     */
    template() {
        return _.div({class: 'main-menu widget-group'},
            // Language picker
            _.if(Array.isArray(this.languages) && this.languages.length > 1,
                new HashBrown.Views.Widgets.Dropdown({
                    tooltip: 'Language',
                    icon: 'flag',
                    value: window.language,
                    options: this.languages,
                    onChange: (newValue) => {
                        this.onChangeLanguage(newValue);
                    }
                }).$element
            ),

            // User dropdown
            new HashBrown.Views.Widgets.Dropdown({
                tooltip: 'Logged in as "' + (User.current.fullName || User.current.username) + '"',
                icon: 'user',
                reverseKeys: true,
                options: {
                    'User settings': () => { new UserEditor({ hidePermissions: true, model: User.current }); },
                    'Log out': () => {
                        HashBrown.Helpers.RequestHelper.customRequest('post', '/api/user/logout')
                        .then(() => {
                            location = '/';
                        });
                    }
                }
            }).$element,

            // Help
            new HashBrown.Views.Widgets.Dropdown({
                tooltip: 'Get help',
                icon: 'question-circle',
                reverseKeys: true,
                options: {
                    'connections': () => { this.onClickQuestion('connections'); },
                    'content': () => { this.onClickQuestion('content'); },
                    'forms': () => { this.onClickQuestion('forms'); },
                    'media': () => { this.onClickQuestion('media'); },
                    'schemas': () => { this.onClickQuestion('schemas'); },
                    'templates': () => { this.onClickQuestion('templates'); }
                }
            }).$element
        );
    }
}

module.exports = MainMenu;
